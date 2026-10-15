import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const pages: Record<string,{title:string;description:string;usage:string;rows:{prop:string;type:string;desc:string;def?:string}[]}> = {
  "agent-connect-card": { title:"Agent Connect Card", description:"An arced constellation of client identities above a focused setup action. Built for a workspace sidebar or integration entry point.", usage:'<AgentConnectCard marks={clientMarks} onAction={openSetup} />', rows:[
    {prop:"marks",type:"ReactNode[]",desc:"Up to five decorative client marks. Order is preserved and centered on a shallow arc. Empty arrays retain the horizon."},
    {prop:"title / description",type:"string",desc:"Heading and supporting context; both wrap naturally."},
    {prop:"actionLabel / onAction",type:"string / () => void",desc:"Setup action label and handler. Default label: Set up agents."},
    {prop:"className",type:"string",desc:"Optional sizing or placement class."},
  ]},
  "quota-usage": { title:"Quota Usage", description:"A small circular meter with readable current and maximum values. Designed for persistent workspace usage summaries.", usage:'<QuotaUsage label="Automations" used={54} limit={3000} />', rows:[
    {prop:"label",type:"string",desc:"Visible and accessible usage name."},
    {prop:"used",type:"number",desc:"Nonnegative finite amount. Invalid values show Unknown; over-limit amounts remain visible."},
    {prop:"limit",type:"number",desc:"Optional positive finite maximum. Invalid/missing limits show No limit set without meter semantics."},
    {prop:"className",type:"string",desc:"Optional wrapper class. The circular fill is always clamped to 0–100%."},
  ]},
  "agent-client-picker": { title:"Agent Client Picker", description:"A controlled client selector using native radio navigation, clear selected states and optional provider marks.", usage:'<AgentClientPicker clients={clients} value={client} onValueChange={setClient} />', rows:[
    {prop:"clients",type:"AgentClient[]",desc:"Unique id, name, description, optional ReactNode mark and disabled flag. An empty list shows the shared empty state."},
    {prop:"value / onValueChange",type:"string / (id: string) => void",desc:"Controlled selection. The caller owns the value and connection state."},
    {prop:"label",type:"string",desc:"Fieldset legend; defaults to Choose your client. Native radio inputs support Tab, arrows and Space."},
  ]},
};
export function AgentConnectDocs({nav}:{nav:DocsNav}) {
  const page=pages[nav.active]??pages["agent-connect-card"];
  return <DocsPage nav={nav} breadcrumb={["Components",page.title]} toc={[{id:"overview",label:"Overview"},{id:"usage",label:"Usage"},{id:"api",label:"API"}]}>{()=> <>
    <header id="overview" className="pb-8"><h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1><p className="mt-3 text-sm leading-7 text-text-secondary">{page.description}</p><a href="/agent-connections" className="mt-4 inline-block text-sm underline">Open Agent Connections ↗</a></header>
    <Section id="usage" title="Usage"><CodeBlock code={`import { ${page.title.replaceAll(" ","")} } from "@/components/agent-connect";\n\n${page.usage}`}/></Section>
    <Section id="api" title="API"><PropsTable rows={page.rows}/><p className="mt-5 text-sm leading-7 text-text-secondary">These are presentation components. The host owns authentication, permissions, network requests and persistence. Agent Connections is a local fixture with read-only tool choices and an intentionally invalid example endpoint. It never contacts an MCP server. Selection and quota updates are instant in both themes, including reduced motion.</p></Section>
  </>}</DocsPage>;
}
