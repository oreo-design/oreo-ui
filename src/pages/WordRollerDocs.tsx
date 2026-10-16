import { WordRoller } from "@/components/word-roller";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

const usage = `import { WordRoller } from "@/components/word-roller";

<WordRoller
  words={["Sprint", "Hurdles", "Relay", "Marathon", "Triathlon", "Cycling"]}
  defaultValue="Marathon"
  suffix="for every season"
  onValueChange={word => console.log(word)}
/>`;

export function WordRollerDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Word Roller"]} toc={[
    { id: "introduction", label: "Introduction" }, { id: "usage", label: "Usage" }, { id: "states", label: "States" }, { id: "api", label: "API Reference" },
  ]}>{() => <>
    <header id="introduction" className="pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">Word Roller</h1>
      <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">A phrase with a little momentum. Scroll or drag through a column of words; release to settle on the nearest one.</p>
      <p className="mt-3 text-xs text-text-tertiary">Inspired by <a className="underline underline-offset-4" href="https://x.com/juli_fella/status/2109627461252071884" target="_blank" rel="noreferrer">Julian Fella’s word roller</a>. Rebuilt with Oreo typography, theme tokens and Motion.</p>
    </header>
    <Section id="usage" title="Usage" description="Copy the word-roller folder and keep its CSS import. Requires Oreo tokens, cn and Motion.">
      <CodeBlock code={usage} />
      <p className="mt-4 text-sm leading-7 text-text-secondary">Use defaultValue for a self-contained roller, or value and onValueChange to own the selection. The suffix stays still. Wheel and drag motion follow your input, then snap; arrow keys and reduced-motion selection settle immediately. Looping is enabled by default.</p>
    </Section>
    <Section id="states" title="Finite, disabled & empty" description="Finite lists stop at each end and release outward wheel scrolling to the page. Empty lists have no active option.">
      <div className="grid gap-6">
        <div className="flex min-h-64 items-center justify-center rounded-card-medium border border-border-subtle bg-bg-elevated p-6"><WordRoller words={["Thoughtful", "Playful", "Useful"]} defaultValue="Playful" suffix="by design" loop={false} size="sm" visibleWords={5} aria-label="Design quality" /></div>
        <div className="flex min-h-64 items-center justify-center rounded-card-medium border border-border-subtle p-6"><WordRoller words={["Ready", "Steady", "Go"]} defaultValue="Steady" suffix="at your pace" disabled size="sm" visibleWords={5} /></div>
        <div className="flex min-h-32 items-center justify-center rounded-card-medium border border-border-subtle p-6"><WordRoller words={[]} suffix="" size="sm" visibleWords={5} /></div>
      </div>
    </Section>
    <Section id="api" title="API Reference" description="The roller is a single-tab-stop listbox. Up/Down, Home/End and typeahead select a word; touch and pointer drags share the same snap behavior.">
      <div className="overflow-x-auto"><PropsTable rows={[
        { prop: "words", type: "readonly string[]", desc: "Ordered words. Empty labels and duplicate labels are ignored. Long words truncate visually; their accessible names stay complete." },
        { prop: "value / defaultValue", type: "string", desc: "Controlled or initial selection. Missing values fall back to the first word." },
        { prop: "onValueChange", type: "(word: string) => void", desc: "Called when a gesture settles, an option is clicked or a key selects a word." },
        { prop: "suffix", type: "string", def: "for every season", desc: "Stationary phrase. Wraps on narrow screens." },
        { prop: "loop", type: "boolean", def: "true", desc: "Wrap at either end. A single item never loops." },
        { prop: "size", type: '"sm" | "md" | "lg"', def: "md", desc: "Oreo text-2xl, text-3xl or text-4xl." },
        { prop: "visibleWords", type: "5 | 7 | 9", def: "9", desc: "Odd number of visible rows; the selected word stays centered." },
        { prop: "disabled", type: "boolean", def: "false", desc: "Disables input and removes the roller from tab order." },
        { prop: "aria-label", type: "string", def: "Choose a word", desc: "Accessible name describing what is being selected." },
        { prop: "className", type: "string", desc: "Additional classes on the outer phrase." },
      ]} /></div>
    </Section>
  </>}</DocsPage>;
}
