import { variationTokens } from "./variation.ts";
import type { CodeExample } from "./code-types";
import type { SavedAppearance } from "./configuration";

/** The adapter exports component props; this preserves the surrounding preview settings. */
export function withAppearance(
  code: CodeExample,
  appearance?: SavedAppearance,
): CodeExample {
  if (!appearance) return code;
  const preset = appearance.variation?.preset ?? "oreo";
  const fonts = preset === "oreo"
    ? ['import "@fontsource-variable/mona-sans";', 'import "@fontsource/fragment-mono";']
    : preset === "ascii"
      ? ['import "@fontsource-variable/inter";', 'import "@fontsource-variable/source-serif-4";', 'import "@fontsource-variable/geist-mono";']
      : preset === "claude" ? ['import "@fontsource-variable/geist-mono";'] : [];
  return {
    ...code,
    imports: [...new Set([...code.imports, ...fonts, 'import "@/lib/theme/recipes.css";', 'import "@/lib/theme/fonts.css";', 'import { IconLibraryProvider } from "@/components/icon";', 'import type { CSSProperties } from "react";', 'import { ThemeScope } from "@/lib/theme/ThemeScope";'])],
    jsx: `<IconLibraryProvider library=${JSON.stringify(appearance.library)}>\n  <ThemeScope className=${JSON.stringify(appearance.dark ? "oreo-theme-scope theme-dark" : "oreo-theme-scope")} style={${JSON.stringify(variationTokens(appearance), null, 2)} as CSSProperties}>\n${code.jsx.split("\n").map(line => `    ${line}`).join("\n")}\n  </ThemeScope>\n</IconLibraryProvider>`,
  };
}
