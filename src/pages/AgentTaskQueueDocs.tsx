import { useReducer, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { PAGE_META } from "@/lib/site";
import { Button } from "@/components/button";
import {
  AgentTaskQueue,
  QueueTaskRow,
  TaskClarification,
  QueuedRequestStack,
  queueReducer,
} from "@/components/agent-task-queue";
import { QUEUE_TASKS, QUEUE_QUESTIONS } from "@/patterns/agent-task-queue/data";
export function AgentTaskQueueDocs({ nav }: { nav: DocsNav }) {
  const [state, dispatch] = useReducer(queueReducer, {
      tasks: QUEUE_TASKS,
      playing: false,
      epoch: 0,
      notice: "",
      removed: [],
    }),
    [expanded, setExpanded] = useState<string | null>(null),
    [stack, setStack] = useState(false),
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [saved, setSaved] = useState(false);
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ??
    "Agent Task Queue";
  const preview =
    nav.active === "queue-task-row" ? (
      <QueueTaskRow
        task={state.tasks[0] ?? QUEUE_TASKS[0]}
        expanded={expanded === "height"}
        onToggle={() => setExpanded(expanded ? null : "height")}
        onPause={() => dispatch({ type: "pause-task", id: "height" })}
        onResume={() => dispatch({ type: "resume-task", id: "height" })}
      >
        <p className="text-sm text-text-secondary">{QUEUE_TASKS[0].context}</p>
      </QueueTaskRow>
    ) : nav.active === "task-clarification" ? (
      <>
        <TaskClarification
          questions={QUEUE_QUESTIONS}
          answers={answers}
          step={step}
          onChange={setAnswers}
          onStepChange={setStep}
          onSubmit={() => setSaved(true)}
        />
        {saved && (
          <p role="status" className="text-sm mt-3">
            Answers saved in this local example.
          </p>
        )}
      </>
    ) : nav.active === "queued-request-stack" ? (
      <QueuedRequestStack
        requests={state.tasks}
        expanded={stack}
        onExpandedChange={setStack}
      />
    ) : (
      <AgentTaskQueue
        tasks={state.tasks}
        expandedId={expanded}
        onExpand={setExpanded}
        onMove={(id, over) => dispatch({ type: "move", id, over })}
        onPause={(id) => dispatch({ type: "pause-task", id })}
        onResume={(id) => dispatch({ type: "resume-task", id })}
        onRemove={(id) => dispatch({ type: "remove", id })}
        renderDetail={(task) => (
          <p className="text-xs text-text-secondary">{task.context}</p>
        )}
        onReset={() => dispatch({ type: "reset", tasks: QUEUE_TASKS })}
      />
    );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
        { id: "rules", label: "States, copy & layout" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A continuous, reorderable agent queue inspired by{" "}
              <a
                className="underline"
                href="https://x.com/eyexayuh/status/2112042083536236933"
              >
                Isaiah’s queued tasks exploration
              </a>
              . Pause a request, add context or answer a question while other
              work keeps moving.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/agent-queue-workspace"
            >
              Open the complete Agent Queue workspace →
            </a>
          </header>
          <Section id="composition" title="Composition">
            <PreviewTabs
              preview={
                <div className="w-full max-w-xl p-6">
                  {preview}
                  {state.removed.length > 0 && (
                    <Button
                      type="secondary"
                      size="sm"
                      onClick={() => dispatch({ type: "undo" })}
                    >
                      Undo removal
                    </Button>
                  )}
                </div>
              }
              code={
                "<AgentTaskQueue tasks={tasks} expandedId={expandedId}\n onExpand={setExpanded} onMove={moveTask} onPause={pauseTask}\n onResume={resumeTask} onRemove={removeTask} renderDetail={renderContext} />"
              }
            />
            <CodeBlock
              lang="text"
              code="Copy src/components/agent-task-queue/ and its existing Oreo imports: Button, IconButton, Icon, ShimmerText, AgentWorkspaceState, SkeletonReveal. Uses installed dnd-kit and Motion. Optional reducer: model.ts. Complete template: src/patterns/agent-task-queue/. No new packages."
            />
          </Section>
          <Section id="api" title="Independent properties and callbacks">
            <PropsTable
              rows={[
                {
                  prop: "QueueTaskRow: task / expanded / suspended",
                  type: "QueueTask / boolean / boolean",
                  desc: "Five task states: queued, running, paused, needs-context, done. Expansion and session suspension are independent; suspended stops the working shimmer without changing the persisted task state.",
                },
                {
                  prop: "onToggle / onPause / onResume / onRemove / handle / children",
                  type: "callbacks? / ReactNode?",
                  desc: "Host-owned actions and detail content. Buttons appear only for supplied handlers and applicable states. Optional handle integrates the queue's drag behavior.",
                },
                {
                  prop: "AgentTaskQueue: tasks / expandedId / onExpand",
                  type: "readonly QueueTask[] / string | null / callback?",
                  desc: "Flat ordered collection with globally unique IDs. Selection/expansion does not mutate task status. Empty state uses AgentWorkspaceState.",
                },
                {
                  prop: "onMove(id, over) / renderDetail / loading / error",
                  type: "callbacks / boolean / string",
                  desc: "Move uses stable IDs; pointer and keyboard sensors. SkeletonReveal preserves readable data during refresh. Error replaces the queue until retry; loading with no data takes precedence. No hidden execution in the component.",
                },
                {
                  prop: "TaskClarification: questions / answers / step",
                  type: "readonly QueueQuestion[] / Record<string,string> / number",
                  desc: "Controlled questions, values and zero-based step. One answer per question, option or custom text; 1–500 trimmed characters. Back retains values; final submit requires all answers.",
                },
                {
                  prop: "onChange / onStepChange / onSubmit / pending / error",
                  type: "callbacks / boolean / string",
                  desc: "Host owns submission and async failures. Pending disables entry/actions; errors preserve answers. Host resets the question step when changing question sets.",
                },
                {
                  prop: "QueuedRequestStack: requests / expanded / onExpandedChange",
                  type: "readonly {id,title}[] / boolean / callback",
                  desc: "First request plus additional count, or expanded full request history. Empty array renders nothing; one request displays +0. Titles remain full in expanded content.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="Interaction, copy and layout">
            <p className="text-sm leading-7 text-text-secondary">
              Enter/Space activate native task actions. Drag the grip, or press
              Space then arrows then Space to reorder; Escape cancels. The queue
              has no nesting. Task states have accessible names and text in
              context, independent of color. Pointer-only action fading becomes
              fully visible on focus and touch layouts. Shimmer and sorting
              respect reduced motion. Long task text wraps; request summaries
              truncate and expand. Copy is English sample text; hosts own
              localization, request IDs, live permissions, execution and
              cancellation. The local reducer starts at most one task, skips
              missing input, preserves progress across pause, rejects old timer
              epochs, and supports removal/undo. Details and drafts remain
              host-owned. The template's composer and questions are local
              fixtures, not a connected agent.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
