import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Reasoning, ReasoningFile, ReasoningGroup } from "@/components/reasoning";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { useElapsed } from "@/lib/use-elapsed";

const TOC: TocItem[] = [
  { id: "reasoning", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "status", label: "Status" },
  { id: "container", label: "Container" },
  { id: "group", label: "Group" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "status", type: `"running" | "finished"`, def: `"finished"`, desc: "Shimmers the label and spins the trailing indicator." },
  { prop: "icon", type: "IconName", def: `"brain"`, desc: "Resting glyph — swaps to a chevron on hover and while open." },
  { prop: "label", type: "ReactNode", def: `"Thought process"`, desc: "Resting summary — “Thought for 6s”." },
  { prop: "activeLabel", type: "ReactNode", desc: "In-progress caption. Defaults to label." },
  { prop: "file", type: "ReactNode", desc: "What was worked on, rendered after the label in primary ink." },
  { prop: "additions / deletions", type: "number", desc: "Diff counts, in the success and error tones." },
  { prop: "elapsed", type: "ReactNode", desc: "Container only — trailing time once the run finishes." },
  { prop: "actions", type: "ReactNode", desc: "Container only — revealed on hover in place of the elapsed time." },
  { prop: "container", type: "boolean", def: "false", desc: "Put the row on its own card." },
  { prop: "collapseOnComplete", type: "boolean", def: "false", desc: "Close the disclosure when the work finishes." },
  { prop: "open / defaultOpen", type: "boolean", desc: "Controlled / uncontrolled disclosure." },
  { prop: "ReasoningGroup", type: "{ stream?, revealed?, stepInterval?, startDelay?, onComplete? }", desc: "Stacks rows; reveals them one at a time when streaming." },
  { prop: "ReasoningFile", type: "span", desc: "An underlined file path inside reasoning prose." },
];

const THOUGHT = (
  <>
    <p>
      The user wants to build a To-Do application. This is a multi-step project that would benefit
      from planning. Let me first generate design inspiration and explore the codebase, then build
      the app.
    </p>
    <p>
      Let me start by entering plan mode to understand what they want, or I could ask clarifying
      questions. Actually, the user said “here is a comprehensive blueprint” but didn’t provide the
      actual blueprint details. Let me re-read…
    </p>
  </>
);

const FILES = [
  "DesktopOnboardingReferenceApp.swift",
  "OnboardingViewModel.swift",
  "OnboardingWindow.swift",
  "SoundCuePlayer.swift",
] as const;

const EDITED = (
  <>
    {FILES.map((name) => (
      <p key={name}>
        Created <ReasoningFile>{name}</ReasoningFile> +60 -0
      </p>
    ))}
  </>
);

/* -------------------------------------------------------------------------- */

const CODE_STATUS = `import { Reasoning } from "@/components/reasoning";

<Reasoning status="running" activeLabel="Thinking" label={\`Thought for \${total}s\`}>
  {thoughts}
</Reasoning>

<Reasoning
  status="running"
  icon="pencil"
  activeLabel="Editing file"
  label="Edited file"
  file="OnboardingViewModel.swift"
  additions={106}
  deletions={0}
/>`;

function StatusDemo() {
  const [running, setRunning] = useState(true);
  const { seconds } = useElapsed(running);

  useEffect(() => {
    const timer = window.setTimeout(() => setRunning(false), 6000);
    return () => window.clearTimeout(timer);
  }, [running]);

  const total = running ? Math.floor(seconds) : 6;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <div className="flex w-full flex-col gap-2">
        <Reasoning
          status={running ? "running" : "finished"}
          activeLabel="Thinking"
          label={`Thought for ${total}s`}
          defaultOpen
        >
          {THOUGHT}
        </Reasoning>
        <Reasoning
          status={running ? "running" : "finished"}
          icon="pencil"
          activeLabel="Editing file"
          label="Edited file"
          file="OnboardingViewModel.swift"
          additions={106}
          deletions={0}
        />
      </div>
      <Button type="secondary" size="sm" onClick={() => setRunning(true)} disabled={running}>
        Replay
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const CODE_CONTAINER = `<Reasoning
  container
  status="finished"
  label="Edited 14 files"
  additions={106}
  deletions={0}
  elapsed="1.2s"
  actions={
    <>
      <Button type="tertiary" size="sm" leadingIcon={<Icon name="reset" size="sm" />}>Undo</Button>
      <Button type="secondary" size="sm">Review</Button>
    </>
  }
>
  {summary}
</Reasoning>`;

function ContainerDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Reasoning container status="running" activeLabel="Thinking" label="Thinking" />
      <Reasoning container label="Thought for 6s" elapsed="1.2s">
        {THOUGHT}
      </Reasoning>
      <Reasoning
        container
        label="Edited 14 files"
        additions={106}
        deletions={0}
        elapsed="1.2s"
        defaultOpen
        actions={
          <>
            <Button type="tertiary" size="sm" leadingIcon={<Icon name="reset" size="sm" />}>
              Undo
            </Button>
            <Button type="secondary" size="sm">
              Review
            </Button>
          </>
        }
      >
        {EDITED}
      </Reasoning>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const CODE_GROUP = `<ReasoningGroup stream stepInterval={850} startDelay={320} onComplete={answer}>
  <Reasoning status="running" activeLabel="Thinking" label="Thought for 6s" defaultOpen>…</Reasoning>
  <Reasoning icon="pencil" label="Edited files" additions={106} deletions={0} defaultOpen>…</Reasoning>
</ReasoningGroup>`;

function GroupDemo() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <div className="w-full">
        <ReasoningGroup key={run} stream onComplete={() => setDone(true)}>
          <Reasoning label="Thought for 6s" defaultOpen>
            {THOUGHT}
          </Reasoning>
          <Reasoning icon="pencil" label="Edited files" additions={106} deletions={0} defaultOpen>
            {EDITED}
          </Reasoning>
        </ReasoningGroup>
      </div>
      <Button
        type="secondary"
        size="sm"
        onClick={() => {
          setDone(false);
          setRun((n) => n + 1);
        }}
        disabled={!done}
      >
        Replay
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function ReasoningDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Reasoning"]} nav={nav}>
      {() => (
        <>
          <header id="reasoning" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Reasoning</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              One line of agent activity. A leading glyph, a label that shimmers while the work runs,
              and a disclosure holding what was thought or touched. The same row narrates thinking
              (“Thought for 6s”) and doing (“Edited files +106 -0”) — closed by default in real
              transcripts, because reasoning is a peek, not the main content.
            </p>
          </header>

          <Section
            id="installation"
            title="Source"
            description="Use the source from this internal repository."
          >
            <SourceReference source="reasoning" />
          </Section>

          <Section
            id="status"
            title="Status"
            description="Two statuses cover the lifecycle: a shimmering label while the model thinks, and a quiet summary once it finishes. The glyph swaps to a chevron on hover, so the row only advertises the disclosure when you reach for it."
          >
            <PreviewTabs code={CODE_STATUS} preview={<StatusDemo />} />
          </Section>

          <Section
            id="container"
            title="Container"
            description="An optional card gives reasoning its own surface, trailing a spinner while it runs and the elapsed time once it's done. Hover swaps that time for the row's actions. Use it in transcripts that frame each activity as a block."
          >
            <PreviewTabs code={CODE_CONTAINER} preview={<ContainerDemo />} />
          </Section>

          <Section
            id="group"
            title="Group"
            description="Reasoning stacks with adjacent activity entries into a single group, keeping a multi-step turn compact. Streaming reveals a row at a time — each grows its own height behind a soft bottom edge, so the log grows the way the work does instead of jumping."
          >
            <PreviewTabs code={CODE_GROUP} preview={<GroupDemo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
