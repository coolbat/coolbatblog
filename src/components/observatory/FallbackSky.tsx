import { useMemo } from "react";
import { useObservatoryStore } from "./store";
import { CONSTELLATIONS } from "@data/observatory/constellations";
import { CELESTIAL_OBJECTS } from "@data/observatory/objects";

/**
 * WebGL 不可用时的 2D 降级星空（PRD §38）。
 * 静态 SVG，星座与天体仍可点击，四季可切换，核心内容完整可达。
 */
export default function FallbackSky() {
  const season = useObservatoryStore(s => s.season);
  const openConstellation = useObservatoryStore(s => s.openConstellation);
  const focusObject = useObservatoryStore(s => s.focusObject);

  const visible = useMemo(
    () =>
      CONSTELLATIONS.filter(
        c => c.season === season || c.season === "circumpolar"
      ),
    [season]
  );
  const dsos = useMemo(
    () => CELESTIAL_OBJECTS.filter(o => o.position && o.season === season),
    [season]
  );

  return (
    <div className="sky-canvas fallback-sky">
      <svg
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        role="group"
        aria-label="简化星空图"
      >
        {visible.map(c => (
          <g
            key={c.id}
            role="button"
            tabIndex={0}
            aria-label={`${c.nameZh} ${c.nameEn}`}
            className="fallback-constellation"
            onClick={() => openConstellation(c.id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openConstellation(c.id);
              }
            }}
          >
            {/* 命中区域 */}
            <circle
              cx={c.position.x}
              cy={c.position.y}
              r={90}
              fill="transparent"
            />
            {c.lines.map(([a, b], i) => (
              <line
                key={i}
                x1={c.position.x + c.stars[a].x}
                y1={c.position.y + c.stars[a].y}
                x2={c.position.x + c.stars[b].x}
                y2={c.position.y + c.stars[b].y}
                className="fallback-line"
              />
            ))}
            {c.stars.map((s, i) => (
              <circle
                key={i}
                cx={c.position.x + s.x}
                cy={c.position.y + s.y}
                r={s.mag === 1 ? 3.4 : s.mag === 2 ? 2.4 : 1.5}
                className={`fallback-star mag-${s.mag}`}
              />
            ))}
            <text
              x={c.position.x}
              y={c.position.y + 70}
              className="fallback-label"
            >
              {c.nameZh}
            </text>
          </g>
        ))}
        {dsos.map(o => (
          <g
            key={o.id}
            role="button"
            tabIndex={0}
            aria-label={`${o.catalogName ?? o.nameEn} ${o.nameZh}`}
            className="fallback-constellation"
            onClick={() => focusObject(o.id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                focusObject(o.id);
              }
            }}
          >
            <circle
              cx={o.position!.x}
              cy={o.position!.y}
              r={26}
              fill="transparent"
            />
            <circle
              cx={o.position!.x}
              cy={o.position!.y}
              r={7}
              className="fallback-dso"
            />
          </g>
        ))}
      </svg>
      <p className="fallback-note" role="status">
        当前为简化星空模式（此设备或浏览器不支持 WebGL）
      </p>
    </div>
  );
}
