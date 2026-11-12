// ===== 远景：整条环带的程序化地图（单位 km；θ 以小镇为 0，向东为正） =====
uniform vec4 uSeasonA;   // x 叶量, y 秋色, z 枯黄, w 新绿
uniform vec4 uSeasonB;   // x 金黄, y 空田, z 花期, w 冷暖(-1..1)
uniform float uFarTime;  // 小时（远处云的漂移）
uniform float uFarCloudBias;

float wnd(float x, float a, float b, float s) {
  return smoothstep(a - s, a + s, x) * (1.0 - smoothstep(b - s, b + s, x));
}

// 按像素足迹淡出高频的分形梯度噪声
float fbmL(vec3 p, float wl0, float fp, int maxOct) {
  float s = 0.0;
  float a = 0.5;
  float wl = wl0;
  vec3 q = p / wl0;
  for (int i = 0; i < 11; i++) {
    if (i >= maxOct) break;
    float w = sat((wl / max(fp, 1e-3) - 2.0) * 0.5);
    if (w <= 0.0) break;
    s += a * w * gnoise3(q);
    q = q * 2.02 + vec3(13.7, 7.1, 3.3);
    wl *= 0.495;
    a *= 0.5;
  }
  return s;
}

float ridgedL(vec3 p, float wl0, float fp, int maxOct) {
  float s = 0.0;
  float a = 0.5;
  float wl = wl0;
  vec3 q = p / wl0;
  float prev = 1.0;
  for (int i = 0; i < 9; i++) {
    if (i >= maxOct) break;
    float w = sat((wl / max(fp, 1e-3) - 2.0) * 0.5);
    float n = 1.0 - abs(gnoise3(q) * 1.6);
    n = n * n;
    if (w > 0.0) s += a * w * n * prev;
    prev = n;
    q = q * 2.03 + vec3(5.3, 11.9, 2.1);
    wl *= 0.49;
    a *= 0.5;
  }
  return s;
}

// 辐条落点附近的「辐条城」
float spokeCity(float deg, float zK) {
  float c = 0.0;
  for (int k = 0; k < 6; k++) {
    float lon = -35.0 + 60.0 * float(k);
    float dd = mod(deg - lon + 540.0, 360.0) - 180.0;
    float du = radians(dd) * RING_R;
    c += exp(-sq(du / 140.0) - sq(zK / 210.0));
  }
  return c;
}

struct FarInfo {
  vec3 rad;      // 地表（含远处云）辐亮度，未计入大气
  float cloud;   // 远处云量
  float water;
};

// hourLoc：该处本地时；graze：视线与地面的夹角正弦
FarInfo farSurface(float th, float zK, float fp, float hourLoc, float graze) {
  FarInfo o;
  float deg = degrees(th);
  vec3 P = vec3(sin(th) * RING_R, cos(th) * RING_R, zK);

  // ---------- 海陆 ----------
  float bias = 0.0;
  bias += 0.62 * wnd(deg, -13.0, 13.0, 2.5);
  float farOcean = sat(smoothstep(136.0, 147.0, deg) + smoothstep(-139.0, -150.0, deg));
  bias -= 0.72 * farOcean;
  bias -= 0.70 * wnd(deg, 14.5, 22.5, 1.2) * smoothstep(400.0, 250.0, abs(zK - 60.0));
  bias -= 0.62 * wnd(deg, -31.5, -19.0, 1.6);
  bias -= 0.38 * wnd(deg, 97.0, 108.0, 2.5) * smoothstep(320.0, 140.0, abs(zK + 160.0));
  bias -= 0.30 * wnd(deg, 56.0, 61.0, 1.0) * smoothstep(220.0, 90.0, abs(zK - 210.0));
  // 远洋中的群岛：辐条落点在岛上
  float isl = spokeCity(deg, zK);
  bias += farOcean * (0.9 * smoothstep(0.08, 0.7, isl) + 0.5 * smoothstep(0.35, 0.62, vnoise3(P / 260.0 + 3.1)));
  // 边墙下的狭长陆缘
  bias += 0.35 * smoothstep(440.0, 492.0, abs(zK));

  float cont = fbmL(P, 2400.0, fp, 10) * 1.3 + 0.1 + bias;
  float land = smoothstep(-0.012, 0.012, cont);
  if (fp > 60.0) land = smoothstep(-fp * 0.0004, fp * 0.0004, cont);
  float shore = 1.0 - smoothstep(0.0, 0.07, abs(cont));
  o.water = 1.0 - land;

  // ---------- 地形与生物群落 ----------
  float mtn = wnd(deg, 30.0, 52.0, 4.0) * 1.0 + wnd(deg, -76.0, -61.0, 3.0) * 0.8 +
              wnd(deg, 112.0, 134.0, 4.0) * 1.15 + wnd(deg, -137.0, -121.0, 3.0) * 0.7 +
              wnd(deg, 66.0, 74.0, 2.0) * 0.45;
  float rid = ridgedL(P, 380.0, fp, 7);
  float hills = fbmL(P + 77.0, 700.0, fp, 6);
  float elev = land * max(0.0, 0.12 + 0.55 * hills + cont * 0.6 + mtn * rid * 4.6);

  float desert = wnd(deg, -58.0, -41.0, 3.0);
  float steppe = wnd(deg, 51.0, 81.0, 4.0);
  float lush = wnd(deg, 85.0, 114.0, 4.0);
  float boreal = wnd(deg, -143.0, -99.0, 5.0);
  float plain = wnd(deg, -98.0, -77.0, 3.0) + wnd(deg, -16.0, 16.0, 3.0) * 0.7 + wnd(deg, 23.0, 30.0, 2.0) * 0.6;

  float mosaic = fbmL(P + 311.0, 160.0, fp, 6);
  float forestF = sat(0.5 + mosaic * 1.8 - plain * 0.45 - steppe * 0.6 - desert * 0.9 + boreal * 0.35 + lush * 0.25 + mtn * 0.2);

  // 季节色
  vec3 forestC = mix(vec3(0.030, 0.058, 0.024), vec3(0.035, 0.07, 0.03), uSeasonA.w);
  forestC = mix(forestC, vec3(0.11, 0.075, 0.03), uSeasonA.y * 0.75);
  forestC = mix(vec3(0.055, 0.055, 0.045), forestC, sat(uSeasonA.x * 1.3));
  vec3 borealC = vec3(0.022, 0.04, 0.026);
  vec3 grassC = mix(vec3(0.075, 0.12, 0.04), vec3(0.11, 0.16, 0.05), uSeasonA.w);
  grassC = mix(grassC, vec3(0.16, 0.14, 0.07), uSeasonA.z);
  vec3 farmC = mix(grassC, vec3(0.22, 0.19, 0.08), uSeasonB.x * 0.35);
  farmC = mix(farmC, vec3(0.17, 0.14, 0.09), uSeasonB.y * 0.6);
  farmC = mix(farmC, vec3(0.32, 0.30, 0.05), uSeasonB.z * 0.35);
  vec3 steppeC = vec3(0.21, 0.18, 0.10);
  vec3 desertC = vec3(0.40, 0.31, 0.19);
  vec3 lushC = vec3(0.03, 0.075, 0.03);
  vec3 rockC = vec3(0.17, 0.16, 0.15);
  vec3 snowC = vec3(0.78, 0.8, 0.84);

  float patchN = vnoise3(P / 18.0);
  vec3 openC = mix(grassC, farmC, sat(plain + 0.3) * smoothstep(0.3, 0.7, patchN));
  vec3 alb = mix(openC, forestC, forestF);
  alb = mix(alb, borealC, boreal * forestF);
  alb = mix(alb, lushC, lush * 0.7);
  alb = mix(alb, steppeC, steppe * (1.0 - forestF * 0.6));
  alb = mix(alb, desertC, desert * (0.7 + 0.3 * patchN));
  float rocky = sat((elev - 1.4) / 1.6) * sat(mtn * 1.5);
  alb = mix(alb, rockC, rocky);
  float snowLine = 3.3 - 0.5 * (1.0 - uSeasonB.w) * 0.5 - 0.7 * sat(-uSeasonB.w);
  float snow = smoothstep(snowLine - 0.2, snowLine + 0.4, elev + 0.25 * gnoise3(P / 30.0));
  alb = mix(alb, snowC, snow);

  // 河流
  float rn = gnoise3(P / 1500.0 + vec3(4.0, 1.0, 7.0)) + 0.35 * gnoise3(P / 420.0);
  float rdist = abs(rn) * 900.0;
  float riverW = 1.8 + 1.5 * sat(1.0 - elev);
  float river = lineCov(rdist, riverW, max(fp * 0.5, 0.05)) * land * (1.0 - desert * 0.8) * (1.0 - rocky) * step(elev, 1.6);

  // 城镇
  float cityN = vnoise3(P / 48.0);
  float city = smoothstep(0.7, 0.92, cityN) * land * (1.0 - sat(mtn * rid * 2.0)) * (1.0 - desert * 0.6) * (0.55 + 0.9 * shore + 0.6 * lush + 0.4 * plain);
  city += spokeCity(deg, zK) * 1.6 * land;
  city += 0.25 * smoothstep(0.55, 0.8, vnoise3(P / 11.0)) * land * (0.3 + plain + lush) * (1.0 - desert);
  alb = mix(alb, vec3(0.15, 0.145, 0.14), sat(city * 0.5));

  // 水体
  vec3 deepC = vec3(0.006, 0.018, 0.04);
  vec3 shallowC = vec3(0.02, 0.065, 0.075);
  vec3 waterC = mix(deepC, shallowC, smoothstep(-0.2, 0.0, cont));
  alb = mix(alb, waterC, max(o.water, river * 0.85));
  float wat = max(o.water, river * 0.85);

  // ---------- 光照：该经度的本地时 ----------
  float di = dayIntensity(hourLoc);
  vec3 E = uDayE * mirrorTint(hourLoc) * di;
  float nightLoc = dayIntensity(hourLoc + 12.0);
  vec3 En = vec3(0.75, 0.82, 1.0) * uArchMax * nightLoc;
  vec3 Etot = E + En;
  float slope = 1.0 - 0.18 * sat(rid * mtn);
  vec3 surf = alb * (Etot * slope * 1.18) / PI;
  // 水面：反射该处天空与镜光
  float fres = 0.02 + 0.98 * pow(1.0 - sat(graze), 5.0);
  surf += wat * Etot * (0.012 + 0.06 * fres) * vec3(0.55, 0.7, 1.0);

  // ---------- 远处的云 ----------
  vec3 Pc = P + vec3(uFarTime * 23.0, -uFarTime * 17.0, uFarTime * 2.5);
  vec3 wq = Pc / 900.0;
  Pc += vec3(gnoise3(wq), gnoise3(wq + 5.2), gnoise3(wq + 9.1)) * 380.0;
  float cb = fbmL(Pc, 620.0, fp, 7);
  vec3 bq = vec3(P.x / 2300.0, P.y / 2300.0, zK / 75.0) + vec3(0.0, uFarTime * 0.004, 0.0);
  bq += vec3(gnoise3(bq * 1.9 + 3.0), gnoise3(bq * 1.9 + 9.0), gnoise3(bq * 1.3 + 1.0) * 2.0) * 0.6;
  float band = gnoise3(bq) + 0.5 * gnoise3(bq * 2.3 + 4.0);
  float wallBand = exp(-sq((HALF_W - abs(zK)) / 55.0));
  float cv = cb * 1.1 + band * 0.35 + wallBand * 0.5 + o.water * 0.1 + mtn * 0.12 + lush * 0.1 - desert * 0.3 + uFarCloudBias;
  float cloud = smoothstep(0.12, 0.42, cv);
  // 斜看时云的侧面遮住更多地面
  cloud = 1.0 - pow(1.0 - cloud, 1.0 / clamp(graze * 2.2 + 0.18, 0.25, 1.0));
  vec3 cloudC = vec3(0.86, 0.87, 0.9) * Etot * 1.05 / PI;
  surf = mix(surf, cloudC, cloud);

  // 夜灯：入夜后亮，后半夜熄去一部分
  float hl = mod(hourLoc, 24.0);
  float lateNight = smoothstep(23.0, 1.5, hl) * step(hl, 12.0) + step(12.0, hl);
  lateNight = mix(0.55, 1.0, sat(lateNight));
  float lightsOn = (1.0 - dayRamp(hourLoc)) * lateNight;
  vec3 cityLight = vec3(1.0, 0.72, 0.42) * city * (0.6 + 0.5 * vnoise3(P / 3.0)) * 0.0006;
  surf += cityLight * lightsOn * (1.0 - cloud * 0.8) * smoothstep(0.0, 0.1, graze);

  o.rad = surf;
  o.cloud = cloud;
  return o;
}
