/** An internal source location, not a runnable installation command. */
export const internalSourceGuidance = "Oreo UI is in internal development. Use this repository’s source and follow its imports for shared components, tokens, styles and dependencies. No published Oreo package or CLI is required.";
export function sourceReferencePath(source: string): string {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source)
    ? `src/components/${source}/`
    : "See this component's documentation for its source location.";
}
export function sourceReferenceText(source: string): string {
  return `Internal source: ${sourceReferencePath(source)}\n${internalSourceGuidance}`;
}
