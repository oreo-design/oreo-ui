import type { CSSProperties } from "react";
import type { Box } from "./spec";
import { sizeLabel, type MarqueeGeometry } from "./marquee";

const place = (box: Box, origin: Box): CSSProperties => ({
  left: box.left - origin.left,
  top: box.top - origin.top,
  width: box.right - box.left,
  height: box.bottom - box.top,
});

/**
 * The spec revealed inside the marquee: element outlines and sizes, radii, the
 * padding edge and spacing bands, clipped to the rectangle like a lens. The
 * rectangle's own size sits outside the clip so it stays readable.
 */
export function MarqueeLayer({ rect, geometry, leaving, floor }: { rect: Box; geometry: MarqueeGeometry | null; leaving: boolean; floor: number }) {
  // Below the rectangle unless that falls out of the visible canvas; then inside its bottom edge.
  const sizeTop = rect.bottom + 6 + 16 <= floor ? rect.bottom + 6 : rect.bottom - 22;
  return (
    <div className="pg-marquee" data-leaving={leaving || undefined} aria-hidden="true">
      <div className="pg-marquee-lens" style={place(rect, { left: 0, top: 0, right: 0, bottom: 0 })}>
        {geometry && <>
          {geometry.contents.map(c => <span key={`c${c.id}`} className="pg-marquee-content" style={place(c.box, rect)} />)}
          {geometry.bands.map(b => <span key={b.id} className="pg-marquee-band" data-scale={b.status} style={place(b.band, rect)} />)}
          {geometry.boxes.map(b => <span key={`b${b.id}`} className="pg-marquee-box" data-kind={b.kind} style={place(b.box, rect)} />)}
          {geometry.labels.map(l => (
            <span key={l.id} className="pg-spec-badge pg-marquee-label" data-scale={l.tone} style={{ left: l.x - rect.left, top: l.y - rect.top }}>{l.text}</span>
          ))}
        </>}
      </div>
      <span className="pg-spec-badge pg-marquee-size" style={{ left: (rect.left + rect.right) / 2, top: sizeTop }}>{sizeLabel(rect)}</span>
    </div>
  );
}
