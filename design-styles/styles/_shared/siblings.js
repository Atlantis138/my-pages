/*
 * 完整页面之间的导航数据。每张完整页按自己的风格把它画出来，这里只提供数据：
 *   const nav = await siblings("material");
 *   nav.no / nav.total      图鉴编号与总数
 *   nav.catalog             返回图鉴并定位到该风格卡片的链接
 *   nav.prev / nav.next     相邻的完整页面（没有则为 null），含 meta.js 的全部字段与 href
 * 链接都相对于 styles/<id>/index.html。
 */
import { STYLES } from "../registry.js";

export async function siblings(id) {
  const index = STYLES.findIndex((s) => s.id === id);
  const paged = STYLES.map((s, i) => ({ ...s, no: i + 1 })).filter((s) => s.page);
  const at = paged.findIndex((s) => s.id === id);
  const load = async (s) =>
    s ? { ...(await import(`../${s.id}/meta.js`)).default, no: s.no, href: `../${s.id}/` } : null;
  const [prev, next] = await Promise.all([load(paged[at - 1]), load(paged[at + 1])]);
  return { no: index + 1, total: STYLES.length, catalog: `../../#s-${id}`, prev, next };
}
