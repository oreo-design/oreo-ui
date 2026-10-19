export type OutlineGlyph = {
  /** Stable, unique identity within a wordmark, including repeated letters. */
  id: string;
  label: string;
  width: number;
  height: number;
  path: string;
  nodes: readonly (readonly number[])[];
};
export type WordmarkAccent = "amber" | "mint" | "neutral";
