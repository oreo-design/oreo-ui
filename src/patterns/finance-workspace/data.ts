import type { Allocation, BalancePoint } from "@/components/finance";
export const SAVINGS: Allocation[] = [
  { id: "investment", label: "Investment", amount: 4800, tone: "purple" },
  { id: "holiday", label: "Summer in Kyoto", amount: 3200, tone: "blue" },
  { id: "home", label: "A place of our own", amount: 5000, tone: "mint" },
  { id: "rainy", label: "Rainy day", amount: 2750, tone: "orange" },
];
export const SPENDING: Allocation[] = [
  { id: "shopping", label: "Shopping", amount: 900, tone: "purple" },
  { id: "utilities", label: "Utilities", amount: 600, tone: "mint" },
  { id: "other", label: "Other", amount: 300, tone: "blue" },
];
export type FinancePeriod = "week" | "month";
export const PERIODS: Record<
  FinancePeriod,
  {
    label: string;
    income: number;
    expenses: number;
    previousIncome: number;
    previousExpenses: number;
    points: BalancePoint[];
  }
> = {
  week: {
    label: "This week",
    income: 3750,
    expenses: 1800,
    previousIncome: 3520,
    previousExpenses: 2120,
    points: [
      { label: "Mon, Oct 12", income: 200, expenses: 120, savings: 80 },
      { label: "Tue, Oct 13", income: 450, expenses: 220, savings: 230 },
      { label: "Wed, Oct 14", income: 1200, expenses: 620, savings: 580 },
      { label: "Thu, Oct 15", income: 1800, expenses: 850, savings: 950 },
      { label: "Fri, Oct 16", income: 2500, expenses: 1100, savings: 1400 },
      { label: "Sat, Oct 17", income: 3250, expenses: 1450, savings: 1800 },
      { label: "Sun, Oct 18", income: 3750, expenses: 1800, savings: 1950 },
    ],
  },
  month: {
    label: "This month",
    income: 15000,
    expenses: 6700,
    previousIncome: 14272,
    previousExpenses: 7929,
    points: [
      { label: "Oct 1", income: 1200, expenses: 800, savings: 400 },
      { label: "Oct 6", income: 3500, expenses: 1900, savings: 1600 },
      { label: "Oct 11", income: 5800, expenses: 2700, savings: 3100 },
      { label: "Oct 16", income: 9000, expenses: 4100, savings: 4900 },
      { label: "Oct 21", income: 11200, expenses: 5100, savings: 6100 },
      { label: "Oct 26", income: 13400, expenses: 6000, savings: 7400 },
      { label: "Oct 31", income: 15000, expenses: 6700, savings: 8300 },
    ],
  },
};
export const CONTACTS = ["Davis", "Leo", "Amanda", "Sin", "Ann", "Elli"];
export type LocalTransfer = {
  id: number;
  name: string;
  amount: number;
  note: string;
};
export const TRANSACTIONS = [
  { id: 1, name: "Studio invoice", amount: 2500, note: "Income · Oct 15" },
  { id: 2, name: "Design supplies", amount: -148, note: "Shopping · Oct 14" },
  { id: 3, name: "Home energy", amount: -86, note: "Utilities · Oct 13" },
];
