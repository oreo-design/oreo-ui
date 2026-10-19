import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { playgroundCode } from "@/docs/playground/code";
import { PAGE_META } from "@/lib/site";
import {
  AdaptiveIssueTable,
  AdaptiveIssueRow,
  PullRequestPill,
  ResizeFrame,
} from "@/components/adaptive-issues";
import { ADAPTIVE_ISSUES } from "@/patterns/adaptive-issues/data";
export function AdaptiveIssuesDocs({ nav }: { nav: DocsNav }) {
  const [width, setWidth] = useState(840);
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ?? "Adaptive Issues";
  const content =
    nav.active === "pull-request-pill" ? (
      <PullRequestPill number={1184} state="open" />
    ) : nav.active === "adaptive-issue-row" ? (
      <div className="adapt-table w-full">
        <ul className="adapt-rows">
          <AdaptiveIssueRow issue={ADAPTIVE_ISSUES[0]} />
        </ul>
      </div>
    ) : nav.active === "resize-frame" ? (
      <ResizeFrame width={width} onWidthChange={setWidth}>
        <div className="rounded-xl border border-border-default p-6">
          Drag this panel’s right edge. Keyboard: ← / →, Shift for larger steps,
          Home / End.
        </div>
      </ResizeFrame>
    ) : (
      <ResizeFrame width={width} onWidthChange={setWidth}>
        <AdaptiveIssueTable issues={ADAPTIVE_ISSUES} />
      </ResizeFrame>
    );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "installation", label: "Installation" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Adaptive issue metadata inspired by{" "}
              <a
                className="underline"
                href="https://x.com/componest/status/2112057747739172953"
              >
                Componest’s video, credited to @haaarshsingh
              </a>
              . Compact inline details become aligned columns as the container
              grows.
            </p>
            <a
              href="/adaptive-issues"
              className="mt-4 inline-block underline text-sm"
            >
              Open the complete Adaptive Issues template →
            </a>
          </header>
          <Section id="installation" title="Installation">
            <CodeBlock
              lang="text"
              code="Copy src/components/adaptive-issues/ and its Oreo imports: grouped-tasks (including tone), Avatar, Tag, Icon, SkeletonReveal, AgentWorkspaceState. No new packages. Template: src/patterns/adaptive-issues/."
            />
          </Section>
          <Section
            id="composition"
            title="Composition"
            description="Try resizing the panel, not just the browser. Hidden compact metadata remains available in the issue’s accessible label and template detail view."
          >
            <PreviewTabs
              preview={<div className="w-full p-4">{content}</div>}
              code={playgroundCode(content)}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "PullRequestPill: number / state",
                  type: "number / open | draft | closed | merged",
                  desc: "Display-only identity, state is named accessibly and colored semantically. Host owns links and repository data.",
                },
                {
                  prop: "AdaptiveIssueRow: issue / onOpen / selected / index",
                  type: "AdaptiveIssue / callback? / boolean / number",
                  desc: "Render inside a ul within .adapt-table. Optional onOpen makes a keyboard button; index staggers metadata appearance. Container thresholds: 650px aligned columns, 850px category. Below 480px title wraps above metadata.",
                },
                {
                  prop: "AdaptiveIssueTable: issues / collapsed / onCollapsedChange",
                  type: "readonly AdaptiveIssue[] / IssueStage[]? / callback?",
                  desc: "Reuses TaskStatusGroup with neutral tone. Optional controlled collapse; defaults to internal state. Groups derive from records.",
                },
                {
                  prop: "onOpen / selectedId / loading / error / onRetry / onClear",
                  type: "callbacks and state",
                  desc: "Host-owned selection and recovery. Loading preserves existing rows; empty initial load uses SkeletonReveal; empty/error use AgentWorkspaceState.",
                },
                {
                  prop: "ResizeFrame: width / onWidthChange / children / label",
                  type: "number / callback / ReactNode / string?",
                  desc: "Controlled requested width, clamped to available parent space (max 1120px). Pointer release snaps within 18px of 360/640/840/1120 or parent edge. Arrows adjust 10px, Shift 40px, Home/End clamp, Escape cancels drag, double-click fills. No persistence or backend side effects.",
                },
                {
                  prop: "TaskStatusGroup: tone",
                  type: "status | neutral",
                  desc: "Shared owner extension. Default status keeps existing consumers unchanged; neutral uses the default palette for dense adaptive layouts.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
