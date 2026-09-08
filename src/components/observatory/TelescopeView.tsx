import { useEffect, useRef, useState } from "react";
import { useObservatoryStore } from "./store";
import { OBJECTS_BY_ID } from "@data/observatory/objects";
import { CONSTELLATIONS_BY_ID } from "@data/observatory/constellations";
import { OBSERVATORY } from "@config";
import { track } from "./track";

/** 恒星没有照片：程序化绘制带衍射星芒的点源视觉 */
function StarVisual({ tint }: { tint: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 480;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#04070b";
    ctx.fillRect(0, 0, size, size);

    // 背景星点
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 130; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = rand() * 1.1 + 0.2;
      ctx.globalAlpha = 0.15 + rand() * 0.4;
      ctx.fillStyle = "#dfe3ea";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const cx = size / 2;
    const cy = size / 2;
    // 光晕
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2.4);
    glow.addColorStop(0, tint);
    glow.addColorStop(0.18, `${tint}55`);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    // 衍射星芒
    ctx.strokeStyle = tint;
    ctx.globalAlpha = 0.75;
    for (const [len, w, alpha] of [
      [size * 0.46, 1.6, 0.7],
      [size * 0.2, 1.2, 0.45],
    ] as const) {
      ctx.globalAlpha = alpha;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(cx - len, cy);
      ctx.lineTo(cx + len, cy);
      ctx.moveTo(cx, cy - len);
      ctx.lineTo(cx, cy + len);
      ctx.stroke();
    }
    // 星体核心
    ctx.globalAlpha = 1;
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.5, tint);
    core.addColorStop(1, "transparent");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();
  }, [tint]);
  return <canvas ref={ref} className="telescope-visual-canvas" />;
}

const STAR_TINT_HEX: Record<string, string> = {
  antares: "#e8906a",
  betelgeuse: "#eda578",
  aldebaran: "#f0b57e",
  arcturus: "#f5c98d",
  capella: "#f5dfa0",
  enif: "#f2bd8c",
  mirach: "#f0b183",
  sirius: "#cfe0f5",
  vega: "#ccdcf7",
  rigel: "#c5d8f7",
  spica: "#ccdcf5",
  deneb: "#dae3f7",
  polaris: "#f5e3ae",
};

export default function TelescopeView() {
  const mode = useObservatoryStore(s => s.mode);
  const telescopeObject = useObservatoryStore(s => s.telescopeObject);
  const back = useObservatoryStore(s => s.back);
  const [imageFailed, setImageFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = mode === "telescope" && telescopeObject;

  useEffect(() => {
    if (open) closeRef.current?.focus();
    setImageFailed(false);
  }, [open, telescopeObject]);

  if (!open) return null;
  const obj = OBJECTS_BY_ID.get(telescopeObject)!;
  const constellation = CONSTELLATIONS_BY_ID.get(obj.constellationId);

  return (
    <div
      className="telescope-view"
      role="dialog"
      aria-modal="true"
      aria-label={`望远镜视野：${obj.nameZh}`}
    >
      <div className="telescope-stage">
        <div className="telescope-eyepiece">
          {obj.image && !imageFailed ? (
            <img
              src={obj.image}
              alt={`${obj.nameZh}（${obj.nameEn}）的照片`}
              onError={() => setImageFailed(true)}
            />
          ) : obj.type === "star" ? (
            <StarVisual tint={STAR_TINT_HEX[obj.id] ?? "#efe8d8"} />
          ) : (
            <div className="telescope-visual-fallback" aria-hidden="true" />
          )}
          <div className="eyepiece-ring" aria-hidden="true" />
        </div>

        <div className="telescope-info">
          <p className="eyebrow" lang="en">
            Telescope view
          </p>
          <h2>
            {obj.nameZh}
            <span lang="en">
              {obj.catalogName ? `${obj.catalogName} · ` : ""}
              {obj.nameEn}
            </span>
          </h2>
          <dl>
            <div>
              <dt>类型</dt>
              <dd>{obj.objectTypeText}</dd>
            </div>
            {obj.distanceText && (
              <div>
                <dt>距离</dt>
                <dd>{obj.distanceText}</dd>
              </div>
            )}
            {constellation && (
              <div>
                <dt>所属</dt>
                <dd>{constellation.nameZh}</dd>
              </div>
            )}
          </dl>
          <p className="telescope-summary">{obj.summaryZh}</p>
          <a
            className="cta-button explore-link"
            href={`${OBSERVATORY.externalBaseUrl}/objects/${obj.externalSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("explore_further_click", { target: obj.id })}
          >
            观察更多 <span aria-hidden="true">→</span>
            <span className="sr-only">（在新标签页打开）</span>
          </a>
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        className="telescope-close"
        aria-label="关闭望远镜视野"
        onClick={back}
      >
        ×
      </button>
    </div>
  );
}
