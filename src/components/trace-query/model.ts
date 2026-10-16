export type QueryField = {
  key: string;
  label: string;
  type: "text" | "number" | "enum";
  options?: string[];
  min?: number;
  max?: number;
};
export type QueryOperator = "eq" | "neq" | "contains" | "gte" | "lte";
export type QueryCondition = {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string;
};
export const OPERATOR_LABELS: Record<QueryOperator, string> = {
  eq: "is",
  neq: "is not",
  contains: "contains",
  gte: "at least",
  lte: "at most",
};
export const fieldOperators = (field: QueryField): QueryOperator[] =>
  field.type === "number"
    ? ["eq", "gte", "lte"]
    : field.type === "enum"
      ? ["eq", "neq"]
      : ["contains", "eq", "neq"];
export function validateCondition(
  condition: QueryCondition,
  fields: QueryField[],
) {
  const field = fields.find((f) => f.key === condition.field);
  if (!field) return "Choose a field.";
  if (!fieldOperators(field).includes(condition.operator))
    return "Choose a supported condition.";
  if (!condition.value.trim()) return "Enter a value.";
  if (field.type === "number") {
    const n = Number(condition.value);
    if (!Number.isFinite(n)) return "Enter a finite number.";
    if (field.min !== undefined && n < field.min)
      return `Value must be at least ${field.min}.`;
    if (field.max !== undefined && n > field.max)
      return `Value must be at most ${field.max}.`;
  }
  if (field.type === "enum" && !field.options?.includes(condition.value))
    return "Choose an available value.";
  return null;
}
export type QueryRecord = Record<
  string,
  string | number | string[] | null | undefined
>;
/** Conditions are ANDed. Missing values never match, including numeric zero or inequality. */
export function matchesQuery(
  record: QueryRecord,
  conditions: QueryCondition[],
  fields: QueryField[],
) {
  return conditions.every((c) => {
    if (validateCondition(c, fields)) return false;
    const raw = record[c.field];
    if (raw == null) return false;
    const field = fields.find((f) => f.key === c.field)!;
    if (field.type === "number") {
      if (typeof raw !== "number" || !Number.isFinite(raw)) return false;
      const n = Number(c.value);
      return c.operator === "gte"
        ? raw >= n
        : c.operator === "lte"
          ? raw <= n
          : raw === n;
    }
    const expected = c.value.trim().toLowerCase();
    const values = (Array.isArray(raw) ? raw : [String(raw)]).map((v) =>
      v.toLowerCase(),
    );
    return c.operator === "contains"
      ? values.some((v) => v.includes(expected))
      : c.operator === "neq"
        ? !values.includes(expected)
        : values.includes(expected);
  });
}
export type TraceStatus = "success" | "error" | "running";
export type TraceRecord = {
  id: string;
  startedAt: string;
  kind: string;
  name: string;
  primitiveId: string;
  environment: string;
  status: TraceStatus;
  input: string;
  output: string;
  durationMs: number | null;
  costUsd: number | null;
  score: number | null;
  feedback: "positive" | "negative" | null;
  model: string;
  tags: string[];
  spans: { name: string; status: TraceStatus; durationMs: number | null }[];
};
export const TRACE_FIELDS: QueryField[] = [
  {
    key: "environment",
    label: "Environment",
    type: "enum",
    options: ["Production", "Preview"],
  },
  { key: "name", label: "Primitive name", type: "text" },
  {
    key: "kind",
    label: "Primitive type",
    type: "enum",
    options: ["Agent", "Workflow", "Scorer"],
  },
  {
    key: "status",
    label: "Status",
    type: "enum",
    options: ["success", "error", "running"],
  },
  { key: "tags", label: "Tags", type: "text" },
  { key: "primitiveId", label: "Primitive ID", type: "text" },
  { key: "id", label: "Trace ID", type: "text" },
  { key: "model", label: "Model", type: "text" },
  { key: "durationMs", label: "Duration (ms)", type: "number", min: 0 },
  { key: "score", label: "Score", type: "number", min: 0, max: 1 },
  {
    key: "feedback",
    label: "Feedback",
    type: "enum",
    options: ["positive", "negative"],
  },
];
export const TRACE_COLUMNS = [
  "startedAt",
  "kind",
  "name",
  "input",
  "status",
  "durationMs",
  "costUsd",
  "score",
  "feedback",
] as const;
export type TraceColumn = (typeof TRACE_COLUMNS)[number];
export const TRACE_COLUMN_LABELS: Record<TraceColumn, string> = {
  startedAt: "Start (UTC)",
  kind: "Primitive type",
  name: "Primitive name",
  input: "Input",
  status: "Status",
  durationMs: "Duration",
  costUsd: "Est. cost",
  score: "Score",
  feedback: "Feedback",
};
export const DEFAULT_TRACE_COLUMNS: TraceColumn[] = [
  "startedAt",
  "kind",
  "name",
  "input",
  "status",
  "durationMs",
  "costUsd",
];
export type TraceSort = "newest" | "oldest" | "duration" | "score";
export function selectTraces(
  records: TraceRecord[],
  conditions: QueryCondition[],
  from: number | null,
  search: string,
  sort: TraceSort,
) {
  const q = search.trim().toLowerCase();
  return records
    .filter(
      (t) =>
        (from === null || Date.parse(t.startedAt) >= from) &&
        (!q || [t.id, t.input, t.name].join(" ").toLowerCase().includes(q)) &&
        matchesQuery({ ...t, spans: undefined }, conditions, TRACE_FIELDS),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? Date.parse(a.startedAt) - Date.parse(b.startedAt)
        : sort === "duration"
          ? (b.durationMs ?? -1) - (a.durationMs ?? -1)
          : sort === "score"
            ? (a.score ?? Infinity) - (b.score ?? Infinity)
            : Date.parse(b.startedAt) - Date.parse(a.startedAt),
    );
}
export function queryDocument(
  conditions: QueryCondition[],
  from: number | null,
  search: string,
  sort: TraceSort,
) {
  return {
    schema: "oreo-trace-query/v1",
    match: "all",
    from: from === null ? null : new Date(from).toISOString(),
    search,
    sort,
    conditions: conditions.map(({ field, operator, value }) => ({
      field,
      operator,
      value:
        TRACE_FIELDS.find((f) => f.key === field)?.type === "number"
          ? Number(value)
          : value,
    })),
  };
}
export function formatDuration(ms: number | null) {
  return ms === null
    ? "—"
    : ms < 1000
      ? `${ms}ms`
      : `${(ms / 1000).toFixed(2)}s`;
}
export function formatTraceTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(iso));
}
