import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useObservatoryStore } from "./store";
import { skyApi } from "./skyApi";
import { CONSTELLATIONS } from "@data/observatory/constellations";
import { SEASONS_BY_ID } from "@data/observatory/seasons";
import { CELESTIAL_OBJECTS, OBJECTS_BY_ID } from "@data/observatory/objects";
import type { SeasonId } from "@data/observatory/types";
import FallbackSky from "./FallbackSky";

/** 数据坐标（x 右 y 下，约 1200×760）→ Three 世界坐标（y 向上，原点居中） */
const worldX = (x: number) => x - 600;
const worldY = (y: number) => -(y - 380);

const ACCENT = new THREE.Color(185 / 255, 164 / 255, 123 / 255);
const STAR_WARM = new THREE.Color(0.91, 0.89, 0.85);
const STAR_GOLD = new THREE.Color(0.95, 0.88, 0.7);

/** 个别恒星的真实颜色倾向 */
const STAR_TINTS: Record<string, THREE.Color> = {
  antares: new THREE.Color(0.96, 0.6, 0.42),
  betelgeuse: new THREE.Color(0.96, 0.64, 0.46),
  aldebaran: new THREE.Color(0.96, 0.72, 0.5),
  arcturus: new THREE.Color(0.98, 0.8, 0.56),
  capella: new THREE.Color(0.98, 0.88, 0.64),
  enif: new THREE.Color(0.97, 0.76, 0.55),
  mirach: new THREE.Color(0.96, 0.7, 0.52),
  sirius: new THREE.Color(0.82, 0.9, 1),
  vega: new THREE.Color(0.8, 0.87, 1),
  rigel: new THREE.Color(0.78, 0.86, 1),
  spica: new THREE.Color(0.8, 0.87, 1),
  deneb: new THREE.Color(0.86, 0.9, 1),
  polaris: new THREE.Color(0.98, 0.9, 0.68),
};

interface ConstellationHandle {
  id: string;
  season: SeasonId | "circumpolar";
  group: THREE.Group;
  lineMaterial: THREE.LineBasicMaterial;
  lineGeometry: THREE.BufferGeometry;
  starMaterial: THREE.ShaderMaterial;
  /** 数据坐标系中心与覆盖半径（命中测试用） */
  center: { x: number; y: number };
  radius: number;
  reveal: { value: number };
  dim: { value: number };
}

const VERT = `
attribute float aSize;
attribute float aPhase;
attribute float aSpike;
attribute vec3 aColor;
uniform float uTime;
uniform float uOpacity;
uniform float uTwinkle;
varying float vAlpha;
varying vec3 vColor;
varying float vSpike;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (0.35 + aPhase * 0.6) + aPhase * 6.2831));
  vAlpha = uOpacity * tw;
  vColor = aColor;
  vSpike = aSpike;
  gl_PointSize = aSize * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
varying float vAlpha;
varying vec3 vColor;
varying float vSpike;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  // 亮核 + 柔和光晕
  float core = smoothstep(0.32, 0.0, d);
  float halo = pow(smoothstep(1.0, 0.0, d), 2.8) * 0.55;
  float a = core + halo;
  // 亮星衍射十字光芒
  if (vSpike > 0.01) {
    float sx = pow(max(0.0, 1.0 - abs(c.x) * 2.0), 28.0);
    float sy = pow(max(0.0, 1.0 - abs(c.y) * 2.0), 28.0);
    a += (sx + sy) * smoothstep(1.0, 0.15, d) * vSpike * 0.5;
  }
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor, min(a, 1.0) * vAlpha);
}`;

function makePointsMaterial(opacity: number, twinkle: number) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uTwinkle: { value: twinkle },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function makePoints(
  positions: THREE.Vector3[],
  sizes: number[],
  colors: THREE.Color[],
  material: THREE.ShaderMaterial,
  spikes?: number[]
) {
  const geo = new THREE.BufferGeometry();
  geo.setFromPoints(positions);
  geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute(
    "aPhase",
    new THREE.Float32BufferAttribute(
      positions.map((_, i) => (i * 0.6180339887) % 1),
      1
    )
  );
  geo.setAttribute(
    "aColor",
    new THREE.Float32BufferAttribute(
      colors.flatMap(c => [c.r, c.g, c.b]),
      3
    )
  );
  geo.setAttribute(
    "aSpike",
    new THREE.Float32BufferAttribute(
      spikes ?? positions.map(() => 0),
      1
    )
  );
  return new THREE.Points(geo, material);
}

/** 相机默认高度（移动端更远一些以容纳纵向视野） */
const defaultZ = () => (window.innerWidth < 768 ? 520 : 340);

export default function SkyCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const store = useObservatoryStore;
    const lowPower = store.getState().lowPower;
    const reducedMotion = store.getState().reducedMotion;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2)
    );
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      host.clientWidth / host.clientHeight,
      1,
      4000
    );

    // 相机目标：在天空平面上的注视点与距离
    const seasonCenter = (id: SeasonId) => {
      const cfg = SEASONS_BY_ID.get(id)!;
      let sx = 0;
      let sy = 0;
      for (const cid of cfg.constellations) {
        const c = CONSTELLATIONS.find(k => k.id === cid)!;
        sx += c.position.x;
        sy += c.position.y;
      }
      const n = cfg.constellations.length;
      return { x: sx / n, y: sy / n };
    };
    const center0 = seasonCenter(store.getState().season);
    const camTarget = {
      x: worldX(center0.x),
      y: worldY(center0.y),
      z: defaultZ(),
    };
    camera.position.set(camTarget.x, camTarget.y, camTarget.z);
    camera.lookAt(camTarget.x, camTarget.y, 0);
    // 入场：镜头从远处落下，延续首页入口的放大动势
    if (!reducedMotion) {
      gsap.from(camTarget, {
        z: camTarget.z * 1.55,
        duration: 1.7,
        ease: "power2.out",
      });
    }

    const shaderMaterials: THREE.ShaderMaterial[] = [];
    const track = (m: THREE.ShaderMaterial) => {
      shaderMaterials.push(m);
      return m;
    };

    // ---------- 背景星野（纵深分布，拖动/缩放时产生真实视差） ----------
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const bgCount = lowPower ? 1200 : 4000;
    const bgPos: THREE.Vector3[] = [];
    const bgSizes: number[] = [];
    const bgColors: THREE.Color[] = [];
    for (let i = 0; i < bgCount; i++) {
      // 深度平方分布：近处稀疏、远处稠密，模拟真实星空
      const depth = -18 - rand() * rand() * 400;
      // 视野随深度扩大，保证远处也铺满画面
      const spread = 1 + (-depth / 340) * 0.9;
      bgPos.push(
        new THREE.Vector3(
          (rand() - 0.5) * 2400 * spread,
          (rand() - 0.5) * 1500 * spread,
          depth
        )
      );
      // 星等分布：大量暗星，极少亮星（尺寸已按深度衰减补偿）
      const mag = rand();
      bgSizes.push(
        mag < 0.75
          ? 3.5 + rand() * 4
          : mag < 0.95
            ? 8 + rand() * 5
            : 14 + rand() * 7
      );
      const c = STAR_WARM.clone();
      c.multiplyScalar(0.6 + rand() * 0.5);
      // 真实恒星色温：少量蓝白，少量橙红
      const tintRoll = rand();
      if (tintRoll > 0.92) c.lerp(new THREE.Color(0.68, 0.78, 1), 0.5);
      else if (tintRoll < 0.08) c.lerp(new THREE.Color(1, 0.72, 0.5), 0.45);
      // 远处偏蓝偏暗（距离感）
      c.lerp(new THREE.Color(0.62, 0.7, 0.9), Math.min(0.45, -depth / 900));
      bgColors.push(c);
    }
    const bgMat = track(makePointsMaterial(1, reducedMotion ? 0 : 0.28));
    scene.add(makePoints(bgPos, bgSizes, bgColors, bgMat));

    // ---------- 银河：尘埃云带 + 密集星点 ----------
    const mwMat = track(makePointsMaterial(0.45, 0));
    const mwCloudMat = track(makePointsMaterial(0.09, 0));
    const mwCount = lowPower ? 450 : 1600;
    const mwCloudCount = lowPower ? 160 : 500;
    const mwPos: THREE.Vector3[] = [];
    const mwSizes: number[] = [];
    const mwColors: THREE.Color[] = [];
    const mwCloudPos: THREE.Vector3[] = [];
    const mwCloudSizes: number[] = [];
    const mwCloudColors: THREE.Color[] = [];
    const mwColor = new THREE.Color(0.62, 0.68, 0.82);
    const mwWarm = new THREE.Color(0.82, 0.7, 0.55);
    const mwCloudBlue = new THREE.Color(0.5, 0.58, 0.78);
    const mwCloudViolet = new THREE.Color(0.56, 0.46, 0.68);
    const buildMilkyWay = (tiltDeg: number) => {
      mwPos.length = 0;
      mwSizes.length = 0;
      mwColors.length = 0;
      mwCloudPos.length = 0;
      mwCloudSizes.length = 0;
      mwCloudColors.length = 0;
      const t = (tiltDeg * Math.PI) / 180;
      const dx = Math.cos(t);
      const dy = Math.sin(t);
      const gauss = () => (rand() + rand() + rand() - 1.5) * 2;
      for (let i = 0; i < mwCount; i++) {
        const s = (rand() - 0.5) * 2000;
        const off = gauss() * 110;
        mwPos.push(
          new THREE.Vector3(
            dx * s - dy * off,
            dy * s + dx * off - 20,
            -10 - rand() * 14
          )
        );
        mwSizes.push(3.5 + rand() * 7);
        // 靠近银心（带中央）偏暖
        const warmth = Math.max(0, 1 - Math.abs(s) / 700);
        const c = mwColor.clone().lerp(mwWarm, warmth * 0.6);
        mwColors.push(c.multiplyScalar(0.5 + rand() * 0.5));
      }
      // 云带：浓密亮核 + 外围 diffuse 晕 + 少量彩色星云团块
      for (let i = 0; i < mwCloudCount; i++) {
        const s = (rand() - 0.5) * 1900;
        const kind = rand();
        const off = gauss() * (kind < 0.6 ? 55 : kind < 0.9 ? 110 : 160);
        mwCloudPos.push(
          new THREE.Vector3(
            dx * s - dy * off,
            dy * s + dx * off - 20,
            -16 - rand() * 12
          )
        );
        mwCloudSizes.push(60 + rand() * 130);
        const warmth = Math.max(0, 1 - Math.abs(s) / 700);
        if (kind < 0.9) {
          const base = rand() > 0.5 ? mwCloudBlue : mwCloudViolet;
          mwCloudColors.push(
            base
              .clone()
              .lerp(mwWarm, warmth * 0.5)
              .multiplyScalar(0.6 + rand() * 0.4)
          );
        } else {
          // 彩色星云团块（发射星云感）：品红/青蓝，压暗避免显形为圆斑
          const hue =
            rand() > 0.5
              ? new THREE.Color(0.72, 0.4, 0.52)
              : new THREE.Color(0.4, 0.6, 0.72);
          mwCloudPos[mwCloudPos.length - 1].z = -20 - rand() * 8;
          mwCloudSizes[mwCloudSizes.length - 1] = 180 + rand() * 200;
          mwCloudColors.push(hue.multiplyScalar(0.4 + rand() * 0.3));
        }
      }
    };
    buildMilkyWay(SEASONS_BY_ID.get(store.getState().season)!.galaxyTilt);
    let mwPoints = makePoints(mwPos, mwSizes, mwColors, mwMat);
    let mwClouds = makePoints(
      mwCloudPos,
      mwCloudSizes,
      mwCloudColors,
      mwCloudMat
    );
    scene.add(mwClouds);
    scene.add(mwPoints);
    const galaxyIntensity = SEASONS_BY_ID.get(store.getState().season)!
      .galaxyIntensity;
    mwMat.uniforms.uOpacity.value = 0.45 * galaxyIntensity;
    mwCloudMat.uniforms.uOpacity.value = 0.09 * galaxyIntensity;

    // ---------- 星座 ----------
    const handles = new Map<string, ConstellationHandle>();
    const dsoGroups = new Map<string, THREE.Group>();

    const buildConstellation = (cid: string) => {
      const c = CONSTELLATIONS.find(k => k.id === cid)!;
      const group = new THREE.Group();

      const positions: THREE.Vector3[] = [];
      const sizes: number[] = [];
      const colors: THREE.Color[] = [];
      for (const star of c.stars) {
        positions.push(
          new THREE.Vector3(
            worldX(c.position.x + star.x),
            worldY(c.position.y + star.y),
            0
          )
        );
        sizes.push(star.mag === 1 ? 30 : star.mag === 2 ? 20 : 11);
        const tint = star.objectId ? STAR_TINTS[star.objectId] : undefined;
        colors.push(
          tint ? tint.clone() : (star.mag === 1 ? STAR_GOLD : STAR_WARM).clone()
        );
      }
      const starMat = track(makePointsMaterial(1, reducedMotion ? 0 : 0.15));
      const starPoints = makePoints(
        positions,
        sizes,
        colors,
        starMat,
        c.stars.map(s => (s.mag === 1 ? 1 : s.mag === 2 ? 0.45 : 0))
      );
      group.add(starPoints);

      const lineVerts: number[] = [];
      for (const [a, b] of c.lines) {
        const pa = positions[a];
        const pb = positions[b];
        lineVerts.push(pa.x, pa.y, 0, pb.x, pb.y, 0);
      }
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineVerts, 3)
      );
      const lineMaterial = new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      lines.geometry.setDrawRange(0, 0);
      group.add(lines);

      // 覆盖半径：最远恒星距离 + 余量
      let radius = 0;
      for (const star of c.stars) {
        radius = Math.max(radius, Math.hypot(star.x, star.y));
      }
      const handle: ConstellationHandle = {
        id: c.id,
        season: c.season,
        group,
        lineMaterial,
        lineGeometry,
        starMaterial: starMat,
        center: { x: c.position.x, y: c.position.y },
        radius: radius + 26,
        reveal: { value: 0 },
        dim: { value: 1 },
      };
      handles.set(c.id, handle);
      return handle;
    };

    for (const c of CONSTELLATIONS) {
      const h = buildConstellation(c.id);
      h.group.visible = false;
      scene.add(h.group);
    }

    // ---------- 深空天体标记 ----------
    const dsoRingGeo = new THREE.RingGeometry(5.5, 6.8, 40);
    for (const obj of CELESTIAL_OBJECTS) {
      if (!obj.position || obj.type === "star") continue;
      const g = new THREE.Group();
      g.position.set(worldX(obj.position.x), worldY(obj.position.y), 0);
      const ring = new THREE.Mesh(
        dsoRingGeo,
        new THREE.MeshBasicMaterial({
          color: ACCENT,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        })
      );
      g.add(ring);
      const glowMat = track(makePointsMaterial(1, reducedMotion ? 0 : 0.2));
      const glow = makePoints(
        [new THREE.Vector3(0, 0, 0)],
        [obj.type === "galaxy" ? 26 : 19],
        [new THREE.Color(0.98, 0.93, 0.8)],
        glowMat
      );
      g.add(glow);
      g.visible = false;
      scene.add(g);
      dsoGroups.set(obj.id, g);
    }

    // ---------- 目标脉冲标记 ----------
    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(8, 9.4, 48),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.98, 0.93, 0.8),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    );
    scene.add(targetRing);

    // ---------- 季节可见性 ----------
    const applySeasonVisibility = (season: SeasonId) => {
      for (const h of handles.values()) {
        const on = h.season === season || h.season === "circumpolar";
        h.group.visible = on;
        if (on) {
          h.reveal.value = 0;
          h.lineMaterial.opacity = 0;
          h.lineGeometry.setDrawRange(0, 0);
        }
      }
      for (const [id, g] of dsoGroups) {
        const obj = OBJECTS_BY_ID.get(id)!;
        g.visible = obj.season === season;
      }
    };
    applySeasonVisibility(store.getState().season);

    // ---------- skyApi ----------
    const frameCbs = new Set<() => void>();
    const flyTo = (x: number, y: number, z?: number) => {
      gsap.to(camTarget, {
        x: worldX(x),
        y: worldY(y),
        z: z ?? camTarget.z,
        duration: reducedMotion ? 0 : 1,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    };
    const resetView = () => {
      const c = seasonCenter(store.getState().season);
      flyTo(c.x, c.y, defaultZ());
    };
    const project = (x: number, y: number) => {
      const v = new THREE.Vector3(worldX(x), worldY(y), 0).project(camera);
      if (v.z > 1) return null;
      return {
        x: ((v.x + 1) / 2) * host.clientWidth,
        y: ((1 - v.y) / 2) * host.clientHeight,
      };
    };
    skyApi.current = {
      flyTo,
      resetView,
      project,
      onFrame: cb => {
        frameCbs.add(cb);
        return () => frameCbs.delete(cb);
      },
    };
    if (import.meta.env.DEV) {
      (window as unknown as { __obs: object }).__obs = {
        scene,
        renderer,
        camera,
        handles,
        store,
        project,
      };
    }

    // ---------- 星座 Hover / 聚焦表现 ----------
    const applyDim = () => {
      for (const h of handles.values()) {
        h.starMaterial.uniforms.uOpacity.value = h.dim.value;
        h.lineMaterial.opacity = h.reveal.value * 0.75 * h.dim.value;
      }
    };
    const setLineReveal = (h: ConstellationHandle, on: boolean) => {
      const total = h.lineGeometry.getAttribute("position").count;
      gsap.to(h.reveal, {
        value: on ? 1 : 0,
        duration: reducedMotion ? 0 : on ? 0.5 : 0.3,
        ease: "power1.out",
        overwrite: "auto",
        onUpdate: () => {
          h.lineGeometry.setDrawRange(0, Math.round(h.reveal.value * total));
          applyDim();
        },
      });
    };

    let prevHover: string | null = null;
    let prevFocus: string | null = null;

    const unsubStore = store.subscribe((s, prev) => {
      // Hover：逐段绘制连线
      if (s.hoveredConstellation !== prevHover) {
        if (prevHover && prevHover !== s.focusedConstellation) {
          const h = handles.get(prevHover);
          if (h) setLineReveal(h, false);
        }
        if (s.hoveredConstellation) {
          const h = handles.get(s.hoveredConstellation);
          if (h) setLineReveal(h, true);
        }
        prevHover = s.hoveredConstellation;
      }
      // 聚焦：连线全亮 + 其余星座压暗 + 相机移动
      if (s.focusedConstellation !== prevFocus) {
        if (prevFocus) {
          const old = handles.get(prevFocus);
          if (old && old.id !== s.hoveredConstellation)
            setLineReveal(old, false);
        }
        for (const h of handles.values()) {
          gsap.to(h.dim, {
            value:
              s.focusedConstellation && h.id !== s.focusedConstellation
                ? 0.3
                : 1,
            duration: reducedMotion ? 0 : 0.6,
            overwrite: "auto",
            onUpdate: applyDim,
          });
        }
        if (s.focusedConstellation) {
          const h = handles.get(s.focusedConstellation)!;
          setLineReveal(h, true);
          flyTo(h.center.x, h.center.y, 250);
        }
        prevFocus = s.focusedConstellation;
      }
      // 目标天体：相机靠近 + 脉冲标记
      if (s.targetObject !== prev.targetObject) {
        const pos = s.targetObject ? objectDataPos(s.targetObject) : null;
        if (pos) {
          targetRing.position.set(worldX(pos.x), worldY(pos.y), 0.5);
          gsap.to(targetRing.material, {
            opacity: 0.9,
            duration: 0.4,
            overwrite: "auto",
          });
          flyTo(pos.x, pos.y, 200);
        } else {
          gsap.to(targetRing.material, {
            opacity: 0,
            duration: 0.3,
            overwrite: "auto",
          });
        }
      }
      // 季节切换：旧星座下沉淡出，新星座进入
      if (s.season !== prev.season) {
        const oldSeason = prev.season;
        const cfg = SEASONS_BY_ID.get(s.season)!;
        const timeline = gsap.timeline({
          onComplete: () => store.getState().endSeasonChange(),
        });
        for (const h of handles.values()) {
          if (h.season === oldSeason) {
            timeline.to(
              h.group.position,
              {
                y: reducedMotion ? 0 : -70,
                duration: reducedMotion ? 0 : 1.2,
                ease: "power2.in",
              },
              0
            );
            timeline.to(
              h.dim,
              {
                value: 0,
                duration: reducedMotion ? 0 : 1.0,
                onUpdate: applyDim,
              },
              0
            );
          }
        }
        for (const [id, g] of dsoGroups) {
          if (OBJECTS_BY_ID.get(id)!.season === oldSeason) {
            timeline.to(g.scale, { x: 0.6, y: 0.6, duration: 0.9 }, 0);
          }
        }
        timeline.call(
          () => {
            applySeasonVisibility(s.season);
            for (const h of handles.values()) {
              if (h.season === s.season) {
                h.group.position.y = reducedMotion ? 0 : 70;
              }
              gsap.to(h.dim, {
                value: 1,
                duration: reducedMotion ? 0 : 1.1,
                onUpdate: applyDim,
              });
            }
            for (const g of dsoGroups.values()) {
              g.scale.set(1, 1, 1);
            }
            gsap.to(mwMat.uniforms.uOpacity, {
              value: 0.45 * cfg.galaxyIntensity,
              duration: reducedMotion ? 0 : 1.4,
            });
            gsap.to(mwCloudMat.uniforms.uOpacity, {
              value: 0.09 * cfg.galaxyIntensity,
              duration: reducedMotion ? 0 : 1.4,
            });
          },
          undefined,
          reducedMotion ? 0 : 1.0
        );
        timeline.call(
          () => {
            buildMilkyWay(cfg.galaxyTilt);
            scene.remove(mwPoints);
            mwPoints.geometry.dispose();
            mwPoints = makePoints(mwPos, mwSizes, mwColors, mwMat);
            scene.add(mwPoints);
            scene.remove(mwClouds);
            mwClouds.geometry.dispose();
            mwClouds = makePoints(
              mwCloudPos,
              mwCloudSizes,
              mwCloudColors,
              mwCloudMat
            );
            scene.add(mwClouds);
          },
          undefined,
          reducedMotion ? 0 : 1.1
        );
        for (const h of handles.values()) {
          if (h.season === s.season) {
            timeline.to(
              h.group.position,
              { y: 0, duration: reducedMotion ? 0 : 1.3, ease: "power2.out" },
              reducedMotion ? 0 : 1.1
            );
          }
        }
        timeline.call(() => resetView(), undefined, 0);
      }
      // 回到全景
      if (s.mode === "sky" && prev.mode !== "sky" && !s.targetObject) {
        resetView();
      }
    });

    /** 天体的数据坐标（x 右 y 下）：深空天体直接读，恒星到所属星座里找 */
    const objectDataPos = (objectId: string) => {
      const obj = OBJECTS_BY_ID.get(objectId);
      if (!obj) return null;
      if (obj.position) return obj.position;
      const c = CONSTELLATIONS.find(k => k.id === obj.constellationId);
      if (!c) return null;
      const star = c.stars.find(st => st.objectId === objectId);
      if (!star) return null;
      return { x: c.position.x + star.x, y: c.position.y + star.y };
    };

    // ---------- 指针交互 ----------
    const pointers = new Map<number, { x: number; y: number }>();
    let dragStart: { x: number; y: number } | null = null;
    let dragMoved = 0;
    let pinchDist = 0;
    const velocity = { x: 0, y: 0 };
    const parallax = { x: 0, y: 0 };

    const clampTarget = () => {
      camTarget.x = THREE.MathUtils.clamp(camTarget.x, -560, 560);
      camTarget.y = THREE.MathUtils.clamp(camTarget.y, -360, 360);
      camTarget.z = THREE.MathUtils.clamp(camTarget.z, 170, 620);
    };

    const hitTest = (px: number, py: number) => {
      const season = store.getState().season;
      // 优先：可点击天体（主要恒星 + 深空目标）
      let bestObj: { id: string; d: number } | null = null;
      for (const obj of CELESTIAL_OBJECTS) {
        if (obj.season !== season && obj.season !== "circumpolar") continue;
        const data = objectDataPos(obj.id);
        if (!data) continue;
        const screen = project(data.x, data.y);
        if (!screen) continue;
        const d = Math.hypot(screen.x - px, screen.y - py);
        const threshold = obj.type === "star" ? 24 : 30;
        if (d < threshold && (!bestObj || d < bestObj.d)) {
          bestObj = { id: obj.id, d };
        }
      }
      if (bestObj) return { kind: "object" as const, id: bestObj.id };
      // 其次：星座（靠近任意成员星）
      let bestCon: { id: string; d: number } | null = null;
      for (const c of CONSTELLATIONS) {
        if (c.season !== season && c.season !== "circumpolar") continue;
        let nearest = Infinity;
        for (const star of c.stars) {
          const screen = project(c.position.x + star.x, c.position.y + star.y);
          if (!screen) continue;
          nearest = Math.min(nearest, Math.hypot(screen.x - px, screen.y - py));
        }
        if (nearest < 36 && (!bestCon || nearest < bestCon.d)) {
          bestCon = { id: c.id, d: nearest };
        }
      }
      return bestCon
        ? { kind: "constellation" as const, id: bestCon.id }
        : null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // 视差
      if (!reducedMotion && pointers.size === 0) {
        parallax.x = ((px / rect.width) * 2 - 1) * 9;
        parallax.y = -((py / rect.height) * 2 - 1) * 9;
      }

      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: px, y: py });
      }
      if (pointers.size === 1 && dragStart) {
        const dx = px - dragStart.x;
        const dy = py - dragStart.y;
        dragStart = { x: px, y: py };
        dragMoved += Math.abs(dx) + Math.abs(dy);
        const worldPerPx =
          (2 * camTarget.z * Math.tan((camera.fov * Math.PI) / 360)) /
          rect.height;
        camTarget.x -= dx * worldPerPx;
        camTarget.y += dy * worldPerPx;
        velocity.x = -dx * worldPerPx;
        velocity.y = dy * worldPerPx;
        clampTarget();
        return;
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0) {
          camTarget.z *= pinchDist / dist;
          clampTarget();
        }
        pinchDist = dist;
        return;
      }

      // Hover 命中
      const s = store.getState();
      if (s.mode !== "sky") return;
      const hit = hitTest(px, py);
      host.style.cursor = hit ? "pointer" : "grab";
      if (hit?.kind === "constellation") {
        s.hoverConstellation(hit.id);
      } else if (s.hoveredConstellation) {
        s.hoverConstellation(null);
      }
      // 天体 tooltip
      const tip = tipRef.current;
      if (tip) {
        if (hit?.kind === "object") {
          const obj = OBJECTS_BY_ID.get(hit.id)!;
          tip.textContent = obj.catalogName
            ? `${obj.catalogName} · ${obj.nameZh}`
            : `${obj.nameZh} · ${obj.nameEn}`;
          tip.style.transform = `translate(${px + 14}px, ${py - 8}px)`;
          tip.style.opacity = "1";
        } else {
          tip.style.opacity = "0";
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      host.setPointerCapture(e.pointerId);
      const rect = host.getBoundingClientRect();
      pointers.set(e.pointerId, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      if (pointers.size === 1) {
        dragStart = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        dragMoved = 0;
        velocity.x = 0;
        velocity.y = 0;
      }
      host.style.cursor = "grabbing";
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinchDist = 0;
      host.style.cursor = "grab";
      if (pointers.size === 0) dragStart = null;
      if (dragMoved < 8 && e.type === "pointerup") {
        const rect = host.getBoundingClientRect();
        const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        const s = store.getState();
        if (hit?.kind === "object") {
          s.focusObject(hit.id);
        } else if (hit?.kind === "constellation") {
          s.openConstellation(hit.id);
        } else if (s.mode !== "sky") {
          s.back();
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camTarget.z *= 1 + e.deltaY * 0.0011;
      clampTarget();
    };

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("wheel", onWheel, { passive: false });
    host.style.cursor = "grab";

    // ---------- 渲染循环 ----------
    const t0 = performance.now();
    let raf = 0;

    // ---------- 流星（偶发划落，禁用动效/低功耗时不启用） ----------
    const METEOR_SEGMENTS = 96;
    const meteorGeo = new THREE.BufferGeometry();
    meteorGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(METEOR_SEGMENTS * 3), 3)
    );
    // 头部亮、尾部渐隐（加法混合下黑色即不可见）
    const meteorColors: number[] = [];
    for (let i = 0; i < METEOR_SEGMENTS; i++) {
      const f = i / (METEOR_SEGMENTS - 1);
      const b = Math.pow(1 - f, 1.6);
      meteorColors.push(b, b * 0.97, b * 0.9);
    }
    meteorGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(meteorColors, 3)
    );
    const meteorMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const meteorLine = new THREE.Line(meteorGeo, meteorMat);
    meteorLine.frustumCulled = false;
    meteorLine.visible = false;
    scene.add(meteorLine);
    const meteor = {
      active: false,
      nextAt: 6 + Math.random() * 8,
      progress: 0,
      sx: 0,
      sy: 0,
      dx: 0,
      dy: 0,
      len: 0,
    };
    const launchMeteor = () => {
      // 从当前视野上半部随机位置斜向划落
      meteor.sx = camTarget.x + (Math.random() - 0.5) * 900;
      meteor.sy = camTarget.y + 120 + Math.random() * 260;
      const ang = Math.PI * (1.1 + Math.random() * 0.3);
      meteor.dx = Math.cos(ang) * (Math.random() > 0.5 ? 1 : -1);
      meteor.dy = Math.sin(ang);
      meteor.len = 260 + Math.random() * 240;
      meteor.progress = 0;
      meteor.active = true;
      meteorLine.visible = true;
      gsap.to(meteor, {
        progress: 1,
        duration: 0.7 + Math.random() * 0.5,
        ease: "power1.in",
      });
      gsap.to(meteorMat, {
        opacity: 0.85,
        duration: 0.18,
        ease: "power1.out",
      });
      gsap.to(meteorMat, {
        opacity: 0,
        duration: 0.55,
        delay: 0.5,
        ease: "power2.in",
        onComplete: () => {
          meteor.active = false;
          meteorLine.visible = false;
          meteor.nextAt =
            (performance.now() - t0) / 1000 + 7 + Math.random() * 9;
        },
      });
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;
      for (const m of shaderMaterials) m.uniforms.uTime.value = t;

      // 流星调度与推进
      if (!reducedMotion && !lowPower && !meteor.active && t > meteor.nextAt) {
        launchMeteor();
      }
      if (meteor.active) {
        const posAttr = meteorGeo.getAttribute(
          "position"
        ) as THREE.BufferAttribute;
        const head = meteor.progress * meteor.len;
        const tailLen = Math.min(150, head);
        for (let i = 0; i < METEOR_SEGMENTS; i++) {
          const f = i / (METEOR_SEGMENTS - 1);
          const d = head - f * tailLen;
          posAttr.setXYZ(i, meteor.sx + meteor.dx * d, meteor.sy + meteor.dy * d, -8);
        }
        posAttr.needsUpdate = true;
      }

      // 惯性
      if (
        pointers.size === 0 &&
        (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01)
      ) {
        camTarget.x += velocity.x;
        camTarget.y += velocity.y;
        velocity.x *= 0.92;
        velocity.y *= 0.92;
        clampTarget();
      }

      // 相机缓动 + 视差
      const lerpF = reducedMotion ? 1 : 0.075;
      camera.position.x +=
        (camTarget.x + parallax.x - camera.position.x) * lerpF;
      camera.position.y +=
        (camTarget.y + parallax.y - camera.position.y) * lerpF;
      camera.position.z += (camTarget.z - camera.position.z) * lerpF;
      camera.lookAt(camera.position.x, camera.position.y, 0);

      // 目标脉冲
      if (targetRing.material.opacity > 0.01) {
        const pulse = 1 + Math.sin(t * 3) * 0.12;
        targetRing.scale.set(pulse, pulse, 1);
      }

      for (const cb of frameCbs) cb();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("wheel", onWheel);
      unsubStore();
      skyApi.current = null;
      gsap.globalTimeline.getChildren().forEach(tw => tw.kill());
      scene.traverse(obj => {
        if (
          obj instanceof THREE.Points ||
          obj instanceof THREE.LineSegments ||
          obj instanceof THREE.Line ||
          obj instanceof THREE.Mesh
        ) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach(x => x.dispose());
          else m.dispose();
        }
      });
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  if (webglFailed) return <FallbackSky />;

  return (
    <div
      ref={hostRef}
      className="sky-canvas"
      role="application"
      aria-label="交互式星空：拖动浏览，点击星座或亮星查看详情"
    >
      <div ref={tipRef} className="sky-tooltip" aria-hidden="true" />
    </div>
  );
}
