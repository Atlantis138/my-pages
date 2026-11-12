// 渲染管线：HDR 主缓冲（多重采样 + 浮点深度）、环境图、镜群点层、复制层（供水面反射）、后期
import {
  DepthTexture,
  FloatType,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  NearestFilter,
  NoToneMapping,
  OrthographicCamera,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  GLSL3,
  WebGLRenderer,
  WebGLRenderTarget,
  ClampToEdgeWrapping,
  RepeatWrapping,
  LinearSRGBColorSpace,
} from 'three';
import { createSkyMaterial, createSkyMesh, fullscreenTriangle } from './sky';
import { Post } from './post';
import { U } from './uniforms';

export function detectReversedDepth(): boolean {
  if (/[?&]logdepth/.test(location.search)) return false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    const ok = !!gl.getExtension('EXT_clip_control');
    const lose = gl.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

const COPY_FRAG = /* glsl */ `
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform float uNear;
uniform float uFar;
uniform float uReversed;
uniform float uLogDepth;
in vec2 vUv;
void main() {
  vec3 c = texture(tColor, vUv).rgb;
  float z = texture(tDepth, vUv).r;
  float dist;
  if (uLogDepth > 0.5) {
    // three.js 对数深度：z = log2(1 + w) / log2(1 + far)
    dist = exp2(z * log2(uFar + 1.0)) - 1.0;
  } else if (uReversed > 0.5) {
    // 反向深度（0..1）：z = near(far - w) / (w (far - near))
    dist = z <= 0.0 ? 1e9 : uNear * uFar / (z * (uFar - uNear) + uNear);
  } else {
    float ndc = z * 2.0 - 1.0;
    dist = 2.0 * uNear * uFar / (uFar + uNear - ndc * (uFar - uNear));
  }
  if (z >= 1.0 && uReversed < 0.5) dist = 1e9;
  gl_FragColor = vec4(c, dist);
}
`;

const COPY_VERT = /* glsl */ `
out vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export class Pipeline {
  readonly renderer: WebGLRenderer;
  readonly reversed: boolean;
  readonly logDepth: boolean;
  readonly camera: PerspectiveCamera;
  readonly sceneMain = new Scene();
  readonly sceneWater = new Scene();
  readonly sceneFx = new Scene();
  readonly sceneSpace = new Scene();
  readonly skyMat: ShaderMaterial;
  readonly envMat: ShaderMaterial;
  readonly post: Post;
  mainRT!: WebGLRenderTarget;
  copyRT!: WebGLRenderTarget;
  spaceRT!: WebGLRenderTarget;
  readonly envRT: WebGLRenderTarget;
  private envScene = new Scene();
  private quadScene = new Scene();
  private quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private copyMat: ShaderMaterial;
  private quad: Mesh;
  width = 1;
  height = 1;
  scale = 1;
  samples = 4;

  constructor(canvas: HTMLCanvasElement) {
    const rev = detectReversedDepth();
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      reversedDepthBuffer: rev,
      logarithmicDepthBuffer: !rev,
      stencil: false,
    });
    this.reversed = rev && this.renderer.capabilities.reversedDepthBuffer;
    this.logDepth = !this.reversed;
    this.renderer.toneMapping = NoToneMapping;
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 1);

    this.camera = new PerspectiveCamera(55, 1, 0.25, 260000);
    this.camera.position.set(0, 1.7, 0);

    this.skyMat = createSkyMaterial(false);
    this.skyMat.uniforms.uCamWorld.value = this.camera.matrixWorld;
    this.skyMat.uniforms.uDepthZ.value = this.reversed ? 0.0 : 1.0;
    this.sceneMain.add(createSkyMesh(this.skyMat));

    this.envMat = createSkyMaterial(true);
    this.envMat.uniforms.uCamWorld.value = this.camera.matrixWorld;
    const envMesh = new Mesh(fullscreenTriangle(), this.envMat);
    envMesh.frustumCulled = false;
    this.envScene.add(envMesh);
    this.envRT = new WebGLRenderTarget(256, 128, {
      type: HalfFloatType,
      format: RGBAFormat,
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      wrapS: RepeatWrapping,
      wrapT: ClampToEdgeWrapping,
    });
    U.tEnv.value = this.envRT.texture;

    this.copyMat = new ShaderMaterial({
      vertexShader: COPY_VERT,
      fragmentShader: COPY_FRAG,
      uniforms: {
        tColor: { value: null },
        tDepth: { value: null },
        uNear: { value: this.camera.near },
        uFar: { value: this.camera.far },
        uReversed: { value: this.reversed ? 1 : 0 },
        uLogDepth: { value: this.logDepth ? 1 : 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new Mesh(fullscreenTriangle(), this.copyMat);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);

    this.post = new Post();
  }

  setSize(cssW: number, cssH: number, scale: number): void {
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    // 内部分辨率上限约 2560×1440，避免高分屏上像素过多
    const maxPx = 2560 * 1440;
    if (cssW * cssH * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (cssW * cssH));
    const w = Math.max(16, Math.round(cssW * dpr * scale));
    const h = Math.max(16, Math.round(cssH * dpr * scale));
    this.scale = scale;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    (this.renderer.domElement.style as CSSStyleDeclaration).width = cssW + 'px';
    (this.renderer.domElement.style as CSSStyleDeclaration).height = cssH + 'px';
    if (w === this.width && h === this.height && this.mainRT) return;
    this.width = w;
    this.height = h;
    this.mainRT?.dispose();
    this.copyRT?.dispose();
    this.spaceRT?.dispose();
    const depth = new DepthTexture(w, h, FloatType);
    depth.minFilter = NearestFilter;
    depth.magFilter = NearestFilter;
    this.mainRT = new WebGLRenderTarget(w, h, {
      type: HalfFloatType,
      format: RGBAFormat,
      samples: this.samples,
      depthBuffer: true,
      depthTexture: depth,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
    });
    this.copyRT = new WebGLRenderTarget(w, h, { type: HalfFloatType, format: RGBAFormat, depthBuffer: false, minFilter: LinearFilter, magFilter: LinearFilter });
    this.spaceRT = new WebGLRenderTarget(w, h, { type: HalfFloatType, format: RGBAFormat, depthBuffer: false });
    U.tSpace.value = this.spaceRT.texture;
    this.post.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  updateViewUniforms(): void {
    const cam = this.camera;
    cam.updateMatrixWorld();
    const tY = Math.tan((cam.fov * Math.PI) / 360);
    U.uTanHalf.value.set(tY * cam.aspect, tY);
    U.uPixAng.value = (2 * tY) / this.height;
    U.uRes.value.set(this.width, this.height);
  }

  renderEnv(): void {
    const r = this.renderer;
    r.setRenderTarget(this.envRT);
    r.render(this.envScene, this.quadCam);
  }

  renderSpace(): void {
    const r = this.renderer;
    r.setRenderTarget(this.spaceRT);
    r.setClearColor(0x000000, 1);
    r.clear(true, false, false);
    r.render(this.sceneSpace, this.camera);
  }

  renderMain(): void {
    const r = this.renderer;
    r.setRenderTarget(this.mainRT);
    r.setClearColor(0x000000, 1);
    r.clear(true, true, false);
    r.render(this.sceneMain, this.camera);
  }

  copyForWater(): void {
    const r = this.renderer;
    this.copyMat.uniforms.tColor.value = this.mainRT.texture;
    this.copyMat.uniforms.tDepth.value = this.mainRT.depthTexture;
    r.setRenderTarget(this.copyRT);
    r.render(this.quadScene, this.quadCam);
  }

  renderWaterAndFx(): void {
    const r = this.renderer;
    r.setRenderTarget(this.mainRT);
    r.render(this.sceneWater, this.camera);
    r.render(this.sceneFx, this.camera);
  }

  renderPost(): void {
    this.post.render(this.renderer, this.mainRT.texture, null);
  }
}
