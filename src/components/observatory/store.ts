import { create } from "zustand";
import type { SeasonId } from "@data/observatory/types";
import { DEFAULT_SEASON } from "@data/observatory/seasons";
import { track } from "./track";

/**
 * 页面状态机（PRD §23）：
 * sky → constellation → object → telescope
 * 所有模式切换只允许经由 action 发生，避免布尔状态互相打架。
 */
export type ObservatoryMode = "sky" | "constellation" | "object" | "telescope";

interface ObservatoryState {
  season: SeasonId;
  mode: ObservatoryMode;
  /** 季节切换动画进行中（禁止再次触发） */
  seasonChanging: boolean;
  hoveredConstellation: string | null;
  focusedConstellation: string | null;
  /** OBJECT_FOCUS：望远镜正在对准的目标 */
  targetObject: string | null;
  /** TELESCOPE_VIEW：望远镜视野中的天体 */
  telescopeObject: string | null;
  reducedMotion: boolean;
  lowPower: boolean;

  setSeason: (season: SeasonId) => void;
  endSeasonChange: () => void;
  hoverConstellation: (id: string | null) => void;
  openConstellation: (id: string) => void;
  focusObject: (id: string) => void;
  openTelescope: () => void;
  back: () => void;
  closeAll: () => void;
}

export const useObservatoryStore = create<ObservatoryState>((set, get) => ({
  season: DEFAULT_SEASON,
  mode: "sky",
  seasonChanging: false,
  hoveredConstellation: null,
  focusedConstellation: null,
  targetObject: null,
  telescopeObject: null,
  reducedMotion:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  lowPower:
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4),

  setSeason: season => {
    const s = get();
    if (s.seasonChanging || s.season === season) return;
    track("season_change", { season });
    // 切换季节时退出所有聚焦状态
    set({
      season,
      seasonChanging: true,
      mode: "sky",
      hoveredConstellation: null,
      focusedConstellation: null,
      targetObject: null,
      telescopeObject: null,
    });
  },
  endSeasonChange: () => set({ seasonChanging: false }),

  hoverConstellation: id => {
    if (get().mode !== "sky" && id !== null) return;
    if (id) track("constellation_hover", { constellation: id });
    set({ hoveredConstellation: id });
  },

  openConstellation: id => {
    track("constellation_open", { constellation: id });
    set({
      mode: "constellation",
      focusedConstellation: id,
      hoveredConstellation: null,
      targetObject: null,
      telescopeObject: null,
    });
  },

  focusObject: id => {
    track("object_open", { object: id });
    set({ mode: "object", targetObject: id });
  },

  openTelescope: () => {
    const target = get().targetObject;
    if (!target) return;
    track("telescope_enter", { object: target });
    set({ mode: "telescope", telescopeObject: target });
  },

  /** ESC / 返回：逐级退出 */
  back: () => {
    const s = get();
    if (s.mode === "telescope") {
      set({ mode: "object", telescopeObject: null });
    } else if (s.mode === "object") {
      set({
        mode: s.focusedConstellation ? "constellation" : "sky",
        targetObject: null,
      });
    } else if (s.mode === "constellation") {
      set({ mode: "sky", focusedConstellation: null });
    }
  },

  closeAll: () =>
    set({
      mode: "sky",
      focusedConstellation: null,
      hoveredConstellation: null,
      targetObject: null,
      telescopeObject: null,
    }),
}));
