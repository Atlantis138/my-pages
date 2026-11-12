// ===== 近景（米制）公共光照：环境光、镜光、对岸光、恒星斜光、云影、阴影、路灯、空气透视、河谷雾 =====
// 依赖：common.glsl、atmos.glsl、clouds.glsl
uniform sampler2D tEnv;
uniform sampler2D tShadowKey;
uniform mat4 uShadowKeyMat;
uniform float uShadowKeyOn;
uniform vec2 uShadowKeyTexel;
uniform sampler2D tShadowStar;
uniform mat4 uShadowStarMat;
uniform float uShadowStarOn;
uniform vec2 uShadowStarTexel;
uniform sampler2D tTown;
uniform vec4 uTownGrid;
uniform float uNight;
uniform float uWet;
uniform vec2 uWind;
uniform float uTimeS;
uniform float uFogTop;
uniform float uPixAng;
uniform vec3 uStarGround;

#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
varying float vFragDepth;
#endif

#ifdef SHADOW_PASS
uniform mat4 uShadowPassMat;
float shadowPassDepth(vec3 w) {
  vec4 c = uShadowPassMat * vec4(w, 1.0);
  return c.z / c.w * 0.5 + 0.5;
}
#define SHADOW_OUT(w) gl_FragColor = vec4(shadowPassDepth(w), 0.0, 0.0, 1.0); return;
#else
#define SHADOW_OUT(w)
#endif

vec2 equirectUV(vec3 d) {
  return vec2(atan(d.x, -d.z) / TAU + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5);
}
vec3 envDiffuse(vec3 n) {
  // 低层 mip 近似漫反射辐照度；向下的部分以地面反照近似
  vec3 up = textureLod(tEnv, equirectUV(normalize(vec3(n.x, max(n.y, 0.05), n.z))), 5.2).rgb;
  float g = sat(-n.y * 0.5 + 0.5);
  vec3 ground = (uMirrorE * 0.06 + uArchE * 0.05) * vec3(0.8, 0.9, 0.7);
  return mix(up * PI * 0.92, ground * PI, g * 0.85);
}
vec3 envSpec(vec3 r, float rough) {
  r.y = max(r.y, 0.002);
  return textureLod(tEnv, equirectUV(normalize(r)), rough * 5.5).rgb;
}

float riverLevelM(float x) { return -63.0 - 0.00025 * clamp(x, -40000.0, 90000.0); }
float riverHalfWM(float x) {
  float t = clamp((x + 8000.0) / 40000.0, 0.0, 1.0);
  return 24.0 + 34.0 * t + ((x > 400.0 && x < 3400.0) ? 6.0 : 0.0);
}

float townDensityM(vec2 p) {
  float d = 0.0;
  d = max(d, 1.0 * max(0.0, 1.0 - sq((p.x - 1500.0) / 1500.0) - sq((p.y - 120.0) / 520.0)));
  d = max(d, 0.85 * max(0.0, 1.0 - sq((p.x - 2600.0) / 900.0) - sq((p.y - 500.0) / 520.0)));
  d = max(d, 0.75 * max(0.0, 1.0 - sq((p.x - 1600.0) / 900.0) - sq((p.y - 1050.0) / 300.0)));
  d = max(d, 0.9 * max(0.0, 1.0 - sq((p.x - 900.0) / 520.0) - sq((p.y + 330.0) / 200.0)));
  return min(1.0, d * 1.6);
}

// 镇区纹理：r=道路距离场，g=铺装距离场，b=路灯光，a=绿地
vec4 townTex(vec2 p) {
  vec2 uv = (p - uTownGrid.xy) / uTownGrid.z;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(1.0, 1.0, 0.0, 0.0);
  return texture(tTown, uv);
}
float roadSDF(vec4 t) { return (t.r - 0.5) * 32.0; }
float paveSDF(vec4 t) { return (t.g - 0.5) * 32.0; }

float pcf(sampler2D tex, vec2 uv, float d, vec2 texel, float radius) {
  float s = 0.0;
  const vec2 P[8] = vec2[8](vec2(-0.613, 0.617), vec2(0.17, -0.94), vec2(0.91, 0.32), vec2(-0.87, -0.42),
                            vec2(0.38, 0.79), vec2(-0.25, -0.31), vec2(0.6, -0.55), vec2(-0.4, 0.15));
  for (int i = 0; i < 8; i++) {
    float z = texture(tex, uv + P[i] * texel * radius).r;
    s += d <= z ? 1.0 : 0.0;
  }
  return s / 8.0;
}

float keyShadow(vec3 w, vec3 n) {
  if (uShadowKeyOn < 0.5) return 1.0;
  vec4 c = uShadowKeyMat * vec4(w + n * 0.35, 1.0);
  vec3 s = c.xyz / c.w;
  vec2 uv = s.xy * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  float d = s.z * 0.5 + 0.5 - 0.0004;
  // 镜云是一大片光源：影子边缘柔和
  return pcf(tShadowKey, uv, d, uShadowKeyTexel, 2.4);
}

float starShadow(vec3 w, vec3 n) {
  if (uShadowStarOn < 0.5) return 1.0;
  vec4 c = uShadowStarMat * vec4(w + n * 0.6, 1.0);
  vec3 s = c.xyz / c.w;
  vec2 uv = s.xy * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  float d = s.z * 0.5 + 0.5 - 0.0006;
  return pcf(tShadowStar, uv, d, uShadowStarTexel, 1.5);
}

// 地面上一点得到的恒星光（含南墙遮挡比例与低角度大气消光）
vec3 starLightAt(vec3 w) {
  if (uStarE.r <= 0.0) return vec3(0.0);
  float vis = starVisAt(w.z * 0.001, max(w.y * 0.001, 0.0));
  if (vis <= 0.0) return vec3(0.0);
  vec3 T = exp(-tauUp(max(w.y * 0.001, 0.0)) / max(uStarDir.y + 0.015, 0.03));
  float cloud = 1.0 - 0.85 * uCloudCover * (0.4 + 0.6 * uStratus);
  // 露出的只是一线上缘，真实照度很弱；这里放大数倍，让低斜的光与长影看得出来
  return uStarE * T * vis * cloud * 12.0;
}

vec3 lampLight(vec3 w) {
  if (uNight < 0.05) return vec3(0.0);
  float l = townTex(w.xz).b;
  l = l * l;
  return vec3(1.0, 0.7, 0.42) * l * 0.0022 * smoothstep(0.05, 0.35, uNight);
}

// 不透明表面的总光照（返回出射辐亮度）
vec3 shade(vec3 alb, vec3 n, vec3 w, float ao, float rough, float wet, float cs, float ks) {
  vec3 V = normalize(cameraPosition - w);
  // 镜光：近天顶的大面积光源
  float nd = max(dot(n, uMirrorDir), 0.0);
  vec3 col = alb * uMirrorE * nd * ks * cs / PI;
  // 对岸光：同样来自头顶一侧
  float na = max(dot(n, uArchDir), 0.0) * 0.85 + 0.15;
  col += alb * uArchE * na * mix(1.0, ks, 0.6) / PI;
  // 天空漫射
  col += alb * envDiffuse(n) * ao / PI;
  // 恒星斜光
  vec3 sl = starLightAt(w);
  if (sl.r > 0.0) col += alb * sl * max(dot(n, uStarDir), 0.0) * starShadow(w, n) / PI;
  // 路灯
  col += alb * lampLight(w) * ao;
  // 湿润时的镜面反射
  float F = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
  float specAmt = mix(0.04, 0.9, wet) * (1.0 - rough * 0.8);
  vec3 R = reflect(-V, n);
  col += envSpec(R, mix(rough, 0.05, wet)) * F * specAmt * ao;
  return col;
}

// 河谷雾：沿视线在雾层（河面以上 uFogTop 米）内积分
vec4 valleyFog(vec3 c, vec3 w) {
  if (uFogNow < 0.01) return vec4(0.0, 0.0, 0.0, 1.0);
  float top = riverLevelM(0.5 * (c.x + w.x)) + uFogTop;
  float t0 = 0.0, t1 = 1.0;
  if (c.y > top) {
    if (w.y > top) return vec4(0.0, 0.0, 0.0, 1.0);
    t0 = (c.y - top) / max(c.y - w.y, 1e-3);
  } else if (w.y > top) {
    t1 = (top - c.y) / max(w.y - c.y, 1e-3);
  }
  float L = length(w - c) * (t1 - t0);
  float tau = 0.0;
  vec3 glow = vec3(0.0);
  vec2 drift = uWind * uTimeS * 0.35;
  for (int i = 0; i < 6; i++) {
    float t = mix(t0, t1, (float(i) + 0.5) / 6.0);
    vec3 q = mix(c, w, t);
    float hr = q.y - riverLevelM(q.x);
    float n = vnoise2((q.xz - drift) / 260.0) * 0.55 + vnoise2((q.xz - drift * 1.3) / 80.0) * 0.3 + vnoise2((q.xz - drift * 1.7) / 23.0) * 0.15;
    // 雾层上部稀薄、成缕，下部浓
    float top = uFogTop * (0.75 + 0.5 * n);
    float dens = uFogNow * 0.011 * smoothstep(top, top * 0.2, hr) * smoothstep(0.25, 0.75, n + 0.25 * (1.0 - hr / uFogTop));
    tau += dens * L / 6.0;
    glow += lampLight(q) * dens;
  }
  float T = exp(-tau);
  vec3 fogL = (uMirrorE * 0.42 * underCloudLightA(0.0) + uAmbSky * 0.8 + uArchE * 0.9 + uStarGround * 0.15) / PI * vec3(0.95, 0.97, 1.0);
  // 雾中的路灯光晕
  vec3 lampFog = glow * (L / 6.0) * 0.35 * exp(-tau * 0.5);
  return vec4(fogL * (1.0 - T) + lampFog, T);
}

// 空气透视 + 河谷雾
vec3 applyAtmos(vec3 col, vec3 w) {
  vec3 camK = cameraPosition * 0.001;
  vec3 pK = w * 0.001;
  vec3 ins;
  vec3 T = aerial(camK, pK, ins);
  col = col * T + ins;
  vec4 f = valleyFog(cameraPosition, w);
  return col * f.a + f.rgb;
}
