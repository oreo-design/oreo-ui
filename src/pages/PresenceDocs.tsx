import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function PresenceDocs({ nav }: { nav: DocsNav }) {
  const badge = nav.active === "presence-badge";
  return <DocsPage nav={nav} breadcrumb={["Components",badge ? "Presence Badge" : "Presence Stack"]} toc={[{id:"overview",label:"Overview"},{id:"usage",label:"Usage"},{id:"api",label:"API"}]}>{() => <>
    <header id="overview" className="pb-8"><h1 className="text-3xl font-semibold tracking-tight">{badge ? "Presence Badge" : "Presence Stack"}</h1><p className="mt-3 text-sm leading-7 text-text-secondary">{badge ? "Online, away and typing in a compact, accessible mark. Motion is optional and respects reduced-motion preferences." : "A compact live roster with overlapping avatars, status marks, overflow and a keyboard-accessible people panel. Your application owns presence data."}</p><a href="/presence-room" className="mt-4 inline-block text-sm underline">Open Presence Room ↗</a></header>
    <Section id="usage" title="Usage"><CodeBlock code={badge ? '<PresenceBadge status="typing" animate />' : '<PresenceStack people={people} max={4} selfId="me"\n  onPersonSelect={person => showDetails(person)} />\n\n// Existing typing row also accepts multiple people:\n<TypingPresence people={typingPeople} animate />'} /></Section>
    <Section id="api" title="API"><PropsTable rows={badge ? [
      {prop:"status",type:'"online" | "away" | "typing"',desc:"Accessible text label accompanies the mark."},
      {prop:"animate",type:"boolean",def:"true",desc:"Optional opacity pulse for typing dots; reduced motion is static."},
      {prop:"decorative",type:"boolean",def:"false",desc:"Hide from assistive technology only when nearby text provides the same status."},
    ] : [
      {prop:"people",type:"PresencePerson[]",desc:"Unique stable id, name, status; optional src and detail. Duplicate IDs are ignored."},
      {prop:"max",type:"number",def:"4",desc:"Visible faces; finite values clamped to 1–6, nonfinite falls back to 4. Others appear in +N and the full roster."},
      {prop:"selfId / label",type:"string",desc:"Mark the current person and name the trigger/panel."},
      {prop:"animate",type:"boolean",def:"true",desc:"Controls avatar transitions and typing pulse. Keyboard movement and reduced-motion use immediate positions."},
      {prop:"onPersonSelect",type:"(person) => void",desc:"Optional action; without it roster rows are plain content. Base UI owns dismissal/focus restoration."},
    ]} /><p className="mt-5 text-sm leading-7 text-text-secondary">Hover with a mouse to fan the stack. Tab focuses it; Left/Right inspect names, Enter or Space opens the roster, Escape closes it. Join/leave summaries use one polite live region. Typing updates are text-labelled in the roster. An empty stack remains usable.</p></Section>
  </>}</DocsPage>;
}
