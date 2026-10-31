/** Family-owned preview adapters and local export bindings. */
import { LinkedDocumentRow, LinkedDocumentsList, LinkedDocumentsSelector, LinkedDocumentDetails } from "@/components/linked-documents";
import { SAMPLE_DOCUMENTS } from "@/patterns/unlink-documents/data";
import { Button } from "@/components/button";
import { definePlayground as define, text, toggle, select, type PlaygroundSpec } from "../schema";
function linkedDocumentPlayground(selector = false): PlaygroundSpec {
  return {...define(selector ? "Linked Documents Selector" : "Linked Documents", {
    scenario:select(["ready","loading","error","empty"],"ready"),selected:text("statement"),unlinked:text("")
  },(v,set)=>{
    const removed=v.unlinked.split(",").filter(Boolean), documents=SAMPLE_DOCUMENTS.filter(document=>!removed.includes(document.id));
    const Component=selector?LinkedDocumentsSelector:LinkedDocumentsList;
    return <div className="w-full max-w-md p-4"><Component documents={v.scenario==="empty"?[]:documents} selectedId={v.selected}
      onSelect={id=>set("selected",id)} onUnlink={id=>{set("unlinked",[...removed,id].join(","));if(v.selected===id){const i=documents.findIndex(d=>d.id===id),remaining=documents.filter(d=>d.id!==id);set("selected",remaining[Math.min(i,remaining.length-1)]?.id??"");}}}
      loading={v.scenario==="loading"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}
      footer={<><span>Original files are kept</span><Button type="tertiary" size="sm" onClick={()=>{if(removed.length){set("unlinked",removed.slice(0,-1).join(","));if(!v.selected)set("selected",removed.at(-1)!);}else{set("selected","statement");set("unlinked","");set("scenario","ready");}}}>{removed.length?"Undo unlink":"Reset"}</Button></>}/></div>;
  }),source:"linked-documents"};
}
const playgrounds: Record<string, PlaygroundSpec> = {
"linked-document-row":{...define("Linked Document Row",{name:text("Bank-Statement_1026.pdf"),selected:toggle(true),unlinked:toggle(false)},(v,set)=><div className="w-full max-w-md p-4">{v.unlinked?<div role="status" className="flex items-center justify-between gap-3 text-sm"><span>Document unlinked.</span><Button type="secondary" size="sm" onClick={()=>set("unlinked",false)}>Undo unlink</Button></div>:<LinkedDocumentRow document={{...SAMPLE_DOCUMENTS[0],name:v.name}} index={0} selected={v.selected} onSelect={()=>set("selected",true)} onUnlink={()=>set("unlinked",true)}/>}</div>),source:"linked-documents"},
"linked-document-details":{...define("Linked Document Details",{name:text("Bank-Statement_1026.pdf")},v=><div className="w-full max-w-sm p-6"><LinkedDocumentDetails document={{...SAMPLE_DOCUMENTS[0],name:v.name}}/></div>),source:"linked-documents"},
"linked-documents":linkedDocumentPlayground(),
"linked-documents-selector":linkedDocumentPlayground(true)
};
const exports = {
"linked-documents": { LinkedDocumentRow, LinkedDocumentsList, LinkedDocumentsSelector, LinkedDocumentDetails },
"button": { Button }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "linked-documents"; spec.exports = exports; }
export default playgrounds;
