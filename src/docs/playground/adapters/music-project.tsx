/** Family-owned preview adapters and local export bindings. */
import { AnnotatedWaveform, ProductionTaskList, MixVersionList, toggleTask, type ProductionTask } from "@/components/music-project";
import { MIX_SAMPLES, MIX_COMMENTS, MIX_TASKS, MIX_VERSIONS } from "@/patterns/music-project/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"annotated-waveform":{...define("Annotated Waveform",{position:number(84,0,238,1),markers:toggle(true),invalid:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-3xl p-6"><AnnotatedWaveform samples={v.invalid?[]:MIX_SAMPLES} duration={238} position={v.position} comments={v.markers?MIX_COMMENTS:[]} selectedId={v.selected} onSeek={n=>set("position",n)} onComment={id=>{set("selected",id);set("position",MIX_COMMENTS.find(c=>c.id===id)!.seconds);}}/></div>),source:"music-project"},
"production-task-list":{...define("Production Task List",{completed:text("s1,s2,t6"),empty:toggle(false)},(v,set)=>{const ids=v.completed.split(",");const restore=(list:ProductionTask[]):ProductionTask[]=>list.map(t=>({...t,done:ids.includes(t.id),children:t.children?restore(t.children):undefined}));const list=restore(MIX_TASKS);return <div className="w-full max-w-3xl p-6"><ProductionTaskList tasks={v.empty?[]:list} onToggle={(id,done)=>{const updated=toggleTask(list,id,done);const collect=(ts:ProductionTask[]):string[]=>ts.flatMap(t=>t.children?.length?collect(t.children):t.done?[t.id]:[]);set("completed",collect(updated).join(","));}}/></div>;}),source:"music-project"},
"mix-version-list":{...define("Mix Version List",{value:select(["v4","v3","v2","v1"],"v4"),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><MixVersionList versions={v.empty?[]:MIX_VERSIONS} value={v.value} onChange={id=>set("value",id as typeof v.value)}/></div>),source:"music-project"}
};
const exports = {
"music-project": { AnnotatedWaveform, ProductionTaskList, MixVersionList }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "music-project"; spec.exports = exports; }
export default playgrounds;
