/** Spacing redlines for Annotation: visual insets and gaps measured from the rendered DOM. */
export type Box = { left: number; top: number; right: number; bottom: number };
export type Axis = "x" | "y";
export type Callout = {
  /** Stable across frames so tone/opacity transitions follow the same callout. */
  id: string;
  label: string;
  /** "x" measures a horizontal distance (a vertical band), "y" a vertical one. */
  axis: Axis;
  value: number;
  /** Measured span on `axis`, full selected-element extent on the cross axis. */
  band: Box;
  /** Cross-axis range of the content that defines this distance. */
  focus: [number, number];
  /** Badge lane, assigned so neighbouring badges never overlap. */
  lane: number;
  /**
   * "text" when a vertical inset ends at a text line box: that distance comes from
   * type metrics (line height), which the spacing scale does not govern.
   */
  basis: "space" | "text";
};
export type SpecStatus = "on" | "off" | "text";
export type SpacingValue = { id: string; label: string; value: number; token: string | null; status: SpecStatus };

/**
 * A distance is on the spacing scale when it is a half-step multiple of the live
 * `--spacing` unit (Tailwind's `p-0.5`, `gap-1.5`… included). Half a CSS pixel of
 * tolerance absorbs subpixel layout; larger drift means a raw value or text metrics.
 */
export function spacingToken(value: number, unit: number): string | null {
  if (!(unit > 0) || value <= 0) return null;
  const step = unit / 2;
  const steps = Math.round(value / step);
  if (steps < 1 || Math.abs(value - steps * step) > 0.5) return null;
  const multiple = steps / 2;
  return `--spacing × ${Number.isInteger(multiple) ? multiple : multiple.toFixed(1)}`;
}

/** Greedy badge lanes: callouts sorted by centre take the first lane they fit in. */
export function assignLanes(items: { center: number; size: number }[], gap = 4): number[] {
  const lanes: number[] = [];
  const order = items.map((item, index) => ({ ...item, index })).sort((a, b) => a.center - b.center);
  const result = new Array<number>(items.length).fill(0);
  for (const item of order) {
    const start = item.center - item.size / 2;
    let lane = lanes.findIndex(end => end + gap <= start);
    if (lane < 0) lane = lanes.push(-Infinity) - 1;
    lanes[lane] = item.center + item.size / 2;
    result[item.index] = lane;
  }
  return result;
}

/** Approximate pill width; mono digits keep this stable while values count. */
export const badgeSize = (value: number) => 14 + String(Math.round(value)).length * 7;

export const statusOf = (callout: Pick<Callout, "basis" | "value">, unit: number): SpecStatus =>
  callout.basis === "text" ? "text" : spacingToken(callout.value, unit) ? "on" : "off";

/** Alpha-zero computed colors only; `rgb(0, 0, 0)` is opaque black, not transparent. */
export const transparent = (color: string) =>
  color === "transparent" || /^rgba\([^,]+,[^,]+,[^,]+,\s*0(\.0+)?\)$/.test(color) || /\/\s*0(\.0+)?\)$/.test(color);
const replaced = new Set(["svg", "img", "video", "canvas", "input", "textarea", "select", "iframe", "picture"]);

/** A content node and the stable id of the selected element's child it belongs to. */
export type LeafRef = { node: Text | Element; child: number };
type Leaf = { box: Box; child: number; text: boolean };

// Stable child identities keep gap ids attached to the same pair of children
// when siblings appear or disappear mid-morph.
const nodeIds = new WeakMap<Node, number>();
let nextNodeId = 0;
export const idOf = (node: Node) => {
  let id = nodeIds.get(node);
  if (id === undefined) nodeIds.set(node, (id = ++nextNodeId));
  return id;
};

/**
 * Painted or replaced descendants count as content; everything else is walked for
 * text. This reads computed styles, so callers cache it while only geometry moves;
 * `transparentNodes` collects skipped opacity-0 elements for that cache to watch.
 */
export function collectLeaves(element: Element, transparentNodes?: Element[]): LeafRef[] {
  const leaves: LeafRef[] = [];
  const rootBox = element.getBoundingClientRect();
  const visit = (node: Node, child: number) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) leaves.push({ node: node as Text, child });
      return;
    }
    if (!(node instanceof Element)) return;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return;
    if (style.opacity === "0") {
      // Fully transparent content is not visible yet, but a fade may be starting:
      // report it so callers can re-collect once it becomes visible.
      transparentNodes?.push(node);
      return;
    }
    // `display: contents` wrappers have no box of their own; their children do.
    if (style.display === "contents") {
      node.childNodes.forEach(next => visit(next, child));
      return;
    }
    const r = node.getBoundingClientRect();
    // Visually hidden helpers (sr-only, clipped) are not layout content.
    if (r.width <= 1 && r.height <= 1) return;
    if (style.clipPath !== "none" && style.clipPath.startsWith("inset(50%")) return;
    // Mask-drawn glyphs paint their background color through the mask.
    const painted = !transparent(style.backgroundColor) || style.backgroundImage !== "none" || style.maskImage !== "none"
      || (parseFloat(style.borderTopWidth) > 0 && !transparent(style.borderTopColor));
    const isReplaced = replaced.has(node.tagName.toLowerCase());
    if (isReplaced || painted) {
      // Full-bleed state/background layers describe the container, not its content.
      const covers = r.width >= (rootBox.right - rootBox.left) - 1 && r.height >= (rootBox.bottom - rootBox.top) - 1;
      if (!covers) leaves.push({ node, child });
      if (!covers || isReplaced) return;
    }
    node.childNodes.forEach(next => visit(next, child));
  };
  element.childNodes.forEach(node => visit(node, idOf(node)));
  return leaves;
}

/** Rendered-pixels-per-CSS-pixel of an element, so CSS lengths match zoomed rects. */
const zoomOf = (element: Element) => {
  const height = (element as HTMLElement).offsetHeight;
  return height > 0 ? element.getBoundingClientRect().height / height : 1;
};

/**
 * Text is measured by its line boxes, as design tools do: each line's glyph box is
 * grown to the computed line height around its centre (half-leading on both sides).
 */
function textBox(node: Text, range: Range): Box | null {
  range.selectNodeContents(node);
  const lines = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
  if (!lines.length) return null;
  const parent = node.parentElement;
  const lineHeight = parent ? parseFloat(getComputedStyle(parent).lineHeight) : NaN;
  const half = Number.isFinite(lineHeight) && parent ? (lineHeight * zoomOf(parent)) / 2 : 0;
  return union(lines.map(r => {
    const middle = (r.top + r.bottom) / 2;
    return half ? { left: r.left, right: r.right, top: middle - half, bottom: middle + half } : r;
  }));
}

/** Current rects of cached leaves; cheap enough to read every frame. */
function rectsOf(leaves: LeafRef[]): Leaf[] {
  const range = document.createRange();
  const result: Leaf[] = [];
  for (const { node, child } of leaves) {
    if (!node.isConnected) continue;
    const box = node instanceof Element ? node.getBoundingClientRect() : textBox(node, range);
    if (box && box.right - box.left > 0 && box.bottom - box.top > 0) result.push({ box, child, text: !(node instanceof Element) });
  }
  return result;
}

function union(boxes: Box[]): Box {
  return {
  left: Math.min(...boxes.map(b => b.left)), top: Math.min(...boxes.map(b => b.top)),
  right: Math.max(...boxes.map(b => b.right)), bottom: Math.max(...boxes.map(b => b.bottom)),
  };
}

/**
 * Callouts for an element's visual insets (padding edge → nearest content) and
 * the gaps between its laid-out children, converted into overlay coordinates by
 * `toLocal`, which also removes any device zoom; values are therefore CSS
 * pixels of the previewed screen.
 */
export function measureCallouts(element: Element, toLocal: (box: Box) => Box, cached?: LeafRef[], limit = 8): Callout[] {
  const rootRect = element.getBoundingClientRect();
  const leaves = rectsOf(cached ?? collectLeaves(element));
  if (!leaves.length) return [];
  // Distances start inside the border (the padding edge), so a 1px border does
  // not turn an on-scale padding into an off-scale value.
  const style = getComputedStyle(element), zoom = zoomOf(element);
  const border = (side: "Top" | "Right" | "Bottom" | "Left") => (parseFloat(style[`border${side}Width`]) || 0) * zoom;
  const root = toLocal({
    left: rootRect.left + border("Left"), right: rootRect.right - border("Right"),
    top: rootRect.top + border("Top"), bottom: rootRect.bottom - border("Bottom"),
  });
  const local = leaves.map(leaf => ({ ...leaf, box: toLocal(leaf.box) }));
  const content = union(local.map(l => l.box));
  const callouts: Omit<Callout, "lane">[] = [];
  const pick = (better: (a: Box, b: Box) => boolean) => local.reduce((best, l) => better(l.box, best.box) ? l : best);
  const insets: [string, string, Axis, number, number, Leaf][] = [
    ["inset-left", "Left inset", "x", root.left, content.left, pick((a, b) => a.left < b.left)],
    ["inset-right", "Right inset", "x", content.right, root.right, pick((a, b) => a.right > b.right)],
    ["inset-top", "Top inset", "y", root.top, content.top, pick((a, b) => a.top < b.top)],
    ["inset-bottom", "Bottom inset", "y", content.bottom, root.bottom, pick((a, b) => a.bottom > b.bottom)],
  ];
  for (const [id, label, axis, start, end, { box: definer, text }] of insets) {
    if (end - start < 0.5) continue;
    callouts.push(axis === "x"
      ? { id, label, axis, basis: "space", value: end - start, band: { left: start, right: end, top: root.top, bottom: root.bottom }, focus: [definer.top, definer.bottom] }
      : { id, label, axis, basis: text ? "text" : "space", value: end - start, band: { top: start, bottom: end, left: root.left, right: root.right }, focus: [definer.left, definer.right] });
  }
  // Gaps between consecutive laid-out children, in DOM order.
  const children = [...new Set(local.map(l => l.child))].map(child => ({ child, ...union(local.filter(l => l.child === child).map(l => l.box)) }));
  let gapIndex = 0;
  for (let i = 1; i < children.length && gapIndex < limit; i++) {
    const a = children[i - 1], b = children[i];
    const id = `gap-${a.child}-${b.child}`;
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    if (b.left - a.right >= 0.5 && overlapY > 0) {
      callouts.push({ id, label: `Gap ${gapIndex + 1}`, axis: "x", basis: "space", value: b.left - a.right,
        band: { left: a.right, right: b.left, top: root.top, bottom: root.bottom }, focus: [Math.max(a.top, b.top), Math.min(a.bottom, b.bottom)] });
      gapIndex++;
    } else if (b.top - a.bottom >= 0.5 && overlapX > 0) {
      callouts.push({ id, label: `Gap ${gapIndex + 1}`, axis: "y", basis: "space", value: b.top - a.bottom,
        band: { top: a.bottom, bottom: b.top, left: root.left, right: root.right }, focus: [Math.max(a.left, b.left), Math.min(a.right, b.right)] });
      gapIndex++;
    }
  }
  const lanesFor = (axis: Axis) => {
    const items = callouts.filter(c => c.axis === axis);
    const lanes = assignLanes(items.map(c => ({
      center: axis === "x" ? (c.band.left + c.band.right) / 2 : (c.band.top + c.band.bottom) / 2,
      // Vertical badges stack beside each other horizontally, so their height matters.
      size: axis === "x" ? badgeSize(c.value) : 20,
    })));
    return new Map(items.map((c, i) => [c.id, lanes[i]]));
  };
  const lanes = new Map([...lanesFor("x"), ...lanesFor("y")]);
  return callouts.map(c => ({ ...c, lane: lanes.get(c.id) ?? 0 }));
}

export const calloutSignature = (callouts: Callout[]) =>
  callouts.map(c => `${c.id}:${c.band.left.toFixed(1)},${c.band.top.toFixed(1)},${c.band.right.toFixed(1)},${c.band.bottom.toFixed(1)},${c.lane}`).join("|");
