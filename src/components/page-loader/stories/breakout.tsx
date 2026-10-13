import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, rr, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Breakout — loading as clearing blocks.
 * short: a bouncing ball with squash.  medium: the ball pinging around its box.
 * long: real breakout — paddle on arrows or pointer, bricks refill when cleared.
 * -------------------------------------------------------------------------- */

const W = 300;
const H = 190;
const BR = 4;
const BC = 9;
const BW = 28;
const BH = 9;
const GAP = 3;
const LEFT = (W - (BC * BW + (BC - 1) * GAP)) / 2;
const TOP = 24;
const PW = 52;
const PH = 8;
const PY = H - 18;
const R = 4.5;

type BreakoutState = {
  px: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  bricks: boolean[];
  launched: boolean;
  started: boolean;
  score: number;
  t: number;
};

function BreakoutLong() {
  const s = useRef<BreakoutState>({
    px: W / 2,
    x: W / 2,
    y: PY - PH,
    vx: 0,
    vy: 0,
    speed: 175,
    bricks: Array(BR * BC).fill(true),
    launched: false,
    started: false,
    score: 0,
    t: 0,
  }).current;

  const launch = () => {
    s.started = true;
    if (s.launched) return;
    s.launched = true;
    const a = (Math.random() * 0.6 - 0.3) * Math.PI;
    s.vx = Math.sin(a) * s.speed;
    s.vy = -Math.cos(a) * s.speed;
  };

  const frame: FrameFn = (ctx, dt, c, keys) => {
    s.t += dt;
    const move =
      (keys.has("ArrowRight") || keys.has("d") ? 1 : 0) -
      (keys.has("ArrowLeft") || keys.has("a") ? 1 : 0);
    s.px = Math.max(PW / 2, Math.min(W - PW / 2, s.px + move * 300 * dt));

    if (!s.launched) {
      s.x = s.px;
      s.y = PY - PH;
    } else {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.x < R) (s.x = R), (s.vx = Math.abs(s.vx));
      if (s.x > W - R) (s.x = W - R), (s.vx = -Math.abs(s.vx));
      if (s.y < R) (s.y = R), (s.vy = Math.abs(s.vy));

      // paddle — reflection angle follows where the ball lands on it
      if (s.vy > 0 && s.y + R >= PY && s.y + R <= PY + PH + 6 && Math.abs(s.x - s.px) <= PW / 2 + R) {
        const off = Math.max(-1, Math.min(1, (s.x - s.px) / (PW / 2)));
        const a = off * (Math.PI / 3);
        s.vx = Math.sin(a) * s.speed;
        s.vy = -Math.cos(a) * s.speed;
      }

      // bricks
      const col = Math.floor((s.x - LEFT) / (BW + GAP));
      const row = Math.floor((s.y - TOP) / (BH + GAP));
      if (col >= 0 && col < BC && row >= 0 && row < BR) {
        const i = row * BC + col;
        if (s.bricks[i]) {
          s.bricks[i] = false;
          s.score += 1;
          s.speed += 2;
          s.vy = -s.vy;
          if (s.bricks.every((b) => !b)) {
            s.bricks = Array(BR * BC).fill(true);
            s.speed += 12;
          }
        }
      }

      if (s.y > H + 12) {
        s.launched = false;
        s.vx = 0;
        s.vy = 0;
      }
    }

    ctx.clearRect(0, 0, W, H);
    for (let row = 0; row < BR; row++) {
      for (let col = 0; col < BC; col++) {
        if (!s.bricks[row * BC + col]) continue;
        ctx.globalAlpha = 1 - row * 0.18;
        ctx.fillStyle = c.accent;
        rr(ctx, LEFT + col * (BW + GAP), TOP + row * (BH + GAP), BW, BH, 3);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = c.ink;
    rr(ctx, s.px - PW / 2, PY, PW, PH, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s.x, s.y, R, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = CANVAS_FONT;
    ctx.textAlign = "left";
    ctx.fillStyle = c.soft;
    ctx.fillText(`× ${s.score}`, 10, 16);

    if (!s.launched) {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText(s.started ? "space to relaunch" : "click or space to launch · ← → to move", W / 2, H - 34);
    }
  };

  return (
    <GameStage
      width={W}
      height={H}
      frame={frame}
      onKey={(k) => {
        if (k === " " || k === "ArrowUp") launch();
      }}
      onPointerMove={(x) => {
        s.px = Math.max(PW / 2, Math.min(W - PW / 2, x));
      }}
      onPointerDown={launch}
      hint="← → or pointer to move · clear the blocks"
      label="Breakout minigame — playable while the page loads"
    />
  );
}

function BreakoutMedium() {
  return (
    <AmbientStage w={124} h={84} label="Loading — ball in play">
      <rect x={1} y={1} width={122} height={82} rx={10} fill="none" stroke="var(--color-border-subtle)" strokeWidth={1.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={8 + i * 28} y={8} width={24} height={7} rx={2.5} fill="var(--color-status-progress)" opacity={1 - i * 0.18} />
      ))}
      <g className="oreo-ld-ball-x" style={{ "--ld-bx": "100px" } as React.CSSProperties}>
        <g className="oreo-ld-ball-y" style={{ "--ld-by": "38px" } as React.CSSProperties}>
          <circle cx={12} cy={24} r={4} fill="var(--color-text-primary)" />
        </g>
      </g>
      <g className="oreo-ld-paddle" style={{ "--ld-bx": "100px" } as React.CSSProperties}>
        <rect x={4} y={71} width={16} height={5} rx={2.5} fill="var(--color-text-primary)" />
      </g>
    </AmbientStage>
  );
}

function BreakoutShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <ellipse className="oreo-ld-bshadow" cx={20} cy={33} rx={6} ry={1.8} fill="var(--color-text-primary)" />
      <g className="oreo-ld-bounce">
        <circle cx={20} cy={11} r={5} fill="var(--color-text-primary)" />
      </g>
    </AmbientStage>
  );
}

export const breakoutStory: StoryDef = {
  name: "Breakout",
  Long: BreakoutLong,
  Medium: BreakoutMedium,
  Short: BreakoutShort,
};
