import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Confirmation, type ConfirmationState } from "@/components/confirmation";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "confirmation", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "basic", label: "Basic" },
  { id: "danger", label: "Destructive" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "title / description", type: "ReactNode", desc: "What the agent wants to do, and why." },
  { prop: "children", type: "ReactNode", desc: "Detail slot — a CodeBlock, diff, or payload preview." },
  { prop: "state", type: `"pending" | "approved" | "denied"`, def: `"pending"`, desc: "Footer swaps from actions to a resolution line." },
  { prop: "danger", type: "boolean", def: "false", desc: "Destructive approve styling." },
  { prop: "onApprove / onDeny", type: "() => void", desc: "Action callbacks." },
  { prop: "approveLabel / denyLabel", type: "ReactNode", def: `"Approve" / "Deny"`, desc: "Button labels; approvedLabel / deniedLabel caption the resolution." },
];

const CODE = `import { Confirmation } from "@/components/confirmation";

<Confirmation
  title="Send the weekly digest?"
  description="Email 1,204 subscribers via Postmark."
  state={state}
  onApprove={() => setState("approved")}
  onDeny={() => setState("denied")}
/>`;

function BasicDemo() {
  const [state, setState] = useState<ConfirmationState>("pending");
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Confirmation
        title="Send the weekly digest?"
        description="Email 1,204 subscribers via Postmark."
        state={state}
        onApprove={() => setState("approved")}
        onDeny={() => setState("denied")}
      />
      {state !== "pending" && (
        <Button type="secondary" size="sm" onClick={() => setState("pending")}>
          Reset
        </Button>
      )}
    </div>
  );
}

function DangerDemo() {
  const [state, setState] = useState<ConfirmationState>("pending");
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Confirmation
        danger
        title="Delete the build output?"
        description="Removes dist/ and every cached artifact. This cannot be undone."
        state={state}
        approveLabel="Delete"
        approvedLabel="Deleted"
        onApprove={() => setState("approved")}
        onDeny={() => setState("denied")}
      >
        <CodeBlock header={false} code="rm -rf dist .turbo/cache" />
      </Confirmation>
      {state !== "pending" && (
        <Button type="secondary" size="sm" onClick={() => setState("pending")}>
          Reset
        </Button>
      )}
    </div>
  );
}

export function ConfirmationDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Confirmation"]} nav={nav}>
      {() => (
        <>
          <header id="confirmation" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Confirmation</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Human-in-the-loop approval. The agent states what it wants to do, shows the exact payload,
              and waits. On decision the footer swaps to a resolution line — the card stays in the
              transcript as a record of what was allowed.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add confirmation\n# or copy src/components/confirmation/* by hand`} />
          </Section>

          <Section id="basic" title="Basic" description="Deny stays secondary; approve is the primary action. Decide to see the footer swap.">
            <PreviewTabs code={CODE} preview={<BasicDemo />} />
          </Section>

          <Section
            id="danger"
            title="Destructive"
            description="danger shifts approve to the error palette; the detail slot shows exactly what will run."
          >
            <PreviewTabs
              code={`<Confirmation danger title="Delete the build output?" approveLabel="Delete">\n  <CodeBlock header={false} code="rm -rf dist" />\n</Confirmation>`}
              preview={<DangerDemo />}
            />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
