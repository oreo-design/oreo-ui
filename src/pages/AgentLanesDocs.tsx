import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { PAGE_META } from "@/lib/site";
import {
  AgentLanes,
  AgentLaneIdentity,
  AgentTaskBar,
  AgentTimelineAxis,
} from "@/components/agent-lanes";
import { LANE_AGENTS, LANE_TASKS } from "@/patterns/agent-lanes/data";
export function AgentLanesDocs({ nav }: { nav: DocsNav }) {
  const [selected, setSelected] = useState<string>();
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ?? "Agent Lanes";
  const preview =
    nav.active === "agent-lane-identity" ? (
      <AgentLaneIdentity agent={LANE_AGENTS[0]} status="running" />
    ) : nav.active === "agent-task-bar" ? (
      <div className="w-full max-w-md">
        <AgentTaskBar
          task={LANE_TASKS[1]}
          now={0}
          selected={selected === LANE_TASKS[1].id}
          onSelect={setSelected}
        />
      </div>
    ) : nav.active === "agent-timeline-axis" ? (
      <div className="w-full pt-10">
        <AgentTimelineAxis />
      </div>
    ) : (
      <AgentLanes
        agents={LANE_AGENTS}
        tasks={LANE_TASKS}
        selectedId={selected}
        onSelect={setSelected}
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
        { id: "states", label: "States & copy" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Time-based agent activity inspired by{" "}
              <a
                className="underline"
                href="https://x.com/flohoeller/status/2111405211478900836"
              >
                Flo’s Agent lanes
              </a>
              . Inspect running work, approval requests and cross-agent
              handoffs.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/agent-lanes-workspace"
            >
              Open the complete Agent Lanes workspace →
            </a>
          </header>
          <Section id="composition" title="Composition">
            <PreviewTabs
              preview={<div className="w-full p-6">{preview}</div>}
              code={
                "<AgentLanes agents={agents} tasks={tasks} now={clock} minutes={30}\n  selectedId={selected} onSelect={setSelected} />"
              }
            />
            <CodeBlock
              lang="text"
              code="Copy src/components/agent-lanes/ and its Oreo imports: Avatar, Icon, StatusIcon, AgentWorkspaceState, SkeletonReveal. No new packages. Complete local template: src/patterns/agent-lanes/."
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "AgentLaneIdentity: agent / status",
                  type: "LaneAgent / LaneStatus | idle",
                  desc: "Independent identity and live state. Model text is host-owned; no model availability claim. Defaults to idle.",
                },
                {
                  prop: "AgentTimelineAxis: minutes",
                  type: "number",
                  desc: "Positive duration; defaults to 30. Six relative ticks and now marker. Place in a positioned time track; board provides the identity gutter.",
                },
                {
                  prop: "AgentTaskBar: task / now / selected / onSelect",
                  type: "LaneTask / number / boolean / callback?",
                  desc: "Task state and selection are independent. Hover/focus summary; Escape dismisses. Native button supports Enter/Space. Parent owns time position and detail navigation.",
                },
                {
                  prop: "AgentLanes: agents / tasks / now / minutes",
                  type: "readonly arrays / number / number",
                  desc: "Minutes on one consistent host clock. null end means active. Clips outside the time window; overlaps stack; globally unique IDs, known agent IDs and valid intervals required. Handoffs render only when both tasks are visible.",
                },
                {
                  prop: "selectedId / onSelect / actions",
                  type: "string? / callback? / ReactNode?",
                  desc: "Host-controlled selection; header slot for actual range controls. No hidden persistence, timers or external side effects in components.",
                },
                {
                  prop: "loading / error / onRetry / onClear",
                  type: "boolean / string? / callbacks?",
                  desc: "SkeletonReveal on initial load; refreshing preserves existing data. Error and empty use AgentWorkspaceState. Clear action supplied only for a filtered result.",
                },
              ]}
            />
          </Section>
          <Section id="states" title="States, copy and layout">
            <p className="text-sm leading-7 text-text-secondary">
              Running, Needs you, Completed and Failed include text or
              accessible names alongside color. Long bar labels truncate;
              summaries and the template detail panel preserve full text.
              Agent/model labels wrap. The template uses English sample copy and
              local simulation; hosts own localization and time units. Wide and
              medium containers keep a fixed identity column. Narrow screens
              scroll the time region horizontally, with an opaque sticky
              identity column. Motion follows reduced-motion preferences; the
              template starts paused. See the pattern README for state
              transitions and integration limits.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
