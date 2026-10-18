import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Tag, PALETTE, type PaletteColor } from "@/components/tag";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "tag", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "colors", label: "Colors" },
  { id: "icons", label: "Icons & hash" },
  { id: "removable", label: "Removable" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "color", type: PALETTE.map((c) => `"${c}"`).join(" | "), def: `"default"`, desc: "Palette tone — soft bg + matching text." },
  { prop: "size", type: `"sm" | "md"`, def: `"sm"`, desc: "Tag height: sm 20px, md 24px." },
  { prop: "hash", type: "boolean", def: "false", desc: "Prepend a dimmed # — the keyword-tag look." },
  { prop: "icon", type: "ReactNode", desc: "Leading icon before the label." },
  { prop: "onRemove", type: "() => void", desc: "When set, renders a trailing remove (×) button." },
];

const COLOR_LABEL: Record<PaletteColor, string> = {
  default: "design", mint: "coding", pink: "research", blue: "in-progress",
  purple: "planning", orange: "urgent", brown: "summary",
};

const CODE_COLORS = `import { Tag } from "@/components/tag";

<Tag color="purple" hash>planning</Tag>
<Tag color="mint" hash>coding</Tag>
<Tag color="pink" hash>research</Tag>`;

const CODE_REMOVE = `<Tag color="blue" onRemove={() => remove(id)}>in-progress</Tag>`;

const INITIAL = [
  { id: 1, label: "planning", color: "purple" as const },
  { id: 2, label: "coding", color: "mint" as const },
  { id: 3, label: "research", color: "pink" as const },
  { id: 4, label: "urgent", color: "orange" as const },
];

function RemovableDemo() {
  const [tags, setTags] = useState(INITIAL);
  return (
    <div className="flex min-h-9 flex-wrap items-center justify-center gap-2">
      {tags.map((t) => (
        <Tag key={t.id} color={t.color} size="md" hash onRemove={() => setTags((p) => p.filter((x) => x.id !== t.id))}>
          {t.label}
        </Tag>
      ))}
      {tags.length === 0 && (
        <button className="text-[13px] text-[var(--color-text-secondary)] underline" onClick={() => setTags(INITIAL)}>
          Reset
        </button>
      )}
    </div>
  );
}

export function TagDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Tag"]} nav={nav}>
      {({ icon }) => (
        <>
          <header id="tag" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Tag</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A labeled tag used to display metadata, filters, and categorized attributes. Palette-driven (soft
              background + matching text), with an optional leading icon and a trailing remove action. Designed for
              dense UI like filter bars, property panels, and data tables.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <CodeBlock lang="bash" code={`npx oreo-ui add tag\n# or copy src/components/tag/* by hand`} />
          </Section>

          <Section id="colors" title="Colors" description="Seven palette tones — default (neutral) plus six hues. Each pairs a soft surface with readable text, re-skinned automatically in dark mode.">
            <PreviewTabs
              code={CODE_COLORS}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {PALETTE.map((c) => (
                    <Tag key={c} color={c} hash>
                      {COLOR_LABEL[c]}
                    </Tag>
                  ))}
                </div>
              }
            />
          </Section>

          <Section id="icons" title="Icons & hash" description="Add a leading icon for context, or the dimmed # prefix for the keyword-tag look.">
            <PreviewTabs
              code={`<Tag color="orange" icon={<Icon name="star" size="sm" />}>Featured</Tag>\n<Tag color="purple" hash>planning</Tag>`}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Tag color="orange" icon={<Icon name="star" weight="fill" size="sm" />}>Featured</Tag>
                  <Tag color="mint" icon={<Icon name="star" weight={icon.weight} size="sm" />}>Starred</Tag>
                  <Tag color="purple" hash>planning</Tag>
                  <Tag color="blue" hash size="md">in-progress</Tag>
                </div>
              }
            />
          </Section>

          <Section id="removable" title="Removable" description="Pass onRemove to render a trailing × — for editable filter bars and token inputs.">
            <PreviewTabs code={CODE_REMOVE} preview={<RemovableDemo />} />
          </Section>

          <Section id="api" title="API Reference" description="Tag extends native <span> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
