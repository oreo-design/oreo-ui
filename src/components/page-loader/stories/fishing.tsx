import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Fishing — waiting, made literal.
 * short: a fish wiggling along.  medium: the bobber riding the water.
 * long: a timing game — cast, watch the shadow close in, hook on the "!".
 * -------------------------------------------------------------------------- */

const W = 300;
const H = 190;
const WATER = 112;
const BX = 170; // bobber x

type Phase = "idle" | "waiting" | "bite" | "caught" | "missed";

type FishingState = {
  phase: Phase;
  timer: number;
  score: number;
  t: number;
};

function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number, sc: number, color: string, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -sc : sc, sc);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
  ctx.moveTo(8, 0);
  ctx.lineTo(14, -5);
  ctx.lineTo(14, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function FishingLong() {
  const s = useRef<FishingState>({ phase: "idle", timer: 0, score: 0, t: 0 }).current;

  const act = () => {
    if (s.phase === "idle") {
      s.phase = "waiting";
      s.timer = 1.4 + Math.random() * 2;
    } else if (s.phase === "waiting") {
      // pulled too early — the fish spooks
      s.phase = "missed";
      s.timer = 0.9;
    } else if (s.phase === "bite") {
      s.phase = "caught";
      s.timer = 1;
      s.score += 1;
    }
  };

  const frame: FrameFn = (ctx, dt, c) => {
    s.t += dt;
    if (s.phase !== "idle") {
      s.timer -= dt;
      if (s.timer <= 0) {
        if (s.phase === "waiting") {
          s.phase = "bite";
          s.timer = 0.66;
        } else if (s.phase === "bite") {
          s.phase = "missed"; // too slow
          s.timer = 0.9;
        } else {
          s.phase = "waiting";
          s.timer = 1.4 + Math.random() * 2;
        }
      }
    }

    ctx.clearRect(0, 0, W, H);

    // water — a line plus two drifting highlight dashes
    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, WATER);
    ctx.lineTo(W, WATER);
    ctx.stroke();
    ctx.fillStyle = c.faint;
    for (let i = 0; i < 5; i++) {
      const x = (((i * 67 + s.t * 14) % (W + 40)) + W + 40) % (W + 40) - 20;
      ctx.fillRect(x, WATER + 12 + (i % 3) * 16, 14, 2);
    }

    // rod from the corner to above the bobber
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(24, 96);
    ctx.quadraticCurveTo(70, 40, 118, 30);
    ctx.stroke();

    const cast = s.phase !== "idle";
    const dip = s.phase === "bite" ? 7 : 0;
    const bob = cast ? Math.sin(s.t * 2.2) * 2 + dip : Math.sin(s.t * 1.4) * 3;
    const by = cast ? WATER - 3 + bob : 62 + bob;

    // line
    ctx.strokeStyle = c.soft;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(118, 30);
    ctx.lineTo(BX, by - 5);
    ctx.stroke();

    // bobber
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(BX, by, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.surface;
    ctx.fillRect(BX - 5, by - 1, 10, 2);

    // the fish below — a shadow that closes in as the bite nears
    if (s.phase === "waiting" || s.phase === "bite") {
      const closeness = s.phase === "bite" ? 1 : 1 - Math.min(1, s.timer / 2.5);
      const fx = BX + Math.sin(s.t * 0.9) * 50 * (1 - closeness);
      const fy = WATER + 34 - closeness * 18;
      ctx.globalAlpha = 0.16 + closeness * 0.1;
      drawFish(ctx, fx, fy, 1.1, c.ink, Math.cos(s.t * 0.9) < 0);
      ctx.globalAlpha = 1;
    }
    if (s.phase === "missed") {
      // spooked — darting away
      const k = 1 - s.timer / 0.9;
      ctx.globalAlpha = 0.18 * (1 - k);
      drawFish(ctx, BX + k * 120, WATER + 40, 1.1, c.ink);
      ctx.globalAlpha = 1;
    }
    if (s.phase === "caught") {
      // the catch pops out over the bobber and fades
      const k = 1 - s.timer; // 0 → 1
      const arc = Math.sin(Math.min(1, k * 1.4) * Math.PI);
      ctx.globalAlpha = Math.max(0, 1 - k * 1.2);
      drawFish(ctx, BX, WATER - 14 - arc * 26, 1.2, c.accent);
      ctx.globalAlpha = 1;
    }

    if (s.phase === "bite") {
      ctx.font = "700 15px 'Inter Variable', 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = c.error;
      ctx.fillText("!", BX, by - 16);
    }

    ctx.font = CANVAS_FONT;
    ctx.textAlign = "right";
    ctx.fillStyle = c.soft;
    ctx.fillText(`${s.score} caught`, W - 10, 16);

    if (s.phase === "idle") {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText("click to cast — hook on the !", W / 2, H - 14);
    }
  };

  return (
    <GameStage
      width={W}
      height={H}
      frame={frame}
      onKey={(k) => {
        if (k === " " || k === "Enter") act();
      }}
      onPointerDown={act}
      hint="click: cast · click again on the ! to hook"
      label="Fishing minigame — playable while the page loads"
    />
  );
}

function FishingMedium() {
  return (
    <AmbientStage w={110} h={76} label="Loading — line in the water">
      <line x1={6} y1={48} x2={104} y2={48} stroke="var(--color-border-default)" strokeWidth={1.5} />
      <ellipse
        className="oreo-ld-ripple"
        cx={58}
        cy={48}
        rx={13}
        ry={3.2}
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth={1}
      />
      <ellipse
        className="oreo-ld-ripple oreo-ld-ripple-b"
        cx={58}
        cy={48}
        rx={13}
        ry={3.2}
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth={1}
      />
      <g className="oreo-ld-bobber">
        <line x1={58} y1={0} x2={58} y2={39} stroke="var(--color-text-tertiary)" strokeWidth={1} />
        <circle cx={58} cy={44} r={5} fill="var(--color-status-progress)" />
        <rect x={53.5} y={43} width={9} height={1.8} fill="var(--color-bg-surface)" />
      </g>
      <g className="oreo-ld-sway">
        <ellipse cx={58} cy={65} rx={9} ry={2.6} fill="var(--color-text-primary)" opacity={0.15} />
      </g>
    </AmbientStage>
  );
}

function FishingShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <circle className="oreo-ld-bubble" cx={7} cy={15} r={1.6} fill="var(--color-text-tertiary)" />
      <circle className="oreo-ld-bubble oreo-ld-bubble-b" cx={11} cy={19} r={1.1} fill="var(--color-text-tertiary)" />
      <g className="oreo-ld-sway" style={{ "--ld-amp": "2px" } as React.CSSProperties}>
        <path
          d="M8 20 Q16 12 24 20 Q16 28 8 20 Z"
          fill="var(--color-status-progress)"
        />
        <circle cx={13} cy={18.5} r={1.3} fill="var(--color-bg-surface)" />
        <g className="oreo-ld-tail">
          <path d="M24 20 L32 14.5 L32 25.5 Z" fill="var(--color-status-progress)" />
        </g>
      </g>
    </AmbientStage>
  );
}

export const fishingStory: StoryDef = {
  name: "Fishing",
  Long: FishingLong,
  Medium: FishingMedium,
  Short: FishingShort,
};
