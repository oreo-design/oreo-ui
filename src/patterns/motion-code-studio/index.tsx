import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CodeFocus, SheetTimeline, SHEET_CODE } from "@/components/motion-code";
import { focusForProgress, progressForFocus, clampProgress } from "@/components/motion-code/model";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useCopy } from "@/lib/use-copy";
import "./studio.css";

/** Complete local study. Nothing runs until the user scrubs or presses Play. */
export function MotionCodeStudio() {
  const [dark, setDark] = useThemeMode(true);
  const [focus, setFocus] = useState(focusForProgress(60));
  const [playing, setPlaying] = useState(false);
  const [scramble, setScramble] = useState(true);
  const [readable, setReadable] = useState(false);
  const [guides, setGuides] = useState(true);
  const reduce = useReducedMotion();
  const { copy, copied } = useCopy();
  const progress = progressForFocus(focus);
  const latest = useRef(progress);
  latest.current = progress;

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const from = latest.current >= 100 ? 0 : latest.current;
    const start = performance.now();
    const tick = (now: number) => {
      // Slowed explanatory playback, rather than a delayed application response.
      const next = clampProgress(from + (now - start) / 36);
      setFocus(focusForProgress(next));
      if (next < 100) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    const stop = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", stop);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", stop); };
  }, [playing]);
  useEffect(() => setPlaying(false), [reduce]);
  const seek = (value: number) => { setPlaying(false); setFocus(focusForProgress(value)); };
  const selectFocus = (value: number) => { setPlaying(false); setFocus(value); };

  return <div className={dark ? "theme-dark" : ""}>
    <main className="motion-code-studio">
      <header className="motion-code-studio__header">
        <a className="motion-code-studio__brand" href="/code-focus"><span className="motion-code-studio__mark" aria-hidden="true">◒</span> Oreo UI <span className="text-text-tertiary">/</span> Motion studies</a>
        <div className="flex items-center gap-2">
          <a className="text-xs text-text-secondary hover:underline" href="/code-focus">Components ↗</a>
          <IconButton type="tertiary" aria-label={dark ? "Use light theme" : "Use dark theme"} icon={<Icon name={dark ? "sun" : "moon"} />} onClick={() => setDark(!dark)} />
        </div>
      </header>
      <section aria-labelledby="motion-code-title">
        <div className="motion-code-studio__intro">
          <div><p className="motion-code-studio__eyebrow">EXPLORATION 01 / CODE & MOTION</p><h1 id="motion-code-title">Motion, in focus.</h1></div>
          <p className="motion-code-studio__description">Move through the code.<br />Watch the motion take shape.</p>
        </div>
        <div className="motion-code-studio__stage">
          <div className="motion-code-studio__stage-header"><span>sheet-in.css</span><span className="motion-code-studio__live"><i /> Interactive study</span></div>
          <div className="motion-code-studio__canvas">
            <CodeFocus code={SHEET_CODE} value={focus} onValueChange={selectFocus} scramble={scramble} label="Explore animation code" />
            <div className="motion-code-studio__preview"><SheetTimeline progress={progress} guides={guides} /><span className="motion-code-studio__preview-label">LIVE PREVIEW</span></div>
          </div>
          <div className="motion-code-studio__transport">
            <Button type="secondary" size="sm" onClick={() => setPlaying(!playing)} leadingIcon={<Icon name={playing ? "pause" : "play"} size="sm" />}>{playing ? "Pause" : "Play"}</Button>
            <Button type="tertiary" size="sm" onClick={() => seek(0)} aria-label="Reset animation"><Icon name="refresh" size="sm" /></Button>
            <label className="motion-code-studio__range"><span className="sr-only">Animation progress</span><input type="range" min="0" max="100" step="1" value={Math.round(progress)} onChange={event => seek(Number(event.target.value))} /><span className="motion-code-studio__position" aria-hidden="true">{Math.round(progress).toString().padStart(3, "0")}%</span></label>
          </div>
        </div>
        <div className="motion-code-studio__below">
          <p>{reduce ? "Reduced motion · text resolves instantly; the preview fades." : "Move to explore · Drag on touch · ↑ ↓ to step"}</p>
          <div className="flex flex-wrap items-center gap-1">
            <Button type="tertiary" size="sm" aria-pressed={scramble} onClick={() => setScramble(!scramble)}>Scramble {scramble ? "on" : "off"}</Button>
            <Button type="tertiary" size="sm" aria-pressed={guides} onClick={() => setGuides(!guides)}>Guides {guides ? "on" : "off"}</Button>
            <Button type="tertiary" size="sm" aria-expanded={readable} onClick={() => setReadable(!readable)}>{readable ? "Hide source" : "Read source"}</Button>
          </div>
        </div>
        {readable && <section className="motion-code-studio__source" aria-label="Readable animation source"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-medium">The complete picture</h2><Button type="secondary" size="sm" onClick={() => copy(SHEET_CODE)}>{copied ? "Copied" : "Copy CSS"}</Button></div><pre><code>{SHEET_CODE}</code></pre><p className="mt-4 text-xs text-text-secondary">Reference CSS for explanation. The interactive preview seeks these keyframes directly; it does not open a real sheet.</p></section>}
      </section>
      <footer className="motion-code-studio__footer"><span>Small details. Better interfaces.</span><a href="https://x.com/emilkowalski/status/2112146246299259017" target="_blank" rel="noreferrer">Inspired by Emil Kowalski ↗</a></footer>
    </main>
  </div>;
}
