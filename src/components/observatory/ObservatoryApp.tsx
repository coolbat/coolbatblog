import { useEffect } from "react";
import { useObservatoryStore } from "./store";
import SkyCanvas from "./SkyCanvas";
import Hud from "./Hud";
import ConstellationCard from "./ConstellationCard";
import TelescopeSvg from "./TelescopeSvg";
import TelescopeView from "./TelescopeView";
import { SEASONS_BY_ID } from "@data/observatory/seasons";
import { track } from "./track";

export default function ObservatoryApp() {
  const season = useObservatoryStore(s => s.season);
  const mode = useObservatoryStore(s => s.mode);
  const cfg = SEASONS_BY_ID.get(season)!;

  // 进入埋点 + ESC 逐级退出
  useEffect(() => {
    track("observatory_enter");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useObservatoryStore.getState().back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 浏览器前进/后退与状态机同步
  useEffect(() => {
    const onPop = () => useObservatoryStore.getState().back();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (mode !== "sky") {
      history.pushState({ observatory: mode }, "");
    }
  }, [mode]);

  // 退出埋点（返回主页链接）
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.("[data-track-exit]")) {
        track("observatory_exit");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      className="observatory-root"
      style={{
        background: `linear-gradient(180deg, ${cfg.skyTop} 0%, ${cfg.skyBottom} 100%)`,
      }}
    >
      <SkyCanvas />
      <Hud />
      <ConstellationCard />
      <TelescopeSvg />
      <TelescopeView />
      <p className="season-caption" aria-live="polite">
        <span lang="en">{cfg.nameEn}</span> · {cfg.subtitleZh}
      </p>
    </div>
  );
}
