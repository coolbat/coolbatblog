# 首页精选项目更新

日期：2026-09-07。按用户给出的四个 GitHub 地址更新项目内容。

| 首页顺序 | 项目 | 介绍依据与链接 |
| --- | --- | --- |
| 1 | AniDiagram | [仓库](https://github.com/coolbat/anidiagram)：将自然语言架构说明转化为动态图解，支持 SVG、交互 HTML 等输出 |
| 2 | HeroCards | [仓库](https://github.com/coolbat/herocards)：历史人物和幻想英雄的浮雕收藏卡，支持实时光照与视差 |
| 3 | PhraseSketch | [仓库](https://github.com/coolbat/PhraseSketch)：理解短文本含义，输出风格化插画和视觉卡片；当前为私有仓库 |
| 4 | Awesome DSH Plugins | [仓库](https://github.com/coolbat/awesome-dsh-plugins)：DeepSeek Harness 插件的双语目录和可追溯审查记录 |

四张卡片均链接用户指定的仓库。原 Coolbat Blog 的内容保留在 `/projects/`，不占首页四个精选位置。没有改变任何仓库的可见性；PhraseSketch 的私有标识与辅助文本提示访客需要访问权限。

全部介绍依据当日实时读取的 README；PhraseSketch 使用已有 GitHub 授权读取，未将历史记忆当作当前产品状态。所有封面使用仓库 README 中的真实头图，详情见 [资源记录](homepage-assets.md)。带文字横幅在桌面和手机上完整展示。

修改入口为 `src/data/projects.ts`。项目卡片增加可选的 `visibility` 和 `imageFit`，分别控制私有标识和封面裁切方式。

验证记录位于 `output/validation/project-update.log`；最新截图为 `output/playwright/home-desktop-dark.png`、`home-mobile-dark.png` 等。本站仅完成本地更新，尚未部署。

Node 22 下的类型检查（0 errors / 0 warnings / 0 hints）、ESLint、Prettier、生产构建与 22 项浏览器测试均通过。测试确认首页四个项目的顺序和链接、PhraseSketch 私有标识、全部作品五个项目，以及 375–1920px 的双主题布局。8 张截图已更新，桌面和手机人工检查通过，图像加载正常，无横向溢出或页面脚本错误。本次没有重测 Lighthouse，原性能报告属于单项目首版。
