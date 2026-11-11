/* 相机参数实验室 · 被拍摄的三维街角
 * 单位：米。摄影者默认站在 (0, 1.6, 0) 向 −z 方向看。
 * 从近到远：花坛与风车（约 2 m）→ 色卡（4.6 m）→ 红色自行车（5.7 m）→ 咖啡桌（7.5 m）
 * → 挂满小灯的绿篱（9 m）→ 喷泉（12 m）→ 车道与骑车人（15–20 m）→ 街对面楼房（26 m+）
 * → 钟楼（240 m）→ 远山 → 月亮。
 */
(function () {
  'use strict';
  const CL = window.CL;

  /* ---------- 小工具 ---------- */
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function canvasTex(w, h, draw, opts) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); draw(g, w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = (opts && opts.linear) ? THREE.LinearEncoding : THREE.sRGBEncoding;
    t.anisotropy = 8;
    if (opts && opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
    return t;
  }
  function noiseFill(g, w, h, amount, r) {
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amount; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
  }
  const UP = new THREE.Vector3(0, 1, 0);
  function tube(a, b, r, mat, seg) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const len = A.distanceTo(B);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg || 10), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
    return m;
  }
  function std(color, rough, metal, extra) {
    return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough == null ? 0.8 : rough, metalness: metal || 0 }, extra || {}));
  }
  function shadowAll(o, cast, recv) { o.traverse((m) => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); }
  function tag(o, name) { o.userData.subject = name; return o; }

  /* ---------- 纹理 ---------- */
  function pavingTex() {
    const r = rng(7);
    return canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#6a635a'; g.fillRect(0, 0, w, h);
      const rowH = 64;
      for (let y = 0; y < h; y += rowH) {
        let x = (y / rowH) % 2 ? -60 : 0;
        while (x < w) {
          const sw = 90 + r() * 70;
          const l = 52 + r() * 16, s = 6 + r() * 10, hu = 28 + r() * 16;
          g.fillStyle = `hsl(${hu},${s}%,${l}%)`;
          g.fillRect(x + 3, y + 3, sw - 6, rowH - 6);
          g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 3, y + 3, sw - 6, 4);
          x += sw;
        }
      }
      noiseFill(g, w, h, 22, r);
    }, { repeat: [16, 10] });
  }
  function asphaltTex() {
    const r = rng(11);
    return canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#3a3b3d'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) { const v = 40 + r() * 50; g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(r() * w, r() * h, 1.5, 1.5); }
      noiseFill(g, w, h, 14, r);
    }, { repeat: [80, 2] });
  }
  function grassTex() {
    const r = rng(5);
    return canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#4c6a33'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 14000; i++) { g.fillStyle = `hsl(${80 + r() * 30},${30 + r() * 25}%,${22 + r() * 22}%)`; g.fillRect(r() * w, r() * h, 1.2, 3 + r() * 3); }
    }, { repeat: [400, 400] });
  }
  function leafTex() {
    const r = rng(9);
    return canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#2f4a22'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) {
        g.fillStyle = `hsl(${85 + r() * 35},${35 + r() * 25}%,${16 + r() * 26}%)`;
        g.beginPath(); g.ellipse(r() * w, r() * h, 3 + r() * 5, 2 + r() * 3, r() * 3, 0, 7); g.fill();
      }
    }, { repeat: [4, 1] });
  }
  // 楼房立面：返回 { map, emissive }
  function facadeTex(seed, wall, cols, rows, opt) {
    opt = opt || {};
    const r = rng(seed);
    const W = 512, H = 1024;
    const lit = [];
    const map = canvasTex(W, H, (g) => {
      g.fillStyle = wall; g.fillRect(0, 0, W, H);
      noiseFill(g, W, H, 10, r);
      const top = 40, shop = opt.shop ? 150 : 0;
      const cw = W / cols, rh = (H - top - shop) / rows;
      g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, W, 14);
      for (let y = 0; y < rows; y++) {
        g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, top + y * rh + rh - 6, W, 4);
        for (let x = 0; x < cols; x++) {
          const wx = x * cw + cw * 0.22, wy = top + y * rh + rh * 0.18, ww = cw * 0.56, wh = rh * 0.6;
          g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(wx - 3, wy - 3, ww + 6, wh + 6);
          const k = 24 + r() * 26; g.fillStyle = `rgb(${k},${k + 6},${k + 14})`; g.fillRect(wx, wy, ww, wh);
          g.fillStyle = 'rgba(160,190,220,.18)'; g.fillRect(wx, wy, ww, wh * 0.45);
          g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(wx + ww / 2 - 1, wy, 2, wh);
          if (opt.sill) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(wx - 6, wy + wh + 2, ww + 12, 6); }
          lit.push([wx, wy, ww, wh, r()]);
        }
      }
      if (shop) {
        g.fillStyle = 'rgba(20,18,16,.85)'; g.fillRect(0, H - shop, W, shop);
        g.fillStyle = opt.awning || '#7a2b22'; g.fillRect(0, H - shop, W, 26);
        for (let x = 10; x < W; x += 120) { g.fillStyle = '#2b2a2a'; g.fillRect(x, H - shop + 40, 100, shop - 44); g.fillStyle = 'rgba(200,220,240,.12)'; g.fillRect(x + 4, H - shop + 44, 92, shop - 52); }
      }
    });
    const emissive = canvasTex(W, H, (g) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      lit.forEach(([x, y, w, h, q]) => {
        if (q < (opt.litFrac || 0.45)) { const warm = q < 0.3; g.fillStyle = warm ? `rgb(255,${170 + q * 120},${90 + q * 150})` : 'rgb(190,215,255)'; g.globalAlpha = 0.55 + q; g.fillRect(x, y, w, h); g.globalAlpha = 1; }
      });
      if (opt.shop) { for (let x = 10; x < W; x += 120) { g.fillStyle = 'rgb(255,200,140)'; g.fillRect(x + 4, H - 150 + 44, 92, 98); } }
    });
    return { map, emissive };
  }
  function chartTex() {
    const P = [[115, 82, 68], [194, 150, 130], [98, 122, 157], [87, 108, 67], [133, 128, 177], [103, 189, 170], [214, 126, 44], [80, 91, 166], [193, 90, 99], [94, 60, 108], [157, 188, 64], [224, 163, 46], [56, 61, 150], [70, 148, 73], [175, 54, 60], [231, 199, 31], [187, 86, 149], [8, 133, 161], [243, 243, 242], [200, 200, 200], [160, 160, 160], [122, 122, 121], [85, 85, 85], [52, 52, 52]];
    return canvasTex(768, 512, (g, w, h) => {
      g.fillStyle = '#141414'; g.fillRect(0, 0, w, h);
      const pw = 104, gap = 12, ox = (w - 6 * pw - 5 * gap) / 2, oy = 44;
      P.forEach((c, i) => { const x = ox + (i % 6) * (pw + gap), y = oy + Math.floor(i / 6) * (pw + gap); g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; g.fillRect(x, y, pw, pw); });
      g.fillStyle = '#d8d8d8'; g.font = '600 20px sans-serif'; g.fillText('24 色标准色卡 · 第 22 格 ≈ 18% 中灰', ox, 30);
    });
  }
  function clockTex() {
    return canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#7a6d5b'; g.fillRect(0, 0, w, w);
      g.fillStyle = '#efe8d6'; g.beginPath(); g.arc(128, 128, 104, 0, 7); g.fill();
      g.strokeStyle = '#2a2622'; g.lineWidth = 6; g.stroke();
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; g.lineWidth = k % 3 ? 4 : 9; g.beginPath(); g.moveTo(128 + Math.sin(a) * 84, 128 - Math.cos(a) * 84); g.lineTo(128 + Math.sin(a) * 98, 128 - Math.cos(a) * 98); g.stroke(); }
      g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + 50, 128 + 20); g.stroke();
      g.lineWidth = 6; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 - 10, 128 - 80); g.stroke();
    });
  }
  function moonTex() {
    const r = rng(42);
    return canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, w);
      g.save(); g.beginPath(); g.arc(256, 256, 250, 0, 7); g.clip();
      g.fillStyle = '#c9c6bf'; g.fillRect(0, 0, w, w);
      [[180, 190, 90], [300, 160, 70], [330, 280, 80], [210, 300, 60], [140, 260, 40], [260, 230, 50]].forEach(([x, y, rad]) => {
        const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(70,70,72,.55)'); gr.addColorStop(1, 'rgba(70,70,72,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w);
      });
      for (let i = 0; i < 260; i++) {
        const x = r() * w, y = r() * w, rad = Math.pow(r(), 3) * 26 + 2;
        g.fillStyle = 'rgba(60,60,60,.28)'; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.arc(x - rad * 0.25, y - rad * 0.25, rad * 0.8, 0, 7); g.fill();
      }
      g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(260, 420, 10, 0, 7); g.fill();
      noiseFill(g, w, w, 18, r);
      g.restore();
    });
  }
  function neonTex() {
    return canvasTex(512, 128, (g, w, h) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
      g.font = '900 84px "Noto Sans SC", "PingFang SC", sans-serif'; g.textBaseline = 'middle';
      g.fillStyle = '#ff5a4a'; g.fillText('照相馆', 18, h / 2 + 4);
      g.font = '600 46px sans-serif'; g.fillStyle = '#7fe7ff'; g.fillText('PHOTO', 300, h / 2 + 4);
    });
  }
  function stripeTex() {
    return canvasTex(256, 32, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#f1ece2' : '#2f6f6a'; g.fillRect((i * w) / 16, 0, w / 16 + 1, h); } });
  }

  /* ---------- 天空 ---------- */
  const SKY_VS = `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; }`;
  const SKY_FS = `
    uniform vec3 uZenith, uHorizon, uGround, uSunDir, uSunColor, uCloudCol;
    uniform float uSunDisc, uSunGlow, uCloud, uTime;
    varying vec3 vDir;
    float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n2(p); p=p*2.03+vec2(1.7,9.2); a*=0.5;} return s; }
    void main(){
      vec3 d = normalize(vDir);
      float y = d.y;
      vec3 col = mix(uHorizon, uZenith, pow(clamp(y,0.0,1.0), 0.55));
      col = mix(col, uGround, smoothstep(0.0, -0.08, y));
      float c = max(dot(d, uSunDir), 0.0);
      col += uSunColor * (uSunGlow * pow(c, 8.0) * 0.6 + uSunGlow * pow(c, 64.0) * 1.6);
      if (uCloud > 0.0 && y > 0.0) {
        vec2 p = d.xz / (y + 0.08) * 1.6 + vec2(uTime * 0.004, 0.0);
        float n = fbm(p);
        float cov = smoothstep(1.0 - uCloud, 1.0 - uCloud + 0.35, n) * smoothstep(0.0, 0.12, y);
        vec3 cc = uCloudCol * (0.75 + 0.5 * fbm(p * 2.0 + 3.0)) + uSunColor * uSunGlow * pow(c, 6.0) * 0.6;
        col = mix(col, cc, cov * 0.92);
      }
      col += uSunColor * uSunDisc * smoothstep(0.99985, 0.99993, c);
      gl_FragColor = vec4(col, 1.0);
    }`;

  /* ---------- 喷泉水滴：顶点着色器里按抛物线计算位置 ---------- */
  const WATER_VS = `
    attribute vec4 aSeed;
    uniform float uTime, uScale;
    varying float vFade;
    void main(){
      vec3 pos; float life;
      float ang = aSeed.y * 6.28318;
      if (aSeed.w < 0.55) {            // 中央水柱
        life = 1.28;
        float age = fract(uTime / life + aSeed.x) * life;
        vec3 v = vec3(cos(ang), 0.0, sin(ang)) * (0.55 + 0.45 * aSeed.z);
        v.y = 4.35 + 0.25 * aSeed.z;
        pos = vec3(0.0, 1.95, 0.0) + v * age + vec3(0.0, -4.905, 0.0) * age * age;
        vFade = smoothstep(0.0, 0.05, age);
      } else {                          // 池边八道弧形水柱
        life = 0.92;
        float j = floor(aSeed.y * 8.0); float a2 = j / 8.0 * 6.28318;
        float age = fract(uTime / life + aSeed.x) * life;
        vec3 o = vec3(cos(a2), 0.0, sin(a2)) * 2.05 + vec3(0.0, 0.55, 0.0);
        vec3 v = -vec3(cos(a2), 0.0, sin(a2)) * (1.65 + 0.12 * aSeed.z); v.y = 3.1 + 0.15 * aSeed.z;
        vec3 jit = vec3(sin(aSeed.z * 40.0), 0.0, cos(aSeed.z * 40.0)) * 0.02;
        pos = o + jit + v * age + vec3(0.0, -4.905, 0.0) * age * age;
        vFade = 1.0;
      }
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = clamp(0.034 * uScale / -mv.z, 1.0, 48.0);
    }`;
  const WATER_FS = `
    uniform vec3 uColor; varying float vFade;
    void main(){ vec2 q = gl_PointCoord - 0.5; float r = dot(q,q); if (r > 0.25 || vFade < 0.5) discard;
      gl_FragColor = vec4(uColor * (0.75 + 0.6 * (0.25 - r) * 4.0), 1.0); }`;

  /* ================================================================ */
  CL.createWorld = function () {
    const scene = new THREE.Scene();
    const W = { scene, groups: {}, emissive: {}, pointLights: [], movers: [], time: 0 };
    const addE = (group, mat, base) => { (W.emissive[group] = W.emissive[group] || []).push({ mat, base: base == null ? 1 : base }); return mat; };

    /* --- 天空、雾、远景 --- */
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: true, fog: false,
      uniforms: {
        uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() }, uGround: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunColor: { value: new THREE.Color() }, uCloudCol: { value: new THREE.Color() },
        uSunDisc: { value: 0 }, uSunGlow: { value: 0 }, uCloud: { value: 0 }, uTime: { value: 0 },
      },
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(2500, 48, 24), skyMat);
    sky.userData.pick = false; scene.add(sky); W.sky = sky;
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), skyMat));
    W.envScene = envScene;

    scene.fog = new THREE.FogExp2(0xffffff, 0.0012);

    const moon = new THREE.Mesh(new THREE.SphereGeometry(10.9, 48, 24), new THREE.MeshBasicMaterial({ map: moonTex(), fog: false, color: new THREE.Color(1, 1, 1) }));
    W.moonDir = new THREE.Vector3(0.42, 0.3, -0.86).normalize();
    moon.position.copy(W.moonDir).multiplyScalar(2400); moon.lookAt(0, 0, 0); moon.rotateY(Math.PI);
    tag(moon, 'moon'); scene.add(moon); W.moon = moon;

    const starGeo = new THREE.BufferGeometry(); { const r = rng(3), p = []; for (let i = 0; i < 500; i++) { const u = r() * 2 - 1, th = r() * 6.283, y = 0.06 + r() * 0.94, s = Math.sqrt(1 - y * y); p.push(Math.cos(th) * s * 2450, y * 2450, Math.sin(th) * s * 2450); void u; } starGeo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); }
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, color: new THREE.Color(1, 1, 1), fog: false }));
    stars.userData.pick = false; scene.add(stars); W.stars = stars;

    // 远山
    const hillMat = std('#5d6f63', 1);
    const rH = rng(21);
    for (let i = 0; i < 11; i++) {
      const a = -2.6 + i * 0.36 + rH() * 0.2, d = 900 + rH() * 700;
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), hillMat);
      m.scale.set(260 + rH() * 260, 90 + rH() * 120, 260 + rH() * 200);
      m.position.set(Math.sin(a) * d, -20, -Math.cos(a) * d);
      tag(m, 'hill'); scene.add(m);
    }

    /* --- 光源 --- */
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 240 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
    sun.target.position.set(0, 0, -12);
    scene.add(sun, sun.target); W.sun = sun;
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0);
    scene.add(hemi); W.hemi = hemi;
    const flash = new THREE.PointLight(0xffffff, 0, 0, 2);
    flash.visible = false; scene.add(flash); W.flash = flash;

    /* --- 地面 --- */
    const pav = pavingTex();
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(64, 20), std('#ffffff', 0.85, 0, { map: pav }));
    plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, 0, -4); plaza.receiveShadow = true; tag(plaza, 'ground'); scene.add(plaza);
    const far = new THREE.Mesh(new THREE.PlaneGeometry(300, 6), std('#ffffff', 0.85, 0, { map: pavingTex() }));
    far.material.map.repeat.set(75, 1.5);
    far.rotation.x = -Math.PI / 2; far.position.set(0, 0.12, -24.6); far.receiveShadow = true; tag(far, 'ground'); scene.add(far);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(300, 7.6), std('#ffffff', 0.9, 0, { map: asphaltTex() }));
    road.rotation.x = -Math.PI / 2; road.position.set(0, 0.005, -17.8); road.receiveShadow = true; tag(road, 'road'); scene.add(road);
    const curbMat = std('#a8a39a', 0.8);
    [[-14.0], [-21.6]].forEach(([z]) => { const c = new THREE.Mesh(new THREE.BoxGeometry(300, 0.15, 0.3), curbMat); c.position.set(0, 0.075, z); c.receiveShadow = c.castShadow = true; tag(c, 'road'); scene.add(c); });
    const lineMat = std('#e9e6dc', 0.6);
    const dash = new THREE.InstancedMesh(new THREE.BoxGeometry(3, 0.01, 0.13), lineMat, 34);
    for (let i = 0; i < 34; i++) { const m = new THREE.Matrix4().makeTranslation(-150 + i * 9, 0.012, -17.8); dash.setMatrixAt(i, m); }
    dash.receiveShadow = true; tag(dash, 'road'); scene.add(dash);
    [-14.45, -21.15].forEach((z) => { const l = new THREE.Mesh(new THREE.BoxGeometry(300, 0.01, 0.1), lineMat); l.position.set(0, 0.012, z); tag(l, 'road'); scene.add(l); });
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), std('#ffffff', 1, 0, { map: grassTex() }));
    grass.rotation.x = -Math.PI / 2; grass.position.y = -0.03; grass.receiveShadow = true; tag(grass, 'ground'); scene.add(grass);

    /* --- 楼房 --- */
    const winMats = [];
    function building(x, z, w, d, h, face, seed, wall, cols, rows, opt) {
      const f = facadeTex(seed, wall, cols, rows, opt);
      f.map.repeat.set(1, 1);
      const wallM = std(wall, 0.9);
      const faceM = std('#ffffff', 0.8, 0, { map: f.map, emissiveMap: f.emissive, emissive: new THREE.Color(1, 0.86, 0.66), emissiveIntensity: 0 });
      addE('windows', faceM, 1);
      winMats.push(faceM);
      const mats = [wallM, wallM, std(wall, 0.95), wallM, wallM, wallM];
      mats[face] = faceM;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
      b.position.set(x, h / 2, z);
      b.castShadow = b.receiveShadow = true; tag(b, 'building'); scene.add(b);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.5, d + 0.4), std('#8c857a', 0.8));
      cap.position.set(x, h + 0.25, z); cap.castShadow = true; tag(cap, 'building'); scene.add(cap);
      return b;
    }
    const PZ = 4, PX = 0;
    const back = [
      [-58, 12, 16, '#b9a58a', 4, 6], [-46, 11, 22, '#8f9fa6', 4, 8], [-34.5, 12, 13, '#c9b79a', 4, 5], [-22.5, 12, 19, '#b5674e', 5, 7],
      [-10.5, 12, 15, '#d8c9a8', 5, 5], [1.5, 12, 12, '#6f7f8a', 5, 4, { shop: true, awning: '#2f5f6a' }], [13.5, 12, 21, '#c7a17a', 5, 8],
      [25.5, 12, 14, '#9aa58f', 5, 5], [37.5, 12, 24, '#c3b8a6', 5, 9], [49.5, 12, 17, '#a9705a', 4, 6], [61.5, 12, 13, '#b9b1a0', 4, 5],
    ];
    back.forEach(([x, w, h, wall, cols, rows, opt], i) => building(x, -32, w, 12, h, PZ, 100 + i, wall, cols, rows, Object.assign({ sill: true, shop: i % 3 === 0 }, opt || {})));
    const left = [[4, 10, 13, '#d9c7a6'], [-4.5, 7, 17, '#a35f49'], [-11.5, 7, 12, '#c2b294']];
    left.forEach(([z, d, h, wall], i) => building(-19, z, 10, d, h, PX, 200 + i, wall, 4, Math.round(h / 3), { sill: true, litFrac: 0.4 }));

    // 霓虹招牌「照相馆」
    const neonM = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffffff, emissiveMap: neonTex(), emissiveIntensity: 1, roughness: 0.4 });
    addE('neon', neonM, 1);
    const neon = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), neonM);
    neon.position.set(1.5, 3.4, -25.9); tag(neon, 'building'); scene.add(neon);

    // 钟楼
    const tw = new THREE.Group();
    const twMat = std('#9b8a72', 0.9);
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(7, 48, 7), twMat); shaft.position.y = 24; tw.add(shaft);
    const clk = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), std('#ffffff', 0.7, 0, { map: clockTex() })); clk.position.set(0, 40, 3.52); tw.add(clk);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 12, 4), std('#4f5c5a', 0.6, 0.3)); roof.position.y = 54; roof.rotation.y = Math.PI / 4; tw.add(roof);
    tw.position.set(-34, 0, -240); tag(tw, 'tower'); scene.add(tw);

    /* --- 右侧：栏杆与草地，向西敞开 --- */
    const balM = std('#cfc7b8', 0.8);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 19), balM); rail.position.set(10, 0.95, -4.3); scene.add(rail); tag(rail, 'railing');
    const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 8), balM, 40);
    for (let i = 0; i < 40; i++) posts.setMatrixAt(i, new THREE.Matrix4().makeTranslation(10, 0.45, 5 - i * 0.47));
    tag(posts, 'railing'); posts.castShadow = true; scene.add(posts);

    /* --- 树 --- */
    const leafM = std('#ffffff', 0.9, 0, { map: leafTex() });
    const barkM = std('#5b4636', 0.95);
    function tree(x, z, s, seed) {
      const r = rng(seed), g = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.2 * s, 3.2 * s, 8), barkM); trunk.position.y = 1.6 * s; g.add(trunk);
      for (let i = 0; i < 7; i++) {
        const geo = new THREE.IcosahedronGeometry(1, 2), p = geo.attributes.position;
        for (let k = 0; k < p.count; k++) { const v = new THREE.Vector3().fromBufferAttribute(p, k); v.multiplyScalar(1 + (Math.sin(v.x * 5 + seed) * Math.cos(v.y * 4 + i) * Math.sin(v.z * 6)) * 0.18); p.setXYZ(k, v.x, v.y, v.z); }
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, leafM);
        const a = (i / 7) * 6.283 + r(), rad = i === 0 ? 0 : 0.9 * s;
        m.position.set(Math.cos(a) * rad, (3.6 + r() * 1.4) * s, Math.sin(a) * rad);
        m.scale.setScalar((1.0 + r() * 0.5) * s);
        g.add(m);
      }
      g.position.set(x, 0, z); shadowAll(g, true, true); tag(g, 'tree'); scene.add(g); return g;
    }
    [[-7.5, -3, 1.1, 1], [-8.5, -13, 1.25, 2], [7.5, -12.5, 1.15, 3], [70, -40, 1.6, 4], [85, -20, 1.8, 5], [95, 10, 1.7, 6]].forEach((a) => tree(...a));
    for (let i = 0; i < 9; i++) tree(-36 + i * 9 + (i % 2) * 1.5, -23.4, 0.95 + (i % 3) * 0.12, 30 + i);

    /* --- 前景花坛 + 风车 --- */
    const planter = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.62), std('#8a7a68', 0.85)); box.position.y = 0.275; planter.add(box);
    const soil = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.02, 0.54), std('#3b2c22', 1)); soil.position.y = 0.55; planter.add(soil);
    const fr = rng(77), fcols = ['#d8263c', '#f4c430', '#f7f3ea', '#c3418f', '#ff7a2f'];
    const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.038, 1), std('#ffffff', 0.6), 70);
    const leaves = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 6), std('#3d6b2c', 0.7), 90);
    const mtx = new THREE.Matrix4(), col = new THREE.Color();
    for (let i = 0; i < 70; i++) {
      mtx.compose(new THREE.Vector3((fr() - 0.5) * 1.1, 0.68 + fr() * 0.16, (fr() - 0.5) * 0.46), new THREE.Quaternion(), new THREE.Vector3(1, 0.7, 1));
      flowers.setMatrixAt(i, mtx); flowers.setColorAt(i, col.set(fcols[i % 5]));
    }
    for (let i = 0; i < 90; i++) { mtx.compose(new THREE.Vector3((fr() - 0.5) * 1.15, 0.58 + fr() * 0.12, (fr() - 0.5) * 0.5), new THREE.Quaternion().setFromEuler(new THREE.Euler(fr(), fr() * 3, 0)), new THREE.Vector3(1.4, 0.4, 0.8)); leaves.setMatrixAt(i, mtx); }
    planter.add(flowers, leaves);
    const stick = tube([-0.3, 0.55, 0], [-0.3, 1.3, 0], 0.008, std('#d9c9a8', 0.6)); planter.add(stick);
    const pin = new THREE.Group();
    const bladeCols = ['#e8322f', '#2a7de1', '#f5c21b', '#2fae63'];
    bladeCols.forEach((c, k) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0.11, 0, 0, 0.08, 0.08, 0.015, 0, 0, 0, 0.08, 0.08, 0.015, 0, 0.11, 0], 3));
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, std(c, 0.5, 0, { side: THREE.DoubleSide }));
      m.rotation.z = (k * Math.PI) / 2; pin.add(m);
    });
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), std('#ffffff', 0.4)); hub.position.z = 0.025; pin.add(hub);
    pin.position.set(-0.3, 1.3, 0.03); planter.add(pin);
    planter.position.set(1.3, 0, -2.1); planter.rotation.y = -0.2;
    shadowAll(planter, true, true); tag(planter, 'planter'); tag(pin, 'pinwheel'); scene.add(planter);
    W.pinwheel = pin;

    /* --- 画架与 24 色卡 --- */
    const easel = new THREE.Group();
    const wood = std('#8b6a4a', 0.7);
    easel.add(tube([-0.32, 0, 0.12], [0, 1.62, 0], 0.016, wood), tube([0.32, 0, 0.12], [0, 1.62, 0], 0.016, wood), tube([0, 0, -0.45], [0, 1.55, -0.02], 0.016, wood));
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.07), wood); ledge.position.set(0, 1.02, 0.07); easel.add(ledge);
    const chart = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), std('#ffffff', 0.9, 0, { map: chartTex() }));
    chart.position.set(0, 1.24, 0.085); chart.rotation.x = -0.08; easel.add(chart);
    easel.position.set(-1.95, 0, -4.3); easel.rotation.y = 0.4;
    shadowAll(easel, true, true); tag(easel, 'chart'); scene.add(easel);
    W.chart = chart;
    // 第 22 格（中灰）在色卡平面上的局部坐标
    // 纹理 768×512：第 22 格中心在 (442, 444) 像素处，换算到 0.6×0.4 m 的平面上
    W.grayPatchLocal = new THREE.Vector3((442 / 768 - 0.5) * 0.6, (0.5 - 444 / 512) * 0.4, 0.002);

    /* --- 自行车（主角）与骑车人 --- */
    function bicycle(frameColor, spinners) {
      const g = new THREE.Group();
      const fm = std(frameColor, 0.35, 0.3), tire = std('#1b1b1b', 0.9), rim = std('#c9ccd0', 0.25, 0.9), chrome = std('#d6d8db', 0.2, 1);
      const wheels = [];
      [-0.52, 0.52].forEach((x) => {
        const w = new THREE.Group();
        w.add(new THREE.Mesh(new THREE.TorusGeometry(0.335, 0.019, 10, 48), tire));
        w.add(new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.008, 6, 48), rim));
        const sp = []; for (let k = 0; k < 18; k++) { const a = (k / 18) * Math.PI * 2; sp.push(0, 0, (k % 2 ? 1 : -1) * 0.025, Math.cos(a) * 0.305, Math.sin(a) * 0.305, 0); }
        const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
        const spokes = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xbfc3c8 })); spokes.userData.pick = false; w.add(spokes);
        w.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 10).rotateX(Math.PI / 2), chrome));
        w.position.set(x, 0.354, 0); g.add(w); wheels.push(w);
      });
      const BB = [-0.02, 0.29, 0], ST = [-0.17, 0.84, 0], HT = [0.38, 0.85, 0], HB = [0.42, 0.68, 0], R = [-0.52, 0.354, 0], F = [0.52, 0.354, 0];
      g.add(tube(BB, ST, 0.017, fm), tube(BB, HB, 0.02, fm), tube(ST, HT, 0.016, fm), tube(HB, HT, 0.022, fm));
      [0.04, -0.04].forEach((z) => { g.add(tube([BB[0], BB[1], z], [R[0], R[1], z], 0.01, fm), tube([-0.16, 0.8, z], [R[0], R[1], z], 0.01, fm), tube([HB[0], HB[1], z * 0.8], [F[0], F[1], z], 0.012, fm)); });
      g.add(tube([-0.17, 0.84, 0], [-0.2, 0.95, 0], 0.012, chrome));
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.12), std('#4a2e1f', 0.6)); saddle.position.set(-0.22, 0.97, 0); g.add(saddle);
      g.add(tube([0.38, 0.85, 0], [0.34, 1.0, 0], 0.012, chrome), tube([0.34, 1.0, -0.24], [0.34, 1.0, 0.24], 0.011, chrome));
      [-0.24, 0.24].forEach((z) => { const gp = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 8).rotateX(Math.PI / 2), std('#3a2a20', 0.8)); gp.position.set(0.34, 1.0, z * 0.85); g.add(gp); });
      const crank = new THREE.Group(); crank.position.set(BB[0], BB[1], 0);
      crank.add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24).rotateX(Math.PI / 2).translate(0, 0, 0.05), chrome));
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.17, 0.012), chrome); arm.position.set(0, -0.085, 0.07); crank.add(arm);
      const arm2 = arm.clone(); arm2.position.set(0, 0.085, -0.07); crank.add(arm2);
      g.add(crank);
      return { g, wheels, crank, fm };
    }
    const bike = bicycle('#b3262a');
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.34), std('#a07a48', 0.9)); basket.position.set(0.58, 1.02, 0); bike.g.add(basket);
    const bouquet = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.035, 1), std('#ffffff', 0.6), 14);
    for (let i = 0; i < 14; i++) { bouquet.setMatrixAt(i, new THREE.Matrix4().makeTranslation(0.5 + fr() * 0.18, 1.14 + fr() * 0.08, (fr() - 0.5) * 0.25)); bouquet.setColorAt(i, col.set(['#f7f3ea', '#f4c430', '#d8263c'][i % 3])); }
    bike.g.add(bouquet);
    const stand = tube([-0.1, 0.29, 0.05], [-0.25, 0.0, 0.2], 0.008, std('#999', 0.4, 0.8)); bike.g.add(stand);
    bike.g.position.set(0.85, 0, -5.7); bike.g.rotation.set(0, 0.55, 0.07);
    shadowAll(bike.g, true, true); tag(bike.g, 'bicycle'); scene.add(bike.g);
    W.bicycle = bike.g;

    // 骑车人
    const rider = bicycle('#1f5fae');
    const jacket = std('#f2c230', 0.7), pants = std('#2a2f3a', 0.8), skin = std('#c99a7b', 0.7);
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.36, 4, 10), jacket); torso.position.set(-0.01, 1.25, 0); torso.rotation.z = -0.62; rider.g.add(torso);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), skin); head.position.set(0.28, 1.62, 0); rider.g.add(head);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 10, 0, 6.3, 0, 1.6), std('#e23b2e', 0.4)); helmet.position.set(0.27, 1.65, 0); rider.g.add(helmet);
    [-0.13, 0.13].forEach((z) => { const a = tube([0.12, 1.5, z], [0.34, 1.02, z * 1.6], 0.045, jacket); rider.g.add(a); });
    const legs = [];
    [0.11, -0.11].forEach((z) => {
      const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 4, 8), pants), sh = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.34, 4, 8), pants);
      rider.g.add(th, sh); legs.push({ th, sh, z });
    });
    shadowAll(rider.g, true, true); tag(rider.g, 'cyclist'); scene.add(rider.g);
    W.rider = rider;
    const legTmp = { a: new THREE.Vector3(), b: new THREE.Vector3(), k: new THREE.Vector3() };
    function placeSeg(mesh, A, B) { mesh.position.copy(A).add(B).multiplyScalar(0.5); mesh.quaternion.setFromUnitVectors(UP, legTmp.k.copy(B).sub(A).normalize()); }
    function poseRider(phase) {
      rider.crank.rotation.z = -phase;
      rider.wheels.forEach((w) => (w.rotation.z = -phase * 2.6));
      const hip = new THREE.Vector3(-0.17, 0.98, 0);
      legs.forEach((L, k) => {
        const a = -phase + (k ? Math.PI : 0);
        const foot = new THREE.Vector3(-0.02 + Math.sin(a) * 0.17, 0.29 - Math.cos(a) * 0.17, L.z * 1.1);
        const h = hip.clone(); h.z = L.z;
        const d = Math.min(h.distanceTo(foot), 0.86), l = 0.45;
        const mid = h.clone().lerp(foot, 0.5);
        const off = Math.sqrt(Math.max(l * l - (d * d) / 4, 0));
        const dir = foot.clone().sub(h).normalize();
        const perp = new THREE.Vector3(-dir.y, dir.x, 0); // 膝盖朝前（+x）
        const knee = mid.add(perp.multiplyScalar(off));
        placeSeg(L.th, h, knee); placeSeg(L.sh, knee, foot);
      });
    }
    W.riderPos = (t) => { const L = 100, v = 5.6; const x = ((((t * v) % L) + L) % L) - L / 2; return new THREE.Vector3(x, 0, -14.75); };
    W.riderSpeed = 5.6;

    /* --- 汽车 --- */
    const cars = [];
    const carCols = ['#2b3a55', '#c9c4ba', '#7a1e22', '#1f1f22', '#3d6f73', '#d6a43a'];
    const headM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3dd, emissiveIntensity: 1, roughness: 0.2 });
    const tailM = new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff1a10, emissiveIntensity: 1, roughness: 0.3 });
    addE('carHead', headM, 1); addE('carTail', tailM, 1);
    const glassM = std('#1b2228', 0.08, 0.2);
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group();
      const paint = std(carCols[i], 0.32, 0.55);
      const low = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.62, 1.8), paint); low.position.y = 0.6; g.add(low);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.55, 1.62), glassM); cab.position.set(-0.25, 1.18, 0); g.add(cab);
      const roofM = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.6), paint); roofM.position.set(-0.3, 1.47, 0); g.add(roofM);
      [[-1.35, 0.85], [1.35, 0.85], [-1.35, -0.85], [1.35, -0.85]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 16).rotateX(Math.PI / 2), std('#151515', 0.9)); w.position.set(x, 0.33, z); g.add(w); });
      const lights = [];
      [0.62, -0.62].forEach((z) => {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.3), headM); h.position.set(2.1, 0.68, z); g.add(h); lights.push({ m: h, x: 2.1 });
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.32), tailM); t.position.set(-2.1, 0.72, z); g.add(t); lights.push({ m: t, x: -2.1 });
      });
      const lane = i % 2;
      const speed = lane ? -10.5 : 8.6;
      g.rotation.y = 0; // 车头朝 +x；反向车道靠速度符号和翻转处理
      if (lane) g.scale.x = -1;
      shadowAll(g, true, false); tag(g, 'car'); scene.add(g);
      cars.push({ g, lights, speed, z: lane ? -19.5 : -16.2, off: i * 37 + (lane ? 11 : 0) });
    }
    const ROAD_L = 220;
    W.carX = (c, t) => { const x = c.off + c.speed * t; return ((((x + ROAD_L / 2) % ROAD_L) + ROAD_L) % ROAD_L) - ROAD_L / 2; };

    /* --- 街灯与串灯 --- */
    const poleM = std('#2b2e31', 0.5, 0.6);
    const lampM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe0b0, emissiveIntensity: 1, roughness: 0.3 });
    addE('lamps', lampM, 1);
    function streetLamp(x, z, h, armDir, light) {
      const g = new THREE.Group();
      g.add(tube([0, 0, 0], [0, h, 0], 0.07, poleM), tube([0, h, 0], [0, h, armDir * 1.2], 0.05, poleM));
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.6), lampM); head.position.set(0, h - 0.08, armDir * 1.25); g.add(head);
      g.position.set(x, 0, z); shadowAll(g, true, false); tag(g, 'lamp'); scene.add(g);
      // 路灯灯头朝下：用聚光灯，只照亮下方一圈，不会把楼房立面整面照亮
      if (light) { const p = new THREE.SpotLight(0xffd2a0, 0, 0, 1.12, 0.65, 2); p.position.set(x, h - 0.15, z + armDir * 1.25); p.target.position.set(x, 0, z + armDir * 1.6); scene.add(p, p.target); W.pointLights.push({ l: p, base: 1.4 }); }
    }
    [-15, -3, 9].forEach((x) => streetLamp(x, -13.7, 6, -1, true));
    [-21, -9, 3, 15, 27].forEach((x) => streetLamp(x, -22.1, 6, 1, x === -9 || x === 15));
    // 庭院灯
    const lantern = new THREE.Group();
    lantern.add(tube([0, 0, 0], [0, 2.9, 0], 0.05, poleM));
    const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.38, 6), lampM); lg.position.y = 3.05; lantern.add(lg);
    const lcap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.18, 6), poleM); lcap.position.y = 3.33; lantern.add(lcap);
    lantern.position.set(2.0, 0, -6.6); shadowAll(lantern, true, false); tag(lantern, 'lamp'); scene.add(lantern);
    { const p = new THREE.PointLight(0xffc890, 0, 0, 2); p.position.set(2.0, 2.95, -6.6); scene.add(p); W.pointLights.push({ l: p, base: 0.6 }); }

    // 串灯（悬链线）
    const bulbM = new THREE.MeshStandardMaterial({ color: 0x332211, emissive: 0xffc77a, emissiveIntensity: 1, roughness: 0.3 });
    addE('strings', bulbM, 1);
    const poles = [[-6, -4], [6, -4], [-6, -13.5], [6, -13.5]];
    poles.forEach(([x, z]) => { const p = tube([x, 0, z], [x, 4.3, z], 0.06, poleM); p.castShadow = true; tag(p, 'lamp'); scene.add(p); });
    const spans = [[0, 3], [1, 2], [2, 3], [0, 2], [1, 3]];
    const bulbPos = [], wirePts = [];
    spans.forEach(([a, b]) => {
      const A = new THREE.Vector3(poles[a][0], 4.15, poles[a][1]), B = new THREE.Vector3(poles[b][0], 4.15, poles[b][1]);
      const L = A.distanceTo(B), n = Math.round(L / 0.5), sag = 0.07 * L;
      let prev = null;
      for (let k = 0; k <= n; k++) {
        const t = k / n, p = A.clone().lerp(B, t); p.y -= sag * 4 * t * (1 - t);
        if (k > 0 && k < n) bulbPos.push(p.clone().add(new THREE.Vector3(0, -0.07, 0)));
        if (prev) wirePts.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    });
    const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 10, 8), bulbM, bulbPos.length);
    bulbPos.forEach((p, i) => bulbs.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)));
    tag(bulbs, 'lights'); scene.add(bulbs);
    const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wirePts, 3));
    const wires = new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: 0x1a1a1a })); wires.userData.pick = false; scene.add(wires);

    /* --- 绿篱与灯网（背景光斑的主要来源） --- */
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(8, 0.88, 0.9), std('#ffffff', 0.95, 0, { map: leafTex() }));
    hedge.material.map.repeat.set(5, 1);
    hedge.position.set(2.4, 0.44, -9.3); hedge.castShadow = hedge.receiveShadow = true; tag(hedge, 'hedge'); scene.add(hedge);
    const fairyM = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xfff0c8, emissiveIntensity: 1, roughness: 0.3 });
    addE('fairy', fairyM, 1);
    const fairyN = 110, fairy = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 8, 6), fairyM, fairyN);
    const fq = rng(55);
    for (let i = 0; i < fairyN; i++) fairy.setMatrixAt(i, new THREE.Matrix4().makeTranslation(-1.55 + fq() * 7.9, 0.18 + fq() * 0.7, -8.84));
    tag(fairy, 'lights'); scene.add(fairy);

    /* --- 咖啡座 --- */
    const cafe = new THREE.Group();
    const metal = std('#2c3134', 0.45, 0.7);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 28), std('#e9e4da', 0.4)); top.position.y = 0.74; cafe.add(top);
    cafe.add(tube([0, 0, 0], [0, 0.73, 0], 0.03, metal));
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.09, 16), std('#fbfaf6', 0.3)); cup.position.set(0.1, 0.8, 0.06); cafe.add(cup);
    [[-0.62, 0.0, 0], [0.62, 0, Math.PI]].forEach(([x, z, ry]) => {
      const ch = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), std('#2f6f6a', 0.6)); seat.position.y = 0.45; ch.add(seat);
      const backr = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.42), std('#2f6f6a', 0.6)); backr.position.set(-0.2, 0.68, 0); ch.add(backr);
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([a, b]) => ch.add(tube([a, 0, b], [a, 0.44, b], 0.015, metal)));
      ch.position.set(x, 0, z); ch.rotation.y = ry; cafe.add(ch);
    });
    cafe.add(tube([0, 0.74, 0], [0, 2.35, 0], 0.025, std('#d8d2c4', 0.5)));
    const para = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.45, 16, 1, true), std('#ffffff', 0.85, 0, { map: stripeTex(), side: THREE.DoubleSide }));
    para.position.y = 2.35; cafe.add(para);
    cafe.position.set(3.1, 0, -7.6); shadowAll(cafe, true, true); tag(cafe, 'cafe'); scene.add(cafe);

    /* --- 长椅 --- */
    [[-5.4, -6.5], [-5.4, -9.4]].forEach(([x, z]) => {
      const b = new THREE.Group();
      for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 1.7), std('#8a5e3c', 0.8)); s.position.set(-0.2 + k * 0.13, 0.45, 0); b.add(s); }
      for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 1.7), std('#8a5e3c', 0.8)); s.position.set(-0.27, 0.62 + k * 0.13, 0); b.add(s); }
      [-0.7, 0.7].forEach((zz) => b.add(tube([-0.1, 0, zz], [-0.1, 0.45, zz], 0.035, metal)));
      b.position.set(x, 0, z); shadowAll(b, true, true); tag(b, 'bench'); scene.add(b);
    });

    /* --- 喷泉 --- */
    const fountain = new THREE.Group();
    const stone = std('#cdbfa8', 0.75);
    const basin = new THREE.Mesh(new THREE.LatheGeometry([[2.0, 0], [2.3, 0], [2.3, 0.55], [2.12, 0.55], [2.12, 0.08]].map(([x, y]) => new THREE.Vector2(x, y)), 64), stone);
    fountain.add(basin);
    const waterM = std('#2a4652', 0.05, 0.0, { envMapIntensity: 1.2 });
    const pool = new THREE.Mesh(new THREE.CircleGeometry(2.13, 64), waterM); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.42; fountain.add(pool);
    const column = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.32, 0], [0.22, 0.4], [0.16, 1.1], [0.12, 1.2], [0.7, 1.32], [0.75, 1.42], [0.18, 1.45], [0.1, 1.9], [0, 1.95]].map(([x, y]) => new THREE.Vector2(x, y)), 48), stone);
    fountain.add(column);
    const N = 3200, seeds = new Float32Array(N * 4), qq = rng(99);
    for (let i = 0; i < N; i++) { seeds[i * 4] = qq(); seeds[i * 4 + 1] = qq(); seeds[i * 4 + 2] = qq(); seeds[i * 4 + 3] = qq(); }
    const wgeo = new THREE.BufferGeometry();
    wgeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
    wgeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    const waterMat = new THREE.ShaderMaterial({ vertexShader: WATER_VS, fragmentShader: WATER_FS, uniforms: { uTime: { value: 0 }, uScale: { value: 800 }, uColor: { value: new THREE.Color(1, 1, 1) } } });
    const water = new THREE.Points(wgeo, waterMat); water.frustumCulled = false; water.userData.pick = false; fountain.add(water);
    fountain.position.set(-3.9, 0, -12.2);
    shadowAll(fountain, true, true); tag(fountain, 'fountain'); scene.add(fountain);
    W.water = waterMat;

    /* ================= 光线预设 ================= */
    W.PRESETS = [
      { id: 'noon', name: '晴天正午', ev: 15, K: 5600, sunDir: [0.32, 0.9, -0.3], sunI: 9, sunK: 5600, zen: [0.16, 0.34, 0.85], hor: [0.62, 0.75, 0.95], gnd: [0.35, 0.33, 0.3], cloud: 0.32, cloudCol: [1.25, 1.25, 1.3], glow: 0.6, disc: 400, fog: 0.0011, env: 1.0, E: {}, water: 1.4, desc: '太阳高悬，阴影浓重、反差大。阳光 16 法则：f/16、快门 1/ISO。' },
      { id: 'overcast', name: '阴天', ev: 12.3, K: 6500, sunDir: [0.2, 0.8, -0.4], sunI: 0.35, sunK: 6500, zen: [0.78, 0.8, 0.84], hor: [1.05, 1.07, 1.1], gnd: [0.3, 0.3, 0.3], cloud: 0, cloudCol: [1, 1, 1], glow: 0.0, disc: 0, fog: 0.0024, env: 1.0, E: {}, water: 0.8, desc: '云层把阳光变成巨大的柔光箱：没有硬阴影，天空很亮，容易过曝。' },
      { id: 'golden', name: '黄金时刻', ev: 12.6, K: 3400, sunDir: [0.97, 0.17, -0.15], sunI: 11, sunK: 2700, zen: [0.2, 0.3, 0.6], hor: [1.6, 1.0, 0.58], gnd: [0.25, 0.2, 0.16], cloud: 0.22, cloudCol: [1.3, 0.85, 0.6], glow: 2.6, disc: 220, fog: 0.0016, env: 0.45, E: { strings: 7, fairy: 6, neon: 4 }, water: 1.2, desc: '日落前约一小时，暖色低角度侧光，影子很长，适合人像与风光。' },
      { id: 'blue', name: '蓝调时刻', ev: 7.5, K: 9000, sunDir: [0.9, -0.06, -0.4], sunI: 0, sunK: 9000, zen: [0.035, 0.07, 0.24], hor: [0.17, 0.17, 0.3], gnd: [0.05, 0.05, 0.07], cloud: 0.15, cloudCol: [0.12, 0.12, 0.2], glow: 0.25, disc: 0, fog: 0.0016, env: 1.0, E: { strings: 9, fairy: 7, lamps: 14, windows: 1.1, neon: 6, carHead: 2500, carTail: 600 }, lamps: 1, water: 0.35, moon: 1, desc: '日落后二三十分钟，天空深蓝、灯光已亮，冷暖对比最好看。' },
      { id: 'night', name: '夜晚', ev: 4.5, K: 3200, sunDir: [0.9, -0.3, -0.4], sunI: 0, sunK: 4000, zen: [0.0006, 0.001, 0.0032], hor: [0.0028, 0.0026, 0.0045], gnd: [0.001, 0.001, 0.0012], cloud: 0.1, cloudCol: [0.004, 0.004, 0.006], glow: 0, disc: 0, fog: 0.001, env: 1.0, E: { strings: 9, fairy: 7, lamps: 14, windows: 0.9, neon: 5, carHead: 5000, carTail: 1200 }, lamps: 1, water: 0.12, moon: 0.06, stars: 1, desc: '街灯、串灯与车灯是主要光源。夜景测光常被大片暗部误导，记得减曝光。' },
    ];

    let pmrem = null, envRT = null;
    W.setPreset = function (renderer, id) {
      const P = W.PRESETS.find((p) => p.id === id) || W.PRESETS[0];
      W.preset = P;
      const u = skyMat.uniforms;
      u.uZenith.value.setRGB(...P.zen); u.uHorizon.value.setRGB(...P.hor); u.uGround.value.setRGB(...P.gnd);
      const sd = new THREE.Vector3(...P.sunDir).normalize();
      u.uSunDir.value.copy(sd); u.uSunColor.value.setRGB(...CL.lightColor(P.sunK));
      u.uSunGlow.value = P.glow; u.uSunDisc.value = P.disc; u.uCloud.value = P.cloud; u.uCloudCol.value.setRGB(...P.cloudCol);
      sun.color.setRGB(...CL.lightColor(P.sunK)); sun.intensity = P.sunI; sun.visible = P.sunI > 0;
      sun.position.copy(sun.target.position).addScaledVector(sd, 120);
      scene.fog.color.setRGB(...P.hor).multiplyScalar(0.9); scene.fog.density = P.fog;
      Object.keys(W.emissive).forEach((k) => { const m = P.E[k] || 0; W.emissive[k].forEach((e) => { e.mat.emissiveIntensity = e.base * m; e.saved = e.mat.emissiveIntensity; }); });
      W.pointLights.forEach((p) => { p.l.intensity = (P.lamps || 0) * 260 * p.base; p.l.visible = !!P.lamps; });
      W.water.uniforms.uColor.value.setScalar(P.water);
      moon.visible = !!P.moon; moon.material.color.setScalar(P.moon ? P.moon * 260 : 0);
      stars.visible = !!P.stars; stars.material.color.setScalar(0.4);
      if (!pmrem) { pmrem = new THREE.PMREMGenerator(renderer); }
      if (envRT) envRT.dispose();
      envRT = pmrem.fromScene(envScene, 0.02, 0.1, 400);
      scene.environment = envRT.texture;
      W.envIntensity = P.env;
      scene.traverse((o) => { if (o.material && o.material.isMeshStandardMaterial) o.material.envMapIntensity = P.env * (o.material.userData.envBoost || 1); });
      scene.background = null;
      return P;
    };

    /* ================= 动画 ================= */
    W.update = function (t) {
      W.time = t;
      pin.rotation.z = -t * Math.PI * 2 * 2.4;
      skyMat.uniforms.uTime.value = t;
      W.water.uniforms.uTime.value = t;
      cars.forEach((c) => { c.g.position.set(W.carX(c, t), 0, c.z); c.g.children.forEach((m) => { if (m.geometry && m.geometry.type === 'CylinderGeometry' && m.position.y < 0.4) m.rotation.z = -Math.abs(c.speed) * t / 0.33; }); });
      const rp = W.riderPos(t); rider.g.position.copy(rp);
      poseRider((t * W.riderSpeed) / 0.354 / 2.6); // 轮子角速度 v/r，牙盘比 2.6
    };
    // 长曝光时把车灯沿运动方向拉长：一个子帧内灯光扫过的距离 = |v|·dt
    W.setStreak = function (dt) {
      cars.forEach((c) => c.lights.forEach((L) => {
        const len = Math.abs(c.speed) * dt;
        const s = Math.max(1, len / 0.06);
        L.m.scale.x = s; L.m.position.x = L.x - (s > 1 ? (len / 2 - 0.03) : 0);
      }));
    };

    /* ================= 闪光专用渲染 ================= */
    let saved = null;
    W.setFlashOnly = function (on, pos) {
      if (on) {
        saved = { env: scene.environment, fog: scene.fog.color.clone(), sun: sun.visible, moon: moon.visible, stars: stars.visible, sky: sky.visible, water: W.water.uniforms.uColor.value.clone(), pl: W.pointLights.map((p) => p.l.visible) };
        scene.environment = null; scene.fog.color.setRGB(0, 0, 0);
        sun.visible = false; moon.visible = false; stars.visible = false; sky.visible = false;
        W.pointLights.forEach((p) => (p.l.visible = false));
        Object.keys(W.emissive).forEach((k) => W.emissive[k].forEach((e) => (e.mat.emissiveIntensity = 0)));
        W.water.uniforms.uColor.value.setScalar(0.02);
        flash.visible = true; flash.intensity = Math.PI; flash.position.copy(pos);
      } else if (saved) {
        scene.environment = saved.env; scene.fog.color.copy(saved.fog);
        sun.visible = saved.sun; moon.visible = saved.moon; stars.visible = saved.stars; sky.visible = saved.sky;
        W.pointLights.forEach((p, i) => (p.l.visible = saved.pl[i]));
        Object.keys(W.emissive).forEach((k) => W.emissive[k].forEach((e) => (e.mat.emissiveIntensity = e.saved)));
        W.water.uniforms.uColor.value.copy(saved.water);
        flash.visible = false; flash.intensity = 0;
        saved = null;
      }
    };
    W.setPointScale = (hPx, fovRad) => { W.water.uniforms.uScale.value = hPx / (2 * Math.tan(fovRad / 2)); };

    /* 拾取：自动对焦用 */
    W.pickables = [];
    scene.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && o.userData.pick !== false && o !== sky) W.pickables.push(o); });
    W.subjectOf = (o) => { while (o) { if (o.userData && o.userData.subject) return o.userData.subject; o = o.parent; } return null; };
    W.cars = cars;
    W.fountainPos = fountain.position.clone();
    W.update(0);
    return W;
  };
})();
