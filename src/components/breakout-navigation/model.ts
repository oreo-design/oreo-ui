export const FIELD = {
  width: 600,
  height: 340,
  paddleY: 318,
  paddleWidth: 64,
  ballRadius: 5,
} as const;
export type Point = { x: number; y: number };
export type Target = Point & { id: string; destination: string; hit: boolean };
export type BreakoutPhase = "ready" | "playing" | "paused" | "won";
export type BreakoutState = {
  phase: BreakoutPhase;
  paddle: number;
  ball: Point;
  velocity: Point;
  targets: Target[];
  misses: number;
  speed: number;
  trail: Point[];
};
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
export const targetCenter = (index: number, count: number): Point => ({
  x: count === 1 ? 300 : 60 + (index * 480) / (count - 1),
  y: 62 + (index % 2) * 54,
});
export function createBreakout(
  ids: readonly string[],
  goal = 8,
  speed = 210,
): BreakoutState {
  const count = clamp(Math.round(Number.isFinite(goal) ? goal : 8), 1, 12),
    unique = [...new Set(ids)].slice(0, 6);
  const targets = unique.flatMap((destination, i) => {
    const c = targetCenter(i, unique.length);
    return Array.from({ length: count }, (_, j) => {
      const angle = (2 * Math.PI * j) / count;
      return {
        id: `${destination}:${j}`,
        destination,
        x: c.x + 23 * Math.cos(angle),
        y: c.y + 23 * Math.sin(angle),
        hit: false,
      };
    });
  });
  return {
    phase: targets.length ? "ready" : "won",
    paddle: 300,
    ball: { x: 300, y: FIELD.paddleY - 8 },
    velocity: { x: 0, y: 0 },
    targets,
    misses: 0,
    speed: clamp(Number.isFinite(speed) ? speed : 210, 100, 360),
    trail: [],
  };
}
export function launch(s: BreakoutState): BreakoutState {
  if (s.phase === "playing" || s.phase === "won") return s;
  return {
    ...s,
    phase: "playing",
    velocity:
      s.phase === "paused"
        ? s.velocity
        : { x: s.speed * 0.32, y: -s.speed * Math.sqrt(1 - 0.32 ** 2) },
  };
}
export const pause = (s: BreakoutState): BreakoutState =>
  s.phase === "playing" ? { ...s, phase: "paused" } : s;
export function movePaddle(s: BreakoutState, x: number): BreakoutState {
  if (!Number.isFinite(x)) return s;
  const paddle = clamp(
    x,
    FIELD.paddleWidth / 2,
    FIELD.width - FIELD.paddleWidth / 2,
  );
  return {
    ...s,
    paddle,
    ball: s.phase === "ready" ? { x: paddle, y: FIELD.paddleY - 8 } : s.ball,
  };
}
/** Fixed small substeps prevent a fast ball from tunneling through tiny target dots. */
export function advance(
  s: BreakoutState,
  elapsed: number,
  direction = 0,
): BreakoutState {
  if (s.phase !== "playing" || !Number.isFinite(elapsed) || elapsed <= 0)
    return s;
  const duration = Math.min(elapsed, 1 / 20),
    steps = Math.ceil(duration / (1 / 240)),
    dt = duration / steps;
  let next = {
    ...s,
    ball: { ...s.ball },
    velocity: { ...s.velocity },
    targets: s.targets,
    trail: [...s.trail, s.ball].slice(-9),
  };
  next = movePaddle(
    next,
    next.paddle + clamp(direction, -1, 1) * 370 * duration,
  );
  for (let n = 0; n < steps; n++) {
    const old = { ...next.ball },
      r = FIELD.ballRadius;
    next.ball = {
      x: old.x + next.velocity.x * dt,
      y: old.y + next.velocity.y * dt,
    };
    if (next.ball.x < r) {
      next.ball.x = r;
      next.velocity.x = Math.abs(next.velocity.x);
    }
    if (next.ball.x > FIELD.width - r) {
      next.ball.x = FIELD.width - r;
      next.velocity.x = -Math.abs(next.velocity.x);
    }
    if (next.ball.y < r) {
      next.ball.y = r;
      next.velocity.y = Math.abs(next.velocity.y);
    }
    if (
      next.velocity.y > 0 &&
      old.y + r <= FIELD.paddleY &&
      next.ball.y + r >= FIELD.paddleY &&
      Math.abs(next.ball.x - next.paddle) <= FIELD.paddleWidth / 2 + r
    ) {
      const offset = clamp(
          (next.ball.x - next.paddle) / (FIELD.paddleWidth / 2),
          -1,
          1,
        ),
        angle = (offset * Math.PI) / 3;
      next.ball.y = FIELD.paddleY - r - 0.1;
      next.velocity = {
        x: Math.sin(angle) * next.speed,
        y: -Math.cos(angle) * next.speed,
      };
    }
    const target = next.targets.find(
      (t) =>
        !t.hit && Math.hypot(next.ball.x - t.x, next.ball.y - t.y) <= r + 3,
    );
    if (target) {
      let dx = next.ball.x - target.x,
        dy = next.ball.y - target.y,
        len = Math.hypot(dx, dy);
      if (len < 0.0001) {
        dx = -next.velocity.x;
        dy = -next.velocity.y;
        len = Math.hypot(dx, dy) || 1;
      }
      const nx = dx / len,
        ny = dy / len,
        dot = next.velocity.x * nx + next.velocity.y * ny;
      if (dot < 0)
        next.velocity = {
          x: next.velocity.x - 2 * dot * nx,
          y: next.velocity.y - 2 * dot * ny,
        };
      next.ball = {
        x: target.x + nx * (r + 3 + 0.2),
        y: target.y + ny * (r + 3 + 0.2),
      };
      next.targets = next.targets.map((t) =>
        t.id === target.id ? { ...t, hit: true } : t,
      );
      if (next.targets.every((t) => t.hit))
        return { ...next, phase: "won", trail: [] };
    }
    if (next.ball.y > FIELD.height + r)
      return {
        ...next,
        phase: "ready",
        misses: next.misses + 1,
        ball: { x: next.paddle, y: FIELD.paddleY - 8 },
        velocity: { x: 0, y: 0 },
        trail: [],
      };
  }
  return next;
}
export function progressOf(s: BreakoutState): Record<string, number> {
  return Object.fromEntries(
    [...new Set(s.targets.map((t) => t.destination))].map((id) => [
      id,
      s.targets.filter((t) => t.destination === id && t.hit).length,
    ]),
  );
}
