/**
 * SkyCanvas 的命令式接口。
 * SkyCanvas 挂载后注册自身；HUD 组件（望远镜指向、DOM 标签投影）通过它
 * 与 Three.js 场景通信，避免把逐帧状态塞进 React store。
 */
export interface SkyApi {
  /** 相机飞行到天空平面某点（数据坐标系：x 向右，y 向下） */
  flyTo: (x: number, y: number, z?: number) => void;
  /** 回到当前季节的全景视角 */
  resetView: () => void;
  /** 数据坐标 → 屏幕像素坐标；点不可见时返回 null */
  project: (x: number, y: number) => { x: number; y: number } | null;
  /** 注册每帧回调（返回取消函数） */
  onFrame: (cb: () => void) => () => void;
}

export const skyApi: { current: SkyApi | null } = { current: null };
