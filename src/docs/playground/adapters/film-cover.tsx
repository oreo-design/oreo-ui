import {
  FilmCoverUpload,
  FilmReveal,
  MediaTray,
} from "@/components/film-cover";
import { FilmCoverDemo } from "@/patterns/film-cover-studio";
import { SAMPLE_PHOTOS } from "@/patterns/film-cover-studio/use-local-cover";
import { definePlayground as define, number, toggle, text } from "../schema";
import type { PlaygroundSpec } from "../schema";
const source = "film-cover",
  exports = { "film-cover": { FilmCoverUpload, FilmReveal, MediaTray } };
const specs: Record<string, PlaygroundSpec> = {
  "film-cover-upload": {
    ...define(
      "Film Cover Upload",
      { disabled: toggle(false), emptyLibrary: toggle(false) },
      (v) => (
        <FilmCoverDemo disabled={v.disabled} emptyLibrary={v.emptyLibrary} />
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        'import { useEffect, useRef, useState } from "react";',
        'import { FilmCoverUpload, validateCover, type FilmAsset, type CoverStatus } from "@/components/film-cover";',
      ],
      setup: [
        "const [cover, setCover] = useState<FilmAsset | null>(null);",
        'const [status, setStatus] = useState<CoverStatus>("empty");',
        'const [error, setError] = useState("");',
        "const ownedUrls = useRef<string[]>([]), request = useRef(0);",
        "useEffect(() => () => { request.current++; ownedUrls.current.forEach(URL.revokeObjectURL); }, []);",
        'const remove = () => { request.current++; setCover(null); setError(""); setStatus("empty"); };',
        'const selectFiles = async (files: File[]) => { const file = files[0]; if (!file) return; const problem = files.length > 1 ? "Choose one image." : validateCover(file); if (problem) { setError(problem); return; } const current = ++request.current, src = URL.createObjectURL(file); ownedUrls.current.push(src); setError(""); setStatus("loading"); setCover({id:src,src,name:file.name,alt:file.name,size:file.size}); try { const image = new Image(); image.src = src; await image.decode(); if (current === request.current) setStatus("ready"); } catch { if (current === request.current) { setStatus("error"); setError("This image could not be opened. Choose another image."); } } };',
      ],
      jsx: `<FilmCoverUpload value={cover} status={status} error={error} onFiles={selectFiles} onRemove={remove} onCancel={remove} disabled={${v.disabled}} />`,
      notes: [
        "For a real upload, the host supplies loading/progress and changes to ready only after confirmed success. The complete template demonstrates cancellable local preparation.",
      ],
    }),
  },
  "film-reveal": {
    ...define(
      "Film Reveal",
      { progress: number(0.35, 0, 1, 0.01), animate: toggle(true) },
      (v) => (
        <div className="w-full max-w-lg aspect-[8/5] overflow-hidden rounded-xl m-6">
          <FilmReveal
            src={SAMPLE_PHOTOS[0].src}
            alt={SAMPLE_PHOTOS[0].alt}
            progress={v.progress}
            animate={v.animate}
          />
        </div>
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: ['import { FilmReveal } from "@/components/film-cover";'],
      setup: [],
      jsx: `<div style={{aspectRatio:"8 / 5"}}><FilmReveal src="/your-cover.jpg" alt="Describe your cover" progress={${v.progress}} animate={${v.animate}} /></div>`,
      notes: [
        "Progress is normalized from 0 to 1. Cross-origin shader images need CORS; the normal image stays available as fallback.",
      ],
    }),
  },
  "media-tray": {
    ...define(
      "Media Tray",
      { selected: text(""), disabled: toggle(false), empty: toggle(false) },
      (v, set) => (
        <div className="w-full max-w-xs m-6">
          <MediaTray
            assets={v.empty ? [] : SAMPLE_PHOTOS}
            selectedId={v.selected}
            disabled={v.disabled}
            onSelect={(a) => set("selected", a.id)}
          />
        </div>
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        'import { useState } from "react";',
        'import { MediaTray } from "@/components/film-cover";',
      ],
      setup: [
        `const [selected, setSelected] = useState(${JSON.stringify(v.selected)});`,
        'const photos = [{id:"photo",src:"/your-cover.jpg",name:"Cover photo",alt:"Describe your cover"}];',
      ],
      jsx: `<MediaTray assets={${v.empty ? "[]" : "photos"}} selectedId={selected} onSelect={asset => setSelected(asset.id)} disabled={${v.disabled}} />`,
      notes: [
        "A primary click or Enter/Space selects a photo; drag carries an application/x-oreo-film asset ID for a host-owned lookup.",
      ],
    }),
  },
};
export default specs;
