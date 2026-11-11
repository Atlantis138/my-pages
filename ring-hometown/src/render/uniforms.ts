// 所有着色器共享的 uniform（同一对象引用，改一次处处生效）
import { Vector2, Vector3, Vector4, Matrix3, Texture } from 'three';

export const U = {
  // 大气
  uMieK: { value: 0.004 },
  uMieG: { value: 0.74 },
  uRainExt: { value: 0 },
  // 光照
  uDayE: { value: new Vector3(1.0, 0.965, 0.925) },
  uMirrorE: { value: new Vector3() },
  uMirrorDir: { value: new Vector3(0, 1, 0) },
  uArchE: { value: new Vector3() },
  uArchDir: { value: new Vector3(0, 1, 0) },
  uArchMax: { value: 0.0012 },
  uStarDir: { value: new Vector3(0, 0.1, 1).normalize() },
  uStarE: { value: new Vector3() },
  uStarAlpha: { value: 0.00465 },
  uStarGround: { value: new Vector3() }, // 地面（观察点）上的恒星照度，已含遮挡与消光
  uStarMargin0: { value: -1 },
  uAmbSky: { value: new Vector3() },
  uLocalHour: { value: 12 },
  // 季节
  uSeasonA: { value: new Vector4(1, 0, 0, 0) },
  uSeasonB: { value: new Vector4(0, 0, 0, 0) },
  uFarTime: { value: 0 },
  uFarCloudBias: { value: 0 },
  // 天体
  uL2I: { value: new Matrix3() },
  uSpin: { value: 0 },
  uTimeS: { value: 0 },
  uObsH: { value: 0.0017 },
  uMirrorDay: { value: 1 },
  uStarVisSky: { value: 0 },
  uFarComp: { value: 0 },
  uStarSpaceE: { value: new Vector3(1.4, 1.34, 1.26) },
  // 天气
  uCloudCover: { value: 0.2 },
  uCloudBase: { value: 1.6 },
  uCloudThick: { value: 1.0 },
  uCloudDark: { value: 0 },
  uStratus: { value: 0 },
  uShowers: { value: 0 },
  uHighCloud: { value: 0.3 },
  uCloudOff: { value: new Vector2() },
  uCloudEvo: { value: 0 },
  uRain: { value: 0 },
  uFogNow: { value: 0 },
  uFogTop: { value: 60 },
  uWet: { value: 0 },
  uWind: { value: new Vector2(1, 0) }, // 风向量（m/s）
  // 夜间灯光穹顶
  uGlow: { value: [new Vector4(), new Vector4(), new Vector4(), new Vector4()] },
  uGlowColor: { value: new Vector3(1.0, 0.62, 0.32) },
  uNight: { value: 0 }, // 夜晚程度（亮灯）
  // 视图
  uTanHalf: { value: new Vector2(1, 1) },
  uPixAng: { value: 0.001 },
  uRes: { value: new Vector2(1, 1) },
  uCamPosK: { value: new Vector3(0, 0.0017, 0) },
  // 纹理
  tEnv: { value: null as Texture | null },
  tSpace: { value: null as Texture | null },
  uHasSpace: { value: 0 },
};

export type SharedUniforms = typeof U;
