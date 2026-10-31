import { SourceReference } from "@/docs/SourceReference";
import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { BranchPicker } from "@/components/branch-picker";
import { Message, MessageContent, MessageActions, MessageCopyAction } from "@/components/message";
import { Response } from "@/components/response";

const TOC: TocItem[] = [
  { id: "branch-picker", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "basic", label: "In the action row" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "current", type: "number", desc: "1-based index of the branch being shown." },
  { prop: "total", type: "number", desc: "Number of branches." },
  { prop: "onPrevious / onNext", type: "() => void", desc: "Pager callbacks; ends auto-disable." },
];

const BRANCHES = [
  "Sure — the quick version: **hydration** replays your component tree against server HTML.",
  "Here's a metaphor: hydration is pouring state back into a *dry* HTML shell until it's interactive.",
  "Technically: React walks the server-rendered DOM, attaches listeners, and adopts it instead of re-creating nodes.",
];

const CODE = `import { BranchPicker } from "@/components/branch-picker";

<MessageActions>
  <BranchPicker current={branch + 1} total={3} onPrevious={…} onNext={…} />
  <MessageCopyAction text={answer} />
</MessageActions>`;

function Demo() {
  const [branch, setBranch] = useState(0);
  return (
    <div className="w-full max-w-xl">
      <Message role="assistant">
        <MessageContent>
          <Response>{BRANCHES[branch]}</Response>
        </MessageContent>
        <MessageActions className="opacity-100">
          <BranchPicker
            current={branch + 1}
            total={BRANCHES.length}
            onPrevious={() => setBranch((b) => Math.max(0, b - 1))}
            onNext={() => setBranch((b) => Math.min(BRANCHES.length - 1, b + 1))}
          />
          <MessageCopyAction text={BRANCHES[branch]} />
        </MessageActions>
      </Message>
    </div>
  );
}

export function BranchPickerDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Branch Picker"]} nav={nav}>
      {() => (
        <>
          <header id="branch-picker" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Branch Picker</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Pager for regenerated answers. Lives in the message action row; the counter slides in the
              paging direction and the ends disable themselves.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="branch-picker" />
          </Section>

          <Section id="basic" title="In the action row" description="Page between three alternative answers (action row pinned visible for the demo).">
            <PreviewTabs code={CODE} preview={<Demo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
