import type {
  Customer,
  Member,
  Plan,
  Leg,
  Segment,
} from "@/components/subscription-operations/model";
export const TODAY = "2026-10-16";
export const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    cents: 2900,
    description: "1 seat · core plan",
  },
  {
    id: "plus",
    name: "Plus",
    cents: 4900,
    description: "1 seat · priority extras",
  },
  { id: "family", name: "Family", cents: 7900, description: "Up to 5 members" },
];
export const LEGS: Leg[] = [
  {
    id: "north",
    name: "North studio",
    sponsor: "Alex Morgan",
    tier: "Emerald",
  },
  { id: "east", name: "East studio", sponsor: "Jamie Park", tier: "Eagle" },
  { id: "west", name: "West studio", sponsor: "Riley Chen", tier: "Platinum" },
  { id: "south", name: "South studio", sponsor: "Sam Rivera", tier: "Diamond" },
];
const names = [
  "Lucía Reyes",
  "Oscar Navarro",
  "Edwin Torres",
  "Nora Bennett",
  "Aria Foster",
  "Ethan Brooks",
  "Maya Wilson",
  "Leo Carter",
  "Elena Cruz",
  "Mateo Silva",
  "Isla Campbell",
  "Noah Reed",
  "Sofia Martin",
  "Liam Cooper",
  "Amelia Scott",
  "Oliver Hayes",
  "Ava Mitchell",
  "Lucas Gray",
  "Mila Turner",
  "Theo Adams",
  "Zoe Parker",
  "Finn Evans",
  "Ruby Collins",
  "Jack Flores",
];
export const CUSTOMERS: Customer[] = names.map((name, i) => ({
  id: `customer-${i}`,
  name,
  phone: `+1 555 010 ${String(1000 + i)}`,
  planId: PLANS[i % 3].id,
  legId: LEGS[i % 4].id,
  source: i % 3 === 2 ? "Referral" : i % 3 === 1 ? "Campaign" : "Walk-in",
  start: `202${i % 2 ? 5 : 6}-0${(i % 8) + 1}-12`,
  risk: i % 7 === 0,
  active: i < 22,
}));
export const MEMBERS: Member[] = names.slice(0, 12).map((name, i) => ({
  id: `member-${i}`,
  name,
  phone: `+1 555 020 ${1000 + i}`,
  sponsorId: LEGS[i % 4].id,
  start: "2026-09-01",
  welcome: false,
}));
export const INITIAL_SEGMENT: Segment = {
  id: "loyal",
  name: "Loyal Family referrals",
  mode: "all",
  pinned: true,
  rules: [
    { id: "r1", field: "plan", operator: "eq", value: "Family" },
    { id: "r2", field: "tenure", operator: "gte", value: "6" },
    { id: "r3", field: "source", operator: "eq", value: "Referral" },
  ],
};
