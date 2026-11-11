// 近处的雨丝：围绕相机的一个圆柱体积内的实例化细长面片，随风倾斜
import {
  AdditiveBlending,
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  ShaderMaterial,
} from 'three';
import common from '../glsl/common.glsl';
import { U } from './uniforms';

const VERT = /* glsl */ `
attribute vec4 iDrop; // 单位体积内的位置 (x, y, z) 与随机数
uniform float uRain;
uniform vec2 uWind;
uniform float uTimeS;
uniform float uCount;
varying float vA;
varying vec2 vUv;
void main() {
  float idx = float(gl_InstanceID);
  // 雨小时只显示一部分雨丝
  float show = step(idx, uCount * uRain * uRain * 0.9 + uCount * 0.1 * step(0.01, uRain));
  vec3 box = vec3(36.0, 26.0, 36.0);
  float fall = 8.5 + iDrop.w * 2.0;
  vec3 v = vec3(uWind.x * 0.8, -fall, uWind.y * 0.8);
  vec3 p = iDrop.xyz * box;
  p += v * uTimeS;
  // 绕相机取模
  vec3 c = cameraPosition;
  p = mod(p - c + box * 0.5, box) - box * 0.5 + c;
  // 面片：沿速度方向拉长，朝向相机
  vec3 dir = normalize(v);
  vec3 toCam = normalize(c - p);
  vec3 side = normalize(cross(dir, toCam));
  float len = 0.55 + 0.25 * iDrop.w;
  float wid = 0.008 + 0.004 * length(c - p) * 0.02;
  vec3 wp = p + dir * (position.y * len) + side * (position.x * wid);
  vA = show * (1.0 - smoothstep(10.0, 18.0, length(p - c))) * (0.5 + 0.5 * iDrop.w);
  vUv = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uMirrorE;
uniform vec3 uArchE;
uniform vec3 uAmbSky;
uniform float uNight;
varying float vA;
varying vec2 vUv;
void main() {
  if (vA <= 0.001) discard;
  float a = (1.0 - abs(vUv.x) * 2.0) * smoothstep(-0.5, 0.0, vUv.y) * (1.0 - smoothstep(0.2, 0.5, vUv.y));
  vec3 L = (uMirrorE * 0.06 + uAmbSky * 0.12 + uArchE * 0.15 + vec3(1.0, 0.75, 0.5) * 0.00012 * uNight);
  gl_FragColor = vec4(L * a * vA, 1.0);
}
`;

export interface Rain {
  mesh: Mesh;
  update(cam: PerspectiveCamera, dt: number): void;
}

export function createRain(quality: number): Rain {
  const count = quality >= 2 ? 9000 : quality === 1 ? 6000 : 3500;
  const g = new InstancedBufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]), 3));
  const d = new Float32Array(count * 4);
  let s = 99;
  const r = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 0; i < count; i++) d.set([r(), r(), r(), r()], i * 4);
  g.setAttribute('iDrop', new InstancedBufferAttribute(d, 4));
  g.instanceCount = count;
  const mat = new ShaderMaterial({
    vertexShader: common + VERT,
    fragmentShader: FRAG,
    uniforms: { ...U, uCount: { value: count } },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 10;
  return {
    mesh,
    update() {
      mesh.visible = U.uRain.value > 0.01;
    },
  };
}
