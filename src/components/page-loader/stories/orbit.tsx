import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Orbit — loading as travel: you're on your way to the content.
 * short: a star twinkling.  medium: a ship circling its planet.
 * long: fly the ship — ↑ ↓ to dodge asteroids, pick up stars.
 * -------------------------------------------------------------------------- */

const W = 300;
const H = 190;
const SX = 52; // ship x

type Body = { x: number; y: number; r: number; star: boolean };

type OrbitState = {
  sy: number;
  vy: number;
  targetY: number | null;
  bodies: Body[];
  bgStars: { x: number; y: number; z: number }[];
  spawnIn: number;
  t: number;
  score: number;
  hitFlash: number;
  started: boolean;
};

function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.closePath();
}

function OrbitLong() {
  const s = useRef<OrbitState>({
    sy: H / 2,
    vy: 0,
    targetY: null,
    bodies: [],
    bgStars: Array.from({ length: 26 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: 0.3 + Math.random() * 0.7,
    })),
    spawnIn: 0.6,
    t: 0,
    score: 0,
    hitFlash: 0,
    started: false,
  }).current;

  const frame: FrameFn = (ctx, dt, c, keys) => {
    s.t += dt;
    s.hitFlash = Math.max(0, s.hitFlash - dt);

    // starfield always drifts — it's the idle scene too
    for (const st of s.bgStars) {
      st.x -= (26 + st.z * 60) * dt;
      if (st.x < -2) {
        st.x = W + 2;
        st.y = Math.random() * H;
      }
    }

    if (s.started) {
      const up = keys.has("ArrowUp") || keys.has("w");
      const down = keys.has("ArrowDown") || keys.has("s");
      if (up || down) s.targetY = null;
      if (s.targetY != null) {
        s.sy += (s.targetY - s.sy) * Math.min(1, dt * 10);
      } else {
        s.vy += ((down ? 1 : 0) - (up ? 1 : 0)) * 900 * dt;
        s.vy *= Math.exp(-3.2 * dt);
        s.sy += s.vy * dt;
      }
      s.sy = Math.max(16, Math.min(H - 16, s.sy));

      const speed = Math.min(260, 150 + s.t * 4);
      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        const star = Math.random() < 0.35;
        s.bodies.push({
          x: W + 20,
          y: 18 + Math.random() * (H - 36),
          r: star ? 6 : 7 + Math.random() * 6,
          star,
        });
        s.spawnIn = 0.55 + Math.random() * 0.5;
      }
      for (const b of s.bodies) b.x -= speed * dt;
      s.bodies = s.bodies.filter((b) => {
        if (b.x + b.r < -10) return false;
        const d = Math.hypot(b.x - SX, b.y - s.sy);
        if (d < b.r + 8) {
          if (b.star) s.score += 1;
          else {
            s.score = 0;
            s.hitFlash = 0.35;
          }
          return false;
        }
        return true;
      });
    }

    ctx.clearRect(0, 0, W, H);

    for (const st of s.bgStars) {
      ctx.globalAlpha = 0.15 + st.z * 0.35;
      ctx.fillStyle = c.soft;
      ctx.fillRect(st.x, st.y, 1.6 + st.z, 1.6 + st.z);
    }
    ctx.globalAlpha = 1;

    for (const b of s.bodies) {
      if (b.star) {
        ctx.fillStyle = c.accent;
        starPath(ctx, b.x, b.y, b.r);
        ctx.fill();
      } else {
        ctx.fillStyle = c.soft;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.surface;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.25, b.r * 0.25, 0, Math.PI * 2);
        ctx.arc(b.x + b.r * 0.35, b.y + b.r * 0.3, b.r * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // ship — idle float before start
    const sy = s.started ? s.sy : H / 2 + Math.sin(s.t * 1.6) * 6;
    const flame = 6 + Math.sin(s.t * 30) * 2.5;
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.moveTo(SX - 8, sy - 3);
    ctx.lineTo(SX - 8 - flame, sy);
    ctx.lineTo(SX - 8, sy + 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = s.hitFlash > 0 ? c.error : c.ink;
    ctx.beginPath();
    ctx.moveTo(SX + 10, sy);
    ctx.lineTo(SX - 8, sy - 7);
    ctx.lineTo(SX - 4, sy);
    ctx.lineTo(SX - 8, sy + 7);
    ctx.closePath();
    ctx.fill();

    ctx.font = CANVAS_FONT;
    ctx.textAlign = "right";
    ctx.fillStyle = c.soft;
    starPath(ctx, W - 38, 12.5, 4.5);
    ctx.fillStyle = c.accent;
    ctx.fill();
    ctx.fillStyle = c.soft;
    ctx.fillText(`${s.score}`, W - 10, 16);

    if (!s.started) {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText("click, then ↑ ↓ — stars up, rocks out", W / 2, H - 14);
    }
  };

  return (
    <GameStage
      width={W}
      height={H}
      frame={frame}
      onKey={(k) => {
        if (k === "ArrowUp" || k === "ArrowDown" || k === "w" || k === "s") s.started = true;
      }}
      onPointerMove={(_, y) => {
        if (s.started) s.targetY = y;
      }}
      onPointerDown={(_, y) => {
        s.started = true;
        s.targetY = y;
      }}
      hint="↑ ↓ or pointer to fly · collect stars, dodge asteroids"
      label="Orbit minigame — playable while the page loads"
    />
  );
}

function OrbitMedium() {
  return (
    <AmbientStage w={96} h={96} label="Loading — in transit">
      <path className="oreo-ld-twinkle" d="M14 20 Q14 24 18 24 Q14 24 14 28 Q14 24 10 24 Q14 24 14 20 Z" fill="var(--color-text-tertiary)" />
      <path className="oreo-ld-twinkle oreo-ld-twinkle-b" d="M80 66 Q80 70 84 70 Q80 70 80 74 Q80 70 76 70 Q80 70 80 66 Z" fill="var(--color-text-tertiary)" />
      <path className="oreo-ld-twinkle oreo-ld-twinkle-c" d="M76 14 Q76 17 79 17 Q76 17 76 20 Q76 17 73 17 Q76 17 76 14 Z" fill="var(--color-text-tertiary)" />
      <circle cx={48} cy={48} r={34} fill="none" stroke="var(--color-border-subtle)" strokeWidth={1.5} strokeDasharray="2 5" />
      <circle cx={48} cy={48} r={13} fill="var(--color-status-progress-subtle)" stroke="var(--color-text-primary)" strokeWidth={1.5} />
      <ellipse cx={48} cy={48} rx={20} ry={6} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={1.2} opacity={0.6} transform="rotate(-18 48 48)" />
      <g className="oreo-ld-orbit">
        <circle cx={48} cy={14} r={4} fill="var(--color-text-primary)" />
      </g>
    </AmbientStage>
  );
}

function OrbitShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <path
        className="oreo-ld-twinkle"
        d="M20 11 Q20 20 29 20 Q20 20 20 29 Q20 20 11 20 Q20 20 20 11 Z"
        fill="var(--color-status-progress)"
      />
      <path
        className="oreo-ld-twinkle oreo-ld-twinkle-b"
        d="M31 8 Q31 12 35 12 Q31 12 31 16 Q31 12 27 12 Q31 12 31 8 Z"
        fill="var(--color-text-tertiary)"
      />
      <path
        className="oreo-ld-twinkle oreo-ld-twinkle-c"
        d="M9 28 Q9 31 12 31 Q9 31 9 34 Q9 31 6 31 Q9 31 9 28 Z"
        fill="var(--color-text-tertiary)"
      />
    </AmbientStage>
  );
}

export const orbitStory: StoryDef = {
  name: "Orbit",
  Long: OrbitLong,
  Medium: OrbitMedium,
  Short: OrbitShort,
};
