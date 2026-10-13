import type { SkillCardProps } from "@/components/skill-card";
export type CatalogSkill = Pick<SkillCardProps, "title" | "description" | "provider" | "icon"> & { id: string; group: string };
export const catalogSkills: CatalogSkill[] = [
  { id: "pipeline", group: "Recommended", title: "Pipeline review", description: "Reviews every open deal each Monday, flags the ones with no activity in 14 days and suggests your next move.", provider: { name: "Attio" }, icon: "circle-dashed" },
  { id: "meeting", group: "Recommended", title: "Meeting prep", description: "Before each call, reads the account’s notes and past meetings and writes a concise briefing.", provider: { name: "Claude", color: "orange" }, icon: "circle-dashed" },
  { id: "calls", group: "New skills", title: "Call summaries", description: "Transcribes recorded calls, pulls out objections, pricing questions and next steps for your team.", provider: { name: "OpenAI" }, icon: "sparkle" },
  { id: "payments", group: "New skills", title: "Payment alerts", description: "Watches for failed payments and overdue invoices, then links them to the right account.", provider: { name: "Stripe", color: "purple" }, icon: "sparkle" },
  { id: "email", group: "Most installed", title: "Email drafts", description: "Turns meeting notes into thoughtful follow-ups, ready for your review before sending.", provider: { name: "Gmail", color: "pink" }, icon: "sparkle" },
  { id: "video", group: "Most installed", title: "Video recaps", description: "Catch up on a recording with the key decisions, action items and moments that matter.", provider: { name: "Loom", color: "blue" }, icon: "sparkle" },
];
