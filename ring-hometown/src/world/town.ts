// 镇区：路网、建筑、路灯、村落。生成道路/铺装距离场与路灯光照贴图
import { DataTexture, LinearFilter, RGBAFormat, UnsignedByteType, ClampToEdgeWrapping } from 'three';
import { TOWN, riverLine, railLine, P2, catmull, polyline, sampleAt, riverHalfWidth, townDensity, rng, SCHOOL, STATION, Polyline } from './geo';
import { signedDistance } from './edt';
import type { Terrain } from './terrain';

export interface Road {
  pts: P2[];
  width: number;
  cls: 'main' | 'street' | 'lane' | 'path' | 'country';
}

export interface Building {
  x: number;
  y: number; // 地面高程
  z: number;
  rot: number;
  w: number; // 沿街宽
  d: number; // 进深
  h: number; // 墙高
  roof: number; // 0 平顶 1 坡顶
  wall: [number, number, number];
  roofC: [number, number, number];
  seed: number;
  kind: number; // 0 民居 1 公寓 2 学校 3 车站/公共建筑 4 厂房
}

export interface Lamp {
  x: number;
  y: number;
  z: number;
  h: number;
}

export interface TownData {
  roads: Road[];
  buildings: Building[];
  lamps: Lamp[];
  texture: DataTexture;
  bridges: { a: P2; b: P2; width: number; y: number }[];
}

/** 河流某处的中心、切向 */
function riverAtX(x: number): { z: number; tz: number } {
  // 河流整体自西向东，用二分在弧长上找 x
  const pl = riverLine;
  let lo = 0;
  let hi = pl.length;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (sampleAt(pl, m).p[0] < x) lo = m;
    else hi = m;
  }
  const s = sampleAt(pl, (lo + hi) / 2);
  return { z: s.p[1], tz: s.t[1] / Math.max(1e-3, s.t[0]) };
}

function railAtX(x: number): number {
  const pl = railLine;
  let lo = 0;
  let hi = pl.length;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (sampleAt(pl, m).p[0] < x) lo = m;
    else hi = m;
  }
  return sampleAt(pl, (lo + hi) / 2).p[1];
}

function offsetRiver(x0: number, x1: number, off: number, step = 40): P2[] {
  const pts: P2[] = [];
  for (let x = x0; x <= x1; x += step) {
    const r = riverAtX(x);
    const hw = riverHalfWidth(x);
    pts.push([x, r.z + Math.sign(off) * (hw + Math.abs(off))]);
  }
  return pts;
}

export function buildTown(terrain: Terrain): TownData {
  const R = rng(20240611);
  const roads: Road[] = [];
  // ---------- 主要道路 ----------
  // 北岸滨河路：自后山脚向东延伸出镇，成为沿河谷的公路
  const riverside = offsetRiver(-1400, 5400, -24);
  roads.push({ pts: riverside, width: 13, cls: 'main' });
  const valleyRoad: P2[] = catmull(
    [riverside[riverside.length - 1], [6600, 760], [8200, 900], [9800, 860], [11400, 1500], [13200, 1820], [14800, 2050], [16600, 2500], [18400, 2900]],
    60,
  );
  roads.push({ pts: valleyRoad, width: 8, cls: 'country' });
  // 二马路：在滨河路以北约 170 m
  const second: P2[] = [];
  for (let x = 540; x <= 3300; x += 40) second.push([x, riverAtX(x).z - riverHalfWidth(x) - 200 + 30 * Math.sin(x / 700)]);
  roads.push({ pts: second, width: 10, cls: 'street' });
  // 站前路：铁路南侧
  const stationRd: P2[] = [];
  for (let x = 560; x <= 2900; x += 40) stationRd.push([x, railAtX(x) + 44]);
  roads.push({ pts: stationRd, width: 11, cls: 'main' });
  // 学校门前路
  roads.push({ pts: [[525, -45], [600, -45], [660, -60]], width: 9, cls: 'street' });
  // 南北向小街
  const crossXs: number[] = [];
  for (let x = 660; x < 3250; x += 120 + R() * 70) crossXs.push(x);
  for (const x of crossXs) {
    const zTop = railAtX(x) + 44;
    const zBot = riverAtX(x).z - riverHalfWidth(x) - 24;
    const skew = (R() - 0.5) * 40;
    const pts: P2[] = [];
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      pts.push([x + skew * t + Math.sin(t * 3 + x) * 4, zTop + (zBot - zTop) * t]);
    }
    roads.push({ pts, width: R() < 0.35 ? 9 : 6.5, cls: R() < 0.35 ? 'street' : 'lane' });
  }
  // 大桥：跨河通往南岸
  const bridgeX = 1380;
  const rb = riverAtX(bridgeX);
  const hwB = riverHalfWidth(bridgeX);
  const bridgeA: P2 = [bridgeX, rb.z - hwB - 24];
  const bridgeB: P2 = [bridgeX + 8, rb.z + hwB + 24];
  roads.push({ pts: [bridgeA, bridgeB], width: 13, cls: 'main' });
  // 南岸路
  const southBank = offsetRiver(650, 3000, 26);
  roads.push({ pts: southBank, width: 9, cls: 'street' });
  // 过桥向南上山的公路
  roads.push({
    pts: catmull([bridgeB, [1400, 1250], [1520, 1600], [1460, 2000], [1700, 2500], [1980, 3100], [2300, 3500]], 30),
    width: 7.5,
    cls: 'country',
  });
  // 南岸的小巷
  for (let x = 820; x < 2900; x += 160 + R() * 80) {
    const z0 = riverAtX(x).z + riverHalfWidth(x) + 26;
    roads.push({ pts: [[x, z0], [x + (R() - 0.5) * 30, z0 + 160 + R() * 120]], width: 5.5, cls: 'lane' });
  }
  // 后山小路：山顶 → 学校
  roads.push({ pts: catmull([[6, 6], [40, 30], [85, 40], [130, 22], [168, 5]], 6), width: 2.4, cls: 'path' });
  // 后山向西的山道
  roads.push({ pts: catmull([[-8, -4], [-120, -60], [-300, -170], [-520, -330]], 10), width: 2.2, cls: 'path' });

  // ---------- 铺装：站前广场、滨河步道、校门广场 ----------
  const paves: { pts: P2[]; width: number }[] = [];
  paves.push({ pts: offsetRiver(380, 3300, -6), width: 9 });
  paves.push({ pts: [[STATION.x - 70, railAtX(STATION.x) + 30], [STATION.x + 70, railAtX(STATION.x) + 30]], width: 30 });
  paves.push({ pts: [[STATION.x - STATION.len / 2, railAtX(STATION.x) + 12], [STATION.x + STATION.len / 2, railAtX(STATION.x) + 12]], width: 7 });
  paves.push({ pts: [[530, -45], [545, -45]], width: 30 });

  // ---------- 栅格化到画布，再求距离场 ----------
  const res = TOWN.res;
  const cell = TOWN.size / res;
  const cv = document.createElement('canvas');
  cv.width = res;
  cv.height = res;
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  const toPx = (p: P2): [number, number] => [(p[0] - TOWN.x0) / cell, (p[1] - TOWN.z0) / cell];
  const strokeAll = (list: { pts: P2[]; width: number }[]) => {
    ctx.clearRect(0, 0, res, res);
    ctx.strokeStyle = '#fff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const r of list) {
      ctx.lineWidth = r.width / cell;
      ctx.beginPath();
      r.pts.forEach((p, i) => {
        const [x, y] = toPx(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    const img = ctx.getImageData(0, 0, res, res).data;
    const m = new Uint8Array(res * res);
    for (let i = 0; i < res * res; i++) m[i] = img[i * 4 + 3] > 127 ? 1 : 0;
    return m;
  };
  const roadMask = strokeAll(roads);
  const roadSdf = signedDistance(roadMask, res, res, cell);
  const paveMask = strokeAll(paves);
  const paveSdf = signedDistance(paveMask, res, res, cell);

  // ---------- 建筑 ----------
  const occ = new Uint8Array(res * res); // 与画布同分辨率的占用格
  for (let i = 0; i < res * res; i++) occ[i] = roadMask[i] | paveMask[i];
  const buildings: Building[] = [];
  const fits = (cx: number, cz: number, rot: number, w: number, d: number, margin: number): boolean => {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const hw = w / 2 + margin;
    const hd = d / 2 + margin;
    for (let a = -hw; a <= hw; a += cell * 0.9) {
      for (let b = -hd; b <= hd; b += cell * 0.9) {
        const x = cx + c * a - s * b;
        const z = cz + s * a + c * b;
        const ix = Math.floor((x - TOWN.x0) / cell);
        const iz = Math.floor((z - TOWN.z0) / cell);
        if (ix < 0 || iz < 0 || ix >= res || iz >= res) return false;
        if (occ[iz * res + ix]) return false;
      }
    }
    return true;
  };
  const mark = (cx: number, cz: number, rot: number, w: number, d: number): void => {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    for (let a = -w / 2 - 1; a <= w / 2 + 1; a += cell * 0.7) {
      for (let b = -d / 2 - 1; b <= d / 2 + 1; b += cell * 0.7) {
        const x = cx + c * a - s * b;
        const z = cz + s * a + c * b;
        const ix = Math.floor((x - TOWN.x0) / cell);
        const iz = Math.floor((z - TOWN.z0) / cell);
        if (ix >= 0 && iz >= 0 && ix < res && iz < res) occ[iz * res + ix] = 1;
      }
    }
  };
  const groundAt = (cx: number, cz: number, rot: number, w: number, d: number): number => {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    let m = Infinity;
    for (const [a, b] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2], [0, 0]]) {
      m = Math.min(m, terrain.height(cx + c * a - s * b, cz + s * a + c * b));
    }
    return m;
  };
  const wallPalette: [number, number, number][] = [
    [0.62, 0.6, 0.55], [0.7, 0.68, 0.62], [0.55, 0.53, 0.5], [0.66, 0.6, 0.5], [0.58, 0.5, 0.42],
    [0.72, 0.71, 0.68], [0.5, 0.47, 0.44], [0.64, 0.57, 0.47], [0.6, 0.62, 0.6], [0.68, 0.64, 0.58],
  ];
  const roofPalette: [number, number, number][] = [
    [0.12, 0.12, 0.13], [0.16, 0.15, 0.15], [0.3, 0.13, 0.08], [0.24, 0.12, 0.08], [0.1, 0.12, 0.15], [0.2, 0.2, 0.21],
  ];
  const addB = (b: Omit<Building, 'y' | 'seed'>, margin: number): boolean => {
    if (!fits(b.x, b.z, b.rot, b.w, b.d, margin)) return false;
    // 避开河道与铁路
    if (terrain.riverDist(b.x, b.z) < riverHalfWidth(b.x) + Math.max(b.w, b.d) * 0.5 + 10) return false;
    if (terrain.railDist(b.x, b.z) < Math.max(b.w, b.d) * 0.5 + 12) return false;
    if (terrain.slope(b.x, b.z) > 0.22) return false;
    const y = groundAt(b.x, b.z, b.rot, b.w, b.d);
    buildings.push({ ...b, y, seed: R() });
    mark(b.x, b.z, b.rot, b.w, b.d);
    return true;
  };

  // 学校：教学楼、实验楼、食堂宿舍、体育馆、门楼
  const school: Omit<Building, 'y' | 'seed'>[] = [
    { x: 215, z: -102, rot: Math.PI / 2, w: 112, d: 17, h: 18.6, roof: 0, wall: [0.78, 0.77, 0.74], roofC: [0.32, 0.31, 0.3], kind: 2 },
    { x: 318, z: -140, rot: 0, w: 106, d: 16, h: 15.5, roof: 0, wall: [0.8, 0.78, 0.74], roofC: [0.3, 0.3, 0.3], kind: 2 },
    { x: 266, z: -60, rot: 0, w: 46, d: 14, h: 12.4, roof: 0, wall: [0.74, 0.72, 0.68], roofC: [0.3, 0.3, 0.3], kind: 2 },
    { x: 485, z: -112, rot: Math.PI / 2, w: 60, d: 34, h: 13, roof: 1, wall: [0.7, 0.71, 0.72], roofC: [0.22, 0.32, 0.4], kind: 3 },
    { x: 210, z: 150, rot: 0, w: 70, d: 15, h: 15.5, roof: 0, wall: [0.76, 0.72, 0.66], roofC: [0.3, 0.3, 0.3], kind: 2 },
    { x: 306, z: 152, rot: 0, w: 40, d: 18, h: 9.3, roof: 1, wall: [0.74, 0.72, 0.68], roofC: [0.28, 0.13, 0.08], kind: 3 },
  ];
  for (const b of school) addB(b, -4);
  // 车站
  const sz = railAtX(STATION.x);
  addB({ x: STATION.x, z: sz + 27, rot: 0, w: 52, d: 16, h: 9, roof: 1, wall: [0.72, 0.7, 0.66], roofC: [0.16, 0.2, 0.24], kind: 3 }, -6);

  // 沿街布置民居与公寓
  const streetRoads = roads.filter((r) => r.cls !== 'path' && r.cls !== 'country');
  for (const rd of streetRoads) {
    const pl = polyline(rd.pts);
    for (const side of [-1, 1]) {
      let s = 6 + R() * 10;
      while (s < pl.length - 6) {
        const { p, t } = sampleAt(pl, s);
        const dens = townDensity(p[0], p[1]);
        if (dens < 0.08) {
          s += 25;
          continue;
        }
        const tall = dens > 0.75 && R() < 0.22;
        const w = tall ? 26 + R() * 14 : 8 + R() * 8;
        const d = tall ? 12 + R() * 4 : 9 + R() * 6;
        const floors = tall ? 5 + Math.floor(R() * 5) : 1 + Math.floor(R() * (1 + 3 * dens));
        const setback = rd.width / 2 + 3 + R() * 4 + d / 2;
        const nx = -t[1] * side;
        const nz = t[0] * side;
        const cx = p[0] + nx * setback;
        const cz = p[1] + nz * setback;
        const rot = Math.atan2(t[1], t[0]);
        const wall = wallPalette[Math.floor(R() * wallPalette.length)];
        const roof = !tall && R() < 0.72 ? 1 : 0;
        const roofC = roofPalette[Math.floor(R() * roofPalette.length)];
        if (R() < 0.9 * Math.min(1, dens * 1.8)) {
          addB({ x: cx, z: cz, rot, w, d, h: floors * 3.1 + 0.4, roof, wall, roofC, kind: tall ? 1 : 0 }, 1.2);
          // 第二排（院子后面）
          if (R() < dens * 0.7) {
            const back = setback + d / 2 + 8 + R() * 8 + 5;
            addB(
              { x: p[0] + nx * back, z: p[1] + nz * back, rot: rot + (R() - 0.5) * 0.08, w: 8 + R() * 7, d: 8 + R() * 5, h: (1 + Math.floor(R() * 3)) * 3.1 + 0.4, roof: 1, wall: wallPalette[Math.floor(R() * wallPalette.length)], roofC: roofPalette[Math.floor(R() * roofPalette.length)], kind: 0 },
              1.5,
            );
          }
        }
        s += w + 2 + R() * 7;
      }
    }
  }

  // ---------- 村落（谷地与山坡） ----------
  const villages: [number, number, number][] = [
    [5200, 380, 26], [7300, 2300, 30], [9700, 1250, 34], [12500, 1650, 26], [15300, 2600, 18], [11300, 3500, 20],
    [2700, 2350, 18], [-2500, 1650, 16], [4300, -1100, 14], [8600, -400, 16], [6800, 3600, 12], [13900, 600, 16],
    [-1600, -1500, 10], [19800, 4500, 22], [23800, 3100, 30], [28500, 5800, 26], [33000, 2500, 30], [37000, 7000, 24],
  ];
  const villageBuildings: Building[] = [];
  for (const [vx, vz, n] of villages) {
    const rot0 = R() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2;
      const r = Math.sqrt(R()) * (60 + n * 7);
      const x = vx + Math.cos(a) * r;
      const z = vz + Math.sin(a) * r;
      if (terrain.riverDist(x, z) < riverHalfWidth(x) + 30) continue;
      if (terrain.railDist(x, z) < 25) continue;
      if (terrain.slope(x, z) > 0.25) continue;
      const w = 8 + R() * 7;
      const d = 8 + R() * 4;
      const rot = rot0 + (R() < 0.7 ? 0 : Math.PI / 2) + (R() - 0.5) * 0.2;
      villageBuildings.push({
        x, z, rot, w, d,
        y: terrain.height(x, z) - 0.6,
        h: (1 + Math.floor(R() * 3)) * 3.1 + 0.3,
        roof: R() < 0.85 ? 1 : 0,
        wall: wallPalette[Math.floor(R() * wallPalette.length)],
        roofC: roofPalette[Math.floor(R() * roofPalette.length)],
        seed: R(),
        kind: 0,
      });
    }
  }
  buildings.push(...villageBuildings);

  // ---------- 路灯 ----------
  const lamps: Lamp[] = [];
  for (const rd of roads) {
    if (rd.cls === 'path') continue;
    const pl = polyline(rd.pts);
    const spacing = rd.cls === 'main' ? 32 : rd.cls === 'country' ? 60 : 40;
    let side = 1;
    for (let s = 8; s < pl.length; s += spacing) {
      const { p, t } = sampleAt(pl, s);
      if (rd.cls === 'country' && townDensity(p[0], p[1]) < 0.02 && R() < 0.75) continue;
      const off = rd.width / 2 + 1.2;
      const x = p[0] - t[1] * off * side;
      const z = p[1] + t[0] * off * side;
      if (terrain.riverDist(x, z) < riverHalfWidth(x) + 2 && Math.abs(x - bridgeX) > 20) continue;
      lamps.push({ x, z, y: terrain.height(x, z), h: rd.cls === 'main' ? 8.5 : 6.5 });
      if (rd.cls !== 'country') side = -side;
    }
  }
  // 学校与后山小路的灯
  lamps.push({ x: 120, z: 26, y: terrain.height(120, 26), h: 3.5 });
  lamps.push({ x: 60, z: 38, y: terrain.height(60, 38), h: 3.5 });
  for (const [x, z] of [[300, -100], [380, -100], [450, -40], [230, 40], [350, 120]] as P2[]) lamps.push({ x, z, y: SCHOOL.level, h: 6 });

  // ---------- 镇区纹理 ----------
  const lampLight = new Float32Array(res * res);
  for (const l of lamps) {
    const cx = (l.x - TOWN.x0) / cell;
    const cz = (l.z - TOWN.z0) / cell;
    const rad = (l.h * 2.6) / cell;
    const r0 = Math.ceil(rad * 2);
    for (let dz = -r0; dz <= r0; dz++) {
      for (let dx = -r0; dx <= r0; dx++) {
        const ix = Math.floor(cx) + dx;
        const iz = Math.floor(cz) + dz;
        if (ix < 0 || iz < 0 || ix >= res || iz >= res) continue;
        const r2 = ((ix + 0.5 - cx) ** 2 + (iz + 0.5 - cz) ** 2) / (rad * rad);
        lampLight[iz * res + ix] += Math.exp(-r2 * 1.6) * (l.h > 7 ? 1 : 0.7);
      }
    }
  }
  // 建筑周边（院落、人行道）的铺装掩码：建筑占地外扩并模糊
  const built = new Float32Array(res * res);
  for (const b of buildings) {
    if (b.x < TOWN.x0 || b.z < TOWN.z0 || b.x > TOWN.x0 + TOWN.size || b.z > TOWN.z0 + TOWN.size) continue;
    const c = Math.cos(b.rot);
    const sn = Math.sin(b.rot);
    const pad = b.kind === 2 ? 9 : 5;
    for (let a = -b.w / 2 - pad; a <= b.w / 2 + pad; a += cell * 0.7) {
      for (let d = -b.d / 2 - pad; d <= b.d / 2 + pad; d += cell * 0.7) {
        const x = b.x + c * a - sn * d;
        const z = b.z + sn * a + c * d;
        const ix = Math.floor((x - TOWN.x0) / cell);
        const iz = Math.floor((z - TOWN.z0) / cell);
        if (ix >= 0 && iz >= 0 && ix < res && iz < res) built[iz * res + ix] = 1;
      }
    }
  }
  // 简单的两遍盒式模糊
  const tmpB = new Float32Array(res * res);
  for (let pass = 0; pass < 2; pass++) {
    for (let z = 0; z < res; z++) for (let x = 0; x < res; x++) {
      let sum = 0;
      for (let k = -2; k <= 2; k++) sum += built[z * res + Math.min(res - 1, Math.max(0, x + k))];
      tmpB[z * res + x] = sum / 5;
    }
    for (let z = 0; z < res; z++) for (let x = 0; x < res; x++) {
      let sum = 0;
      for (let k = -2; k <= 2; k++) sum += tmpB[Math.min(res - 1, Math.max(0, z + k)) * res + x];
      built[z * res + x] = sum / 5;
    }
  }
  const data = new Uint8Array(res * res * 4);
  for (let i = 0; i < res * res; i++) {
    data[i * 4] = Math.max(0, Math.min(255, Math.round((roadSdf[i] / 32 + 0.5) * 255)));
    data[i * 4 + 1] = Math.max(0, Math.min(255, Math.round((paveSdf[i] / 32 + 0.5) * 255)));
    data[i * 4 + 2] = Math.max(0, Math.min(255, Math.round(Math.sqrt(Math.min(1, lampLight[i])) * 255)));
    data[i * 4 + 3] = Math.round(Math.min(1, built[i]) * 255);
  }
  const tex = new DataTexture(data, res, res, RGBAFormat, UnsignedByteType);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.needsUpdate = true;

  const bridges = [{ a: bridgeA, b: bridgeB, width: 13, y: Math.max(terrain.height(bridgeA[0], bridgeA[1]), terrain.height(bridgeB[0], bridgeB[1])) }];
  return { roads, buildings, lamps, texture: tex, bridges };
}

export function railPolyline(): Polyline {
  return railLine;
}
