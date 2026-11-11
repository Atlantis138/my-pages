// ===== 天空与远景：环带、边墙、太空、辐条、星港、镜云、恒星 =====
// 依赖：common.glsl, atmos.glsl, ringmap.glsl（由 TS 拼接）
uniform vec2 uTanHalf;    // (tan(水平半视角), tan(竖直半视角))
uniform mat4 uCamWorld;
uniform float uPixAng;     // 每像素弧度
uniform float uObsH;       // 观察者高出基准面（km）
uniform mat3 uL2I;         // 本地 → 惯性
uniform float uSpin;       // 自转角 Φ（取模）
uniform float uTimeS;      // 模拟秒（取模）
uniform vec2 uRes;
uniform sampler2D tSpace;  // 镜群点层
uniform float uHasSpace;
uniform float uEnvMode;    // 1 = 渲染等距柱状环境图

// 夜间灯光穹顶：xy 中心（km），z 半径（km），w 强度
uniform vec4 uGlow[4];
uniform vec3 uGlowColor;

// 镜云
uniform float uMirrorDay;   // 0..1 本地被照亮的程度（白昼镜闪）
uniform float uStarVisSky;  // 观察点处恒星露出比例
uniform float uFarComp;
uniform vec3 uStarSpaceE;  // 太空中的物体总能被恒星照到     // 夜里远景的局部适应压缩（≈ 曝光 × 系数）

in vec2 vNdc;

const float RT_WALL = RING_R - WALL_H;

// 光污染：近地面的发光
vec3 townGlow(vec3 p) {
  vec3 g = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec4 G = uGlow[i];
    if (G.w <= 0.0) continue;
    float r2 = sq(p.x - G.x) + sq(p.z - G.y);
    g += uGlowColor * G.w * exp(-r2 / sq(G.z));
  }
  return g;
}

// 雨柱：阵雨云下方的灰色雨幕（只用大尺度对流单体，开销小）
float rainShaft(vec3 p, float h) {
  if (uShowers < 0.01) return 0.0;
  if (h > uCloudBase) return 0.0;
  float cell = vnoise3p(vec3((p.x - uCloudOff.x) / 14.4, uCloudEvo * 0.5 + 91.0, (p.z - uCloudOff.y) / 14.4), 320.0);
  float base = vnoise3p(vec3((p.x - uCloudOff.x) / 3.2, uCloudEvo * 0.7, (p.z - uCloudOff.y) / 3.2), 1440.0);
  float c = cell * 0.55 + base * 0.45;
  return smoothstep(0.6, 0.8, c) * uShowers;
}

// 圆柱（半径 r）与射线的交点：返回 (s_near, s_far)，无交返回 (-1,-1)。O 在大圆柱内
vec2 cylHits(vec3 O, vec3 d, float r) {
  vec2 p = vec2(O.x, O.y - RING_R);
  float a = max(dot(d.xy, d.xy), 1e-12);
  float b = dot(p, d.xy);
  float c = dot(p, p) - r * r;
  float disc = b * b - a * c;
  if (disc <= 0.0) return vec2(-1.0);
  float q = sqrt(disc);
  if (c > 0.0) {
    if (b >= 0.0) return vec2(-1.0);
    return vec2(c / (-b + q), (-b + q) / a);
  }
  return vec2(-1.0, (b > 0.0) ? (-c) / (b + q) : (-b + q) / a);
}

float heightAt(vec3 P) { return RING_R - length(vec2(P.x, P.y - RING_R)); }
vec3 upAt(vec3 P) { return normalize(vec3(-P.x, RING_R - P.y, 0.0)); }

// ---------- 近处大气积分（含远端对称半段） ----------
struct AtmoOut {
  vec3 inNear;   // 近半段散射
  vec3 Tnear;    // 近半段透射率
  vec3 inFar;    // 远半段散射（已乘透射）
  vec3 inCloud;  // 到云层处的散射
  vec3 Tcloud;   // 到云层处的透射率
};

AtmoOut integrateAtmo(vec3 O, vec3 d, float sEnd, bool far, vec3 farE, vec3 farUp, float sCloud, int N) {
  AtmoOut r;
  vec3 tau = vec3(0.0);
  vec3 inN = vec3(0.0);
  vec3 inFr = vec3(0.0);
  r.inCloud = vec3(0.0);
  r.Tcloud = vec3(1.0);
  bool cloudDone = sCloud <= 0.0;
  float muF = dot(d, -farUp);
  float pRF = phaseR(muF);
  float pMF = phaseM(muF, uMieG);
  float muS = dot(d, uStarDir);
  float pRS = phaseR(muS);
  float pMS = phaseM(muS, uMieG);
  float invSinS = 1.0 / max(uStarDir.y + 0.015, 0.03);
  vec3 isoE = (uAmbSky + uArchE * 0.45) * 0.0795775;
  vec3 isoFar = farE * 0.22 * 0.0795775;
  float prev = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= N) break;
    float t1 = float(i + 1) / float(N);
    float s1 = sEnd * t1 * t1;
    float ds = s1 - prev;
    float sm = prev + 0.5 * ds;
    vec3 P = O + d * sm;
    float h = max(heightAt(P), 0.0);
    float rR = exp(-h / HR);
    float rM = exp(-h / HM);
    float rain = rainShaft(P, h) * 0.9 + uRain * 0.35 * exp(-h / 1.2);
    vec3 sR = BR * rR;
    float sM = uMieK * rM;
    vec3 ext = sR + vec3(sM * 1.11 + rain * 0.6);
    vec3 dtau = ext * ds;
    vec3 tauMid = tau + 0.5 * dtau;
    vec3 Tm = exp(-tauMid);
    vec3 up = upAt(P);
    float mu = dot(d, up);
    vec3 Tsun = exp(-tauUp(h)) * underCloudLight(h);
    vec3 light = (sR * phaseR(mu) + sM * phaseM(mu, uMieG)) * uMirrorE * Tsun;
    light += (sR + vec3(sM + rain * 0.5)) * isoE;
    // 恒星光（只照亮南墙阴影之上的空气）
    if (uStarE.r > 0.0) {
      float vis = starVisAt(P.z, h);
      if (vis > 0.0) {
        vec3 Ts = exp(-tauUp(h) * invSinS);
        light += (sR * pRS + sM * pMS) * uStarE * Ts * vis;
      }
    }
    // 夜间城镇光晕
    if (h < 2.0) light += townGlow(P) * (sR.g * 2.0 + sM * 3.0 + rain) * exp(-h / 0.35);
    inN += light * Tm * ds;
    if (far) {
      // 远端对称位置：同样的密度，用远处的光照
      vec3 lf = (sR * pRF + sM * pMF) * farE * Tsun + (sR + vec3(sM)) * isoFar;
      inFr += lf * exp(min(tauMid, vec3(60.0))) * ds;
    }
    tau += dtau;
    if (!cloudDone && s1 >= sCloud) {
      // 线性插值到云层处
      float f = (sCloud - prev) / max(ds, 1e-6);
      vec3 tauC = tau - dtau * (1.0 - f);
      r.Tcloud = exp(-tauC);
      r.inCloud = inN - light * Tm * ds * (1.0 - f);
      cloudDone = true;
    }
    prev = s1;
  }
  r.Tnear = exp(-tau);
  r.inNear = inN;
  if (!cloudDone) {
    r.Tcloud = r.Tnear;
    r.inCloud = inN;
  }
  if (far) r.inFar = inFr * r.Tnear * r.Tnear;
  else r.inFar = vec3(0.0);
  return r;
}

// ---------- 星空 ----------
vec3 faceDir(float face, vec2 uv) {
  if (face < 0.5) return vec3(1.0, uv.x, uv.y);
  if (face < 1.5) return vec3(-1.0, uv.x, uv.y);
  if (face < 2.5) return vec3(uv.x, 1.0, uv.y);
  if (face < 3.5) return vec3(uv.x, -1.0, uv.y);
  if (face < 4.5) return vec3(uv.x, uv.y, 1.0);
  return vec3(uv.x, uv.y, -1.0);
}

vec3 starField(vec3 dI, float pix) {
  vec3 a = abs(dI);
  float face;
  vec2 uv;
  if (a.x >= a.y && a.x >= a.z) { face = dI.x > 0.0 ? 0.0 : 1.0; uv = dI.yz / a.x; }
  else if (a.y >= a.z) { face = dI.y > 0.0 ? 2.0 : 3.0; uv = dI.xz / a.y; }
  else { face = dI.z > 0.0 ? 4.0 : 5.0; uv = dI.xy / a.z; }
  vec3 col = vec3(0.0);
  for (int layer = 0; layer < 3; layer++) {
    float cells = layer == 0 ? 20.0 : (layer == 1 ? 48.0 : 110.0);
    float prob = layer == 0 ? 0.035 : (layer == 1 ? 0.12 : 0.26);
    vec2 g = (uv * 0.5 + 0.5) * cells;
    vec2 ci = floor(g);
    vec3 h = hash33(vec3(ci, face * 13.0 + float(layer) * 101.0 + 7.0));
    if (h.z < prob) {
      vec2 sp = ci + 0.2 + 0.6 * h.xy;
      vec3 sd = normalize(faceDir(face, sp / cells * 2.0 - 1.0));
      float ang = length(cross(sd, dI));
      float rpx = ang / pix;
      if (rpx < 3.0) {
        float hm = hash12(ci + face * 3.7 + float(layer) * 19.0);
        // 越暗的星越多
        float mag = layer == 0 ? mix(-0.8, 2.5, pow(hm, 0.6)) : (layer == 1 ? mix(2.5, 4.5, pow(hm, 0.7)) : mix(4.5, 7.0, pow(hm, 0.6)));
        float flux = pow(10.0, -0.4 * mag);
        float tcol = hash12(ci * 1.7 + face);
        vec3 c = tcol < 0.2 ? vec3(0.75, 0.85, 1.0) : (tcol < 0.75 ? vec3(1.0, 0.97, 0.92) : (tcol < 0.93 ? vec3(1.0, 0.85, 0.65) : vec3(1.0, 0.7, 0.5)));
        float psf = exp(-rpx * rpx * 1.6) * 0.55;
        col += c * flux * psf;
      }
    }
  }
  return col * 0.012;
}

vec3 milkyWay(vec3 dI) {
  vec3 n = normalize(vec3(0.38, -0.62, 0.69));
  float b = dot(dI, n);
  float band = exp(-b * b / (2.0 * 0.11 * 0.11));
  vec3 core = normalize(vec3(0.82, 0.52, 0.24));
  float bulge = exp(-sq(acos(clamp(dot(dI, core), -1.0, 1.0)) / 0.45));
  float clump = 0.55 + 0.45 * vnoise3(dI * 9.0) + 0.25 * vnoise3(dI * 23.0);
  float dust = smoothstep(0.35, 0.75, vnoise3(dI * 14.0 + 2.0)) * exp(-b * b / (2.0 * 0.035 * 0.035));
  float v = band * clump * (1.0 - 0.5 * dust) + bulge * 0.7;
  return vec3(0.9, 0.92, 1.0) * v * 0.00005;
}

// ---------- 线段：射线与三维线段的角距离覆盖 ----------
// 返回覆盖率（粗略按线宽 halfW km）以及沿射线的距离 sOut
float segCov(vec3 O, vec3 d, vec3 A, vec3 B, float halfW, out float sOut) {
  vec3 u = B - A;
  vec3 w0 = O - A;
  float a = dot(d, d), b = dot(d, u), c = dot(u, u), dd = dot(d, w0), e = dot(u, w0);
  float den = a * c - b * b;
  float sc = (b * e - c * dd) / max(den, 1e-9);
  float tc = (a * e - b * dd) / max(den, 1e-9);
  tc = clamp(tc, 0.0, 1.0);
  sc = dot(A + u * tc - O, d);
  sOut = sc;
  if (sc <= 0.0) return 0.0;
  float dist = length(O + d * sc - (A + u * tc));
  return lineCov(dist, halfW, 0.5 * sc * uPixAng);
}

// ---------- 星港（环心） ----------
vec4 hubHit(vec3 O, vec3 d) {
  float rH = 120.0;
  float hl = 360.0;
  vec2 p = vec2(O.x, O.y - RING_R);
  float a = dot(d.xy, d.xy);
  float b = dot(p, d.xy);
  float c = dot(p, p) - rH * rH;
  float disc = b * b - a * c;
  if (disc <= 0.0) return vec4(-1.0);
  float s = c / (-b + sqrt(disc));
  vec3 P = O + d * s;
  if (abs(P.z) > hl) return vec4(-1.0);
  return vec4(P, s);
}

vec3 hubShade(vec3 P, vec3 d, float s) {
  vec3 n = normalize(vec3(P.x, P.y - RING_R, 0.0));
  float zz = P.z;
  float ang = atan(n.x, -n.y);
  // 环向分段、对接环与舱板
  float rings = smoothstep(0.82, 0.97, abs(sin(zz / 360.0 * PI * 6.0)));
  float panel = vnoise2(vec2(ang * 40.0, zz / 7.0));
  vec3 base = vec3(0.36, 0.37, 0.39) * (0.7 + 0.45 * panel) * (1.0 - rings * 0.35);
  // 朝向我们的一面：被本地这半边环的地面照亮（白昼时）
  float ringshine = 0.14 * dayIntensity(uLocalHour) + 0.002;
  // 背面（朝向对岸）被对岸照亮，从我们这边只在轮廓处看到一道亮边
  float rim = pow(1.0 - abs(dot(n, -d)), 3.0);
  float farLit = 0.18 * dayIntensity(uLocalHour + 12.0);
  vec3 c = base * uDayE * (ringshine + farLit * rim * 2.5) / PI;
  c += base * uStarSpaceE * 0.004 / PI;
  // 港区灯光：舱窗与对接环
  float win = step(0.9, vnoise2(vec2(ang * 140.0, zz / 1.8))) * (0.5 + rings);
  float dock = rings * step(0.6, fract(ang * 6.0 + zz * 0.01));
  c += vec3(1.0, 0.86, 0.66) * (win * 0.0016 + dock * 0.0008) * (0.4 + 0.6 * (1.0 - dayRamp(uLocalHour)));
  float beacon = step(0.93, fract(uTimeS / 2.4)) * step(330.0, abs(zz));
  c += vec3(1.0, 0.25, 0.2) * beacon * 0.02;
  return c;
}

// ---------- 辐条 ----------
// 辐条位于 z≈0 的平面内，从地面经度 θk 直到环心
vec4 spokes(vec3 O, vec3 d, float sMax, out float sHit) {
  vec4 acc = vec4(0.0);
  sHit = 1e9;
  for (int k = 0; k < 6; k++) {
    float th = radians(-35.0 + 60.0 * float(k));
    vec2 nk = vec2(cos(th), sin(th));        // 辐条所在平面的法向（切向）
    vec2 rk = vec2(sin(th), -cos(th));       // 由环心指向落点
    float den = dot(d.xy, nk);
    if (abs(den) < 1e-6) continue;
    float s = dot(vec2(0.0, RING_R) - O.xy, nk) / den;
    if (s <= 0.0 || s >= sMax) continue;
    vec3 P = O + d * s;
    vec2 q = P.xy - vec2(0.0, RING_R);
    float rho = dot(q, rk);
    if (rho <= 0.0 || rho > RING_R) continue;
    float t = rho / RING_R;
    float halfW = mix(8.0, 22.0, t * t) + 55.0 * exp(-(RING_R - rho) / 160.0);
    float cov = lineCov(abs(P.z), halfW, 0.5 * s * uPixAng);
    if (cov <= 0.0) continue;
    // 结构：纵向桁架与升降舱灯
    float truss = 0.6 + 0.4 * step(0.5, fract(rho / 900.0));
    vec3 base = vec3(0.42, 0.43, 0.45) * truss;
    // 照明：恒星（掠射）、落点附近被照亮的地面（越靠近地面越亮）、以及整条环带的反光
    float hourK = uLocalHour + degrees(th) / 15.0;
    float baseLit = dayIntensity(hourK);
    float ringshine = mix(0.006, 0.09, t * t * t) * baseLit + uArchMax * 1.5;
    vec3 c = base * (uStarSpaceE * 0.006 + uDayE * ringshine) / PI;
    float car = fract(rho / 6000.0 - uTimeS / 5400.0 * (mod(float(k), 2.0) * 2.0 - 1.0));
    c += vec3(1.0, 0.9, 0.75) * smoothstep(0.985, 1.0, car) * 0.0012;
    c += vec3(0.9, 0.95, 1.0) * step(0.985, fract(rho / 1500.0)) * 0.00015;
    if (s < sHit) sHit = s;
    acc.rgb = mix(acc.rgb, c, cov);
    acc.a = max(acc.a, cov);
  }
  return acc;
}

// ---------- 镜云：未分辨的整体辉光 + 静止骨架 ----------
// 镜群附着在静止的骨架上：由若干同轴的稀疏「幕层」组成，边缘参差，内部成团
float mirrorEnv(vec3 cp, float rho, float az) {
  float warp = vnoise3(cp / 1800.0) - 0.5;
  float rIn = 3000.0 + 500.0 * warp;
  float rOut = 7000.0 - 700.0 * (vnoise3(cp / 2300.0 + 7.0) - 0.3);
  float zOut = 3750.0 - 900.0 * vnoise3(cp / 2600.0 + 3.0);
  return smoothstep(rIn, rIn + 600.0, rho) * smoothstep(rOut, rOut - 900.0, rho) * smoothstep(zOut, zOut - 700.0, az) * smoothstep(260.0, 510.0, az);
}
float mirrorDensity(vec3 P, float env) {
  vec2 q = P.xy - vec2(0.0, RING_R);
  float rho = length(q);
  float psi = atan(q.x, -q.y) + uSpin;
  vec3 cp = vec3(cos(psi) * rho, sin(psi) * rho, P.z);
  float shell = pow(abs(sin(rho / 1000.0 * PI)), 6.0);
  float flock = smoothstep(0.42, 0.72, vnoise3(cp / 1500.0) * 0.65 + vnoise3(cp / 640.0) * 0.35);
  float clump = vnoise3(cp / 260.0) * 0.65 + vnoise3(cp / 90.0) * 0.35;
  float c = smoothstep(0.3, 0.9, clump);
  return env * flock * (0.3 + 0.7 * shell) * (0.1 + 0.9 * c * c);
}

vec3 mirrorGlow(vec3 O, vec3 d, float sMax) {
  vec2 outer = cylHits(O, d, 7600.0);
  if (outer.x < 0.0) return vec3(0.0);
  vec2 inner = cylHits(O, d, 2500.0);
  float dens = 0.0;
  float segA0 = outer.x, segA1 = inner.x > 0.0 ? inner.x : outer.y;
  float segB0 = inner.x > 0.0 ? inner.y : 0.0, segB1 = inner.x > 0.0 ? outer.y : 0.0;
  for (int seg = 0; seg < 2; seg++) {
    float s0 = seg == 0 ? segA0 : segB0;
    float s1 = seg == 0 ? segA1 : segB1;
    s1 = min(s1, sMax);
    if (s1 <= s0) continue;
    // 包络在该段中点算一次
    vec3 Pm = O + d * (0.5 * (s0 + s1));
    vec2 qm = Pm.xy - vec2(0.0, RING_R);
    float rhoM = length(qm);
    float psiM = atan(qm.x, -qm.y) + uSpin;
    float env = mirrorEnv(vec3(cos(psiM) * rhoM, sin(psiM) * rhoM, Pm.z), rhoM, abs(Pm.z));
    if (env <= 0.0) continue;
    for (int i = 0; i < 4; i++) {
      float s = mix(s0, s1, (float(i) + 0.5) / 4.0);
      dens += mirrorDensity(O + d * s, env) * (s1 - s0) / 4.0;
    }
  }
  // 白昼：朝向本地的镜面反射恒星光；夜里：星光照亮的模块边框，淡淡的银灰
  vec3 dayC = uDayE * (uMirrorDay * 0.0006);
  vec3 nightC = vec3(0.78, 0.82, 0.9) * 9.0e-8 * (uStarSpaceE.x / 1.4);
  return dens * (dayC + nightC);
}

float frameLines(vec3 O, vec3 d) {
  float c = 0.0;
  float so;
  // 轴向主梁（静止）：环心两侧延伸到 ±3750 km
  vec3 A = vec3(0.0, RING_R, 380.0);
  vec3 B = vec3(0.0, RING_R, 3800.0);
  c = max(c, segCov(O, d, A, B, 7.0, so));
  c = max(c, segCov(O, d, vec3(0.0, RING_R, -380.0), vec3(0.0, RING_R, -3800.0), 7.0, so));
  // 径向悬臂：静止于惯性系，随自转在我们看来缓缓转动
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float zb = (mod(fi, 2.0) < 0.5 ? 1.0 : -1.0) * (700.0 + 1000.0 * floor(fi / 2.0));
    float psi = fi * 2.399 - uSpin;
    vec3 P0 = vec3(0.0, RING_R, zb);
    vec3 P1 = vec3(7300.0 * sin(psi), RING_R - 7300.0 * cos(psi), zb);
    c = max(c, segCov(O, d, P0, P1, 5.0, so) * 0.8);
  }
  // 环形箍：在 z = ±zb 平面上半径 7300 km 的圆
  for (int j = 0; j < 4; j++) {
    float zb = (j < 2 ? 1.0 : -1.0) * (j == 0 || j == 2 ? 1700.0 : 3700.0);
    if (abs(d.z) < 1e-5) continue;
    float s = (zb - O.z) / d.z;
    if (s <= 0.0) continue;
    vec3 P = O + d * s;
    float rho = length(P.xy - vec2(0.0, RING_R));
    float dist = abs(rho - 7300.0) * abs(d.z);
    c = max(c, lineCov(dist, 5.0, 0.5 * s * uPixAng) * 0.7);
  }
  return c;
}

// ---------- 边墙内壁 ----------
vec3 wallShade(vec3 P, vec3 d, float s, float hourLoc) {
  float h = heightAt(P);
  float th = atan(P.x, RING_R - P.y);
  float u = th * RING_R;
  // 竖向扶壁与水平检修层
  float fpk = s * uPixAng;  // 像素足迹（km）
  float rib = smoothstep(0.82, 1.0, abs(sin(u / 22.0 * PI))) * (1.0 - smoothstep(2.0, 8.0, fpk));
  float tier = smoothstep(0.9, 1.0, abs(sin(h / 6.25 * PI))) * (1.0 - smoothstep(0.3, 1.2, fpk / max(abs(d.y), 0.02)));
  float n = vnoise2(vec2(u / 4.0, h / 2.0));
  vec3 alb = vec3(0.28, 0.29, 0.31) * (0.85 + 0.2 * n) * (1.0 - 0.12 * rib) * (1.0 + 0.1 * tier);
  float di = dayIntensity(hourLoc);
  vec3 E = uDayE * mirrorTint(hourLoc) * di;
  vec3 En = vec3(0.75, 0.82, 1.0) * uArchMax * dayIntensity(hourLoc + 12.0);
  // 垂直壁面只受掠射镜光，主要靠地面反光和天光
  vec3 c = alb * (E * (0.12 + 0.2 * smoothstep(WALL_H - 2.0, WALL_H, h)) + En * 0.15) / PI;
  // 夜灯：只在三层检修廊道上，稀疏成点；远处按像素足迹取平均
  float lvl = abs(h - 12.5) < 0.25 || abs(h - 25.0) < 0.25 || abs(h - 37.5) < 0.25 ? 1.0 : 0.0;
  float dots = step(0.82, hash12(vec2(floor(u / 0.8), floor(h))));
  float lights = lvl * dots * (1.0 - dayRamp(hourLoc));
  c += vec3(1.0, 0.82, 0.6) * lights * 0.00035;
  // 墙顶航标
  c += vec3(1.0, 0.3, 0.25) * smoothstep(WALL_H - 0.6, WALL_H, h) * step(0.94, fract(uTimeS / 3.0 + u / 40.0)) * 0.006;
  return c;
}

void main() {
  vec3 d;
  if (uEnvMode > 0.5) {
    vec2 uv = vNdc * 0.5 + 0.5;
    float lon = (uv.x - 0.5) * TAU;
    float lat = (uv.y - 0.5) * PI;
    d = vec3(cos(lat) * sin(lon), sin(lat), -cos(lat) * cos(lon));
  } else {
    vec3 dv = normalize(vec3(vNdc.x * uTanHalf.x, vNdc.y * uTanHalf.y, -1.0));
    d = normalize(mat3(uCamWorld) * dv);
  }
  bool env = uEnvMode > 0.5;
  float pix = env ? 0.03 : uPixAng;
  vec3 O = vec3(0.0, uObsH, 0.0);

  // ---------- 几何分类 ----------
  vec2 hF = cylHits(O, d, RING_R);
  float sF = hF.y;
  float zF = O.z + sF * d.z;
  vec2 hT = cylHits(O, d, RT_WALL);
  bool hasT = hT.x > 0.0;
  float s1 = hT.x, s2 = hT.y;
  float sZ = abs(d.z) > 1e-7 ? (HALF_W - abs(O.z) * sign(d.z) * sign(O.z)) / abs(d.z) : 1e9;

  float covFloor = sat(0.5 + (HALF_W - abs(zF)) / (sF * pix));
  float covWall = 1.0;
  if (hasT) {
    float cn = sat(0.5 + (abs(s1 * d.z) - HALF_W) / (s1 * pix));
    float cf = s2 < sF ? sat(0.5 + (HALF_W - abs(s2 * d.z)) / (s2 * pix)) : 0.0;
    covWall = max(cn, cf);
  }
  float wFloor = covFloor;
  float wWall = (1.0 - covFloor) * covWall;
  float wSpace = (1.0 - covFloor) * (1.0 - covWall);

  // 积分终点
  vec2 hA = cylHits(O, d, RING_R - 90.0);
  float sAtm = hA.x > 0.0 ? hA.x : 1e9;
  bool floorMain = wFloor >= max(wWall, wSpace);
  float sEnd;
  if (floorMain) sEnd = min(sF * 0.5, sAtm);
  else if (wWall >= wSpace) sEnd = min(sZ, sF);
  else sEnd = min(sAtm, sZ);
  sEnd = max(sEnd, 0.01);

  // 远处地面信息（用于远半段大气）
  vec3 Pf = O + d * sF;
  float thF = atan(Pf.x, RING_R - Pf.y);
  float hourF = uLocalHour + thF / TAU * 24.0;
  vec3 farUp = upAt(Pf);
  vec3 farE = uDayE * mirrorTint(hourF) * dayIntensity(hourF) + vec3(0.75, 0.82, 1.0) * uArchMax * dayIntensity(hourF + 12.0);

  // ---------- 本地云层 ----------
  float cloudA = 0.0;
  vec3 cloudL = vec3(0.0);
  float sCloud = -1.0;
  if (uCloudCover > 0.005 || uHighCloud > 0.005) {
    vec2 cb = cylHits(O, d, RING_R - uCloudBase);
    if (cb.x > 0.0 && cb.x < 700.0 && cb.x < sF) {
      vec2 ct = cylHits(O, d, RING_R - uCloudBase - uCloudThick);
      float sA = cb.x;
      float sB = ct.x > 0.0 ? ct.x : min(cb.y, sA + 40.0);
      sB = min(sB, sA + 60.0);
      sCloud = sA;
      float T = 1.0;
      // 云当作高度场：每个位置的云顶高度由覆盖度决定（积云成穹顶，层云平整）。
      // 先粗步找到视线第一次进入云体的位置，再二分细化，得到清晰的云边。
      const int K = 12;
      float prevS = sA;
      float hitS = -1.0;
      float hitCov = 0.0;
      bool prevIn = false;
      for (int i = 0; i <= K; i++) {
        float sc = mix(sA, sB, pow(float(i) / float(K), 1.3));
        vec3 P = O + d * sc;
        float h = heightAt(P);
        float cov = cloudField2(vec2(P.x, P.z));
        float top = uCloudBase + uCloudThick * mix(pow(cov, 0.6), smoothstep(0.0, 0.3, cov), uStratus);
        bool inside = cov > 0.02 && h <= top + 0.001;
        if (inside) {
          if (i == 0) { hitS = sc; hitCov = cov; break; }
          // 二分细化
          float a = prevS, b = sc;
          for (int j = 0; j < 5; j++) {
            float m = 0.5 * (a + b);
            vec3 Pm = O + d * m;
            float cm = cloudField2(vec2(Pm.x, Pm.z));
            float tm = uCloudBase + uCloudThick * mix(pow(cm, 0.6), smoothstep(0.0, 0.3, cm), uStratus);
            if (cm > 0.02 && heightAt(Pm) <= tm) { b = m; hitCov = cm; } else a = m;
          }
          hitS = b;
          if (hitCov <= 0.0) hitCov = cov;
          break;
        }
        prevS = sc;
      }
      if (hitS > 0.0) {
        vec3 P = O + d * hitS;
        float h = heightAt(P);
        float cov = hitCov;
        float top = uCloudBase + uCloudThick * mix(pow(cov, 0.6), smoothstep(0.0, 0.3, cov), uStratus);
        float hf = sat((h - uCloudBase) / max(top - uCloudBase, 0.02));
        // 穿入云体的路径长度（估计）：薄的云边半透明
        float depth = max(top - uCloudBase, 0.01);
        float pathIn = min(depth / max(abs(d.y), 0.08), 3.0);
        float detail = 0.7 + 0.6 * vnoise3(vec3(P.x - uCloudOff.x, h * 2.0, P.z - uCloudOff.y) * 2.2 + uCloudEvo * 0.3);
        float tauV = 40.0 * cov * pathIn * detail;
        float a = 1.0 - exp(-tauV);
        float above = max(top - h, 0.0) * (cov * 34.0 + 6.0);
        float Tdiff = 1.0 / (1.0 + 0.1 * above * (1.0 + uCloudDark * 3.0));
        float mu = dot(d, upAt(P));
        float silver = exp(-above * 0.5) * phaseM(mu, 0.7) * 2.5 * (1.0 - smoothstep(0.1, 0.6, cov));
        vec3 Lc = uMirrorE * (Tdiff / PI * (0.75 + 0.5 * detail) + silver * 0.15) + (uAmbSky * 0.5 + uArchE) * Tdiff * 0.35;
        Lc += uMirrorE * 0.05 * (1.0 - hf) * vec3(0.8, 0.9, 0.75) / PI; // 地面反光
        // 恒星斜光照亮云的侧面与底部
        float vis = starVisAt(P.z, h);
        if (vis > 0.0) {
          float muS = dot(d, uStarDir);
          vec3 Ts = exp(-tauUp(h) / max(uStarDir.y + 0.015, 0.03));
          Lc += uStarE * Ts * vis * (0.12 + phaseM(muS, 0.6) * 0.6) * (0.4 + 0.6 * hf);
        }
        Lc += townGlow(vec3(P.x, 0.0, P.z)) * 2.2 * (1.0 - hf);
        Lc *= 1.0 - uCloudDark * 0.55 * smoothstep(0.4, 1.0, cov);
        cloudL = Lc * a;
        T = 1.0 - a;
        sCloud = hitS;
      }
      cloudA = 1.0 - T;
      if (cloudA > 0.0) cloudL /= max(cloudA, 1e-4);
      // 远处淡出
      float fade = 1.0 - smoothstep(250.0, 650.0, sA);
      cloudA *= fade;
    }
  }

  int N = env ? 8 : 12;
  AtmoOut at = integrateAtmo(O, d, sEnd, floorMain, farE, farUp, -1.0, N);
  // 云前方的空气单独积分，避免与环带内外不同的采样分布产生接缝
  if (cloudA > 0.0) {
    AtmoOut ac = integrateAtmo(O, d, min(sCloud, sEnd), false, farE, farUp, -1.0, env ? 4 : 6);
    at.inCloud = ac.inNear;
    at.Tcloud = ac.Tnear;
  }

  // ---------- 远端颜色 ----------
  vec3 colFloor = vec3(0.0), colWall = vec3(0.0), colSpace = vec3(0.0);
  vec3 Tfar = at.Tnear; // 远半段与近半段对称
  if (wFloor > 0.0) {
    float graze = max(dot(d, -farUp), 0.0);
    float fp = sF * pix / max(sqrt(graze), 0.08);
    float totT = luma(at.Tnear * Tfar);
    vec3 surf;
    if (totT > 0.004) {
      FarInfo fi = farSurface(thF, zF, fp, hourF, graze);
      surf = fi.rad;
    } else {
      surf = vec3(0.06, 0.07, 0.05) * farE / PI;
    }
    // 春照、秋照时，南墙阴影以北的大地被低斜的恒星光照亮
    if (uStarE.r > 0.0 && sF < 3000.0) {
      float vis = starVisAt(zF, 0.0);
      if (vis > 0.0) {
        vec3 Ts = exp(-tauUp(0.0) / max(uStarDir.y + 0.015, 0.03));
        surf += vec3(0.16, 0.15, 0.1) * uStarE * Ts * vis * max(uStarDir.y, 0.0) * 3.0 / PI;
      }
    }
    colFloor = at.inFar + Tfar * at.Tnear * surf;
    colFloor /= max(at.Tnear, vec3(1e-6)); // 下面统一乘近半段透射率，这里先除回去
  }
  if (wWall > 0.0) {
    vec3 Pw = O + d * min(sZ, sF);
    float thW = atan(Pw.x, RING_R - Pw.y);
    colWall = wallShade(Pw, d, sZ, uLocalHour + thW / TAU * 24.0);
  }
  if (wSpace > 0.0) {
    vec3 dI = uL2I * d;
    colSpace = env ? milkyWay(dI) * 1.0 : starField(dI, pix) + milkyWay(dI);
  }
  vec3 far = wFloor * colFloor + wWall * colWall + wSpace * colSpace;

  // ---------- 太空物体（在远处地面与本地大气之间） ----------
  if (!env && d.y > 0.0) {
    float sLim = wFloor > 0.5 ? sF : 1e9;
    if (d.y > 0.94) {
      // 镜云辉光
      far += mirrorGlow(O, d, sLim);
      // 镜群点层
      if (uHasSpace > 0.5) far += texture(tSpace, gl_FragCoord.xy / uRes).rgb;
      // 静止骨架
      float fl = frameLines(O, d);
      far = mix(far, vec3(0.3, 0.31, 0.33) * (uArchE * 2.5 + uStarSpaceE * 0.004 + uMirrorE * 0.0012) / PI, fl * 0.85);
    }
    // 辐条
    if (abs(d.z) < 0.02) {
      float sSp;
      vec4 sp = spokes(O, d, sLim, sSp);
      far = mix(far, sp.rgb, sp.a);
    }
    // 星港
    if (d.y > 0.995) {
      vec4 hb = hubHit(O, d);
      if (hb.w > 0.0 && hb.w < sLim) far = hubShade(hb.xyz, d, hb.w);
    }
  }

  // 眼睛对明亮对岸的局部适应：夜里把远景的高亮压一压，保留细节
  far = far / (1.0 + luma(far) * uFarComp);
  vec3 col = at.inNear + at.Tnear * far;

  // ---------- 恒星（超采样，处理亚像素的露出细线） ----------
  if (!env && uStarE.r > 0.0) {
    float ang = length(cross(d, uStarDir));
    if (dot(d, uStarDir) > 0.0 && ang < uStarAlpha + 4.0 * pix) {
      vec3 right = normalize(cross(d, vec3(0.0, 1.0, 0.0)));
      vec3 upv = cross(right, d);
      float acc = 0.0;
      // 先判断像素中心：远离墙顶与星盘边缘时只取一个样本
      float sW = HALF_W / max(abs(d.z), 1e-6);
      float clr = (heightAt(O + d * sW) - WALL_H) / sW;
      bool simple = abs(clr) > 3.0 * pix && ang < uStarAlpha - 3.0 * pix;
      if (simple) {
        if (clr > 0.0) {
          float mu = sqrt(max(0.0, 1.0 - sq(ang / uStarAlpha)));
          acc = (1.0 - 0.6 * (1.0 - mu)) * 36.0;
        }
      } else {
        for (int i = 0; i < 6; i++) {
          for (int j = 0; j < 6; j++) {
            vec2 o = (vec2(float(i), float(j)) + 0.5) / 6.0 - 0.5;
            vec3 ds = normalize(d + (right * o.x + upv * o.y) * pix);
            float a2 = length(cross(ds, uStarDir));
            if (a2 > uStarAlpha) continue;
            // 墙顶遮挡测试
            vec2 hh = cylHits(O, ds, RT_WALL);
            bool vis = hh.x > 0.0 && abs(hh.x * ds.z) < HALF_W;
            if (!vis) continue;
            float mu = sqrt(max(0.0, 1.0 - sq(a2 / uStarAlpha)));
            acc += 1.0 - 0.6 * (1.0 - mu);
          }
        }
      }
      acc /= 36.0;
      if (acc > 0.0) {
        float omega = PI * uStarAlpha * uStarAlpha;
        vec3 Lstar = uStarE / omega / 0.8;
        col += at.Tnear * Lstar * acc;
      }
    }
  }

  // 云叠加（云与其前方的空气）
  if (cloudA > 0.0) {
    vec3 cloudCol = at.inCloud + at.Tcloud * cloudL;
    col = mix(col, cloudCol, cloudA);
  }

  // 高云（卷云）：薄而亮的丝缕
  if (uHighCloud > 0.01 && d.y > 0.02) {
    vec2 hc = cylHits(O, d, RING_R - 8.5);
    if (hc.x > 0.0 && hc.x < 400.0) {
      vec3 P = O + d * hc.x;
      vec2 q = vec2(P.x - uCloudOff.x * 1.6, P.z - uCloudOff.y * 1.6);
      q += vec2(vnoise2(q * 0.05), vnoise2(q * 0.05 + 7.0)) * 14.0;
      float n = vnoise2(q * vec2(0.09, 0.3)) * 0.55 + vnoise2(q * vec2(0.3, 0.8)) * 0.3 + vnoise2(q * 1.4) * 0.15;
      float ci = smoothstep(0.58, 0.9, n) * uHighCloud * (1.0 - smoothstep(120.0, 380.0, hc.x));
      ci *= 0.22 * (1.0 - cloudA);
      vec3 Lci = uMirrorE * (0.12 + phaseM(dot(d, vec3(0, 1, 0)), 0.75) * 0.2) + uArchE * 0.3;
      float vis = starVisAt(P.z, 8.5);
      Lci += uStarE * vis * 0.25 * exp(-tauUp(8.5) / max(uStarDir.y + 0.015, 0.03));
      col = mix(col, Lci * 0.9 + at.inCloud * 0.2, ci);
    }
  }

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}
