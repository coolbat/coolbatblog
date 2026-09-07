# 内页风格统一与联系信息

日期：2026-09-07。按用户要求优化作品、写作、关于与文章详情页面，延续首页的深墨色、宋体标题、金灰细线与星轨意象。浅色和手机布局一起实现。

## 页面变化

| 页面 | 交付内容 |
| --- | --- |
| `/projects/` | 星轨页头、作品总数、宽版双列项目目录；原博客单独横排，手机回到单列；补充交流入口 |
| `/posts/` | 写作页头、日期索引、作者、摘要与标签、搜索/归档/RSS 入口、主题索引；继续使用原分页与更新时间排序 |
| `/about/` | 个人署名、印章意象、舒适的阅读栏、简化介绍结构、GitHub/X 联系卡片 |
| `/posts/adding-new-posts-in-astropaper-theme/` | 衬线标题、发布/更新日期、作者、桌面目录、手机折叠目录、正文/表格/代码排版、复制代码与链接、分享菜单、阅读进度、返回写作入口 |

四个新增真实项目及原博客均保留，PhraseSketch 继续显示私有标识。没有新增虚构文章；原 AstroPaper 文档保留 Sat Naing 署名、日期、正文和地址。文章结构化数据不再把其他作者指向 Coolbat 主页。

## 联系方式

- GitHub：<https://github.com/coolbat>，修复此前页脚指向旧仓库的地址。
- X：<https://x.com/coolbat1999>。

地址统一维护在 `src/config.ts`，由联系模块、页脚和个人 `sameAs` 数据复用。保留原有 YouTube 和 RSS 入口。本次只更新站点链接，没有对外发送消息。

## 阅读交互

文章目录由渲染后的二、三级标题生成；原 Markdown 自动目录保留在内容中，启用新目录时隐藏重复视觉展示。手机使用原生 details，禁用 JavaScript 时仍可展开并跳转。

代码与链接复制由页面内模块增强，复制受限时提示手动操作；不会抛出未处理错误。分享菜单保留原有平台入口，URL 使用线上 canonical 并编码参数。文章增强重复初始化时不会重复生成按钮和标题链接，离开文章页后没有额外进度条残留。

正文采用 16–17px 的系统字体，标题使用本地宋体子集；长表格和代码块可在自身区域横向滚动。站点没有限制浏览器缩放。字体脚本增加对页面和布局固定文案的收集，本次浏览器主要使用的 400 字重 WOFF2 为 65,540 bytes。

代码块使用与整站一致的深墨/暖纸配色，修复旧主题注释偏暗的问题。六类文字与代码背景的最低对比度分别为浅色 4.74:1、深色 7.89:1。

## 验证与证据

新增 `tests/browser/interior.spec.ts`，与首页测试合计 43 项。覆盖四个页面在 375、768、1024、1440px 下的双主题、无横向溢出、原文章和作者、联系地址、目录跳转、无 JavaScript、复制成功/失败、连续站内导航及 200% 文字大小。

Node 22 下类型检查、ESLint、格式检查与生产构建全部通过；43 项浏览器测试通过，没有跳过或不稳定用例。四页本地 Lighthouse 移动端检查结果如下（默认深色主题；浅色另有截图与浏览器布局验证）：

| 页面 | 可访问性 | SEO |
| --- | --- | --- |
| 作品 | 100 | 100 |
| 写作 | 100 | 100 |
| 关于 | 100 | 100 |
| 文章详情 | 100 | 100 |

验证日志：`output/validation/interior-final.log`。浏览器 JSON：`output/playwright/results.json`。各页可访问性及 SEO 报告保存在 `output/playwright/interior/lighthouse-*.json`；汇总为 `output/validation/interior-summary.json`。这些是本地构建和浏览器证据，远端 CI、部署与线上表现尚未验证。

运行 `npm run preview`，再执行 `node scripts/capture-interior.mjs` 可生成 18 张截图。当前截图与几何检查记录保存在 `output/playwright/interior/`，不纳入 Git。

| 页面 | 桌面 | 手机 |
| --- | --- | --- |
| 作品 | [暗色截图](../output/playwright/interior/projects-desktop-dark.png) | [暗色截图](../output/playwright/interior/projects-mobile-dark.png) |
| 写作 | [暗色截图](../output/playwright/interior/writing-desktop-dark.png) | [暗色截图](../output/playwright/interior/writing-mobile-dark.png) |
| 关于 | [暗色截图](../output/playwright/interior/about-desktop-dark.png) | [暗色截图](../output/playwright/interior/about-mobile-dark.png) |
| 文章 | [暗色首屏](../output/playwright/interior/article-desktop-dark.png) | [暗色首屏](../output/playwright/interior/article-mobile-dark.png) |

文件名中的 `dark` 替换为 `light` 可查看浅色截图；代码阅读截图为 `article-code-desktop.png` 和 `article-code-mobile.png`。
