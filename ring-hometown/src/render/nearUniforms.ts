// 近景材质共享的 uniform：阴影图、镇区纹理、更细的季节量
import { Matrix4, Texture, Vector2, Vector4 } from 'three';

export const NU = {
  tShadowKey: { value: null as Texture | null },
  uShadowKeyMat: { value: new Matrix4() },
  uShadowKeyOn: { value: 0 },
  uShadowKeyTexel: { value: new Vector2(1 / 2048, 1 / 2048) },
  tShadowStar: { value: null as Texture | null },
  uShadowStarMat: { value: new Matrix4() },
  uShadowStarOn: { value: 0 },
  uShadowStarTexel: { value: new Vector2(1 / 2048, 1 / 2048) },
  tTown: { value: null as Texture | null },
  uTownGrid: { value: new Vector4(0, 0, 1, 1) },
  uSeasonC: { value: new Vector4() },
  uSeasonD: { value: new Vector4() },
};
