// 应用：组装场景、推进时间、更新光照与天气、渲染
import { Matrix4, Mesh, ShaderMaterial, Vector3 } from 'three';
import { Pipeline } from './render/pipeline';
import { CameraRig } from './ui/camera';
import { Weather, WeatherKind } from './sim/weather';
import { updateLighting, LightInfo } from './sim/lightstate';
import { U } from './render/uniforms';
import { NU } from './render/nearUniforms';
import { Terrain } from './world/terrain';
import { createTerrainMeshes, createTerrainMaterial } from './render/terrainMesh';
import { buildTown, TownData } from './world/town';
import { createTownMeshes } from './render/townMesh';
import { TOWN } from './world/geo';
import { createWater } from './render/water';
import { placeTrees } from './world/vegetation';
import { createTreeMeshes } from './render/trees';
import { createRail, RailSystem } from './render/rail';
import { createMirrorPoints } from './render/mirror';
import { ShadowMap, addCasters, shadowTerrainGrid, bindShadowUniforms } from './render/shadows';
import { createRain, Rain } from './render/rain';
import { createGlowPoints } from './render/glow';
import { createGrass } from './render/grass';

export interface AppOptions {
  quality: number; // 0 低 1 中 2 高
  lite?: boolean; // 调试：只渲染天空
  onProgress?: (msg: string, frac: number) => void;
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export class App {
  readonly pipe: Pipeline;
  readonly rig: CameraRig;
  weather!: Weather;
  t = 0; // 模拟时间（日）
  speed = 1; // 模拟秒 / 真实秒
  paused = false;
  light!: LightInfo;
  terrain!: Terrain;
  town!: TownData;
  rail!: RailSystem;
  rain!: Rain;
  private keyShadow!: ShadowMap;
  private starShadow!: ShadowMap;
  private waterMat!: ShaderMaterial;
  private viewProj = new Matrix4();
  exposure = 3;
  private exposureTarget = 3;
  private last = 0;
  private elapsed = 0;
  private fade = 1;
  /** 时间平滑跳转 */
  private jump: { from: number; to: number; t0: number; dur: number } | null = null;
  frameMs = 16;
  onFrame: ((dtReal: number) => void) | null = null;
  ready = false;

  constructor(canvas: HTMLCanvasElement, private opts: AppOptions) {
    this.pipe = new Pipeline(canvas);
    this.pipe.samples = opts.quality >= 1 ? 4 : 0;
    this.rig = new CameraRig(this.pipe.camera, canvas, { yaw: 0.12, pitch: 0.06, fov: 58 });
    this.rig.setHome({ yaw: 0.12, pitch: 0.06, fov: 58 });
  }

  async init(t0: number): Promise<void> {
    const p0 = this.opts.onProgress ?? (() => {});
    let tl = performance.now();
    const p = (m: string, f: number) => {
      const n = performance.now();
      console.log(`[init] ${m} (+${(n - tl).toFixed(0)} ms)`);
      tl = n;
      p0(m, f);
    };
    const q = this.opts.quality;
    this.t = t0;
    this.weather = new Weather(t0);
    this.weather.snap(t0);
    if (this.opts.lite) return this.initLite(q);
    p('测绘河谷地形', 0.08);
    await nextFrame();
    this.terrain = new Terrain(this.pipe.renderer);
    p('铺设地表', 0.3);
    await nextFrame();
    const terrainMeshes = createTerrainMeshes(this.terrain, q);
    for (const m of terrainMeshes) this.pipe.sceneMain.add(m);
    p('修建小镇与学校', 0.42);
    await nextFrame();
    this.town = buildTown(this.terrain);
    NU.tTown.value = this.town.texture;
    NU.uTownGrid.value.set(TOWN.x0, TOWN.z0, TOWN.size, TOWN.res);
    const townMeshes = createTownMeshes(this.town);
    for (const m of townMeshes) this.pipe.sceneMain.add(m);
    p('种树', 0.6);
    await nextFrame();
    const trees = placeTrees(this.terrain, this.town, q);
    console.log(`[init] ${this.town.buildings.length} 栋建筑，${this.town.lamps.length} 盏路灯，${trees.length} 棵树`);
    const treeMeshes = createTreeMeshes(trees, this.pipe.samples > 0);
    for (const m of treeMeshes) this.pipe.sceneMain.add(m);
    this.pipe.sceneMain.add(createGrass(this.terrain, q));
    p('引水入河、铺轨通车', 0.75);
    await nextFrame();
    const water = createWater(this.terrain);
    this.pipe.sceneWater.add(water.mesh);
    this.waterMat = water.mat;
    water.mat.uniforms.uViewProj.value = this.viewProj;
    this.rail = createRail(this.terrain);
    for (const m of this.rail.meshes) this.pipe.sceneMain.add(m);
    p('悬挂镜云', 0.85);
    await nextFrame();
    this.pipe.sceneSpace.add(createMirrorPoints(q >= 2 ? 36000 : q === 1 ? 22000 : 12000));
    U.uHasSpace.value = 1;
    this.rain = createRain(q);
    this.pipe.sceneFx.add(this.rain.mesh);
    this.pipe.sceneFx.add(createGlowPoints(this.town));

    // 阴影
    const center = new Vector3(1300, -60, 250);
    const ks = q >= 2 ? 4096 : 2048;
    this.keyShadow = new ShadowMap(ks, ks, center, 2000, 2000, 6000);
    this.starShadow = new ShadowMap(ks, ks / 2, center, 2600, 900, 30000);
    const casters: Mesh[] = [...townMeshes, ...treeMeshes, ...this.rail.meshes.filter((m) => m !== this.rail.train.mesh)];
    addCasters(this.keyShadow, casters);
    addCasters(this.starShadow, casters);
    const tmat = createTerrainMaterial(this.terrain);
    this.keyShadow.scene.add(shadowTerrainGrid(tmat, center, 2000, 400));
    this.starShadow.scene.add(shadowTerrainGrid(tmat, center, 4500, 500));
    bindShadowUniforms(this.keyShadow, this.starShadow);
    NU.uShadowKeyOn.value = 1;

    p('点亮天空', 0.95);
    await nextFrame();
    this.resize();
    this.update(0);
    this.exposure = this.exposureTarget;
    this.ready = true;
  }

  private async initLite(q: number): Promise<void> {
    this.pipe.sceneSpace.add(createMirrorPoints(q >= 2 ? 36000 : q === 1 ? 22000 : 12000));
    U.uHasSpace.value = 1;
    this.rail = { meshes: [], train: { update() {}, mesh: null } } as unknown as RailSystem;
    this.rain = { mesh: null, update() {} } as unknown as Rain;
    this.waterMat = new ShaderMaterial({ uniforms: { tScene: { value: null }, uViewProj: { value: null } } });
    this.keyShadow = { setDirection() {}, render() { return false; } } as unknown as ShadowMap;
    this.starShadow = this.keyShadow;
    this.resize();
    this.update(0);
    this.exposure = this.exposureTarget;
    this.ready = true;
  }

  resize(scale = this.pipe.scale): void {
    this.pipe.setSize(window.innerWidth, window.innerHeight, scale);
  }

  setWeather(k: 'auto' | WeatherKind): void {
    this.weather.setMode(k);
  }

  /** 跳到某个时刻：dur>0 时在 dur 秒内平滑推进（只向前） */
  jumpTo(t: number, dur = 0): void {
    if (dur <= 0) {
      this.t = t;
      this.weather.snap(t);
      this.jump = null;
      this.exposureSnap = true;
      return;
    }
    this.jump = { from: this.t, to: t, t0: performance.now() / 1000, dur };
  }
  private exposureSnap = false;

  /** 淡入淡出（日期跳转时用） */
  flash(): void {
    this.fade = 0;
  }

  update(dtReal: number): void {
    const now = performance.now() / 1000;
    let dtSim = 0;
    if (this.jump) {
      const k = Math.min(1, (now - this.jump.t0) / this.jump.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const nt = this.jump.from + (this.jump.to - this.jump.from) * e;
      dtSim = nt - this.t;
      this.t = nt;
      if (k >= 1) this.jump = null;
    } else if (!this.paused) {
      dtSim = (dtReal * this.speed) / 86400;
      this.t += dtSim;
    }
    this.elapsed += dtReal;
    this.weather.update(this.t, Math.max(0, dtSim), dtReal);
    this.light = updateLighting(this.t, this.weather.state);
    this.rig.update(dtReal);
    this.pipe.updateViewUniforms();
    // 曝光：照度越低曝光越高，但只部分补偿——夜晚仍是夜晚
    this.exposureTarget = 3.0 / Math.pow(this.light.sceneE + 1e-5, 0.72);
    if (this.exposureSnap) {
      this.exposure = this.exposureTarget;
      this.exposureSnap = false;
    } else {
      const k = 1 - Math.exp(-dtReal * (Math.abs(dtSim) > 1e-4 ? 6 : 1.6));
      this.exposure = Math.exp(Math.log(this.exposure) + (Math.log(this.exposureTarget) - Math.log(this.exposure)) * k);
    }
    this.fade = Math.min(1, this.fade + dtReal * 2.5);
  }

  private keyDir = new Vector3();
  private starDir = new Vector3();

  render(): void {
    if (!this.ready) return;
    const now = performance.now();
    const dtReal = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.update(dtReal);
    this.onFrame?.(dtReal);
    const pipe = this.pipe;
    const c = pipe.post.composite.uniforms;
    c.uExposure.value = this.exposure;
    // 远景局部适应：曝光很高（夜里）时才明显起作用
    U.uFarComp.value = Math.max(0, this.exposure - 20) * 0.45;
    c.uNightVis.value = Math.max(0, Math.min(1, 1 - this.light.sceneE * 40));
    c.uTime.value = this.elapsed;
    c.uFade.value = this.fade;
    // 恒星眩光：投影到屏幕
    this.updateGlare();

    this.rail.train.update(this.t);
    this.rain.update(pipe.camera, dtReal);
    this.viewProj.multiplyMatrices(pipe.camera.projectionMatrix, pipe.camera.matrixWorldInverse);
    this.waterMat.uniforms.tScene.value = pipe.copyRT.texture;

    // 阴影：主光方向由镜光与对岸光按强度合成
    const me = U.uMirrorE.value.y;
    const ae = U.uArchE.value.y;
    this.keyDir.copy(U.uMirrorDir.value).multiplyScalar(me + 1e-6).addScaledVector(U.uArchDir.value, ae * 1.5).normalize();
    if (this.keyDir.y < 0.3) this.keyDir.set(this.keyDir.x, 0.3, this.keyDir.z).normalize();
    this.keyShadow.setDirection(this.keyDir);
    this.keyShadow.render(pipe.renderer, this.elapsed, 6);
    const starOn = this.light.starGround > 1e-6 || (U.uStarE.value.x > 0 && this.light.star.margin > -0.004);
    NU.uShadowStarOn.value = starOn ? 1 : 0;
    if (starOn) {
      this.starDir.copy(U.uStarDir.value);
      this.starShadow.setDirection(this.starDir);
      this.starShadow.render(pipe.renderer, this.elapsed, 1.5);
    }

    pipe.renderEnv();
    pipe.renderSpace();
    pipe.renderMain();
    pipe.copyForWater();
    pipe.renderWaterAndFx();
    pipe.renderPost();
    this.frameMs = this.frameMs * 0.92 + (performance.now() - now) * 0.08;
  }

  private glareV = new Vector3();
  private updateGlare(): void {
    const c = this.pipe.post.composite.uniforms;
    const s = U.uStarDir.value;
    const vis = this.light.starFrac;
    if (vis <= 0 || U.uStarE.value.x <= 0) {
      c.uGlarePos.value.set(0, 0, 0);
      return;
    }
    const cam = this.pipe.camera;
    this.glareV.copy(s).multiplyScalar(1000).add(cam.position).project(cam);
    const inFront = this.glareV.z < 1 && this.glareV.z > -1;
    // 透过大气的强度（低仰角，约十个大气质量）
    const strength = vis * 60 * Math.exp(-1.2);
    c.uGlarePos.value.set(this.glareV.x * 0.5 + 0.5, this.glareV.y * 0.5 + 0.5, inFront ? strength : 0);
    c.uGlareAspect.value = cam.aspect;
  }
}
