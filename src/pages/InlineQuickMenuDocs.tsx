import { InlineQuickMenu } from "@/components/inline-quick-menu";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

export function InlineQuickMenuDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Inline Quick Menu"]} toc={[
    { id: "overview", label: "Overview" }, { id: "usage", label: "Usage" }, { id: "states", label: "States" }, { id: "api", label: "API" },
  ]}>{() => <>
    <header id="overview" className="pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">Inline Quick Menu</h1>
      <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">A small choice, right where you need it. A quiet capsule opens a horizontal menu; choose an option and the label updates in place.</p>
      <p className="mt-3 text-xs text-text-tertiary">Interaction inspired by <a href="https://x.com/nitishkmrk/status/2110258300495245505" target="_blank" rel="noreferrer" className="underline underline-offset-4">Nitish Khagwal’s inline quick menu</a>. Built with Oreo tokens and Base UI.</p>
    </header>
    <Section id="preview" title="One quick choice" description="Open the capsule and switch between Private and Public. Click outside or press Escape to dismiss.">
      <div className="flex min-h-72 items-center justify-center rounded-card-medium border border-border-subtle bg-bg-base"><InlineQuickMenu /></div>
    </Section>
    <Section id="usage" title="Usage" description="Copy the inline-quick-menu folder, Oreo’s Icon and cn utilities, and design tokens. Requires the existing Base UI package.">
      <CodeBlock code={`import { InlineQuickMenu } from "@/components/inline-quick-menu";

<InlineQuickMenu defaultValue="private" />

// Your app owns persistence.
<InlineQuickMenu value={visibility} onValueChange={setVisibility} />

<InlineQuickMenu
  label="Access"
  defaultValue="view"
  options={[
    { value: "view", label: "Can view" },
    { value: "edit", label: "Can edit" },
  ]}
/>`} />
    </Section>
    <Section id="states" title="Fits the context" description="Custom labels, selected values and unavailable controls use the same compact surface.">
      <div className="flex min-h-56 flex-wrap items-center justify-center gap-6 rounded-card-medium border border-border-subtle bg-bg-base p-6">
        <InlineQuickMenu defaultValue="public" />
        <InlineQuickMenu label="Access" defaultValue="view" options={[{ value: "view", label: "Can view" }, { value: "edit", label: "Can edit" }]} />
        <InlineQuickMenu disabled />
      </div>
      <p className="mt-4 text-sm leading-6 text-text-secondary">Enter or Space opens the menu. Left and Right move between choices; Enter selects. Escape restores focus to the trigger. Keyboard interactions are instant; reduced motion keeps a short fade. The component changes local selection only and makes no permission or sharing requests.</p>
    </Section>
    <Section id="api" title="API Reference" description="Use unique option values. Keep this menu to a handful of short choices; use the regular Menu for longer lists.">
      <div className="overflow-x-auto"><PropsTable rows={[
        { prop: "options", type: "InlineQuickMenuOption[]", def: "Private / Public", desc: "Unique value, label, optional icon and disabled state for each choice." },
        { prop: "value / defaultValue", type: "string", def: "private", desc: "Controlled or initial selection. Unknown values show Choose without silently selecting an option." },
        { prop: "onValueChange", type: "(value: string) => void", desc: "Called when a new option is selected. Persist in your application." },
        { prop: "open / defaultOpen", type: "boolean", def: "false", desc: "Controlled or initial menu visibility." },
        { prop: "onOpenChange", type: "(open: boolean) => void", desc: "Called on trigger, selection, Escape or outside dismissal." },
        { prop: "label", type: "string", def: "Visibility", desc: "Accessible name for the menu and trigger." },
        { prop: "disabled", type: "boolean", def: "false", desc: "Disables the trigger. Also disabled when there are no enabled options." },
        { prop: "className", type: "string", desc: "Additional classes on the theme-preserving root." },
      ]} /></div>
    </Section>
  </>}</DocsPage>;
}
