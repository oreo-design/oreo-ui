import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { DemoPlayer, type DemoStatus } from "./demo";
import type { PlaygroundSpec, Values } from "./schema";

export function useDemo(spec: PlaygroundSpec, apply: (values: Values) => void, autoplay = true) {
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [label, setLabel] = useState("");
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const player = useMemo(() => spec.demo ? new DemoPlayer(spec.demo(Boolean(reducedMotion)), frame => {
    applyRef.current(frame.values);
    setLabel(frame.label);
  }, setStatus) : undefined, [spec, reducedMotion]);
  useEffect(() => {
    setStatus("idle");
    setLabel("");
    // Start only the initial, untouched demo. Returning to the tab must not
    // override an explicit pause or manual takeover.
    let pendingStart = autoplay && !reducedMotion;
    const onVisibility = () => {
      if (document.hidden) player?.pause();
      else if (pendingStart) {
        pendingStart = false;
        player?.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => { player?.dispose(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [player, autoplay, reducedMotion]);
  return { player, status, label };
}
