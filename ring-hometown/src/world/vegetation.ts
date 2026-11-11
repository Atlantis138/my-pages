// 树木分布：林地（与地形着色器同一个林地密度）、行道树、河岸垂柳、校园、后山、田间防护林、竹丛
import { fbm2, vnoise2, rng, riverHalfWidth, riverLevel, townDensity, TOWN, P2, polyline, sampleAt } from './geo';
import type { Terrain } from './terrain';
import type { TownData } from './town';

export const TREE = {
  ROUND: 0, // 常绿阔叶（樟树一类）
  DECID: 1, // 落叶阔叶
  PINE: 2, // 针叶
  POPLAR: 3, // 杨树（窄高）
  WILLOW: 4, // 垂柳
  GINKGO: 5, // 银杏（秋天金黄）
  BAMBOO: 6, // 竹丛
  BLOSSOM: 7, // 开花树（樱、桃）
};

export interface TreeInst {
  x: number;
  y: number;
  z: number;
  h: number; // 树高
  r: number; // 冠幅半径
  type: number;
  seed: number;
}

/** 与 terrain.frag 一致的林地密度 */
export function forestDensity(x: number, z: number, slopeT: number, dr: number, hRel: number, town: number): number {
  const n = fbm2(x / 700 + 3.7, z / 700 + 1.9, 3) * 0.75 + vnoise2(x / 160, z / 160) * 0.25;
  const hill = smoothstep(16, 60, hRel);
  let f = n + hill * 0.3 + Math.min(slopeT, 0.6) * 0.55 - 0.5;
  f -= town * 1.3;
  f -= (1 - smoothstep(70, 160, dr)) * 0.6;
  return smoothstep(0, 0.1, f);
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function placeTrees(terrain: Terrain, town: TownData, quality: number): TreeInst[] {
  const R = rng(777);
  const trees: TreeInst[] = [];
  const add = (x: number, z: number, h: number, r: number, type: number, sink = 0.6) => {
    trees.push({ x, z, y: terrain.height(x, z) - sink, h, r, type, seed: R() });
  };
  // 建筑占地（避免树长在房子里）
  const occRes = 1024;
  const occCell = TOWN.size / occRes;
  const occ = new Uint8Array(occRes * occRes);
  for (const b of town.buildings) {
    const c = Math.cos(b.rot);
    const s = Math.sin(b.rot);
    for (let a = -b.w / 2 - 2; a <= b.w / 2 + 2; a += occCell * 0.8) {
      for (let d = -b.d / 2 - 2; d <= b.d / 2 + 2; d += occCell * 0.8) {
        const x = b.x + c * a - s * d;
        const z = b.z + s * a + c * d;
        const ix = Math.floor((x - TOWN.x0) / occCell);
        const iz = Math.floor((z - TOWN.z0) / occCell);
        if (ix >= 0 && iz >= 0 && ix < occRes && iz < occRes) occ[iz * occRes + ix] = 1;
      }
    }
  }
  const blocked = (x: number, z: number): boolean => {
    const ix = Math.floor((x - TOWN.x0) / occCell);
    const iz = Math.floor((z - TOWN.z0) / occCell);
    if (ix < 0 || iz < 0 || ix >= occRes || iz >= occRes) return false;
    return occ[iz * occRes + ix] === 1;
  };
  const roadNear = (x: number, z: number, w: number): boolean => {
    // 粗略：用镇区道路折线判断
    for (const rd of town.roads) {
      if (rd.cls === 'path') continue;
      for (let i = 0; i < rd.pts.length - 1; i++) {
        const [ax, az] = rd.pts[i];
        const [bx, bz] = rd.pts[i + 1];
        const ux = bx - ax;
        const uz = bz - az;
        const L2 = ux * ux + uz * uz || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * ux + (z - az) * uz) / L2));
        const dx = ax + ux * t - x;
        const dz = az + uz * t - z;
        if (dx * dx + dz * dz < (rd.width / 2 + w) ** 2) return true;
      }
    }
    return false;
  };

  // ---------- 林地 ----------
  const density = quality >= 2 ? 0.85 : quality === 1 ? 0.6 : 0.38;
  // 远处（>4.5 km）的林地只靠地形着色器的林冠纹理表现
  const rings: [number, number, number][] = [
    [0, 1200, 12],
    [1200, 2600, 22],
    [2600, 4500, 36],
  ];
  for (const [r0, r1, sp] of rings) {
    const spacing = sp / Math.sqrt(density);
    for (let gz = -r1; gz <= r1; gz += spacing) {
      for (let gx = -r1; gx <= r1; gx += spacing) {
        const x = gx + (R() - 0.5) * spacing;
        const z = gz + (R() - 0.5) * spacing;
        const d = Math.hypot(x, z);
        if (d < r0 || d >= r1) continue;
        // 只放在看得到的方向附近（全方位都放，背后也是山）
        const dr = terrain.riverDist(x, z);
        const lvl = riverLevel(x);
        const h0 = terrain.height(x, z);
        const hRel = h0 - lvl;
        const slopeT = terrain.slope(x, z);
        const town = townDensity(x, z);
        const f = forestDensity(x, z, slopeT, dr, hRel, town);
        if (f <= 0.05 || R() > f) continue;
        if (d < 260 && x > -20 && Math.abs(z) < 120 + x * 0.4) continue; // 山顶前方留出视野
        if (blocked(x, z)) continue;
        const ever = vnoise2(x / 90 + 7, z / 90) > 0.55;
        const kind = ever ? (R() < 0.6 ? TREE.PINE : TREE.ROUND) : R() < 0.1 ? TREE.GINKGO : TREE.DECID;
        const scale = d < 1200 ? 1.1 : d < 2600 ? 1.5 : 2.0;
        const h = (kind === TREE.PINE ? 13 + R() * 9 : 10 + R() * 8) * (0.9 + 0.2 * R());
        add(x, z, h * Math.min(scale, 1.3), (kind === TREE.PINE ? 2.6 : 3.6 + R() * 1.8) * scale, kind);
      }
    }
  }

  // ---------- 后山：观察点两侧的树，前方坡面留空 ----------
  // 观察点四周：东、东南、南三个方向留出视野（看学校、河谷与南墙），树在西、北两侧框景
  const hillTrees: [number, number, number, number][] = [
    [-6, -15, 9, TREE.ROUND], [-17, 10, 8, TREE.DECID], [-16, -4, 11, TREE.PINE], [-14, -24, 12, TREE.PINE],
    [12, -27, 7, TREE.BLOSSOM], [-28, 26, 9, TREE.DECID], [-30, -12, 13, TREE.PINE], [-38, 14, 10, TREE.ROUND],
    [30, -46, 9, TREE.DECID], [-52, 40, 10, TREE.ROUND], [-48, -30, 12, TREE.PINE], [-40, -44, 12, TREE.ROUND],
  ];
  for (const [x, z, h, type] of hillTrees) add(x, z, h, type === TREE.PINE ? 2.4 : 3.4, type, 0.3);
  for (let i = 0; i < 260; i++) {
    const a = R() * Math.PI * 2;
    const r = 30 + Math.sqrt(R()) * 280;
    const x = Math.cos(a) * r - 40;
    const z = Math.sin(a) * r;
    // 东南方向的坡面（朝学校、朝河）留出视野
    const ang = Math.atan2(z, x);
    if (ang > -0.75 && ang < 1.95 && r < 260) continue;
    if (x > 120 && z > -200 && z < 200) continue;
    const h = terrain.height(x, z);
    if (h < -55) continue;
    const t = R() < 0.4 ? TREE.PINE : R() < 0.7 ? TREE.ROUND : TREE.DECID;
    add(x, z, 9 + R() * 8, t === TREE.PINE ? 2.6 : 3.4 + R() * 1.4, t, 0.4);
  }

  // ---------- 校园 ----------
  const campusRows: [P2, P2, number][] = [
    [[175, -175], [520, -175], 9],
    [[175, 168], [520, 168], 9],
    [[518, -170], [518, 160], 9],
    [[300, -100], [300, -60], 6],
    [[340, 100], [455, 100], 8],
    [[340, 4], [455, 4], 8],
  ];
  for (const [a, b, sp] of campusRows) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let s = 0; s <= L; s += sp) {
      const x = a[0] + ((b[0] - a[0]) * s) / L;
      const z = a[1] + ((b[1] - a[1]) * s) / L;
      if (blocked(x, z)) continue;
      const t = R() < 0.25 ? TREE.GINKGO : TREE.ROUND;
      add(x, z, 8 + R() * 4, 2.6 + R(), t, 0.2);
    }
  }

  // ---------- 行道树 ----------
  for (const rd of town.roads) {
    if (rd.cls === 'path' || rd.cls === 'lane') continue;
    const pl = polyline(rd.pts);
    const sp = rd.cls === 'country' ? 14 : 10;
    const type = rd.cls === 'country' ? TREE.POPLAR : R() < 0.5 ? TREE.ROUND : TREE.GINKGO;
    for (let s = 5; s < pl.length; s += sp) {
      const { p, t } = sampleAt(pl, s);
      const dens = townDensity(p[0], p[1]);
      if (rd.cls !== 'country' && dens < 0.05) continue;
      if (rd.cls === 'country' && R() < 0.35) continue;
      for (const side of [-1, 1]) {
        const off = rd.width / 2 + 2.2;
        const x = p[0] - t[1] * off * side;
        const z = p[1] + t[0] * off * side;
        if (blocked(x, z)) continue;
        if (terrain.riverDist(x, z) < riverHalfWidth(x) + 3) continue;
        if (terrain.railDist(x, z) < 8) continue;
        const h = type === TREE.POPLAR ? 16 + R() * 6 : 8 + R() * 4;
        add(x, z, h, type === TREE.POPLAR ? 1.8 : 2.6 + R() * 0.8, type, 0.2);
      }
    }
  }

  // ---------- 庭院里的树、竹丛 ----------
  for (let i = 0; i < 1400 * density; i++) {
    const x = 300 + R() * 3200;
    const z = -600 + R() * 2000;
    const dens = townDensity(x, z);
    if (R() > dens * 0.8 + 0.05) continue;
    if (blocked(x, z) || roadNear(x, z, 2)) continue;
    if (terrain.riverDist(x, z) < riverHalfWidth(x) + 6) continue;
    if (terrain.railDist(x, z) < 10) continue;
    if (x > 160 && x < 530 && z > -190 && z < 180) continue;
    const r = R();
    const type = r < 0.35 ? TREE.ROUND : r < 0.6 ? TREE.DECID : r < 0.72 ? TREE.BAMBOO : r < 0.85 ? TREE.BLOSSOM : TREE.GINKGO;
    add(x, z, type === TREE.BAMBOO ? 7 + R() * 4 : 6 + R() * 6, type === TREE.BAMBOO ? 2.5 : 2.4 + R() * 1.6, type, 0.3);
  }

  // ---------- 河岸垂柳与杨树 ----------
  {
    const spacing = 11;
    for (let x = -3000; x < 15000; x += spacing) {
      for (const side of [-1, 1]) {
        if (R() < (townDensity(x, 0) > 0.1 ? 0.25 : 0.55)) continue;
        // 河流中心与切向
        const z0 = riverZ(x, terrain);
        const hw = riverHalfWidth(x);
        const off = hw + 5 + R() * 8;
        const z = z0 + side * off;
        if (blocked(x, z) || roadNear(x, z, 1.5)) continue;
        if (terrain.railDist(x, z) < 9) continue;
        const willow = R() < 0.7;
        add(x, z, willow ? 8 + R() * 3 : 15 + R() * 5, willow ? 3.6 : 1.8, willow ? TREE.WILLOW : TREE.POPLAR, 0.3);
      }
    }
  }

  // ---------- 田间防护林与村旁竹林 ----------
  for (let i = 0; i < 2600 * density; i++) {
    const x = -2000 + R() * 18000;
    const z = -2500 + R() * 6500;
    const d = Math.hypot(x, z);
    if (d < 400) continue;
    const lvl = riverLevel(x);
    const h0 = terrain.height(x, z);
    if (h0 - lvl > 20) continue;
    const dr = terrain.riverDist(x, z);
    if (dr < riverHalfWidth(x) + 20) continue;
    if (townDensity(x, z) > 0.15) continue;
    if (terrain.railDist(x, z) < 12) continue;
    // 沿田块边界成行：用低频噪声的等值线
    const line = Math.abs(vnoise2(x / 260, z / 90) - 0.5);
    if (line > 0.025 && R() > 0.04) continue;
    const r = R();
    const type = r < 0.45 ? TREE.POPLAR : r < 0.7 ? TREE.DECID : r < 0.85 ? TREE.BAMBOO : TREE.ROUND;
    const scale = d < 2000 ? 1 : 1.25;
    add(x, z, (type === TREE.POPLAR ? 15 + R() * 5 : 8 + R() * 5) * scale, (type === TREE.POPLAR ? 1.8 : 3) * scale, type, 0.3);
  }
  return trees;
}

const riverCache = new Map<number, number>();
function riverZ(x: number, terrain: Terrain): number {
  const k = Math.round(x / 10);
  const c = riverCache.get(k);
  if (c !== undefined) return c;
  // 在 z 方向搜索距离场最小处
  let best = Infinity;
  let bz = 0;
  for (let z = -1000; z <= 4500; z += 20) {
    const d = terrain.riverDist(x, z);
    if (d < best) {
      best = d;
      bz = z;
    }
  }
  for (let z = bz - 20; z <= bz + 20; z += 2) {
    const d = terrain.riverDist(x, z);
    if (d < best) {
      best = d;
      bz = z;
    }
  }
  riverCache.set(k, bz);
  return bz;
}
