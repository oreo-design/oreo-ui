/** Family-owned preview adapters and local export bindings. */
import { Plan, PlanStep } from "@/components/plan";
import { definePlayground as define, text, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
plan: define("Plan", { title: text("Build the playground"), first: { ...select(["done", "active", "pending"], "done"), group: "Plan steps", label: "Explore components" }, second: { ...select(["done", "active", "pending"], "active"), group: "Plan steps", label: "Connect properties" }, third: { ...select(["done", "active", "pending"], "pending"), group: "Plan steps", label: "Review the result" } }, v =>
    <Plan title={v.title}><PlanStep status={v.first}>Explore components</PlanStep><PlanStep status={v.second}>Connect properties</PlanStep><PlanStep status={v.third}>Review the result</PlanStep></Plan>)
};
const exports = {
"plan": { Plan, PlanStep }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "plan"; spec.exports = exports; }
export default playgrounds;
