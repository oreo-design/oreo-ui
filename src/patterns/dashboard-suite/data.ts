import type {
  ChartPoint,
  DashboardRecord,
} from "@/components/dashboard-suite/model";
export type DashboardKind = "commerce" | "campaigns" | "crm" | "membership";
export const DASHBOARDS = {
  commerce: {
    title: "Commerce",
    route: "dashboard-suite",
    dark: true,
    subtitle: "Every sale. A clearer picture.",
    records: "Orders",
  },
  campaigns: {
    title: "Campaigns",
    route: "campaign-dashboard",
    dark: false,
    subtitle: "Make every impression count.",
    records: "Campaigns",
  },
  crm: {
    title: "Relationships",
    route: "crm-dashboard",
    dark: true,
    subtitle: "Turn conversations into progress.",
    records: "Contacts",
  },
  membership: {
    title: "Membership",
    route: "membership-dashboard",
    dark: false,
    subtitle: "A little clarity for your growing business.",
    records: "Members",
  },
} as const;
export const CHANNELS = ["Organic search", "Direct", "Social", "Referral"];
export function observations(kind: DashboardKind): ChartPoint[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.UTC(2026, 8, 17 + i));
    const value =
      kind === "membership"
        ? [3, 8, 11, 16, 20].includes(i)
          ? [300, 1200, 800, 2600, 500][[3, 8, 11, 16, 20].indexOf(i)]
          : 0
        : kind === "crm"
          ? 2600 + ((i * 419) % 1500)
          : 7000 + ((i * 1957) % 11000);
    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      values: [Math.round(value * 0.62), Math.round(value * 0.38)],
    };
  });
}
export function sampleRecords(kind: DashboardKind): DashboardRecord[] {
  const names =
    kind === "campaigns"
      ? [
          "Autumn launch",
          "Member stories",
          "Weekend edit",
          "October newsletter",
          "Studio notes",
          "Early access",
        ]
      : [
          "Alex Morgan",
          "Jamie Rivera",
          "Sam Chen",
          "Taylor Brooks",
          "Jordan Lee",
          "Robin Ellis",
        ];
  return names.map((name, i) => ({
    id: `${kind}-${i}`,
    name,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
    channel: CHANNELS[i % 4],
    status: (["Active", "Pending", "Completed"] as const)[i % 3],
    value: [420, 1200, 890, 260, 340, 760][i],
    date: `2026-10-${String(16 - i * 2).padStart(2, "0")}`,
  }));
}
export const DEMO_POINTS = observations("commerce").slice(-7);
