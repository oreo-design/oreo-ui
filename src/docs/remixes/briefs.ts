import type { RemixSlug } from "./model";

export const briefs: Record<RemixSlug, { title: string; level: string; baseline: string; capability: { title: string; request: string; changed: string; kept: string }; style: { title: string; request: string; changed: string; kept: string } }> = {
  "prompt-box": {
    title: "Prompt Box", level: "Input → orchestration",
    baseline: "A composer with controlled text, attachments and submit callbacks. It has no queue or job lifecycle.",
    capability: { title: "Prompt queue", request: "Turn this composer into a research prompt queue. Let me edit and remove queued prompts, pause processing, and retry a failed job without losing the rest.", changed: "Added a bounded queue, editable job records, local execution state, pause/resume and explicit retry. The [fail] fixture fails once.", kept: "The real PromptBox, its textarea, Enter / Shift+Enter behavior, attachment slot and submit affordance." },
    style: { title: "Conversation composer", request: "Adapt the composer to a Claude-inspired conversation: a warm writing surface, editorial greeting and a quieter utility row. Keep typing and submission usable.", changed: "Scoped warm surface tokens, restrained border and shadow, a serif greeting and a quieter model label. Submission returns a local receipt.", kept: "The real PromptBox, input semantics, attachment removal and submit handling. This is a visual adaptation, not a new capability." },
  },
  attachment: {
    title: "Attachment", level: "File chip → document scope",
    baseline: "A file chip with a type icon, loading state and remove callback. It does not preview pages or select document ranges.",
    capability: { title: "PDF page selection", request: "Extend this PDF attachment so I can preview four sample pages, validate a page range and include only selected pages in the conversation context.", changed: "Added a paginated text facsimile, range parsing, invalid-input feedback and a committed page selection. Preview and inclusion are separate states.", kept: "The real Attachment, file identity, PDF type icon and removal. No PDF parser or upload is claimed." },
    style: { title: "Knowledge attachment", request: "Give the file chip a Claude-inspired project-knowledge treatment: compact paper-like framing, readable file metadata and an accessible removal control.", changed: "A warm knowledge card, smaller visual weight and a separate metadata line. Long filenames stay available through the accessible remove label.", kept: "The real Attachment component, file type, label and remove callback; restoring the sample is demo scaffolding." },
  },
  confirmation: {
    title: "Confirmation", level: "One decision → scoped approval",
    baseline: "A single pending / approved / denied decision with a content slot. It does not own per-operation permissions or rollback.",
    capability: { title: "Scoped approval", request: "Let me approve individual operations in a three-action request. Run only checked actions against the local sample and let me undo them together.", changed: "Added independent permission choices, empty-selection validation, an execution receipt, sample workspace changes and undo. Unchecked actions are explicitly skipped.", kept: "The real Confirmation card, decision hierarchy, denied state and resolution feedback. No real authorization is granted." },
    style: { title: "Conversation approval", request: "Fit this approval into a Claude-inspired conversation. Make the reason and exact scope easy to scan while keeping Allow once and Decline distinct.", changed: "Warm tool-permission framing, an editorial introduction, subtle borders and restrained actions. The scope remains visible after the decision.", kept: "The real Confirmation and its approval / denial lifecycle. All permissions apply only to this demo." },
  },
  plan: {
    title: "Plan", level: "Progress → dependent workflow",
    baseline: "A progress display derived from done / active / pending step props. It has no dependency checks, runner or retry state.",
    capability: { title: "Dependent workflow", request: "Make this plan executable. Each step must wait for its prerequisite; a failed evidence check should expose retry and keep the summary step locked.", changed: "Added dependency guards, a timed local runner, deliberate failure, retry and reset. Completion derives from the same step records.", kept: "The real Plan and PlanStep components, fraction, progress track and status icon vocabulary." },
    style: { title: "Task checklist", request: "Restyle the plan as a Claude-inspired task checklist: warm neutrals, more breathing room and quiet progress, retaining all step states.", changed: "An inset task surface, quieter progress accent and an editorial lead-in. A demo control advances progress.", kept: "The real Plan, derived completion count, list semantics and completed / pending step distinction." },
  },
  sources: {
    title: "Sources", level: "References → evidence selection",
    baseline: "A collapsible grid of source links. It has no query, excerpt inspection state or inclusion model.",
    capability: { title: "Evidence selection", request: "Turn the source list into an evidence selector. Search the title and quotation, inspect the original excerpt and choose which sources to carry into the answer.", changed: "Added filtering, quote inspection, explicit inclusion and a live evidence collection. Selection survives a query with no matches.", kept: "The real Sources / Source disclosure and link cards. Fixtures open local excerpts and clearly identify their limits." },
    style: { title: "Citation cards", request: "Adapt these sources to a Claude-inspired response. Use quiet citation cards and readable excerpts, preserving expansion and local link navigation.", changed: "Warm citation cards, serif excerpt typography and a compact response context. Source links reveal sample excerpts.", kept: "The real Sources / Source components, count, disclosure state and link semantics. No web research is performed by the demo." },
  },
};
