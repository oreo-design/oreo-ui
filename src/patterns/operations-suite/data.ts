import type {
  OperationEvent,
  OperationPoint,
  HealthReading,
  RouteStop,
} from "@/components/operations";
export const VEHICLES = [
  {
    id: "TRK-04",
    driver: "Amara Kone",
    from: "North depot",
    to: "East warehouse",
    status: "Delayed",
    eta: "16:45",
    speed: 58,
    fuel: 67,
    load: 60,
    weight: "8.4 t",
    temperature: "4°C",
    x: 58,
    y: 40,
  },
  {
    id: "TRK-03",
    driver: "Williams Joe",
    from: "Old town",
    to: "North depot",
    status: "In transit",
    eta: "16:20",
    speed: 46,
    fuel: 82,
    load: 78,
    weight: "10.9 t",
    temperature: "6°C",
    x: 30,
    y: 58,
  },
  {
    id: "TRK-05",
    driver: "Chijioke Nwosu",
    from: "East yard",
    to: "South depot",
    status: "In transit",
    eta: "17:30",
    speed: 42,
    fuel: 54,
    load: 45,
    weight: "6.3 t",
    temperature: "3°C",
    x: 75,
    y: 65,
  },
  {
    id: "TRK-06",
    driver: "Fola Adebayo",
    from: "South depot",
    to: "Old town",
    status: "Completed",
    eta: "15:10",
    speed: 0,
    fuel: 39,
    load: 0,
    weight: "0 t",
    temperature: "—",
    x: 20,
    y: 74,
  },
  {
    id: "TRK-07",
    driver: "Ngozi Okafor",
    from: "North depot",
    to: "East yard",
    status: "Idle",
    eta: "—",
    speed: 0,
    fuel: 94,
    load: 0,
    weight: "0 t",
    temperature: "—",
    x: 22,
    y: 22,
  },
];
export type Vehicle = (typeof VEHICLES)[number];
export const vehicleEvent = (v: Vehicle): OperationEvent => ({
  id: v.id,
  title: v.id,
  detail: `${v.from} → ${v.to}`,
  time: v.eta,
  status: `${v.driver} · ${v.status}`,
  tone:
    v.status === "Delayed"
      ? "danger"
      : v.status === "Completed"
        ? "success"
        : v.status === "Idle"
          ? "warning"
          : "info",
});
export const vehiclePoint = (v: Vehicle): OperationPoint => ({
  id: v.id,
  label: v.id,
  x: v.x,
  y: v.y,
  tone: vehicleEvent(v).tone,
});
export const vehicleStops = (v: Vehicle): RouteStop[] =>
  v.status === "Idle"
    ? [
        {
          id: "load",
          label: "Awaiting assignment",
          detail: `At ${v.from}`,
          state: "current",
        },
        {
          id: "dest",
          label: v.to,
          detail: "Departure not scheduled",
          state: "upcoming",
        },
      ]
    : [
        {
          id: "start",
          label: v.from,
          detail: "Departed · 09:14",
          state: "complete",
        },
        {
          id: "checkpoint",
          label: "River checkpoint",
          detail: "Passed · 11:32",
          state: "complete",
        },
        {
          id: "current",
          label: v.status === "Completed" ? v.to : "District junction",
          detail:
            v.status === "Completed"
              ? `Delivered · ${v.eta}`
              : v.status === "Delayed"
                ? "Congestion · 22 minutes late"
                : "On schedule",
          state: v.status === "Completed" ? "complete" : "current",
        },
        ...(v.status === "Completed"
          ? []
          : [
              {
                id: "end",
                label: v.to,
                detail: `Estimated arrival · ${v.eta}`,
                state: "upcoming" as const,
              },
            ]),
      ];
export type Incident = OperationEvent & {
  district: string;
  x: number;
  y: number;
  category: string;
};
export const INCIDENTS: Incident[] = [
  {
    id: "INC-108",
    title: "Road obstruction",
    detail: "North Avenue · Junction 4",
    time: "12:24",
    tone: "danger",
    district: "North",
    x: 28,
    y: 28,
    category: "Traffic",
  },
  {
    id: "INC-107",
    title: "Warehouse alarm",
    detail: "East yard · Unit 12",
    time: "12:16",
    tone: "warning",
    district: "East",
    x: 76,
    y: 30,
    category: "Property",
  },
  {
    id: "INC-106",
    title: "Signal outage",
    detail: "River crossing · Bridge 2",
    time: "12:08",
    tone: "info",
    district: "North",
    x: 48,
    y: 44,
    category: "Infrastructure",
  },
  {
    id: "INC-105",
    title: "Vehicle breakdown",
    detail: "South depot · Access road",
    time: "12:04",
    tone: "warning",
    district: "South",
    x: 72,
    y: 72,
    category: "Traffic",
  },
  {
    id: "INC-104",
    title: "Water leak",
    detail: "Old town · Market street",
    time: "11:56",
    tone: "info",
    district: "South",
    x: 25,
    y: 69,
    category: "Infrastructure",
  },
  {
    id: "INC-103",
    title: "Access gate fault",
    detail: "East yard · Main entrance",
    time: "11:41",
    tone: "warning",
    district: "East",
    x: 83,
    y: 51,
    category: "Property",
  },
];
export const HEALTH: HealthReading[] = [
  { label: "Data freshness", value: 98, status: "Within SLA", tone: "success" },
  {
    label: "Feature drift",
    value: 14,
    status: "Below 15% limit",
    tone: "warning",
  },
  { label: "Null rate", value: 1.8, status: "Below 2% limit", tone: "success" },
  {
    label: "Schema match",
    value: 100,
    status: "All fields match",
    tone: "success",
  },
];
export const MODULES = [
  {
    id: "data-ingestion",
    title: "data-ingestion",
    file: "data_ingestion.py",
    description: "Fetch and validate the daily observation batch.",
    source:
      '# data_ingestion.py\n# Sample ingestion module — not connected to a data source\nfrom pathlib import Path\n\nBATCH_LIMIT = 500\nSOURCE = "daily_observations.csv"\n\ndef ingest(path):\n    if not Path(path).exists():\n        raise ValueError("Missing source file")\n    return {"source": path, "limit": BATCH_LIMIT}\n',
  },
  {
    id: "feature-pipeline",
    title: "feature-pipeline",
    file: "feature_pipeline.py",
    description: "Normalize observations and prepare model features.",
    source:
      '# feature_pipeline.py\n# Feature engineering · illustrative Python\n# Maintainer: Oreo Labs / Data Platform\n\nfrom __future__ import annotations\nfrom dataclasses import dataclass\nfrom pathlib import Path\n\n# ── Constants ─────────────────────────────────\nMAX_NULL_RATE = 0.018\nDRIFT_THRESHOLD = 0.15\nWINDOW_DAYS = 90\nMIN_SAMPLE_SIZE = 500\nCARDINALITY_CAP = 256\nVERSION_TAG = "v2.0.4"\n\n# ── Schema ────────────────────────────────────\n@dataclass\nclass FeatureBatch:\n    source: str\n    rows: int\n    validated: bool = False\n\ndef normalize(batch):\n    if batch.rows < MIN_SAMPLE_SIZE:\n        raise ValueError("Not enough observations")\n    return batch\n',
  },
  {
    id: "model-registry",
    title: "model-registry",
    file: "model_registry.py",
    description: "Track the sample model version and its stage.",
    source:
      '# model_registry.py\n# Local registry example\nfrom dataclasses import dataclass\n\nMODEL_NAME = "credit-scoring"\nVERSION_TAG = "v2.0.4"\nSTAGE = "staging"\n\ndef model_reference():\n    return {"name": MODEL_NAME, "version": VERSION_TAG}\n',
  },
];
export const DEFAULT_CONFIG = JSON.stringify(
  {
    min_sample_size: 500,
    window_days: 90,
    max_null_rate: 0.02,
    drift_threshold: 0.15,
  },
  null,
  2,
);
export type ConfigCheck = { label: string; passed: boolean };
/** These checks validate configuration shape/ranges only; they do not execute Python or infer model health. */
export function checkConfig(source: string): ConfigCheck[] {
  let c: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(source);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    c = parsed as Record<string, unknown>;
  } catch {
    return [{ label: "Configuration must be a JSON object", passed: false }];
  }
  return [
    {
      label: "Minimum sample size: integer ≥ 100",
      passed:
        typeof c.min_sample_size === "number" &&
        Number.isSafeInteger(c.min_sample_size) &&
        c.min_sample_size >= 100,
    },
    {
      label: "Observation window: integer from 1 to 365 days",
      passed:
        typeof c.window_days === "number" &&
        Number.isInteger(c.window_days) &&
        c.window_days >= 1 &&
        c.window_days <= 365,
    },
    ...["max_null_rate", "drift_threshold"].map((key) => ({
      label: `${key}: number from 0 to 1`,
      passed:
        typeof c[key] === "number" &&
        Number.isFinite(c[key]) &&
        c[key] >= 0 &&
        c[key] <= 1,
    })),
  ];
}

const DEPOTS: Record<string, { x: number; y: number }> = {
  "North depot": { x: 22, y: 22 },
  "East warehouse": { x: 83, y: 51 },
  "Old town": { x: 20, y: 74 },
  "East yard": { x: 76, y: 30 },
  "South depot": { x: 72, y: 72 },
};
export function vehicleRoute(v: Vehicle) {
  if (v.status === "Idle") return [];
  const origin = DEPOTS[v.from],
    destination = DEPOTS[v.to];
  return [
    origin,
    { x: (origin.x + v.x) / 2, y: (origin.y + v.y) / 2 + 8 },
    { x: v.x, y: v.y },
    ...(v.status === "Completed" ? [] : [destination]),
  ];
}
