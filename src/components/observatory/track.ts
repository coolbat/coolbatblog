/** 极简埋点：有 dataLayer 就推事件，没有就打 debug 日志 */
export type ObservatoryEvent =
  | "observatory_enter"
  | "season_change"
  | "constellation_hover"
  | "constellation_open"
  | "object_open"
  | "telescope_enter"
  | "explore_further_click"
  | "observatory_exit";

export function track(
  event: ObservatoryEvent,
  data?: Record<string, string>
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: object[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...data });
  }
  if (import.meta.env.DEV) {
    console.debug(`[observatory] ${event}`, data ?? "");
  }
}
