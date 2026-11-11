// ===== 建筑（实例化）：墙面、窗、坡屋顶 =====
// #define ROOF 表示坡屋顶几何
#ifdef VERTEX
attribute vec4 iPos;    // x, y, z, rot
attribute vec4 iSize;   // w, h, d, roofType
attribute vec4 iWall;   // rgb, seed
attribute vec4 iRoof;   // rgb, kind
varying vec3 vW;
varying vec3 vN;
varying vec3 vLocal;    // 墙面坐标：u（米）、v（米）、面编号
varying vec4 vWall;
varying vec4 vRoof;
varying vec3 vSize;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float c = cos(iPos.w), s = sin(iPos.w);
  vec3 p = position;
  vec3 lp;
  vec3 n = normal;
#ifdef ROOF
  float roofH = iSize.z * 0.3;
  lp = vec3(p.x * (iSize.x + 0.7), iSize.y + p.y * roofH, p.z * (iSize.z + 0.9));
  // 法线随屋顶坡度缩放
  n = normalize(vec3(n.x / (iSize.x + 0.7), n.y / roofH, n.z / (iSize.z + 0.9)));
  vLocal = vec3(p.x * iSize.x, (0.5 - abs(p.z)) * (iSize.z + 0.9), 0.0);
#else
  lp = vec3(p.x * iSize.x, p.y * iSize.y, p.z * iSize.z);
  float face = abs(n.x) > 0.5 ? 1.0 : (abs(n.z) > 0.5 ? 2.0 : 3.0);
  float u = face < 1.5 ? p.z * iSize.z : p.x * iSize.x;
  vLocal = vec3(u, p.y * iSize.y, face);
#endif
  vec3 wp = vec3(c * lp.x - s * lp.z, lp.y, s * lp.x + c * lp.z) + iPos.xyz;
  vN = vec3(c * n.x - s * n.z, n.y, s * n.x + c * n.z);
  vW = wp;
  vWall = iWall;
  vRoof = iRoof;
  vSize = iSize.xyz;
  vec3 cp = vec3(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(cp, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif

#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
varying vec3 vLocal;
varying vec4 vWall;
varying vec4 vRoof;
varying vec3 vSize;

// 夜里窗户是否亮灯：随时间缓慢变化
float windowLit(vec2 id, float seed) {
  float h = uLocalHour;
  // 入夜后亮灯的比例：傍晚多，深夜少，清晨又有一些
  float evening = smoothstep(17.5, 19.5, h) * (1.0 - smoothstep(22.5, 24.0, h));
  float late = (step(h, 5.5) * 0.12 + step(23.99, h) * 0.12) + smoothstep(0.0, 1.0, 1.0 - h) * 0.0;
  float dawn = smoothstep(5.0, 6.0, h) * (1.0 - smoothstep(7.0, 8.0, h));
  float frac = max(max(evening * 0.62, late), dawn * 0.35);
  frac = max(frac, step(19.5, h) * smoothstep(24.0, 22.0, h) * 0.5);
  float slot = floor(uTimeS / 1500.0 + hash12(id + seed * 7.0) * 3.0);
  float r = hash13(vec3(id, slot + seed * 13.0));
  return step(r, frac);
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 N = normalize(vN);
  vec3 w = vW;
  float kind = vRoof.a;
  SHADOW_OUT(w)
  float seed = vWall.a;
  vec3 V = normalize(cameraPosition - w);
  float camD = length(cameraPosition - w);
  float px = camD * uPixAng;
  vec3 alb;
  vec3 emit = vec3(0.0);
  float rough = 0.85;
  float wet = uWet * 0.5;
  float glass = 0.0;
#ifdef ROOF
  // 瓦屋顶：沿坡向的瓦垄
  float row = vLocal.y;
  float tile = 0.85 + 0.15 * smoothstep(0.0, 0.3, abs(fract(row / 0.32) - 0.5)) * (1.0 - smoothstep(0.2, 0.6, px));
  float col = 0.9 + 0.1 * sin(vLocal.x * 18.0) * (1.0 - smoothstep(0.1, 0.4, px));
  alb = vRoof.rgb * tile * col * (0.85 + 0.3 * hash12(floor(vLocal.xy * vec2(0.5, 2.0)) + seed));
  // 少数屋顶装了太阳能板
  float solar = step(0.72, seed) * step(0.15, row) * step(row, vSize.z * 0.38) * step(abs(vLocal.x), vSize.x * 0.32);
  alb = mix(alb, vec3(0.03, 0.04, 0.07), solar);
  rough = mix(0.8, 0.3, solar);
  wet = uWet * 0.8;
  float ao = 1.0;
#else
  float face = vLocal.z;
  float ao = mix(0.55, 1.0, smoothstep(0.0, 2.5, vLocal.y));
  alb = vWall.rgb * (0.92 + 0.12 * vnoise2(vLocal.xy * vec2(0.4, 0.8) + seed * 50.0));
  // 墙脚的污迹
  alb *= mix(0.78, 1.0, smoothstep(0.2, 1.4, vLocal.y));
  if (face > 2.5) {
    // 平顶
    alb = vec3(0.3, 0.29, 0.27) * (0.85 + 0.25 * vnoise2(w.xz * 0.5));
    ao = 1.0;
  } else {
    // 窗格
    float floorH = 3.1;
    float fy = vLocal.y - 0.9;
    float floorI = floor(fy / floorH);
    float inFloor = fract(fy / floorH);
    float bayW = kind > 1.5 && kind < 2.5 ? 3.6 : (kind > 0.5 && kind < 1.5 ? 2.8 : 3.3);
    float bx = vLocal.x / bayW;
    float bayI = floor(bx);
    float inBay = fract(bx);
    float winW = kind > 1.5 && kind < 2.5 ? 0.78 : 0.48;
    float winH = kind > 1.5 && kind < 2.5 ? 0.62 : 0.5;
    float wx = smoothstep(0.5 - winW * 0.5 - 0.02, 0.5 - winW * 0.5, inBay) * (1.0 - smoothstep(0.5 + winW * 0.5, 0.5 + winW * 0.5 + 0.02, inBay));
    float wy = smoothstep(0.28 - 0.02, 0.28, inFloor) * (1.0 - smoothstep(0.28 + winH, 0.28 + winH + 0.02, inFloor));
    float edgeX = step((face < 1.5 ? vSize.z : vSize.x) * 0.5 - 0.9, abs(vLocal.x));
    float win = wx * wy * step(0.0, fy) * step(vLocal.y, vSize.y - 0.6) * (1.0 - edgeX);
    // 远处像素太大时取窗的平均覆盖率
    float far = smoothstep(0.25, 1.2, px);
    win = mix(win, winW * winH * step(0.9, vLocal.y) * step(vLocal.y, vSize.y - 0.6) * 0.9, far);
    // 学校的走廊栏板（白色横带）
    if (kind > 1.5 && kind < 2.5) {
      float band = smoothstep(0.02, 0.0, abs(inFloor - 0.12) - 0.08);
      alb = mix(alb, vec3(0.86, 0.85, 0.82), band * (1.0 - far));
      // 一点点校色：蓝灰窗框
    }
    vec3 glassC = vec3(0.03, 0.035, 0.04);
    alb = mix(alb, glassC, win);
    glass = win;
    rough = mix(rough, 0.08, win);
    // 夜灯
    vec2 wid = vec2(bayI + face * 101.0, floorI);
    float lit = windowLit(wid, seed);
    // 学校：晚自习到 21:30，之后只剩零星几盏
    if (kind > 1.5 && kind < 2.5) lit *= (uLocalHour > 18.0 && uLocalHour < 21.5 ? 1.0 : 0.08);
    float warm = hash12(wid * 3.1 + seed);
    vec3 lc = warm < 0.7 ? vec3(1.0, 0.72, 0.46) : vec3(0.85, 0.9, 1.0);
    float bright = 0.0045 * (0.5 + hash12(wid + seed * 9.0));
    // 远处平均：亮窗比例 × 窗面积
    float litAvg = 0.45 * smoothstep(17.5, 20.0, uLocalHour) + 0.1;
    if (kind > 1.5 && kind < 2.5) litAvg *= (uLocalHour > 18.0 && uLocalHour < 21.5 ? 1.0 : 0.08);
    float litMix = mix(lit, litAvg, far);
    emit = lc * bright * win * litMix * smoothstep(0.15, 0.6, uNight);
    // 一楼店面（沿街民居）
    if (kind < 0.5 && floorI < 0.5 && vSize.x > 9.0 && seed > 0.4) {
      float shop = smoothstep(0.1, 0.12, inFloor) * (1.0 - smoothstep(0.78, 0.8, inFloor)) * (1.0 - far * 0.5);
      alb = mix(alb, vec3(0.05, 0.05, 0.06), shop * 0.8);
      emit += vec3(1.0, 0.78, 0.55) * 0.006 * shop * step(uLocalHour, 22.0) * smoothstep(0.2, 0.6, uNight);
    }
  }
#endif
  alb *= mix(1.0, 0.7, uWet * (1.0 - glass));
  float cs = cloudShadow(w.xz * 0.001);
  float ks = keyShadow(w, N);
  vec3 colr = shade(alb, N, w, ao, rough, max(wet, glass), cs, ks);
  colr += emit;
  colr = applyAtmos(colr, w);
  gl_FragColor = vec4(colr, 1.0);
}
#endif
