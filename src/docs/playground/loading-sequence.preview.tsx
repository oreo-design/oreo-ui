import { useState } from "react";
import { LoadingSequence, LOADING_SEQUENCE_VARIANTS, type LoadingSequenceVariant } from "@/components/loading-sequence";
import { Button } from "@/components/button";
import { definePlayground, select, text, toggle } from "./schema";
import "./loading-sequence.preview.css";

export const loadingSequenceNames: Record<LoadingSequenceVariant, string> = {
  typography: "Words into place", aperture: "An opening frame", wordmark: "Letters from the dark", curtain: "Lift the curtain",
};

/** Original CSS artwork illustrates the transitions without bundling the
 * reference sites' images, videos or branding into the component. */
export function LoadingSequenceScene({ variant, headline = "Crafting Websites\nthat Feel Good" }: { variant: LoadingSequenceVariant; headline?: string }) {
  if (variant === "typography") return <div className="ols-scene ols-scene-type">
    <div className="ols-scene-top"><span>OREO STUDIO</span><span>DESIGN & DEVELOPMENT</span></div>
    <div className="ols-scene-type-heading">{headline.split("\n").map((line,i)=><div key={i}>{line}</div>)}</div>
    <div className="ols-project"><div className="ols-checker" /><div>INDEPENDENT<br />BY DESIGN.<span>SELECTED WORK · 2026</span></div></div>
    <div className="ols-scene-bottom"><span>Thoughtful details.<br />Memorable experiences.</span><span>LET’S MAKE SOMETHING ↗</span></div>
  </div>;
  if (variant === "aperture") return <div className="ols-scene ols-scene-editorial">
    <div className="ols-scene-top"><span>OREO / CREATIVE STUDIO</span><span>AVAILABLE FOR SELECT PROJECTS</span></div>
    <div className="ols-editorial-grid"><h2>CREATIVE<br />DEVELOPER<span>Ideas made tangible.<br />One detail at a time.</span></h2><div className="ols-art-stack"><div className="ols-sculpture"><i /><i /><i /></div><div className="ols-art-tiles">{Array.from({length:6},(_,i)=><i key={i}/>)}</div><div className="ols-art-stripes" /></div></div>
    <div className="ols-scene-bottom"><span>INDEPENDENT · WORLDWIDE</span><span>SCROLL TO EXPLORE ↓</span></div>
  </div>;
  if (variant === "wordmark") return <div className="ols-scene ols-scene-space"><div className="ols-planet" /><div className="ols-stars" />
    <div className="ols-scene-top"><span>OREO</span><span>A NEW PERSPECTIVE</span></div>
    <div className="ols-hero"><h2><span>INTELLIGENCE</span><span>AT PLANETARY SCALE</span></h2><span className="ols-hero-pill">DISCOVER WHAT’S POSSIBLE ↗</span></div>
    <div className="ols-scene-bottom"><span>SEE THE BIGGER PICTURE</span><span>01 — 04</span></div>
  </div>;
  return <div className="ols-scene ols-scene-landscape"><div className="ols-landscape"><i /><i /><i /></div>
    <div className="ols-scene-top"><span>OREO RETREATS</span><span>A PLACE TO RETURN TO</span></div>
    <div className="ols-hero"><h2><span>UNMATCHED</span><span>ABUNDANCE</span></h2><span className="ols-hero-pill">EXPLORE THE COLLECTION ↗</span></div>
    <div className="ols-scene-bottom"><span>ROOM TO BREATHE</span><span>SCROLL TO DISCOVER ↓</span></div>
  </div>;
}

export const loadingSequencePlayground = definePlayground("Loading Sequence", {
  variant: select(LOADING_SEQUENCE_VARIANTS, "typography"),
  playing: {...toggle(true), label: "Play animation"},
  brand: {...text("OREO"), description: "Wordmark variant"},
  headline: {...text("Crafting Websites\nthat Feel Good", true), description: "Typography variant. Use a new line to split the title."},
}, v => <LoadingSequence {...v}>{LoadingSequenceScene({variant: v.variant, headline: v.headline})}</LoadingSequence>);

export function LoadingSequenceGallery() {
  const [replay, setReplay] = useState(0);
  const [playing, setPlaying] = useState(true);
  return <div className="space-y-4">
    <div className="flex justify-end gap-2"><Button type="tertiary" size="sm" onClick={()=>setPlaying(!playing)}>{playing ? "Pause all" : "Resume all"}</Button><Button type="secondary" size="sm" onClick={()=>{setReplay(replay+1);setPlaying(true);}}>Replay all</Button></div>
    <div className="grid gap-6 xl:grid-cols-2">{LOADING_SEQUENCE_VARIANTS.map((variant,i)=><figure key={variant} className="min-w-0 space-y-3"><LoadingSequence variant={variant} replayKey={replay} playing={playing}><LoadingSequenceScene variant={variant}/></LoadingSequence><figcaption className="flex justify-between gap-3 text-xs"><span><span className="mr-2 text-text-tertiary">0{i+1}</span>{loadingSequenceNames[variant]}</span><code className="text-text-secondary">{variant}</code></figcaption></figure>)}</div>
  </div>;
}
