(() => {
  if (window.__coolbatThemeReady) return;
  window.__coolbatThemeReady = true;
  document.documentElement.dataset.js = "true";
  let theme = "dark";
  let motionPaused = false;
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") theme = saved;
    motionPaused = localStorage.getItem("motion-paused") === "true";
  } catch {
    /* The controls also work when storage is unavailable. */
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reflect(root = document.documentElement) {
    root.dataset.theme = theme;
    root.dataset.js = "true";
    root.dataset.motionPaused = String(motionPaused || reducedMotion.matches);
    const themeButton = document.querySelector("#theme-btn");
    const label = theme === "dark" ? "切换到浅色" : "切换到深色";
    themeButton?.setAttribute("aria-label", label);
    themeButton?.setAttribute("title", label);
    // 主题底色与 base.css 的 --color-fill、Layout.astro 的 theme-color 保持一致
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080f14" : "#f4f0e7");
    const motionButton = document.querySelector("[data-motion-toggle]");
    if (motionButton) {
      motionButton.disabled = reducedMotion.matches;
      motionButton.setAttribute(
        "aria-pressed",
        String(motionPaused || reducedMotion.matches)
      );
      const motionLabel = reducedMotion.matches
        ? "已减少动态效果"
        : motionPaused
          ? "播放星光"
          : "暂停星光";
      motionButton.setAttribute("aria-label", motionLabel);
      motionButton.querySelector("[data-motion-label]").textContent =
        motionLabel;
    }
  }
  reflect();
  document.addEventListener("DOMContentLoaded", () => reflect());
  document.addEventListener("astro:before-swap", event =>
    reflect(event.newDocument.documentElement)
  );
  document.addEventListener("astro:after-swap", () => reflect());
  document.addEventListener("astro:page-load", () => reflect());
  reducedMotion.addEventListener("change", () => reflect());
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("#theme-btn")) {
      theme = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* Keep the in-memory choice. */
      }
      reflect();
    }
    if (
      event.target.closest("[data-motion-toggle]") &&
      !reducedMotion.matches
    ) {
      motionPaused = !motionPaused;
      try {
        localStorage.setItem("motion-paused", String(motionPaused));
      } catch {
        /* Keep the in-memory choice. */
      }
      reflect();
    }
  });
})();
