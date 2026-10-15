import "./type-scale.css";
export type TypeScaleProps = { base?: number; ratio?: number; sample?: string };
export const TYPE_ROLES = [
  { name: "Display", power: 4, text: "Room for good ideas." },
  { name: "Heading 1", power: 3, text: "Make something meaningful." },
  { name: "Heading 2", power: 2, text: "A little clarity goes a long way." },
  {
    name: "Heading 3",
    power: 1,
    text: "Thoughtful tools. Everyday possibilities.",
  },
  {
    name: "Body",
    power: 0,
    text: "Good design makes the next step feel natural. Keep it clear, useful, and human.",
  },
  {
    name: "Caption",
    power: -1,
    text: "Oreo Studio · Brand guidelines · October 2026",
  },
];
export function typeSizes(base = 16, ratio = 1.25) {
  const b = Number.isFinite(base) ? Math.max(12, Math.min(24, base)) : 16;
  const r = Number.isFinite(ratio)
    ? Math.max(1.125, Math.min(1.5, ratio))
    : 1.25;
  return TYPE_ROLES.map((v) => ({
    ...v,
    size: Math.round(b * r ** v.power * 100) / 100,
  }));
}
export function typeScaleCSS(base: number, ratio: number) {
  return `:root {\n${typeSizes(base, ratio)
    .map(
      (r) =>
        `  --type-${r.name.toLowerCase().replaceAll(" ", "-")}: ${r.size / 16}rem;`,
    )
    .join("\n")}\n}`;
}
export function TypeScale({ base = 16, ratio = 1.25, sample }: TypeScaleProps) {
  return (
    <div className="oreo-type-scale">
      {typeSizes(base, ratio).map((r) => (
        <div className="oreo-type-scale-row" key={r.name}>
          <div>
            <strong>{r.name}</strong>
            <small>
              {r.size}px / {(r.size / 16).toFixed(3)}rem
            </small>
          </div>
          <p style={{ fontSize: `${r.size}px` }}>{sample?.trim() || r.text}</p>
        </div>
      ))}
    </div>
  );
}
