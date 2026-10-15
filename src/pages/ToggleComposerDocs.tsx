import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  ToggleComposer,
  EMPTY_COMPOSER,
  type ComposerMode,
} from "@/components/toggle-composer";
export function ToggleComposerDocs({ nav }: { nav: DocsNav }) {
  const [mode, setMode] = useState<ComposerMode>("quick"),
    [value, setValue] = useState({ ...EMPTY_COMPOSER }),
    [notice, setNotice] = useState("");
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Toggle Composer"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              A thought, or a whole story.
            </h1>
            <p className="mt-4 text-text-secondary leading-7">
              A compact Quick Post editor unfolds into a structured Long Post
              composer. Solid and frosted surfaces use the same controlled
              fields and familiar Oreo actions.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/gregmwashington/status/2110188748994675112"
                target="_blank"
                rel="noreferrer"
              >
                Greg Washington’s toggle composers
              </a>
              . The source’s mode hierarchy, inset fields and formatting row are
              adapted to Oreo tokens.
            </p>
            <Button
              className="my-6"
              tapScale={1}
              render={<a href="/composer-studio" />}
            >
              Open Composer Studio ↗
            </Button>
            <div className="mx-auto max-w-lg py-8">
              <ToggleComposer
                mode={mode}
                onModeChange={setMode}
                value={value}
                onValueChange={setValue}
                onSubmit={() =>
                  setNotice(
                    "Save callback received. Connect your own persistence.",
                  )
                }
              />
            </div>
            <p role="status" className="min-h-6 text-sm text-text-secondary">
              {notice}
            </p>
          </header>
          <Section
            id="usage"
            title="Compose the pieces"
            description="Copy toggle-composer with its CSS, Button, IconButton, Icon and cn dependencies. Use the controlled value to retain both modes. The template adds live Markdown preview, validated image attachment and session drafts."
          >
            <CodeBlock
              code={
                'import { ToggleComposer, EMPTY_COMPOSER, type ComposerMode } from "@/components/toggle-composer";\n\nconst [value, setValue] = useState({ ...EMPTY_COMPOSER });\nconst [mode, setMode] = useState<ComposerMode>("quick");\n\n<ToggleComposer mode={mode} onModeChange={setMode}\n  value={value} onValueChange={setValue}\n  surface="frosted" onSubmit={saveDraft} />'
              }
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Formatting inserts Markdown at the textarea selection and restores
              focus. Headings and lists transform complete selected lines. The
              link action inserts an editable example URL. This is a plain-text
              Markdown editor. Native radios support arrow keys; keyboard and
              reduced-motion mode changes are immediate. Pointer changes move
              the active indicator for 180 ms; the field layout changes
              immediately. The host owns validation, attachment data and
              submission. No submit callback means a disabled save action.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "ToggleComposer",
                  type: "ToggleComposerProps",
                  desc: "Controlled mode, value, onModeChange and onValueChange. Optional surface (solid/frosted), disabled, className, error, attachment slot, onAttach, onSubmit and submitLabel.",
                },
                {
                  prop: "ComposerValue",
                  type: "{ quick; headline; intro; body }",
                  desc: "Four independent strings. EMPTY_COMPOSER supplies empty defaults. Keep state in the host when switching modes.",
                },
                {
                  prop: "ComposerModeSwitch",
                  type: "value; onValueChange; disabled?",
                  desc: "Native labeled radio group with a shared indicator and keyboard focus ring.",
                },
                {
                  prop: "ComposerFormattingToolbar",
                  type: "mode?; onFormat?; onAttach?; disabled?",
                  desc: "Long: H1/H2/H3, lists, bold, italic, link. Quick: bold, italic, link. Image action appears when onAttach is supplied; formatting is disabled without onFormat.",
                },
                {
                  prop: "formatComposerText",
                  type: "(text, start, end, format) => { value, start, end }",
                  desc: "Pure Markdown selection transform. Returns the next text and selection bounds.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
