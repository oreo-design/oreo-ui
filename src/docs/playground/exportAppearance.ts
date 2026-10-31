import { defaultVariation, variationTokens } from "./variation.ts";
import type { CodeExample } from "./code-types";
import type { SavedAppearance } from "./configuration";

/** The adapter exports component props; this preserves the surrounding preview settings. */
export function withAppearance(
  code: CodeExample,
  appearance?: SavedAppearance,
): CodeExample {
  if (
    !appearance ||
    (!appearance.dark &&
      appearance.radius === 8 &&
      appearance.library === "phosphor" &&
      JSON.stringify(appearance.variation ?? defaultVariation) === JSON.stringify(defaultVariation))
  )
    return code;
  const fonts = appearance.variation?.preset === "ascii" ? ['import "@/lib/theme/recipes.css";', 'import "@fontsource-variable/source-serif-4";', 'import "@fontsource-variable/geist-mono";'] : [];
  return {
    ...code,
    imports: [...new Set([...code.imports, ...fonts, 'import { IconLibraryProvider } from "@/components/icon";', 'import type { CSSProperties } from "react";'])],
    jsx: `<IconLibraryProvider library=${JSON.stringify(appearance.library)}>\n  <div className=${JSON.stringify(appearance.dark ? "theme-dark" : "")} style={${JSON.stringify(variationTokens(appearance), null, 2)} as CSSProperties}>\n${code.jsx.split("\n").map(line => `    ${line}`).join("\n")}\n  </div>\n</IconLibraryProvider>`,
  };
}
