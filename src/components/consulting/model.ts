export type EscalationStatus = "needs-you" | "waiting" | "resolved";
export type Escalation = {
  id: string;
  client: string;
  person: string;
  role: string;
  advisor: string;
  question: string;
  summary: string;
  reason: string;
  impact: "High impact" | "Asked for you" | "Low confidence" | "Stalled";
  confidence: "Low" | "Medium" | "High";
  age: string;
  rank: number;
  facts: { label: string; value: string }[];
  draft: string;
  response?: string;
  status: EscalationStatus;
};
export type KnowledgeSource = {
  id: string;
  title: string;
  format: string;
  detail: string;
  usedFor: string;
  findings: { frameworks: number; recommendations: number; examples: number };
  status: "approved" | "review" | "duplicate";
  local?: boolean;
};
export type SourceConflict = {
  id: string;
  title: string;
  context: string;
  options: { sourceId: string; title: string; quote: string }[];
  resolution?: string;
};
export type ConversationDay = {
  id: string;
  label: string;
  answered: number;
  escalated: number;
};
export const SOURCE_LABELS = {
  approved: "Approved",
  review: "Needs review",
  duplicate: "Duplicate",
  conflict: "Conflict",
} as const;
export function sourceStatus(
  source: KnowledgeSource,
  conflicts: SourceConflict[],
) {
  return conflicts.some(
    (c) => !c.resolution && c.options.some((o) => o.sourceId === source.id),
  )
    ? "conflict"
    : source.status;
}
/** Explicit ask-on-use keeps both sources approved but preserves a human decision policy. */
export function resolveConflict(
  sources: KnowledgeSource[],
  conflicts: SourceConflict[],
  id: string,
  choice: string,
) {
  const conflict = conflicts.find((c) => c.id === id);
  if (
    !conflict ||
    conflict.resolution ||
    !(choice === "ask" || conflict.options.some((o) => o.sourceId === choice))
  )
    return { sources, conflicts };
  return {
    sources: sources.map((s) =>
      conflict.options.some((o) => o.sourceId === s.id)
        ? {
            ...s,
            status:
              choice === "ask" || s.id === choice
                ? ("approved" as const)
                : ("duplicate" as const),
          }
        : s,
    ),
    conflicts: conflicts.map((c) =>
      c.id === id ? { ...c, resolution: choice } : c,
    ),
  };
}
export function sourceSummary(
  sources: KnowledgeSource[],
  conflicts: SourceConflict[],
) {
  return sources.reduce(
    (a, s) => {
      const status = sourceStatus(s, conflicts);
      a.total++;
      a[status]++;
      if (status === "approved") {
        a.frameworks += s.findings.frameworks;
        a.recommendations += s.findings.recommendations;
        a.examples += s.findings.examples;
      }
      return a;
    },
    {
      total: 0,
      approved: 0,
      review: 0,
      duplicate: 0,
      conflict: 0,
      frameworks: 0,
      recommendations: 0,
      examples: 0,
    },
  );
}
export function validateSourceFile(file: { name: string; size: number }) {
  if (!/\.(pdf|docx|pptx|xlsx)$/i.test(file.name))
    return "Use PDF, DOCX, PPTX or XLSX files.";
  if (!Number.isSafeInteger(file.size) || file.size <= 0)
    return "Empty files cannot be added.";
  if (file.size > 50 * 1024 * 1024) return "Files must be 50 MB or smaller.";
  return null;
}
export function validConversationDays(days: ConversationDay[]) {
  return (
    new Set(days.map((d) => d.id)).size === days.length &&
    days.every((d) =>
      [d.answered, d.escalated].every((v) => Number.isSafeInteger(v) && v >= 0),
    )
  );
}
