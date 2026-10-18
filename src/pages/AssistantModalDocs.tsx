import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { AssistantModal } from "@/components/assistant-modal";
import { Conversation, ConversationContent } from "@/components/conversation";
import { Message, MessageContent } from "@/components/message";
import { Response } from "@/components/response";

const TOC: TocItem[] = [
  { id: "assistant-modal", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "basic", label: "Basic" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "open / defaultOpen", type: "boolean", def: "false", desc: "Controlled / uncontrolled." },
  { prop: "onOpenChange", type: "(open) => void", desc: "Open-state callback." },
  { prop: "icon", type: "ReactNode", desc: "Launcher glyph while closed (chat bubble by default)." },
  { prop: "inline", type: "boolean", def: "false", desc: "Anchor inside the nearest relative parent instead of the viewport — for embeds and demos." },
  { prop: "children", type: "ReactNode", desc: "Panel contents — Conversation, messages, your composer." },
  { prop: "panelClassName", type: "string", desc: "Size or restyle the panel." },
];

const CODE = `import { AssistantModal } from "@/components/assistant-modal";

<AssistantModal defaultOpen>
  <Conversation className="flex-1">
    <ConversationContent>…</ConversationContent>
  </Conversation>
  {/* your composer */}
</AssistantModal>`;

function Demo() {
  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
      <div className="p-4 text-[13px] text-[var(--color-text-disabled)]">Your product page</div>
      <AssistantModal inline defaultOpen>
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-4 py-3 text-[13.5px] font-medium">
          Assistant
        </div>
        <Conversation className="flex-1 bg-[var(--color-bg-base)]">
          <ConversationContent className="gap-4 py-3">
            <Message role="user">
              <MessageContent>Where do I change my billing email?</MessageContent>
            </Message>
            <Message role="assistant">
              <MessageContent>
                <Response>{`Head to **Settings → Billing → Contact**. Changes apply to the next invoice.`}</Response>
              </MessageContent>
            </Message>
          </ConversationContent>
        </Conversation>
        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3">
          <div className="rounded-[var(--radius-control)] bg-[var(--color-state-hover)] px-3 py-2 text-[13px] text-[var(--color-text-disabled)]">
            Message the assistant…
          </div>
        </div>
      </AssistantModal>
    </div>
  );
}

export function AssistantModalDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Shell", "Assistant Modal"]} nav={nav}>
      {() => (
        <>
          <header id="assistant-modal" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Assistant Modal</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The floating chat launcher: a bottom-corner button whose glyph blur-swaps to a caret,
              with the panel springing up from the corner. The shell is unopinionated inside — compose
              Conversation, Message, and your composer.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add assistant-modal\n# or copy src/components/assistant-modal/* by hand`} />
          </Section>

          <Section id="basic" title="Basic" description="Click the launcher to toggle. inline anchors it in this preview box; drop inline for a real viewport-fixed widget.">
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
