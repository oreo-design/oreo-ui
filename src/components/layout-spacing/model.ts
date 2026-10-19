/** Opt-in page composition values. All lengths are CSS pixels on Oreo's 4px layout scale. */
export type SpacingValues = {
  sidebar: number;
  page: number;
  section: number;
  grid: number;
  card: number;
};
export type SpacingKey = keyof SpacingValues;
export const SPACING_FIELDS = [
  {
    key: "sidebar",
    label: "Sidebar width",
    token: "--layout-sidebar",
    min: 160,
    max: 320,
    description: "Room for navigation labels.",
    rule: "Let navigation fit its content; a rail and a full sidebar need different widths.",
  },
  {
    key: "page",
    label: "Page inset",
    token: "--layout-page",
    min: 12,
    max: 64,
    description: "Space around the whole content area.",
    rule: "Keep the page boundary distinct from the content inside it.",
  },
  {
    key: "section",
    label: "Section gap",
    token: "--layout-section",
    min: 12,
    max: 64,
    description: "Separation between different groups.",
    rule: "Different groups usually need more separation than items within one group.",
  },
  {
    key: "grid",
    label: "Card gap",
    token: "--layout-grid",
    min: 4,
    max: 32,
    description: "Distance between related cards.",
    rule: "Keep related cards close enough to read as one group.",
  },
  {
    key: "card",
    label: "Card padding",
    token: "--layout-card",
    min: 8,
    max: 40,
    description: "Breathing room inside each card.",
    rule: "Use a shared inset within a card family; dense rows can use a smaller inset.",
  },
] as const;
export const SPACING_PRESETS = {
  Balanced: { sidebar: 240, page: 32, section: 40, grid: 16, card: 24 },
  Compact: { sidebar: 208, page: 24, section: 32, grid: 12, card: 16 },
  Reference: { sidebar: 248, page: 40, section: 48, grid: 12, card: 24 },
} satisfies Record<string, SpacingValues>;
export const INITIAL_BASELINE: SpacingValues = {
  sidebar: 184,
  page: 20,
  section: 20,
  grid: 20,
  card: 12,
};
export function spacingVariables(
  values: SpacingValues,
): Record<string, string> {
  return Object.fromEntries(
    SPACING_FIELDS.map((field) => [field.token, `${values[field.key]}px`]),
  );
}
export function spacingCSS(values: SpacingValues) {
  return `.my-layout {\n${SPACING_FIELDS.map((field) => `  ${field.token}: ${values[field.key]}px;`).join("\n")}\n}\n\n/* <LayoutScope className="my-layout"> … </LayoutScope>\n   Omit the values prop when using this CSS recipe. Load this rule\n   after layout-spacing.css. Sidebar width applies to desktop;\n   adapt navigation at the breakpoint your content needs. */`;
}
