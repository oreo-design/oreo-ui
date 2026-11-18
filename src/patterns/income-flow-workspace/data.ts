import type { IncomePoint, IncomeTone } from "@/components/income-flow";
const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const make = (values: number[]): IncomePoint[] =>
  values.map((v, i) => ({
    id: `2026-${i}`,
    label: months[i],
    amount: v * 100,
  }));
export const INCOME_SOURCES: [
  {
    id: string;
    name: string;
    description: string;
    tone: IncomeTone;
    points: IncomePoint[];
  },
  ...{
    id: string;
    name: string;
    description: string;
    tone: IncomeTone;
    points: IncomePoint[];
  }[],
] = [
  {
    id: "studio",
    name: "Studio",
    description: "Client projects and retainers",
    tone: "orange",
    points: make([2480, 3120, 21980, 23100, 50201, 52600, 76330, 82229]),
  },
  {
    id: "products",
    name: "Products",
    description: "Templates and digital products",
    tone: "purple",
    points: make([4120, 5230, 12360, 18690, 26441, 19880, 21340, 32134]),
  },
  {
    id: "licensing",
    name: "Licensing",
    description: "Seasonal licensing agreements",
    tone: "blue",
    points: make([3120, 6665, 18400, 25900, 27680, 21800, 9200, 4212]),
  },
];
