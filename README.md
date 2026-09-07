# Coolbat · 观星造物

[Coolbat](https://coolbat.xyz/) 的个人主页与博客。基于 Astro 4、Tailwind CSS 3 和 Markdown，首页以山水、星盘与作品展示为主，文章页保留适合阅读的窄栏。

## 本地开发

建议使用 Node.js 22（见 `.nvmrc`）；浏览器测试要求 Node.js 20 及以上。

```sh
npm ci
npm run dev
```

开发地址默认是 `http://localhost:4321`。

```sh
npm run check
npm run lint
npm run format:check
npm run build
npm run preview
```

## 浏览器回归

首次运行先安装浏览器：

```sh
npx playwright install chromium
npm run test:browser
```

测试会先构建，再启动 `127.0.0.1:4319` 上的静态预览。覆盖主题、菜单、键盘操作、无脚本与存储限制、搜索、旧文章地址、分享图和响应式布局。报告保存在 `output/playwright/`，不加入 Git。

在另一个终端运行 `npm run preview` 后，可以生成桌面、手机、平板和阅读页截图：

```sh
node scripts/capture-homepage.mjs
node scripts/capture-interior.mjs
```

预览使用其他地址时，可通过 `PREVIEW_URL` 指定。

内页截图保存在 `output/playwright/interior/`，包含作品、写作、关于和文章详情的桌面/手机双主题，以及代码块阅读截图。

作品、写作和关于页共用 `PageIntro.astro` 的星轨页头，排版位于 `src/styles/interior.css`。文章详情使用 `ArticleToc.astro` 和 `src/scripts/article.ts` 提供目录、代码复制与阅读进度；Markdown 正文和旧地址不变。

GitHub 和 X 联系方式在 `src/config.ts` 统一维护，`ContactLinks.astro`、页脚和个人结构化数据复用相同地址。

## 更新首页内容

| 内容                       | 文件                   |
| -------------------------- | ---------------------- |
| 自我介绍、当前方向         | `src/data/home.ts`     |
| 项目名称、链接、封面、标签 | `src/data/projects.ts` |
| 站点标题、描述、社交链接   | `src/config.ts`        |
| 首页布局与动效             | `src/styles/home.css`  |
| 全站主题与字体             | `src/styles/base.css`  |

首页只展示 `featured: true` 的项目，按 `order` 升序排列，最多四个。项目不足四个时自动调整网格。项目状态与近况更新日期为可选项，仅填写真实信息。

首页精选依次为 AniDiagram、HeroCards、PhraseSketch 和 Awesome DSH Plugins；原 Coolbat Blog 保留在全部作品中，共五个项目。PhraseSketch 当前为私有仓库，卡片标明访问限制，仓库链接需要相应权限。

项目封面来自各仓库的实际 README 头图。带文字的横幅使用 `imageFit: "contain"` 完整展示，避免手机端裁切标题。`visibility: "private"` 控制私有仓库标识；以后仓库公开时同步更新该字段。

## 发布文章

文章存放在 `src/content/blog/`，使用 Astro 4 的常规 content collection。示例 frontmatter：

```yaml
---
title: 文章标题
pubDatetime: 2026-09-07T12:00:00Z
description: 一句话介绍这篇文章。
tags:
  - 开发记录
draft: true
showOnHome: true
---
```

草稿完成后再设置 `draft: false`。`showOnHome` 默认 true，仅控制首页展示，不修改文章地址或其他文章列表。首页按发布日期排序，以上海时区显示日期；其他列表延续原来的更新时间排序。既有的定时发布规则含 15 分钟余量，开发模式允许预览未来文章。

原 AstroPaper 示例文章设为 `showOnHome: false`，旧地址、搜索和 RSS 入口仍保留。没有真实首页文章时显示写作预告。

## 视觉资源

- `public/home/`：生成的山水图及手机裁切。
- `public/projects/`：真实项目封面。
- `public/fonts/`：本地 Noto Serif SC 字体子集和 OFL 许可。WOFF2 用于浏览器，TTF 用于构建分享图。
- `src/components/home/StarMap.astro`：确定性 SVG 星图，标签与星点共同缩放。
- `src/utils/og-templates/site.tsx`：使用本地字体生成 `/og.png`。

标题字体子集覆盖当前固定文案，其他字符使用字体栈回退。改动固定标题后应同步检查字形。素材来源与生成提示词见 [资源记录](docs/homepage-assets.md)。

默认暗色，手动主题选择跨页保持。持续星光可暂停，并遵循系统的减少动态效果设置。

## 设计与验收

- [实施方案](docs/homepage-redesign-plan-2026-09-07.md)
- [开发与验收记录](docs/homepage-implementation-2026-09-07.md)
- [内页风格统一与联系信息](docs/interior-pages-2026-09-07.md)

## 致谢与许可

本项目基于 [Sat Naing 的 AstroPaper](https://github.com/satnaing/astro-paper) 改造，保留原项目 [MIT License](LICENSE)。Noto Serif SC 的许可单独存放在 `public/fonts/OFL-NotoSerifSC.txt`。
