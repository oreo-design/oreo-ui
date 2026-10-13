import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, rr, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Runner — loading as distance covered.
 * short: footprints, one after the other.  medium: the runner mid-stride.
 * long: an endless runner — space to jump the blocks, speed creeps up.
 * -------------------------------------------------------------------------- */

const W = 300;
const H = 190;
const GROUND = 150;
const PX = 46;
const PS = 18; // player size

type Obstacle = { x: number; w: number; h: number };

type RunnerState = {
  py: number; // player top
  vy: number;
  obs: Obstacle[];
  spawnIn: number;
  t: number;
  dist: number;
  groundOff: number;
  dead: boolean;
  started: boolean;
};

function RunnerLong() {
  const s = useRef<RunnerState>({
    py: GROUND - PS,
    vy: 0,
    obs: [],
    spawnIn: 1,
    t: 0,
    dist: 0,
    groundOff: 0,
    dead: false,
    started: false,
  }).current;

  const jump = () => {
    if (s.dead) {
      s.obs = [];
      s.dist = 0;
      s.t = 0;
      s.spawnIn = 1;
      s.dead = false;
      return;
    }
    s.started = true;
    if (s.py >= GROUND - PS - 0.5) s.vy = -430;
  };

  const frame: FrameFn = (ctx, dt, c) => {
    const speed = Math.min(330, 190 + s.t * 8);
    if (s.started && !s.dead) {
      s.t += dt;
      s.dist += (speed * dt) / 50;
      s.groundOff = (s.groundOff + speed * dt) % 26;

      s.vy += 1380 * dt;
      s.py = Math.min(GROUND - PS, s.py + s.vy * dt);
      if (s.py >= GROUND - PS) s.vy = 0;

      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        s.obs.push({ x: W + 20, w: 10 + Math.random() * 6, h: 18 + Math.random() * 16 });
        s.spawnIn = 0.8 + Math.random() * 0.7;
      }
      s.obs.forEach((o) => (o.x -= speed * dt));
      s.obs = s.obs.filter((o) => o.x + o.w > -10);

      for (const o of s.obs) {
        const hit =
          PX + 3 < o.x + o.w &&
          PX + PS - 3 > o.x &&
          s.py + PS - 2 > GROUND - o.h;
        if (hit) {
          s.dead = true;
          break;
        }
      }
    }

    ctx.clearRect(0, 0, W, H);

    // ground line + scrolling ticks
    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 1);
    ctx.lineTo(W, GROUND + 1);
    ctx.stroke();
    ctx.fillStyle = c.faint;
    for (let x = -s.groundOff; x < W; x += 26) {
      ctx.fillRect(x, GROUND + 7, 8, 2);
    }

    // obstacles
    ctx.fillStyle = c.soft;
    for (const o of s.obs) {
      rr(ctx, o.x, GROUND - o.h, o.w, o.h, 3);
      ctx.fill();
    }

    // player — a rounded block with an eye, tilting slightly in the air
    ctx.fillStyle = s.dead ? c.error : c.ink;
    rr(ctx, PX, s.py, PS, PS, 6);
    ctx.fill();
    ctx.fillStyle = c.surface;
    ctx.beginPath();
    ctx.arc(PX + PS - 5.5, s.py + 6, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = CANVAS_FONT;
    ctx.textAlign = "right";
    ctx.fillStyle = c.soft;
    ctx.fillText(`${Math.floor(s.dist)} m`, W - 10, 16);

    if (!s.started || s.dead) {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText(
        s.dead ? `tripped at ${Math.floor(s.dist)} m — space to go again` : "click, then space to jump",
        W / 2,
        40,
      );
    }
  };

  return (
    <GameStage
      width={W}
      height={H}
      frame={frame}
      onKey={(k) => {
        if (k === " " || k === "ArrowUp" || k === "w") jump();
      }}
      onPointerDown={jump}
      hint="space / tap to jump the blocks"
      label="Runner minigame — playable while the page loads"
    />
  );
}

function RunnerMedium() {
  return (
    <AmbientStage w={110} h={70} label="Loading — runner on their way">
      <line
        className="oreo-ld-ground"
        x1={6}
        y1={58}
        x2={104}
        y2={58}
        stroke="var(--color-border-default)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <g className="oreo-ld-bob">
        <rect x={44} y={26} width={17} height={17} rx={6} fill="var(--color-text-primary)" />
        <circle cx={56} cy={32} r={1.7} fill="var(--color-bg-surface)" />
      </g>
      <g className="oreo-ld-leg">
        <rect x={47.5} y={42} width={3.5} height={11} rx={1.75} fill="var(--color-text-primary)" />
      </g>
      <g className="oreo-ld-leg oreo-ld-leg-b">
        <rect x={54} y={42} width={3.5} height={11} rx={1.75} fill="var(--color-text-primary)" />
      </g>
    </AmbientStage>
  );
}

function RunnerShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <g className="oreo-ld-print">
        <ellipse cx={14} cy={26} rx={3.2} ry={4.8} transform="rotate(-12 14 26)" fill="var(--color-text-primary)" />
      </g>
      <g className="oreo-ld-print oreo-ld-print-b">
        <ellipse cx={26} cy={15} rx={3.2} ry={4.8} transform="rotate(-12 26 15)" fill="var(--color-text-primary)" />
      </g>
    </AmbientStage>
  );
}

export const runnerStory: StoryDef = {
  name: "Runner",
  Long: RunnerLong,
  Medium: RunnerMedium,
  Short: RunnerShort,
};
