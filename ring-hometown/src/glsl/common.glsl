// ===== 公共常数与噪声 =====
#define PI 3.14159265358979
#define TAU 6.28318530717959
const float RING_R = 50000.0;   // 环半径 km
const float HALF_W = 500.0;     // 环带半宽 km
const float WALL_H = 50.0;      // 边墙高 km

float sat(float x) { return clamp(x, 0.0, 1.0); }
vec3 sat3(vec3 x) { return clamp(x, 0.0, 1.0); }
float sq(float x) { return x * x; }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// Hash without sine（与 weather.ts 中 hash3 一致）
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float vnoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = hash13(i);
  float b = hash13(i + vec3(1.0, 0.0, 0.0));
  float c = hash13(i + vec3(0.0, 1.0, 0.0));
  float d = hash13(i + vec3(1.0, 1.0, 0.0));
  float e = hash13(i + vec3(0.0, 0.0, 1.0));
  float f1 = hash13(i + vec3(1.0, 0.0, 1.0));
  float g = hash13(i + vec3(0.0, 1.0, 1.0));
  float h = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y), mix(mix(e, f1, u.x), mix(g, h, u.x), u.y), u.z);
}

// x、z 方向以 period 为周期的 3D 值噪声（与 weather.ts 中 vnoise3 一致）
float vnoise3p(vec3 p, float period) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, period), x1 = mod(i.x + 1.0, period);
  float z0 = mod(i.z, period), z1 = mod(i.z + 1.0, period);
  float a = hash13(vec3(x0, i.y, z0));
  float b = hash13(vec3(x1, i.y, z0));
  float c = hash13(vec3(x0, i.y + 1.0, z0));
  float d = hash13(vec3(x1, i.y + 1.0, z0));
  float e = hash13(vec3(x0, i.y, z1));
  float f1 = hash13(vec3(x1, i.y, z1));
  float g = hash13(vec3(x0, i.y + 1.0, z1));
  float h = hash13(vec3(x1, i.y + 1.0, z1));
  float l0 = mix(a, b, u.x);
  float l1 = mix(c, d, u.x);
  float l2 = mix(e, f1, u.x);
  float l3 = mix(g, h, u.x);
  return mix(mix(l0, l1, u.y), mix(l2, l3, u.y), u.z);
}

// 梯度噪声（-1..1 左右）
float gnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec3 g000 = hash33(i) * 2.0 - 1.0;
  vec3 g100 = hash33(i + vec3(1, 0, 0)) * 2.0 - 1.0;
  vec3 g010 = hash33(i + vec3(0, 1, 0)) * 2.0 - 1.0;
  vec3 g110 = hash33(i + vec3(1, 1, 0)) * 2.0 - 1.0;
  vec3 g001 = hash33(i + vec3(0, 0, 1)) * 2.0 - 1.0;
  vec3 g101 = hash33(i + vec3(1, 0, 1)) * 2.0 - 1.0;
  vec3 g011 = hash33(i + vec3(0, 1, 1)) * 2.0 - 1.0;
  vec3 g111 = hash33(i + vec3(1, 1, 1)) * 2.0 - 1.0;
  float n000 = dot(g000, f);
  float n100 = dot(g100, f - vec3(1, 0, 0));
  float n010 = dot(g010, f - vec3(0, 1, 0));
  float n110 = dot(g110, f - vec3(1, 1, 0));
  float n001 = dot(g001, f - vec3(0, 0, 1));
  float n101 = dot(g101, f - vec3(1, 0, 1));
  float n011 = dot(g011, f - vec3(0, 1, 1));
  float n111 = dot(g111, f - vec3(1, 1, 1));
  return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y), mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}

float gnoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash22(i) * 2.0 - 1.0;
  vec2 gb = hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 gc = hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
  vec2 gd = hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  return mix(mix(va, vb, u.x), mix(vc, vd, u.x), u.y);
}

float fbm2(vec2 p, int oct) {
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= oct) break;
    s += a * vnoise2(p);
    n += a;
    p = p * 2.03 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return s / n;
}

// 线宽覆盖率：dist 为到线中心距离，hw 为半宽，hp 为半个像素（同一单位）
float lineCov(float dist, float hw, float hp) {
  return clamp((min(dist + hp, hw) - max(dist - hp, -hw)) / (2.0 * hp), 0.0, 1.0);
}

// 人工昼夜：本地时 → 调光进度
float dayRamp(float h) {
  h = mod(h, 24.0);
  if (h < 4.5 || h >= 19.5) return 0.0;
  if (h < 7.5) return smoothstep(0.0, 1.0, (h - 4.5) / 3.0);
  if (h < 16.5) return 1.0;
  return smoothstep(0.0, 1.0, (19.5 - h) / 3.0);
}
float dayIntensity(float h) {
  float s = dayRamp(h);
  return (exp(5.6 * s) - 1.0) / (exp(5.6) - 1.0);
}
vec3 mirrorTint(float h) {
  float w = 1.0 - dayRamp(h);
  return vec3(1.0, 0.965 - 0.07 * w, 0.925 - 0.16 * w);
}
