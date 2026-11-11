/* 相机参数实验室 · 成像管线
 * 场景（线性 HDR）→ 镜头（景深、畸变、暗角、滤镜）→ 传感器（曝光、散粒噪声、饱和截断）
 * → 机内处理（白平衡、色调曲线、照片风格）→ sRGB。
 * 实时取景每帧走一遍；按下快门时把整个曝光时间切成若干子帧逐帧渲染并累加，
 * 于是运动模糊、车灯轨迹、手抖和追焦都由真实的「时间积分」得到。
 */
(function () {
  'use strict';
  const CL = window.CL;

  const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
  const COMMON = `
    float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    float gauss(vec2 p){ float u1 = max(hash12(p), 1e-6); float u2 = hash12(p + 17.17); return sqrt(-2.0 * log(u1)) * cos(6.2831853 * u2); }
    float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
  `;

  // 弥散圆半径（像素）：所有景深相关的着色器共用
  const COC = `
    uniform sampler2D tDepth;
    uniform vec2 uRes;
    uniform float uNear, uFar, uFocus, uFocal, uApD, uSensorW, uMaxR, uMinBlur;
    float viewZ(vec2 uv){ float d = texture2D(tDepth, uv).x; float z = d * 2.0 - 1.0; return 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear)); }
    float cocR(float D){
      float Dm = D * 1000.0, S = uFocus * 1000.0;
      float c = uApD * uFocal * abs(Dm - S) / (Dm * max(S - uFocal, 1.0));
      return min(max(0.5 * c / uSensorW * uRes.x, uMinBlur), uMaxR);
    }
  `;
  // 第一步：每 16×16 像素一块，求块内最大弥散圆
  const TILE_FS = `
    ${COC}
    uniform vec2 uTiles; varying vec2 vUv;
    void main(){
      vec2 t0 = floor(vUv * uTiles) / uTiles;
      float m = 0.0;
      for (int y = 0; y < 4; y++) for (int x = 0; x < 4; x++) m = max(m, cocR(viewZ(t0 + (vec2(float(x), float(y)) + 0.5) / 4.0 / uTiles)));
      gl_FragColor = vec4(m, 0.0, 0.0, 1.0);
    }`;
  // 第二步：向四周扩散——别处的大光斑可能盖到这里
  const DILATE_FS = `
    uniform sampler2D tTile; uniform vec2 uTiles; uniform float uMaxR; varying vec2 vUv;
    void main(){
      float m = texture2D(tTile, vUv).r;
      float rad = ceil(uMaxR / 16.0);
      for (int y = -6; y <= 6; y++) for (int x = -6; x <= 6; x++) {
        vec2 o = vec2(float(x), float(y));
        if (abs(o.x) > rad || abs(o.y) > rad) continue;
        float v = texture2D(tTile, vUv + o / uTiles).r;
        if (v >= max(length(o) - 1.0, 0.0) * 16.0) m = max(m, v);
      }
      gl_FragColor = vec4(m, 0.0, 0.0, 1.0);
    }`;

  const POST_FS = `
    precision highp float;
    uniform sampler2D tColor, tTileD;
    uniform float uBudget, uBlades, uRound, uBladeRot;
    uniform float uGain, uGnd, uCpl, uVig, uDist, uClip, uSeed, uNR, uSharp, uZebra, uPeak, uTime;
    uniform vec3 uWB, uNoise;
    uniform vec4 uStyle;
    varying vec2 vUv;
    ${COMMON}
    ${COC}
    float shapeR(float a){
      float seg = 6.2831853 / uBlades;
      float x = mod(a - uBladeRot, seg) - seg * 0.5;
      return mix(cos(3.14159265 / uBlades) / cos(x), 1.0, uRound);
    }
    float acesF(float x){ return (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14); }
    float tone(float x){ return clamp(acesF(x * 0.7) / acesF(uClip * 0.7), 0.0, 1.0); }
    vec3 srgb(vec3 c){ return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
    void main(){
      vec2 uv = vUv;
      float asp = uRes.x / uRes.y;
      vec2 cc = (uv - 0.5) * vec2(asp, 1.0);
      float r2 = dot(cc, cc) / (0.25 * (asp * asp + 1.0));
      vec2 uvd = clamp(0.5 + (uv - 0.5) * (1.0 + uDist * r2), vec2(0.0005), vec2(0.9995));
      float cz = viewZ(uvd);
      float cr = cocR(cz);
      vec3 col = textureLod(tColor, uvd, 0.0).rgb;
      // 散景：按本像素附近可能出现的最大光斑决定采样范围，金角螺旋均匀铺满圆盘
      float R = max(texture2D(tTileD, uvd).r, cr);
      if (R > 0.75) {
        float stp = max(0.5, R * R / (2.0 * uBudget));
        float lod = max(0.0, log2(sqrt(6.2831853 * stp)) - 0.6);
        float tot = 1.0, radius = max(0.5, sqrt(stp) * 0.8);
        float ang = hash12(gl_FragCoord.xy + uSeed) * 6.2831853;
        for (int i = 0; i < 1600; i++) {
          if (radius >= R + 0.5) break;
          vec2 tc = uvd + vec2(cos(ang), sin(ang)) * radius / uRes;
          vec3 sc = textureLod(tColor, tc, lod).rgb;
          float sz = viewZ(tc);
          float sr = cocR(sz);
          if (sz > cz) sr = min(sr, cr * 2.0);
          float m = smoothstep(radius - 0.5, radius + 0.5, sr * shapeR(ang));
          col += mix(col / tot, sc, m);
          tot += 1.0;
          ang += 2.39996323;
          radius += stp / radius;
        }
        col /= tot;
      }
      if (uSharp > 0.0) {
        vec3 bl = textureLod(tColor, uvd, 1.2).rgb;
        col = max(col + (col - bl) * uSharp * (1.0 - smoothstep(0.6, 1.6, cr)), 0.0);
      }
      float g = uGain;
      if (uGnd > 0.0) g *= mix(1.0, exp2(-uGnd), smoothstep(0.4, 0.62, uv.y));
      vec3 X = col * g / pow(1.0 + uVig * r2, 2.0);
      if (uCpl > 0.0) {
        float sky = smoothstep(1500.0, 2400.0, cz);
        float l = lum(X);
        X = mix(X, max(mix(vec3(l), X, 1.45), 0.0) * 0.55, sky);
      }
      if (uNoise.z > 0.0) {
        vec2 fc = gl_FragCoord.xy + uSeed * 37.0;
        vec3 n = vec3(gauss(fc), gauss(fc + 71.3), gauss(fc + 143.9));
        n = mix(n, vec3(gauss(fc + 211.7)), 0.3 + 0.65 * uNR);
        vec3 e = max(X, 0.0) * uNoise.x;
        vec3 sig = sqrt(e + uNoise.y * uNoise.y) / uNoise.x;
        X += n * sig * uNoise.z * (1.0 - 0.55 * uNR);
      }
      X = clamp(X, 0.0, uClip);
      X = min(X * uWB, vec3(uClip));
      vec3 y;
      if (uStyle.w > 0.5) {
        vec3 w = uStyle.w > 1.5 ? vec3(0.74, 0.23, 0.03) : vec3(0.2126, 0.7152, 0.0722);
        y = vec3(tone(dot(X, w)));
      } else {
        y = vec3(tone(X.r), tone(X.g), tone(X.b));
        y = max(mix(vec3(lum(y)), y, uStyle.y), 0.0);
      }
      y = srgb(clamp(y, 0.0, 1.0));
      y = clamp(y + uStyle.x * (y * y * (3.0 - 2.0 * y) - y) * 2.0, 0.0, 1.0);
      y.r += uStyle.z; y.b -= uStyle.z;
      if (uZebra > 0.5 && max(max(y.r, y.g), y.b) > 0.985) {
        if (fract((gl_FragCoord.x + gl_FragCoord.y - uTime * 40.0) / 12.0) < 0.5) y = mix(y, vec3(0.04), 0.8);
      }
      if (uPeak > 0.5 && cr < 1.2) {
        vec2 px = 1.0 / uRes;
        float l0 = lum(col);
        float e = abs(lum(textureLod(tColor, uvd + vec2(px.x, 0.0), 0.0).rgb) - lum(textureLod(tColor, uvd - vec2(px.x, 0.0), 0.0).rgb))
                + abs(lum(textureLod(tColor, uvd + vec2(0.0, px.y), 0.0).rgb) - lum(textureLod(tColor, uvd - vec2(0.0, px.y), 0.0).rgb));
        if (e / (l0 + 0.03) > 0.55) y = mix(y, vec3(1.0, 0.16, 0.1), 0.92);
      }
      gl_FragColor = vec4(clamp(y, 0.0, 1.0), 1.0);
    }`;

  const ACC_FS = `
    uniform sampler2D tPrev, tSrc; uniform float uW, uMaskY; varying vec2 vUv;
    void main(){
      float m = uMaskY >= 1.0 ? 1.0 : smoothstep(1.0 - uMaskY - 0.015, 1.0 - uMaskY + 0.015, vUv.y);
      gl_FragColor = vec4(texture2D(tPrev, vUv).rgb + texture2D(tSrc, vUv).rgb * uW * m, 1.0);
    }`;
  const COPY_FS = `uniform sampler2D tSrc; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv); }`;
  const METER_FS = `
    uniform sampler2D tSrc; uniform vec2 uOut; uniform float uLod, uGain, uGnd; varying vec2 vUv;
    void main(){
      vec3 s = vec3(0.0);
      for (int y = 0; y < 4; y++) for (int x = 0; x < 4; x++) {
        vec2 o = (vec2(float(x), float(y)) - 1.5) / 4.0 / uOut;
        s += textureLod(tSrc, vUv + o, uLod).rgb;
      }
      s /= 16.0;
      float g = uGain;
      if (uGnd > 0.0) g *= mix(1.0, exp2(-uGnd), smoothstep(0.4, 0.62, vUv.y));
      s *= g;
      gl_FragColor = vec4(clamp((log2(max(s, vec3(1e-7))) + 14.0) / 20.0, 0.0, 1.0), 1.0);
    }`;
  const HIST_FS = `
    uniform sampler2D tSrc; uniform vec2 uOut; varying vec2 vUv;
    void main(){
      vec2 o = 0.25 / uOut;
      vec3 s = texture2D(tSrc, vUv + vec2(-o.x, -o.y)).rgb + texture2D(tSrc, vUv + vec2(o.x, -o.y)).rgb + texture2D(tSrc, vUv + vec2(-o.x, o.y)).rgb + texture2D(tSrc, vUv + o).rgb;
      gl_FragColor = vec4(s * 0.25, 1.0);
    }`;

  CL.createPipeline = function (renderer, world) {
    const gl = renderer.getContext();
    const floatOK = renderer.capabilities.isWebGL2 && !!renderer.extensions.get('EXT_color_buffer_float');
    const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fsScene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false; fsScene.add(quad);
    const mk = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false });

    const cocU = () => ({ tDepth: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uNear: { value: 0.05 }, uFar: { value: 3000 }, uFocus: { value: 5 }, uFocal: { value: 35 }, uApD: { value: 10 }, uSensorW: { value: 36 }, uMaxR: { value: 0 }, uMinBlur: { value: 0 } });
    const tileMat = mk(TILE_FS, Object.assign(cocU(), { uTiles: { value: new THREE.Vector2(1, 1) } }));
    const dilMat = mk(DILATE_FS, { tTile: { value: null }, uTiles: { value: new THREE.Vector2(1, 1) }, uMaxR: { value: 0 } });
    const postMat = mk(POST_FS, Object.assign(cocU(), {
      tColor: { value: null }, tTileD: { value: null }, uBudget: { value: 150 }, uBlades: { value: 9 }, uRound: { value: 0.7 }, uBladeRot: { value: 0.3 },
      uGain: { value: 1 }, uGnd: { value: 0 }, uCpl: { value: 0 }, uVig: { value: 0 }, uDist: { value: 0 }, uClip: { value: CL.CLIP },
      uSeed: { value: 0 }, uNR: { value: 0.3 }, uSharp: { value: 0.3 }, uZebra: { value: 0 }, uPeak: { value: 0 }, uTime: { value: 0 },
      uWB: { value: new THREE.Vector3(1, 1, 1) }, uNoise: { value: new THREE.Vector3(1000, 3, 1) }, uStyle: { value: new THREE.Vector4(0.1, 1.1, 0, 0) },
    }));
    const accMat = mk(ACC_FS, { tPrev: { value: null }, tSrc: { value: null }, uW: { value: 1 }, uMaskY: { value: 1 } });
    const copyMat = mk(COPY_FS, { tSrc: { value: null } });
    const meterMat = mk(METER_FS, { tSrc: { value: null }, uOut: { value: new THREE.Vector2(48, 32) }, uLod: { value: 0 }, uGain: { value: 1 }, uGnd: { value: 0 } });
    const histMat = mk(HIST_FS, { tSrc: { value: null }, uOut: { value: new THREE.Vector2(240, 160) } });

    function sceneRT(w, h, mips) {
      const rt = new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true,
        minFilter: mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: !!mips,
      });
      rt.depthTexture = new THREE.DepthTexture(w, h);
      rt.depthTexture.type = THREE.UnsignedIntType;
      return rt;
    }
    function colorRT(w, h, type, mips) {
      return new THREE.WebGLRenderTarget(w, h, { type, format: THREE.RGBAFormat, depthBuffer: false, minFilter: mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: !!mips });
    }
    const P = { floatOK };
    let rtScene = null, rtOut = null, liveW = 0, liveH = 0;
    const MW = 48, MH = 32, HW = 240;
    let HH = 160;
    const rtMeter = colorRT(MW, MH, THREE.UnsignedByteType, false);
    let rtHist = colorRT(HW, HH, THREE.UnsignedByteType, false);
    const meterBuf = new Uint8Array(MW * MH * 4);
    let histBuf = new Uint8Array(HW * HH * 4);

    function pass(mat, target) { quad.material = mat; renderer.setRenderTarget(target); renderer.render(fsScene, fsCam); }

    P.setLiveSize = function (w, h) {
      if (w === liveW && h === liveH) return;
      liveW = w; liveH = h;
      if (rtScene) { rtScene.dispose(); rtOut.dispose(); }
      rtScene = sceneRT(w, h, true);
      rtOut = colorRT(w, h, THREE.UnsignedByteType, false);
      const hh = Math.max(8, Math.round((HW * h) / w));
      if (hh !== HH) { HH = hh; rtHist.dispose(); rtHist = colorRT(HW, HH, THREE.UnsignedByteType, false); histBuf = new Uint8Array(HW * HH * 4); histMat.uniforms.uOut.value.set(HW, HH); }
    };
    P.liveSize = () => [liveW, liveH];

    /* 景深：先算每块的最大弥散圆，再扩散，最后逐像素按需采样 */
    const tiles = {};
    function tileRTs(w, h) {
      const k = w + 'x' + h;
      if (!tiles[k]) {
        const tw = Math.ceil(w / 16), th = Math.ceil(h / 16);
        const o = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false };
        tiles[k] = { tw, th, a: new THREE.WebGLRenderTarget(tw, th, o), b: new THREE.WebGLRenderTarget(tw, th, o) };
      }
      return tiles[k];
    }
    function cocUniforms(u, o, w, h, cam, depthTex) {
      const f = o.focal, N = o.N, S = Math.max(o.focus * 1000, f * 1.05);
      u.tDepth.value = depthTex; u.uRes.value.set(w, h); u.uNear.value = cam.near; u.uFar.value = cam.far;
      u.uFocus.value = S / 1000; u.uFocal.value = f; u.uApD.value = f / N; u.uSensorW.value = o.sensorW;
      u.uMaxR.value = 0.055 * w; u.uMinBlur.value = o.minBlur * (w / 1200);
    }
    function dofPasses(o, w, h, cam, depthTex) {
      const T = tileRTs(w, h);
      cocUniforms(tileMat.uniforms, o, w, h, cam, depthTex);
      tileMat.uniforms.uTiles.value.set(T.tw, T.th);
      pass(tileMat, T.a);
      dilMat.uniforms.tTile.value = T.a.texture; dilMat.uniforms.uTiles.value.set(T.tw, T.th); dilMat.uniforms.uMaxR.value = 0.055 * w;
      pass(dilMat, T.b);
      cocUniforms(postMat.uniforms, o, w, h, cam, depthTex);
      postMat.uniforms.tTileD.value = T.b.texture;
    }
    function setPost(o, w, h, budget) {
      const u = postMat.uniforms;
      u.uBudget.value = budget;
      u.uBlades.value = o.blades; u.uRound.value = o.round; u.uBladeRot.value = o.bladeRot || 0.3;
      u.uGain.value = o.gain; u.uGnd.value = o.gnd || 0; u.uCpl.value = o.cpl ? 1 : 0;
      u.uVig.value = o.vig; u.uDist.value = o.dist; u.uWB.value.set(...o.wb);
      u.uNoise.value.set(o.ePerX, o.readE, o.noise ? 1 : 0); u.uNR.value = o.nr; u.uSharp.value = o.sharp;
      u.uStyle.value.set(o.style.contrast, o.style.sat, o.style.warm || 0, o.style.mono || 0);
      u.uZebra.value = o.zebra ? 1 : 0; u.uPeak.value = o.peak ? 1 : 0; u.uTime.value = o.time;
      u.uSeed.value = o.seed;
    }

    /* 实时取景 */
    P.renderLive = function (cam, o) {
      world.setPointScale(liveH, (cam.fov * Math.PI) / 180);
      renderer.setRenderTarget(rtScene);
      renderer.render(world.scene, cam);
      dofPasses(o, liveW, liveH, cam, rtScene.depthTexture);
      postMat.uniforms.tColor.value = rtScene.texture;
      setPost(o, liveW, liveH, o.budget || 150);
      pass(postMat, rtOut);
      copyMat.uniforms.tSrc.value = rtOut.texture;
      renderer.setRenderTarget(null);
      renderer.setViewport(0, 0, o.canvasW, o.canvasH);
      quad.material = copyMat; renderer.render(fsScene, fsCam);
    };

    /* 测光：把场景亮度（含预设增益和滤镜）缩成 48×32 的对数图读回 CPU */
    P.meter = function (gain, gnd, src) {
      const tex = src || rtScene;
      const u = meterMat.uniforms;
      u.tSrc.value = tex.texture; u.uGain.value = gain; u.uGnd.value = gnd || 0;
      u.uLod.value = Math.max(0, Math.log2(tex.width / (MW * 4)));
      pass(meterMat, rtMeter);
      renderer.readRenderTargetPixels(rtMeter, 0, 0, MW, MH, meterBuf);
      const out = new Float32Array(MW * MH * 3);
      for (let i = 0; i < MW * MH; i++) for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.pow(2, (meterBuf[i * 4 + c] / 255) * 20 - 14);
      return { w: MW, h: MH, rgb: out };
    };
    // 只渲染场景（不做后期），供标定与预闪测光使用
    P.renderSceneOnly = function (cam) {
      world.setPointScale(liveH, (cam.fov * Math.PI) / 180);
      renderer.setRenderTarget(rtScene);
      renderer.render(world.scene, cam);
    };

    /* 直方图：读回 240 像素宽的成片缩略图 */
    P.readHist = function (src) {
      histMat.uniforms.tSrc.value = (src || rtOut).texture;
      pass(histMat, rtHist);
      renderer.readRenderTargetPixels(rtHist, 0, 0, HW, HH, histBuf);
      return { w: HW, h: HH, data: histBuf };
    };

    /* ---------------- 拍摄：多子帧时间积分 ---------------- */
    let cap = null;
    function ensureCap(w, h) {
      if (cap && cap.w === w && cap.h === h) return cap;
      if (cap) Object.values(cap).forEach((v) => v && v.dispose && v.dispose());
      const accType = floatOK ? THREE.FloatType : THREE.HalfFloatType;
      cap = { w, h, scene: sceneRT(w, h, false), a: colorRT(w, h, accType, false), b: colorRT(w, h, accType, false), color: colorRT(w, h, THREE.HalfFloatType, true), out: colorRT(w, h, THREE.UnsignedByteType, false) };
      return cap;
    }
    const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

    P.capture = async function (cam, o, plan, onProgress) {
      const W = plan.w, H = plan.h;
      const C = ensureCap(W, H);
      world.setPointScale(H, (cam.fov * Math.PI) / 180);
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(C.a); renderer.clear(true, false, false);
      let src = C.a, dst = C.b;
      const K = plan.K;
      const order = [];
      const mid = Math.floor(K / 2);
      for (let k = 0; k < K; k++) if (k !== mid) order.push(k);
      const accumulate = (w, mask) => {
        accMat.uniforms.tPrev.value = src.texture; accMat.uniforms.tSrc.value = C.scene.texture;
        accMat.uniforms.uW.value = w; accMat.uniforms.uMaskY.value = mask == null ? 1 : mask;
        pass(accMat, dst);
        const t = src; src = dst; dst = t;
      };
      const renderAt = (frac) => {
        world.update(plan.t0 + frac * plan.t);
        plan.pose(cam, frac);
        renderer.setRenderTarget(C.scene);
        renderer.render(world.scene, cam);
      };
      world.setStreak(plan.t / K);
      let done = 0;
      const t0 = performance.now();
      for (const k of order) {
        renderAt((k + 0.5) / K);
        accumulate(1 / K);
        done++;
        if (performance.now() - t0 > 0 && done % plan.batch === 0) { onProgress && onProgress(done / (K + 1)); await nextFrame(); }
      }
      world.setStreak(0);
      if (plan.flash) {
        const fr = plan.flash.at === 'rear' ? 0.999 : 0.001;
        world.update(plan.t0 + fr * plan.t); plan.pose(cam, fr);
        world.setFlashOnly(true, plan.flash.pos(cam));
        renderer.setRenderTarget(C.scene); renderer.render(world.scene, cam);
        world.setFlashOnly(false);
        accumulate(plan.flash.w, plan.flash.mask);
      }
      world.setStreak(plan.t / K);
      renderAt((mid + 0.5) / K);
      accumulate(1 / K);
      world.setStreak(0);
      copyMat.uniforms.tSrc.value = src.texture;
      pass(copyMat, C.color);
      dofPasses(o, W, H, cam, C.scene.depthTexture);
      postMat.uniforms.tColor.value = C.color.texture;
      setPost(o, W, H, plan.budget || 520);
      pass(postMat, C.out);
      onProgress && onProgress(1);
      const buf = new Uint8Array(W * H * 4);
      renderer.readRenderTargetPixels(C.out, 0, 0, W, H, buf);
      const hist = P.readHist(C.out);
      renderer.setRenderTarget(null);
      // 翻转 Y，写入 2D 画布
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const g = cv.getContext('2d');
      const img = g.createImageData(W, H);
      const row = W * 4;
      for (let y = 0; y < H; y++) img.data.set(buf.subarray((H - 1 - y) * row, (H - y) * row), y * row);
      g.putImageData(img, 0, 0);
      return { canvas: cv, pixels: img.data, w: W, h: H, hist: { w: hist.w, h: hist.h, data: hist.data.slice() } };
    };
    P.gl = gl;
    return P;
  };
})();
