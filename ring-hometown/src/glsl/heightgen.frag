// ===== 地形高程生成（GPU，一次性）=====
// 依赖 common.glsl。输出：高程编码为 24 位定点（RGBA8），供 CPU 读回
uniform sampler2D tRiverD;   // 河流中心线距离（米），与输出同网格
uniform sampler2D tRailD;    // 铁路中线距离（米）
uniform vec4 uGrid;          // x0, z0, size, res
uniform float uIsFar;

varying vec2 vUv;

float riverLevel(float x) { return -63.0 - 0.00025 * clamp(x, -40000.0, 90000.0); }
float riverHalfW(float x) {
  float t = clamp((x + 8000.0) / 40000.0, 0.0, 1.0);
  return 24.0 + 34.0 * t + ((x > 400.0 && x < 3400.0) ? 6.0 : 0.0);
}

// 谷底半宽（米）
float valleyHalf(float x) {
  float w = 950.0;
  w = mix(w, 700.0, smoothstep(-1500.0, -7000.0, x));
  w = mix(w, 1750.0, smoothstep(1800.0, 8000.0, x));
  w = mix(w, 2600.0, smoothstep(8000.0, 13500.0, x));
  // 河谷出口：两侧山丘收拢
  w = mix(w, 620.0, smoothstep(14500.0, 17200.0, x) * (1.0 - smoothstep(19800.0, 23000.0, x)));
  w = mix(w, 7000.0, smoothstep(22000.0, 34000.0, x));
  return w;
}

float ridged2(vec2 p, int oct) {
  float s = 0.0, a = 0.5, prev = 1.0, n = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    float v = 1.0 - abs(vnoise2(p) * 2.0 - 1.0);
    v *= v;
    s += a * v * prev;
    prev = v;
    n += a;
    p = p * 2.07 + vec2(5.3, 1.7);
    a *= 0.5;
  }
  return s / n;
}

float segDist(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 u = b - a;
  t = clamp(dot(p - a, u) / dot(u, u), 0.0, 1.0);
  return length(p - a - u * t);
}

// 后山：从西北的山岭伸出的一道山脊，末端就是观察点
float spur(vec2 p, float floorH) {
  vec3 S[6];
  S[0] = vec3(-2600.0, -2100.0, 150.0);
  S[1] = vec3(-1550.0, -1300.0, 92.0);
  S[2] = vec3(-860.0, -640.0, 40.0);
  S[3] = vec3(-380.0, -220.0, 11.0);
  S[4] = vec3(0.0, 0.0, 0.0);
  S[5] = vec3(26.0, 18.0, -3.0);
  float best = -1e9;
  for (int i = 0; i < 5; i++) {
    float t;
    float d = segDist(p, S[i].xy, S[i + 1].xy, t);
    float hs = mix(S[i].z, S[i + 1].z, t);
    vec2 dir = normalize(S[i + 1].xy - S[i].xy);
    // 东南侧（朝向学校与河）更陡
    vec2 nrm = vec2(-dir.y, dir.x);
    float side = dot(p - S[i].xy, nrm);
    float w = side > 0.0 ? 108.0 : 270.0;
    if (i >= 3) w = side > 0.0 ? 100.0 : 190.0;
    // 末端之外也向东迅速下降
    if (i == 4 && t >= 1.0) w = 95.0;
    float prof = exp(-sq(d / w));
    float h = floorH + (hs - floorH) * prof;
    best = max(best, h);
  }
  // 山顶：观察点所在的小平台，向东、向南是陡坡（约 21°），视线可以越过坡顶看到山脚的学校
  float r = length(p - vec2(-3.0, 0.0));
  float cone = -0.385 * max(0.0, r - 4.0) - 0.0006 * sq(max(0.0, r - 4.0));
  cone = max(cone, floorH + 0.0);
  // 西北方向沿山脊缓缓抬升
  return max(min(best, cone + max(0.0, -p.x - p.y) * 0.32), cone);
}

float H(vec2 p, float dr, float drail) {
  float lvl = riverLevel(p.x);
  float hw = riverHalfW(p.x);
  // 谷底：近河处平，远离河略抬升
  float floorH = lvl + 3.2 + 1.4 * (vnoise2(p / 210.0) - 0.5) + 0.8 * (vnoise2(p / 47.0) - 0.5) + clamp(dr - 80.0, 0.0, 900.0) * 0.0035;
  vec2 q = p / 1000.0;
  float big = fbm2(q / 6.5 + vec2(3.1, 7.7), 4);
  float rid = ridged2(q / 2.4 + vec2(1.3, 4.2), 5);
  float det = fbm2(q * 1.7 + vec2(9.0, 2.0), 4);
  float amp = 25.0 + 260.0 * smoothstep(0.25, 0.75, big) + 150.0 * rid * smoothstep(0.3, 0.65, big) + 40.0 * det;
  // 河谷出口两侧的山更高一些
  amp *= 1.0 + 0.6 * smoothstep(13000.0, 17000.0, p.x) * (1.0 - smoothstep(21000.0, 25000.0, p.x));
  float W = valleyHalf(p.x);
  float t = smoothstep(W, W + 1500.0 + 1200.0 * big, dr);
  float hills = floorH + amp;
  float h = mix(floorH, hills, t);
  // 远处：起伏变缓并回到基准面（远景着色器假定地面在基准面附近）
  float r = length(p);
  float farT = smoothstep(32000.0, 84000.0, r);
  float plain = -10.0 + 70.0 * fbm2(q / 9.0 + 5.0, 4) - 20.0 * (1.0 - smoothstep(0.0, 3000.0, dr));
  h = mix(h, mix(plain, 0.0, smoothstep(60000.0, 86000.0, r)), farT);

  // 后山
  if (uIsFar < 0.5 || r < 4000.0) {
    float sp = spur(p, floorH);
    h = max(h, sp);
  }
  // 学校：平整的校园
  vec2 sc0 = vec2(165.0, -185.0), sc1 = vec2(525.0, 175.0);
  vec2 dd = max(max(sc0 - p, p - sc1), vec2(0.0));
  float ds = length(dd);
  float sm = 1.0 - smoothstep(0.0, 22.0, ds);
  h = mix(h, -59.2, sm);
  if (uIsFar > 0.5) return h;
  // 铁路：路基或路堑
  float grade = lvl + 5.6;
  float rb = 1.0 - smoothstep(7.0, 24.0 + abs(h - grade) * 1.4, drail);
  h = mix(h, grade, rb);
  // 河道
  float bank = smoothstep(hw - 2.0, hw + 9.0, dr);
  float bed = lvl - 0.4 - 2.6 * (1.0 - sq(clamp(dr / hw, 0.0, 1.0)));
  h = mix(bed, h, bank);
  // 河岸靠水处不高过水面太多
  h = min(h, mix(lvl + 0.6, h, smoothstep(hw + 2.0, hw + 22.0, dr)));
  return h;
}

void main() {
  ivec2 ij = ivec2(gl_FragCoord.xy);
  float cell = uGrid.z / uGrid.w;
  vec2 p = uGrid.xy + (vec2(ij) + 0.5) * cell;
  float dr = texelFetch(tRiverD, ij, 0).r;
  float drl = texelFetch(tRailD, ij, 0).r;
  float h = H(p, dr, drl);
  float v = clamp((h + 1000.0) / 3000.0, 0.0, 1.0) * 16777215.0;
  float r = floor(v / 65536.0);
  float g = floor((v - r * 65536.0) / 256.0);
  float b = floor(v - r * 65536.0 - g * 256.0);
  gl_FragColor = vec4(r, g, b, 255.0) / 255.0;
}
