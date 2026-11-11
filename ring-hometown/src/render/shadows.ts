// 阴影图：镜光（近天顶，柔和短影）与恒星斜光（春照秋照时的长影）。
// 每种物体用同一几何体、加 SHADOW_PASS 宏的材质渲染到浮点颜色缓冲（记录光源空间深度）。
import {
  FloatType,
  Matrix4,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RedFormat,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { NU } from './nearUniforms';
import { U } from './uniforms';

export class ShadowMap {
  readonly rt: WebGLRenderTarget;
  readonly cam: OrthographicCamera;
  readonly mat = new Matrix4();
  private proj = new Matrix4();
  readonly scene = new Scene();
  private lastDir = new Vector3(0, 0, 0);
  private lastTime = -1e9;
  dirty = true;

  constructor(
    w: number,
    h: number,
    private center: Vector3,
    private halfW: number,
    private halfH: number,
    private depth: number,
  ) {
    this.rt = new WebGLRenderTarget(w, h, { type: FloatType, format: RedFormat, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: true });
    this.cam = new OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, depth);
  }

  /** 光从 dir 方向照来（dir 指向光源） */
  setDirection(dir: Vector3): void {
    const d = dir.clone().normalize();
    const pos = this.center.clone().addScaledVector(d, this.depth * 0.5);
    this.cam.position.copy(pos);
    const up = Math.abs(d.y) > 0.9 ? new Vector3(0, 0, -1) : new Vector3(0, 1, 0);
    this.cam.up.copy(up);
    this.cam.lookAt(this.center);
    this.cam.updateMatrixWorld();
    this.proj.makeOrthographic(-this.halfW, this.halfW, this.halfH, -this.halfH, 1, this.depth);
    this.mat.multiplyMatrices(this.proj, this.cam.matrixWorldInverse);
    if (d.angleTo(this.lastDir) > 0.004) this.dirty = true;
  }

  render(r: WebGLRenderer, nowS: number, every = 4): boolean {
    if (!this.dirty && nowS - this.lastTime < every) return false;
    this.lastDir.copy(this.cam.position).sub(this.center).normalize();
    this.lastTime = nowS;
    this.dirty = false;
    U_SHADOW_PASS.value.copy(this.mat);
    r.setRenderTarget(this.rt);
    r.setClearColor(0xffffff, 1);
    r.clear(true, true, false);
    r.render(this.scene, this.cam);
    r.setClearColor(0x000000, 1);
    return true;
  }
}

/** 着色器中 SHADOW_PASS 使用的光源矩阵 */
export const U_SHADOW_PASS = { value: new Matrix4() };

export function shadowVariant(mat: ShaderMaterial): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: mat.vertexShader,
    fragmentShader: mat.fragmentShader,
    uniforms: { ...mat.uniforms, uShadowPassMat: U_SHADOW_PASS, tShadowKey: { value: null }, tShadowStar: { value: null }, tScene: { value: null } },
    defines: { ...(mat.defines || {}), SHADOW_PASS: 1 },
    side: 2,
  });
}

/** 把一组网格加入阴影场景（共用几何体） */
export function addCasters(sm: ShadowMap, meshes: Mesh[]): void {
  for (const m of meshes) {
    const mat = m.material as ShaderMaterial;
    const c = new Mesh(m.geometry, shadowVariant(mat));
    c.matrixAutoUpdate = false;
    c.matrix.copy(m.matrix);
    c.matrixWorld.copy(m.matrixWorld);
    c.frustumCulled = false;
    sm.scene.add(c);
  }
}

/** 阴影图用的规则地形网格（覆盖阴影区域） */
export function shadowTerrainGrid(terrainMat: ShaderMaterial, center: Vector3, half: number, n: number): Mesh {
  const g = new PlaneGeometry(half * 2, half * 2, n, n);
  g.rotateX(-Math.PI / 2);
  g.translate(center.x, 0, center.z);
  const m = new Mesh(g, shadowVariant(terrainMat));
  m.frustumCulled = false;
  return m;
}

export function bindShadowUniforms(key: ShadowMap, star: ShadowMap): void {
  NU.tShadowKey.value = key.rt.texture;
  NU.uShadowKeyMat.value = key.mat;
  NU.uShadowKeyTexel.value.set(1 / key.rt.width, 1 / key.rt.height);
  NU.tShadowStar.value = star.rt.texture;
  NU.uShadowStarMat.value = star.mat;
  NU.uShadowStarTexel.value.set(1 / star.rt.width, 1 / star.rt.height);
  void U;
}
