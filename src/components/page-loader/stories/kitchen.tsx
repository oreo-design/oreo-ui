import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, rr, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Kitchen — loading as cooking: your content is being prepared.
 * short: steam rising.  medium: the pot simmering, lid rattling.
 * long: catch the falling ingredients in the bowl — ← → or pointer.
 * -------------------------------------------------------------------------- */

const W = 300;
const H = 190;
const BOWL_W = 58;
const BOWL_Y = H - 28;

type Drop = { x: number; y: number; vy: number; r: number; color: number };

type KitchenState = {
  bx: number;
  drops: Drop[];
  caught: number[];
  spawnIn: number;
  t: number;
  score: number;
  bounce: number;
  started: boolean;
};

function KitchenLong() {
  const s = useRef<KitchenState>({
    bx: W / 2,
    drops: [],
    caught: [],
    spawnIn: 0.4,
    t: 0,
    score: 0,
    bounce: 0,
    started: false,
  }).current;

  const frame: FrameFn = (ctx, dt, c, keys) => {
    s.t += dt;
    s.bounce = Math.max(0, s.bounce - dt * 4);
    const palette = [c.mint, c.pink, c.orange, c.purple];

    const move =
      (keys.has("ArrowRight") || keys.has("d") ? 1 : 0) -
      (keys.has("ArrowLeft") || keys.has("a") ? 1 : 0);
    if (move !== 0) s.started = true;
    s.bx = Math.max(BOWL_W / 2, Math.min(W - BOWL_W / 2, s.bx + move * 300 * dt));

    if (s.started) {
      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        s.drops.push({
          x: 20 + Math.random() * (W - 40),
          y: -8,
          vy: 110 + Math.random() * 80 + Math.min(80, s.t * 3),
          r: 5 + Math.random() * 2.5,
          color: Math.floor(Math.random() * palette.length),
        });
        s.spawnIn = 0.55 + Math.random() * 0.35;
      }
      for (const d of s.drops) d.y += d.vy * dt;
      s.drops = s.drops.filter((d) => {
        if (d.y > H + 10) return false;
        const inMouth = d.y + d.r >= BOWL_Y - 2 && d.y - d.r <= BOWL_Y + 8 && Math.abs(d.x - s.bx) < BOWL_W / 2 - 4;
        if (inMouth) {
          s.score += 1;
          s.bounce = 1;
          s.caught = [...s.caught.slice(-2), d.color];
          return false;
        }
        return true;
      });
    }

    ctx.clearRect(0, 0, W, H);

    // falling ingredients
    for (const d of s.drops) {
      ctx.fillStyle = palette[d.color];
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // bowl — squashes for a beat when it catches something
    const squash = 1 + s.bounce * 0.08;
    const by = BOWL_Y + s.bounce * 2;
    ctx.save();
    ctx.translate(s.bx, by);
    ctx.scale(squash, 1 / squash);
    ctx.fillStyle = c.surface;
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-BOWL_W / 2, 0);
    ctx.arc(0, 0, BOWL_W / 2, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // last few catches float in the bowl mouth
    s.caught.forEach((col, i) => {
      ctx.fillStyle = palette[col];
      ctx.beginPath();
      ctx.arc((i - 1) * 13, 5, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // ground shadow
    ctx.fillStyle = c.faint;
    ctx.fillRect(0, H - 6, W, 1.5);

    ctx.font = CANVAS_FONT;
    ctx.textAlign = "right";
    ctx.fillStyle = c.soft;
    ctx.fillText(`× ${s.score}`, W - 10, 16);

    if (!s.started) {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText("click, then ← → to catch the ingredients", W / 2, H / 2 - 10);
    }
  };

  return (
    <GameStage
      width={W}
      height={H}
      frame={frame}
      onKey={(k) => {
        if (k === "ArrowLeft" || k === "ArrowRight" || k === "a" || k === "d") s.started = true;
      }}
      onPointerMove={(x) => {
        if (s.started) s.bx = Math.max(BOWL_W / 2, Math.min(W - BOWL_W / 2, x));
      }}
      onPointerDown={(x) => {
        s.started = true;
        s.bx = Math.max(BOWL_W / 2, Math.min(W - BOWL_W / 2, x));
      }}
      hint="← → or pointer — catch every ingredient"
      label="Kitchen minigame — playable while the page loads"
    />
  );
}

const WISP = "q3.5 -4 0 -8 q-3.5 -4 0 -8";

function KitchenMedium() {
  return (
    <AmbientStage w={100} h={80} label="Loading — dinner's on">
      <path className="oreo-ld-steam" d={`M39 30 ${WISP}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={2} strokeLinecap="round" />
      <path className="oreo-ld-steam oreo-ld-steam-b" d={`M50 28 ${WISP}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={2} strokeLinecap="round" />
      <path className="oreo-ld-steam oreo-ld-steam-c" d={`M61 30 ${WISP}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={2} strokeLinecap="round" />
      <g className="oreo-ld-lid">
        <rect x={23} y={35} width={54} height={7} rx={3.5} fill="var(--color-text-primary)" />
        <circle cx={50} cy={32} r={2.8} fill="var(--color-text-primary)" />
      </g>
      <rect x={26} y={44} width={48} height={24} rx={7} fill="var(--color-bg-surface)" stroke="var(--color-text-primary)" strokeWidth={2} />
      <line x1={18} y1={50} x2={26} y2={50} stroke="var(--color-text-primary)" strokeWidth={2} strokeLinecap="round" />
      <line x1={74} y1={50} x2={82} y2={50} stroke="var(--color-text-primary)" strokeWidth={2} strokeLinecap="round" />
    </AmbientStage>
  );
}

function KitchenShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <path className="oreo-ld-steam" d={`M15 30 ${WISP}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={2.2} strokeLinecap="round" />
      <path className="oreo-ld-steam oreo-ld-steam-b" d={`M25 30 ${WISP}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={2.2} strokeLinecap="round" />
    </AmbientStage>
  );
}

export const kitchenStory: StoryDef = {
  name: "Kitchen",
  Long: KitchenLong,
  Medium: KitchenMedium,
  Short: KitchenShort,
};
