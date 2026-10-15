import type { AgentCategory, HubIntegration } from "@/components/agent-hub";
export const HUB_CATEGORIES: Omit<AgentCategory,"count">[] = [
  {id:"support",name:"Customer support",description:"Triage, replies, refunds",icon:"chat-check"},
  {id:"sales",name:"Sales",description:"Leads, follow-ups, CRM",icon:"users"},
  {id:"marketing",name:"Marketing",description:"Campaigns, reports, content",icon:"paper-plane"},
  {id:"engineering",name:"Engineering",description:"Bugs, reviews, releases",icon:"inline-code"},
  {id:"finance",name:"Finance",description:"Invoices, spend, approvals",icon:"chart-line"},
  {id:"operations",name:"Operations",description:"Scheduling, handoffs, SLAs",icon:"gear"},
  {id:"research",name:"Research",description:"Competitors, markets, notes",icon:"search"},
  {id:"people",name:"People & HR",description:"Onboarding, hiring, policies",icon:"users"},
  {id:"other",name:"Other",description:"Everything else",icon:"columns"},
];
export const HUB_INTEGRATIONS: HubIntegration[] = [
  {id:"zendesk",name:"Zendesk",description:"Tickets and replies",icon:"chat-check",tone:"mint"},
  {id:"slack",name:"Slack",description:"Channels and messages",icon:"hash",tone:"purple"},
  {id:"intercom",name:"Intercom",description:"Conversations and inboxes",icon:"chat",tone:"neutral"},
  {id:"github",name:"GitHub",description:"Issues and pull requests",icon:"github-logo",tone:"neutral"},
  {id:"notion",name:"Notion",description:"Docs and knowledge",icon:"book-open",tone:"blue"},
  {id:"hubspot",name:"HubSpot",description:"Contacts and deals",icon:"users",tone:"orange"},
];
export type HubAgent = { id:string; name:string; category:string; description:string; integrations:string[]; tags:string[]; instructions:string; draft?:boolean };
export const HUB_AGENTS: HubAgent[] = [
  {id:"triage",name:"Inbox triage",category:"support",description:"Turn new support tickets into a clear, prioritized queue.",integrations:["zendesk","slack"],tags:["tickets","priority"],instructions:"Read a sample ticket, identify its topic and urgency, and draft a suggested owner. Ask a person to review before changing the ticket."},
  {id:"replies",name:"Reply companion",category:"support",description:"Draft thoughtful answers with your help center at hand.",integrations:["intercom","notion"],tags:["writing","support"],instructions:"Find relevant help-center content and draft a reply. Never send messages without a person's review."},
  {id:"leads",name:"Lead researcher",category:"sales",description:"Prepare a concise account brief before your next call.",integrations:["hubspot","notion"],tags:["crm","research"],instructions:"Summarize the account, open questions and relevant notes. Cite the source of every factual claim."},
  {id:"followup",name:"Follow-up planner",category:"sales",description:"Keep the next step clear after every conversation.",integrations:["hubspot","slack"],tags:["crm","planning"],instructions:"Draft suggested follow-up tasks from meeting notes. Do not contact customers automatically."},
  {id:"campaign",name:"Campaign brief",category:"marketing",description:"Bring audience, message and launch tasks into one brief.",integrations:["notion","slack"],tags:["content","planning"],instructions:"Organize supplied ideas into audience, message, deliverables and open decisions."},
  {id:"release",name:"Release notes",category:"engineering",description:"Translate merged work into useful product updates.",integrations:["github","slack"],tags:["releases","writing"],instructions:"Summarize the supplied merged changes. Separate user-visible behavior from internal maintenance."},
  {id:"bugs",name:"Bug investigator",category:"engineering",description:"Collect reproduction steps and related changes.",integrations:["github"],tags:["bugs","triage"],instructions:"Structure the report into expected behavior, actual behavior and reproducible steps. Mark unknown details explicitly."},
  {id:"invoices",name:"Invoice reviewer",category:"finance",description:"Prepare an invoice checklist for a human reviewer.",integrations:["notion","slack"],tags:["invoices","approvals"],instructions:"List the supplied invoice fields and missing information. Do not authorize payments."},
  {id:"handoff",name:"Handoff helper",category:"operations",description:"Make the next shift's priorities easy to pick up.",integrations:["slack","zendesk"],tags:["scheduling","handoff"],instructions:"Summarize open work, owners and blockers from the provided notes."},
  {id:"market",name:"Market notebook",category:"research",description:"Organize research into findings, evidence and questions.",integrations:["notion"],tags:["research","notes"],instructions:"Group supplied evidence by topic. Keep hypotheses separate from verified findings."},
  {id:"onboard",name:"Onboarding guide",category:"people",description:"Help a new teammate find their first-week essentials.",integrations:["notion","slack"],tags:["onboarding","policies"],instructions:"Turn the supplied onboarding material into a first-week checklist. Link back to its sources."},
];
export const categoryName = (id:string) => HUB_CATEGORIES.find(c=>c.id===id)?.name ?? "Other";
export const matchesHubQuery = (text:string,query:string) => query.trim().toLocaleLowerCase().split(/\s+/).every(word=>text.toLocaleLowerCase().includes(word));
