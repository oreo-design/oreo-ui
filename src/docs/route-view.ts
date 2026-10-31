import type { CatalogEntry } from "@/lib/catalog";
export type DocsView = "playground" | "docs" | "remixes";
/** Keep hash documentation links and declared gallery/template defaults intact. */
export function routeView(entry: CatalogEntry, search: string, hash: string): string {
  if (hash && entry.views?.includes("docs")) return "docs";
  const requested = new URLSearchParams(search).get("view");
  if (requested && entry.views?.some(view => view === requested)) return requested;
  return entry.defaultView ?? "docs";
}
