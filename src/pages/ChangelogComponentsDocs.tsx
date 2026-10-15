import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
function ChangelogDocs({ nav, prompt = false }: { nav: DocsNav; prompt?: boolean }) {
  const title = prompt ? "Upgrade Prompt" : "Release Entry";
  return <DocsPage nav={nav} breadcrumb={["Components", title]} toc={[{id:"overview",label:"Overview"},{id:"usage",label:"Usage"},{id:"api",label:"API"},{id:"template",label:"Changelog template"}]}>{() => <>
    <header id="overview" className="pb-8"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-sm leading-7 text-text-secondary">{prompt ? "Readable agent context with an explicit copy action, success feedback and manual-copy recovery." : "A reusable update with a clear change type, documentation link, source provenance and optional live preview."}</p><a className="mt-3 inline-block text-sm underline" href="/changelog">Open Changelog ↗</a></header>
    <Section id="usage" title="Usage"><CodeBlock code={prompt ? '<UpgradePrompt prompt={upgradePrompt(releases)} />' : '<ReleaseEntry kind="Added" title="Brand Guide"\n  description="A practical brand toolkit." href="/brand-guide"\n  sourceHref="https://github.com/oreo-design/oreo-ui/pull/43"\n  sourceLabel="PR #43">\n  <TypeScale base={16} ratio={1.25} />\n</ReleaseEntry>'} /></Section>
    <Section id="api" title="API"><PropsTable rows={prompt ? [
      {prop:"prompt",type:"string",desc:"Exact plain text shown and copied. A changed prompt resets feedback."},
      {prop:"title",type:"string",desc:"Optional card heading; each instance has a unique accessible label."},
    ] : [
      {prop:"title / description",type:"string",desc:"Update heading and concise explanation."},
      {prop:"kind",type:'"Added" | "Updated" | "Fixed" | "Breaking"',desc:"Text category; does not depend on colour alone."},
      {prop:"href",type:"string",desc:"Destination for the feature documentation or template."},
      {prop:"sourceHref / sourceLabel",type:"string",desc:"Verified source URL and visible PR or commit label."},
      {prop:"children",type:"ReactNode",desc:"Optional real component preview; caller owns its state."},
    ]} /></Section>
    <Section id="template" title="Changelog template"><p className="mb-4 text-sm leading-7 text-text-secondary">Copy src/patterns/changelog and these two components, keeping Oreo’s docs shell and design tokens. Replace data.ts with verified updates for your product. This example curates main-branch merges, not package releases. Search and type filters scope the upgrade prompt; Markdown exports the full history. Previews are local examples.</p><CodeBlock code={'<Changelog nav={nav} data={releases} />\n\n// Release: date, label, title, description, changes[]\n// Change: id, kind, title, description, page, pr, preview?'} /></Section>
  </>}</DocsPage>;
}
export function ReleaseEntryDocs({ nav }: { nav: DocsNav }) { return <ChangelogDocs nav={nav} />; }
export function UpgradePromptDocs({ nav }: { nav: DocsNav }) { return <ChangelogDocs nav={nav} prompt />; }
