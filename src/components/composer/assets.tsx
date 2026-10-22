import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import attach from "./assets/7cd0c.svg";
import mention from "./assets/84658.svg";
import send from "./assets/8f255.svg";
import audio from "./assets/9c50d.svg";
import chevron from "./assets/b474f.svg";
import message from "./assets/78ca9.svg";
import timer from "./assets/61986.svg";
import right from "./assets/651fb.svg";
import help from "./assets/e46ad.svg";
import check from "./assets/9a68e.svg";
import hand from "./assets/2da30.svg";
import shield from "./assets/b54b3.svg";
import warning from "./assets/c2293.svg";
import folder from "./assets/44021.svg";
import mic from "./assets/a387d.svg";
import finder from "./assets/66bf5.png";
import target from "./assets/1c641.svg";
import bulb from "./assets/cb0ff.svg";
import disc from "./assets/eb3b8.svg";
import document from "./assets/2a2ae.svg";
import file from "./assets/531a4.svg";
import archive from "./assets/47996.svg";
import bug from "./assets/5ef0b.svg";
import compact from "./assets/b9964.svg";
import fast from "./assets/15346.svg";
import feedback from "./assets/434f2.svg";
import fork from "./assets/8e036.svg";
import init from "./assets/e4b0d.svg";
import mcp from "./assets/25e5a.svg";
import box from "./assets/20947.svg";
import grip from "./assets/92999.svg";
import steer from "./assets/3b88e.svg";
import trash from "./assets/9ce89.svg";
import more from "./assets/c1dd5.svg";
import claude from "./assets/dc1a3.svg";
import figma from "@/components/icon/assets/brands/figma-color.svg";
import notion from "./assets/7e69d.svg";
import dots from "./assets/6c77e.svg";
import taskCheck from "./assets/d9f77.svg";
import taskWaiting from "./assets/1fa60.svg";
import taskChevron from "./assets/952ca.svg";
import micOutline from "./assets/0f955.svg";
import external from "./assets/d2728.svg";
import suggestion from "./assets/4d19e.svg";
import reset from "./assets/17720.svg";
const assets = {
  reset: { src: reset, width: 16, height: 16 },
  external: { src: external, width: 16, height: 16 },
  suggestion: { src: suggestion, width: 16, height: 16 },
  micOutline: { src: micOutline, width: 20, height: 20 },
  taskCheck: { src: taskCheck, width: 16, height: 16 },
  taskWaiting: { src: taskWaiting, width: 16, height: 16 },
  taskChevron: { src: taskChevron, width: 16, height: 16 },
  attach: { src: attach, width: 20, height: 20 },
  mention: { src: mention, width: 20, height: 20 },
  send: { src: send, width: 20, height: 20 },
  audio: { src: audio, width: 20, height: 20 },
  chevron: { src: chevron, width: 10, height: 10 },
  message: { src: message, width: 20, height: 20 },
  timer: { src: timer, width: 20, height: 20 },
  right: { src: right, width: 16, height: 16 },
  help: { src: help, width: 20, height: 20 },
  check: { src: check, width: 16, height: 16 },
  hand: { src: hand, width: 20, height: 20 },
  shield: { src: shield, width: 20, height: 20 },
  warning: { src: warning, width: 20, height: 20 },
  folder: { src: folder, width: 16, height: 16 },
  mic: { src: mic, width: 20, height: 20 },
  finder: { src: finder, width: 20, height: 20 },
  target: { src: target, width: 20, height: 20 },
  bulb: { src: bulb, width: 20, height: 20 },
  disc: { src: disc, width: 20, height: 20 },
  document: { src: document, width: 20, height: 20 },
  file: { src: file, width: 20, height: 20 },
  archive: { src: archive, width: 20, height: 20 },
  bug: { src: bug, width: 20, height: 20 },
  compact: { src: compact, width: 20, height: 20 },
  fast: { src: fast, width: 20, height: 20 },
  feedback: { src: feedback, width: 20, height: 20 },
  fork: { src: fork, width: 20, height: 20 },
  init: { src: init, width: 20, height: 20 },
  mcp: { src: mcp, width: 20, height: 20 },
  box: { src: box, width: 20, height: 20 },
  grip: { src: grip, width: 16, height: 16 },
  steer: { src: steer, width: 16, height: 16 },
  trash: { src: trash, width: 16, height: 16 },
  more: { src: more, width: 16, height: 16 },
  claude: { src: claude, width: 12, height: 12 },
  figma: { src: figma, width: 20, height: 20 },
  notion: { src: notion, width: 20, height: 20 },
  dots: { src: dots, width: 248, height: 4 },
} as const;
export type ComposerAssetName = keyof typeof assets;
/** Original Figma SVGs at their native dimensions; monochrome masks inherit semantic color. */
export function ComposerAsset({
  name,
  className,
}: {
  name: ComposerAssetName;
  className?: string;
}) {
  const asset = assets[name];
  if (name === "figma")
    return (
      <span aria-hidden className={cn("relative inline-block shrink-0", className)} style={{ width: asset.width, height: asset.height }}>
        <img src={asset.src} alt="" style={{ position: "absolute", left: "23.61%", top: "11.46%", width: "52.78%", height: "79.16%" }} />
      </span>
    );
  if (["claude", "notion", "finder"].includes(name))
    return (
      <img
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt=""
        aria-hidden
        className={cn("shrink-0", className)}
      />
    );
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", className)}
      style={
        {
          width: asset.width,
          height: asset.height,
          backgroundColor: "currentColor",
          maskImage: `url(${JSON.stringify(asset.src)})`,
          maskRepeat: "no-repeat",
          maskPosition: "center",
        } as CSSProperties
      }
    />
  );
}
