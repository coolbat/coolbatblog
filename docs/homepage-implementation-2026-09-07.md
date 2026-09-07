# Coolbat 首页开发与验收记录

日期：2026-09-07。状态：首版开发、本地构建与浏览器验收完成。预览地址：<http://127.0.0.1:4321/>。

本次按用户提供的「Coolbat · 观星造物」效果图和 [实施方案](homepage-redesign-plan-2026-09-07.md) 改造。尚未提交、推送或部署；GitHub CI 仅更新配置，远端执行结果不在本次验证范围内。

后续内容更新：用户指定的四个项目现已加入首页精选，原博客保留在全部作品中。详见 [项目更新记录](homepage-projects-2026-09-07.md)。下文的单项目数量及 Lighthouse 指标记录首版验收状态；截图文件随最新验证更新，当前内容与验证以项目更新记录为准。

## 实现结果

首页改为左文右星图的介绍、精选作品、当前轨道、最近写作四个模块。深墨蓝山水、细金色星轨、宋体标题、竖排题字与细分隔线构成主要视觉；浅色模式使用宣纸白与墨色文字。平板和手机分别调整构图，页面高度随真实内容展开。

| 范围 | 交付内容 |
| --- | --- |
| 首页 | `Hero`、`StarMap`、`FeaturedWorks`、`CurrentOrbit`、`LatestWriting` 独立组件，文案与项目数据分开维护 |
| 图像与字体 | 桌面及手机 WebP 山水、真实项目截图封面、确定性 SVG 星图、本地 Noto Serif SC 字体子集与许可文件 |
| 导航与主题 | 响应式导航、手机菜单及 Escape 焦点归还、搜索入口、暗色默认值、跨页主题保持、存储受限回退 |
| 动效与键盘 | 星光呼吸及暂停开关、遵循减少动效设置、跳到正文、作品锚点焦点转移、无脚本导航回退 |
| 内容与阅读页 | 首页和项目页宽容器；文章和关于页保持阅读宽度；关于页替换为个人介绍；搜索、标签、归档与 RSS 保留 |
| 元数据 | `zh-CN`、站点标题与描述、首页/普通页面结构化数据、文章 `BlogPosting`、1200×630 分享图和 favicon |
| 工程 | 修复依赖安装冲突与类型基线，补齐响应式断点，增加浏览器测试、截图脚本与 Node 22 CI 检查 |

资源来源、原图位置、完整生成提示词、字体更新命令见 [首页资源记录](homepage-assets.md)。页面星图为品牌插画，没有把它作为准确的天文观测图。

## 内容边界

- 首页目前只有仓库中真实存在的 **Coolbat Blog** 项目，使用新首页的实际截图作为封面。没有把效果图中的「墨问」「星图笔记」「云山集」「TidyFlow」加入产品数据。
- 没有可放入首页的真实文章，最近写作显示「思考，还在路上。」及 RSS 入口。原 AstroPaper 示例文章使用 `showOnHome: false`，原地址、搜索和订阅记录保留。
- 当前轨道使用方案中的三个探索方向：AI 原生工具、交互与可视化、数字时代的东方表达。没有填写未经确认的进度、发布日期或近况更新时间。
- 精选项目最多四个，按 `featured` 和 `order` 选取；零项目时显示说明文字，一项目时搭配题记，两至四个按数量排版。
- 首页文章单独按发布日期排序，遵循原有草稿和定时发布过滤规则；日期以上海时区显示。其他文章列表保持原排序方式。

日常更新入口见 [README](../README.md)：`src/data/home.ts`、`src/data/projects.ts` 与 `src/content/blog/`。字体子集更新脚本位于 `scripts/update-display-fonts.py`。

## 基线修复

首次 `npm ci` 遇到 React 18 与 React DOM 19 类型包的 peer 冲突。统一 React 18 依赖与对应类型，移除重复声明并更新锁文件后，Node 22 下的干净安装通过。

原 `tsconfig.json` 对 Astro 严格配置的 Node16 模块覆盖导致类型检查报错；恢复 Astro 配置后消除。内容集合统一为 Astro 4 的常规 content collection，移除混用的实验性 content layer 与 glob loader。此前缺失的 `md`、`lg`、`xl` 断点已补齐。

全局 SVG 选择器缩小作用范围，避免星盘和新图标继承旧图标的固定尺寸及填充。修复透明色值语法、屏幕滚动条导致的山水溢出、平板下外围星名靠近下一模块、双项目题记重叠，以及分享图字体子集缺少英文句点的问题。

## 验证结果

先在 Node 22 执行完整的干净安装、静态检查、构建和浏览器测试；最终布局修正后再次执行以下命令通过：

```sh
npm run check
npm run lint
npm run format:check
npm run test:browser
```

| 检查 | 结果与证据 |
| --- | --- |
| 干净安装 | `npm ci` 通过；日志 `output/validation/clean-install-and-checks.log` |
| 类型检查 | 0 errors / 0 warnings / 0 hints |
| ESLint / Prettier | 均通过 |
| 生产构建 | 通过，输出 10 个页面及相关静态资源 |
| 浏览器回归 | **22 项通过**；`output/playwright/results.json` 与 `output/validation/final-regression.log` |
| 视觉截图 | 8 张，截图运行无页面脚本错误；`output/playwright/visual-checks.json` |
| 原有能力 | 搜索实际找到旧文章并跳转；文章结构化数据、RSS、站点地图、robots、标签、归档和项目入口通过检查 |
| 分享图 | 成功请求 PNG，尺寸 1200×630；人工检查站名、中文标题与句点字形 |

浏览器测试覆盖 375、390、768、1024、1280、1440、1476、1920px 的双主题布局与横向溢出；手机菜单、跨页主题和刷新、系统主题变化、禁用 JavaScript、不可用 localStorage、减少动效以及键盘导航均有行为验证。可见星名的边界必须位于作品区之前。

内容扩展检查包含手机/平板/桌面下的两、三、四项目网格，以及较长中文标题、连续英文字符与日期的避让。这些使用浏览器临时 DOM 夹具，只验证布局，不会把占位内容加入源码、构建或正式数据。零项目分支经过源码检查；真实单项目与无首页文章状态在实际构建和截图中验证。

## 截图

| 场景 | 文件 |
| --- | --- |
| 桌面暗色，1440px 全页 | [home-desktop-dark.png](../output/playwright/home-desktop-dark.png) |
| 桌面浅色，1440px 全页 | [home-desktop-light.png](../output/playwright/home-desktop-light.png) |
| 手机暗色，390px 全页 | [home-mobile-dark.png](../output/playwright/home-mobile-dark.png) |
| 手机浅色，390px 全页 | [home-mobile-light.png](../output/playwright/home-mobile-light.png) |
| 平板暗色，768px 全页 | [home-tablet-dark.png](../output/playwright/home-tablet-dark.png) |
| 笔记本首屏，1440×900 | [home-laptop-dark.png](../output/playwright/home-laptop-dark.png) |
| 关于页 | [about-desktop.png](../output/playwright/about-desktop.png) |
| 旧文章阅读页 | [article-desktop.png](../output/playwright/article-desktop.png) |

截图和检测产物存放在 Git 忽略的 `output/` 内，当前工作区可查看。启动 `npm run preview` 后，运行 `node scripts/capture-homepage.mjs` 可重新生成截图。

## 性能与资源

本地生产预览使用 Lighthouse 13.4.1 移动端模拟，报告为 `output/playwright/lighthouse-mobile.json`。最新指标与资源体积另存于 `output/validation/summary.json`。

| 指标 | 本地模拟结果 |
| --- | --- |
| Performance / Accessibility / SEO | 99 / 100 / 100 |
| FCP / LCP | 1.2s / 2.0s |
| Total Blocking Time / CLS | 0ms / 0 |
| 总传输量 | 148,616 bytes，约 145KiB |

这是本地实验室测试，不能代替上线后的真实用户 Core Web Vitals、INP 或索引结果。部署、线上功能、真实用户性能与搜索收录尚未验证。

| 资源 | 实际文件体积 |
| --- | --- |
| 桌面山水，1920×713 | 49,526 bytes |
| 手机山水，900×720 | 30,798 bytes |
| 项目截图封面，960px 宽 | 34,604 bytes |
| 三个 WOFF2 字重合计 | 139,280 bytes；首页实际只加载使用中的 400 字重 |

手机请求专用山水裁切；项目图延迟加载；分享图在构建时生成，不在首页请求。星图随 HTML 输出，无额外绘图库依赖。

## 已知遗留项

本次安装审计仍报告 32 个依赖漏洞：4 low、12 moderate、15 high、1 critical，与本次记录的安装基线数量一致。未执行会连带升级框架的 `npm audit fix`；该数量不等于已证实的线上可利用漏洞，依赖升级和具体可达性审查需要单独处理。

当前无远端 CI、部署或线上验收记录。代码与素材已在本地完成，后续新增真实作品和文章按现有数据结构维护即可。
