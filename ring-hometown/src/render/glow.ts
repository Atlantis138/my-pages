// 夜里的灯点：路灯灯头的发光点（亚像素时也保持可见，亮度按真实大小折算）
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';
import { U } from './uniforms';
import type { TownData } from '../world/town';

const VERT = /* glsl */ `
attribute float size;
uniform float uNight;
uniform float uPixAng;
varying float vI;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec3 wp = position;
  vec4 c = viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
  gl_Position = projectionMatrix * c;
  float dist = -c.z;
  // 灯头约 0.5 m：像素尺寸
  float px = 0.5 / max(dist * uPixAng, 1e-4);
  float s = max(px, 1.6);
  gl_PointSize = s * 2.5;
  // 能量守恒：小于一个像素时降低亮度
  float on = smoothstep(0.25, 0.55, uNight);
  vI = on * size * min(1.0, px * px / (s * s) * 4.0 + 0.15) * exp(-dist / 9000.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
`;

const FRAG = /* glsl */ `
varying float vI;
#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
varying float vFragDepth;
#endif
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q) * 2.5;
  float core = exp(-r * r * 6.0);
  float halo = exp(-r * 2.2) * 0.12;
  vec3 c = vec3(1.0, 0.76, 0.5) * vI * (core * 0.35 + halo * 0.05);
  if (vI <= 0.0) discard;
  gl_FragColor = vec4(c, 1.0);
}
`;

export function createGlowPoints(town: TownData): Points {
  const n = town.lamps.length;
  const pos = new Float32Array(n * 3);
  const size = new Float32Array(n);
  town.lamps.forEach((l, i) => {
    pos.set([l.x + 0.3, l.y + l.h - 0.1, l.z], i * 3);
    size[i] = l.h > 7 ? 1 : 0.7;
  });
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('size', new BufferAttribute(size, 1));
  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { ...U },
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const p = new Points(g, mat);
  p.frustumCulled = false;
  p.renderOrder = 5;
  return p;
}
