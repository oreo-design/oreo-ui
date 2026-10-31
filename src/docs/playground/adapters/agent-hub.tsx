/** Family-owned preview adapters and local export bindings. */
import { HubSearchHero, AgentCategoryGrid, IntegrationTile } from "@/components/agent-hub";
import { HUB_CATEGORIES, HUB_AGENTS, HUB_INTEGRATIONS } from "@/patterns/agent-hub/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"hub-search-hero": { ...define("Hub Search Hero", { query:text(""), title:text("Agent hub"), description:text("Discover agents and integrations built for your team.") }, (v,set)=><div className="w-full max-w-4xl"><HubSearchHero value={v.query} onValueChange={query=>set("query",query)} title={v.title} description={v.description}/></div>), source:"agent-hub" },
"agent-category-grid": { ...define("Agent Category Grid", { selected:select(["support","sales","marketing","engineering","finance","operations","research","people","other"],"support"), empty:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><AgentCategoryGrid items={v.empty?[]:HUB_CATEGORIES.map(c=>({...c,count:HUB_AGENTS.filter(a=>a.category===c.id).length}))} selectedId={v.selected} onSelect={id=>set("selected",id as typeof v.selected)}/></div>), source:"agent-hub" },
"integration-tile": { ...define("Integration Tile", { connected:toggle(true), agentCount:number(4,0,100), integration:select(["zendesk","slack","intercom","github","notion","hubspot"],"slack") }, (v,set)=><div className="w-full max-w-md"><IntegrationTile integration={HUB_INTEGRATIONS.find(i=>i.id===v.integration)!} connected={v.connected} agentCount={v.agentCount} onOpen={()=>set("connected",!v.connected)}/><p className="mt-3 text-xs text-text-secondary">Click to toggle the demo state.</p></div>), source:"agent-hub" }
};
const exports = {
"agent-hub": { HubSearchHero, AgentCategoryGrid, IntegrationTile }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-hub"; spec.exports = exports; }
export default playgrounds;
