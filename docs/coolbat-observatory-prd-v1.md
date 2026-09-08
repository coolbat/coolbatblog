# Coolbat Observatory / 观星台 PRD

**项目名称**：Coolbat Observatory / 观星台  
**所属站点**：coolbat.xyz  
**文档版本**：V1.0  
**产品阶段**：MVP / 可开发版本  
**目标平台**：桌面 Web 优先，兼容移动端  
**核心定位**：个人主页中的沉浸式“观星彩蛋”，以北半球四季代表性星空为内容骨架，通过星座探索、望远镜聚焦与天体介绍，建立 Coolbat 的个人世界观与天文兴趣表达。

---

## 1. 产品背景

coolbat.xyz 当前采用“Coolbat · 观星造物”的视觉体系：首页右侧是一张东方星图。该星图不再只是静态装饰，而将成为进入第二空间——Coolbat Observatory——的入口。

Observatory 不做专业天文软件，也不承担实时天象、地理位置、天气、观测条件判断等功能。它是一个具有真实天文学基础、但更强调沉浸感和审美体验的交互式观星页面。

产品核心关系：

- **coolbat.xyz 首页**：我是谁、我做什么、我在探索什么。
- **Coolbat Observatory**：我喜欢什么、我如何看世界。
- **外部天文地理宇宙网站**：提供更深入、真实、实时的天文知识和观测服务。

---

## 2. 本版本范围

### 2.1 V1 必须实现

1. 首页星图中心点彩蛋入口。
2. 点击入口后的完整转场动画。
3. `/observatory` 独立观星页面。
4. 北半球四季模式：春、夏、秋、冬。
5. 四季对应的代表性星座、亮星和精选深空目标。
6. 星空自由浏览：鼠标/触控轻量拖动。
7. 星座 Hover/聚焦。
8. 点击星座进入星座详情状态。
9. 点击恒星或深空目标进入“望远镜模式”。
10. 左下角天文望远镜视觉元素。
11. 天体简要介绍。
12. “观察更多 / Explore Further”按钮。
13. 点击“观察更多”在新标签页打开外部天文网站对应内容。
14. 桌面端完整体验。
15. 移动端降级体验。
16. 基础性能优化、无障碍和埋点。

### 2.2 明确不做

以下能力不属于 coolbat.xyz 的 Observatory V1：

- 用户地理位置定位。
- 根据纬度/经度计算真实可见星空。
- 实时时间和地方恒星时计算。
- 天气、云量、光污染、月相判断。
- “今晚可见什么”。
- 太阳、月球、行星的实时位置。
- 星体升起/落下时间。
- 专业星表浏览。
- 天文观测计划。
- AR 识星。
- 用户账号、收藏、历史记录。

这些功能统一留给另一个天文地理宇宙网站。

---

## 3. 产品目标

### 3.1 核心目标

让访问 coolbat.xyz 的用户在完成普通个人主页浏览后，通过一个隐藏但可发现的星图彩蛋，进入具有强烈记忆点的“私人观星台”。

### 3.2 用户体验目标

用户进入 Observatory 后，应在 10 秒内理解：

1. 这是一个可以探索的星空。
2. 可以切换春夏秋冬。
3. 可以点击星座或星星。
4. 可以通过望远镜进一步观察。
5. 可以跳转到更深入的天文内容。

### 3.3 品牌目标

强化 Coolbat 的三层人格：

- 独立开发者。
- 好奇的探索者。
- 长期仰望星空的人。

---

## 4. 产品原则

### 4.1 真实天文学作为骨架

星座关系、主要恒星、代表性深空天体应基于真实天文知识。

### 4.2 诗意体验作为表层

页面不追求专业天文软件的信息密度，而追求“发现 → 聚焦 → 观察 → 延伸探索”的体验。

### 4.3 星空负责吸引，内容负责解释

星空不能只是装饰；每个交互都必须对应一个明确的信息对象。

### 4.4 不伪装成实时天象

页面明确定位为：

> Northern Hemisphere · Representative Seasonal Sky  
> 北半球代表性四季星空

不向用户暗示“这是你此刻真实能看到的天空”。

### 4.5 视觉优先，UI 后退

任何 UI 元素都不得抢过星空本身。

---

## 5. 用户画像

### 5.1 主要用户

访问 coolbat.xyz 的用户：

- 独立开发者。
- AI / 产品 / 设计从业者。
- 对 Coolbat 的作品感兴趣的人。
- 对天文、星空和视觉体验感兴趣的人。

### 5.2 核心使用动机

- 好奇首页星图能否点击。
- 想体验一个有趣的个人主页彩蛋。
- 想探索星座。
- 被某颗星或某个星云吸引。
- 进一步进入外部天文网站。

---

## 6. 信息架构

```text
coolbat.xyz
│
├── Home
│   └── Hero Star Map
│       └── Center Star Easter Egg
│
└── /observatory
    │
    ├── Sky View
    │   ├── Spring
    │   ├── Summer
    │   ├── Autumn
    │   └── Winter
    │
    ├── Constellation Focus
    │
    ├── Telescope View
    │
    └── External Astronomy Site
```

---

## 7. 首页入口交互

### 7.1 默认状态

首页右侧星图保持现有视觉。

中心星点具备非常弱的可发现提示：

- 每 6–10 秒进行一次轻微呼吸。
- Hover 时亮度提升。
- 鼠标指针变为可点击状态。
- 可显示极轻 Tooltip：

> Enter Observatory  
> 进入观星台

Tooltip 不必常驻。

### 7.2 点击后动画序列

总时长建议：2.8–4.0 秒。

#### Phase 1：唤醒

0–500ms：

- 中心星点亮度快速提升。
- 从中心产生一圈极弱冲击波。
- 首页其他元素亮度降低 10–20%。

#### Phase 2：光流

500–1600ms：

- 数道神秘光线沿星图圆环运行。
- 不同轨道使用不同速度。
- 光流至少包含两个方向：顺时针、逆时针。
- 光迹采用尾迹渐隐。

#### Phase 3：星盘启动

1000–2200ms：

- 外圈慢速顺时针旋转。
- 中圈逆时针。
- 内圈以不同速度旋转。
- 星点亮度短暂增加。
- 部分星座连线被“点亮”。

#### Phase 4：聚焦

2000–3200ms：

- 星图整体 scale 放大。
- 中心点始终保持视觉中心。
- 页面其他内容快速淡出。
- 圆环越过屏幕边缘。

#### Phase 5：切页

约 3000ms：

- 路由进入 `/observatory`。
- 过渡过程中避免白屏。
- 新页面天空继续继承相同中心和旋转方向。

### 7.3 动画要求

- 页面切换必须“连续”，不能明显感觉重新加载。
- 首页与 Observatory 共用视觉颜色。
- `prefers-reduced-motion` 用户使用简化淡入淡出。

---

## 8. Observatory 默认页面

### 8.1 页面结构

全屏星空，传统网页 UI 尽量隐藏。

```text
┌────────────────────────────────────────────────────────┐
│ coolbat.xyz / Observatory                  搜索   退出 │
│                                                        │
│                    星空主体区域                        │
│                                                        │
│        星座 / 恒星 / 银河 / 深空目标                   │
│                                                        │
│ 🔭 Telescope                            AUTUMN / 秋     │
│                                                        │
│ Northern Hemisphere · Representative Seasonal Sky      │
└────────────────────────────────────────────────────────┘
```

### 8.2 默认季节

建议首次进入默认：**秋季 Autumn**。

原因：

- 与当前主页东方星图视觉更接近。
- 飞马座大四边形具有强几何秩序。
- 仙女座星系非常适合作为第一次深空体验。

V1 不根据真实日期自动切换。

---

## 9. 四季系统

### 9.1 季节定义

四季代表：

> 北半球中纬度地区，在该季节夜晚常见的代表性星空。

它是策展式内容，而非实时天象模拟。

### 9.2 季节切换器

位置：右下角。

推荐形式：

```text
SPRING ─ SUMMER ─ AUTUMN ─ WINTER
                   ●
```

中文作为次级文字。

### 9.3 季节切换动画

总时长：1.8–3 秒。

切换过程：

1. 当前星座缓慢偏移。
2. 当前季节主要星座逐渐沉入边缘或淡出。
3. 新季节星座从其他方向进入。
4. 银河位置发生变化。
5. 新季节核心星座逐渐点亮。
6. 背景气氛轻微变化。
7. 季节标题更新。

禁止：

- 瞬间替换。
- 纯 Cross Fade。
- 页面重新加载。

---

## 10. 四季视觉气氛

### 春 Spring

主题：**春夜 · 星河渐远**

- 稍偏青蓝。
- 星密度适中。
- 银河弱化。
- 空间感较开阔。

### 夏 Summer

主题：**夏夜 · 银河升起**

- 银河最明显。
- 星密度最高。
- 局部星云和星尘增加。
- 氛围最华丽。

### 秋 Autumn

主题：**秋夜 · 望向银河之外**

- 深蓝。
- 空间感更深。
- 银河存在感下降。
- 强调仙女座、飞马座等结构。

### 冬 Winter

主题：**冬夜 · 群星璀璨**

- 最接近黑色。
- 恒星锐度最高。
- 亮星对比最明显。
- 猎户座成为视觉主角。

---

## 11. 四季内容配置

### 11.1 春季

核心星座：

- Leo / 狮子座
- Virgo / 室女座
- Boötes / 牧夫座
- Coma Berenices / 后发座
- Canes Venatici / 猎犬座
- Corvus / 乌鸦座

核心恒星：

- Regulus / 轩辕十四
- Spica / 角宿一
- Arcturus / 大角星
- Denebola / 五帝座一

代表结构：**春季大三角**

精选深空目标：

- M51 漩涡星系
- M87
- M3 球状星团

### 11.2 夏季

核心星座：

- Cygnus / 天鹅座
- Lyra / 天琴座
- Aquila / 天鹰座
- Scorpius / 天蝎座
- Sagittarius / 人马座
- Hercules / 武仙座

核心恒星：

- Vega / 织女星
- Deneb / 天津四
- Altair / 牛郎星
- Antares / 心宿二

代表结构：**夏季大三角**

精选深空目标：

- M8 礁湖星云
- M20 三裂星云
- M13 武仙座球状星团
- M57 环状星云

### 11.3 秋季

核心星座：

- Pegasus / 飞马座
- Andromeda / 仙女座
- Perseus / 英仙座
- Aquarius / 宝瓶座
- Pisces / 双鱼座
- Aries / 白羊座

核心恒星：

- Alpheratz / 壁宿二
- Mirach / 奎宿九
- Algol / 大陵五
- Enif / 危宿三

代表结构：**飞马座大四边形**

精选深空目标：

- M31 仙女座星系
- M33 三角座星系
- 双星团 NGC 869 / NGC 884

### 11.4 冬季

核心星座：

- Orion / 猎户座
- Taurus / 金牛座
- Gemini / 双子座
- Auriga / 御夫座
- Canis Major / 大犬座
- Canis Minor / 小犬座

核心恒星：

- Betelgeuse / 参宿四
- Rigel / 参宿七
- Sirius / 天狼星
- Procyon / 南河三
- Aldebaran / 毕宿五
- Pollux / 北河三
- Capella / 五车二

代表结构：**冬季大三角**

精选深空目标：

- M42 猎户座大星云
- M45 昴星团
- M1 蟹状星云

---

## 12. 北天常驻层

作为“北天守望者”存在：

- Ursa Major / 大熊座
- Ursa Minor / 小熊座
- Cassiopeia / 仙后座
- Cepheus / 仙王座
- Draco / 天龙座

核心恒星：

- Polaris / 北极星

四季切换时可以调整方位和透明度，但不完全消失。

---

## 13. 星空默认视觉

### 13.1 星星

按亮度分层：

- 一级亮星。
- 二级亮星。
- 普通背景星。

差异：大小、发光强度、光晕、闪烁频率。

闪烁必须克制。

### 13.2 银河

- 夏季最强。
- 春秋较弱。
- 冬季可见但不作为主体。
- 使用低对比粒子或纹理，不抢星座。

### 13.3 星座连线

默认：隐藏或局部显示。

Hover：逐段绘制。

选中：完整显示。

### 13.4 星座人物轮廓

可选增强：Hover/选中后出现极淡古星图式轮廓。

透明度建议：8–15%。

禁止卡通化和高饱和插画。

---

## 14. 自由浏览

### 桌面

支持：

- 鼠标移动轻微视差。
- 鼠标拖拽改变视野。
- 滚轮轻微缩放。

不做无限自由 3D 飞行。

### 移动端

支持：

- 单指拖动。
- 双指轻量缩放。

自动减少粒子、星云纹理、动态光效和复杂后处理。

---

## 15. Hover 星座状态

Hover 某星座：

1. 主要恒星亮度提升。
2. 连线 300–600ms 绘制。
3. 中英文名称出现。
4. 周边天空亮度降低 5–10%。
5. 可选星座轮廓淡入。

示例：

```text
CYGNUS
天鹅座

Summer · 夏
```

---

## 16. 星座选中状态

状态：`CONSTELLATION_FOCUS`

### 16.1 视觉变化

- 镜头缓慢移动到星座中心。
- 其余区域降低亮度 20–30%。
- 主星加强。
- 连线完整显示。
- 星座轮廓可见。

### 16.2 信息卡

桌面端右侧：

```text
CYGNUS
天鹅座

夏季北天最具代表性的星座之一，
位于银河之中。

主要恒星
天津四 · Deneb

最佳季节
夏季

代表目标
M57 / 北美洲星云等

[ 对准望远镜 ]
```

要求：

- 60–120 中文字。
- 不做百科长文。
- 突出“为什么值得看”。

### 16.3 退出

- ESC。
- 点击空白星空。
- 点击关闭按钮。

---

## 17. 星体点击

用户可点击：

- 主要恒星。
- 精选深空天体。

点击后：

1. 星体亮度提升。
2. 镜头轻微居中。
3. 望远镜开始转向目标。
4. 出现 CTA：

> 对准望远镜  
> Point Telescope

---

## 18. 左下角望远镜

### 18.1 角色

望远镜是 Observatory 的交互锚点，不只是装饰。

### 18.2 默认状态

- 左下角地平线附近。
- 剪影 / 低对比 2D 或轻量 3D。
- 基本不移动。

### 18.3 选中目标

望远镜：

- 水平旋转。
- 镜筒抬起。
- 指向目标。

动画：800–1500ms。

### 18.4 实现建议

V1 优先：SVG / Canvas / CSS + GSAP。

不建议 V1 为望远镜单独引入复杂 3D 模型。

---

## 19. 望远镜模式

状态：`TELESCOPE_VIEW`

### 19.1 转场

点击“对准望远镜”：

1. 镜头快速向目标移动。
2. 周围恒星出现极轻径向拉伸。
3. 150–250ms 黑场。
4. 圆形望远镜视野出现。
5. 天体高清视觉淡入。
6. 右侧天体信息出现。

总时长：约 1.0–1.8 秒。

### 19.2 页面结构

```text
┌────────────────────────────────────────────────────┐
│ coolbat.xyz / Observatory                      ×   │
│                                                    │
│   ╭──────────────────────╮                         │
│   │                      │   猎户座大星云          │
│   │        M42           │   M42 · Orion Nebula   │
│   │                      │                         │
│   ╰──────────────────────╯   类型：发射星云        │
│                              距离：约 1344 光年    │
│                              所属：猎户座           │
│                                                    │
│                              简短介绍               │
│                              [观察更多 →]           │
└────────────────────────────────────────────────────┘
```

### 19.3 视觉比例

桌面端：

- 天体视觉：55–65%。
- 信息区域：25–35%。

移动端：

- 天体视觉在上。
- 信息卡在下方抽屉。

---

## 20. 天体详情字段

```ts
interface CelestialObject {
  id: string
  type: "star" | "nebula" | "galaxy" | "cluster"
  nameZh: string
  nameEn: string
  catalogName?: string
  constellationId: string
  season: "spring" | "summer" | "autumn" | "winter" | "circumpolar"
  summaryZh: string
  summaryEn?: string
  distanceText?: string
  objectTypeText: string
  image: string
  externalUrl: string
}
```

---

## 21. 星座数据模型

```ts
interface Constellation {
  id: string
  nameZh: string
  nameEn: string
  latinName: string
  season: "spring" | "summer" | "autumn" | "winter" | "circumpolar"
  summaryZh: string
  keyStars: StarRef[]
  lines: ConstellationLine[]
  position: {
    x: number
    y: number
    z?: number
  }
  outlineAsset?: string
  deepSkyObjects: string[]
}
```

---

## 22. 季节配置

```ts
interface SeasonConfig {
  id: "spring" | "summer" | "autumn" | "winter"
  nameZh: string
  nameEn: string
  subtitleZh: string
  constellations: string[]
  featuredStars: string[]
  featuredObjects: string[]
  galaxyIntensity: number
  starDensity: number
  atmosphereVariant: string
}
```

---

## 23. 页面状态机

```text
HOME
  ↓
PORTAL_TRANSITION
  ↓
SKY_IDLE
  ├── SEASON_TRANSITION
  ├── CONSTELLATION_HOVER
  ├── CONSTELLATION_FOCUS
  │      └── OBJECT_FOCUS
  │              └── TELESCOPE_TRANSITION
  │                      └── TELESCOPE_VIEW
  └── EXIT
```

建议使用有限状态机思维实现，避免大量互相冲突的布尔状态。

---

## 24. “观察更多”导流

按钮：

> 观察更多  
> Explore Further

行为：

```html
target="_blank"
rel="noopener noreferrer"
```

优先跳目标详情页，而不是统一首页。

例如：

```text
M42 → astronomy-site.com/objects/m42
Orion → astronomy-site.com/constellations/orion
M31 → astronomy-site.com/objects/m31
```

目标页未建设时，再退回对应分类页。

---

## 25. 外部网站边界

Observatory 只提供：

- 引发兴趣。
- 基础信息。
- 沉浸观察。
- 内容导流。

外部天文网站负责：

- 完整百科。
- 实时星空。
- 地理位置。
- 季节与时间。
- 天气。
- 可见性计算。
- 观测建议。
- 更丰富图片和文章。

两者不可重复建设同一套完整功能。

---

## 26. 顶部导航

建议保持极简。

左：

```text
coolbat.xyz / Observatory
```

右：

```text
返回主页
```

搜索 V1 可选。

---

## 27. 搜索功能

V1 非必须。

如实现，支持搜索：

- 星座中文名。
- 星座英文名。
- 主要恒星。
- Messier 编号。

点击结果后自动聚焦对应目标。

---

## 28. UI 视觉规范

### 28.1 色彩

延续 coolbat.xyz：

- 背景：近黑深蓝。
- 主文字：暖白。
- 强调：古铜金 / 微暖金。
- 次级线条：低饱和灰蓝。
- 激活星点：暖白 + 金。

禁止：

- 高饱和科技蓝。
- 霓虹紫。
- Cyberpunk 配色。

### 28.2 字体

中文：标题可用书卷气宋体 / 衬线体，正文优先可读性。

英文：Serif + Sans Serif。

数据：轻量等宽字体。

### 28.3 线条

- 极细。
- 低对比。
- 避免 HUD 仪表盘感。

---

## 29. 动效规范

### 原则

动效表达：时间、轨道、聚焦、发现、空间尺度。

不做：无意义漂浮、高频闪烁、夸张弹性动画。

### 时长

- Hover：150–500ms。
- 星座聚焦：600–1200ms。
- 季节切换：1800–3000ms。
- 望远镜聚焦：1000–1800ms。
- 首页入口：2800–4000ms。

---

## 30. 音效

V1 建议默认关闭。

可选声音：

- 极弱环境音。
- 星图启动低频音。
- 望远镜机械转动。
- 进入深空时极轻氛围音。

首次进入不得自动播放明显声音。

---

## 31. 技术架构建议

### 首页星图

- SVG
- GSAP
- CSS Transform

### Observatory 星空

- Three.js 或 React Three Fiber
- Points / Instanced Mesh
- 少量 Shader
- GSAP 控制关键镜头动画

### 星座连线

若随镜头移动：优先 Three.js Line。

### UI

React DOM 叠加在 3D Canvas 上。

### 状态

推荐：Zustand；复杂度提升后可切 XState。

---

## 32. 资源加载策略

首页禁止加载完整 Observatory 资源。

用户接近或 Hover 首页星图时可提前 Prefetch：

- `/observatory` route chunk。
- 基础星空数据。
- 首屏纹理。

点击入口后异步加载：

- Three.js 模块。
- 星座数据。
- 当前季节资源。

高清深空图片在进入 Telescope View 时再加载。

---

## 33. 性能目标

桌面端：

- 首页 Lighthouse Performance ≥ 90。
- Observatory 首次交互加载控制在 2–3 秒内。
- 稳定 50–60 FPS 为目标。

移动端：

- 目标 30–60 FPS。
- 自动降低星点数量。
- 禁用高成本后处理。
- 降低纹理分辨率。

---

## 34. 自适应降级

### 高性能桌面

完整：粒子、光流、星云、星座轮廓、视差、镜头动画。

### 普通设备

减少：粒子、Glow、后处理。

### 移动设备

重点保留：季节、星座点击、望远镜、内容。

可取消：复杂景深、大量粒子、重型 Shader。

---

## 35. 无障碍

必须支持：

- `prefers-reduced-motion`。
- 键盘 Tab。
- Enter 选择目标。
- ESC 返回。
- UI 文本对比度合格。
- 星座不可只通过颜色区分状态。

简化动画模式：首页入口直接星图放大 → 淡入 Observatory。

---

## 36. SEO

推荐路径：`/observatory`

Title：

> Coolbat Observatory — Interactive Seasonal Night Sky

Description：

> Explore a poetic interactive night sky through the four seasons, constellations, stars and deep-sky objects.

页面仍保留可抓取文字：页面介绍、四季名称、星座名称、简介。

不要让整个页面只有 Canvas。

---

## 37. Analytics

建议事件：

```text
observatory_enter
season_change
constellation_hover
constellation_open
object_open
telescope_enter
explore_further_click
observatory_exit
```

关键分析：

1. 首页星图点击率。
2. Observatory 平均停留时间。
3. 最受欢迎星座。
4. 最受欢迎天体。
5. 四季切换比例。
6. “观察更多”CTR。

---

## 38. 错误处理

### 资源加载失败

显示简化星空版本。

### 深空图片加载失败

显示星图占位，天体信息仍可阅读。

### WebGL 不支持

Fallback：2D Canvas / SVG 星空。

核心导航和内容仍可使用。

---

## 39. 首次引导

首次进入 Observatory，不弹大型 Modal。

3 秒后显示极轻提示：

```text
拖动探索天空
点击星座开始观察
```

6 秒后自动淡出。

第二次访问不显示。

可用 LocalStorage：

```text
observatory_intro_seen = true
```

---

## 40. 核心用户流程

### Flow A：首页彩蛋

```text
首页
→ Hover 星图中心
→ 点击
→ 光流
→ 星盘旋转
→ 星图放大
→ Observatory
```

### Flow B：探索星座

```text
Observatory
→ Hover 星座
→ 连线出现
→ 点击
→ 聚焦
→ 查看简介
```

### Flow C：望远镜

```text
星座详情
→ 点击恒星 / 深空目标
→ 望远镜转向
→ 对准望远镜
→ Telescope View
→ 天体信息
```

### Flow D：导流

```text
Telescope View
→ 观察更多
→ 新标签页
→ 外部天文网站详情页
```

### Flow E：四季切换

```text
Sky Idle
→ 选择季节
→ 星空运动
→ 新季节进入
→ 新星座可探索
```

---

## 41. MVP 内容量

建议首次发布：

- 4 个季节。
- 24 个季节核心星座。
- 5 个北天常驻星座。
- 20–30 颗重点恒星。
- 12–15 个精选深空目标。
- 4 个季节主题。
- 1 套望远镜界面。
- 1 套首页入口动画。

---

## 42. MVP 优先级

### P0

必须：

- 首页入口。
- 转场。
- 星空。
- 四季。
- 星座 Hover。
- 星座点击。
- 望远镜。
- 天体详情。
- 外链。
- 移动端可用。

### P1

发布后：

- 搜索。
- 更多恒星。
- 星座轮廓。
- 音效。
- 更丰富深空图。
- 键盘探索增强。

### P2

只作为 coolbat.xyz 内体验增强：

- 成就式小彩蛋。
- 特殊节气文案。
- Easter Egg 星座。
- Coolbat 自定义星座。

仍然不增加地理位置和实时星空计算。

---

## 43. 验收标准

### 首页入口

- 中心点可点击。
- Hover 状态正确。
- 点击后动画完整。
- 动画无明显掉帧。
- 无白屏。
- 成功进入 `/observatory`。

### 四季

- 四季均可切换。
- 各季节星座配置正确。
- 星空不是瞬间替换。
- 常驻北天星座逻辑正确。

### 星座

- 可 Hover。
- 连线正确显示。
- 名称中英文正确。
- 可点击。
- 点击后聚焦正确。

### 望远镜

- 选中目标后望远镜转向。
- CTA 可操作。
- Telescope View 正常进入。
- 返回后恢复前一状态。

### 外链

- “观察更多”链接正确。
- 新标签页打开。
- 使用 `noopener noreferrer`。

### 移动端

- 页面不横向溢出。
- 交互区域足够大。
- 可拖动。
- 可打开星座。
- 可进入望远镜。
- FPS 可接受。

### 无障碍

- reduced motion 生效。
- ESC 可返回。
- 键盘可聚焦主要操作。

---

## 44. 测试清单

### 功能

- 四季切换。
- 星座切换。
- 快速连续切换季节。
- 星座聚焦过程中退出。
- Telescope View 中关闭。
- 浏览器返回。
- 外链。
- 页面刷新。

### 浏览器

至少：Chrome、Safari、Edge、iOS Safari、Android Chrome。

### 性能

重点测试：首页首次加载、Observatory 首次加载、夏季银河场景、星座密集场景、移动端。

---

## 45. 开发模块拆分

```text
Observatory
├── PortalTransition
├── SkyRenderer
├── StarField
├── MilkyWay
├── ConstellationLayer
├── ConstellationLabel
├── SeasonController
├── SeasonTransition
├── Telescope
├── TelescopeTransition
├── ObjectViewer
├── ObjectInfoPanel
├── ObservatoryHUD
├── IntroHint
└── ObservatoryStore
```

数据：

```text
data/
├── seasons.ts
├── constellations.ts
├── stars.ts
└── objects.ts
```

---

## 46. 推荐开发顺序

### Sprint 1：骨架

- `/observatory`
- SkyRenderer
- 基础星空
- 四季数据
- SeasonController

### Sprint 2：星座

- 星座线。
- Hover。
- 点击。
- 聚焦。
- 信息卡。

### Sprint 3：望远镜

- 望远镜视觉。
- Target。
- Telescope Transition。
- Object Viewer。

### Sprint 4：首页入口

- 星图中心彩蛋。
- 光流。
- 多环旋转。
- 页面连续转场。

### Sprint 5：完成度

- 移动端。
- 性能。
- reduced motion。
- Analytics。
- 文案。
- 外链。

---

## 47. 成功标准

上线后重点观察：

- 首页访问者中 Observatory 入口点击率 > 5%。
- 进入 Observatory 的用户中，星座点击率 > 40%。
- 至少 20% 的 Observatory 用户进入 Telescope View。
- “观察更多”CTR > 8%。
- Observatory 平均停留时间 > 60 秒。

这些是初始参考，不作为硬 KPI。

---

## 48. 最终产品定义

Coolbat Observatory 不应被理解为：

> “个人主页里塞了一个星空动画。”

它应该被定义为：

> **Coolbat 的私人观星台。**

用户从一张东方星图进入，在北半球四季之间移动，发现星座，选择星体，通过望远镜靠近它们，再前往更大的天文世界继续探索。

首页表达“观星造物”。

Observatory 负责“观星”。

作品与文章负责“造物”。

两者最终组成 coolbat.xyz 的完整个人世界观。

---

## 49. 一句话需求

> 在 coolbat.xyz 首页星图中隐藏一个可交互入口，点击后通过光流、星盘旋转和放大转场进入全屏 Observatory；用户可探索北半球春夏秋冬四套代表性星空，发现并点击星座、恒星和深空目标，通过左下角望远镜进入沉浸式观察模式，并通过“观察更多”跳转到外部天文地理宇宙网站继续探索；本版本不实现地理位置、实时天空、天气和真实可见性计算。
