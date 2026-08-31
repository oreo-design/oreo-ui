import { useRef } from "react";
import { AmbientStage, CANVAS_FONT, GameStage, rr, type FrameFn } from "../stage";
import type { StoryDef } from "../story";

/* ----------------------------------------------------------------------------
 * Snake — the reference story.
 * short: the food pixel, blinking.  medium: a snake lapping its block.
 * long: real snake — arrows to steer, wrap-around walls, food to grow.
 * -------------------------------------------------------------------------- */

const CELL = 16;
const COLS = 18;
const ROWS = 11; // 288 × 176

type V = { x: number; y: number };

type SnakeState = {
  body: V[];
  dir: V;
  next: V;
  food: V;
  score: number;
  dead: boolean;
  started: boolean;
  acc: number;
  t: number;
};

function placeFood(s: SnakeState) {
  do {
    s.food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (s.body.some((b) => b.x === s.food.x && b.y === s.food.y));
}

function resetSnake(s: SnakeState) {
  s.body = [
    { x: 7, y: 5 },
    { x: 6, y: 5 },
    { x: 5, y: 5 },
  ];
  s.dir = { x: 1, y: 0 };
  s.next = { x: 1, y: 0 };
  s.score = 0;
  s.dead = false;
  s.acc = 0;
  placeFood(s);
}

const DIRS: Record<string, V> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function SnakeLong() {
  const s = useRef<SnakeState>({
    body: [],
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: { x: 12, y: 5 },
    score: 0,
    dead: false,
    started: false,
    acc: 0,
    t: 0,
  }).current;
  if (s.body.length === 0) resetSnake(s);

  const onKey = (key: string) => {
    const v = DIRS[key];
    if (!v) return;
    if (s.dead) {
      resetSnake(s);
      s.started = true;
      return;
    }
    s.started = true;
    if (!(v.x === -s.dir.x && v.y === -s.dir.y)) s.next = v;
  };

  const tick = () => {
    s.dir = s.next;
    const head = {
      x: (s.body[0].x + s.dir.x + COLS) % COLS,
      y: (s.body[0].y + s.dir.y + ROWS) % ROWS,
    };
    // The tail cell is vacated this same tick, so it doesn't count as a hit.
    if (s.body.slice(0, -1).some((b) => b.x === head.x && b.y === head.y)) {
      s.dead = true;
      return;
    }
    s.body.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 1;
      placeFood(s);
    } else {
      s.body.pop();
    }
  };

  const frame: FrameFn = (ctx, dt, c) => {
    s.t += dt;
    if (s.started && !s.dead) {
      s.acc += dt;
      const step = Math.max(0.065, 0.115 - s.score * 0.0025);
      while (s.acc > step) {
        s.acc -= step;
        tick();
      }
    }

    const W = COLS * CELL;
    const H = ROWS * CELL;
    ctx.clearRect(0, 0, W, H);

    // food — blinking pixel
    const pulse = 1 + 0.12 * Math.sin(s.t * 5);
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    ctx.fillStyle = c.accent;
    rr(ctx, fx - 4.5 * pulse, fy - 4.5 * pulse, 9 * pulse, 9 * pulse, 3);
    ctx.fill();

    // snake
    ctx.fillStyle = s.dead ? c.error : c.ink;
    s.body.forEach((b, i) => {
      const inset = i === 0 ? 1 : 2;
      rr(ctx, b.x * CELL + inset, b.y * CELL + inset, CELL - inset * 2, CELL - inset * 2, i === 0 ? 5 : 4);
      ctx.fill();
    });

    // score
    ctx.font = CANVAS_FONT;
    ctx.textAlign = "left";
    ctx.fillStyle = c.soft;
    ctx.fillText(`× ${s.score}`, 10, 18);

    if (!s.started || s.dead) {
      ctx.textAlign = "center";
      ctx.fillStyle = c.soft;
      ctx.fillText(s.dead ? `ouch — ${s.score} eaten · any arrow to retry` : "click, then arrows to play", W / 2, H - 14);
    }
  };

  return (
    <GameStage
      width={COLS * CELL}
      height={ROWS * CELL}
      frame={frame}
      onKey={onKey}
      hint="← ↑ ↓ → steer · eat to grow · walls wrap"
      label="Snake minigame — playable while the page loads"
    />
  );
}

function SnakeMedium() {
  return (
    <AmbientStage w={96} h={96} label="Loading — snake circling">
      <rect
        x={12}
        y={12}
        width={72}
        height={72}
        rx={12}
        fill="none"
        stroke="var(--color-border-subtle)"
        strokeWidth={8}
      />
      <rect
        className="oreo-ld-snake-body"
        x={12}
        y={12}
        width={72}
        height={72}
        rx={12}
        pathLength={100}
        fill="none"
        stroke="var(--color-text-primary)"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <g className="oreo-ld-food">
        <rect x={42} y={42} width={12} height={12} rx={3.5} fill="var(--color-status-progress)" />
      </g>
    </AmbientStage>
  );
}

function SnakeShort() {
  return (
    <AmbientStage w={40} h={40} label="Loading">
      <g className="oreo-ld-ring">
        <rect
          x={13}
          y={13}
          width={14}
          height={14}
          rx={4}
          fill="none"
          stroke="var(--color-status-progress)"
          strokeWidth={1.5}
        />
      </g>
      <g className="oreo-ld-food">
        <rect
          x={14}
          y={14}
          width={12}
          height={12}
          rx={3.5}
          fill="var(--color-status-progress)"
          transform="rotate(45 20 20)"
        />
      </g>
    </AmbientStage>
  );
}

export const snakeStory: StoryDef = {
  name: "Snake",
  Long: SnakeLong,
  Medium: SnakeMedium,
  Short: SnakeShort,
};
