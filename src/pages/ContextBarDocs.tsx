import { useState } from "react";
import { DocsPage, type DocsNav, type SpringProps } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Icon } from "@/components/icon";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";
import {
  ContextBar,
  ContextBarLabel,
  ContextBarTasks,
  ContextBarTextButton,
  ContextBarIconButton,
} from "@/components/context-bar";
import claudeLogo from "@/components/icon/assets/brands/claude-color.svg";

const TOC: TocItem[] = [
  { id: "context-bar", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "position", label: "Position" },
  { id: "progress", label: "Progress" },
  { id: "upgrade", label: "Upgrade" },
  { id: "queue", label: "Queue" },
  { id: "status-labels", label: "Status labels" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "ContextBar", type: 'position: "header" | "footer" | "detached"', def: '"header"', desc: "The bar surface. header/footer round only the outer corners and pad 28px on the side that tucks under the Prompt Box." },
  { prop: "ContextBarLabel", type: "status · icon · leading · muted · trailing", desc: "One row. status picks the glyph: default · avatar · progress · loading · waiting · done · queue." },
  { prop: "ContextBarLabel actions", type: "onSteer · onRemove · onMore", desc: "Presence renders the ↳ Steer, trash, and … trailing actions." },
  { prop: "ContextBarTasks", type: "summary · open · defaultOpen · onOpenChange", desc: "Collapsible task detail — chevron summary row plus per-task rows." },
  { prop: "ContextBarTextButton", type: "icon · children", desc: "Quiet trailing text action (“Steer”, “Upgrade plan”)." },
  { prop: "ContextBarIconButton", type: "aria-label · icon", desc: "Quiet 20px trailing icon action." },
];

function Agents() {
  return (
    <AvatarGroup size="xs" className="-space-x-[calc(var(--spacing)*1.875)]">
      <Avatar agent="flare" className="size-5" />
      <Avatar agent="void" className="size-5" />
      <Avatar agent="bloom" className="size-5" />
    </AvatarGroup>
  );
}

function ClaudeSelect() {
  return <PromptBoxModelSelect icon={<img src={claudeLogo} alt="" />} label="Claude" />;
}

/** The composer configuration every Figma example on this page is drawn with. */
const COMPOSER = { running: true, inset: true, voice: "mic" } as const;

const POSITION_CODE = `// Header — dock the bar above the box
<PromptBox
  running
  inset
  voice="mic"
  header={
    <ContextBar position="header">
      <ContextBarLabel status="default">Select projects</ContextBarLabel>
    </ContextBar>
  }
/>

// Footer — dock it below
<PromptBox
  running
  inset
  voice="mic"
  footer={
    <ContextBar position="footer">
      <ContextBarLabel status="default">Select projects</ContextBarLabel>
    </ContextBar>
  }
/>`;

const PROGRESS_CODE = `// In progress — the count alone
<ContextBar position="header">
  <ContextBarLabel status="progress">2/4 tasks in progress</ContextBarLabel>
</ContextBar>

// Folded / Detail — the same collapsible, closed or open
<ContextBar position="header">
  <ContextBarTasks summary="2/4 tasks in progress" defaultOpen>
    <ContextBarLabel status="done">Build core logics</ContextBarLabel>
    <ContextBarLabel status="loading">Build image canvas</ContextBarLabel>
    <ContextBarLabel status="waiting">Build toolbar and adjustment panels</ContextBarLabel>
  </ContextBarTasks>
</ContextBar>`;

const UPGRADE_CODE = `<ContextBar position="header">
  <ContextBarLabel
    icon={null}
    trailing={
      <>
        <ContextBarTextButton onClick={…}>Upgrade plan</ContextBarTextButton>
        <ContextBarIconButton aria-label="Dismiss" icon={<Icon name="x" size="sm" />} onClick={…} />
      </>
    }
  >
    Need more messages? Get higher limits with Premium.
  </ContextBarLabel>
</ContextBar>`;

const QUEUE_CODE = `<ContextBar position="header">
  {tasks.map((task) => (
    <ContextBarLabel key={task} status="queue" onSteer={…} onRemove={…} onMore={…}>
      {task}
    </ContextBarLabel>
  ))}
</ContextBar>`;

const QUEUE_TASKS = ["build main page integrating all components", "build core logic", "adjust to dark mode"];

const TASK_ROWS = (
  <>
    <ContextBarLabel status="done">Build core logics</ContextBarLabel>
    <ContextBarLabel status="loading">Build image canvas</ContextBarLabel>
    <ContextBarLabel status="waiting">Build toolbar and adjustment panels</ContextBarLabel>
  </>
);

/** One composer per Figma progress example: count only, folded, unfolded. */
function ProgressDemo({ spring }: { spring: SpringProps }) {
  const [folded, setFolded] = useState(false);
  const [detail, setDetail] = useState(true);
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <PromptBox
        {...COMPOSER}
        header={
          <ContextBar position="header">
            <ContextBarLabel status="progress">2/4 tasks in progress</ContextBarLabel>
          </ContextBar>
        }
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
      <PromptBox
        {...COMPOSER}
        header={
          <ContextBar position="header">
            <ContextBarTasks summary="2/4 tasks in progress" open={folded} onOpenChange={setFolded}>
              {TASK_ROWS}
            </ContextBarTasks>
          </ContextBar>
        }
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
      <PromptBox
        {...COMPOSER}
        header={
          <ContextBar position="header">
            <ContextBarTasks summary="2/4 tasks in progress" open={detail} onOpenChange={setDetail}>
              {TASK_ROWS}
            </ContextBarTasks>
          </ContextBar>
        }
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
    </div>
  );
}

function UpgradeDemo({ spring }: { spring: SpringProps }) {
  const [visible, setVisible] = useState(true);
  return (
    <PromptBox
      {...COMPOSER}
      header={
        visible ? (
          <ContextBar position="header">
            <ContextBarLabel
              icon={null}
              trailing={
                <>
                  <ContextBarTextButton>Upgrade plan</ContextBarTextButton>
                  <ContextBarIconButton aria-label="Dismiss" icon={<Icon name="x" size="sm" />} onClick={() => setVisible(false)} />
                </>
              }
            >
              Need more messages? Get higher limits with Premium.
            </ContextBarLabel>
          </ContextBar>
        ) : undefined
      }
      modelSelect={<ClaudeSelect />}
      {...spring}
    />
  );
}

export function ContextBarDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Context Bar"]} nav={nav}>
      {({ spring }) => (
        <>
          <header id="context-bar" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Context Bar</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A status surface that docks onto the Prompt Box — project context, background task
              count, upgrade nudges, or a steerable task queue. The bar tucks underneath the card so
              users keep talking while work runs.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add context-bar\n# or copy src/components/context-bar/* by hand`} />
          </Section>

          <Section
            id="position"
            title="Position"
            description="Dock the bar above (header) or below (footer) via the Prompt Box's slots — the card overlaps it by 16px."
          >
            <PreviewTabs
              code={POSITION_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <PromptBox
                    {...COMPOSER}
                    header={
                      <ContextBar position="header">
                        <ContextBarLabel status="default">Select projects</ContextBarLabel>
                      </ContextBar>
                    }
                    modelSelect={<ClaudeSelect />}
                    {...spring}
                  />
                  <PromptBox
                    {...COMPOSER}
                    footer={
                      <ContextBar position="footer">
                        <ContextBarLabel status="default">Select projects</ContextBarLabel>
                      </ContextBar>
                    }
                    modelSelect={<ClaudeSelect />}
                    {...spring}
                  />
                </div>
              }
            />
          </Section>

          <Section
            id="progress"
            title="Progress"
            description="Shows the current task count and lets people keep talking while background tasks run. The count can stand alone, or a chevron can fold the per-task detail away."
          >
            <PreviewTabs code={PROGRESS_CODE} preview={<ProgressDemo spring={spring} />} />
          </Section>

          <Section
            id="upgrade"
            title="Upgrade"
            description="Contextual add-ons above the main input — an upgrade nudge here, with a quiet text action plus dismiss."
          >
            <PreviewTabs code={UPGRADE_CODE} preview={<UpgradeDemo spring={spring} />} />
          </Section>

          <Section
            id="queue"
            title="Queue"
            description="Queued prompts with a drag handle, a Steer action to redirect the agent, and per-row remove."
          >
            <PreviewTabs
              code={QUEUE_CODE}
              preview={
                <PromptBox
                  {...COMPOSER}
                  header={
                    <ContextBar position="header">
                      {QUEUE_TASKS.map((task) => (
                        <ContextBarLabel key={task} status="queue" onSteer={() => {}} onRemove={() => {}} onMore={() => {}}>
                          {task}
                        </ContextBarLabel>
                      ))}
                    </ContextBar>
                  }
                  modelSelect={<ClaudeSelect />}
                  {...spring}
                />
              }
            />
          </Section>

          <Section
            id="status-labels"
            title="Status labels"
            description="The whole row vocabulary on its own — default, avatar, progress, folded and expanded tasks, done, loading, waiting, and a queued row."
          >
            <PreviewTabs
              code={`<ContextBarLabel status="loading">Build image canvas</ContextBarLabel>`}
              preview={
                <div className="flex w-full max-w-[600px] flex-col gap-4">
                  <ContextBarLabel status="default">Select projects</ContextBarLabel>
                  <ContextBarLabel status="avatar" muted leading={<Agents />} onMore={() => {}}>
                    3 agents ready
                  </ContextBarLabel>
                  <ContextBarLabel status="progress">2/4 tasks in progress</ContextBarLabel>
                  <ContextBarTasks summary="2/4 tasks in progress">{TASK_ROWS}</ContextBarTasks>
                  <ContextBarTasks summary="2/4 tasks in progress" defaultOpen>
                    {TASK_ROWS}
                  </ContextBarTasks>
                  <ContextBarLabel status="queue" onSteer={() => {}} onRemove={() => {}} onMore={() => {}}>
                    build main page integrating all components
                  </ContextBarLabel>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="All parts extend native element props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
