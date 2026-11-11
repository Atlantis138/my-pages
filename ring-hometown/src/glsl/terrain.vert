// ===== 地形顶点：极坐标网格按高程图抬升，并加上环面向上弯起的曲率 =====
uniform sampler2D tHN;
uniform sampler2D tHF;
uniform vec4 uGridN;
uniform vec4 uGridF;
varying vec3 vW;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif

float texH(sampler2D t, vec4 g, vec2 p) {
  vec2 uv = (p - g.xy) / g.z * g.w - 0.5;
  vec2 i = floor(uv);
  vec2 f = uv - i;
  int R = int(g.w) - 1;
  ivec2 i0 = clamp(ivec2(i), ivec2(0), ivec2(R));
  ivec2 i1 = clamp(ivec2(i) + 1, ivec2(0), ivec2(R));
  float a = texelFetch(t, ivec2(i0.x, i0.y), 0).r;
  float b = texelFetch(t, ivec2(i1.x, i0.y), 0).r;
  float c = texelFetch(t, ivec2(i0.x, i1.y), 0).r;
  float d = texelFetch(t, ivec2(i1.x, i1.y), 0).r;
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float nearWeight(vec2 p) {
  vec2 lo = uGridN.xy;
  vec2 hi = uGridN.xy + uGridN.z;
  float m = min(min(p.x - lo.x, hi.x - p.x), min(p.y - lo.y, hi.y - p.y));
  return smoothstep(0.0, 800.0, m);
}

float terrainHeight(vec2 p) {
  float w = nearWeight(p);
  float hf = texH(tHF, uGridF, p);
  if (w <= 0.0) return hf;
  float hn = texH(tHN, uGridN, p);
  return mix(hf, hn, w);
}

void main() {
  vec2 p = position.xz;
  float h = terrainHeight(p);
  // 观察点附近的微地形
  float r = length(p);
  if (r < 260.0) h += (vnoise2(p * 0.33) - 0.5) * 0.22 * (1.0 - smoothstep(50.0, 260.0, r));
  vW = vec3(p.x, h, p.y);
  vec3 wp = vec3(p.x, h + p.x * p.x * 1.0e-8, p.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
