import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/button";
import "./orbit-gallery.css";

export const ORBIT_LAYOUTS = ["flat", "tilt", "ring", "gallery"] as const;
export type OrbitLayout = typeof ORBIT_LAYOUTS[number];
export type OrbitGalleryItem = { id: string; src: string; title: string; description?: string; alt?: string };
export type OrbitGalleryProps = {
  items: OrbitGalleryItem[];
  layout?: OrbitLayout;
  defaultLayout?: OrbitLayout;
  onLayoutChange?: (layout: OrbitLayout) => void;
  onSelect?: (item: OrbitGalleryItem) => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

function Artwork({ item }: { item: OrbitGalleryItem }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.src]);
  return failed ? <span className="orbit-gallery__fallback">{item.title}<small>Image unavailable</small></span> : <img src={item.src} alt={item.alt ?? item.title} draggable={false} onError={() => setFailed(true)} />;
}

/** A projection of the same orbit in three planes; cards stay upright. */
function position(index: number, count: number, angle: number, size: number, layout: OrbitLayout) {
  const a = index / count * Math.PI * 2 + angle;
  const radius = size * (layout === "tilt" ? 1.1 : layout === "ring" ? .56 : .40);
  const x = Math.sin(a) * radius;
  const y = -Math.cos(a) * radius;
  if (layout === "flat") return { x, y, scale: 1, rotateY: 0, zIndex: index + 1 };
  const depth = Math.cos(a);
  const scale = layout === "tilt" ? 1.7 + depth * .38 : 1 + depth * .3;
  const lean = layout === "tilt" ? .70 : .40;
  const rotation = layout === "tilt" ? -.16 : -.54;
  return {
    x: x * Math.cos(rotation) - y * lean * Math.sin(rotation),
    y: x * Math.sin(rotation) + y * lean * Math.cos(rotation) + (layout === "tilt" ? size * .57 : 0),
    scale,
    rotateY: layout === "tilt" ? Math.sin(a) * -20 : Math.sin(a) * -8,
    zIndex: Math.round((depth + 1) * 100) + 1,
  };
}

export function OrbitGallery({ items, layout: controlledLayout, defaultLayout = "flat", onLayoutChange, onSelect, label = "Selected works", className, style }: OrbitGalleryProps) {
  const [internalLayout, setInternalLayout] = useState(defaultLayout);
  const layout = controlledLayout ?? internalLayout;
  const [angle, setAngle] = useState(0);
  const [instant, setInstant] = useState(false);
  const [size, setSize] = useState(560);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find(item => item.id === selectedId);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef({ x: 0, y: 0, angle: 0, active: false, moved: false });
  const returnFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const headingId = useId();
  // Repeat only decorative copies; exactly one accessible button per item.
  const count = items.length < 12 && items.length > 1 ? items.length * 2 : items.length;

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize(Math.min(entry.contentRect.width, entry.contentRect.height)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element || layout === "gallery" || !items.length) return;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      setInstant(false);
      const delta = (event.deltaY || event.deltaX) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size : 1);
      setAngle(value => value + Math.max(-120, Math.min(120, delta)) * .003);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [layout, items.length, size]);

  useEffect(() => {
    const element = dialog.current;
    if (selected && element && !element.open) element.showModal();
    if (!selected && element?.open) element.close();
  }, [selected]);

  const chooseLayout = (next: OrbitLayout, keyboard = false) => {
    setInstant(keyboard);
    setInternalLayout(next);
    onLayoutChange?.(next);
    drag.current.active = false;
  };
  const chooseItem = (item: OrbitGalleryItem) => {
    if (drag.current.moved) return;
    if (onSelect) onSelect(item);
    else {
      returnFocus.current = document.activeElement as HTMLElement;
      setSelectedId(item.id);
    }
  };
  const close = () => {
    setSelectedId(null);
    returnFocus.current?.focus({ preventScroll: true });
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      drag.current.moved = true;
      // Capture only after movement so ordinary card clicks keep their target.
      event.currentTarget.setPointerCapture(event.pointerId);
      setAngle(drag.current.angle + dx * .008);
    }
  };

  return <section className={cn("orbit-gallery", className)} style={style} aria-label={label}>
    <header className="orbit-gallery__header">
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      <div className="orbit-gallery__layouts" role="group" aria-label="Gallery layout">
        {ORBIT_LAYOUTS.map(mode => <button type="button" key={mode} aria-pressed={layout === mode} onClick={event => chooseLayout(mode, event.detail === 0)}>{mode[0].toUpperCase() + mode.slice(1)}</button>)}
      </div>
    </header>
    <div ref={stage} className="orbit-gallery__stage" data-layout={layout} tabIndex={items.length ? 0 : undefined} role="region" aria-label={layout === "gallery" ? "Artwork grid" : "Artwork gallery. Use left and right arrow keys to rotate."}
      onKeyDown={event => {
        if (layout === "gallery" || !["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
        event.preventDefault();
        setInstant(true);
        drag.current.moved = false;
        setAngle(value => event.key === "Home" ? 0 : value + (event.key === "ArrowRight" ? 1 : -1) * Math.PI * 2 / Math.max(count, 1));
      }}
      onPointerDown={event => {
        if (!event.isPrimary || drag.current.active) return;
        setInstant(false);
        drag.current.moved = false;
        if (layout === "gallery" || event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, angle, active: true, moved: false };
      }}
      onPointerMove={move} onPointerUp={() => { drag.current.active = false; }} onPointerCancel={() => { drag.current.active = false; }} onLostPointerCapture={() => { drag.current.active = false; }}>
      {items.length === 0 ? <p className="orbit-gallery__empty">No works yet. Add images to start your collection.</p> : layout === "gallery" ? <div className="orbit-gallery__grid">
        {items.map(item => <button type="button" key={item.id} onClick={() => chooseItem(item)} aria-label={`View ${item.title}`}><Artwork item={item} /><span>{item.title}</span></button>)}
      </div> : Array.from({ length: count }, (_, index) => {
        const item = items[index % items.length];
        const p = position(index, count, angle, size, layout);
        const duplicate = index >= items.length;
        return <motion.div key={`${item.id}-${index}`} className="orbit-gallery__card" style={{ width: size * .10, marginLeft: -size * .05, zIndex: p.zIndex }}
          initial={false} animate={{ transform: `translate3d(${p.x.toFixed(4)}px, ${p.y.toFixed(4)}px, 0px) scale(${p.scale.toFixed(4)}) rotateY(${p.rotateY.toFixed(4)}deg)` }}
          transition={reduced || instant ? { duration: 0 } : { type: "spring", duration: .5, bounce: .2 }}>
          {duplicate ? <button type="button" aria-hidden="true" tabIndex={-1} className="orbit-gallery__art" onClick={() => chooseItem(item)}><Artwork item={item} /></button> : <button type="button" className="orbit-gallery__art" aria-label={`View ${item.title}`} onClick={() => chooseItem(item)} onFocus={event => { if (layout === "tilt" && event.currentTarget.matches(":focus-visible")) { setInstant(true); setAngle(-index / count * Math.PI * 2); } }} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") drag.current.moved = false; }}><Artwork item={item} /></button>}
        </motion.div>;
      })}
    </div>
    <footer className="orbit-gallery__footer"><span>{layout === "gallery" ? "Select a work to explore" : "Scroll or drag to explore"}</span><span>{items.length ? `01 — ${String(items.length).padStart(2, "0")}` : "00 — 00"}</span></footer>
    <dialog ref={dialog} className="orbit-gallery__dialog" aria-labelledby={headingId} onCancel={close} onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {selected && <div className="orbit-gallery__detail"><Artwork item={selected} /><div className="p-6"><div className="flex items-start justify-between gap-4"><h2 id={headingId} className="text-xl font-medium">{selected.title}</h2><Button type="secondary" size="sm" onClick={close}>Close</Button></div>{selected.description && <p className="mt-3 text-sm leading-6 text-text-secondary">{selected.description}</p>}</div></div>}
    </dialog>
  </section>;
}
