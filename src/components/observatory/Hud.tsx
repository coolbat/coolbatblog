import { useEffect, useRef, useState } from "react";
import { useObservatoryStore } from "./store";
import { skyApi } from "./skyApi";
import { CONSTELLATIONS_BY_ID } from "@data/observatory/constellations";
import { SEASONS, SEASONS_BY_ID } from "@data/observatory/seasons";
import { OBJECTS_BY_ID } from "@data/observatory/objects";
import type { SeasonId } from "@data/observatory/types";

/** 星座名称标签：跟随相机投影定位，hover / 聚焦 / 键盘聚焦时可见 */
function ConstellationLabel({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const season = useObservatoryStore(s => s.season);
  const hovered = useObservatoryStore(s => s.hoveredConstellation === id);
  const focused = useObservatoryStore(s => s.focusedConstellation === id);
  const c = CONSTELLATIONS_BY_ID.get(id)!;

  useEffect(() => {
    if (!hovered && !focused) return;
    const el = ref.current;
    const api = skyApi.current;
    if (!el || !api) return;
    // 标签锚点：星座覆盖区最上缘上方，并夹取在可视区域内
    const topY = c.position.y + Math.min(...c.stars.map(s => s.y)) - 34;
    return api.onFrame(() => {
      const anchor = api.project(c.position.x, topY);
      if (!anchor) {
        el.style.opacity = "0";
        return;
      }
      const y = Math.max(64, Math.min(anchor.y, window.innerHeight - 140));
      const x = Math.max(90, Math.min(anchor.x, window.innerWidth - 90));
      el.style.opacity = "";
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    });
  }, [hovered, focused, c]);

  if (c.season !== season && c.season !== "circumpolar") return null;

  return (
    <div
      ref={ref}
      className={`constellation-label ${hovered || focused ? "is-visible" : ""}`}
      aria-hidden="true"
    >
      <span className="label-en">{c.nameEn}</span>
      <span className="label-zh">{c.nameZh}</span>
      <span className="label-season">
        {c.season === "circumpolar"
          ? "Circumpolar · 北天常驻"
          : `${SEASONS_BY_ID.get(c.season as SeasonId)!.nameEn} · ${SEASONS_BY_ID.get(c.season as SeasonId)!.nameZh}`}
      </span>
    </div>
  );
}

/** 首次进入的轻提示（PRD §39），进入任何聚焦状态即隐去 */
function IntroHint() {
  const mode = useObservatoryStore(s => s.mode);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("observatory_intro_seen") === "true") return;
    } catch {
      /* 存储不可用时每次都会提示，可接受 */
    }
    const showTimer = setTimeout(() => setVisible(true), 3000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem("observatory_intro_seen", "true");
      } catch {
        /* ignore */
      }
    }, 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  return (
    <p
      className={`intro-hint ${visible && mode === "sky" ? "is-visible" : ""}`}
      role="note"
    >
      拖动探索天空
      <br />
      点击星座开始观察
    </p>
  );
}

/** 四季切换器（PRD §9.2） */
function SeasonSwitcher() {
  const season = useObservatoryStore(s => s.season);
  const seasonChanging = useObservatoryStore(s => s.seasonChanging);
  const setSeason = useObservatoryStore(s => s.setSeason);
  return (
    <nav className="season-switcher" aria-label="四季星空切换">
      {SEASONS.map(s => (
        <button
          key={s.id}
          type="button"
          aria-pressed={season === s.id}
          aria-label={`${s.nameEn} ${s.nameZh}：${s.subtitleZh}`}
          disabled={seasonChanging}
          onClick={() => setSeason(s.id)}
        >
          <span className="season-en">{s.id}</span>
          <span className="season-zh">{s.nameZh}</span>
        </button>
      ))}
    </nav>
  );
}

/** OBJECT_FOCUS 状态的望远镜 CTA（PRD §17） */
function ObjectCta() {
  const mode = useObservatoryStore(s => s.mode);
  const targetObject = useObservatoryStore(s => s.targetObject);
  const openTelescope = useObservatoryStore(s => s.openTelescope);
  if (mode !== "object" || !targetObject) return null;
  const obj = OBJECTS_BY_ID.get(targetObject);
  if (!obj) return null;
  return (
    <div className="object-cta" role="group" aria-label="望远镜操作">
      <p>
        {obj.catalogName && (
          <span className="cta-catalog">{obj.catalogName}</span>
        )}
        {obj.nameZh} · {obj.nameEn}
      </p>
      <button type="button" className="cta-button" onClick={openTelescope}>
        对准望远镜 <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

/** 键盘与读屏用户的导览列表（canvas 不可聚焦时的等价入口） */
function SkyDirectory() {
  const season = useObservatoryStore(s => s.season);
  const openConstellation = useObservatoryStore(s => s.openConstellation);
  const focusObject = useObservatoryStore(s => s.focusObject);
  const cfg = SEASONS_BY_ID.get(season)!;
  return (
    <details className="sky-directory">
      <summary>星座导览</summary>
      <div className="directory-panel">
        <p className="directory-season">{cfg.subtitleZh}</p>
        <ul>
          {cfg.constellations.map(id => {
            const c = CONSTELLATIONS_BY_ID.get(id)!;
            return (
              <li key={id}>
                <button type="button" onClick={() => openConstellation(id)}>
                  {c.nameZh} <span lang="en">{c.nameEn}</span>
                </button>
                {c.deepSkyObjects.length > 0 && (
                  <span className="directory-objects">
                    {c.deepSkyObjects.map(oid => {
                      const o = OBJECTS_BY_ID.get(oid)!;
                      return (
                        <button
                          key={oid}
                          type="button"
                          onClick={() => focusObject(oid)}
                        >
                          {o.catalogName ?? o.nameEn}
                        </button>
                      );
                    })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

export default function Hud() {
  const hovered = useObservatoryStore(s => s.hoveredConstellation);
  const focused = useObservatoryStore(s => s.focusedConstellation);

  const labelIds = [
    ...new Set([hovered, focused].filter((x): x is string => x !== null)),
  ];

  return (
    <>
      <header className="observatory-topbar">
        <a href="/" className="observatory-brand">
          coolbat.xyz <span aria-hidden="true">/</span>{" "}
          <span lang="en">Observatory</span>
        </a>
        <div className="topbar-actions">
          <SkyDirectory />
          <a href="/" className="exit-link" data-track-exit>
            返回主页
          </a>
        </div>
      </header>

      {labelIds.map(id => (
        <ConstellationLabel key={id} id={id} />
      ))}

      <p className="sky-disclaimer">
        <span lang="en">Northern Hemisphere · Representative Seasonal Sky</span>
        <span>北半球代表性四季星空</span>
      </p>

      <ObjectCta />
      <SeasonSwitcher />
      <IntroHint />
    </>
  );
}
