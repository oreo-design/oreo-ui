import type {
  EdgeRegion,
  LatencySample,
  DeploymentEntry,
} from "@/components/edge-monitor";
export type MonitorPeriod = "1h" | "24h" | "7d";
export const REGIONS: EdgeRegion[] = [
  {
    id: "sfo1",
    city: "San Francisco",
    x: 15,
    y: 37,
    requests: 265000,
    latency: 34,
    errors: 0.01,
  },
  {
    id: "iad1",
    city: "Washington, D.C.",
    x: 28,
    y: 34,
    requests: 418000,
    latency: 31,
    errors: 0.02,
  },
  {
    id: "gru1",
    city: "São Paulo",
    x: 32,
    y: 73,
    requests: 88000,
    latency: 42,
    errors: 0.02,
  },
  {
    id: "lhr1",
    city: "London",
    x: 49,
    y: 25,
    requests: 232000,
    latency: 29,
    errors: 0.01,
  },
  {
    id: "fra1",
    city: "Frankfurt",
    x: 56,
    y: 31,
    requests: 312000,
    latency: 28,
    errors: 0.01,
  },
  {
    id: "bom1",
    city: "Mumbai",
    x: 68,
    y: 48,
    requests: 97000,
    latency: 48,
    errors: 0.03,
  },
  {
    id: "sin1",
    city: "Singapore",
    x: 76,
    y: 61,
    requests: 158000,
    latency: 124,
    errors: 0.36,
  },
  {
    id: "hkg1",
    city: "Hong Kong",
    x: 80,
    y: 43,
    requests: 119000,
    latency: 36,
    errors: 0.01,
  },
  {
    id: "hnd1",
    city: "Tokyo",
    x: 89,
    y: 31,
    requests: 201000,
    latency: 33,
    errors: 0.02,
  },
  {
    id: "syd1",
    city: "Sydney",
    x: 87,
    y: 78,
    requests: 62000,
    latency: 44,
    errors: 0.01,
  },
];
export const DEPLOYMENTS: DeploymentEntry[] = [
  {
    id: "4131",
    title: "Refine image caching in Singapore",
    hash: "a91e04c",
    author: "Maya Reed",
    time: "14m",
    status: "ready",
  },
  {
    id: "4127",
    title: "Extend edge image cache lifetime",
    hash: "3fd2b7a",
    author: "Jamie Lee",
    time: "3h",
    status: "attention",
  },
  {
    id: "4123",
    title: "Route cart requests closer to customers",
    hash: "c0e1192",
    author: "Alex Kim",
    time: "7h",
    status: "ready",
  },
  {
    id: "4119",
    title: "Update edge function runtime",
    hash: "77ab3e0",
    author: "Maya Reed",
    time: "12h",
    status: "ready",
  },
];
export function latencySamples(
  period: MonitorPeriod,
  region?: EdgeRegion,
): LatencySample[] {
  return Array.from({ length: 25 }, (_, i) => {
    const base = region?.latency && region.latency < 80 ? region.latency : 34;
    const spike =
      !region || region.id === "sin1"
        ? Math.max(0, 1 - Math.abs(i - 15) / 3) * (period === "1h" ? 35 : 90)
        : 0;
    const p95 = Math.round(base + ((i * 7) % 9) - 4 + spike);
    return {
      label:
        period === "1h"
          ? `${String(Math.floor(i * 2.5)).padStart(2, "0")}m`
          : period === "7d"
            ? `Oct ${8 + Math.floor(i / 4)}`
            : `${String(i === 24 ? 0 : i).padStart(2, "0")}:00`,
      p50: Math.round(base * 0.42 + (i % 3)),
      p95,
      p99: Math.round(p95 * 1.5 + 12),
    };
  });
}
export const REQUESTS = Array.from({ length: 36 }, (_, i) => ({
  id: `req_${String(i + 1).padStart(4, "0")}`,
  region: REGIONS[i % REGIONS.length].id,
  path: ["/api/products", "/api/cart", "/images/hero.webp", "/api/search"][
    i % 4
  ],
  status: i % 10 === 6 ? 504 : 200,
  latency: i % 10 === 6 ? 124 : 24 + ((i * 7) % 28),
  time: `14:${String(58 - Math.floor(i / 2)).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
}));
