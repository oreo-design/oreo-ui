import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable } from "@/docs/primitives";
import {
  OutlineWordmark,
  PathGlyph,
  FooterLinkGroups,
} from "@/components/outline-wordmark";
import { PAGE_META } from "@/lib/site";
export function OutlineWordmarkDocs({ nav }: { nav: DocsNav }) {
  const glyph = nav.active === "path-glyph",
    links = nav.active === "footer-link-groups";
  const title = PAGE_META[nav.active as keyof typeof PAGE_META].title;
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "preview", label: "Composition" },
        { id: "api", label: "Properties" },
        { id: "rules", label: "States, copy & layout" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm text-text-secondary leading-7">
              A footer detail inspired by{" "}
              <a
                className="underline"
                href="https://x.com/uiinspoo/status/2112107576234295718"
              >
                @creativestefan, curated by uiinspoo
              </a>
              : contour nodes, quiet letters and an individual highlight that
              lingers after the pointer leaves.
            </p>
            <a
              className="inline-block mt-4 underline text-sm"
              href="/outline-brand-footer"
            >
              Open the complete footer template →
            </a>
          </header>
          <Section id="preview" title="Composition">
            <PreviewTabs
              preview={
                <div className="w-full p-8">
                  {glyph ? (
                    <div className="max-w-40 mx-auto">
                      <PathGlyph active />
                    </div>
                  ) : links ? (
                    <FooterLinkGroups />
                  ) : (
                    <OutlineWordmark />
                  )}
                </div>
              }
              code={
                glyph
                  ? '<PathGlyph glyph={glyph} active nodes accent="amber" release={700} />'
                  : links
                    ? '<FooterLinkGroups groups={groups} label="Footer navigation" />'
                    : '<OutlineWordmark glyphs={glyphs} label="Your brand" nodes accent="amber" release={700} />'
              }
            />
          </Section>
          <Section id="api" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "PathGlyph: glyph",
                  type: "OutlineGlyph",
                  desc: "Vector id, spoken letter label, positive width/height, SVG path and node coordinates in the same viewBox. Default: first Oreo letter. Decorative SVG; host owns the accessible name.",
                },
                {
                  prop: "active / nodes / accent / animated / release",
                  type: "boolean / boolean / amber | mint | neutral / boolean / number",
                  desc: "Independent dimensions. Defaults false / true / amber / true / 700ms. Release clamps to 0–1500ms; entry is 120ms. Reduced Motion or animated=false makes changes immediate. Geometry never shifts.",
                },
                {
                  prop: "OutlineWordmark: glyphs / label",
                  type: "readonly OutlineGlyph[] / string",
                  desc: "Defaults to Oreo outlines and Oreo. Stable unique IDs distinguish repeated letters. Invalid dimensions, empty paths and duplicate IDs are filtered. Empty input uses the shared centered empty state. Supply matching spoken labels for custom artwork.",
                },
                {
                  prop: "revealed / resetKey",
                  type: "boolean / number",
                  desc: "Defaults false / 0. Revealed keeps all letters highlighted; resetKey clears temporary and held highlights. These do not change accent, nodes or timing. A changed glyph ID sequence also clears interaction state.",
                },
                {
                  prop: "FooterLinkGroups: groups / label / compact",
                  type: "readonly FooterLinkGroup[] / string / boolean",
                  desc: "Groups contain stable id, title and real label/href links. Default Explore and Resources. Compact only reduces group gap. Empty groups render no navigation; this decorative region needs no empty card.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="Interaction, copy and layout">
            <div className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>
                Pointer hover highlights one letter and leaving lets it fade.
                Click or tap toggles a held letter; selecting another replaces
                it. Keyboard focus highlights a letter without activating it;
                Enter/Space toggles its pressed state, arrows and Home/End move
                between letters. Escape clears and blurs. Leaving the group by
                keyboard clears transient and held states. A focused letter
                remains visible after toggling its held state off. The optional
                revealed prop takes precedence over all temporary states.
              </p>
              <p>
                These letters are interactive artwork, not navigation. Real
                footer links remain ordinary anchors. No loading, network
                request, autoplay, gating or timed redirect. The shared empty
                state is for missing vector artwork; decorative empty link
                groups are omitted. Hover highlight is immediate; the release
                fade supplies the trail. Reduced Motion removes that fade while
                preserving input and selected states.
              </p>
              <p>
                Label names the wordmark for assistive technology; every glyph
                has its own spoken label and positional name. Navigation
                headings and links are host-owned, may be localized and wrap
                naturally. Use unique group/glyph IDs. Keep captions concise and
                avoid treating this decorative artwork as a page heading. Custom
                scripts require their own outlines and labels; these fixtures
                are not a general text-to-path renderer.
              </p>
              <p>
                All glyphs should share an artwork height and baseline. Widths
                determine proportional flex allocation; vector nodes scale with
                the artwork. PathGlyph can appear in a small specimen;
                OutlineWordmark sits after footer metadata in the full
                composition. Keep the footer in document flow, brand and
                navigation in columns on desktop and stacked on narrow screens.
                Accent uses Oreo semantic tokens; the reference neon is
                deliberately mapped to the warm palette role. The original brand
                mark remains unchanged.
              </p>
              <p>
                Default glyph outlines derive from the existing Inter font under
                SIL OFL, included alongside the component. No runtime font
                parser or additional dependency is required. Copy this component
                with the existing AgentWorkspaceState, Button/Icon primitives
                where composed, and Oreo theme tokens.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
