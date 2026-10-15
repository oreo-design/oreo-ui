import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  DocumentTimeline,
  DocumentPhotoStrip,
  FileChangeCard,
  DocumentAccessRequest,
  DocumentSummary,
  MemberActivity,
  DocumentStorage,
  type AccessDecision,
} from "@/components/document-activity";
import { events, photos, storage } from "@/patterns/document-workspace/data";
const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "timeline", label: "Activity timeline" },
  { id: "insights", label: "Insights" },
  { id: "composition", label: "Composition" },
  { id: "api", label: "API reference" },
];
export function DocumentActivityDocs({ nav }: { nav: DocsNav }) {
  const [status, setStatus] = useState<AccessDecision>("pending");
  return (
    <DocsPage
      nav={nav}
      toc={toc}
      breadcrumb={["Components", "Document Activity"]}
    >
      {() => (
        <>
          <header id="introduction" className="pb-8">
            <p className="mb-3 text-xs uppercase tracking-wider text-text-tertiary">
              Every document has a story
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Document activity
            </h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              A quiet timeline for uploads, edits, sharing and access requests.
              Composable details and compact insights, built with Oreo
              primitives.
            </p>
            <Button
              className="mt-5"
              tapScale={1}
              render={<a href="/document-workspace" />}
            >
              Open Document Workspace ↗
            </Button>
            <p className="mt-4 text-xs leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline underline-offset-4"
                href="https://x.com/samosemudiamhe/status/2110304795869524372"
                target="_blank"
                rel="noreferrer"
              >
                csakani’s Sakani UI document workspace
              </a>
              . Independently implemented with Oreo tokens, Button, Avatar,
              Icon, Menu and ActivityCard. The template adds light mode,
              responsive layout and local interactions.
            </p>
          </header>
          <Section
            id="timeline"
            title="A timeline with room for detail"
            description="DocumentTimeline owns identity, action glyphs and the connecting line. Compose any content into each event’s detail slot."
          >
            <DocumentTimeline
              events={events
                .slice(0, 4)
                .map((event) => ({
                  ...event,
                  detail:
                    event.detail === "photos" ? (
                      <DocumentPhotoStrip photos={photos} />
                    ) : event.detail === "edit" ? (
                      <FileChangeCard
                        description="Changed clause 7.2 · Service charge"
                        version="v4"
                      />
                    ) : event.detail === "access" ? (
                      <DocumentAccessRequest
                        status={status}
                        onDecision={setStatus}
                        onUndo={() => setStatus("pending")}
                      />
                    ) : (
                      <span className="rounded-full bg-status-progress-subtle px-2 py-1 text-xs text-status-progress">
                        Can view
                      </span>
                    ),
                }))}
            />
          </Section>
          <Section
            id="insights"
            title="The workspace at a glance"
            description="Metric cards, member activity and capacity-aware storage share the existing ActivityCard surface."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <DocumentSummary
                metrics={[
                  {
                    label: "Uploads",
                    value: 38,
                    change: "+12%",
                    positive: true,
                  },
                  { label: "Edits", value: 112, change: "+4%", positive: true },
                  { label: "Shares", value: 9 },
                  { label: "Access requests", value: 3, change: "1 pending" },
                ]}
              />
              <MemberActivity
                members={[
                  { name: "Omar Haddad", count: 64 },
                  { name: "Lina Saeed", count: 41 },
                  { name: "Noura Al-Harbi", count: 27 },
                ]}
              />
              <DocumentStorage capacity={20} segments={storage} />
            </div>
          </Section>
          <Section
            id="composition"
            title="Compose a document workspace"
            description="Copy components/document-activity and its Oreo dependencies, then patterns/document-workspace for the complete template."
          >
            <CodeBlock
              code={`import { DocumentTimeline, DocumentAccessRequest } from "@/components/document-activity";\n\n<DocumentTimeline events={[{\n  id: "request", actor: "Khalid Mansour", action: "Access",\n  verb: "requested access to", target: "Leases",\n  location: "Finance team", time: "08:30", dateTime: "2026-10-15T08:30:00",\n  detail: <DocumentAccessRequest status={status}\n    onDecision={setStatus} onUndo={() => setStatus("pending")} />\n}]} />\n\nimport { DocumentWorkspace } from "@/patterns/document-workspace";\n<DocumentWorkspace dark={dark} onToggleTheme={toggleTheme} />`}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Search (⌘/Ctrl K), action and folder filters, date ranges, photo
              previews, local file records, approval and undo work in memory.
              Reload resets changes. There is no backend, AI search or
              permission service. Connect controlled callbacks to your own
              services.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "DocumentTimeline",
                  type: "events; label?; empty?",
                  desc: "Events include id, actor, action, verb, target, location, time, dateTime and an optional React detail slot.",
                },
                {
                  prop: "DocumentPhotoStrip",
                  type: "photos; total?; onOpen?(index)",
                  desc: "Up to five thumbnails. Optional total supports an overflow count; the host owns the full gallery.",
                },
                {
                  prop: "FileChangeCard",
                  type: "description; version; onOpen?",
                  desc: "A static summary or a native button when an open callback is provided.",
                },
                {
                  prop: "DocumentAccessRequest",
                  type: "status?; onDecision; onUndo?",
                  desc: "Controlled pending, approved and declined states. Host owns persistence and authorization.",
                },
                {
                  prop: "DocumentSummary",
                  type: "metrics; period?",
                  desc: "Metric label, numeric value, optional change text and positive tone.",
                },
                {
                  prop: "MemberActivity",
                  type: "members: { name, count }[]",
                  desc: "Ranks members by action count; bar lengths are normalized to the highest count.",
                },
                {
                  prop: "DocumentStorage",
                  type: "segments; capacity",
                  desc: "GB values, named photos/documents/video tones. Clamps invalid values and reports over-capacity storage.",
                },
                {
                  prop: "DocumentEmpty",
                  type: "title?; description?; onReset?",
                  desc: "Centered content-region empty state with an optional clear-filters action.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
