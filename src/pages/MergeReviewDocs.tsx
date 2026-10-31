import { documentationCode } from "@/docs/playground/code";
import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import {
  PullRequestCard,
  BranchHistory,
  MergeStatusBadge,
  MergeChecks,
  ChangeSummary,
  initialMergeRun,
  type MergePhase,
} from "@/components/merge-review";
import { CodeDiff } from "@/components/code-diff";
import {
  COMMITS,
  SAMPLE_DIFF,
  MERGE_TITLE,
  checksFor,
  commitsFor,
} from "@/patterns/merge-workspace/data";

export const mergeDocsTitles: Record<string, string> = {
  "branch-history": "Branch History",
  "merge-status-badge": "Merge Status Badge",
  "merge-checks": "Merge Checks",
  "change-summary": "Change Summary",
  "pull-request-card": "Pull Request Card",
};
export function MergeReviewDocs({ nav }: { nav: DocsNav }) {
  const [phase, setPhase] = useState<MergePhase>("conflicts");
  const title = mergeDocsTitles[nav.active] ?? "Pull Request Card";
  const checks = checksFor({
    ...initialMergeRun,
    phase: "ready",
    resolved: 3,
    checksPassed: 4,
  });
  const preview =
    nav.active === "branch-history" ? (
      <BranchHistory commits={COMMITS} />
    ) : nav.active === "merge-status-badge" ? (
      <div className="flex flex-wrap gap-2">
        {(
          [
            "creating",
            "conflicts",
            "resolving",
            "ready",
            "merged",
            "error",
          ] as MergePhase[]
        ).map((p) => (
          <MergeStatusBadge key={p} phase={p} number={128} />
        ))}
      </div>
    ) : nav.active === "merge-checks" ? (
      <MergeChecks checks={checks} />
    ) : nav.active === "change-summary" ? (
      <ChangeSummary additions={48} deletions={7}>
        <CodeDiff title="middleware.ts · sample" lines={SAMPLE_DIFF} />
      </ChangeSummary>
    ) : (
      <PullRequestCard
        title={MERGE_TITLE}
        number={128}
        phase={phase}
        commits={commitsFor({
          ...initialMergeRun,
          phase,
          resolved: ["ready", "merged"].includes(phase) ? 3 : 0,
        })}
        checks={["ready", "merged"].includes(phase) ? checks : []}
        onResolve={() => setPhase("ready")}
        onMerge={() => setPhase("merged")}
      />
    );
  return (
    <DocsPage
      nav={nav}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "installation", label: "Installation" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
      ]}
      breadcrumb={["Agent", title]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              A composable part of the merge review flow: branching history,
              conflict progress, check details and a persistent resolution.
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/pitus_/status/2111519352503873866"
              >
                Phil Pitus’s video
              </a>
              , implemented with Oreo controls and tokens.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/merge-workspace"
            >
              Open the complete Merge Workspace →
            </a>
          </header>
          <Section
            id="installation"
            title="Installation"
            description="Copy the component folder and its existing Oreo dependencies. No new packages are required."
          >
            <CodeBlock
              lang="text"
              code="Copy src/components/merge-review/ with Button, Icon, automation/AgentWorkspaceState and lib/cn.\nFor the template, also copy src/patterns/merge-workspace/ and its imports."
            />
          </Section>
          <Section
            id="composition"
            title="Composition"
            description="Components are controlled by their host. This compact docs example skips async work; the complete template demonstrates progress, failure and recovery."
          >
            <PreviewTabs
              preview={<div className="w-full max-w-3xl">{preview}</div>}
              code={documentationCode(preview, { "merge-review": { PullRequestCard, BranchHistory, MergeStatusBadge, MergeChecks, ChangeSummary }, "code-diff": { CodeDiff } })}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "BranchHistory: commits",
                  type: "BranchCommit[]",
                  desc: "Newest-first rows with stable id, lane (0–5), visible parent IDs, title, author, time and optional branch/conflicts/resolved. Lanes are assigned by your host, not calculated from Git.",
                },
                {
                  prop: "BranchHistory: selectedId / onSelect",
                  type: "string / (commit) => void",
                  desc: "Optional controlled selection. Without a callback, rows are non-interactive.",
                },
                {
                  prop: "MergeStatusBadge: phase / number",
                  type: "MergePhase / number",
                  desc: "Text plus semantic icon; does not rely on color alone. Optional PR number.",
                },
                {
                  prop: "MergeChecks: checks",
                  type: "MergeCheck[]",
                  desc: "Each check supplies id, label, state, summary and detail. Native keyboard-accessible disclosures.",
                },
                {
                  prop: "ChangeSummary: additions / deletions / children",
                  type: "number / number / ReactNode",
                  desc: "Sanitized counts; optional disclosure content. Pair with the existing CodeDiff.",
                },
                {
                  prop: "PullRequestCard: phase / commits / checks",
                  type: "MergePhase / BranchCommit[] / MergeCheck[]",
                  desc: "Host owns lifecycle. Merge is enabled only when phase is ready and every supplied check passed; empty checks do not admit merge.",
                },
                {
                  prop: "PullRequestCard: onResolve / onMerge / onRetry / onCancel",
                  type: "() => void",
                  desc: "Host callbacks. No network, Git, CI or deployment operations occur inside components.",
                },
                {
                  prop: "PullRequestCard: resolved / conflicts / error",
                  type: "number / number / string",
                  desc: "Progress values and error description. Default conflict count is 3; supply your actual count.",
                },
              ]}
            />
            <p className="mt-5 text-sm text-[var(--color-text-secondary)]">
              Reduced motion removes entrance and graph interpolation and
              spinner rotation. Mobile hides secondary commit metadata;
              selecting a row in the template exposes the full metadata. Failed
              checks retain the history and expose Retry checks.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
