import type { TraceRecord } from "@/components/trace-query";
export const SNAPSHOT = Date.parse("2026-10-16T12:00:00Z");
const inputs = [
  "How do I add memory to my documentation agent?",
  "Find the deployment guide and summarize the required environment variables.",
  "Compare yesterday's support escalations with the previous week.",
  "Evaluate the answer for factual accuracy and source attribution.",
  "Which tools can the research agent call in a workflow?",
  "Draft a response using only the retrieved documentation.",
];
/** Deterministic local fixtures, including unscored, failed and running traces. */
export const SAMPLE_TRACES: TraceRecord[] = Array.from(
  { length: 36 },
  (_, i): TraceRecord => {
    const kind = i % 6 === 2 ? "Workflow" : i % 6 === 3 ? "Scorer" : "Agent";
    const status = i === 0 ? "running" : i % 5 === 1 ? "error" : "success";
    const durationMs = status === "running" ? null : 380 + ((i * 1739) % 12000);
    const name =
      kind === "Agent"
        ? "docs-agent"
        : kind === "Workflow"
          ? "support-triage"
          : "answer-quality";
    return {
      id: `tr_${(0xa7f03c + i * 137).toString(16)}`,
      startedAt: new Date(SNAPSHOT - i * i * 1200000).toISOString(),
      kind,
      name,
      primitiveId: `${name}-v2`,
      environment: i % 7 === 4 ? "Preview" : "Production",
      status,
      input: inputs[i % inputs.length],
      output:
        status === "running"
          ? "Waiting for the model response…"
          : status === "error"
            ? JSON.stringify(
                {
                  error: "RETRIEVAL_TIMEOUT",
                  message:
                    "The documentation index did not respond within the configured limit.",
                  retryable: true,
                },
                null,
                2,
              )
            : "The documentation recommends defining the agent's instructions, attaching the relevant tools, and configuring memory for conversation continuity. See the retrieved source for configuration details.",
      durationMs,
      costUsd: status === "running" ? null : ((i % 11) + 1) * 0.0007,
      score:
        status !== "success" || i % 4 === 0
          ? null
          : Number((0.54 + (i % 7) * 0.07).toFixed(2)),
      feedback:
        status !== "success" || i % 3 === 0
          ? null
          : i % 7 === 0
            ? "negative"
            : "positive",
      model: i % 3 === 0 ? "reasoning-model" : "fast-model",
      tags: ["docs", i % 7 === 4 ? "preview" : "customer"],
      spans: [
        {
          name: "Prepare context",
          status: "success",
          durationMs: status === "running" ? 82 : Math.round(durationMs! * 0.1),
        },
        {
          name: "Retrieve documents",
          status: status === "error" ? "error" : "success",
          durationMs:
            status === "running" ? 146 : Math.round(durationMs! * 0.3),
        },
        ...(status === "error"
          ? []
          : [
              {
                name: "Generate response",
                status: status as TraceRecord["status"],
                durationMs:
                  status === "running" ? null : Math.round(durationMs! * 0.6),
              },
            ]),
      ],
    };
  },
);
