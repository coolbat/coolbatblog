export type SeasonId = "spring" | "summer" | "autumn" | "winter";
export type SkyGroup = SeasonId | "circumpolar";
export type ObjectType = "star" | "nebula" | "galaxy" | "cluster";

/** 星座内单颗恒星（局部坐标，随 constellation.position 摆放） */
export interface StarNode {
  /** 指向 objects.ts 中 CelestialObject 的 id；仅主要恒星有 */
  objectId?: string;
  x: number;
  y: number;
  /** 亮度层级：1 一级亮星 2 二级 3 普通 */
  mag: 1 | 2 | 3;
}

/** 星座连线：stars 数组的下标对 */
export type ConstellationLine = [number, number];

export interface Constellation {
  id: string;
  nameZh: string;
  nameEn: string;
  latinName: string;
  season: SkyGroup;
  /** 60–120 字简介：为什么值得看 */
  summaryZh: string;
  /** 最佳观赏季（中文短文案） */
  bestSeasonZh: string;
  /** 代表目标短文案（信息卡用） */
  highlightsZh: string;
  /** 在天空平面中的摆放位置 */
  position: { x: number; y: number };
  stars: StarNode[];
  lines: ConstellationLine[];
  /** 属于该星座的深空天体 id */
  deepSkyObjects: string[];
}

export interface CelestialObject {
  id: string;
  type: ObjectType;
  nameZh: string;
  nameEn: string;
  catalogName?: string;
  constellationId: string;
  season: SkyGroup;
  summaryZh: string;
  summaryEn?: string;
  distanceText?: string;
  objectTypeText: string;
  /** 深空天体：真实照片路径；恒星：留空走程序化视觉 */
  image?: string;
  /** 外部天文站 slug，拼接到 OBSERVATORY.externalBaseUrl */
  externalSlug: string;
  /** 天空平面绝对坐标（深空天体） */
  position?: { x: number; y: number };
}

export interface SeasonConfig {
  id: SeasonId;
  nameZh: string;
  nameEn: string;
  subtitleZh: string;
  constellations: string[];
  featuredObjects: string[];
  /** 银河强度 0–1 */
  galaxyIntensity: number;
  /** 背景星密度 0–1 */
  starDensity: number;
  /** 背景气氛：天空渐变两端色 */
  skyTop: string;
  skyBottom: string;
  /** 银河带倾斜角（度） */
  galaxyTilt: number;
}

export interface SeasonMeta {
  id: SeasonId;
  nameZh: string;
  nameEn: string;
}
