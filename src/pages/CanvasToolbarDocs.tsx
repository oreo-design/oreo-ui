import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  CanvasToolbar,
  CanvasZoomMenu,
  CanvasModeControl,
  CanvasAddMenu,
  CanvasBlock,
  type CanvasMode,
} from "@/components/canvas-toolbar";
export function CanvasToolbarDocs({ nav }: { nav: DocsNav }) {
  const [zoom, setZoom] = useState(95),
    [mode, setMode] = useState<CanvasMode>("select"),
    [notice, setNotice] = useState("");
  return (
    <DocsPage
      nav={nav}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "pieces", label: "Building blocks" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
      breadcrumb={["Components", "Canvas Toolbar"]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              A small toolbar. Room to explore.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              A floating navigation surface for spatial work: zoom, pan, select,
              organize, ask and add.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/_heyrico/status/2110408550845702320"
                target="_blank"
                rel="noreferrer"
              >
                rico’s navigation concept
              </a>
              . Built with Oreo controls, menus, semantic tokens and both icon
              adapters.
            </p>
            <Button
              className="my-6"
              tapScale={1}
              render={<a href="/canvas-studio" />}
            >
              Open Canvas Studio ↗
            </Button>
            <div className="rounded-card-medium border border-border-subtle bg-bg-elevated px-4 py-16">
              <CanvasToolbar
                zoom={zoom}
                onZoomChange={setZoom}
                mode={mode}
                onModeChange={setMode}
                onFit={() => setZoom(95)}
                onOrganize={() => setNotice("Organize callback received.")}
                onAsk={() =>
                  setNotice(
                    "Ask callback received. Connect your own assistant.",
                  )
                }
                onAdd={(kind) => setNotice(`Add ${kind} callback received.`)}
                onInfo={() => setNotice("Information callback received.")}
                className="mx-auto"
              />
            </div>
            <p
              role="status"
              className="mt-4 min-h-6 text-sm text-text-secondary"
            >
              {notice ||
                `${zoom}% · ${mode === "pan" ? "Drag" : "Cursor"} mode`}
            </p>
          </header>
          <Section
            id="pieces"
            title="Small pieces, one vocabulary"
            description="The host owns the viewport and document. Components expose values and actions without pretending to execute a canvas engine or AI request."
          >
            <div className="flex flex-wrap items-center gap-6 py-5">
              <CanvasZoomMenu
                value={zoom}
                onValueChange={setZoom}
                onFit={() => setZoom(95)}
              />
              <CanvasModeControl value={mode} onValueChange={setMode} />
              <CanvasAddMenu onAdd={(kind) => setNotice(`Add ${kind}`)} />
            </div>
            <CanvasBlock
              block={{
                id: "sample",
                kind: "note",
                title: "Make room for a good idea",
                body: "A reusable card with a type, title and detail preview.",
                x: 0,
                y: 0,
              }}
              onSelect={() =>
                setNotice("Block selected. The template opens its editor.")
              }
            />
          </Section>
          <Section
            id="usage"
            title="Bring your own viewport"
            description="Copy canvas-toolbar with its CSS and existing Oreo dependencies. Canvas Studio demonstrates pointer capture, center-preserving zoom, fit, grid arrangement, editing and reversible changes."
          >
            <CodeBlock
              code={
                'import { CanvasToolbar } from "@/components/canvas-toolbar";\n\n<CanvasToolbar\n  zoom={zoom} onZoomChange={setZoom}\n  mode={mode} onModeChange={setMode}\n  onFit={fitAll} onOrganize={organize}\n  onAdd={openBlockEditor} onAsk={openAssistant}\n  onInfo={openHelp}\n/>'
              }
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              No callbacks means disabled actions. Mode buttons expose pressed
              state and retain native Tab order. Menus use Base UI keyboard
              navigation and local theme portals. Hover/focus labels are
              instantaneous. The sample assistant offers one labeled local
              suggestion; it makes no AI/network request.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "CanvasToolbar",
                  type: "zoom; onZoomChange; mode; onModeChange",
                  desc: "Controlled zoom (10–200) and pan/select mode. Optional disabled and className.",
                },
                {
                  prop: "Actions",
                  type: "onFit?; onOrganize?; onAsk?; onAdd?; onInfo?",
                  desc: "Host callbacks. Absent actions are disabled; fit is part of the zoom menu.",
                },
                {
                  prop: "CanvasZoomMenu",
                  type: "value; onValueChange; onFit?; disabled?",
                  desc: "Preset percentages, ±10 zoom steps and fit. Values clamp to 10–200.",
                },
                {
                  prop: "CanvasModeControl",
                  type: "value: pan | select; onValueChange; disabled?",
                  desc: "Two mutually exclusive pressed buttons, with visible hover/focus labels.",
                },
                {
                  prop: "CanvasAddMenu",
                  type: "onAdd: (note | task | link) => void; disabled?",
                  desc: "Named menu choices, neutral icons and Base UI focus restoration.",
                },
                {
                  prop: "CanvasBlock",
                  type: "block: CanvasBlockData; onSelect; selected?; disabled?",
                  desc: "Typed card. Position is owned by its host; full content remains available to the editor.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
