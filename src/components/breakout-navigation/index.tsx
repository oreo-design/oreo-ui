import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { GameStage, rr, type FrameFn } from "@/components/page-loader/stage";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  FIELD,
  createBreakout,
  advance,
  launch,
  pause,
  movePaddle,
  progressOf,
  targetCenter,
  type BreakoutState,
  type BreakoutPhase,
} from "./model";
import "./breakout.css";
export type BreakoutDestination = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
};
export type BreakoutProgress = {
  phase: BreakoutPhase;
  hits: Record<string, number>;
  misses: number;
};
export const BREAKOUT_DESTINATIONS: readonly BreakoutDestination[] = [
  { id: "components", label: "Components", href: "/button", icon: "columns" },
  {
    id: "templates",
    label: "Templates",
    href: "/workflow-directory",
    icon: "folder",
  },
  { id: "motion", label: "Motion", href: "/loading-sequence", icon: "sparkle" },
  {
    id: "patterns",
    label: "Patterns",
    href: "/agent-queue-workspace",
    icon: "list-checks",
  },
  { id: "icons", label: "Icons", href: "/status-icon", icon: "star" },
  { id: "guide", label: "Guide", href: "/page-loader", icon: "book-open" },
];
export function DestinationProgress({
  destinations,
  hits = {},
  goal = 8,
  compact = false,
}: {
  destinations: readonly BreakoutDestination[];
  hits?: Record<string, number>;
  goal?: number;
  compact?: boolean;
}) {
  const total = Math.max(
    1,
    Math.min(12, Math.round(Number.isFinite(goal) ? goal : 8)),
  );
  return (
    <nav
      aria-label="Destinations"
      className={`bn-destinations${compact ? " bn-destinations-compact" : ""}`}
    >
      {destinations.length ? (
        destinations.map((item) => {
          const count = Math.max(
              0,
              Math.min(total, Math.floor(hits[item.id] || 0)),
            ),
            complete = count === total;
          return (
            <a
              key={item.id}
              href={item.href}
              data-complete={complete || undefined}
              aria-label={`${item.label}, ${count} of ${total} targets cleared`}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.label}</span>
              <span className="bn-count">
                {complete ? (
                  <Icon name="check" size="sm" />
                ) : (
                  `${count}/${total}`
                )}
              </span>
            </a>
          );
        })
      ) : (
        <p className="bn-muted">No destinations yet.</p>
      )}
    </nav>
  );
}
export function RecoveryMessage({
  title = "Breakout of the 404 maze",
  description = "This page is missing. Take a little detour, or go straight to",
  href = "/button",
  linkLabel = "components",
  eyebrow = "404 · PAGE NOT FOUND",
  children,
}: {
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bn-recovery">
      {eyebrow && <p className="bn-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>
        {description} <a href={href}>{linkLabel}</a>.
      </p>
      {children}
    </section>
  );
}
export function BreakoutNavigator({
  destinations = BREAKOUT_DESTINATIONS,
  goal = 8,
  speed = "calm",
  trail = true,
  resetKey = 0,
  onProgress,
}: {
  destinations?: readonly BreakoutDestination[];
  goal?: number;
  speed?: "calm" | "brisk";
  trail?: boolean;
  resetKey?: number;
  onProgress?: (progress: BreakoutProgress) => void;
}) {
  const unique = destinations
      .filter((d, i, a) => a.findIndex((x) => x.id === d.id) === i)
      .slice(0, 6),
    ids = unique.map((d) => d.id),
    signature = JSON.stringify(ids),
    total = Math.max(
      1,
      Math.min(12, Math.round(Number.isFinite(goal) ? goal : 8)),
    );
  const game = useRef(
      createBreakout(ids, total, speed === "brisk" ? 300 : 210),
    ),
    root = useRef<HTMLDivElement>(null),
    onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const [view, setView] = useState<BreakoutProgress>({
      phase: "ready",
      hits: {},
      misses: 0,
    }),
    reduce = useReducedMotion();
  function publish(next: BreakoutState, force = false) {
    const old = game.current;
    game.current = next;
    if (
      force ||
      old.phase !== next.phase ||
      old.misses !== next.misses ||
      old.targets !== next.targets
    ) {
      const value = {
        phase: next.phase,
        hits: progressOf(next),
        misses: next.misses,
      };
      setView(value);
      onProgressRef.current?.(value);
    }
  }
  function reset() {
    publish(createBreakout(ids, total, speed === "brisk" ? 300 : 210), true);
  }
  useEffect(() => {
    reset();
  }, [signature, total, speed, resetKey]);
  useEffect(() => {
    const stop = () => publish(pause(game.current));
    const visibility = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const focus = () => root.current?.querySelector("canvas")?.focus();
  const start = () => {
    focus();
    publish(launch(game.current));
  };
  const frame: FrameFn = (ctx, dt, c, keys) => {
    const dir =
      (keys.has("ArrowRight") || keys.has("d") ? 1 : 0) -
      (keys.has("ArrowLeft") || keys.has("a") ? 1 : 0);
    let s = game.current;
    if (s.phase === "ready" && dir)
      s = movePaddle(s, s.paddle + dir * 370 * dt);
    publish(advance(s, dt, dir));
    if (s.phase === "ready") game.current = s;
    s = game.current;
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = c.faint;
    for (let x = 12; x < FIELD.width; x += 18)
      for (let y = 12; y < FIELD.height; y += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 0.85, 0, Math.PI * 2);
        ctx.fill();
      }
    for (const t of s.targets) {
      if (t.hit) continue;
      ctx.fillStyle = c.soft;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (trail && !reduce) {
      const colors = [c.pink, c.accent, c.mint, c.orange];
      s.trail.forEach((p, i) => {
        ctx.globalAlpha = ((i + 1) / s.trail.length) * 0.3;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + i * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = c.ink;
    rr(
      ctx,
      s.paddle - FIELD.paddleWidth / 2,
      FIELD.paddleY,
      FIELD.paddleWidth,
      6,
      3,
    );
    ctx.fill();
    ctx.fillStyle = c.orange;
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, FIELD.ballRadius, 0, Math.PI * 2);
    ctx.fill();
  };
  const message =
    view.phase === "won"
      ? "All paths found. Choose any destination below."
      : view.phase === "paused"
        ? "Paused. Resume whenever you’re ready."
        : view.phase === "playing"
          ? "Follow the ball. Clear the dots around each destination."
          : view.misses
            ? "Missed it! Your progress is saved. Launch another ball."
            : "Press Space or Launch ball to begin.";
  if (!unique.length)
    return (
      <AgentWorkspaceState
        title="No paths to explore"
        description="Add at least one destination to start the game. Direct recovery links remain available."
      />
    );
  return (
    <div className="bn-shell">
      <div className="bn-navigator" ref={root}>
        <div className="bn-playfield">
          <div className="bn-board">
            <GameStage
              width={FIELD.width}
              height={FIELD.height}
              responsive
              frame={frame}
              label="Breakout navigation game"
              hint="← → or A / D to steer · pointer or touch to move · Space to launch / pause"
              onKey={(key) => {
                if (key === " ")
                  publish(
                    game.current.phase === "playing"
                      ? pause(game.current)
                      : launch(game.current),
                  );
                if (key === "Escape") publish(pause(game.current));
              }}
              onPointerMove={(x) => {
                game.current = movePaddle(game.current, x);
              }}
              onPointerDown={(x) => {
                game.current = movePaddle(game.current, x);
                publish(launch(game.current));
              }}
              onFocusLost={(event) => {
                if (!root.current?.contains(event.relatedTarget as Node | null))
                  publish(pause(game.current));
              }}
            />
            <div className="bn-target-icons" aria-hidden>
              {unique.map((d, i) => {
                const p = targetCenter(i, unique.length);
                return (
                  <span
                    key={d.id}
                    style={{
                      left: `${(p.x / FIELD.width) * 100}%`,
                      top: `${(p.y / FIELD.height) * 100}%`,
                    }}
                    data-complete={view.hits[d.id] === total || undefined}
                  >
                    <Icon name={d.icon} />
                  </span>
                );
              })}
            </div>
          </div>
          <div className="bn-game-controls">
            <Button
              type="secondary"
              size="sm"
              disabled={view.phase === "won"}
              onClick={() =>
                view.phase === "playing"
                  ? publish(pause(game.current))
                  : start()
              }
            >
              {view.phase === "playing"
                ? "Pause"
                : view.phase === "paused"
                  ? "Resume"
                  : "Launch ball"}
            </Button>
            <Button
              type="tertiary"
              size="sm"
              onClick={() => {
                reset();
                focus();
              }}
            >
              Restart
            </Button>
            <span className="bn-mobile-steer">
              <IconButton
                type="tertiary"
                size="sm"
                aria-label="Move paddle left"
                icon={<Icon name="chevron-left" />}
                onClick={() => {
                  game.current = movePaddle(
                    game.current,
                    game.current.paddle - 35,
                  );
                }}
              />
              <IconButton
                type="tertiary"
                size="sm"
                aria-label="Move paddle right"
                icon={<Icon name="chevron-right" />}
                onClick={() => {
                  game.current = movePaddle(
                    game.current,
                    game.current.paddle + 35,
                  );
                }}
              />
            </span>
            <span className="bn-hits">
              {Object.values(view.hits).reduce((a, b) => a + b, 0)} /{" "}
              {unique.length * total}
            </span>
          </div>
          <p className="bn-game-status" role="status">
            {message}
          </p>
        </div>
        <aside className="bn-sidebar">
          <DestinationProgress
            destinations={unique}
            hits={view.hits}
            goal={total}
          />
          <p>
            Every destination is open.
            <br />
            The game is just the scenic route.
          </p>
        </aside>
      </div>
    </div>
  );
}
