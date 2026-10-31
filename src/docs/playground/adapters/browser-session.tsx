/** Family-owned preview adapters and local export bindings. */
import { BrowserSessionTabs, BrowserControlBar, type BrowserRunStatus, type BrowserAction, type BrowserTab } from "@/components/browser-session";
import { definePlayground as define, text, toggle, select } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec, Values } from "../schema";
const previewTabs = (v: Values): BrowserTab[] => [{id:"chat",title:"Research task",icon:"chat",closable:false},{id:"guide",title:"Browser guide",activity:{status:v.status as BrowserRunStatus,action:v.action as BrowserAction}}];
const playgrounds: Record<string, PlaygroundSpec> = {
"browser-session-tabs": {...define("Browser Session Tabs",{selected:select(["chat","guide"],"chat"),status:select(["ready","running","paused","user","complete","error","stopped"],"running"),action:select(["navigating","reading","searching","typing","waiting"],"reading"),empty:toggle()},(v,set)=><div className="w-full p-4"><BrowserSessionTabs value={v.selected} onValueChange={id=>set("selected",id==="guide"?"guide":"chat")} tabs={v.empty?[]:previewTabs(v)} renderPanel={tab=><p className="p-6 text-sm text-text-secondary">{tab.title} — selection and activity are independent.</p>} onAdd={v.empty?()=>set("empty",false):undefined}/></div>),source:"browser-session"},
"browser-control-bar": {...define("Browser Control Bar",{status:select(["ready","running","paused","user","complete","error","stopped"],"running"),action:select(["navigating","reading","searching","typing","waiting"],"reading"),target:text("Browser guide")},(v,set)=><div className="w-full p-4"><BrowserControlBar status={v.status as BrowserRunStatus} action={v.action as BrowserAction} target={v.target} onStart={()=>set("status","running")} onPause={()=>set("status","paused")} onResume={()=>set("status","running")} onTakeOver={()=>set("status","user")} onReturnControl={()=>set("status","running")} onStop={()=>set("status","stopped")} onRetry={()=>set("status","running")}/></div>),source:"browser-session"}
};
const exports = {
"browser-session": { BrowserSessionTabs, BrowserControlBar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "browser-session"; spec.exports = exports; }
export default playgrounds;

playgrounds["browser-session-tabs"].exportRecipe = values => {
  const spec = playgrounds["browser-session-tabs"];
  const example = playgroundCode(spec.render(values, () => {}), exports, {
    "BrowserSessionTabs.value": "selected", "BrowserSessionTabs.onValueChange": "setSelected",
    "BrowserSessionTabs.tabs": "tabs", "BrowserSessionTabs.onAdd": "() => setTabs(sampleTabs)",
    "BrowserSessionTabs.renderPanel": 'tab => <p className="p-6 text-sm text-text-secondary">{tab.title} — selection and activity are independent.</p>',
  });
  return { ...example, imports: [...example.imports, 'import { useState } from "react";', 'import type { BrowserTab } from "@/components/browser-session";'],
    setup: [...example.setup, `const sampleTabs: BrowserTab[] = ${JSON.stringify(previewTabs(values))};`, `const [tabs, setTabs] = useState<BrowserTab[]>(${values.empty ? "[]" : "sampleTabs"});`, `const [selected, setSelected] = useState(${JSON.stringify(values.selected)});`],
    notes: ["Local tab selection and sample panels only. Adding tabs restores local fixtures; it does not create a browser session or start agent work."] };
};
