// 以观察点为圆心的极坐标地形网格（按角度分扇区，便于视锥剔除）
import { BufferAttribute, BufferGeometry, Mesh, ShaderMaterial, Sphere, Vector3, Vector4 } from 'three';
import common from '../glsl/common.glsl';
import atmos from '../glsl/atmos.glsl';
import clouds from '../glsl/clouds.glsl';
import near from '../glsl/near.glsl';
import terrainVert from '../glsl/terrain.vert';
import terrainFrag from '../glsl/terrain.frag';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import { Terrain } from '../world/terrain';

export const NEAR_HEADER = common + '\n' + atmos + '\n' + clouds + '\n' + near + '\n';

export function buildPolarSectors(segments: number, rings: number, rMin: number, rMax: number, sectors: number): BufferGeometry[] {
  const out: BufferGeometry[] = [];
  const k = Math.pow(rMax / rMin, 1 / (rings - 1));
  const radii: number[] = [];
  for (let i = 0; i < rings; i++) radii.push(rMin * Math.pow(k, i));
  const perSector = segments / sectors;
  for (let s = 0; s < sectors; s++) {
    const a0 = s * perSector;
    const cols = perSector + 1;
    const pos = new Float32Array((rings * cols + 1) * 3);
    let vi = 0;
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < cols; j++) {
        const a = ((a0 + j) / segments) * Math.PI * 2;
        pos[vi++] = Math.cos(a) * radii[i];
        pos[vi++] = 0;
        pos[vi++] = Math.sin(a) * radii[i];
      }
    }
    // 圆心
    const centerIndex = rings * cols;
    pos[vi++] = 0;
    pos[vi++] = 0;
    pos[vi++] = 0;
    const idx: number[] = [];
    for (let i = 0; i < rings - 1; i++) {
      for (let j = 0; j < perSector; j++) {
        const a = i * cols + j;
        const b = a + 1;
        const c = a + cols;
        const d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    for (let j = 0; j < perSector; j++) idx.push(centerIndex, j + 1, j);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setIndex(idx);
    // 包围球：扇区中心方向的中点，足以覆盖高差
    const mid = ((a0 + perSector / 2) / segments) * Math.PI * 2;
    const half = (perSector / segments) * Math.PI;
    const r = rMax;
    const c = new Vector3(Math.cos(mid) * r * 0.5, 0, Math.sin(mid) * r * 0.5);
    const rad = Math.hypot(r * 0.5, r * Math.sin(half)) + 2000;
    g.boundingSphere = new Sphere(c, rad);
    out.push(g);
  }
  return out;
}

export function createTerrainMaterial(terrain: Terrain): ShaderMaterial {
  const n = terrain.near;
  const f = terrain.far;
  return new ShaderMaterial({
    vertexShader: common + '\n' + terrainVert,
    fragmentShader: NEAR_HEADER + terrainFrag,
    uniforms: {
      ...U,
      ...NU,
      tHN: { value: n.texH },
      tHF: { value: f.texH },
      tNN: { value: n.texN },
      tNF: { value: f.texN },
      tDN: { value: n.texD },
      tDF: { value: f.texD },
      uGridN: { value: new Vector4(n.grid.x0, n.grid.z0, n.grid.size, n.grid.res) },
      uGridF: { value: new Vector4(f.grid.x0, f.grid.z0, f.grid.size, f.grid.res) },
    },
  });
}

export function createTerrainMeshes(terrain: Terrain, quality: number): Mesh[] {
  const segs = quality >= 2 ? 768 : quality === 1 ? 512 : 384;
  const rings = quality >= 2 ? 900 : quality === 1 ? 640 : 480;
  const geos = buildPolarSectors(segs, rings, 1.0, 86000, 16);
  const mat = createTerrainMaterial(terrain);
  return geos.map((g) => {
    const m = new Mesh(g, mat);
    m.matrixAutoUpdate = false;
    return m;
  });
}
