import { useEffect, useRef, useState } from "react";
import { AgentWorkspaceState } from "@/components/automation";
import { GLASS_DEFAULTS, type GlassSettings } from "./material";
import "./spectral-glass.css";
export * from "./material";
export interface SpectralGlassProps extends Partial<GlassSettings> {
  label?: string;
  className?: string;
}
/** Self-contained decorative 3D artwork. Hosts own controls and content. */
export function SpectralGlass({ label = "Bevelled optical glass with colored studio reflections", className = "", ...props }: SpectralGlassProps) {
  const settings = { ...GLASS_DEFAULTS, ...props };
  const latest = useRef(settings); latest.current = settings;
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ReturnType<typeof import("./scene").createGlassScene> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const fail = () => { engine.current?.dispose(); engine.current = null; if (!cancelled) setStatus("error"); };
    import("./scene").then(({ createGlassScene }) => {
      if (cancelled || !host.current) return;
      try { engine.current = createGlassScene(host.current, latest.current, fail); setStatus("ready"); }
      catch { fail(); }
    }).catch(fail);
    return () => { cancelled = true; engine.current?.dispose(); engine.current = null; };
  }, [attempt]);
  useEffect(() => { engine.current?.update(settings); }, [props.tone, props.composition, props.roughness, props.dispersion, props.thickness, props.imperfections, props.rotation, props.playing]);
  return <div className={`spectral-glass ${className}`} data-state={status}>
    <div ref={host} className="spectral-glass-canvas" role="img" aria-label={label} aria-busy={status === "loading"} />
    {status === "loading" && <div className="spectral-glass-state" role="status"><span className="spectral-glass-skeleton" /><span>Preparing glass study…</span></div>}
    {status === "error" && <div className="spectral-glass-state spectral-glass-error"><AgentWorkspaceState error title="Glass preview unavailable" description="This preview needs WebGL 2. Try again after enabling hardware acceleration." actionLabel="Retry preview" onAction={() => setAttempt(n => n + 1)} /></div>}
  </div>;
}
