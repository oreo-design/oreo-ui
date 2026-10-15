import type { Deployment } from "@/components/command-search";
export const DEPLOYMENTS: Deployment[] = [
  {
    id: "dpl-1042",
    name: "oreo-web",
    branch: "main",
    commit: "1f8cd7c",
    time: "12 minutes ago",
    status: "ready",
  },
  {
    id: "dpl-1041",
    name: "design-system",
    branch: "feat/tokens",
    commit: "a42d18e",
    time: "48 minutes ago",
    status: "ready",
  },
  {
    id: "dpl-1040",
    name: "customer-portal",
    branch: "fix/auth",
    commit: "b731c09",
    time: "1 hour ago",
    status: "failed",
  },
  {
    id: "dpl-1039",
    name: "oreo-docs",
    branch: "main",
    commit: "d802e41",
    time: "2 hours ago",
    status: "ready",
  },
];
export const TRAFFIC = [
  { day: "Mon", requests: 18400 },
  { day: "Tue", requests: 22100 },
  { day: "Wed", requests: 19200 },
  { day: "Thu", requests: 28700 },
  { day: "Fri", requests: 31600 },
  { day: "Sat", requests: 24800 },
  { day: "Sun", requests: 36400 },
];
