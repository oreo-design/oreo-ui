import { sourceHref, type WebSource } from "../web-search/source";
export type CitationSource = WebSource & { kind?: "page" | "article" };
export type CitationEvidence = {
  sourceId: string;
  excerpt: string;
  match?: string;
  exact?: boolean;
};
export type CitationClaim = {
  id: string;
  text: string;
  citations?: CitationEvidence[];
  linkLabel?: string;
};
export type CitationEntry = {
  claim: CitationClaim;
  evidence: CitationEvidence;
  source: CitationSource;
};
/** Stable first occurrence wins. Invalid URLs remain readable, never executable. */
export function uniqueSources(sources: CitationSource[]) {
  return sources.filter(
    (s, i) => s.id.trim() && sources.findIndex((x) => x.id === s.id) === i,
  );
}
export function citationEntries(
  claims: CitationClaim[],
  sources: CitationSource[],
): CitationEntry[] {
  const byId = new Map(uniqueSources(sources).map((s) => [s.id, s]));
  return claims.flatMap((claim) =>
    (claim.citations ?? [])
      .filter(
        (e, i, a) =>
          byId.has(e.sourceId) &&
          a.findIndex((x) => x.sourceId === e.sourceId) === i,
      )
      .map((evidence) => ({
        claim,
        evidence,
        source: byId.get(evidence.sourceId)!,
      })),
  );
}
export function matchedText(text: string, match?: string) {
  const start = match ? text.indexOf(match) : -1;
  return start < 0
    ? { before: text, match: "", after: "" }
    : {
        before: text.slice(0, start),
        match: match!,
        after: text.slice(start + match!.length),
      };
}
export function passageHref(
  source: CitationSource,
  evidence: CitationEvidence,
) {
  const safe = sourceHref(source.url);
  if (!safe) return undefined;
  if (!evidence.exact || !evidence.excerpt.trim()) return safe;
  const url = new URL(safe);
  url.hash = `:~:text=${encodeURIComponent(evidence.excerpt)}`;
  return url.href;
}
