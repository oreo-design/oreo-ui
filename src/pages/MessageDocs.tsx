import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageCopyAction,
} from "@/components/message";
import { Response } from "@/components/response";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "message", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "pair", label: "A turn pair" },
  { id: "actions", label: "Actions" },
  { id: "avatar", label: "With avatar" },
  { id: "flat", label: "Flat user turns" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "role", type: `"user" | "assistant"`, desc: "User turns align end; assistant turns are flat, full width." },
  { prop: "variant", type: `"bubble" | "flat"`, def: `"bubble"`, desc: "User turn look — soft bubble or plain right-aligned text." },
  { prop: "avatar", type: "ReactNode", desc: "Leading avatar column, typically the Oreo Avatar." },
];

const ANSWER = `Grid handles two-dimensional layout; flexbox is one-dimensional.

- **Grid** — rows *and* columns, placement first
- **Flexbox** — a single axis, content first`;

const CODE_PAIR = `import { Message, MessageContent } from "@/components/message";
import { Response } from "@/components/response";

<Message role="user">
  <MessageContent>When should I use grid over flexbox?</MessageContent>
</Message>

<Message role="assistant">
  <MessageContent>
    <Response>{answer}</Response>
  </MessageContent>
</Message>`;

const CODE_ACTIONS = `<Message role="assistant">
  <MessageContent>…</MessageContent>
  <MessageActions>
    <MessageCopyAction text={answer} />
    <MessageAction aria-label="Regenerate" icon={<Icon name="refresh" />} />
    <MessageAction aria-label="Good response" icon={<Icon name="thumbs-up" />} />
    <MessageAction aria-label="Bad response" icon={<Icon name="thumbs-down" />} />
  </MessageActions>
</Message>`;

function AssistantTurn({ withAvatar = false }: { withAvatar?: boolean }) {
  return (
    <Message role="assistant" avatar={withAvatar ? <Avatar agent="nova" size="sm" /> : undefined}>
      <MessageContent>
        <Response>{ANSWER}</Response>
      </MessageContent>
      <MessageActions>
        <MessageCopyAction text={ANSWER} />
        <MessageAction aria-label="Regenerate" icon={<Icon name="refresh" />} />
        <MessageAction aria-label="Good response" icon={<Icon name="thumbs-up" />} />
        <MessageAction aria-label="Bad response" icon={<Icon name="thumbs-down" />} />
      </MessageActions>
    </Message>
  );
}

export function MessageDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Message"]} nav={nav}>
      {() => (
        <>
          <header id="message" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Message</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              One turn in the transcript. User turns read as a soft bubble on the end edge; assistant
              turns are flat and full width. Actions reveal on hover or keyboard focus of the whole
              turn — copy ships with the copy → check swap built in.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add message\n# or copy src/components/message/* by hand`} />
          </Section>

          <Section id="pair" title="A turn pair" description="The standard chat asymmetry: user bubble on the end edge, assistant flat below.">
            <PreviewTabs
              code={CODE_PAIR}
              preview={
                <div className="flex w-full max-w-xl flex-col gap-5">
                  <Message role="user">
                    <MessageContent>When should I use grid over flexbox?</MessageContent>
                  </Message>
                  <Message role="assistant">
                    <MessageContent>
                      <Response>{ANSWER}</Response>
                    </MessageContent>
                  </Message>
                </div>
              }
            />
          </Section>

          <Section
            id="actions"
            title="Actions"
            description="Hover (or tab into) the assistant turn — the action row fades in. MessageAction is a ghost IconButton; MessageCopyAction adds the clipboard swap."
          >
            <PreviewTabs code={CODE_ACTIONS} preview={<div className="w-full max-w-xl"><AssistantTurn /></div>} />
          </Section>

          <Section id="avatar" title="With avatar" description="Pass avatar for a leading identity column — pairs with the Oreo Avatar agent gradients.">
            <PreviewTabs
              code={`<Message role="assistant" avatar={<Avatar agent="nova" size="sm" />}>…</Message>`}
              preview={<div className="w-full max-w-xl"><AssistantTurn withAvatar /></div>}
            />
          </Section>

          <Section id="flat" title="Flat user turns" description="Prefer plain right-aligned text? variant='flat' drops the bubble.">
            <PreviewTabs
              code={`<Message role="user" variant="flat">…</Message>`}
              preview={
                <div className="flex w-full max-w-xl flex-col gap-2">
                  <Message role="user" variant="flat">
                    <MessageContent>Can you rewrite it without the bubble?</MessageContent>
                  </Message>
                  <Message role="user" variant="flat">
                    <MessageContent>Long user turns wrap at 85% width and stay readable while keeping the end-edge alignment.</MessageContent>
                  </Message>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Message extends native <div> props. MessageContent / MessageActions must live inside a Message.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
