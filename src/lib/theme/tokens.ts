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
    // Semantic exceptions from all three ASCII reference frames. Other presets
    // resolve these at their own boundary, including nested exports/comparisons.
    "--radius-keycap": `${v.preset === "ascii" ? 4 + a.radius / 2 : a.radius / 2}px`,
    "--radius-model-selector": `${v.preset === "ascii" ? 12 + a.radius : a.radius}px`,
    "--radius-media": `${v.preset === "ascii" ? 8 + a.radius : a.radius}px`,
    "--radius-media-thumb": `${v.preset === "ascii" ? 8 + a.radius / 2 : a.radius / 2}px`,
    "--font-technical": v.preset === "ascii" ? '"Geist Mono Variable", ui-monospace, monospace' : "initial",
    "--theme-rail-width": v.preset === "ascii" ? "0.5px" : "0px",
    "--theme-frame-marks": v.preset === "ascii" && a.radius === 0 ? "1" : "0",
    "--theme-art-display": v.preset === "ascii" ? "block" : "none",
    "--theme-art-filter": v.preset === "ascii" && a.dark ? "invert(1)" : "none",
    "--theme-card-padding": v.preset === "ascii" ? "calc(var(--spacing) * 5)" : "initial",
    "--theme-card-copy-gap": v.preset === "ascii" ? "calc(var(--spacing) * 2)" : "initial",
    "--theme-card-action-gap": v.preset === "ascii" ? "calc(var(--spacing) * 4)" : "initial",
    "--theme-card-action-height": v.preset === "ascii" ? "calc(var(--spacing) * 8)" : "initial",
    "--theme-card-title-size": v.preset === "ascii" ? "var(--text-base)" : "initial",
    "--theme-dialog-title-size": v.preset === "ascii" ? "var(--text-2xl)" : "initial",
    "--theme-title-weight": v.preset === "ascii" ? "600" : "initial",
    "--theme-panel-border-width": v.preset === "ascii" ? "1px" : "0px",
    "--theme-action-border-width": v.preset === "ascii" ? "0.5px" : "1px",
    "--theme-composer-shadow": v.preset === "ascii" ? "none" : "initial",
    "--theme-hatch": v.preset === "ascii" ? "repeating-linear-gradient(135deg, transparent 0 8px, color-mix(in srgb, var(--color-border-default) 30%, transparent) 8px 8.5px, transparent 8.5px 9px)" : "none",
    "--color-bg-composer": v.preset === "ascii" ? (a.dark ? "#242421cc" : "#ffffffcc") : "var(--color-bg-base)",
    "--color-bg-illustration": v.preset === "ascii" ? (a.dark ? "#302e23" : "#fffbed") : "var(--color-bg-elevated)",
    "--color-frame-mark": v.preset === "ascii" ? (a.dark ? "#777770" : "#bbbbbb") : "transparent",
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
    "--color-bg-base": "#ffffff", "--color-bg-elevated": "#f5f4f0", "--color-bg-surface": "#ffffff",
    "--color-bg-inverse": "#000000", "--color-text-on-inverse": "#ffffff",
    "--color-accent": "#000000", "--color-accent-subtle": "#0000001f", "--color-accent-foreground": "#ffffff",
  });
  if (v.preset === "ascii") Object.assign(tokens, {
    "--color-overlay-subtle": a.dark ? "#00000070" : "#00000030",
    "--shadow-panel": a.dark ? "0 8px 16px #00000040" : "0 8px 16px #0000000a",
    "--shadow-overlay": a.dark ? "0 8px 16px #00000040" : "0 8px 16px #0000000a",
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
