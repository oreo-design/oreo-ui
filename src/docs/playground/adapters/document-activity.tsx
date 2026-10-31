/** Family-owned preview adapters and local export bindings. */
import { DocumentStorage } from "@/components/document-activity";
import { definePlayground as define, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"document-activity": define("Document Storage", { capacity: number(20, 0, 100), photos: number(7.2, 0, 100, .1), documents: number(3.8, 0, 100, .1), video: number(1.8, 0, 100, .1) }, v => <div className="w-full max-w-sm"><DocumentStorage capacity={v.capacity} segments={[{label:"Photos",value:v.photos,tone:"photos"},{label:"Documents",value:v.documents,tone:"documents"},{label:"Video",value:v.video,tone:"video"}]} /></div>)
};
const exports = {
"document-activity": { DocumentStorage }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "document-activity"; spec.exports = exports; }
export default playgrounds;
