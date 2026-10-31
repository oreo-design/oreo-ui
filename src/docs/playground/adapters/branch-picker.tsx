/** Family-owned preview adapters and local export bindings. */
import { BranchPicker } from "@/components/branch-picker";
import { definePlayground as define, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"branch-picker": define("Branch Picker", { current: { ...number(1, 1, 10), maxFrom: "total" }, total: number(3, 1, 10) }, (v, set) =>
    <BranchPicker current={Math.min(v.current, v.total)} total={v.total} onPrevious={() => set("current", Math.max(1, Math.min(v.current, v.total) - 1))} onNext={() => set("current", Math.min(v.total, v.current + 1))} />)
};
const exports = {
"branch-picker": { BranchPicker }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "branch-picker"; spec.exports = exports; }
export default playgrounds;
