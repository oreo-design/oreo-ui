/** Family-owned preview adapters and local export bindings. */
import { SegmentRuleBuilder, SegmentPreview, SubscriptionPlanPicker, RevenueTargetEditor, segmentFields } from "@/components/subscription-operations";
import { CUSTOMERS as SUB_CUSTOMERS, PLANS as SUB_PLANS, LEGS as SUB_LEGS, INITIAL_SEGMENT as SUB_SEGMENT, TODAY as SUB_TODAY } from "@/patterns/subscription-workspace/data";
import { type QueryCondition } from "@/components/trace-query";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"segment-rule-builder":{...define("Segment Rule Builder",{mode:select(["all","any"],"all"),rules:text(JSON.stringify(SUB_SEGMENT.rules))},(v,set)=>{let rules:QueryCondition[];try{rules=JSON.parse(v.rules);if(!Array.isArray(rules)||rules.some(r=>typeof r.id!=="string"||typeof r.field!=="string"||typeof r.value!=="string"||typeof r.operator!=="string"))throw new Error();}catch{return <p role="alert">Enter an array of valid rule objects.</p>;}return <div className="w-full max-w-3xl p-4"><SegmentRuleBuilder fields={segmentFields(SUB_PLANS,SUB_LEGS)} rules={rules} mode={v.mode} onModeChange={mode=>set("mode",mode)} onRulesChange={rules=>set("rules",JSON.stringify(rules))}/></div>;}),source:"subscription-operations"},
"segment-preview":{...define("Segment Preview",{mode:select(["all","any"],"all"),empty:toggle(false)},v=><div className="w-full max-w-3xl p-4"><SegmentPreview customers={v.empty?[]:SUB_CUSTOMERS} plans={SUB_PLANS} legs={SUB_LEGS} segment={{...SUB_SEGMENT,mode:v.mode}} today={SUB_TODAY}/></div>),source:"subscription-operations"},
"subscription-plan-picker":{...define("Subscription Plan Picker",{plan:select(["essential","plus","family"],"plus"),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-4"><SubscriptionPlanPicker plans={SUB_PLANS} value={v.plan} onValueChange={plan=>set("plan",plan as "essential"|"plus"|"family")} disabled={v.disabled}/></div>),source:"subscription-operations"},
"revenue-target-editor":{...define("Revenue Target Editor",{amount:text("1800"),month:text("2026-10"),split:toggle(true),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-4"><RevenueTargetEditor value={{amount:v.amount,month:v.month,split:v.split}} onChange={next=>{set("amount",next.amount);set("month",next.month);set("split",next.split);}} customers={v.empty?[]:SUB_CUSTOMERS} plans={SUB_PLANS} legs={SUB_LEGS} today={SUB_TODAY}/></div>),source:"subscription-operations"}
};
const exports = {
"subscription-operations": { SegmentRuleBuilder, SegmentPreview, SubscriptionPlanPicker, RevenueTargetEditor }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "subscription-operations"; spec.exports = exports; }
export default playgrounds;
