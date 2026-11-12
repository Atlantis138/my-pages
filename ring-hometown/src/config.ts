// 环世界与观察点的基本常数。长度单位：远景用千米，近景用米。

export const RING = {
  /** 环半径（千米）：直径十万公里 */
  R: 50000,
  /** 环带半宽（千米）：宽一千公里 */
  halfWidth: 500,
  /** 边墙高度（千米） */
  wallHeight: 50,
  /** 自转周期（分钟）：3 小时 56 分 */
  rotationMinutes: 236,
  /** 六条辐条的地面落点经度（度，以小镇为 0，东＝顺旋方向为正） */
  spokeLongitudes: [-35, 25, 85, 145, 205, 265],
  /** 中央镜云：距环轴 3000–7000 km，轴向 ±3750 km，中间为辐条扫过的空隙 */
  mirror: { rMin: 3000, rMax: 7000, zMax: 3750, gap: 260 },
  /** 中央星港（环心）尺寸 */
  hub: { radius: 120, halfLength: 360 },
};

export const ORBIT = {
  /** 半长轴（千米）：1 AU */
  a: 149597870.7,
  e: 0.0475,
  yearDays: 365.2422,
  /** 类太阳恒星半径（千米） */
  starRadius: 695700,
  /** 历元（环历 1127 年 1 月 1 日 0 时）后的近星点时刻（日） */
  perihelionDay: 2.6,
};

/** 观察者：中学后山山顶，站在环带中线上；以山顶地面为基准面（0 m） */
export const OBSERVER = {
  eyeHeight: 1.7, // m
};

/** 人工昼夜（本地时，小时） */
export const DAYLIGHT = {
  dawnStart: 4.5,
  dawnEnd: 7.5,
  duskStart: 16.5,
  duskEnd: 19.5,
};

export const EPOCH_YEAR = 1127;

/** 每日自转圈数 */
export const ROT_PER_DAY = 1440 / RING.rotationMinutes;

/** 自转相位初值（弧度），任意取值 */
export const SPIN_PHASE0 = 1.234;

export const DEG = Math.PI / 180;
