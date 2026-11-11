// 固定观察点的相机：只能转头、仰望与缩放
import { PerspectiveCamera } from 'three';

export interface ViewState {
  yaw: number; // 弧度：0 = 朝东（顺旋），π/2 = 朝南（星侧）
  pitch: number; // 弧度
  fov: number; // 竖直视角（度）
}

export class CameraRig {
  view: ViewState;
  private target: ViewState;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDist = 0;
  onInteract: (() => void) | null = null;
  readonly minFov = 2;
  readonly maxFov = 100;

  constructor(private cam: PerspectiveCamera, private el: HTMLElement, init: ViewState) {
    this.view = { ...init };
    this.target = { ...init };
    el.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('dblclick', () => this.reset());
  }

  private home: ViewState | null = null;

  setHome(v: ViewState): void {
    this.home = { ...v };
  }

  reset(): void {
    if (this.home) this.lookAt(this.home.yaw, this.home.pitch, this.home.fov);
  }

  /** 平滑转向某个方向 */
  lookAt(yaw: number, pitch: number, fov?: number): void {
    // 取最近的转向
    let dy = yaw - this.target.yaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    this.target.yaw += dy;
    this.target.pitch = pitch;
    if (fov !== undefined) this.target.fov = fov;
  }

  get targetView(): ViewState {
    return this.target;
  }

  private onDown = (e: PointerEvent): void => {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    } else if (this.pointers.size === 2) {
      const p = [...this.pointers.values()];
      this.pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    }
    this.el.setPointerCapture?.(e.pointerId);
    this.onInteract?.();
  };

  private onMove = (e: PointerEvent): void => {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2) {
      const p = [...this.pointers.values()];
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (this.pinchDist > 0) this.zoomBy(this.pinchDist / d);
      this.pinchDist = d;
      return;
    }
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    const h = this.el.clientHeight || 800;
    const k = ((this.target.fov * Math.PI) / 180) / h;
    this.target.yaw -= dx * k;
    this.target.pitch += dy * k;
    this.clampTarget();
    // 拖动时立即跟随
    this.view.yaw = this.target.yaw;
    this.view.pitch = this.target.pitch;
  };

  private onUp = (e: PointerEvent): void => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 0) this.dragging = false;
    if (this.pointers.size < 2) this.pinchDist = 0;
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const f = Math.exp(e.deltaY * 0.0012);
    this.zoomBy(f);
    this.onInteract?.();
  };

  zoomBy(f: number): void {
    this.target.fov = Math.min(this.maxFov, Math.max(this.minFov, this.target.fov * f));
  }

  turn(dyaw: number, dpitch: number): void {
    this.target.yaw += dyaw;
    this.target.pitch += dpitch;
    this.clampTarget();
  }

  private clampTarget(): void {
    const lim = Math.PI / 2 - 0.001;
    this.target.pitch = Math.max(-lim, Math.min(lim, this.target.pitch));
  }

  update(dt: number): void {
    const k = 1 - Math.exp(-dt * 7);
    this.view.yaw += (this.target.yaw - this.view.yaw) * k;
    this.view.pitch += (this.target.pitch - this.view.pitch) * k;
    const kf = 1 - Math.exp(-dt * 8);
    this.view.fov = Math.exp(Math.log(this.view.fov) + (Math.log(this.target.fov) - Math.log(this.view.fov)) * kf);
    this.apply();
  }

  apply(): void {
    const c = this.cam;
    c.fov = this.view.fov;
    // yaw=0 朝 +x（东），yaw=π/2 朝 +z（南）
    const cy = Math.cos(this.view.yaw);
    const sy = Math.sin(this.view.yaw);
    const cp = Math.cos(this.view.pitch);
    const sp = Math.sin(this.view.pitch);
    const dir = { x: cy * cp, y: sp, z: sy * cp };
    c.up.set(0, 1, 0);
    c.lookAt(c.position.x + dir.x, c.position.y + dir.y, c.position.z + dir.z);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }

  /** 视线方向的罗盘读数（度）：0 = 北，90 = 东，180 = 南，270 = 西 */
  heading(): number {
    // 北 = -z，东 = +x
    const yawDeg = (this.view.yaw * 180) / Math.PI; // 0 东，90 南
    let h = 90 + yawDeg;
    h = ((h % 360) + 360) % 360;
    return h;
  }
}
