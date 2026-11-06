/** Role mappings verified against the live product sites on 2026-11-06.
 * See docs/references/records/2026-11-06-theme-fonts.md for sources/limits. */
import type { ThemeName } from "./tokens";
const inter = '"Inter Variable", Inter, system-ui, sans-serif';
const mona = '"Mona Sans Variable", system-ui, sans-serif';
const geist = '"Geist Mono Variable", ui-monospace, monospace';
const serif = '"Source Serif 4 Variable", Georgia, serif';
const claudeSans = '"anthropic-sans", "anthropic-sans-roman-fallback", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const claudeSerif = '"anthropic-serif", Georgia, "Times New Roman", "Songti SC", serif';
const gptSans = '-apple-system-body, ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
const gptMono = 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
export const themeTypography = {
  oreo: { sans: mona, legacy: mona, mono: '"Fragment Mono", ui-monospace, monospace', display: mona, input: mona, response: mona, features: '\"ss05\" 1' },
  claude: { sans: claudeSans, legacy: claudeSans, mono: '"anthropic-mono", ' + geist, display: claudeSerif, input: claudeSans, response: claudeSerif, features: 'normal' },
  openai: { sans: gptSans, legacy: gptSans, mono: gptMono, display: gptSans, input: gptSans, response: gptSans, features: 'normal' },
  ascii: { sans: inter, legacy: inter, mono: geist, display: serif, input: geist, response: inter, features: 'normal' },
} satisfies Record<ThemeName, { sans: string; legacy: string; mono: string; display: string; input: string; response: string; features: string }>;
