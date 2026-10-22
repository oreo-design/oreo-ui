import type { CSSProperties } from "react";
import {
  ArrowLeft, ArrowUpRight, Check, Columns2, Ellipsis, MousePointer2,
  Palette, Pause, Play, RotateCcw, Save, Settings, Share2, SlidersHorizontal, Smartphone, X,
} from "lucide-react";
import preview from "./assets/figma/preview.svg";
import annotation from "./assets/figma/annotation.svg";
import code from "./assets/figma/code.svg";
import desktop from "./assets/figma/desktop.svg";
import tablet from "./assets/figma/tablet.svg";
import chevron from "./assets/figma/chevron.svg";
import copy from "./assets/figma/copy.svg";
import randomize from "./assets/figma/randomize.svg";
import reset from "./assets/figma/reset.svg";
import sparkles from "./assets/figma/sparkles.svg";

/** Exact Figma exports and intrinsic slots; never redraw or stretch these paths. */
export const FIGMA_ICONS = {
  preview: { src: preview, size: 14.6667 }, annotation: { src: annotation, size: 14 },
  code: { src: code, size: 14.6667 }, desktop: { src: desktop, size: 14 }, tablet: { src: tablet, size: 14 },
  chevron: { src: chevron, size: 12 }, copy: { src: copy, size: 14 },
  randomize: { src: randomize, size: 16 }, reset: { src: reset, size: 16 }, sparkles: { src: sparkles, size: 20 },
} as const;
/** Operations absent from the design use one library with explicit semantic mapping. */
const operationIcons = {
  "arrow-left": ArrowLeft, "arrow-out": ArrowUpRight, check: Check,
  "floppy-disk": Save, play: Play, pause: Pause, dots: Ellipsis, palette: Palette,
  mobile: Smartphone, replay: RotateCcw, inspect: MousePointer2, compare: Columns2,
  share: Share2, settings: Settings, sliders: SlidersHorizontal, x: X,
} as const;
export type PlaygroundIconName = keyof typeof FIGMA_ICONS | keyof typeof operationIcons;
export const PLAYGROUND_ICON_NAMES = [...Object.keys(FIGMA_ICONS), ...Object.keys(operationIcons)] as PlaygroundIconName[];
export function PlaygroundIcon({ name }: { name: PlaygroundIconName }) {
  if (name in FIGMA_ICONS) {
    const { src, size } = FIGMA_ICONS[name as keyof typeof FIGMA_ICONS];
    return <span aria-hidden="true" data-icon-source="figma" data-icon-name={name}
      className={`pg-glyph pg-glyph-${name}`} style={{ display: "inline-block", flexShrink: 0,
        width: size, height: size, backgroundColor: "currentColor", maskImage: `url("${src}")`,
        maskSize: "contain", maskPosition: "center", maskRepeat: "no-repeat" } as CSSProperties} />;
  }
  const Glyph = operationIcons[name as keyof typeof operationIcons];
  return <Glyph size={16} strokeWidth={1.5} aria-hidden="true" data-icon-source="lucide" data-icon-name={name} className="shrink-0" />;
}
