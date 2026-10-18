import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "button", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "basic", label: "Basic" },
  { id: "variants", label: "Variants" },
  { id: "sizes", label: "Sizes" },
  { id: "states", label: "States" },
  { id: "api", label: "API Reference" },
];

const TYPES = ["primary", "secondary", "tertiary"] as const;
const SIZES = ["sm", "md", "lg"] as const;

const PROPS: PropRow[] = [
  { prop: "type", type: `"primary" | "secondary" | "tertiary"`, def: `"primary"`, desc: "Visual emphasis of the button." },
  { prop: "size", type: `"sm" | "md" | "lg"`, def: `"md"`, desc: "Control height & padding. md = 32px (Oreo control height)." },
  { prop: "danger", type: "boolean", def: "false", desc: "Recolors the button with the error palette." },
  { prop: "disabled", type: "boolean", def: "false", desc: "Disables interaction and dims the fill." },
  { prop: "leadingIcon", type: "ReactNode", desc: "Icon rendered before the label." },
  { prop: "trailingIcon", type: "ReactNode", desc: "Icon rendered after the label." },
  { prop: "render", type: "useRender.RenderProp", desc: "Base UI render prop — swap the element for an <a>, router Link, etc." },
  { prop: "bounce", type: "number", def: "0.4", desc: "Press-spring bounciness (0 = no overshoot)." },
  { prop: "duration", type: "number", def: "0.3", desc: "Press-spring duration in seconds." },
  { prop: "tapScale", type: "number", def: "0.96", desc: "Scale applied while pressed." },
];

const CODE_BASIC = `import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

<Button
  leadingIcon={<Icon name="paperclip" />}
  trailingIcon={<Icon name="chevron-down" />}
>
  Button
</Button>`;

const CODE_VARIANTS = `<Button type="primary">Button</Button>
<Button type="secondary">Button</Button>
<Button type="tertiary">Button</Button>
<Button type="primary" danger>Delete</Button>`;

const CODE_SIZES = `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`;

const CODE_STATES = `{/* disabled */}
<Button disabled>Button</Button>

{/* polymorphic — render as a link, styling preserved */}
<Button render={<a href="/pricing" />}>Go to pricing</Button>`;

export function ButtonDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Button"]} nav={nav}>
      {({ spring, icon }) => {
        const Demo = ({ children }: { children?: React.ReactNode }) => (
          <Button leadingIcon={<Icon name="paperclip" weight={icon.weight} />} trailingIcon={<Icon name="chevron-down" weight={icon.weight} />} {...spring}>
            {children ?? "Button"}
          </Button>
        );

        return (
          <>
            <header id="button" className="scroll-mt-8">
              <h1 className="text-[32px] font-semibold tracking-tight">Button</h1>
              <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
                A compact, tappable control that pairs a short action label with an optional icon, helping users
                discover common tasks without typing. Built on Base UI&apos;s <code>useRender</code>, styled with
                tailwind-variants and design tokens, with a Motion spring on press.
              </p>
            </header>

            <Section id="installation" title="Installation" description="Copy the source into your project — no package to install, you own the code.">
              <CodeBlock lang="bash" code={`npx oreo-ui add button\n# or copy src/components/button/* by hand`} />
            </Section>

            <Section id="basic" title="Basic" description="A button with leading and trailing icons. Press it to feel the spring.">
              <PreviewTabs preview={<Demo />} code={CODE_BASIC} />
            </Section>

            <Section id="variants" title="Variants" description="Three emphasis levels, plus a danger flag that recolors any of them.">
              <PreviewTabs
                code={CODE_VARIANTS}
                preview={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {TYPES.map((t) => (
                      <Button key={t} type={t} {...spring}>
                        {t[0].toUpperCase() + t.slice(1)}
                      </Button>
                    ))}
                    <Button type="primary" danger {...spring}>
                      Delete
                    </Button>
                    <Button type="tertiary" danger {...spring}>
                      Remove
                    </Button>
                  </div>
                }
              />
            </Section>

            <Section id="sizes" title="Sizes" description="Three heights. md (32px) matches Oreo's control height; sm and lg scale padding and text with it.">
              <PreviewTabs
                code={CODE_SIZES}
                preview={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {SIZES.map((sz) => (
                      <Button key={sz} size={sz} leadingIcon={<Icon name="paperclip" weight={icon.weight} />} {...spring}>
                        {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                      </Button>
                    ))}
                  </div>
                }
              />
            </Section>

            <Section id="states" title="States" description="Hover and press are Material-style state layers (a semi-transparent overlay). Disabled dims the fill; render lets the button become any element.">
              <PreviewTabs
                code={CODE_STATES}
                preview={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button {...spring}>Default</Button>
                    <Button disabled {...spring}>
                      Disabled
                    </Button>
                    <Button type="secondary" disabled {...spring}>
                      Disabled
                    </Button>
                    <Button render={<a href="#button" />} type="secondary" {...spring}>
                      As link
                    </Button>
                  </div>
                }
              />
            </Section>

            <Section id="api" title="API Reference" description="Button extends all native <button> props.">
              <PropsTable rows={PROPS} />
            </Section>
          </>
        );
      }}
    </DocsPage>
  );
}
