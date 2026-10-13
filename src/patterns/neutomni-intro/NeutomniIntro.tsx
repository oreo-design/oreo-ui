import { useEffect, useRef, useState } from "react";
import { CutReveal } from "@/components/cut-reveal";
import "./neutomni-intro.css";

const SOURCE = "https://neutomni.com/";
const SHOWREEL = "https://pub-72fbbd6aa7d54a70b04aaa87235f19c9.r2.dev/Scene-2%20(1)%20(1).mp4";

export function NeutomniWordmark({ inverse = false }: { inverse?: boolean }) {
  return <span className={inverse ? "neutomni-wordmark neutomni-wordmark--inverse" : "neutomni-wordmark"} role="img" aria-label="Neutomni" />;
}

function StudioClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "shortOffset" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>Local time<br /><time>{time || "Europe / Warsaw"}</time></span>;
}

function StudioHero({ ready }: { ready: boolean }) {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (ready && !preference.matches) setVideoEnabled(true);
    const reduce = () => { if (preference.matches) video.current?.pause(); };
    preference.addEventListener("change", reduce);
    return () => preference.removeEventListener("change", reduce);
  }, [ready]);
  const toggleVideo = () => {
    if (failed || !videoEnabled) {
      setFailed(false);
      setVideoEnabled(true);
    } else if (playing) video.current?.pause();
    else void video.current?.play().catch(() => setFailed(true));
  };
  return <div className="neutomni-hero">
    <header>
      <a href={SOURCE} target="_blank" rel="noreferrer" aria-label="Visit Neutomni, original studio"><NeutomniWordmark /></a>
      <div className="neutomni-nav">
        <p>Digital Design &amp; Webflow Studio</p>
        <nav aria-label="Neutomni studio">
          <a href={`${SOURCE}#process`} target="_blank" rel="noreferrer">Process</a>
          <a href={`${SOURCE}#portfolio`} target="_blank" rel="noreferrer">Portfolio</a>
          <a href={`${SOURCE}#pricing`} target="_blank" rel="noreferrer">Pricing</a>
          <a href="https://calendar.app.google/xy7GT64TvAPQzpbw9" target="_blank" rel="noreferrer">Book a call</a>
        </nav>
        <a className="neutomni-email" href="mailto:contact@neutomni.com">contact@neutomni.com</a>
      </div>
    </header>
    <div className="neutomni-statement"><h1>We build websites for<br className="neutomni-desktop-break" /> people who care<br /><em>as much as we do</em></h1></div>
    <div className="neutomni-showreel">
      {videoEnabled && !failed ? <video ref={video} src={SHOWREEL} poster="/examples/neutomni/project.avif" autoPlay muted loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} aria-label="Neutomni selected project showreel" /> : <img src="/examples/neutomni/project.avif" alt="RSB AC automotive consulting website by Neutomni" width={1200} height={900} />}
      <button onClick={toggleVideo} aria-label={failed ? "Retry showreel" : playing ? "Pause showreel" : "Play showreel"}>{playing ? "Ⅱ" : "▶"}</button>
      {failed && <span className="neutomni-media-fallback">Showreel unavailable · project still</span>}
    </div>
    <footer className="neutomni-footer"><StudioClock /><span>✦ Open for work</span></footer>
  </div>;
}

/** Branded reference fixture. CutReveal itself has no dependency on these assets. */
export function NeutomniIntro({ duration = 5200 }: { duration?: number }) {
  const [ready, setReady] = useState(false);
  return <CutReveal className="neutomni-intro" wordmark={<NeutomniWordmark inverse />} duration={duration} onReveal={() => setReady(true)}><StudioHero ready={ready} /></CutReveal>;
}
