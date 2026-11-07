/*
 * 风格注册表：图鉴里出现哪些风格、以什么顺序出现，只由这里决定。
 *
 * - id   对应 styles/<id>/ 文件夹，文件夹里至少要有 meta.js 与 specimen.css。
 * - page 为 true 时，该文件夹里还有一张完整的风格介绍页 styles/<id>/index.html，
 *        图鉴卡片会显示「进入完整页面」，各完整页底部的上一篇 / 下一篇也据此生成。
 *
 * 编号 No.xx 按本数组顺序自动生成；在同一谱系（group）内调整顺序即可改变展示次序。
 */
export const STYLES = [
  /* 艺术与印刷源流 */
  { id: "nouveau" },
  { id: "bauhaus" },
  { id: "constructivism" },
  { id: "deco" },
  { id: "swiss" },
  { id: "neochinese" },
  /* 数字界面范式 */
  { id: "skeuo" },
  { id: "minimal" },
  { id: "flat" },
  { id: "material", page: true },
  { id: "neumorph", page: true },
  { id: "glass" },
  { id: "aurora" },
  { id: "clay" },
  { id: "bento" },
  /* 反叛与表达 */
  { id: "memphis" },
  { id: "grunge" },
  { id: "brutal" },
  { id: "acid" },
  { id: "neobrutal" },
  /* 怀旧与未来 */
  { id: "terminal" },
  { id: "pixel" },
  { id: "cyber" },
  { id: "y2k" },
  { id: "vapor" },
];

/** 按注册顺序并行载入每个风格的 meta.js，返回带编号的数组。 */
export async function loadStyles(base = new URL("./", import.meta.url)) {
  const metas = await Promise.all(
    STYLES.map(({ id }) => import(new URL(`${id}/meta.js`, base).href).then((m) => m.default))
  );
  return metas.map((meta, i) => ({ ...meta, no: i + 1, page: !!STYLES[i].page }));
}

/** 带完整页面的风格（按注册顺序），供完整页之间互相导航。 */
export function pagedStyles() {
  return STYLES.map((s, i) => ({ ...s, no: i + 1 })).filter((s) => s.page);
}
