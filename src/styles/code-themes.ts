// TextMate themes for Astro's existing Shiki renderer. Keep code colors aligned
// with the site's dark ink / warm paper palettes, including readable comments.
function createCodeTheme(
  name: string,
  type: "light" | "dark",
  palette: {
    background: string;
    text: string;
    comment: string;
    keyword: string;
    string: string;
    function: string;
    constant: string;
  }
) {
  return {
    name,
    type,
    colors: {
      "editor.background": palette.background,
      "editor.foreground": palette.text,
    },
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: palette.comment },
      },
      {
        scope: ["keyword", "storage", "entity.name.tag"],
        settings: { foreground: palette.keyword },
      },
      {
        scope: ["string", "markup.inline.raw"],
        settings: { foreground: palette.string },
      },
      {
        scope: ["entity.name.function", "support.function", "entity.name.type"],
        settings: { foreground: palette.function },
      },
      {
        scope: ["constant", "variable.language"],
        settings: { foreground: palette.constant },
      },
    ],
  };
}

// 调色板与 base.css 的 CSS 变量手工对齐：background=--color-card，
// text=--color-text-base，comment=--muted，keyword=--color-accent。
// 修改 base.css token 时请同步此处。
export const codeThemes = {
  light: createCodeTheme("coolbat-paper", "light", {
    background: "#ede8dc",
    text: "#292d2b",
    comment: "#5a5f57",
    keyword: "#75613d",
    string: "#486342",
    function: "#385b68",
    constant: "#7c4c3e",
  }),
  dark: createCodeTheme("coolbat-ink", "dark", {
    background: "#10181e",
    text: "#e8e4da",
    comment: "#a9ada9",
    keyword: "#c9b383",
    string: "#b7c6aa",
    function: "#a7c4ce",
    constant: "#cfaaa0",
  }),
};
