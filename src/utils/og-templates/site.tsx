import { readFile } from "node:fs/promises";
import satori from "satori";

export default async () => {
  const font = await readFile("public/fonts/noto-serif-sc-display-0.ttf");
  return satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#080f14",
        color: "#e8e4da",
        display: "flex",
        padding: "60px",
        flexDirection: "column",
        fontFamily: "Coolbat Serif",
      }}
    >
      <svg
        width="630"
        height="630"
        viewBox="0 0 630 630"
        style={{ position: "absolute", right: "-30px", top: "-60px" }}
      >
        <circle
          cx="315"
          cy="315"
          r="288"
          fill="none"
          stroke="#4b4b40"
          strokeWidth="1"
        />
        <circle
          cx="315"
          cy="315"
          r="270"
          fill="none"
          stroke="#4b4b40"
          strokeWidth="1"
        />
        <circle
          cx="315"
          cy="315"
          r="212"
          fill="none"
          stroke="#4b4b40"
          strokeWidth="1"
        />
        <circle
          cx="315"
          cy="315"
          r="138"
          fill="none"
          stroke="#4b4b40"
          strokeWidth="1"
        />
        <path
          d="M315 10V620M10 315H620M122 136 505 521"
          fill="none"
          stroke="#4b4b40"
          strokeWidth="1"
        />
        <path
          d="m180 189 70 31 35-62 58 19 29 66 82-24 58 72-25 69-66 24-24 63"
          fill="none"
          stroke="#6f7067"
          strokeWidth="1"
        />
        {[
          { x: 180, y: 189 },
          { x: 285, y: 158 },
          { x: 454, y: 219 },
          { x: 421, y: 384 },
          { x: 315, y: 315 },
        ].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r="4" fill="#d4bd92" />
        ))}
      </svg>
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 1 }}>
        coolbat.xyz
      </div>
      <div style={{ display: "flex", marginTop: 100, fontSize: 67 }}>
        Coolbat · 观星造物
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 30,
          fontSize: 24,
          color: "#b9a47b",
        }}
      >
        独立开发 · 自由探索 · 长期创造
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          fontSize: 18,
          color: "#a9ada9",
        }}
      >
        AI · Interaction · Culture
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Coolbat Serif", data: font, weight: 400, style: "normal" },
      ],
    }
  );
};
