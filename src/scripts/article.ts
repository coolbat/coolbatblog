let queuedFrame = 0;

function updateProgress() {
  queuedFrame = 0;
  const article = document.querySelector<HTMLElement>("#article");
  const progress = document.querySelector<HTMLElement>("#reading-progress");
  if (!article || !progress) return;
  const start = article.getBoundingClientRect().top + window.scrollY;
  const distance = article.offsetHeight - window.innerHeight;
  const amount =
    distance > 0
      ? (window.scrollY - start) / distance
      : window.scrollY >= start
        ? 1
        : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
}

function queueProgress() {
  if (!queuedFrame) queuedFrame = requestAnimationFrame(updateProgress);
}

function setupArticle() {
  const article = document.querySelector<HTMLElement>("#article");
  if (!article) return;
  for (const heading of article.querySelectorAll<HTMLElement>(
    "h2[id], h3[id], h4[id], h5[id], h6[id]"
  )) {
    if (heading.querySelector(".heading-link")) continue;
    const label = heading.textContent?.trim() ?? "章节";
    const link = document.createElement("a");
    link.className = "heading-link";
    link.href = `#${heading.id}`;
    link.setAttribute("aria-label", `链接到：${label}`);
    link.textContent = "#";
    heading.tabIndex = -1;
    heading.append(link);
  }
  for (const pre of article.querySelectorAll<HTMLPreElement>("pre")) {
    if (pre.parentElement?.classList.contains("code-block")) continue;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    const language = document.createElement("span");
    language.textContent = pre.dataset.language || "CODE";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.copyCode = "";
    button.textContent = "复制代码";
    toolbar.append(language, button);
    pre.before(wrapper);
    wrapper.append(toolbar, pre);
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `${language.textContent} 代码`);
  }
  for (const table of article.querySelectorAll<HTMLTableElement>("table")) {
    table.tabIndex = 0;
    table.setAttribute("aria-label", "文章表格，可横向滚动");
  }
  queueProgress();
}

document.addEventListener("click", async event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>(
    "[data-copy-code], [data-copy-link]"
  );
  if (button) {
    const original = button.hasAttribute("data-copy-code")
      ? "复制代码"
      : "复制链接";
    const text =
      button.dataset.copyLink ??
      button.closest(".code-block")?.querySelector("code")?.textContent ??
      "";
    const status = document.querySelector<HTMLElement>(".article-feedback");
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "已复制";
      if (status) status.textContent = `${original}成功`;
    } catch {
      button.textContent = "复制失败";
      if (status) status.textContent = "复制失败，请手动选择并复制。";
    }
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = original;
    }, 2000);
  }
  const anchor = event.target.closest<HTMLAnchorElement>(
    ".article-toc a, [data-back-top]"
  );
  if (anchor) {
    const heading = document.getElementById(
      decodeURIComponent(anchor.hash.slice(1))
    );
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
});
document.addEventListener("scroll", queueProgress, { passive: true });
window.addEventListener("resize", queueProgress);
document.addEventListener("astro:page-load", setupArticle);
setupArticle();
