// ===== 大气与光照公共项（长度单位 km） =====
const vec3 BR = vec3(5.802e-3, 13.558e-3, 33.1e-3); // 瑞利散射系数 /km
const float HR = 8.0;
const float HM = 1.2;

uniform float uMieK;      // 米氏散射系数 /km（随天气）
uniform float uMieG;
uniform float uRainExt;   // 降雨带来的灰色消光 /km（近地层）
uniform vec3 uDayE;       // 满昼镜光照度（颜色）
uniform vec3 uMirrorE;    // 本地镜光照度
uniform vec3 uMirrorDir;  // 镜光来向（近天顶）
uniform vec3 uArchE;      // 对岸光照度
uniform vec3 uArchDir;
uniform vec3 uStarDir;    // 恒星本地方向
uniform vec3 uStarE;      // 恒星整盘照度（大气外）
uniform float uStarAlpha; // 恒星角半径
uniform float uLocalHour;
uniform vec3 uAmbSky;     // 天空漫射（多次散射）照度近似
uniform float uArchMax;   // 对岸光最大值（标量，用于远处的夜间光）

float phaseR(float mu) { return 0.0596831 * (1.0 + mu * mu); }
float phaseM(float mu, float g) {
  float g2 = g * g;
  float d = max(1.0 + g2 - 2.0 * g * mu, 1e-4);
  return 0.0795775 * (1.0 - g2) / (d * sqrt(d));
}
vec3 mieExt() { return vec3(uMieK * 1.11); }

// 竖直方向上，高度 h 以上的光学厚度
vec3 tauUp(float h) {
  return BR * HR * exp(-h / HR) + mieExt() * HM * exp(-h / HM);
}

// 恒星露出比例（带临边昏暗的近似），x = 露出高度 / 角半径
float starDiskFrac(float x) {
  x = clamp(x, 0.0, 2.0);
  float y = 1.0 - x;
  float A = (acos(y) - y * sqrt(max(0.0, 1.0 - y * y))) / PI;
  float c = mix(0.5 + 0.375 * sqrt(2.0 * x), 1.0, smoothstep(0.0, 2.0, x));
  return clamp(A * c, 0.0, 1.0);
}

// 位于 (z, h)（km，z 向南为正）处看到的恒星露出比例：南墙在 z = +500
float starVisAt(float zK, float hK) {
  float es = asin(clamp(uStarDir.y, -1.0, 1.0));
  float dz = max(HALF_W - zK, 0.5);
  float w = atan(WALL_H - hK, dz);
  return starDiskFrac((es + uStarAlpha - w) / uStarAlpha);
}

// 云层以下空气的平均受光（与 clouds.glsl 中 underCloudLight 相同；这里单独声明所需 uniform）
uniform float uCloudCover;
uniform float uCloudBase;
uniform float uCloudThick;
uniform float uCloudDark;
uniform float uStratus;
float underCloudLightA(float hKm) {
  float shade = 1.0 - uCloudCover * (0.45 + 0.5 * uStratus) * (1.0 + uCloudDark) * 0.7;
  return mix(clamp(shade, 0.08, 1.0), 1.0, smoothstep(uCloudBase, uCloudBase + uCloudThick, hKm));
}

// 近处物体的空气透视（解析的指数大气，忽略曲率）。
// camK：相机位置（km），pK：物体位置（km）。返回透射率，inscat 输出散射光。
vec3 aerial(vec3 camK, vec3 pK, out vec3 inscat) {
  vec3 dv = pK - camK;
  float s = length(dv);
  vec3 d = dv / max(s, 1e-6);
  float h0 = camK.y;
  float k = d.y;
  float iR, iM;
  if (abs(k) > 1e-4) {
    iR = HR / k * (exp(-h0 / HR) - exp(-(h0 + k * s) / HR));
    iM = HM / k * (exp(-h0 / HM) - exp(-(h0 + k * s) / HM));
  } else {
    iR = s * exp(-h0 / HR);
    iM = s * exp(-h0 / HM);
  }
  float rainPath = s * uRainExt;
  vec3 tau = BR * iR + mieExt() * iM + vec3(rainPath);
  vec3 T = exp(-tau);
  float hm = max(h0 + 0.5 * k * s, 0.0);
  vec3 Tsun = exp(-tauUp(hm)) * underCloudLightA(hm);
  float mu = dot(d, uMirrorDir);
  vec3 scR = BR * iR;
  vec3 scM = vec3(uMieK * iM);
  vec3 single = (scR * phaseR(mu) + scM * phaseM(mu, uMieG)) * uMirrorE * Tsun;
  // 对岸光、天光（多次散射近似）按各向同性处理
  vec3 iso = (scR + scM + vec3(rainPath * 0.9)) * 0.0795775 * (uArchE * 1.2 + uAmbSky);
  // 恒星（近地面以观察点的可见度为准，由调用方另行提供时可覆盖）
  float muS = dot(d, uStarDir);
  float vis = starVisAt(0.5 * (camK.z + pK.z), hm);
  vec3 Ts = exp(-tauUp(hm) / max(uStarDir.y + 0.02, 0.03));
  vec3 star = (scR * phaseR(muS) + scM * phaseM(muS, uMieG)) * uStarE * Ts * vis;
  vec3 frac = (1.0 - T) / max(tau, vec3(1e-6));
  inscat = (single + iso + star) * frac;
  return T;
}
