import type { SavedAppearance } from "./configuration";

/** The adapter exports component props; this preserves the surrounding preview settings. */
export function withAppearance(
  code: string,
  appearance?: SavedAppearance,
): string {
  if (
    !appearance ||
    (!appearance.dark &&
      appearance.radius === 8 &&
      appearance.library === "phosphor")
  )
    return code;
  const marker = "\n\n// Starting props. Connect event handlers in your app.\n";
  const [imports, jsx] = code.split(marker);
  if (!jsx) return code;
  return `${imports}\nimport { IconLibraryProvider } from "@/components/icon";\nimport type { CSSProperties } from "react";${marker}<IconLibraryProvider library=${JSON.stringify(appearance.library)}>\n  <div className=${JSON.stringify(appearance.dark ? "theme-dark" : "")} style={{ "--radius-control": ${JSON.stringify(`${appearance.radius}px`)} } as CSSProperties}>\n${jsx
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")}\n  </div>\n</IconLibraryProvider>`;
}
