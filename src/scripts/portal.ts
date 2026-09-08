/**
 * 首页星图中心彩蛋 → /observatory 的转场（PRD §7）。
 * 只用 WAAPI + CSS，首页不加载 Observatory 的任何资源；
 * Hover/Focus 入口时 prefetch 路由。
 */

const OBSERVATORY_URL = "/observatory/";
let running = false;

function ensureOverlay(): HTMLDivElement {
  let el = document.getElementById("portal-overlay") as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = "portal-overlay";
    el.style.cssText =
      "position:fixed;inset:0;background:#080f14;opacity:0;pointer-events:none;z-index:60;";
    document.body.append(el);
  }
  return el;
}

/** 从星图中心平滑放大到全屏深色，再导航，避免白屏 */
function leaveWithOverlay(duration = 480) {
  const overlay = ensureOverlay();
  overlay.style.pointerEvents = "auto";
  overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration,
    fill: "forwards",
    easing: "ease-in",
  });
  window.setTimeout(
    () => window.location.assign(OBSERVATORY_URL),
    duration + 60
  );
}

function runPortal(link: HTMLElement) {
  const sky = document.querySelector<HTMLElement>(".hero-sky");
  const starMap = sky?.querySelector("svg");
  if (!sky || !starMap) {
    window.location.assign(OBSERVATORY_URL);
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    // 简化转场：星图轻微放大 + 淡入深色
    sky.animate([{ transform: "scale(1)" }, { transform: "scale(1.6)" }], {
      duration: 350,
      fill: "forwards",
      easing: "ease-out",
    });
    leaveWithOverlay(350);
    return;
  }

  link.classList.add("is-awake");

  const asRotatable = (el: Element | null) => {
    if (!el) return null;
    const g = el as SVGGElement;
    g.style.transformBox = "view-box";
    g.style.transformOrigin = "500px 500px";
    return g;
  };
  const ticks = asRotatable(starMap.querySelector(".orbit-ticks"));
  const guides = asRotatable(starMap.querySelector(".orbit-guides"));
  const dashed = asRotatable(starMap.querySelector(".orbit-dashed"));
  const circles = starMap.querySelectorAll<SVGCircleElement>(
    ".orbit-circles circle"
  );
  const constellations = starMap.querySelector(".constellations");

  // Phase 1（0–500ms）：唤醒——页面其他元素退后
  document
    .querySelectorAll(
      ".site-header, .site-footer, .hero-copy, .hero-poem, .sky-caption, .motion-button, .featured-works, .home-journal"
    )
    .forEach(el =>
      (el as HTMLElement).animate([{ opacity: 1 }, { opacity: 0.1 }], {
        duration: 500,
        fill: "forwards",
        easing: "ease-out",
      })
    );

  // Phase 2（450–1600ms）：光流——两圈反向运行的光迹
  const stream = (
    el: SVGCircleElement | undefined,
    radius: number,
    clockwise: boolean,
    delay: number
  ) => {
    if (!el) return;
    const c = 2 * Math.PI * radius;
    const dash = Math.min(64, c * 0.06);
    el.style.stroke = "rgba(240, 226, 190, 0.95)";
    el.style.strokeDasharray = `${dash} ${c - dash}`;
    el.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: clockwise ? -c : c }],
      {
        duration: 1100,
        delay,
        easing: "cubic-bezier(.45,0,.35,1)",
        fill: "forwards",
      }
    );
  };
  stream(circles[2], 242, true, 450);
  stream(circles[4], 402, false, 560);
  stream(circles[1], 166, true, 650);

  // Phase 3（900–2200ms）：星盘差速旋转 + 星座连线点亮
  ticks?.animate([{ rotate: "0deg" }, { rotate: "10deg" }], {
    duration: 1400,
    delay: 900,
    fill: "forwards",
    easing: "cubic-bezier(.3,.6,.35,1)",
  });
  guides?.animate([{ rotate: "0deg" }, { rotate: "-7deg" }], {
    duration: 1400,
    delay: 900,
    fill: "forwards",
    easing: "cubic-bezier(.3,.6,.35,1)",
  });
  dashed?.animate([{ rotate: "0deg" }, { rotate: "14deg" }], {
    duration: 1400,
    delay: 950,
    fill: "forwards",
    easing: "cubic-bezier(.3,.6,.35,1)",
  });
  constellations?.animate([{ opacity: 0.28 }, { opacity: 0.9 }], {
    duration: 900,
    delay: 1000,
    fill: "forwards",
    easing: "ease-out",
  });

  // Phase 4（1900–3100ms）：星图整体向中心放大，越过屏幕边缘
  sky.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(9)", opacity: 1 },
    ],
    {
      duration: 1250,
      delay: 1900,
      fill: "forwards",
      easing: "cubic-bezier(.6,.02,.72,.4)",
    }
  );

  // Phase 5（约 2900ms）：深色接管，导航
  window.setTimeout(() => leaveWithOverlay(500), 2900);
}

function setupPortal() {
  const link = document.querySelector<HTMLElement>(".portal-star");
  if (!link) return;

  const prefetch = () => {
    if (document.querySelector("link[data-portal-prefetch]")) return;
    const l = document.createElement("link");
    l.rel = "prefetch";
    l.href = OBSERVATORY_URL;
    l.dataset.portalPrefetch = "";
    document.head.append(l);
  };
  link.addEventListener("pointerenter", prefetch, { once: true });
  link.addEventListener("focus", prefetch, { once: true });

  link.addEventListener("click", event => {
    event.preventDefault();
    if (running) return;
    running = true;
    runPortal(link);
  });
}

// 首页也可能通过 ViewTransitions 回到；入口只在首页存在
document.addEventListener("astro:page-load", setupPortal);
setupPortal();
