import { createElement } from "react";
import type { ReviewGroup, EmailDraftValue, ReviewContact } from "@/components/review-workspace";
const asset = (name: string) => new URL(`./assets/${name}.webp`, import.meta.url).href;
export const reviewAssets = { claude: asset("brand-claude"), profile: asset("avatar-profile"), sender: asset("avatar-ava"), workspace: asset("brand-workspace") };
export const reviewGroups: ReviewGroup[] = [
  { id: "follow-ups", label: "Follow-ups", contacts: [
    { id: "olivia", avatarSrc: asset("avatar-olivia"), name: "Olivia Bennett", company: "Vercel", companyMark: createElement("img", { src: asset("brand-vercel"), alt: "" }), strength: 3, color: "orange" },
    { id: "emma", avatarSrc: asset("avatar-emma"), name: "Emma Wilson", company: "Ramp", companyMark: createElement("img", { src: asset("brand-ramp"), alt: "" }), companyColor: "brown", strength: 3, color: "brown" },
    { id: "liam-stripe", avatarSrc: asset("avatar-liam"), name: "Liam Carter", company: "Stripe", companyMark: createElement("img", { src: asset("brand-stripe"), alt: "" }), companyColor: "purple", strength: 3, color: "blue" },
  ] },
  { id: "opportunity", label: "Opportunity", contacts: [
    { id: "ava-perplexity", avatarSrc: asset("avatar-ava"), name: "Ava Mitchell", company: "Perplexity", companyMark: createElement("img", { src: asset("brand-perplexity"), alt: "" }), strength: 2, color: "mint" },
    { id: "liam-dropbox", avatarSrc: asset("avatar-pink"), name: "Liam Carter", company: "Dropbox", companyMark: createElement("img", { src: asset("brand-dropbox"), alt: "" }), companyColor: "blue", strength: 2, color: "pink" },
  ] },
  { id: "hiring", label: "GTM hiring signals", contacts: [
    { id: "ava-granola", avatarSrc: asset("avatar-purple"), name: "Ava Mitchell", company: "Granola", companyMark: createElement("img", { src: asset("brand-granola"), alt: "" }), companyColor: "brown", strength: 2, color: "purple" },
    { id: "liam-shopify", avatarSrc: asset("avatar-pink"), name: "Liam Carter", company: "Shopify", companyMark: createElement("img", { src: asset("brand-shopify"), alt: "" }), companyColor: "mint", strength: 1, color: "pink" },
    { id: "liam-loom", avatarSrc: asset("avatar-liam"), name: "Liam Carter", company: "Loom", companyMark: createElement("img", { src: asset("brand-loom"), alt: "" }), companyColor: "blue", strength: 1, color: "blue" },
  ] },
];
export function initialDraft(contact: ReviewContact): EmailDraftValue {
  return { subject: "Next steps today", body: `Hi @${contact.name.split(" ")[0]},\n\nIt was great speaking last week about how ${contact.company} is approaching GTM tooling as the company scales. I’ve pulled together the implementation notes we discussed, including the typical sequence for security review and rollout.\n\nWould Thursday or Friday afternoon work for a quick 20-minute follow-up?\n\nBest,\nJames` };
}
