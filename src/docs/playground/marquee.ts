/**
 * Marquee inspection for Preview: drag across empty canvas and everything the
 * rectangle touches shows its size, radius, padding and gaps. Unlike Annotation's
 * visual insets (edge to nearest glyph), these are the declared layout: padding
 * edges and the space between neighbouring child boxes, never distributed or
 * auto-margin slack. Computed styles are read once per drag; geometry every frame.
 */
import { isPainted, isRendered, isTransparent, neighborGaps, REPLACED, statusOf, type Axis, type Box, type SpecStatus } from "./spec.ts";

export type Point = { x: number; y: number };
export const rectFrom = (a: Point, b: Point): Box => ({
  left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), right: Math.max(a.x, b.x), bottom: Math.max(a.y, b.y),
});
export const intersects = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
/** Intersection of two boxes, or null when they do not overlap. */
export function clip(a: Box, b: Box): Box | null {
  const box = { left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) };
  return box.right > box.left && box.bottom > box.top ? box : null;
}
/** A click wobbles a pixel or two; only a deliberate drag starts inspecting. */
export const DRAG_THRESHOLD = 3;
export const pastThreshold = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y) >= DRAG_THRESHOLD;

/** Chrome also serializes ordinary round corners as superellipse(1). Only the
 * project's compensated shape should be converted back to its unscaled token. */
export function radiusScale(shape: string, projectShape: string, scale: number): number {
  return projectShape.trim() !== "" && projectShape.trim() !== "round"
    && shape.trim() === projectShape.trim() && scale > 0 ? scale : 1;
}

/**
 * Largest corner radius in CSS px from computed corner values ("16px", "50%",
 * "20px 10px"). Percentages resolve against the shorter side. Oreo squircles
 * render `radius × --oreo-corner-scale` for a superellipse; `cornerScale` undoes
 * that so the label reports the token, not the compensated value.
 */
export function cornerRadius(corners: string[], width: number, height: number, cornerScale = 1): number {
  const px = corners.map(value => {
    const first = value.trim().split(/\s+/)[0] ?? "";
    const n = parseFloat(first);
    if (!Number.isFinite(n)) return 0;
    return first.endsWith("%") ? (n / 100) * Math.min(width, height) : n;
  });
  return Math.max(0, ...px) / (cornerScale > 0 ? cornerScale : 1);
}
/** Radius label: pills read as "full" rather than a clamped 9999px. */
export function radiusLabel(radius: number, width: number, height: number): string | null {
  if (!(radius >= 0.5)) return null;
  return radius >= Math.min(width, height) / 2 - 0.5 ? "r full" : `r ${Math.round(radius)}`;
}
export const sizeLabel = (box: Box) => `${Math.round(box.right - box.left)} × ${Math.round(box.bottom - box.top)}`;

type Side = "left" | "right" | "top" | "bottom";
const SIDES: Side[] = ["left", "right", "top", "bottom"];
/** Padding bands, border edge to content edge, and the content box they leave. */
export function paddingBands(box: Box, padding: number[], border: number[]) {
  const [pl, pr, pt, pb] = padding, [bl, br, bt, bb] = border;
  const inner = { left: box.left + bl, right: box.right - br, top: box.top + bt, bottom: box.bottom - bb };
  const content = { left: inner.left + pl, right: inner.right - pr, top: inner.top + pt, bottom: inner.bottom - pb };
  const bands: { side: Side; axis: Axis; value: number; band: Box }[] = [
    { side: "left", axis: "x", value: pl, band: { ...inner, right: content.left } },
    { side: "right", axis: "x", value: pr, band: { ...inner, left: content.right } },
    { side: "top", axis: "y", value: pt, band: { ...inner, bottom: content.top } },
    { side: "bottom", axis: "y", value: pb, band: { ...inner, top: content.bottom } },
  ];
  return { content, bands: bands.filter(b => b.value >= 0.5) };
}

/**
 * Same distance repeated along its cross axis (a grid's column gap on every row,
 * a wrapper and its only child) is drawn as one band.
 */
export function mergeBands<T extends { axis: Axis; band: Box }>(items: T[], reach = 24): T[] {
  const merged: T[] = [];
  const key = (item: T) => item.axis === "x" ? [item.band.left, item.band.right] : [item.band.top, item.band.bottom];
  const cross = (box: Box, axis: Axis): [number, number] => axis === "x" ? [box.top, box.bottom] : [box.left, box.right];
  for (const item of [...items].sort((a, b) => cross(a.band, a.axis)[0] - cross(b.band, b.axis)[0])) {
    const [start, end] = key(item);
    const twin = merged.find(other => other.axis === item.axis
      && Math.abs(key(other)[0] - start) < 0.5 && Math.abs(key(other)[1] - end) < 0.5
      && cross(item.band, item.axis)[0] <= cross(other.band, other.axis)[1] + reach
      && cross(other.band, other.axis)[0] <= cross(item.band, item.axis)[1] + reach);
    if (!twin) {
      merged.push({ ...item });
      continue;
    }
    twin.band = { left: Math.min(twin.band.left, item.band.left), top: Math.min(twin.band.top, item.band.top), right: Math.max(twin.band.right, item.band.right), bottom: Math.max(twin.band.bottom, item.band.bottom) };
  }
  return merged;
}

type Child = { element: Element; auto: Record<Side, boolean> };
type Entry = {
  element: Element;
  /** "box": painted or replaced (outlined with its size); "text": owns a text run. */
  kind: "box" | "text" | null;
  radius: number;
  /** Laid-out element children (through `display: contents`), for gaps. */
  children: Child[];
  /** Axis whose free space is distributed (space-between…): not a declared gap. */
  slack: Axis | null;
  /** Computed padding and border widths (CSS px), in left/right/top/bottom order. */
  padding: number[];
  border: number[];
  unit: number;
  /** Clipping ancestors (overflow or paint containment), innermost last. */
  clips: Element[];
};
/** `transparent`: skipped opacity-0 nodes, re-checked so mid-drag fade-ins join. */
export type Inspection = { entries: Entry[]; transparent: Element[] };

/** A safety cap for pathological trees; real components stay far below it. */
const MAX_ENTRIES = 1500;
/** Sizes and radii beyond this are noise; spacing values are always shown. */
const MAX_OPTIONAL_LABELS = 48;

/** `margin: auto` resolves to a px value in getComputedStyle; the typed OM keeps the keyword. */
function autoMargins(element: Element): Record<Side, boolean> {
  const none = { left: false, right: false, top: false, bottom: false };
  try {
    const map = (element as HTMLElement).computedStyleMap?.();
    if (!map) return none;
    return Object.fromEntries(SIDES.map(side => [side, String(map.get(`margin-${side}`)) === "auto"])) as Record<Side, boolean>;
  } catch {
    return none;
  }
}

/** Reads computed styles once per drag (or after DOM changes); geometry is read per frame. */
export function inspect(root: Element): Inspection {
  const entries: Entry[] = [], transparentNodes: Element[] = [];
  const visit = (element: Element, clips: Element[]) => {
    if (entries.length >= MAX_ENTRIES) return;
    const style = getComputedStyle(element);
    if (!isRendered(element, style)) return;
    if (isTransparent(style)) {
      transparentNodes.push(element);
      return;
    }
    if (style.display === "contents") {
      [...element.children].forEach(child => visit(child, clips));
      return;
    }
    const rect = element.getBoundingClientRect();
    if (rect.width <= 1 && rect.height <= 1) return;
    if (style.clipPath.startsWith("inset(50%")) return;
    const painted = isPainted(style);
    const replaced = REPLACED.has(element.tagName.toLowerCase());
    const ownsText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    const flex = style.display.endsWith("flex"), grid = style.display.endsWith("grid");
    const children: Child[] = [];
    const collect = (parent: Element) => [...parent.children].forEach(child => {
      const childStyle = getComputedStyle(child);
      if (!isRendered(child, childStyle)) return;
      if (childStyle.display === "contents") return collect(child);
      // Out-of-flow layers (badges, overlays) are not separated by a gap, and inline
      // content in a block sits in line boxes, whose spacing is type metrics.
      if (childStyle.position === "absolute" || childStyle.position === "fixed") return;
      if (!flex && !grid && childStyle.display.startsWith("inline")) return;
      const childRect = child.getBoundingClientRect();
      if (childRect.width > 0 && childRect.height > 0) children.push({ element: child, auto: autoMargins(child) });
    });
    if (!replaced) collect(element);
    const distributed = /space-(between|around|evenly)/;
    const column = style.flexDirection.startsWith("column");
    const slack: Axis | null = flex && distributed.test(style.justifyContent) ? (column ? "y" : "x")
      : flex && distributed.test(style.alignContent) && style.flexWrap !== "nowrap" ? (column ? "x" : "y")
      : grid && distributed.test(style.justifyContent) ? "x" : grid && distributed.test(style.alignContent) ? "y" : null;
    const unzoomed = element as HTMLElement;
    const width = unzoomed.offsetWidth ?? rect.width, height = unzoomed.offsetHeight ?? rect.height;
    const scale = radiusScale(style.getPropertyValue("corner-shape"), style.getPropertyValue("--oreo-corner-shape"),
      parseFloat(style.getPropertyValue("--oreo-corner-scale")));
    // Inline boxes break across lines; their padding is not a rectangle to draw.
    const inline = style.display === "inline";
    entries.push({
      element,
      kind: replaced || painted ? "box" : ownsText ? "text" : null,
      radius: painted || replaced ? cornerRadius([style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius],
        width, height, scale) : 0,
      children: children.length >= 2 ? children : [],
      slack,
      padding: replaced || inline ? [0, 0, 0, 0] : SIDES.map(side => parseFloat(style.getPropertyValue(`padding-${side}`)) || 0),
      border: SIDES.map(side => parseFloat(style.getPropertyValue(`border-${side}-width`)) || 0),
      unit: parseFloat(style.getPropertyValue("--spacing")) || 4,
      clips,
    });
    const clipsChildren = style.overflowX !== "visible" || style.overflowY !== "visible" || /paint|strict|content/.test(style.contain);
    if (!replaced) [...element.children].forEach(child => visit(child, clipsChildren ? [...clips, element] : clips));
  };
  [...root.children].forEach(child => visit(child, []));
  return { entries, transparent: transparentNodes };
}

/** A node skipped as invisible has started to fade in (Motion/WAAPI emit no DOM events). */
export const revealed = (inspection: Inspection) =>
  inspection.transparent.some(node => node.isConnected && !isTransparent(getComputedStyle(node)));

/** DOM changes other than inline-style animation invalidate cached computed styles. */
export const structuralChange = (records: MutationRecord[]) =>
  records.some(record => record.type !== "attributes" || record.attributeName !== "style");

export type MarqueeBox = { id: number; box: Box; kind: "box" | "text" };
/** A value pill at its top-left position (overlay coordinates). */
export type MarqueeLabel = { id: string; x: number; y: number; text: string; tone: SpecStatus };
export type MarqueeBand = { id: string; axis: Axis; band: Box; value: number; status: SpecStatus };
export type MarqueeGeometry = { boxes: MarqueeBox[]; labels: MarqueeLabel[]; contents: { id: number; box: Box }[]; bands: MarqueeBand[] };

/** Approximate 10px mono pill; enough to keep labels from stacking on each other. */
export const labelBox = (x: number, y: number, text: string): Box => ({ left: x, top: y, right: x + Math.max(18, 10 + text.length * 6.2), bottom: y + 16 });

export type LabelRequest = { id: string; text: string; tone: SpecStatus; at: Point[]; required?: boolean };
/**
 * Places labels in order: each takes its first candidate spot that collides with
 * neither a placed label nor an obstacle (text it would cover). Spacing values
 * are required: failing a clear spot they accept covering text, then overlap.
 * Optional sizes/radii are dropped instead, and capped in number.
 */
export function placeLabels(requests: LabelRequest[], obstacles: Box[] = [], maxOptional = MAX_OPTIONAL_LABELS, bounds?: Box): MarqueeLabel[] {
  const placed: MarqueeLabel[] = [];
  let optional = 0;
  for (const { id, text, tone, at, required } of requests) {
    if (!required && optional >= maxOptional) continue;
    const width = labelBox(0, 0, text).right, height = 16;
    // The lens clips its contents. Move whole labels inside it rather than
    // presenting half a number when only part of an element is selected.
    if (bounds && (bounds.right - bounds.left < width || bounds.bottom - bounds.top < height)) continue;
    const candidates = bounds ? at.map(p => ({
      x: Math.max(bounds.left, Math.min(p.x, bounds.right - width)),
      y: Math.max(bounds.top, Math.min(p.y, bounds.bottom - height)),
    })) : at;
    const free = (p: Point) => !placed.some(other => intersects(labelBox(p.x, p.y, text), labelBox(other.x, other.y, other.text)));
    const clear = (p: Point) => free(p) && !obstacles.some(o => intersects(labelBox(p.x, p.y, text), o));
    const spot = candidates.find(clear) ?? (required ? candidates.find(free) ?? candidates[0] : undefined);
    if (!spot) continue;
    placed.push({ id, text, tone, ...spot });
    if (!required) optional++;
  }
  return placed;
}

/**
 * Candidate spots for a distance's value: centred on the part of the band inside
 * the marquee, then shifted along the band so neighbouring values stay apart.
 */
export function bandLabelSpots(band: Box, axis: Axis, area: Box, text: string): Point[] {
  const width = labelBox(0, 0, text).right, height = 16;
  const cx = (Math.max(band.left, area.left) + Math.min(band.right, area.right)) / 2;
  const cy = (Math.max(band.top, area.top) + Math.min(band.bottom, area.bottom)) / 2;
  const step = axis === "y" ? width + 4 : height + 4;
  return [0, 1, -1, 2, -2].map(k => axis === "y"
    ? { x: cx - width / 2 + k * step, y: cy - height / 2 }
    : { x: cx - width / 2, y: cy - height / 2 + k * step });
}

/**
 * Geometry for everything the marquee touches. Rects are read live so motion is
 * followed (CSS transitions, Motion, demo steps) while the pointer is held.
 * Everything is cut to the element's clipping ancestors: scrolled-away table
 * columns are not drawn over the empty canvas.
 */
export function measureMarquee(inspection: Inspection, area: Box, toLocal: (box: Box) => Box): MarqueeGeometry {
  const result: MarqueeGeometry = { boxes: [], labels: [], contents: [], bands: [] };
  const bands: MarqueeBand[] = [];
  const labels: LabelRequest[] = [];
  const obstacles: Box[] = [];
  const clipBoxes = new Map<Element, Box>();
  const clipBox = (element: Element) => {
    let box = clipBoxes.get(element);
    if (!box) clipBoxes.set(element, box = toLocal(element.getBoundingClientRect()));
    return box;
  };
  inspection.entries.forEach((entry, id) => {
    if (!entry.element.isConnected) return;
    let region: Box | null = area;
    for (const ancestor of entry.clips) if (region && ancestor.isConnected) region = clip(region, clipBox(ancestor));
    if (!region) return;
    const view = region;
    const box = toLocal(entry.element.getBoundingClientRect());
    const shown = clip(box, view);
    if (!shown) return;
    // Outlines are drawn to the clip edge (the lens trims them to the marquee).
    let visible = box;
    for (const ancestor of entry.clips) visible = clip(visible, clipBox(ancestor)) ?? visible;
    const width = box.right - box.left, height = box.bottom - box.top;
    if (entry.kind) result.boxes.push({ id, box: visible, kind: entry.kind });
    if (entry.kind === "text") obstacles.push(visible);
    const radius = radiusLabel(entry.radius, width, height);
    if (radius && Math.min(width, height) >= 32) labels.push({ id: `r${id}`, text: radius, tone: "on", at: [{ x: visible.left, y: visible.top - 18 }] });
    if (entry.kind === "box" && width >= 8 && height >= 8) {
      const text = sizeLabel(box);
      labels.push({ id: `s${id}`, text, tone: "on", at: [
        { x: visible.left, y: visible.bottom + 2 },
        { x: visible.right - labelBox(0, 0, text).right, y: visible.bottom + 2 },
        { x: visible.left, y: visible.top - 18 },
      ] });
    }
    // Padding is drawn as declared (border edge to content edge), not as the free
    // space up to the content: alignment slack is layout, not spacing.
    const { content, bands: padding } = paddingBands(box, entry.padding, entry.border);
    if (padding.length) {
      const edge = clip(content, visible);
      if (edge) result.contents.push({ id, box: edge });
      for (const { side, axis, value, band } of padding) {
        const cut = clip(band, view);
        if (cut) bands.push({ id: `${id}:padding-${side}`, axis, band: clip(band, visible) ?? cut, value, status: statusOf({ basis: "space", value }, entry.unit) });
      }
    }
    if (!entry.children.length) return;
    const children = entry.children.map(child => toLocal(child.element.getBoundingClientRect()));
    for (const gap of neighborGaps(children)) {
      if (gap.axis === entry.slack) continue;
      const a = entry.children[gap.a].auto, b = entry.children[gap.b].auto;
      // `ml-auto` and friends absorb free space; that distance is not a declared gap.
      if (gap.axis === "x" ? a.right || b.left : a.bottom || b.top) continue;
      const p = children[gap.a], q = children[gap.b];
      const band = gap.axis === "x"
        ? { left: p.right, right: q.left, top: Math.min(p.top, q.top), bottom: Math.max(p.bottom, q.bottom) }
        : { top: p.bottom, bottom: q.top, left: Math.min(p.left, q.left), right: Math.max(p.right, q.right) };
      const cut = clip(band, view);
      if (cut) bands.push({ id: `${id}:gap-${gap.a}-${gap.b}`, axis: gap.axis, band: clip(band, visible) ?? cut, value: gap.value, status: statusOf({ basis: "space", value: gap.value }, entry.unit) });
    }
  });
  result.bands = mergeBands(bands);
  // Distances are placed first; sizes and radii give way to them.
  result.labels = placeLabels([
    ...result.bands.map(b => {
      const text = String(Math.round(b.value));
      return { id: b.id, text, tone: b.status, required: true, at: bandLabelSpots(b.band, b.axis, area, text) };
    }),
    ...labels,
  ], obstacles, MAX_OPTIONAL_LABELS, area);
  return result;
}

/** Converts viewport rects into the frame's overlay space (device zoom and scroll removed). */
export function localizer(host: HTMLElement, scale: number) {
  const hostRect = host.getBoundingClientRect();
  return (box: Box): Box => ({
    left: (box.left - hostRect.left) / scale + host.scrollLeft,
    right: (box.right - hostRect.left) / scale + host.scrollLeft,
    top: (box.top - hostRect.top) / scale + host.scrollTop,
    bottom: (box.bottom - hostRect.top) / scale + host.scrollTop,
  });
}

/**
 * Bottom of the frame that is actually on screen, in overlay space: the canvas
 * scrolls inside the playground, so a label below the marquee can fall out of view.
 */
export function visibleBottom(host: HTMLElement, scale: number): number {
  let bottom = Math.min(host.getBoundingClientRect().bottom, window.innerHeight);
  for (let node = host.parentElement; node; node = node.parentElement) {
    if (getComputedStyle(node).overflowY !== "visible") bottom = Math.min(bottom, node.getBoundingClientRect().bottom);
  }
  return localizer(host, scale)({ left: 0, right: 0, top: bottom, bottom }).top;
}

/** True when a press lands on the previewed component (or its in-device popups), not on the canvas around it. */
export function onComponent(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(".pg-preview > *, .pg-device-portals > *"));
}
