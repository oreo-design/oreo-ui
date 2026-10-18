import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/conversation";
import { Message, MessageContent, MessageActions, MessageCopyAction } from "@/components/message";
import { Response } from "@/components/response";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "conversation", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "playground", label: "Playground" },
  { id: "anatomy", label: "Anatomy" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "autoScroll", type: "boolean", def: "true", desc: "Follow new content while the user is at the bottom." },
  { prop: "ConversationContent", type: "—", desc: "The message column: measure, gap, and padding." },
  { prop: "ConversationScrollButton", type: "—", desc: "Floating scroll-to-bottom, shown when detached from the end." },
];

const CODE_ANATOMY = `import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";

<Conversation className="h-[420px]">
  <ConversationContent>
    <Message role="user">…</Message>
    <Message role="assistant">…</Message>
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>`;

type Turn = { id: number; question: string; answer: string };

const QA: readonly [string, string][] = [
  [
    "Why does my list re-render on every keystroke?",
    `Because the input state lives in the **same component** as the list.

1. Each keystroke calls \`setState\`
2. The whole component re-renders
3. The list re-renders with it

Move the input into its own component, or memoize the list with \`useMemo\`.`,
  ],
  [
    "And if the list itself is expensive?",
    `Wrap each row in \`React.memo\` and keep row props **referentially stable**:

\`\`\`tsx
const Row = React.memo(function Row({ item }: { item: Item }) {
  return <li>{item.label}</li>;
});
\`\`\`

Now typing only re-renders the input.`,
  ],
  [
    "Got it — any way to verify?",
    `Use the **React DevTools Profiler**:

- record while typing
- look for rows lighting up
- confirm only the input commits

If rows still commit, a prop identity is changing — usually an inline object or callback.`,
  ],
];

function Playground() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streamed, setStreamed] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const streaming = useRef(false);

  const ask = (index: number) => {
    if (streaming.current) return;
    const [question, answer] = QA[index % QA.length];
    streaming.current = true;
    setTurns((prev) => [...prev, { id: prev.length, question, answer }]);
    setStreamed(0);
    const words = answer.split(" ").length;
    timer.current = window.setInterval(() => {
      setStreamed((c) => {
        if (c >= words) {
          window.clearInterval(timer.current);
          streaming.current = false;
          return c;
        }
        return c + 1;
      });
    }, 55);
  };

  useEffect(() => {
    // StrictMode-safe: reset fully on (re)mount so the guard ref can't stick.
    streaming.current = false;
    setTurns([]);
    setStreamed(0);
    ask(0);
    return () => {
      window.clearInterval(timer.current);
      streaming.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col gap-3">
      <Conversation className="h-[420px] w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
        <ConversationContent>
          {turns.map((turn, i) => {
            const last = i === turns.length - 1;
            const words = turn.answer.split(" ");
            const text = last ? words.slice(0, streamed).join(" ") : turn.answer;
            const done = !last || streamed >= words.length;
            return (
              <div key={turn.id} className="contents">
                <Message role="user">
                  <MessageContent>{turn.question}</MessageContent>
                </Message>
                <Message role="assistant">
                  <MessageContent>
                    <Response>{text}</Response>
                  </MessageContent>
                  {done && (
                    <MessageActions>
                      <MessageCopyAction text={turn.answer} />
                    </MessageActions>
                  )}
                </Message>
              </div>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="flex justify-center">
        <Button type="secondary" size="sm" onClick={() => ask(turns.length)}>
          Ask a follow-up
        </Button>
      </div>
    </div>
  );
}

export function ConversationDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Conversation"]} nav={nav}>
      {() => (
        <>
          <header id="conversation" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Conversation</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The transcript viewport. Sticks to the bottom while the assistant streams, releases the
              moment the user scrolls up to read, and offers a floating return button when detached —
              the scroll behavior every chat needs, with no runtime dependency.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add conversation\n# or copy src/components/conversation/* by hand`} />
          </Section>

          <Section
            id="playground"
            title="Playground"
            description="Streaming follows the bottom. Scroll up mid-stream — following stops and the return button appears; ask a follow-up to see it again."
          >
            <PreviewTabs code={CODE_ANATOMY} preview={<Playground />} />
          </Section>

          <Section id="anatomy" title="Anatomy" description="Viewport → content column → floating scroll button. Give the viewport a height; everything else is composition.">
            <Snippet code={CODE_ANATOMY} />
          </Section>

          <Section id="api" title="API Reference" description="Conversation extends native <div> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
