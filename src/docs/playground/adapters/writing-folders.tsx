/** Family-owned preview adapters and local export bindings. */
import { FolderEmptyState, FolderCollection } from "@/components/writing-folders";
import { SAMPLE_FOLDER_ROWS } from "@/patterns/writing-folders/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"folder-empty-state": {...define("Folder Empty State",{title:text("It’s empty here"),description:text("Create a folder to start organizing your writing."),created:toggle(false)},(v,set)=><div className="w-full"><FolderEmptyState title={v.title} description={v.description} onCreate={()=>set("created",true)}/>{v.created&&<p role="status" className="px-6 text-sm">Creation requested. Open the template to create a folder.</p>}</div>),source:"writing-folders"},
"folder-collection": {...define("Folder Collection",{view:select(["list","grid"],"list"),state:select(["ready","loading","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><FolderCollection folders={v.state==="ready"?SAMPLE_FOLDER_ROWS:[]} view={v.view as "list"|"grid"} loading={v.state==="loading"} filtered={v.state==="filtered"} error={v.state==="error"?"Sample library unavailable.":undefined} onReset={()=>set("state","ready")} onCreate={()=>set("state","ready")} onOpen={f=>set("opened",f.name)}/>{v.opened&&<p role="status" className="mt-4 text-sm">Selected {v.opened}</p>}</div>),source:"writing-folders"}
};
const exports = {
"writing-folders": { FolderEmptyState, FolderCollection }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "writing-folders"; spec.exports = exports; }
export default playgrounds;
