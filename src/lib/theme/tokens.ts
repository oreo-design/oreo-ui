/** Shared site-theme tokens. Presets are Oreo interpretations, not vendor kits. */
export const themeNames = ["oreo", "claude", "openai", "ascii"] as const;
export type ThemeName = (typeof themeNames)[number];
export type Variation = { preset: ThemeName; density: number; accent: string | null };
export type ThemeAppearance = {
  dark: boolean; radius: number; library: "phosphor" | "lucide"; variation?: Variation;
};
export const defaultVariation: Variation = { preset: "oreo", density: 1, accent: null };
export const themePresets = {
  oreo: { label: "Oreo Default", radius: 8, density: 1, accent: null },
  claude: { label: "Claude", radius: 8, density: 1.1, accent: "#b45d3a" },
  openai: { label: "OpenAI", radius: 16, density: 1, accent: null },
  ascii: { label: "ASCII", radius: 0, density: 1, accent: null },
} as const;
export function presetAppearance(preset: ThemeName, dark = false): ThemeAppearance {
  const p = themePresets[preset];
  return { dark, radius: p.radius, library: "lucide", variation: { preset, density: p.density, accent: p.accent } };
}
export function parseVariation(value: unknown): Variation {
  if (!value || typeof value !== "object") throw new Error("This theme configuration is not supported. Reset to continue.");
  const source = value as Variation & { preset: string };
  // v1 links/preferences remain readable. Only former preset defaults migrate;
  // explicit custom values keep their meaning in the replacement preset.
  const v = (source.preset as string) === "material" ? {
    ...source, preset: "ascii" as const,
    density: source.density === 1.15 ? themePresets.ascii.density : source.density,
    accent: source.accent?.toLowerCase() === "#6550b9" ? themePresets.ascii.accent : source.accent,
  } : source;
  if (!themeNames.includes(v.preset) || !Number.isFinite(v.density) || v.density < 0.75 || v.density > 1.25 || !(v.accent === null || (typeof v.accent === "string" && /^#[0-9a-f]{6}$/i.test(v.accent))))
    throw new Error("This theme configuration is not supported. Reset to continue.");
  return { preset: v.preset, density: v.density, accent: v.accent?.toLowerCase() ?? null };
}
/** Shared migration for persisted preferences, saved comparisons and shared URLs. */
export function parseAppearanceVariation(radius: number, value: unknown) {
  const legacy = value && typeof value === "object" && "preset" in value && value.preset === "material";
  return {
    radius: legacy && radius === 20 ? themePresets.ascii.radius : radius,
    variation: value === undefined ? { ...defaultVariation } : parseVariation(value),
  };
}
export function isCustomized(a: ThemeAppearance) {
  const v = a.variation ?? defaultVariation, p = themePresets[v.preset];
  return a.library !== "lucide" || a.radius !== p.radius || v.density !== p.density || v.accent !== p.accent;
}
/** Choose black/white by WCAG relative luminance; arbitrary accent inputs stay readable. */
export function accentForeground(hex: string) {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return (luminance + 0.05) / 0.05 > 1.05 / (luminance + 0.05) ? "#000000" : "#ffffff";
}
export function variationTokens(a: ThemeAppearance): Record<string, string> {
  const v = a.variation ?? defaultVariation;
  const tokens: Record<string, string> = {
    // Explicit role tokens also reset correctly in nested comparison/export scopes.
    "--font-sans": '"Inter Variable", Inter, system-ui, sans-serif',
    "--font-mono": '"Geist Mono Variable", ui-monospace, monospace',
    "--font-shell": v.preset === "ascii" ? '"Inter Variable", Inter, sans-serif' : '"Mona Sans Variable", sans-serif',
    "--font-display": v.preset === "ascii" ? '"Source Serif 4 Variable", Georgia, serif' : "initial",
    "--font-input": v.preset === "ascii" ? '"Geist Mono Variable", ui-monospace, monospace' : 'initial',
    "--radius-control": `${a.radius}px`,
    "--radius-control-tiny": `${a.radius / 2}px`,
    "--radius-control-large": `${a.radius * 1.25}px`,
    "--radius-card-small": `${a.radius * 1.5}px`,
    "--radius-card-medium": `${a.radius * 2}px`,
    "--radius-card-large": `${a.radius * 3}px`,
    "--spacing": `${4 * v.density}px`,
  };
  // Tailwind aliases are declared explicitly at the theme boundary: a custom
  // property alias inherited from :root is already resolved there and would
  // otherwise ignore a nested provider's component-radius override.
  for (const [name, ratio] of Object.entries({ xs: .25, sm: .5, md: .75, lg: 1, xl: 1.5, "2xl": 2, "3xl": 3, "4xl": 4 }))
    tokens[`--radius-${name}`] = `${a.radius * ratio}px`;
  for (const n of [1, 2, 3, 4, 6, 8]) tokens[`--space-x${n}`] = `${n * 2 * v.density}px`;
  // Existing Claude remix palette, with an explicit dark counterpart. OpenAI uses
  // Oreo's neutral palette and rounded geometry. ASCII follows Figma 330:10660.
  if (v.preset === "claude") Object.assign(tokens, a.dark ? {
    "--color-bg-base": "#262624", "--color-bg-elevated": "#20201e", "--color-bg-surface": "#30302d",
    "--color-text-primary": "#f5f3ed", "--color-text-secondary": "#c2beb5", "--color-text-tertiary": "#a39e93",
    "--color-border-default": "#ffffff26", "--color-border-subtle": "#ffffff1c",
  } : {
    "--color-bg-base": "#fffefa", "--color-bg-elevated": "#f5f3ed", "--color-bg-surface": "#fffefa",
    "--color-text-primary": "#302e29", "--color-text-secondary": "#706c64", "--color-text-tertiary": "#858077",
    "--color-border-default": "#d2cec4", "--color-border-subtle": "#dedbd2",
  });
  if (v.preset === "ascii") Object.assign(tokens, a.dark ? {
    // Dark is a product interpretation; the supplied reference contains light only.
    "--color-bg-base": "#242421", "--color-bg-elevated": "#1b1b19", "--color-bg-surface": "#242421",
    "--color-text-primary": "#f5f4f0", "--color-text-secondary": "#b8b7b2", "--color-text-tertiary": "#95948f",
    "--color-bg-inverse": "#f5f4f0", "--color-text-on-inverse": "#1b1b19",
    "--color-accent": "#f5f4f0", "--color-accent-subtle": "#f5f4f01f", "--color-accent-foreground": "#1b1b19",
  } : {
    "--color-bg-base": "#fdfdfc", "--color-bg-elevated": "#f5f4f0", "--color-bg-surface": "#fdfdfc",
    "--color-bg-inverse": "#000000", "--color-text-on-inverse": "#ffffff",
    "--color-accent": "#000000", "--color-accent-subtle": "#0000001f", "--color-accent-foreground": "#ffffff",
  });
  if (v.accent) Object.assign(tokens, {
    "--color-theme-accent": v.accent,
    "--color-theme-accent-subtle": `${v.accent}1f`,
    "--color-accent": v.accent,
    "--color-accent-subtle": `${v.accent}1f`,
    "--color-accent-foreground": accentForeground(v.accent),
    "--color-bg-inverse": v.accent, "--color-text-on-inverse": accentForeground(v.accent),
    "--color-state-hover": `${v.accent}${a.dark ? "18" : "08"}`,
    "--color-state-press": `${v.accent}${a.dark ? "2b" : "14"}`,
    "--color-palette-default-bg": `${v.accent}${a.dark ? "2b" : "14"}`,
    "--color-palette-default-text": `color-mix(in srgb, ${v.accent} 65%, var(--color-text-primary))`,
    "--color-state-hover-inverse": accentForeground(v.accent) === "#ffffff" ? "#ffffff0f" : "#00000005",
    "--color-state-press-inverse": accentForeground(v.accent) === "#ffffff" ? "#ffffff1a" : "#0000000d",
  });
  return tokens;
}
