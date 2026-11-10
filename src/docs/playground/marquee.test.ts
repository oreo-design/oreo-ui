import assert from "node:assert/strict";
import test from "node:test";
import { bandLabelSpots, clip, cornerRadius, intersects, labelBox, mergeBands, paddingBands, pastThreshold, placeLabels, radiusLabel, radiusScale, rectFrom, sizeLabel, structuralChange } from "./marquee.ts";
import { neighborGaps } from "./spec.ts";

const box = (left: number, top: number, right: number, bottom: number) => ({ left, top, right, bottom });
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

test("the marquee rectangle is normalised whichever way it is dragged", () => {
  assert.deepEqual(rectFrom({ x: 40, y: 10 }, { x: 10, y: 30 }), box(10, 10, 40, 30));
  assert.equal(sizeLabel(box(0, 0, 199.6, 170.2)), "200 × 170");
});

test("a click is not a drag", () => {
  assert.equal(pastThreshold({ x: 0, y: 0 }, { x: 2, y: 2 }), false);
  assert.equal(pastThreshold({ x: 0, y: 0 }, { x: 3, y: 0 }), true);
});

test("touching edges neither intersect nor clip; overlap does", () => {
  const a = box(0, 0, 10, 10);
  assert.equal(intersects(a, box(10, 0, 20, 10)), false);
  assert.equal(clip(a, box(10, 0, 20, 10)), null);
  assert.equal(intersects(a, box(9, 9, 20, 20)), true);
  assert.deepEqual(clip(a, box(4, -5, 20, 6)), box(4, 0, 10, 6));
});

test("corner radius: largest corner, percentages, ellipses and squircle compensation", () => {
  assert.equal(cornerRadius(["16px", "16px", "16px", "16px"], 200, 100), 16);
  assert.equal(cornerRadius(["0px", "12px", "0px", "0px"], 200, 100), 12, "rounded-r-* still has a radius");
  assert.equal(cornerRadius(["50%", "50%", "50%", "50%"], 40, 40), 20);
  assert.equal(cornerRadius(["20px 10px", "0px", "0px", "0px"], 200, 100), 20);
  assert.equal(cornerRadius(["20px", "20px", "20px", "20px"], 200, 100, 1.25), 16, "superellipse renders token × corner scale");
  assert.equal(cornerRadius(["", "auto", "0px", "0px"], 200, 100), 0);
});

test("radius labels read pills as full and ignore square corners", () => {
  assert.equal(radiusLabel(20, 200, 100), "r 20");
  assert.equal(radiusLabel(9999, 80, 32), "r full");
  assert.equal(radiusLabel(16, 80, 32), "r full", "half the height is already a pill");
  assert.equal(radiusLabel(0, 80, 32), null);
});

test("only the project squircle shape receives radius compensation", () => {
  assert.equal(radiusScale("superellipse(1)", "superellipse(1.5)", 1.25), 1, "Chrome serializes round as superellipse(1)");
  assert.equal(radiusScale("round", "round", 1), 1);
  assert.equal(radiusScale("superellipse(1.5)", "superellipse(1.5)", 1.25), 1.25);
  assert.equal(radiusScale("superellipse(1.5)", "", 1.25), 1, "unowned shapes are not compensated");
});

test("padding bands run from the border edge to the content edge", () => {
  const { content, bands } = paddingBands(box(0, 0, 100, 60), [16, 16, 12, 0], [1, 1, 1, 1]);
  assert.deepEqual(content, box(17, 13, 83, 59));
  assert.deepEqual(bands.map(b => [b.side, b.axis, b.value]), [["left", "x", 16], ["right", "x", 16], ["top", "y", 12]], "zero sides are omitted");
  assert.deepEqual(bands[0].band, box(1, 1, 17, 59));
  assert.deepEqual(bands[2].band, box(1, 1, 99, 13));
});

test("gaps pair neighbours by position: rows, stacks, grids and reversed order", () => {
  const row = [box(0, 0, 32, 32), box(44, 4, 120, 28), box(128, 4, 160, 28)];
  assert.deepEqual(neighborGaps(row).map(g => [g.axis, g.a, g.b, g.value]), [["x", 0, 1, 12], ["x", 1, 2, 8]]);
  assert.deepEqual(neighborGaps([...row].reverse()).map(g => [g.axis, g.a, g.b, g.value]), [["x", 1, 0, 8], ["x", 2, 1, 12]], "row-reverse / RTL");
  // 3 × 2 grid with a 4px column gap and a 1px row gap.
  const grid = [0, 1].flatMap(r => [0, 1, 2].map(c => box(c * 24, r * 21, c * 24 + 20, r * 21 + 20)));
  const gaps = neighborGaps(grid);
  assert.equal(gaps.filter(g => g.axis === "x").length, 4);
  assert.equal(gaps.filter(g => g.axis === "y").length, 3, "row gap found between rows, not lost at the wrap");
  assert.ok(gaps.every(g => near(g.value, g.axis === "x" ? 4 : 1)));
  assert.deepEqual(neighborGaps([box(0, 0, 100, 20), box(0, 0, 100, 20)]), [], "overlapping children have no gap");
});

test("repeated gaps along the cross axis merge into one band", () => {
  const column = (top: number) => ({ axis: "x" as const, band: box(20, top, 24, top + 20) });
  const merged = mergeBands([column(21), column(0), column(42)]);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].band, box(20, 0, 24, 62));
  assert.equal(mergeBands([column(0), column(200)]).length, 2, "far apart on the cross axis stays separate");
  assert.equal(mergeBands([column(0), { axis: "x" as const, band: box(20, 0, 28, 20) }]).length, 2, "different distance stays separate");
});

test("touching neighbours block phantom gaps to farther siblings", () => {
  assert.deepEqual(neighborGaps([box(0, 0, 20, 20), box(20, 0, 40, 20), box(40, 0, 60, 20)]), []);
  assert.deepEqual(neighborGaps([box(0, 0, 20, 20), box(0, 20, 20, 40), box(0, 40, 20, 60)]), []);
  assert.deepEqual(neighborGaps([box(0, 0, 24, 24), box(16, 0, 40, 24), box(32, 0, 56, 24), box(48, 0, 72, 24)]), [], "overlapping source icons block farther siblings");
  assert.deepEqual(neighborGaps([box(0, 0, 20, 20), box(20, 0, 40, 20), box(48, 0, 68, 20)]),
    [{ axis: "x", a: 1, b: 2, value: 8 }]);
});

test("labels avoid each other and text; required values never disappear", () => {
  const placed = placeLabels([
    { id: "a", text: "16", tone: "on", at: [{ x: 0, y: 0 }] },
    { id: "b", text: "8", tone: "on", at: [{ x: 4, y: 2 }, { x: 60, y: 0 }] },
    { id: "c", text: "32 × 32", tone: "on", at: [{ x: 2, y: 2 }] },
    { id: "d", text: "12", tone: "off", required: true, at: [{ x: 1, y: 1 }] },
  ]);
  assert.deepEqual(placed.map(l => [l.id, l.x]), [["a", 0], ["b", 60], ["d", 1]]);
  const text = box(0, 0, 100, 20);
  const avoided = placeLabels([
    { id: "size", text: "40 × 24", tone: "on", at: [{ x: 0, y: 2 }, { x: 0, y: 30 }] },
    { id: "pad", text: "10", tone: "on", required: true, at: [{ x: 10, y: 2 }, { x: 10, y: 60 }] },
    { id: "gap", text: "4", tone: "on", required: true, at: [{ x: 50, y: 2 }] },
  ], [text]);
  assert.deepEqual(avoided.map(l => [l.id, l.y]), [["size", 30], ["pad", 60], ["gap", 2]], "text is avoided when possible, values still shown");
  const many = Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, text: "8 × 8", tone: "on" as const, at: [{ x: i * 100, y: 0 }] }));
  assert.equal(placeLabels(many, [], 3).length, 3, "optional labels are capped");
});

test("band values centre on the visible part of the band, then step along it", () => {
  const width = labelBox(0, 0, "16").right;
  const [first, second] = bandLabelSpots(box(0, 100, 400, 116), "y", box(0, 0, 200, 300), "16");
  assert.ok(near(first.x + width / 2, 100), "centred inside the marquee, not on the whole band");
  assert.equal(first.y, 100);
  assert.ok(near(second.x - first.x, width + 4));
  const [top, next] = bandLabelSpots(box(10, 0, 26, 400), "x", box(0, 0, 300, 100), "16");
  assert.ok(near(top.y + 8, 50) && near(top.x + width / 2, 18));
  assert.equal(next.y - top.y, 20, "a vertical strip steps its value along its length");
});

test("lens-edge labels stay whole and a lens too small for a value stays quiet", () => {
  const request = { id: "size", text: "108 × 32", tone: "on" as const, at: [{ x: -10, y: 90 }] };
  const [placed] = placeLabels([request], [], 48, box(0, 0, 80, 60));
  const actual = labelBox(placed.x, placed.y, placed.text);
  assert.ok(actual.left >= 0 && actual.top >= 0 && actual.right <= 80 && actual.bottom <= 60);
  assert.deepEqual(placeLabels([{ ...request, required: true }], [], 48, box(0, 0, 10, 10)), []);
});

test("only structural mutations invalidate cached styles", () => {
  const record = (type: string, attributeName: string | null = null) => ({ type, attributeName }) as MutationRecord;
  assert.equal(structuralChange([record("attributes", "style")]), false, "Motion's per-frame style writes");
  assert.equal(structuralChange([record("attributes", "style"), record("attributes", "class")]), true);
  assert.equal(structuralChange([record("childList")]), true);
});
