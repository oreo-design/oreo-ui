/** Local fixtures and state rules. No model, upload, permission or execution API. */
export const remixSlugs = ["prompt-box", "attachment", "confirmation", "plan", "sources"] as const;
export type RemixSlug = typeof remixSlugs[number];
export const hasRemix = (slug: string): slug is RemixSlug => remixSlugs.includes(slug as RemixSlug);

export function parsePages(input: string, total: number): number[] | null {
  if (!input.trim()) return null;
  const pages = new Set<number>();
  for (const part of input.split(",")) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return null;
    const start = Number(match[1]), end = Number(match[2] ?? match[1]);
    if (start < 1 || end > total || start > end) return null;
    for (let page = start; page <= end; page++) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

export type Job = { id: number; text: string; status: "queued" | "running" | "done" | "failed"; attempts: number };
export function finishJob(job: Job): Job {
  return { ...job, status: job.text.includes("[fail]") && job.attempts === 1 ? "failed" : "done" };
}
export type StepState = "pending" | "running" | "done" | "failed";
export function canRunStep(states: StepState[], index: number): boolean {
  return (states[index] === "pending" || states[index] === "failed") && states.slice(0, index).every(s => s === "done");
}
export const evidence = [
  { id: "research", title: "Onboarding interviews", domain: "Research · demo", quote: "Six of eight participants asked to see an example before starting.", note: "8 participants · qualitative signal, not a conversion estimate" },
  { id: "analytics", title: "Activation snapshot", domain: "Analytics · demo", quote: "42 of 100 demo workspaces completed their first project.", note: "Synthetic sample · one week · no causal claim" },
  { id: "support", title: "Support themes", domain: "Support · demo", quote: "The most common question was where to find the starter template.", note: "12 synthetic conversations · directional only" },
] as const;
export const filterEvidence = (query: string) => evidence.filter(item => `${item.title} ${item.domain} ${item.quote}`.toLowerCase().includes(query.trim().toLowerCase()));
