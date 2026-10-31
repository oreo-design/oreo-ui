/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { InlineConfirm } from "@/components/inline-confirm";
import { definePlayground as define, text, toggle } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"inline-confirm": define("Inline Confirm", {
    label: text("Delete project"), question: text("Delete project?"), confirmLabel: text("Delete"), cancelLabel: text("Cancel"),
    pendingLabel: text("Deleting"), successLabel: text("Deleted"), disabled: toggle(), simulateError: toggle(),
  }, v => <div className="flex min-h-80 w-full items-center justify-center rounded-card-medium border border-border-subtle bg-bg-base p-5"><div className="flex w-full max-w-xl flex-wrap items-center gap-5">
    <span className="flex items-center gap-2 text-sm font-medium"><span className="text-text-secondary"><Icon name="folder" /></span>Northwind redesign</span>
    <InlineConfirm label={v.label} question={v.question} confirmLabel={v.confirmLabel} cancelLabel={v.cancelLabel} pendingLabel={v.pendingLabel} successLabel={v.successLabel} disabled={v.disabled} onConfirm={async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (v.simulateError) throw new Error("Demo failure");
    }} />
  </div></div>)
};
const exports = {
"inline-confirm": { InlineConfirm },
"icon": { Icon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "inline-confirm"; spec.exports = exports; }
export default playgrounds;

playgrounds["inline-confirm"].exportRecipe = values => {
  const spec = playgrounds["inline-confirm"];
  const example = playgroundCode(spec.render(values, () => {}), exports, { "InlineConfirm.onConfirm": "confirmAction" });
  return { ...example, setup: [...example.setup, 'async function confirmAction(): Promise<void> {\n  throw new Error("Connect your action before using InlineConfirm");\n}'], notes: ["Connect confirmAction to your operation. Resolve only after confirmed success; reject to show recovery. Preview simulation is not exported."] };
};
