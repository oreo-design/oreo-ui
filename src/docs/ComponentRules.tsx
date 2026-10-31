import { ruleParts, type ComponentRule } from "@/lib/component-rules";
import { Section } from "./primitives";
export function ComponentRules({ rule }: { rule: ComponentRule }) {
  return <Section id="component-rules" title="Usage rules" description={`${rule.title} · ${rule.id} v${rule.version}`}>
    <div className="space-y-6 text-sm leading-6 text-text-secondary">
      <div><h3 className="font-semibold text-text-primary">When to use</h3><RuleList items={rule.use} /></div>
      <div><h3 className="font-semibold text-text-primary">Boundaries</h3><RuleList items={rule.avoid} /></div>
      {ruleParts.map(({key, title}) => <div key={key}><h3 className="font-semibold text-text-primary">{title}</h3><RuleList items={rule[key]} /></div>)}
      <div><h3 className="font-semibold text-text-primary">Product examples</h3><ul className="mt-2 list-disc space-y-2 pl-5">{rule.examples.map(example => <li key={example.href}><a className="underline underline-offset-4" href={example.href}>{example.title}</a></li>)}</ul></div>
    </div>
  </Section>;
}
function RuleList({ items }: { items: readonly string[] }) {
  return <ul className="mt-2 list-disc space-y-2 pl-5">{items.map(text => <li key={text}>{text}</li>)}</ul>;
}
