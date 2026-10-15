import type { ExperimentDay } from "@/components/experiment/stats";
export type Experiment = {
  id: string;
  name: string;
  owner: string;
  labels: [string, string];
  days: ExperimentDay[];
  confidence: number | null;
  status: "Draft" | "Running" | "Paused" | "Decided";
  threshold: number;
  decisionFrom?: "Running" | "Paused";
};
const a = [18, 17, 19, 20, 17, 18, 17, 18, 18, 19, 17, 18, 17, 18];
const b = [21, 20, 22, 19, 20, 21, 20, 21, 20, 21, 20, 21, 21, 22];
export const SAMPLE_DAYS: ExperimentDay[] = a.map((n, i) => ({
  date: i === 0 ? "Sep 30" : `Oct ${i}`,
  a: { visitors: i === 13 ? 439 : 437, conversions: n },
  b: { visitors: i === 13 ? 438 : 434, conversions: b[i] },
}));
export const EXPERIMENTS: Experiment[] = [
  {
    id: "EXP-0412",
    name: "Headline A/B test",
    owner: "Charles Postiaux",
    labels: ["Design that ships.", "Interfaces people get at a glance."],
    days: SAMPLE_DAYS,
    confidence: 96,
    status: "Running",
    threshold: 95,
  },
  {
    id: "EXP-0413",
    name: "Call to action",
    owner: "Maya Patel",
    labels: ["Get started", "Make something great"],
    days: SAMPLE_DAYS.slice(0, 3).map((d) => ({
      ...d,
      a: { visitors: 120, conversions: 7 },
      b: { visitors: 120, conversions: 8 },
    })),
    confidence: 78,
    status: "Running",
    threshold: 95,
  },
  {
    id: "EXP-0414",
    name: "Pricing page introduction",
    owner: "Alex Johnson",
    labels: ["Find your plan", "One plan. Everything you need."],
    days: SAMPLE_DAYS.map((d) => ({ ...d, a: { ...d.b }, b: { ...d.a } })),
    confidence: 12,
    status: "Paused",
    threshold: 95,
  },
];
