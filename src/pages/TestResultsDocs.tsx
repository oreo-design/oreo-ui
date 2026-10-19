import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { playgroundCode } from "@/docs/playground/code";
import { PAGE_META } from "@/lib/site";
import {
  TestResults,
  TestRunSummary,
  TestResultFilters,
  TestFileGroup,
  TestFailureDetail,
  TestStackTrace,
  type TestFilter,
} from "@/components/test-results";
import { SAMPLE_TESTS, COMPLETED_RUN } from "@/patterns/test-workspace/data";
export function TestResultsDocs({ nav }: { nav: DocsNav }) {
  const [filter, setFilter] = useState<TestFilter>("all"),
    [open, setOpen] = useState(true);
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ?? "Test Results";
  const failed = SAMPLE_TESTS.find((t) => t.status === "failed")!;
  const preview =
    nav.active === "test-run-summary" ? (
      <TestRunSummary run={COMPLETED_RUN} open={open} onOpenChange={setOpen} />
    ) : nav.active === "test-result-filters" ? (
      <TestResultFilters
        tests={SAMPLE_TESTS}
        value={filter}
        onChange={setFilter}
      />
    ) : nav.active === "test-file-group" ? (
      <TestFileGroup
        file={failed.file}
        tests={SAMPLE_TESTS.filter((t) => t.file === failed.file)}
        open={open}
        onOpenChange={setOpen}
      />
    ) : nav.active === "test-failure-detail" ? (
      <TestFailureDetail test={failed} />
    ) : nav.active === "test-stack-trace" ? (
      <TestStackTrace frames={failed.failure!.frames} />
    ) : (
      <TestResults run={COMPLETED_RUN} />
    );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Agent", title]}
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
              An Oreo implementation inspired by{" "}
              <a
                className="underline"
                href="https://x.com/preetsuthar17/status/2111694212857266430"
              >
                Preet Suthar’s test results
              </a>
              . Stream a run, keep failures in context, and expose focused
              recovery actions. Hosts own runner events and mutations.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/test-workspace"
            >
              Open the complete Test Workspace →
            </a>
          </header>
          <Section id="installation" title="Installation">
            <CodeBlock
              lang="text"
              code="Copy src/components/test-results/ with its Oreo imports: Button, Icon, StatusIcon, CodeBlock, AgentWorkspaceState and Motion.
Template: src/patterns/test-workspace/. No new packages."
            />
          </Section>
          <Section
            id="composition"
            title="Composition"
            description="Independent components and a composed panel. Actions are rendered only when their callbacks are supplied."
          >
            <PreviewTabs
              preview={<div className="w-full p-4">{preview}</div>}
              code={playgroundCode(preview)}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "TestRunSummary: run / open / onOpenChange / controlsId",
                  type: "TestRun / boolean / callback / string",
                  desc: "Derived counts, animated completed count and segmented accessible progress. No duplicate counter state. Optional controlled disclosure; controlsId points to the host panel.",
                },
                {
                  prop: "TestResultFilters: tests / value / onChange / actions",
                  type: "TestCase[] / TestFilter / callback / ReactNode",
                  desc: "All, failed, skipped or slow (completed tests ≥ 500ms). Counts use the unfiltered dataset. Pressed buttons retain keyboard focus.",
                },
                {
                  prop: "TestFileGroup: file / tests / filter / open / onOpenChange",
                  type: "string / TestCase[] / TestFilter / boolean / callback",
                  desc: "Pass records for one file. Groups by test.group, shows duration and statuses, and exposes failure disclosures. Parent owns file expansion.",
                },
                {
                  prop: "TestFailureDetail: test / onAskFix",
                  type: "TestCase / optional callback",
                  desc: "Assertion, timeout or snapshot message; optional expected/received values; stack trace and clipboard feedback. Values are plain escaped text. No HTML or editor URLs are executed.",
                },
                {
                  prop: "TestStackTrace: frames",
                  type: "StackFrame[]",
                  desc: "Application frames first, framework frames behind a disclosure. Optional code uses Oreo CodeBlock. Locations are informational; the component does not claim to open a local editor.",
                },
                {
                  prop: "TestResults: run / onRerun / onRerunFailed / onStop / onAskFix / onRetry",
                  type: "TestRun / optional callbacks",
                  desc: "Composed result panel. Passing runs collapse automatically; failures stay open. Explicit user expansion choices override defaults. Use key={run.id} to reset view state for a new run, never for each streaming event.",
                },
                {
                  prop: "testRunReducer / initialTestRun",
                  type: "pure functions",
                  desc: "Serial event model with stable test IDs. Start all or failed tests; finish the current running test; ignore stale run IDs and results after stop; retry or reset. Failed-only reruns preserve non-target outcomes. Adapt your runner to the TestCase shape; no vendor report parser is included.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
