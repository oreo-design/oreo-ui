export type GlassTone = "violet" | "clear" | "amber";
export type GlassComposition = "stack" | "orbit" | "single";
export interface GlassSettings {
  tone: GlassTone;
  composition: GlassComposition;
  roughness: number;
  dispersion: number;
  thickness: number;
  imperfections: number;
  rotation: number;
  playing: boolean;
}
export const GLASS_DEFAULTS: GlassSettings = {
  tone: "violet", composition: "stack", roughness: 0.09,
  dispersion: 0.65, thickness: 0.42, imperfections: 0.35,
  rotation: 0, playing: true,
};
/** Artwork colors live here, independently of semantic interface theme tokens. */
export const GLASS_PALETTES = {
  violet: { absorption: [.15,.62,.045], key: [1,.52,.95], rim: [.18,.025,1] },
  clear: { absorption: [.04,.025,.01], key: [.86,.94,1], rim: [.5,.7,1] },
  amber: { absorption: [.04,.32,1.1], key: [1,.7,.35], rim: [1,.28,.055] },
} as const;
export function normalizeGlassSettings(s: GlassSettings): GlassSettings {
  const limit = (v: number, lo: number, hi: number, fallback: number) => Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : fallback;
  return {
    tone: s.tone in GLASS_PALETTES ? s.tone : "violet",
    composition: ["stack", "orbit", "single"].includes(s.composition) ? s.composition : "stack",
    roughness: limit(s.roughness, 0, 0.6, 0.09),
    dispersion: limit(s.dispersion, 0, 1, 0.65),
    thickness: limit(s.thickness, 0.12, 0.65, 0.42),
    imperfections: limit(s.imperfections, 0, 1, 0.35),
    rotation: limit(s.rotation, -180, 180, 0), playing: !!s.playing,
  };
}
