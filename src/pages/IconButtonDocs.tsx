import { Icon } from "@/components/icon";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { IconButton } from "@/components/button";

const TOC: TocItem[] = [
  { id: "icon-button", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "variants", label: "Variants" },
  { id: "shapes", label: "Shapes" },
  { id: "sizes", label: "Sizes" },
  { id: "floating", label: "Floating" },
  { id: "api", label: "API Reference" },
];

const TYPES = ["primary", "secondary", "tertiary"] as const;
const SIZES = ["sm", "md", "lg"] as const;

const PROPS: PropRow[] = [
  { prop: "aria-label", type: "string", desc: "Required — names the icon-only button for assistive tech." },
  { prop: "icon", type: "ReactNode", desc: "The icon to render (scales with size)." },
  { prop: "type", type: `"primary" | "secondary" | "tertiary"`, def: `"primary"`, desc: "Visual emphasis." },
  { prop: "size", type: `"sm" | "md" | "lg"`, def: `"md"`, desc: "Square size: 28 / 32 / 40px." },
  { prop: "shape", type: `"rounded" | "rectangle"`, def: `"rounded"`, desc: "Capsule (circle) or rounded square." },
  { prop: "floating", type: "boolean", def: "false", desc: "Adds an elevation shadow for use over content." },
  { prop: "danger", type: "boolean", def: "false", desc: "Error palette." },
  { prop: "disabled", type: "boolean", def: "false", desc: "Disables and dims." },
  { prop: "render", type: "useRender.RenderProp", desc: "Base UI render prop for polymorphism." },
  { prop: "bounce / duration / tapScale", type: "number", desc: "Press-spring controls." },
];

const CODE_BASIC = `import { IconButton } from "@/components/button";

<IconButton aria-label="Attach" icon={<Icon name="paperclip" />} />`;

const CODE_SHAPES = `<IconButton aria-label="Attach" icon={<Icon name="paperclip" />} shape="rounded" />
<IconButton aria-label="Attach" icon={<Icon name="paperclip" />} shape="rectangle" />`;

const CODE_FLOATING = `<IconButton aria-label="Attach" icon={<Icon name="paperclip" />} floating />`;

export function IconButtonDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Icon Button"]} nav={nav}>
      {({ spring, icon }) => (
        <>
          <header id="icon-button" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Icon Button</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A square, icon-only action. Same surface and palettes as Button, with a shape switch (capsule or
              rounded square) and an optional floating elevation for placing over content. Always pass an{" "}
              <code>aria-label</code>.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Ships alongside Button — same folder, shared surface.">
            <CodeBlock lang="bash" code={`npx oreo-ui add button\n# IconButton is exported from the same module`} />
          </Section>

          <Section id="variants" title="Variants" description="Three emphasis levels, plus the danger palette.">
            <PreviewTabs
              code={CODE_BASIC}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {TYPES.map((t) => (
                    <IconButton key={t} aria-label={t} type={t} icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  ))}
                  <IconButton aria-label="Delete" type="primary" danger icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section id="shapes" title="Shapes" description="rounded is a full capsule; rectangle uses the control radius (follows your --radius token).">
            <PreviewTabs
              code={CODE_SHAPES}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <IconButton aria-label="Attach rounded" shape="rounded" icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  <IconButton aria-label="Attach rectangle" shape="rectangle" icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  <IconButton aria-label="Attach secondary" type="secondary" shape="rounded" icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  <IconButton aria-label="Attach secondary rect" type="secondary" shape="rectangle" icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section id="sizes" title="Sizes" description="Square scale: sm 28px, md 32px, lg 40px. The icon scales automatically.">
            <PreviewTabs
              code={`<IconButton aria-label="Attach" icon={<Icon name="paperclip" />} size="sm" />`}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {SIZES.map((sz) => (
                    <IconButton key={sz} aria-label={sz} size={sz} type="secondary" icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  ))}
                </div>
              }
            />
          </Section>

          <Section id="floating" title="Floating" description="Adds a soft elevation — for icon buttons that float above content (e.g. a composer or canvas).">
            <PreviewTabs
              code={CODE_FLOATING}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <IconButton aria-label="Float primary" floating icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  <IconButton aria-label="Float secondary" type="secondary" floating icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                  <IconButton aria-label="Float rect" type="secondary" shape="rectangle" floating icon={<Icon name="paperclip" weight={icon.weight} />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="IconButton extends all native <button> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
