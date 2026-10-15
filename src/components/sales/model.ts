export const DEAL_STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Negotiation",
  "Won",
] as const;
export type DealStage = (typeof DEAL_STAGES)[number];
export type Deal = {
  id: string;
  lead: string;
  company: string;
  stage: DealStage;
  source: string;
  value: number;
  nextStep: string;
};
export type RevenueDay = { date: string; value: number };
export type PipelineStage = { id: string; label: string; value: number };
export const STAGE_PROGRESS: Record<DealStage, number> = {
  New: 10,
  Contacted: 30,
  Qualified: 55,
  Negotiation: 80,
  Won: 100,
};
export const validAmount = (n: number) => Number.isFinite(n) && n >= 0;
export const salesMoney = (n: number, compact = false) =>
  validAmount(n)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: compact ? 1 : 2,
        notation: compact ? "compact" : "standard",
      }).format(n)
    : "Unavailable";
export function salesSummary(deals: Deal[]) {
  const total = (list: Deal[]) =>
    list.reduce((sum, d) => sum + (validAmount(d.value) ? d.value : 0), 0);
  const open = deals.filter((d) => d.stage !== "Won");
  return {
    pipeline: total(open),
    open: open.length,
    companies: new Set(deals.map((d) => d.company.trim().toLowerCase())).size,
    won: total(deals.filter((d) => d.stage === "Won")),
    stages: [
      {
        id: "early",
        label: "Early stage",
        value: total(
          deals.filter((d) => d.stage === "New" || d.stage === "Contacted"),
        ),
      },
      {
        id: "qualified",
        label: "Qualified",
        value: total(deals.filter((d) => d.stage === "Qualified")),
      },
      {
        id: "negotiation",
        label: "Negotiation",
        value: total(deals.filter((d) => d.stage === "Negotiation")),
      },
    ],
  };
}
export function dealsCSV(deals: Deal[]) {
  const escape = (value: string | number) =>
    `"${String(value)
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""')}"`;
  return [
    ["Lead", "Company", "Stage", "Source", "Value (USD)", "Next step"],
    ...deals.map((d) => [
      d.lead,
      d.company,
      d.stage,
      d.source,
      d.value,
      d.nextStep,
    ]),
  ]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}
