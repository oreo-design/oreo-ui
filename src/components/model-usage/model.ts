export type UsageMetric = "costCents" | "tokens" | "requests";
export type UsageModel = {
  id: string;
  name: string;
  tone: "purple" | "orange" | "blue";
};
export type UsageDay = {
  id: string;
  label: string;
  models: Record<
    string,
    { costCents: number; tokens: number; requests: number }
  >;
  latencySamples: number[];
};
export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
export const metricValue = (n: number, metric: UsageMetric) =>
  metric === "costCents"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n / 100)
    : compact(n);
export function validUsage(days: UsageDay[], models: UsageModel[]) {
  return (
    models.length > 0 &&
    new Set(models.map((m) => m.id)).size === models.length &&
    new Set(days.map((d) => d.id)).size === days.length &&
    (["requests", "tokens", "costCents"] as const).every((key) =>
      Number.isSafeInteger(
        days.reduce(
          (sum, day) =>
            sum +
            models.reduce(
              (n, model) => n + (day.models[model.id]?.[key] ?? NaN),
              0,
            ),
          0,
        ),
      ),
    ) &&
    days.every(
      (d) =>
        d.latencySamples.every((v) => Number.isFinite(v) && v >= 0) &&
        models.every(
          (m) =>
            d.models[m.id] &&
            [
              d.models[m.id].costCents,
              d.models[m.id].tokens,
              d.models[m.id].requests,
            ].every((v) => Number.isSafeInteger(v) && v >= 0),
        ),
    )
  );
}
export function aggregateUsage(days: UsageDay[], models: UsageModel[]) {
  if (!validUsage(days, models))
    throw new RangeError(
      "Usage data requires unique IDs and nonnegative integer counts",
    );
  const rows = models.map((m) => ({
    ...m,
    ...days.reduce(
      (a, d) => ({
        requests: a.requests + d.models[m.id].requests,
        tokens: a.tokens + d.models[m.id].tokens,
        costCents: a.costCents + d.models[m.id].costCents,
      }),
      { requests: 0, tokens: 0, costCents: 0 },
    ),
  }));
  const total = rows.reduce(
    (a, r) => ({
      requests: a.requests + r.requests,
      tokens: a.tokens + r.tokens,
      costCents: a.costCents + r.costCents,
    }),
    { requests: 0, tokens: 0, costCents: 0 },
  );
  const latency = days.flatMap((d) => d.latencySamples).sort((a, b) => a - b);
  return {
    rows,
    total,
    p95: latency.length ? latency[Math.ceil(latency.length * 0.95) - 1] : null,
    sampleCount: latency.length,
  };
}
export function recordSampleRun(days: UsageDay[], modelId: string) {
  if (!days.length || !days.at(-1)?.models[modelId]) return days;
  return days.map((d, i) =>
    i !== days.length - 1
      ? d
      : {
          ...d,
          models: {
            ...d.models,
            [modelId]: {
              requests: d.models[modelId].requests + 1,
              tokens: d.models[modelId].tokens + 1842,
              costCents: d.models[modelId].costCents + 5,
            },
          },
          latencySamples: [...d.latencySamples, 920],
        },
  );
}
export function usageCsv(days: UsageDay[], models: UsageModel[]) {
  const quote = (s: string) => `"${s.replaceAll('"', '""')}"`;
  return (
    "date,model,requests,tokens,cost_usd\n" +
    days
      .flatMap((d) =>
        models.map((m) =>
          [
            quote(d.id),
            quote(m.name),
            d.models[m.id].requests,
            d.models[m.id].tokens,
            (d.models[m.id].costCents / 100).toFixed(2),
          ].join(","),
        ),
      )
      .join("\n")
  );
}
