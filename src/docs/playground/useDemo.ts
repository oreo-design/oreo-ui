import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { DemoPlayer, type DemoStatus } from "./demo";
import type { PlaygroundSpec, Values } from "./schema";

export function useDemo(spec: PlaygroundSpec, apply: (values: Values) => void) {
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
    const onHidden = () => { if (document.hidden) player?.pause(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => { player?.dispose(); document.removeEventListener("visibilitychange", onHidden); };
  }, [player]);
  return { player, status, label };
}
