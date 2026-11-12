// 天空/远景全屏通道
import { BufferGeometry, Float32BufferAttribute, GLSL3, Mesh, ShaderMaterial } from 'three';
import common from '../glsl/common.glsl';
import atmos from '../glsl/atmos.glsl';
import ringmap from '../glsl/ringmap.glsl';
import clouds from '../glsl/clouds.glsl';
import skyFrag from '../glsl/sky.frag';
import { U } from './uniforms';

export function fullscreenTriangle(): BufferGeometry {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  return g;
}

const SKY_VERT = /* glsl */ `
uniform float uDepthZ;
out vec2 vNdc;
void main() {
  vNdc = position.xy;
  gl_Position = vec4(position.xy, uDepthZ, 1.0);
}
`;

export function createSkyMaterial(env: boolean): ShaderMaterial {
  const mat = new ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: common + '\n' + atmos + '\n' + clouds + '\n' + ringmap + '\n' + skyFrag,
    uniforms: {
      ...U,
      uCamWorld: { value: null },
      uEnvMode: { value: env ? 1 : 0 },
      uDepthZ: { value: 1 },
    },
    depthWrite: false,
    depthTest: !env,
  });
  return mat;
}

export function createSkyMesh(mat: ShaderMaterial): Mesh {
  const m = new Mesh(fullscreenTriangle(), mat);
  m.frustumCulled = false;
  m.renderOrder = 1000;
  return m;
}
