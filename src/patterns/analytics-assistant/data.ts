import type {
  AnalyticsAnswer,
  AnalyticsSuggestion,
  InsightSource,
} from "@/components/ask-analytics";
export const SUGGESTIONS: AnalyticsSuggestion[] = [
  {
    id: "signups",
    question: "Why did trial signups drop last week?",
    icon: "chart-line",
  },
  {
    id: "teams",
    question: "Which teams invite the most teammates?",
    icon: "users",
  },
  {
    id: "pricing",
    question: "What changed after the pricing update?",
    icon: "chart-bar",
  },
];
export const ANALYTICS_SOURCES: (InsightSource & {
  description: string;
  rows: { label: string; value: string }[];
})[] = [
  {
    id: "signups",
    label: "Signups dashboard",
    icon: "chart-line",
    description:
      "Daily trial starts in this illustrative workspace. September 15–21 compared with September 8–14, 2026.",
    rows: [
      { label: "Current week", value: "1,279 trials" },
      { label: "Previous week", value: "1,560 trials" },
      { label: "Change", value: "−18.0%" },
    ],
  },
  {
    id: "deploy",
    label: "Pricing page deploy",
    icon: "inline-code",
    description:
      "Illustrative release notes from the pricing-page update on September 14, 2026.",
    rows: [
      { label: "Changed", value: "New hero image and plan comparison" },
      { label: "Mobile load time", value: "2.1s → 3.3s" },
      { label: "Status", value: "Performance follow-up needed" },
    ],
  },
  {
    id: "search",
    label: "Search traffic",
    icon: "search",
    description:
      "Illustrative search traffic around the pricing-page update. These observations do not establish causation.",
    rows: [
      { label: "Organic visits", value: "−31% week over week" },
      { label: "Total visits", value: "18,400 this week" },
      { label: "Mobile share", value: "64%" },
    ],
  },
  {
    id: "teams",
    label: "Team activity",
    icon: "users",
    description: "Sample invite activity by team, September 15–21, 2026.",
    rows: [
      { label: "Design", value: "86 invitations" },
      { label: "Engineering", value: "64 invitations" },
      { label: "Product", value: "42 invitations" },
    ],
  },
];
export const TRIAL_DAYS = [
  { day: "Tue", value: 196, previous: 220 },
  { day: "Wed", value: 188, previous: 230 },
  { day: "Thu", value: 179, previous: 226 },
  { day: "Fri", value: 184, previous: 214 },
  { day: "Sat", value: 171, previous: 218 },
  { day: "Sun", value: 175, previous: 225 },
  { day: "Mon", value: 186, previous: 227 },
];
const sources = (...ids: string[]) =>
  ANALYTICS_SOURCES.filter((s) => ids.includes(s.id));
export const ANSWERS: Record<string, AnalyticsAnswer> = {
  signups: {
    title: "Trial starts fell 18% week over week.",
    body: "Signups moved from 1,560 to 1,279 after the September 14 pricing-page update. Organic visits were down 31%, while mobile load time increased by 1.2 seconds. These changes coincide; they do not prove a cause. Check the new hero image’s weight and compare mobile conversion before deciding on a rollback.",
    sources: sources("signups", "deploy", "search"),
  },
  teams: {
    title: "Design teams sent the most invitations.",
    body: "Design sent 86 invitations, followed by Engineering with 64 and Product with 42. Together, these teams sent 192 invitations this week. Invite volume describes activity, not activation: check accepted invitations before changing your onboarding flow.",
    sources: sources("teams"),
  },
  pricing: {
    title: "Traffic and speed changed after the update.",
    body: "The September 14 release introduced a new hero image and plan comparison. Mobile load time rose from 2.1 to 3.3 seconds, organic visits dropped 31%, and trial starts fell 18% in the following week. Review performance and search indexing first, then test whether either change explains conversion.",
    sources: sources("deploy", "search", "signups"),
  },
};
export function answerFor(question: string): AnalyticsAnswer | undefined {
  const q = question.toLowerCase();
  if (
    /\b(invite|invites|invitation|invitations|team|teams|teammates)\b/.test(q)
  )
    return ANSWERS.teams;
  if (/\b(pricing|price|update|deploy)\b/.test(q)) return ANSWERS.pricing;
  if (/\b(signup|signups|trial|trials|conversion)\b/.test(q))
    return ANSWERS.signups;
}
