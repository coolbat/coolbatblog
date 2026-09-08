import { useObservatoryStore } from "./store";
import { CONSTELLATIONS_BY_ID } from "@data/observatory/constellations";
import { OBJECTS_BY_ID } from "@data/observatory/objects";
import { OBSERVATORY } from "@config";
import { track } from "./track";

/**
 * 星座聚焦信息卡（PRD §16.2）。
 * 列出该星座的主要恒星与深空目标，点击进入 OBJECT_FOCUS；
 * 「对准望远镜」直达该星座的第一个代表目标。
 */
export default function ConstellationCard() {
  const mode = useObservatoryStore(s => s.mode);
  const focusedId = useObservatoryStore(s => s.focusedConstellation);
  const targetObject = useObservatoryStore(s => s.targetObject);
  const focusObject = useObservatoryStore(s => s.focusObject);
  const back = useObservatoryStore(s => s.back);

  const active = (mode === "constellation" || mode === "object") && focusedId;
  if (!active) return null;
  const c = CONSTELLATIONS_BY_ID.get(focusedId)!;

  // 主要恒星（有 objectId 的星）+ 深空目标
  const starObjects = c.stars
    .filter(s => s.objectId)
    .map(s => OBJECTS_BY_ID.get(s.objectId!)!);
  const dsoObjects = c.deepSkyObjects.map(id => OBJECTS_BY_ID.get(id)!);
  const primaryTarget = dsoObjects[0] ?? starObjects[0];

  return (
    <aside
      className="constellation-card"
      aria-labelledby="constellation-card-title"
    >
      <button
        type="button"
        className="card-close"
        aria-label="关闭星座详情"
        onClick={back}
      >
        ×
      </button>
      <p className="card-eyebrow" lang="en">
        {c.latinName}
      </p>
      <h2 id="constellation-card-title">
        {c.nameZh}
        <span lang="en">{c.nameEn}</span>
      </h2>
      <p className="card-summary">{c.summaryZh}</p>

      {starObjects.length > 0 && (
        <div className="card-section">
          <h3>主要恒星</h3>
          <ul>
            {starObjects.map(o => (
              <li key={o.id}>
                <button
                  type="button"
                  aria-pressed={targetObject === o.id}
                  onClick={() => focusObject(o.id)}
                >
                  {o.nameZh} <span lang="en">{o.nameEn}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dsoObjects.length > 0 && (
        <div className="card-section">
          <h3>深空目标</h3>
          <ul>
            {dsoObjects.map(o => (
              <li key={o.id}>
                <button
                  type="button"
                  aria-pressed={targetObject === o.id}
                  onClick={() => focusObject(o.id)}
                >
                  {o.catalogName && <span lang="en">{o.catalogName} · </span>}
                  {o.nameZh}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="card-meta">
        <div>
          <dt>最佳季节</dt>
          <dd>{c.bestSeasonZh}</dd>
        </div>
        <div>
          <dt>代表目标</dt>
          <dd>{c.highlightsZh}</dd>
        </div>
      </dl>

      {primaryTarget && (
        <button
          type="button"
          className="cta-button card-cta"
          onClick={() => focusObject(primaryTarget.id)}
        >
          对准望远镜 <span aria-hidden="true">→</span>
        </button>
      )}

      <a
        className="card-external"
        href={`${OBSERVATORY.externalBaseUrl}/constellations/${c.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("explore_further_click", { target: c.id })}
      >
        了解{`「${c.nameZh}」`}更多 <span aria-hidden="true">↗</span>
        <span className="sr-only">（在新标签页打开）</span>
      </a>
    </aside>
  );
}
