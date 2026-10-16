import {
  splitRequests,
  type AgentTelemetry,
  type AgentHealthStatus,
  type TrafficRegion,
  type InferencePoint,
} from "@/components/agent-observability/model";
export const PERIODS = [
  "Last 30 days",
  "Last 7 days",
  "Last 24 hours",
] as const;
export type Period = (typeof PERIODS)[number];
export const AGENTS: AgentTelemetry[] = [
  {
    id: "sentinel",
    name: "Sentinel",
    role: "Guardrails",
    region: "us-east",
    status: "Healthy",
    requests: 28370,
    successes: 28058,
    costPer1k: 0.4213,
    p95ms: 1204,
    model: "Guard model · small",
    version: "v2.8.1",
  },
  {
    id: "vector",
    name: "Vector QA",
    role: "Evaluations",
    region: "eu-central",
    status: "Healthy",
    requests: 21904,
    successes: 21115,
    costPer1k: 0.7386,
    p95ms: 1418,
    model: "Reasoning model · medium",
    version: "v1.9.0",
  },
  {
    id: "atlas",
    name: "Atlas RAG",
    role: "Retrieval",
    region: "us-east",
    status: "Paused",
    requests: 19420,
    successes: 17886,
    costPer1k: 1.8542,
    p95ms: 2136,
    model: "Retrieval model · large",
    version: "v3.1.2",
  },
  {
    id: "orbit",
    name: "Orbit",
    role: "Routing",
    region: "ap-south",
    status: "Deploying",
    requests: 17272,
    successes: 15286,
    costPer1k: 0.2764,
    p95ms: 912,
    model: "Router · small",
    version: "v2.4.0",
  },
  {
    id: "courier",
    name: "Courier",
    role: "Tool calls",
    region: "eu-central",
    status: "Degraded",
    requests: 15816,
    successes: 13475,
    costPer1k: 1.7431,
    p95ms: 1627,
    model: "Action model · medium",
    version: "v1.6.3",
  },
  {
    id: "prism",
    name: "Prism",
    role: "Summarization",
    region: "ap-south",
    status: "Healthy",
    requests: 15847,
    successes: 15530,
    costPer1k: 0.5642,
    p95ms: 1102,
    model: "Text model · small",
    version: "v2.0.4",
  },
];
export const REGION_INFO = [
  { id: "us-east", label: "US East", x: 24, y: 35 },
  { id: "eu-central", label: "EU Central", x: 52, y: 25 },
  { id: "ap-south", label: "AP South", x: 71, y: 49 },
];
export function periodAgents(
  period: Period,
  statuses: Record<string, AgentHealthStatus>,
) {
  const factor =
    period === "Last 30 days" ? 1 : period === "Last 7 days" ? 7 / 30 : 1 / 30;
  return AGENTS.map((a) => {
    const requests = Math.round(a.requests * factor);
    return {
      ...a,
      status: statuses[a.id] ?? a.status,
      requests,
      successes: Math.round((requests * a.successes) / a.requests),
    };
  });
}
export function trafficRegions(agents: AgentTelemetry[]): TrafficRegion[] {
  return REGION_INFO.map((r) => {
    const subset = agents.filter((a) => a.region === r.id);
    return {
      ...r,
      requests: subset.reduce((n, a) => n + a.requests, 0),
      latency: Math.round(
        subset.reduce((n, a) => n + a.p95ms, 0) / Math.max(1, subset.length),
      ),
    };
  });
}
export function inferenceSeries(
  total: number,
  period: Period,
): InferencePoint[] {
  const labels =
    period === "Last 30 days"
      ? [
          "Sep 17",
          "Sep 20",
          "Sep 23",
          "Sep 26",
          "Sep 29",
          "Oct 2",
          "Oct 5",
          "Oct 8",
          "Oct 11",
          "Oct 14",
          "Oct 16",
        ]
      : period === "Last 7 days"
        ? ["Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16"]
        : [
            "00:00",
            "02:00",
            "04:00",
            "06:00",
            "08:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00",
          ];
  const weights = [4, 5, 7, 6, 8, 5, 9, 8, 10, 12, 15, 14].slice(
      0,
      labels.length,
    ),
    values = splitRequests(total, weights);
  return labels.map((label, i) => ({ label, value: values[i] }));
}
