import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Shortcut } from "@/components/shortcut";

const TOC: TocItem[] = [
  { id: "shortcut", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "keys", label: "Keys" },
  { id: "combinations", label: "Combinations" },
  { id: "inline", label: "Inline & menus" },
  { id: "api", label: "API Reference" },
];

const KEYS = ["@", "cmd", "/", "shift", "opt", "ctrl", "fn", "ESC", "Tab", "F1"];

const PROPS: PropRow[] = [
  { prop: "keys", type: "string[]", desc: "Tokens to render. Modifiers (cmd, shift, opt, ctrl…) map to glyphs; anything else passes through." },
  { prop: "combine", type: "boolean", def: "false", desc: "Merge all keys into one cap (e.g. ⌘⇧A) instead of one cap each." },
  { prop: "size", type: `"sm" | "md"`, def: `"sm"`, desc: "Cap height: sm 20px, md 24px." },
];

const CODE_BASIC = `import { Shortcut } from "@/components/shortcut";

<Shortcut keys={["cmd"]} />
<Shortcut keys={["shift"]} />
<Shortcut keys={["ESC"]} />`;

const CODE_COMBINE = `{/* one cap per key (default) */}
<Shortcut keys={["cmd", "shift", "A"]} />

{/* merged into a single cap */}
<Shortcut keys={["cmd", "A"]} combine />`;

const CODE_INLINE = `<p>
  Press <Shortcut keys={["cmd", "K"]} combine /> to open the command bar.
</p>`;

export function ShortcutDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Shortcut"]} nav={nav}>
      {() => (
        <>
          <header id="shortcut" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Shortcut</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A keyboard shortcut (⌘, ⇧, ⌥, ^) display component that renders key combinations in a clean, readable
              format. Modifier tokens map to their glyphs; letters, function keys, <code>ESC</code> and{" "}
              <code>Tab</code> pass straight through. Renders semantic <code>&lt;kbd&gt;</code> elements.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <CodeBlock lang="bash" code={`npx oreo-ui add shortcut\n# or copy src/components/shortcut/* by hand`} />
          </Section>

          <Section id="keys" title="Keys" description="Modifier and action keys (letters, function keys, ESC, Tab) with proper spacing and visual hierarchy.">
            <PreviewTabs
              code={CODE_BASIC}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {KEYS.map((k) => (
                    <Shortcut key={k} keys={[k]} />
                  ))}
                </div>
              }
            />
          </Section>

          <Section id="combinations" title="Combinations" description="Render multiple keys as separate caps, or merge them into one with combine.">
            <PreviewTabs
              code={CODE_COMBINE}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Shortcut keys={["cmd", "shift", "A"]} />
                  <Shortcut keys={["cmd", "A"]} combine />
                  <Shortcut keys={["cmd", "shift", "P"]} combine />
                  <Shortcut keys={["cmd", "K"]} combine size="md" />
                </div>
              }
            />
          </Section>

          <Section id="inline" title="Inline & menus" description="Sits inline in help text, composer hints, and menu rows.">
            <PreviewTabs
              code={CODE_INLINE}
              preview={
                <div className="w-full max-w-sm space-y-3 text-[14px]">
                  <p className="text-[var(--color-text-secondary)]">
                    Press <Shortcut keys={["cmd", "K"]} combine /> to open the command bar.
                  </p>
                  <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-1.5 shadow-sm">
                    {[
                      { label: "Profile", keys: ["cmd", "shift", "P"] },
                      { label: "Billing", keys: ["cmd", "B"] },
                      { label: "Settings", keys: ["cmd", "S"] },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-[var(--color-state-hover)]">
                        <span>{row.label}</span>
                        <Shortcut keys={row.keys} combine />
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Shortcut extends native <span> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
