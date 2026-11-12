// ===== 地形着色：草地、林冠、田块、镇区、校园、河岸、铁路 =====
uniform sampler2D tNN;
uniform sampler2D tNF;
uniform sampler2D tDN;
uniform sampler2D tDF;
uniform vec4 uGridN;
uniform vec4 uGridF;
uniform vec4 uSeasonA; // 叶量、秋色、枯黄、新绿
uniform vec4 uSeasonB; // 金黄、空田、油菜花、冷暖
uniform vec4 uSeasonC; // 稻：灌水、青、黄；冬小麦青
uniform vec4 uSeasonD; // 麦黄、夏玉米、花期、-
varying vec3 vW;

float nearW(vec2 p) {
  vec2 lo = uGridN.xy;
  vec2 hi = uGridN.xy + uGridN.z;
  float m = min(min(p.x - lo.x, hi.x - p.x), min(p.y - lo.y, hi.y - p.y));
  return smoothstep(0.0, 800.0, m);
}

vec3 decodeN(vec4 t) { return normalize(vec3(t.x * 2.0 - 1.0, t.y, t.z * 2.0 - 1.0)); }

// 与 CPU 端一致的林地密度
float forestDensity(vec2 p, float slopeT, float dr, float hRel, float town) {
  float n = fbm2(p / 700.0 + vec2(3.7, 1.9), 3) * 0.75 + vnoise2(p / 160.0) * 0.25;
  float hill = smoothstep(16.0, 60.0, hRel);
  float f = n + hill * 0.3 + min(slopeT, 0.6) * 0.55 - 0.5;
  f -= town * 1.3;
  f -= (1.0 - smoothstep(70.0, 160.0, dr)) * 0.6;
  return smoothstep(0.0, 0.1, f);
}

// 田块
vec3 fieldColor(vec2 p, float px, out float rough, out float water, out float ridge) {
  float ang = 0.2 + 0.6 * (vnoise2(p / 2800.0) - 0.5);
  float ca = cos(ang), sa = sin(ang);
  vec2 q = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y);
  float rowH = 58.0;
  float row = floor(q.y / rowH);
  float off = hash12(vec2(row, 3.0)) * 300.0;
  float colW = 42.0 + 95.0 * hash12(vec2(row, 11.0));
  float col = floor((q.x + off) / colW);
  float id = hash12(vec2(row, col) + 0.5);
  float id2 = hash12(vec2(col, row) * 1.7 + 3.1);
  float fx = fract((q.x + off) / colW);
  float fy = fract(q.y / rowH);
  float ex = min(fx, 1.0 - fx) * colW;
  float ey = min(fy, 1.0 - fy) * rowH;
  float e = min(ex, ey);
  float aa = max(px, 0.05);
  // 田埂宽约 0.7 m；像素足迹变大时逐渐淡为平均色，避免摩尔纹
  float ridgeFade = 1.0 - smoothstep(0.6, 3.0, px);
  ridge = (1.0 - smoothstep(0.35, 0.35 + aa * 1.5, e)) * ridgeFade + (1.0 - ridgeFade) * min(0.7 / colW + 0.7 / rowH, 0.5);
  // 垄沟条纹（只在近处可见）
  float stripeK = 1.0 - smoothstep(0.5, 1.5, px);
  float stripe = stripeK * (0.5 + 0.5 * sin(q.y * 6.2832 / 0.9 + id * 40.0));
  water = 0.0;
  rough = 0.9;
  vec3 soil = vec3(0.15, 0.115, 0.08);
  vec3 c;
  if (id < 0.45) {
    // 水稻：五月灌水插秧，夏季青绿，九月金黄，收割后留茬
    vec3 green = mix(vec3(0.055, 0.12, 0.035), vec3(0.07, 0.16, 0.04), id2);
    vec3 gold = vec3(0.33, 0.255, 0.085);
    vec3 stubble = vec3(0.19, 0.155, 0.1);
    c = mix(soil * 1.1, stubble, 0.5);
    c = mix(c, vec3(0.035, 0.045, 0.045), uSeasonC.x);
    water = uSeasonC.x * (1.0 - 0.6 * uSeasonC.y);
    c = mix(c, green, uSeasonC.y);
    c = mix(c, gold, uSeasonC.z);
    c = mix(c, stubble, uSeasonB.y * (1.0 - uSeasonC.x) * (1.0 - uSeasonC.y));
    c *= 0.9 + 0.2 * stripe;
  } else if (id < 0.7) {
    if (id2 < 0.45) {
      // 油菜：冬绿，三四月金黄的花
      c = mix(soil, vec3(0.07, 0.11, 0.04), uSeasonC.w);
      c = mix(c, vec3(0.62, 0.5, 0.025), uSeasonB.z);
      c = mix(c, vec3(0.06, 0.13, 0.04), uSeasonD.y);
    } else {
      // 冬小麦—夏玉米
      c = mix(soil, vec3(0.065, 0.12, 0.04), uSeasonC.w);
      c = mix(c, vec3(0.37, 0.3, 0.12), uSeasonD.x);
      c = mix(c, vec3(0.05, 0.125, 0.032), uSeasonD.y);
    }
    c *= 0.88 + 0.24 * stripe;
  } else if (id < 0.85) {
    // 菜地：一畦一畦
    float bed = step(0.5, fract(q.y / 1.6 + id * 7.0));
    vec3 veg = mix(vec3(0.07, 0.13, 0.05), vec3(0.1, 0.14, 0.06), id2);
    veg = mix(veg, vec3(0.09, 0.1, 0.05), uSeasonA.z * 0.5);
    c = mix(soil, veg, mix(0.75, bed, stripeK));
  } else if (id < 0.93) {
    // 果园：成行的树冠
    vec2 g = fract(q / 5.0) - 0.5;
    float tree = 1.0 - smoothstep(0.25, 0.42, length(g));
    tree = mix(0.45, tree, stripeK);
    vec3 crown = mix(vec3(0.04, 0.08, 0.03), vec3(0.12, 0.09, 0.04), uSeasonA.y * 0.7);
    crown = mix(vec3(0.09, 0.08, 0.06), crown, uSeasonA.x);
    crown = mix(crown, vec3(0.5, 0.45, 0.45), uSeasonD.z * 0.6);
    c = mix(vec3(0.1, 0.13, 0.05), crown, tree);
  } else {
    // 休耕地 / 牧草
    c = mix(vec3(0.1, 0.14, 0.05), vec3(0.15, 0.13, 0.07), uSeasonA.z);
  }
  // 田埂
  c = mix(c, mix(vec3(0.11, 0.13, 0.06), vec3(0.15, 0.13, 0.08), uSeasonA.z), ridge * 0.8);
  water *= 1.0 - ridge;
  return c;
}

// 校园地面：跑道、足球场、篮球场
vec4 schoolSurface(vec2 p, float px) {
  // 返回 rgb 与覆盖度
  if (p.x < 160.0 || p.x > 530.0 || p.y < -190.0 || p.y > 180.0) return vec4(0.0);
  float aa = max(px, 0.03);
  // 校园：草坪为底，建筑周围与主路是铺装
  vec3 lawnC = mix(vec3(0.07, 0.13, 0.04), vec3(0.09, 0.15, 0.05), vnoise2(p / 9.0));
  lawnC = mix(lawnC, vec3(0.13, 0.125, 0.07), uSeasonA.z * 0.7);
  vec3 paveC = vec3(0.23, 0.225, 0.21) * (0.92 + 0.1 * vnoise2(p * 0.5));
  float built = townTex(p).a;
  float walk = 1.0 - smoothstep(2.0, 2.0 + aa * 2.0, min(abs(p.y + 45.0), abs(p.x - 335.0)));
  walk = max(walk, (1.0 - smoothstep(2.5, 2.5 + aa * 2.0, abs(p.y - 120.0))) * step(170.0, p.x));
  vec3 c = mix(lawnC, paveC, max(smoothstep(0.15, 0.45, built), walk));
  // 跑道
  vec2 q = p - vec2(395.0, 52.0);
  float dStad = length(vec2(max(abs(q.x) - 42.2, 0.0), q.y));
  if (dStad < 47.0) {
    vec3 red = vec3(0.33, 0.085, 0.06);
    float onTrack = smoothstep(36.4 - aa, 36.4 + aa, dStad) * (1.0 - smoothstep(44.0 - aa, 44.0 + aa, dStad));
    // 分道线
    float lane = 0.0;
    for (int k = 0; k <= 6; k++) {
      float rk = 36.5 + 1.22 * float(k);
      lane = max(lane, 1.0 - smoothstep(0.025, 0.025 + aa, abs(dStad - rk)));
    }
    vec3 trackC = mix(red, vec3(0.62, 0.6, 0.58), lane * 0.85);
    // 足球场（人造草）
    vec3 pitch = vec3(0.07, 0.165, 0.05) * (0.92 + 0.08 * step(0.5, fract(q.x / 10.0)));
    float lines = 0.0;
    vec2 a = abs(q);
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.x - 50.0))) * step(a.y, 31.0));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.y - 31.0))) * step(a.x, 50.0));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(q.x))) * step(a.y, 31.0));
    lines = max(lines, 1.0 - smoothstep(0.06, 0.06 + aa, abs(length(q) - 9.15)));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.x - 33.5))) * step(a.y, 20.15) * step(33.5, a.x + 0.01));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.y - 20.15))) * step(33.5, a.x) * step(a.x, 50.0));
    pitch = mix(pitch, vec3(0.6), lines * 0.85);
    float inField = 1.0 - smoothstep(36.4 - aa, 36.4 + aa, dStad);
    vec3 cc = mix(c, trackC, onTrack);
    cc = mix(cc, pitch, inField);
    c = cc;
  }
  // 篮球场：两块 28×15 m 的标准场地
  vec2 b = p - vec2(232.0, 66.0);
  if (abs(b.x) < 18.0 && abs(b.y) < 19.0) {
    vec3 court = vec3(0.09, 0.2, 0.23);
    vec3 apron = vec3(0.16, 0.24, 0.2);
    vec2 cb = vec2(b.x, abs(b.y) - 9.0);
    vec2 a2 = abs(cb);
    float inC = step(a2.x, 14.0) * step(a2.y, 7.5);
    float l = 0.0;
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.x - 14.0))) * step(a2.y, 7.5));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.y - 7.5))) * step(a2.x, 14.0));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(cb.x))) * step(a2.y, 7.5));
    l = max(l, 1.0 - smoothstep(0.05, 0.05 + aa, abs(length(cb) - 1.8)));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.x - 8.2))) * step(a2.y, 2.45));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.y - 2.45))) * step(8.2, a2.x) * step(a2.x, 14.0));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(length(vec2(14.0 - a2.x - 1.2, cb.y)) - 6.75))) * step(8.0, a2.x));
    vec3 cc = mix(apron, court, inC);
    c = mix(c, mix(cc, vec3(0.62), l * 0.85), step(abs(b.x), 17.0) * step(abs(b.y), 18.0));
  }
  float edge = smoothstep(160.0, 172.0, p.x) * (1.0 - smoothstep(520.0, 530.0, p.x)) * smoothstep(-190.0, -178.0, p.y) * (1.0 - smoothstep(170.0, 180.0, p.y));
  return vec4(c, edge);
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 w = vW;
  vec2 p = w.xz;
  float camD = length(w - cameraPosition);
  SHADOW_OUT(w)
  // 像素足迹（米），用于抗锯齿与细节淡出
  float px = camD * uPixAng / max(abs(normalize(cameraPosition - w).y), 0.08);
  float nw = nearW(p);
  vec3 N = decodeN(texture(tNF, (p - uGridF.xy) / uGridF.z));
  vec2 D = texture(tDF, (p - uGridF.xy) / uGridF.z).rg;
  if (nw > 0.0) {
    vec3 Nn = decodeN(texture(tNN, (p - uGridN.xy) / uGridN.z));
    vec2 Dn = texture(tDN, (p - uGridN.xy) / uGridN.z).rg;
    N = normalize(mix(N, Nn, nw));
    D = mix(D, Dn, nw);
  }
  float dr = D.x;
  float drl = D.y;
  float lvl = riverLevelM(p.x);
  float hw = riverHalfWM(p.x);
  float hRel = w.y - lvl;
  float slopeT = sqrt(max(1.0 - N.y * N.y, 0.0)) / max(N.y, 0.05);
  float town = townDensityM(p);
  float season = uSeasonA.x;

  // 细节法线（近处）
  float detK = 1.0 - smoothstep(6.0, 60.0, px * 40.0);
  if (detK > 0.0) {
    float e = 0.4;
    float n0 = vnoise2(p * 1.3);
    float nx = vnoise2((p + vec2(e, 0.0)) * 1.3);
    float nz = vnoise2((p + vec2(0.0, e)) * 1.3);
    N = normalize(N + vec3(n0 - nx, 0.0, n0 - nz) * 0.9 * detK);
  }

  // ---------- 基础：草地 ----------
  float gv = vnoise2(p / 37.0) * 0.6 + vnoise2(p / 9.0) * 0.4;
  vec3 grass = mix(vec3(0.075, 0.12, 0.04), vec3(0.11, 0.16, 0.05), gv);
  grass = mix(grass, vec3(0.13, 0.2, 0.055), uSeasonA.w * 0.6);
  grass = mix(grass, vec3(0.16, 0.14, 0.075), uSeasonA.z);
  vec3 alb = grass;
  float rough = 0.95;
  float waterLike = 0.0;
  float ao = 1.0;

  // ---------- 林冠 ----------
  float forest = forestDensity(p, slopeT, dr, hRel, town);
  if (forest > 0.0) {
    float crown = vnoise2(p / 6.5) * 0.55 + vnoise2(p / 2.3) * 0.25 + vnoise2(p / 23.0) * 0.2;
    float evergreen = step(0.55, vnoise2(p / 90.0 + 7.0));
    vec3 leafC = mix(vec3(0.03, 0.06, 0.024), vec3(0.05, 0.085, 0.03), crown);
    leafC = mix(leafC, vec3(0.06, 0.1, 0.03), uSeasonA.w * 0.5);
    vec3 autumnC = mix(vec3(0.17, 0.07, 0.02), vec3(0.2, 0.15, 0.03), vnoise2(p / 14.0));
    vec3 decid = mix(leafC, autumnC, uSeasonA.y * 0.85);
    decid = mix(vec3(0.075, 0.065, 0.055) * (0.8 + 0.4 * crown), decid, sat((season - 0.12) / 0.88));
    vec3 conif = vec3(0.025, 0.045, 0.028) * (0.8 + 0.4 * crown);
    vec3 fc = mix(decid, conif, evergreen);
    // 林冠的明暗：树冠间的空隙更暗
    float gap = smoothstep(0.35, 0.15, crown);
    fc *= 1.0 - 0.45 * gap;
    alb = mix(alb, fc, forest);
    ao = mix(ao, 0.75, forest);
    rough = mix(rough, 1.0, forest);
  }

  // ---------- 田块（谷底） ----------
  float fieldM = (1.0 - smoothstep(14.0, 26.0, hRel)) * (1.0 - smoothstep(0.08, 0.16, slopeT)) * (1.0 - forest) * smoothstep(hw + 30.0, hw + 70.0, dr) * (1.0 - smoothstep(0.05, 0.25, town));
  fieldM *= step(drl, 1e9);
  fieldM *= 1.0 - (1.0 - smoothstep(15.0, 30.0, drl)) * nw;
  if (fieldM > 0.0) {
    float fr, fw, ridge;
    vec3 fc = fieldColor(p, px, fr, fw, ridge);
    alb = mix(alb, fc, fieldM);
    rough = mix(rough, fr, fieldM);
    waterLike = max(waterLike, fw * fieldM);
  }

  // ---------- 镇区 ----------
  vec4 tt = townTex(p);
  if (town > 0.0) {
    // 镇上的空地多是菜园、草地与树荫；建筑四周是水泥院坝与人行道
    float yard = vnoise2(p / 14.0);
    vec3 garden = mix(vec3(0.075, 0.115, 0.04), vec3(0.11, 0.13, 0.055), yard);
    float veg = step(0.62, vnoise2(p / 6.0 + 3.0)) * (1.0 - smoothstep(0.3, 1.0, px));
    garden = mix(garden, mix(garden, vec3(0.13, 0.1, 0.07), 0.6), veg * 0.5);
    garden = mix(garden, vec3(0.14, 0.13, 0.075), uSeasonA.z * 0.6);
    vec3 yardPave = vec3(0.19, 0.18, 0.165) * (0.9 + 0.15 * vnoise2(p * 0.4));
    vec3 ground = mix(garden, yardPave, smoothstep(0.12, 0.5, tt.a));
    alb = mix(alb, ground, smoothstep(0.08, 0.3, town));
  }
  float pave = 1.0 - smoothstep(-0.3 - px, 0.3 + px, paveSDF(tt));
  alb = mix(alb, vec3(0.2, 0.195, 0.18) * (0.9 + 0.1 * vnoise2(p * 0.7)), pave);
  float road = 1.0 - smoothstep(-0.3 - px, 0.3 + px, roadSDF(tt));
  alb = mix(alb, vec3(0.055, 0.055, 0.06) * (0.9 + 0.2 * vnoise2(p * 0.3)), road);
  rough = mix(rough, 0.7, max(road, pave));

  // ---------- 校园 ----------
  vec4 sc = schoolSurface(p, px);
  if (sc.a > 0.0) {
    alb = mix(alb, sc.rgb, sc.a);
    rough = mix(rough, 0.8, sc.a);
  }

  // ---------- 铁路道床 ----------
  if (nw > 0.0) {
    float bal = (1.0 - smoothstep(3.0, 3.6 + px, drl)) * nw;
    vec3 balC = vec3(0.16, 0.15, 0.14) * (0.85 + 0.3 * vnoise2(p * 3.0));
    alb = mix(alb, balC, bal);
    float shoulder = (1.0 - smoothstep(5.5, 9.0, drl)) * (1.0 - bal) * nw;
    alb = mix(alb, mix(alb, vec3(0.14, 0.13, 0.1), 0.6), shoulder);
  }

  // ---------- 河岸 ----------
  float bankZone = 1.0 - smoothstep(hw + 2.0, hw + 9.0 + px, dr);
  if (bankZone > 0.0) {
    float inTown = smoothstep(250.0, 450.0, p.x) * (1.0 - smoothstep(3200.0, 3500.0, p.x));
    vec3 mud = mix(vec3(0.13, 0.11, 0.085), vec3(0.2, 0.18, 0.15), vnoise2(p * 0.8));
    vec3 stone = vec3(0.23, 0.22, 0.2) * (0.85 + 0.25 * vnoise2(vec2(p.x * 0.5, w.y * 4.0)));
    alb = mix(alb, mix(mud, stone, inTown), bankZone);
    rough = mix(rough, 0.85, bankZone);
  }

  // ---------- 湿润 ----------
  float porous = 1.0 - road * 0.3;
  alb *= mix(1.0, 0.62, uWet * porous);
  float wet = max(uWet * (0.12 + 0.75 * max(road, pave)) * (1.0 - forest), waterLike);

  // ---------- 光照 ----------
  float cs = cloudShadow(p * 0.001);
  float ks = keyShadow(vec3(p.x, w.y, p.y), N);
  vec3 col = shade(alb, N, w, ao, rough, wet, cs, ks);
  // 水田像镜子一样映出天空
  if (waterLike > 0.0) {
    vec3 V = normalize(cameraPosition - w);
    vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
    float F = 0.02 + 0.98 * pow(1.0 - max(V.y, 0.0), 5.0);
    col = mix(col, envSpec(R, 0.02) * F + alb * 0.2 * (uMirrorE + uAmbSky) / PI, waterLike * 0.9);
  }
  col = applyAtmos(col, w);
  gl_FragColor = vec4(col, 1.0);
}
