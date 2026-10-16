import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";

const glyphs: IconName[] = ["sparkle", "folder", "sun", "chat", "globe", "camera", "gear", "star", "moon", "bell", "plane", "keyboard", "brain", "calendar", "plug", "smiley", "paintbrush", "search", "mic", "chart-line"];
// SVG drawing units, independent of the rendered size. Colors and typography inherit Oreo tokens.
const WIDTH = 1000;
const HEIGHT = 250;
const radii = { sm: 90, md: 150, lg: 230 };
const cells = { fine: 16, regular: 22, coarse: 30 };

export type IconRevealProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  text?: string;
  radius?: keyof typeof radii;
  density?: keyof typeof cells;
  /** Reveal the whole icon texture, including on devices without hover. */
  revealed?: boolean;
  /** Disable pointer following and fade transitions. */
  animated?: boolean;
};

/** A wordmark filled with Oreo icons, uncovered by a soft pointer spotlight. */
export function IconReveal({ text = "Oreo UI", radius = "md", density = "regular", revealed = false, animated = true, className, ...props }: IconRevealProps) {
  const id = useId().replace(/:/g, "");
  const measure = useRef<SVGTextElement>(null);
  const [fontSize, setFontSize] = useState(250);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchReveal, setTouchReveal] = useState(false);
  const reduced = useReducedMotion();
  const instant = reduced || !animated;
  const x = useMotionValue(WIDTH / 2);
  const y = useMotionValue(HEIGHT / 2);
  const smoothX = useSpring(x, { stiffness: 450, damping: 40 });
  const smoothY = useSpring(y, { stiffness: 450, damping: 40 });
  const full = revealed || focused || touchReveal;
  const cell = cells[density];

  useEffect(() => {
    let cancelled = false;
    const fit = () => {
      if (cancelled || !measure.current) return;
      const width = measure.current.getComputedTextLength();
      setFontSize(width > 0 ? Math.min(250, 250 * 950 / width) : 250);
    };
    fit();
    void document.fonts.ready.then(fit);
    return () => { cancelled = true; };
  }, [text]);

  return <div {...props} role="img" tabIndex={0} aria-label={props["aria-label"] ?? `${text}. Move over the letters to reveal icons, or focus to reveal all.`}
    className={cn("w-full select-none rounded-control text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-status-progress focus-visible:ring-offset-4 focus-visible:ring-offset-bg-base", className)}
    onPointerMove={event => {
      props.onPointerMove?.(event);
      if (event.pointerType === "touch") return;
      const box = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - box.left) / box.width * WIDTH);
      y.set((event.clientY - box.top) / box.height * HEIGHT);
      setHovered(true);
    }}
    onPointerLeave={event => { setHovered(false); props.onPointerLeave?.(event); }}
    onPointerDown={event => {
      props.onPointerDown?.(event);
      if (event.pointerType === "touch") setTouchReveal(value => !value);
    }}
    onFocus={event => { setFocused(event.currentTarget.matches(":focus-visible")); props.onFocus?.(event); }}
    onBlur={event => { setFocused(false); setTouchReveal(false); props.onBlur?.(event); }}
    onKeyDown={event => { if (event.key === "Escape") event.currentTarget.blur(); props.onKeyDown?.(event); }}>
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full overflow-visible font-sans" aria-hidden="true">
      <defs>
        <text id={`${id}-text`} x={WIDTH / 2} y={HEIGHT / 2} dy=".35em" textAnchor="middle" fontSize={fontSize} fontWeight="600" letterSpacing="-.055em">{text}</text>
        <clipPath id={`${id}-letters`}><use href={`#${id}-text`} /></clipPath>
        <pattern id={`${id}-icons`} width={cell * 8} height={cell * 4} patternUnits="userSpaceOnUse">
          {Array.from({ length: 32 }, (_, index) => <g key={index} transform={`translate(${index % 8 * cell + 2} ${Math.floor(index / 8) * cell + 2})`}>
            <Icon name={glyphs[(index * 7) % glyphs.length]} style={{ width: cell - 4, height: cell - 4 }} />
          </g>)}
        </pattern>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="white" />
          <stop offset="45%" stopColor="white" stopOpacity=".95" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-spotlight`} maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT}>
          {full ? <rect width={WIDTH} height={HEIGHT} fill="white" /> : <motion.circle cx={instant ? x : smoothX} cy={instant ? y : smoothY} r={radii[radius]} fill={`url(#${id}-gradient)`} />}
        </mask>
      </defs>
      <text ref={measure} fontSize="250" fontWeight="600" letterSpacing="-.055em" visibility="hidden">{text}</text>
      <use href={`#${id}-text`} className="fill-state-press" />
      <motion.g clipPath={`url(#${id}-letters)`} mask={`url(#${id}-spotlight)`} initial={false}
        animate={{ opacity: full || hovered ? 1 : 0 }} transition={{ duration: instant ? 0 : hovered || full ? .15 : .45 }}>
        <rect width={WIDTH} height={HEIGHT} fill={`url(#${id}-icons)`} className="text-text-secondary" />
      </motion.g>
    </svg>
  </div>;
}
