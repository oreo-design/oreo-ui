import { useEffect, useRef, type ReactNode } from "react";

/* ----------------------------------------------------------------------------
 * Shared stages for the Page Loader stories.
 *
 * GameStage — the playable (long-wait) tier: a DPR-scaled canvas with a rAF
 * loop, pressed-key tracking and pointer plumbing. Canvas because a game needs
 * per-frame logic and input; the ambient tiers stay in CSS (see
 * page-loader.css) so they keep running while the app is busy loading.
 *
 * AmbientStage — the loop/glyph tiers: a plain SVG whose motion is entirely
 * CSS keyframes.
 * -------------------------------------------------------------------------- */

/** Oreo tokens resolved to concrete colors — canvases can't use CSS vars. */
export type GameColors = {
  ink: string;
  soft: string;
  faint: string;
  surface: string;
  accent: string;
  accentSoft: string;
  success: string;
  error: string;
  mint: string;
  pink: string;
  orange: string;
  purple: string;
};

function readColors(style: CSSStyleDeclaration): GameColors {
  const v = (name: string) => style.getPropertyValue(name).trim();
  return {
    ink: v("--color-text-primary"),
    soft: v("--color-text-tertiary"),
    faint: v("--color-border-default"),
    surface: v("--color-bg-surface"),
    accent: v("--color-status-progress"),
    accentSoft: v("--color-status-progress-subtle"),
    success: v("--color-status-success"),
    error: v("--color-status-error"),
    mint: v("--color-palette-mint-text"),
    pink: v("--color-palette-pink-text"),
    orange: v("--color-palette-orange-text"),
    purple: v("--color-palette-purple-text"),
  };
}

export type FrameFn = (
  ctx: CanvasRenderingContext2D,
  dt: number,
  c: GameColors,
  keys: ReadonlySet<string>,
) => void;

/** roundRect by hand — keeps us off the newer ctx.roundRect lib typing. */
export function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export const CANVAS_FONT = "600 11px 'Inter Variable', 'Inter', system-ui, sans-serif";

/** Keys the games own while the canvas is focused — kept from scrolling the page. */
const CAPTURED = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " ",
]);

export function GameStage({
  width,
  height,
  frame,
  onKey,
  onPointerMove,
  onPointerDown,
  hint,
  label,
  responsive = false,
  onFocusLost,
}: {
  width: number;
  height: number;
  frame: FrameFn;
  /** Discrete key handler (turn, jump, hook) — continuous keys come via the frame's Set. */
  onKey?: (key: string) => void;
  onPointerMove?: (x: number, y: number) => void;
  onPointerDown?: (x: number, y: number) => void;
  hint: string;
  label: string;
  responsive?: boolean;
  onFocusLost?: (event: React.FocusEvent<HTMLCanvasElement>) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const frameRef = useRef(frame);
  frameRef.current = frame;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    // Read tokens off the canvas itself so wrapper-level theme classes
    // (.theme-dark on the docs shell) reach the game colors too.
    const style = getComputedStyle(canvas);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't teleport the game on return.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      frameRef.current(ctx, dt, readColors(style), keys.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * width / rect.width, y: (e.clientY - rect.top) * height / rect.height };
  };

  return (
    <figure className={`m-0 flex flex-col items-center gap-2.5 ${responsive ? "w-full" : ""}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        tabIndex={0}
        style={responsive ? { width: "100%", height: "auto", aspectRatio: `${width} / ${height}` } : { width, height }}
        className="touch-none rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-status-progress)]"
        onKeyDown={(e) => {
          if (CAPTURED.has(e.key)) e.preventDefault();
          keys.current.add(e.key);
          if (!e.repeat) onKey?.(e.key);
        }}
        onKeyUp={(e) => keys.current.delete(e.key)}
        onBlur={(event) => { keys.current.clear(); onFocusLost?.(event); }}
        onPointerMove={(e) => {
          const p = point(e);
          onPointerMove?.(p.x, p.y);
        }}
        onPointerDown={(e) => {
          e.currentTarget.focus();
          const p = point(e);
          onPointerDown?.(p.x, p.y);
        }}
      />
      <figcaption className="text-[11px] text-[var(--color-text-tertiary)]">{hint}</figcaption>
    </figure>
  );
}

/** SVG stage for the CSS-animated tiers. Decorative: one label, hidden internals. */
export function AmbientStage({
  w,
  h,
  label,
  children,
}: {
  w: number;
  h: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div role="img" aria-label={label} className="oreo-loader-stage grid place-items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
        {children}
      </svg>
    </div>
  );
}
