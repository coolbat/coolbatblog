import type { CelestialObject } from "./types";

/**
 * 精选天体目录：主要恒星 + 精选深空目标。
 * image 留空的恒星在望远镜模式中使用程序化衍射星芒视觉；
 * 深空天体使用 public/observatory/objects/ 下的公有领域照片。
 */
export const CELESTIAL_OBJECTS: CelestialObject[] = [
  // ===== 春季恒星 =====
  {
    id: "regulus",
    type: "star",
    nameZh: "轩辕十四",
    nameEn: "Regulus",
    constellationId: "leo",
    season: "spring",
    summaryZh:
      "狮子座的心脏，是春夜最先被认出的亮星之一。它几乎正好躺在黄道上，月亮和行星时常从它身旁经过。",
    distanceText: "约 79 光年",
    objectTypeText: "蓝白色主序星",
    externalSlug: "regulus",
  },
  {
    id: "spica",
    type: "star",
    nameZh: "角宿一",
    nameEn: "Spica",
    constellationId: "virgo",
    season: "spring",
    summaryZh:
      "室女座最亮的星，实际上是一对靠得极近的蓝巨星。顺着大角星向南延伸，就能找到它。",
    distanceText: "约 250 光年",
    objectTypeText: "蓝巨星联星",
    externalSlug: "spica",
  },
  {
    id: "arcturus",
    type: "star",
    nameZh: "大角星",
    nameEn: "Arcturus",
    constellationId: "bootes",
    season: "spring",
    summaryZh:
      "北天最亮的恒星，泛着温暖的橙色。它是一颗步入晚年的红巨星，也是春季大三角的一角。",
    distanceText: "约 37 光年",
    objectTypeText: "红巨星",
    externalSlug: "arcturus",
  },
  {
    id: "denebola",
    type: "star",
    nameZh: "五帝座一",
    nameEn: "Denebola",
    constellationId: "leo",
    season: "spring",
    summaryZh:
      "狮子尾尖的亮星，名字意为「狮子的尾巴」。它与轩辕十四一前一后，框出整个狮子座的轮廓。",
    distanceText: "约 36 光年",
    objectTypeText: "白色主序星",
    externalSlug: "denebola",
  },

  // ===== 夏季恒星 =====
  {
    id: "vega",
    type: "star",
    nameZh: "织女星",
    nameEn: "Vega",
    constellationId: "lyra",
    season: "summer",
    summaryZh:
      "夏夜天顶附近最亮的星，夏季大三角的一角。一万两千年前它曾是北极星，未来还会再次成为。",
    distanceText: "约 25 光年",
    objectTypeText: "蓝白色主序星",
    externalSlug: "vega",
  },
  {
    id: "deneb",
    type: "star",
    nameZh: "天津四",
    nameEn: "Deneb",
    constellationId: "cygnus",
    season: "summer",
    summaryZh:
      "天鹅的尾羽，也是夏季大三角的一角。它是已知最亮的恒星之一，光度约为太阳的二十万倍。",
    distanceText: "约 2600 光年",
    objectTypeText: "蓝白色超巨星",
    externalSlug: "deneb",
  },
  {
    id: "altair",
    type: "star",
    nameZh: "牛郎星",
    nameEn: "Altair",
    constellationId: "aquila",
    season: "summer",
    summaryZh:
      "天鹰座最亮的星，两侧各有一颗小星相伴，像挑着扁担的少年。它与织女星隔银河相望。",
    distanceText: "约 17 光年",
    objectTypeText: "白色主序星",
    externalSlug: "altair",
  },
  {
    id: "antares",
    type: "star",
    nameZh: "心宿二",
    nameEn: "Antares",
    constellationId: "scorpius",
    season: "summer",
    summaryZh:
      "天蝎座的心脏，一颗明显的红色超巨星。古人称它「大火」，它的名字意为「与火星匹敌」。",
    distanceText: "约 550 光年",
    objectTypeText: "红超巨星",
    externalSlug: "antares",
  },

  // ===== 秋季恒星 =====
  {
    id: "alpheratz",
    type: "star",
    nameZh: "壁宿二",
    nameEn: "Alpheratz",
    constellationId: "andromeda",
    season: "autumn",
    summaryZh:
      "飞马座大四边形的东北角，同时属于仙女座。从它出发沿仙女座星链延伸，就能找到仙女座星系。",
    distanceText: "约 97 光年",
    objectTypeText: "蓝白色亚巨星",
    externalSlug: "alpheratz",
  },
  {
    id: "mirach",
    type: "star",
    nameZh: "奎宿九",
    nameEn: "Mirach",
    constellationId: "andromeda",
    season: "autumn",
    summaryZh:
      "仙女座星链中段一颗橙红色的巨星。把它当作路标，向上跳一小段，就是肉眼可见的仙女座星系。",
    distanceText: "约 197 光年",
    objectTypeText: "红巨星",
    externalSlug: "mirach",
  },
  {
    id: "algol",
    type: "star",
    nameZh: "大陵五",
    nameEn: "Algol",
    constellationId: "perseus",
    season: "autumn",
    summaryZh:
      "英仙手中「魔星」，每 2.87 天规律地变暗一次——它是一对互相掩食的双星，古人因此视它为眨眼的女妖之眼。",
    distanceText: "约 93 光年",
    objectTypeText: "食双星",
    externalSlug: "algol",
  },
  {
    id: "enif",
    type: "star",
    nameZh: "危宿三",
    nameEn: "Enif",
    constellationId: "pegasus",
    season: "autumn",
    summaryZh:
      "飞马的鼻尖，名字来自阿拉伯语「鼻子」。这颗橙色超巨星正处在演化末期，未来可能以超新星谢幕。",
    distanceText: "约 690 光年",
    objectTypeText: "橙色超巨星",
    externalSlug: "enif",
  },

  // ===== 冬季恒星 =====
  {
    id: "betelgeuse",
    type: "star",
    nameZh: "参宿四",
    nameEn: "Betelgeuse",
    constellationId: "orion",
    season: "winter",
    summaryZh:
      "猎户的右肩，一颗随时可能爆发为超新星的红超巨星。它若放在太阳的位置，表面会吞没火星轨道。",
    distanceText: "约 640 光年",
    objectTypeText: "红超巨星",
    externalSlug: "betelgeuse",
  },
  {
    id: "rigel",
    type: "star",
    nameZh: "参宿七",
    nameEn: "Rigel",
    constellationId: "orion",
    season: "winter",
    summaryZh:
      "猎户的左脚，猎户座实际最亮的星。这颗蓝白色超巨星的光度约为太阳的十二万倍。",
    distanceText: "约 860 光年",
    objectTypeText: "蓝白色超巨星",
    externalSlug: "rigel",
  },
  {
    id: "sirius",
    type: "star",
    nameZh: "天狼星",
    nameEn: "Sirius",
    constellationId: "canis-major",
    season: "winter",
    summaryZh:
      "全天最亮的恒星，冬夜南方无法忽视的存在。它有一颗白矮星伴星，是人类发现的第一颗白矮星。",
    distanceText: "约 8.6 光年",
    objectTypeText: "白色主序星",
    externalSlug: "sirius",
  },
  {
    id: "procyon",
    type: "star",
    nameZh: "南河三",
    nameEn: "Procyon",
    constellationId: "canis-minor",
    season: "winter",
    summaryZh:
      "小犬座几乎唯一的亮星，名字意为「在狗之前升起」。与天狼星、参宿四组成冬季大三角。",
    distanceText: "约 11.5 光年",
    objectTypeText: "黄白色亚巨星",
    externalSlug: "procyon",
  },
  {
    id: "aldebaran",
    type: "star",
    nameZh: "毕宿五",
    nameEn: "Aldebaran",
    constellationId: "taurus",
    season: "winter",
    summaryZh:
      "金牛座通红的眼睛，缀在毕宿星团的 V 形之上——但它只是恰好路过，并不属于星团。",
    distanceText: "约 65 光年",
    objectTypeText: "橙色巨星",
    externalSlug: "aldebaran",
  },
  {
    id: "pollux",
    type: "star",
    nameZh: "北河三",
    nameEn: "Pollux",
    constellationId: "gemini",
    season: "winter",
    summaryZh:
      "双子座弟弟的头，一颗拥有系外行星的橙色巨星。它与哥哥北河二并肩，构成冬夜醒目的双子。",
    distanceText: "约 34 光年",
    objectTypeText: "橙色巨星",
    externalSlug: "pollux",
  },
  {
    id: "capella",
    type: "star",
    nameZh: "五车二",
    nameEn: "Capella",
    constellationId: "auriga",
    season: "winter",
    summaryZh:
      "御夫座最亮的星，冬夜北方一顶温暖的金色。它实际上是由两对双星组成的四合星系统。",
    distanceText: "约 43 光年",
    objectTypeText: "黄色巨星",
    externalSlug: "capella",
  },

  // ===== 北天常驻 =====
  {
    id: "polaris",
    type: "star",
    nameZh: "北极星",
    nameEn: "Polaris",
    constellationId: "ursa-minor",
    season: "circumpolar",
    summaryZh:
      "小熊座勺柄的末端，几乎正对地球自转轴。它看上去纹丝不动，所有星都绕着它转——导航者千年的锚点。",
    distanceText: "约 433 光年",
    objectTypeText: "黄色超巨星",
    externalSlug: "polaris",
  },

  // ===== 春季深空 =====
  {
    id: "m51",
    type: "galaxy",
    nameZh: "涡状星系",
    nameEn: "Whirlpool Galaxy",
    catalogName: "M51",
    constellationId: "canes-venatici",
    season: "spring",
    summaryZh:
      "第一个被发现具有旋涡结构的星系，正与身旁的小伴星系相互作用。小型望远镜里能看见它淡淡的旋臂。",
    distanceText: "约 2300 万光年",
    objectTypeText: "旋涡星系",
    image: "/observatory/objects/m51.jpg",
    externalSlug: "m51",
  },
  {
    id: "m87",
    type: "galaxy",
    nameZh: "室女座巨椭圆星系",
    nameEn: "Virgo A",
    catalogName: "M87",
    constellationId: "virgo",
    season: "spring",
    summaryZh:
      "室女座星系团的统治者，中心黑洞是人类历史上第一张黑洞照片的主角，还喷射着数千光年长的喷流。",
    distanceText: "约 5300 万光年",
    objectTypeText: "巨椭圆星系",
    image: "/observatory/objects/m87.jpg",
    externalSlug: "m87",
  },
  {
    id: "m3",
    type: "cluster",
    nameZh: "M3 球状星团",
    nameEn: "Messier 3",
    catalogName: "M3",
    constellationId: "canes-venatici",
    season: "spring",
    summaryZh:
      "北天最壮丽的球状星团之一，约五十万颗老年恒星挤成一球。双筒望远镜里它是一团朦胧的星雾。",
    distanceText: "约 3.4 万光年",
    objectTypeText: "球状星团",
    image: "/observatory/objects/m3.jpg",
    externalSlug: "m3",
  },

  // ===== 夏季深空 =====
  {
    id: "m8",
    type: "nebula",
    nameZh: "礁湖星云",
    nameEn: "Lagoon Nebula",
    catalogName: "M8",
    constellationId: "sagittarius",
    season: "summer",
    summaryZh:
      "银河中心方向最壮丽的恒星育婴室之一，肉眼在暗夜郊外就能察觉的一团光斑，内部新生恒星正照亮氢气。",
    distanceText: "约 4100 光年",
    objectTypeText: "发射星云",
    image: "/observatory/objects/m8.jpg",
    externalSlug: "m8",
  },
  {
    id: "m20",
    type: "nebula",
    nameZh: "三裂星云",
    nameEn: "Trifid Nebula",
    catalogName: "M20",
    constellationId: "sagittarius",
    season: "summer",
    summaryZh:
      "尘埃暗带把发光气体切成三瓣，因此得名。它与礁湖星云相距不远，双筒里可以同框欣赏。",
    distanceText: "约 5200 光年",
    objectTypeText: "发射/反射星云",
    image: "/observatory/objects/m20.jpg",
    externalSlug: "m20",
  },
  {
    id: "m13",
    type: "cluster",
    nameZh: "武仙座大星团",
    nameEn: "Great Hercules Cluster",
    catalogName: "M13",
    constellationId: "hercules",
    season: "summer",
    summaryZh:
      "北天最有名的球状星团，几十万颗恒星挤在武仙座的拱心石边上。1974 年人类曾向它发送阿雷西博信息。",
    distanceText: "约 2.2 万光年",
    objectTypeText: "球状星团",
    image: "/observatory/objects/m13.jpg",
    externalSlug: "m13",
  },
  {
    id: "m57",
    type: "nebula",
    nameZh: "环状星云",
    nameEn: "Ring Nebula",
    catalogName: "M57",
    constellationId: "lyra",
    season: "summer",
    summaryZh:
      "一颗类太阳恒星谢幕时抛出的光环，悬在天琴座的平行四边形旁。小望远镜里它像一枚小小的烟圈。",
    distanceText: "约 2300 光年",
    objectTypeText: "行星状星云",
    image: "/observatory/objects/m57.jpg",
    externalSlug: "m57",
  },

  // ===== 秋季深空 =====
  {
    id: "m31",
    type: "galaxy",
    nameZh: "仙女座星系",
    nameEn: "Andromeda Galaxy",
    catalogName: "M31",
    constellationId: "andromeda",
    season: "autumn",
    summaryZh:
      "肉眼可见的最遥远天体，一万亿颗恒星的光走了 250 万年才抵达你的眼睛。它正缓慢地向银河系靠近。",
    distanceText: "约 250 万光年",
    objectTypeText: "旋涡星系",
    image: "/observatory/objects/m31.jpg",
    externalSlug: "m31",
  },
  {
    id: "m33",
    type: "galaxy",
    nameZh: "三角座星系",
    nameEn: "Triangulum Galaxy",
    catalogName: "M33",
    constellationId: "andromeda",
    season: "autumn",
    summaryZh:
      "本星系群第三大星系，以近乎正面的姿态对着我们。它是暗夜条件下肉眼能挑战的极限目标之一。",
    distanceText: "约 270 万光年",
    objectTypeText: "旋涡星系",
    image: "/observatory/objects/m33.jpg",
    externalSlug: "m33",
  },
  {
    id: "double-cluster",
    type: "cluster",
    nameZh: "英仙座双星团",
    nameEn: "Double Cluster",
    catalogName: "NGC 869 / 884",
    constellationId: "perseus",
    season: "autumn",
    summaryZh:
      "两团年轻的星团并肩悬在英仙与仙后之间。双筒望远镜里，它们像两把撒在黑色丝绒上的钻石。",
    distanceText: "约 7500 光年",
    objectTypeText: "疏散星团",
    image: "/observatory/objects/double-cluster.jpg",
    externalSlug: "double-cluster",
  },

  // ===== 冬季深空 =====
  {
    id: "m42",
    type: "nebula",
    nameZh: "猎户座大星云",
    nameEn: "Orion Nebula",
    catalogName: "M42",
    constellationId: "orion",
    season: "winter",
    summaryZh:
      "猎户腰带下方佩剑处的一团光雾，是离我们最近的大质量恒星形成区。任何小望远镜都能看见它的羽翼。",
    distanceText: "约 1344 光年",
    objectTypeText: "发射星云",
    image: "/observatory/objects/m42.jpg",
    externalSlug: "m42",
  },
  {
    id: "m45",
    type: "cluster",
    nameZh: "昴星团",
    nameEn: "Pleiades",
    catalogName: "M45",
    constellationId: "taurus",
    season: "winter",
    summaryZh:
      "七姊妹星团，肉眼可见六七颗蓝星挤在一起。它可能是全天被记载最多的星团，甲骨文里就有它的身影。",
    distanceText: "约 444 光年",
    objectTypeText: "疏散星团",
    image: "/observatory/objects/m45.jpg",
    externalSlug: "m45",
  },
  {
    id: "m1",
    type: "nebula",
    nameZh: "蟹状星云",
    nameEn: "Crab Nebula",
    catalogName: "M1",
    constellationId: "taurus",
    season: "winter",
    summaryZh:
      "1054 年超新星爆发的遗骸，宋代天文学家记录过那颗「客星」。它的中心是一颗每秒自转 30 次的脉冲星。",
    distanceText: "约 6500 光年",
    objectTypeText: "超新星遗迹",
    image: "/observatory/objects/m1.jpg",
    externalSlug: "m1",
  },
];

export const OBJECTS_BY_ID = new Map(CELESTIAL_OBJECTS.map(o => [o.id, o]));

/** 深空天体在天空平面上的绝对坐标（策展式布局，跟随所属星座摆放） */
const DSO_POSITIONS: Record<string, { x: number; y: number }> = {
  m51: { x: 360, y: 190 },
  m87: { x: 510, y: 530 },
  m3: { x: 296, y: 306 },
  m8: { x: 520, y: 590 },
  m20: { x: 528, y: 572 },
  m13: { x: 459, y: 310 },
  m57: { x: 758, y: 292 },
  m31: { x: 427, y: 271 },
  m33: { x: 480, y: 520 },
  "double-cluster": { x: 830, y: 230 },
  m42: { x: 542, y: 476 },
  m45: { x: 810, y: 300 },
  m1: { x: 718, y: 330 },
};

for (const obj of CELESTIAL_OBJECTS) {
  const pos = DSO_POSITIONS[obj.id];
  if (pos) obj.position = pos;
}
