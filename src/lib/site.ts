import { CATALOG, type CatalogSlug } from "./catalog";

/* ----------------------------------------------------------------------------
 * Site metadata facade. The pure catalog owns routes and page descriptions.
 * App.tsx keys its page map off PAGE_META; vite.config.ts consumes this facade
 * in Node to emit sitemap.xml without loading browser components.
 * -------------------------------------------------------------------------- */

export const SITE = {
  name: "Oreo UI",
  url: "https://oreo-ui-preview.vercel.app",
  title: "Oreo UI — Copy-paste React components for chat and agent interfaces",
  description:
    "A copy-paste React component library for chat and agent UIs. Base UI behavior, Tailwind v4 design tokens and Motion springs — own the source, theme with CSS variables.",
  ogImage: "/og.png",
  locale: "en_US",
} as const;

export type PageMeta = { title: string; description: string };

/** Compatibility facade for route metadata; the catalog owns each entry. */
export const PAGE_META = Object.fromEntries(
  Object.entries(CATALOG).map(([slug, { title, description }]) => [slug, { title, description }]),
) as Record<CatalogSlug, PageMeta>;

export type PageSlug = CatalogSlug;

export const PAGE_SLUGS = Object.keys(PAGE_META) as PageSlug[];

export const DEFAULT_PAGE: PageSlug = "button";

export function isPageSlug(value: string): value is PageSlug {
  return Object.hasOwn(PAGE_META, value);
}

/** Home ("/") sells the library; every other route sells its component. */
export function metaForRoute(slug: PageSlug, home: boolean) {
  if (home) {
    return { title: SITE.title, description: SITE.description, canonical: `${SITE.url}/` };
  }
  const page = PAGE_META[slug];
  return {
    title: `${page.title} — ${SITE.name}`,
    description: page.description,
    canonical: `${SITE.url}/${slug}`,
  };
}
