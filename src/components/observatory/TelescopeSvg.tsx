import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useObservatoryStore } from "./store";
import { skyApi } from "./skyApi";
import { CONSTELLATIONS_BY_ID } from "@data/observatory/constellations";
import { OBJECTS_BY_ID } from "@data/observatory/objects";

/** 天体的数据坐标（与 SkyCanvas 内的解析逻辑一致） */
function objectDataPos(objectId: string) {
  const obj = OBJECTS_BY_ID.get(objectId);
  if (!obj) return null;
  if (obj.position) return obj.position;
  const c = CONSTELLATIONS_BY_ID.get(obj.constellationId);
  if (!c) return null;
  const star = c.stars.find(st => st.objectId === objectId);
  if (!star) return null;
  return { x: c.position.x + star.x, y: c.position.y + star.y };
}

/**
 * 左下角的地平线望远镜（PRD §18）。
 * 选中目标时镜筒抬起并转向目标在屏幕上的方位。
 */
export default function TelescopeSvg() {
  const tubeRef = useRef<HTMLDivElement>(null);
  const targetObject = useObservatoryStore(s => s.targetObject);
  const mode = useObservatoryStore(s => s.mode);
  const reducedMotion = useObservatoryStore(s => s.reducedMotion);

  useEffect(() => {
    const tube = tubeRef.current;
    if (!tube) return;
    if (!targetObject || mode === "telescope") {
      gsap.to(tube, {
        rotate: -38,
        duration: reducedMotion ? 0 : 1,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      return;
    }
    const pos = objectDataPos(targetObject);
    const api = skyApi.current;
    if (!pos || !api) return;

    // 相机飞行期间持续更新指向
    const update = () => {
      const screen = api.project(pos.x, pos.y);
      const rect = tube.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height * 0.55;
      let angle: number;
      if (screen) {
        angle =
          (Math.atan2(screen.y - originY, screen.x - originX) * 180) / Math.PI +
          90;
      } else {
        angle = -38;
      }
      // 限制在合理仰角范围内
      angle = Math.max(-82, Math.min(-8, angle));
      gsap.to(tube, {
        rotate: angle,
        duration: reducedMotion ? 0 : 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    update();
    return api.onFrame(update);
  }, [targetObject, mode, reducedMotion]);

  return (
    <div
      className={`telescope ${mode === "telescope" ? "is-hidden" : ""}`}
      aria-hidden="true"
    >
      <div ref={tubeRef} className="telescope-tube">
        <svg viewBox="0 0 60 90" width="42" height="63">
          {/* 镜筒 */}
          <rect
            x="18"
            y="6"
            width="24"
            height="58"
            rx="3"
            className="tl-body"
          />
          {/* 物镜端 */}
          <rect
            x="14"
            y="2"
            width="32"
            height="10"
            rx="3"
            className="tl-body"
          />
          {/* 目镜 */}
          <rect
            x="25"
            y="64"
            width="10"
            height="14"
            rx="2"
            className="tl-body"
          />
          <circle cx="30" cy="7" r="3.5" className="tl-lens" />
        </svg>
      </div>
      <svg
        viewBox="0 0 90 60"
        width="64"
        height="43"
        className="telescope-mount"
      >
        {/* 三脚架 */}
        <path d="M45 8 L20 58 M45 8 L70 58 M45 8 L45 58" className="tl-leg" />
        <circle cx="45" cy="10" r="6" className="tl-body-fill" />
      </svg>
      <div className="telescope-ground" />
    </div>
  );
}
