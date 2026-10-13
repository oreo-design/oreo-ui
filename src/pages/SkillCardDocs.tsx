import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import { SkillCard, SkillCatalogTabs, SkillEmptyState, SkillProviderBadge, SkillSearch, SkillSection, type SkillCatalogView } from "@/components/skill-card";
import { catalogSkills } from "@/patterns/skills-workspace/data";

const toc = [{ id: "introduction", label: "Introduction" }, { id: "cards", label: "Skill card & provider" }, { id: "catalog", label: "Catalog controls" }, { id: "states", label: "Pending & recovery" }, { id: "composition", label: "Compose a workspace" }, { id: "api", label: "API reference" }];
function Examples() {
  const [installed, setInstalled] = useState(false);
  const [meetingInstalled, setMeetingInstalled] = useState(false);
  const [view, setView] = useState<SkillCatalogView>("discover");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(true);
  const [retried, setRetried] = useState(false);
  const match = "Pipeline review Attio".toLowerCase().includes(query.trim().toLowerCase());
  const results = match && (view === "discover" || installed) ? <SkillCard {...catalogSkills[0]} installed={installed} onInstalledChange={setInstalled} /> : <SkillEmptyState onAction={() => { setQuery(""); setView("discover"); }} actionLabel="Reset filters" />;
  return <>
    <Section id="cards" title="Skill card & provider" description="A leading glyph, a two-line description and a quiet provider identity. The separate action announces exactly which skill it installs or removes.">
      <SkillSection title="Recommended"><SkillCard {...catalogSkills[0]} installed={installed} onInstalledChange={setInstalled} /><SkillCard {...catalogSkills[1]} installed={meetingInstalled} onInstalledChange={setMeetingInstalled} /></SkillSection>
      <div className="mt-6 flex flex-wrap gap-6">{catalogSkills.slice(0, 4).map(skill => <SkillProviderBadge key={skill.id} {...skill.provider} />)}</div>
    </Section>
    <Section id="catalog" title="Catalog controls" description="Base UI tabs provide arrow-key navigation and associated panels. Search is controlled; the template matches skill names, descriptions and providers.">
      <SkillCatalogTabs value={view} onValueChange={setView} installedCount={installed ? 1 : 0} search={<SkillSearch value={query} onValueChange={setQuery} />}>{ { installed: results, discover: results } }</SkillCatalogTabs>
    </Section>
    <Section id="states" title="Pending & recovery" description="The application owns async work. Pending disables the action; an error stays beside its retry action. This example recovers locally without contacting a provider.">
      <div className="grid gap-5"><SkillCard {...catalogSkills[2]} pending onInstalledChange={() => {}} /><SkillCard {...catalogSkills[3]} error={error ? "Couldn’t install this skill. Try again." : undefined} installed={retried} onInstalledChange={next => { setError(false); setRetried(next); }} /></div>
      <div className="mt-4"><Button type="tertiary" tapScale={1} onClick={() => { setError(true); setRetried(false); }}>Reset error example</Button></div>
    </Section>
  </>;
}
export function SkillCardDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} toc={toc} breadcrumb={["Components", "Skill Card"]}>{() => <>
    <header id="introduction" className="pb-8"><p className="mb-3 text-xs text-text-tertiary">SKILL CATALOG</p><h1 className="text-3xl font-semibold tracking-tight">Skill card</h1><p className="mt-3 text-base leading-7 text-text-secondary">Small, useful capabilities. Seven composable parts for discovering skills and building your own installed collection.</p><div className="mt-5"><Button render={<a href="/skills-workspace" />} tapScale={1}>Open Skills template ↗</Button></div><p className="mt-4 text-xs leading-6 text-text-tertiary">Inspired by <a className="underline underline-offset-4" href="https://x.com/_heyrico/status/2109682274090545238" target="_blank" rel="noreferrer">@_heyrico’s Skills interface</a>. Independently implemented with Oreo tokens and existing controls. The cropped reference informs the layout; dark mode, mobile layout and interactions extend it. Provider initials replace brand artwork.</p></header>
    <Examples />
    <Section id="composition" title="Compose a workspace" description="Copy components/skill-card and its Oreo imports. Add patterns/skills-workspace for the complete local fixture. All primitives are controlled and can be connected to your own services."><CodeBlock code={`import { SkillCard, SkillCatalogTabs, SkillSearch, SkillSection,\n  SkillWorkspaceShell } from "@/components/skill-card";\nimport { WorkspaceRail } from "@/components/review-workspace";\n\n<SkillWorkspaceShell rail={<WorkspaceRail items={navigation}\n  activeId="skills" onSelect={navigate} />}>\n  <SkillCatalogTabs value={view} onValueChange={setView}\n    search={<SkillSearch value={query} onValueChange={setQuery} />}>\n    {{\n      installed: installedContent,\n      discover: <SkillSection title="Recommended">\n        <SkillCard title="Pipeline review" description="Review your open deals."\n          provider={{ name: "Attio" }} installed={installed}\n          onInstalledChange={setInstalled} />\n      </SkillSection>\n    }}\n  </SkillCatalogTabs>\n</SkillWorkspaceShell>`} /><p className="mt-4 text-sm leading-6 text-text-secondary">The template uses a two-column grid on wide screens and one column below 1280px. The rail links to existing Oreo templates. Installs stay in memory through search and tab changes and reset on reload. No provider is connected and no automation runs.</p></Section>
    <Section id="api" title="API reference"><div className="overflow-x-auto"><PropsTable rows={[
      { prop: "SkillCard", type: "title; description; provider; onInstalledChange", desc: "Required data and callback. Optional icon, installed, pending, disabled, error and className. Provider accepts name, color and an optional mark node." },
      { prop: "SkillProviderBadge", type: "name; color?; mark?", desc: "Provider identity using Oreo palette tokens, with an initials fallback." },
      { prop: "SkillCatalogTabs", type: "value; onValueChange; children; search?; installedCount?", desc: "Value is installed or discover. Children is an object with installed and discover panels. Keyboard behavior is provided by Base UI." },
      { prop: "SkillSearch", type: "value; onValueChange; placeholder?", desc: "Labelled native search input. Filtering belongs to the host." },
      { prop: "SkillSection", type: "title; children", desc: "Labelled group and responsive card grid." },
      { prop: "SkillEmptyState", type: "onAction; title?; description?; actionLabel?", desc: "Empty or no-results state with a recovery action." },
      { prop: "SkillWorkspaceShell", type: "rail; children; header?", desc: "Responsive page shell. Reuse WorkspaceRail or supply your own navigation." },
    ]} /></div></Section>
  </>}</DocsPage>;
}
