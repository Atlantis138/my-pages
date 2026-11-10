/*
 * 二十四节气：名称、大致的公历日期、初候（七十二候里每个节气的第一候）。
 * 当前节气按太阳视黄经推算：黄经每走 15° 换一个节气，立春为 315°。
 * 这里用的是低精度公式（误差约百分之一度，换算成时间在半小时以内），
 * 交节当天的前后几十分钟可能与历书不一致。
 */
export const TERMS = [
  { name: "立春", date: "2 月 4 日", hou: "东风解冻" },
  { name: "雨水", date: "2 月 19 日", hou: "獭祭鱼" },
  { name: "惊蛰", date: "3 月 5 日", hou: "桃始华" },
  { name: "春分", date: "3 月 20 日", hou: "玄鸟至" },
  { name: "清明", date: "4 月 5 日", hou: "桐始华" },
  { name: "谷雨", date: "4 月 20 日", hou: "萍始生" },
  { name: "立夏", date: "5 月 5 日", hou: "蝼蝈鸣" },
  { name: "小满", date: "5 月 21 日", hou: "苦菜秀" },
  { name: "芒种", date: "6 月 5 日", hou: "螳螂生" },
  { name: "夏至", date: "6 月 21 日", hou: "鹿角解" },
  { name: "小暑", date: "7 月 7 日", hou: "温风至" },
  { name: "大暑", date: "7 月 23 日", hou: "腐草为萤" },
  { name: "立秋", date: "8 月 7 日", hou: "凉风至" },
  { name: "处暑", date: "8 月 23 日", hou: "鹰乃祭鸟" },
  { name: "白露", date: "9 月 7 日", hou: "鸿雁来" },
  { name: "秋分", date: "9 月 23 日", hou: "雷始收声" },
  { name: "寒露", date: "10 月 8 日", hou: "鸿雁来宾" },
  { name: "霜降", date: "10 月 23 日", hou: "豺乃祭兽" },
  { name: "立冬", date: "11 月 7 日", hou: "水始冰" },
  { name: "小雪", date: "11 月 22 日", hou: "虹藏不见" },
  { name: "大雪", date: "12 月 7 日", hou: "鹖鴠不鸣" },
  { name: "冬至", date: "12 月 22 日", hou: "蚯蚓结" },
  { name: "小寒", date: "1 月 5 日", hou: "雁北乡" },
  { name: "大寒", date: "1 月 20 日", hou: "鸡始乳" },
];

/* 每六个节气一季；间色的名字取自传统颜料，色值在 page.css 里 */
export const SEASONS = [
  { id: "spring", cn: "春", tint: "竹青" },
  { id: "summer", cn: "夏", tint: "石青" },
  { id: "autumn", cn: "秋", tint: "赭石" },
  { id: "winter", cn: "冬", tint: "黛蓝" },
];

/** 太阳视黄经（度）。公式取自常见的低精度太阳位置算法。 */
export function sunLongitude(date) {
  const rad = Math.PI / 180;
  const T = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;   /* 儒略世纪数 */
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const lon = L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * rad);
  return ((lon % 360) + 360) % 360;
}

/** 给定时刻所在节气的序号（0 = 立春 … 23 = 大寒）。 */
export function currentTerm(date) {
  return Math.floor((((sunLongitude(date) - 315) % 360) + 360) % 360 / 15);
}
