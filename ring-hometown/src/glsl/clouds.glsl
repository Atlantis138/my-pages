// ===== 本地低云场（与 weather.ts 的 cloudField 一致），uv 单位 km =====
uniform float uShowers;
uniform float uHighCloud;
uniform vec2 uCloudOff;
uniform float uCloudEvo;
uniform float uRain;
uniform float uFogNow;

float cloudField2(vec2 uv) {
  float sx = (uv.x - uCloudOff.x) / 3.2;
  float sz = (uv.y - uCloudOff.y) / 3.2;
  float n = 0.0, amp = 0.5, f = 1.0, nrm = 0.0;
  for (int i = 0; i < 4; i++) {
    n += amp * vnoise3p(vec3(sx * f, uCloudEvo * f * 0.7 + float(i) * 17.0, sz * f), 1440.0 * f);
    nrm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  n /= nrm;
  float cell = vnoise3p(vec3((uv.x - uCloudOff.x) / 14.4, uCloudEvo * 0.5 + 91.0, (uv.y - uCloudOff.y) / 14.4), 320.0);
  n = n * (1.0 - 0.45 * uShowers) + cell * 0.45 * uShowers;
  float thr = 1.0 - uCloudCover;
  return sat((n - thr * 0.92 - 0.04) / 0.22);
}

// 云影：镜光从头顶照下，云影就在云的正下方（uv：km）
float cloudShadow(vec2 uv) {
  if (uCloudCover < 0.01) return 1.0;
  float c = cloudField2(uv);
  float tau = c * uCloudThick * 9.0 * (1.0 + 2.0 * uCloudDark) + uStratus * uCloudCover * 3.0;
  return exp(-tau);
}

// 云层以下的空气平均受光比例（镜光被云挡掉的部分）
float underCloudLight(float hKm) {
  float shade = 1.0 - uCloudCover * (0.45 + 0.5 * uStratus) * (1.0 + uCloudDark) * 0.7;
  return mix(clamp(shade, 0.08, 1.0), 1.0, smoothstep(uCloudBase, uCloudBase + uCloudThick, hKm));
}
