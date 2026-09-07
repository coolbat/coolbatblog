# 首页资源记录

更新：2026-09-07。

## 山水背景

通过内置 image_gen 工具生成。图像只包含山水与雾气；文字、星点、轨道在页面中独立实现。

- 原始输出：`/Users/coolbat/.codex/generated_images/01a07bd1-471e-7702-aa08-ae4c9ee4115f/exec-1202618f-dd90-49a8-bdc9-67f3925b54b1.png`。
- 项目资源：`public/home/mountains-desktop.webp`，1920×713。
- 手机资源：`public/home/mountains-mobile.webp`，900×720。
- 使用 Sharp 导出 WebP 和手机裁切，分别使用 quality 83 / 82。生成原图保留。
- 浅色模式在 CSS 中调整灰度与色调，和暗色共用同一资源。

实际生成提示词：

```text
Use case: stylized-concept. Asset type: atmospheric landscape background for an elegant Chinese independent developer portfolio website. Create a very wide panoramic Chinese shanshui landscape at night, aspect ratio about 2.7:1. Painterly, finely textured ink-wash mountains mixed with subtle cinematic photographic detail. Almost-black deep midnight navy (#080f14) palette, silvery blue-gray mist. Layered distant mountains, wisps of fog, pine silhouettes and craggy forested mountains concentrated in the bottom half. One distinct lower central mountain and taller ridges toward the far right; left upper half and entire upper third remain very dark quiet negative space for separately overlaid website text and an astronomical diagram. Upper sky and left/right edges blend gently into a uniform nearly black navy. Fine paper grain and beautifully controlled atmospheric depth, contemplative scholarly Eastern aesthetic. Mountains visible enough to discern details, but restrained contrast. This is only a seamless-feeling landscape backdrop, not a website mockup. No text, no typography, no stars, no constellations, no circular diagrams, no people, no buildings, no logos or watermarks. Return the wide landscape as a high-resolution image.
```

## 星图与图标

`src/components/home/StarMap.astro` 是人工编排连线、固定随机种子背景星点的品牌插画。主星、轨道与 HTML 标签使用同一坐标系。主图和近况小图使用独立 SVG id 前缀。

图标和 favicon 为本次新增的代码原生 SVG，不依赖额外图标库。

## 字体

来源为 Google Fonts 的 Noto Serif SC，遵循 [SIL Open Font License](https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/OFL.txt)。许可副本保存在 `public/fonts/OFL-NotoSerifSC.txt`。

通过 Google Fonts CSS API 的 text 参数生成覆盖本版固定文案的 400/500/600 字重子集，再使用 fonttools + brotli 转换为 WOFF2。浏览器只请求实际使用的字重。TTF 400 保留用于 Satori 构建分享图，其余文字由字体栈回退。

字体子集更新脚本会从固定组件文案中收集中文字符，并包含完整 ASCII 标点，确保网页和分享图的站名都能正确显示。

```sh
python3 scripts/update-display-fonts.py
```

底层转换命令：

```sh
uvx --from fonttools --with brotli fonttools ttLib.woff2 compress input.ttf -o output.woff2
```

## 项目封面与分享图

- `public/projects/coolbat-blog.webp`：来自本次实现后主页首屏的真实浏览器截图，经 Sharp 缩放到 960px 宽、quality 85 导出。截图原件保存在 `output/playwright/blog-cover-source.png`。
- 既有 `public/projects/coolbat-blog.png` 原件保留。
- `/og.png`：构建时由 `src/utils/og-templates/site.tsx` 使用本地字体、原生 SVG 和 Satori 生成，1200×630。未对外调用图像生成 API。

浏览器截图和验收结果位于被 Git 忽略的 `output/playwright/`。正式页面只依赖 public 中的资源，构建分享图额外读取其中的本地 TTF 文件。

## 新增精选项目封面

2026-09-07 按用户指定仓库加入四个项目，介绍依据当日读取的仓库 README；使用各仓库现有头图，不生成虚构产品界面。

| 项目 | 来源 | 本地资源 |
| --- | --- | --- |
| AniDiagram | [README 头图](https://github.com/coolbat/anidiagram/blob/main/assets/readme/hero.svg) | `public/projects/anidiagram.webp` |
| HeroCards | [README 头图](https://github.com/coolbat/herocards/blob/main/assets/readme/hero.webp) | `public/projects/herocards.webp` |
| PhraseSketch | [README 头图](https://github.com/coolbat/PhraseSketch/blob/main/assets/readme/hero.svg)，通过已有 GitHub 授权读取，仓库当前为私有 | `public/projects/phrase-sketch.webp` |
| Awesome DSH Plugins | [README 头图](https://github.com/coolbat/awesome-dsh-plugins/blob/main/assets/readme/hero.svg) | `public/projects/awesome-dsh-plugins.webp` |

使用 Sharp 按原比例缩放至 960px 宽、WebP quality 86 导出，卡片以 contain 展示完整横幅。来源快照与 README 保存在 `output/project-sources/`。封面内的版本、数量为源仓库横幅中的静态内容，不作为本站的实时统计。
