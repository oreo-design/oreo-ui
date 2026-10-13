import type { ReviewGroup, EmailDraftValue, ReviewContact } from "@/components/review-workspace";
export const reviewGroups: ReviewGroup[] = [
  { id: "follow-ups", label: "Follow-ups", contacts: [
    { id: "olivia", name: "Olivia Bennett", company: "Vercel", companyMark: "▲", strength: 3, color: "orange" },
    { id: "emma", name: "Emma Wilson", company: "Ramp", companyColor: "brown", companyMark: "↗", strength: 3, color: "brown" },
    { id: "liam-stripe", name: "Liam Carter", company: "Stripe", companyColor: "purple", strength: 3, color: "blue" },
  ] },
  { id: "opportunity", label: "Opportunity", contacts: [
    { id: "ava-perplexity", name: "Ava Mitchell", company: "Perplexity", strength: 2, color: "mint" },
    { id: "liam-dropbox", name: "Liam Carter", company: "Dropbox", companyColor: "blue", strength: 2, color: "pink" },
  ] },
  { id: "hiring", label: "GTM hiring signals", contacts: [
    { id: "ava-granola", name: "Ava Mitchell", company: "Granola", companyColor: "brown", strength: 2, color: "purple" },
    { id: "liam-shopify", name: "Liam Carter", company: "Shopify", companyColor: "mint", strength: 1, color: "pink" },
    { id: "liam-loom", name: "Liam Carter", company: "Loom", companyColor: "blue", strength: 1, color: "blue" },
  ] },
];
export function initialDraft(contact: ReviewContact): EmailDraftValue {
  return { subject: "Next steps today", body: `Hi @${contact.name.split(" ")[0]},\n\nIt was great speaking last week about how ${contact.company} is approaching GTM tooling as the company scales. I’ve pulled together the implementation notes we discussed, including the typical sequence for security review and rollout.\n\nWould Thursday or Friday afternoon work for a quick 20-minute follow-up?\n\nBest,\nJames` };
}
