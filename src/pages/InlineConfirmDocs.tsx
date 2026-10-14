import { useState } from "react";
import { InlineConfirm } from "@/components/inline-confirm";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

function ProjectExample({ failure = false }: { failure?: boolean }) {
  const [revision, setRevision] = useState(0);
  const [attempts, setAttempts] = useState(0);
  return <div className="rounded-card-medium border border-border-subtle bg-bg-elevated p-5 sm:p-8">
    <div className="flex min-h-56 items-center justify-center"><div className="flex w-full max-w-xl flex-wrap items-center gap-5">
      <div className="flex items-center gap-2 text-sm font-medium"><span className="text-text-secondary"><Icon name="folder" /></span>Northwind redesign</div>
      <InlineConfirm key={revision} onConfirm={async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        if (failure && attempts === 0) { setAttempts(1); throw new Error("Demo failure"); }
      }} />
    </div></div>
    <div className="flex items-center justify-between gap-4 border-t border-border-subtle pt-4">
      <p className="text-xs text-text-secondary">{failure ? "The first attempt fails. Try again to recover." : "Local demo. No project is deleted."}</p>
      <Button type="tertiary" size="sm" onClick={() => { setAttempts(0); setRevision(revision + 1); }}>Reset demo</Button>
    </div>
  </div>;
}

export function InlineConfirmDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Inline Confirm"]} toc={[
    { id: "overview", label: "Overview" }, { id: "usage", label: "Usage" }, { id: "recovery", label: "Error recovery" }, { id: "accessibility", label: "Interaction" }, { id: "api", label: "API" },
  ]}>{() => <>
    <header id="overview" className="pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">Inline Confirm</h1>
      <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">A deliberate action, without losing your place. A quiet capsule unfolds into a question and two choices, then settles into progress and a result.</p>
      <p className="mt-3 text-xs text-text-tertiary">Inspired by <a href="https://x.com/alibey_10/status/2109948796088295538" target="_blank" rel="noreferrer" className="underline underline-offset-4">Elia’s inline deletion interaction, shared by Ali Bey</a>. Rebuilt with Oreo’s buttons, icons and theme tokens.</p>
    </header>
    <Section id="preview" title="Keep the decision in context" description="Click Delete project, then cancel or confirm. The action only runs after the second, explicit choice."><ProjectExample /></Section>
    <Section id="usage" title="Usage" description="Copy the inline-confirm folder with Oreo’s Button, Icon, cn and motion utilities and design tokens. No additional dependency is needed.">
      <CodeBlock code={`import { InlineConfirm } from "@/components/inline-confirm";

<InlineConfirm
  label="Delete project"
  question="Delete Northwind redesign?"
  onConfirm={async () => {
    const response = await fetch("/api/projects/northwind", {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete failed");
  }}
/>`} />
      <p className="mt-4 text-sm leading-6 text-text-secondary">Resolve the callback only after your operation succeeds. Rejections show an inline error and retry. Success remains visible; remove the item or change the component’s key when your application is ready. There is no automatic reset or undo.</p>
    </Section>
    <Section id="recovery" title="A failure stays recoverable" description="Your context stays visible. The error is announced, and retry calls the same action without opening a dialog."><ProjectExample failure /></Section>
    <Section id="accessibility" title="Two choices, on every input" description="An inline group of native buttons; focus is never trapped.">
      <div className="space-y-3 text-sm leading-7 text-text-secondary">
        <p>Enter or Space opens the confirmation and focuses Cancel. Tab reaches the destructive action. Escape or Cancel restores the trigger; clicking or tabbing outside dismisses the question. Repeated activation while pending cannot run the callback twice.</p>
        <p>Keyboard state changes are immediate. Pointer transitions use a short transform-based layout animation, anchored in the same row. Reduced motion keeps a quiet fade, with no resizing motion or spinning icon. Labels wrap on narrow screens.</p>
        <p>Use this for a short, well-understood decision. Keep the existing Confirmation component for agent proposals that need a description, payload or diff.</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-4"><InlineConfirm disabled onConfirm={() => {}} /><InlineConfirm label="Archive project" question="Archive this project?" confirmLabel="Archive" pendingLabel="Archiving" successLabel="Archived" errorMessage="Could not archive. Try again." icon={<Icon name="folder" />} onConfirm={() => {}} /></div>
    </Section>
    <Section id="api" title="API Reference" description="Every label is configurable. Keep the question concise and identify the affected item in its surrounding context.">
      <div className="overflow-x-auto"><PropsTable rows={[
        { prop: "onConfirm", type: "() => void | Promise<void>", desc: "Required. Invoked only on confirm/retry. Resolve for success, reject for an inline error." },
        { prop: "onCancel", type: "() => void", desc: "Called for Cancel, Escape or leaving the confirmation group." },
        { prop: "label / question", type: "string", def: "Delete project / Delete project?", desc: "Trigger and expanded question." },
        { prop: "confirmLabel / cancelLabel", type: "string", def: "Delete / Cancel", desc: "The two explicit choices." },
        { prop: "pendingLabel / successLabel", type: "string", def: "Deleting / Deleted", desc: "Visible and announced operation status." },
        { prop: "errorMessage / retryLabel", type: "string", def: "Could not delete. Try again. / Try again", desc: "Error description and retry action." },
        { prop: "icon", type: "ReactNode", def: "Trash icon", desc: "Decorative trigger icon; uses the selected Oreo icon library." },
        { prop: "disabled", type: "boolean", def: "false", desc: "Prevents opening or confirming. Does not cancel an operation already running." },
        { prop: "className", type: "string", desc: "Additional classes on the wrapping element." },
      ]} /></div>
    </Section>
  </>}</DocsPage>;
}
