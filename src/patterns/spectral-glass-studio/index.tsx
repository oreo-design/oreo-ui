import { useState, useSyncExternalStore } from "react";
import { SpectralGlass, GLASS_DEFAULTS, type GlassSettings, type GlassTone, type GlassComposition } from "@/components/spectral-glass";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import "./studio.css";
const tones: { value: GlassTone; label: string }[] = [{value:"violet",label:"Violet"},{value:"clear",label:"Crystal"},{value:"amber",label:"Amber"}];
const compositions: { value: GlassComposition; label: string }[] = [{value:"stack",label:"Stack"},{value:"orbit",label:"Orbit"},{value:"single",label:"Single"}];
const opticalControls = [
  {key:"roughness",label:"Roughness",min:0,max:.6,step:.01,hint:"Polished → frosted"},
  {key:"dispersion",label:"Dispersion",min:0,max:1,step:.01,hint:"Separation of transmitted colors"},
  {key:"thickness",label:"Thickness",min:.12,max:.65,step:.01,hint:"Volume and bevel depth"},
  {key:"imperfections",label:"Surface detail",min:0,max:1,step:.01,hint:"Fine scratches and soft smudges"},
  {key:"rotation",label:"View angle",min:-180,max:180,step:1,hint:"Turn the composition"},
] as const;
// Motion's installed hook snapshots the initial preference; subscribe here so
// the control label also follows live OS preference changes, like the renderer.
function subscribeReducedMotion(notify: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function SpectralGlassStudio() {
  const [dark,setDark] = useThemeMode(false);
  const [settings,setSettings] = useState<GlassSettings>({...GLASS_DEFAULTS});
  const [resetKey,setResetKey] = useState(0);
  const reduce = useSyncExternalStore(subscribeReducedMotion, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  function update<K extends keyof GlassSettings>(key:K,value:GlassSettings[K]) { setSettings(s=>({...s,[key]:value})); }
  return <div className={dark?"theme-dark":""}><main className="glass-studio">
    <header className="glass-studio-header"><a href="/spectral-glass">Oreo UI <span>/ Material studies</span></a><div className="flex items-center gap-3"><a href="/spectral-glass?view=docs">Component docs ↗</a><IconButton type="tertiary" aria-label={dark?"Use light theme":"Use dark theme"} icon={<Icon name={dark?"sun":"moon"}/>} onClick={()=>setDark(!dark)}/></div></header>
    <section className="glass-studio-intro"><p className="text-xs tracking-widest text-text-tertiary">MATERIAL STUDY / 001</p><h1>Light, held in glass.</h1><p>A study in volume, reflection and the details that make a surface feel real.</p></section>
    <div className="glass-studio-layout">
      <section className="glass-studio-art" aria-label="Material preview">
        <SpectralGlass key={resetKey} {...settings}/>
        <div className="glass-studio-caption"><span>OPTICAL GLASS <span className="text-text-tertiary">/ {settings.tone.toUpperCase()}</span></span><span>{reduce?"Reduced motion · still study":settings.playing?"16s loop":"Paused"}</span></div>
      </section>
      <aside className="glass-studio-controls" aria-label="Glass properties">
        <div className="flex items-center justify-between gap-4"><h2>Shape the light</h2><Button type="tertiary" size="sm" onClick={()=>{setSettings({...GLASS_DEFAULTS});setResetKey(n=>n+1)}}>Reset</Button></div>
        <fieldset><legend>Material</legend><div className="glass-studio-options">{tones.map(t=><Button key={t.value} type={settings.tone===t.value?"primary":"secondary"} size="sm" aria-pressed={settings.tone===t.value} onClick={()=>update("tone",t.value)}>{t.label}</Button>)}</div></fieldset>
        <fieldset><legend>Composition</legend><div className="glass-studio-options">{compositions.map(c=><Button key={c.value} type={settings.composition===c.value?"primary":"secondary"} size="sm" aria-pressed={settings.composition===c.value} onClick={()=>update("composition",c.value)}>{c.label}</Button>)}</div></fieldset>
        <div className="glass-studio-sliders">{opticalControls.map(c=><label key={c.key}><span><span>{c.label}</span><output>{settings[c.key].toFixed(c.key==="rotation"?0:2)}{c.key==="rotation"?"°":""}</output></span><input type="range" aria-label={c.label} min={c.min} max={c.max} step={c.step} value={settings[c.key]} onChange={e=>update(c.key,Number(e.target.value))}/><small>{c.hint}</small></label>)}</div>
        <Button type="secondary" disabled={!!reduce} aria-pressed={settings.playing && !reduce} onClick={()=>update("playing",!settings.playing)}>{reduce?"Still study · reduced motion":settings.playing?"Pause motion":"Resume motion"}</Button>
        <p className="glass-studio-explainer">A real-time material study inspired by Szymon’s optical glass renders. Explore the component for the rendering recipe and its limits.</p>
      </aside>
    </div>
    <footer className="glass-studio-footer"><span>Form gives light somewhere to go.</span><a href="https://x.com/aecyydesign/status/2112623654530138136?s=20" target="_blank" rel="noreferrer">Reference by @aecyydesign ↗</a></footer>
  </main></div>;
}
