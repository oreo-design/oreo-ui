import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "annotated-waveform": {
    name: "AnnotatedWaveform",
    description:
      "A controlled audio waveform with timestamped collaborator markers, keyboard seeking and exact comment links.",
    code: "<AnnotatedWaveform samples={samples} duration={238} position={84}\n comments={comments} onSeek={seekAudio} onComment={openComment} />",
    rows: [
      {
        prop: "samples / duration / position",
        type: "number[] / number / number",
        desc: "1–1024 normalized amplitude samples and seconds. Host owns audio. Invalid samples/duration use the shared error state. Position is clamped.",
      },
      {
        prop: "comments / selectedId",
        type: "MixComment[] / optional string",
        desc: "Pass comments for the active version only. Markers outside duration are omitted. Exact timestamp links remain usable when avatar markers overlap.",
      },
      {
        prop: "onSeek / onComment",
        type: "optional callbacks",
        desc: "Native range supports keyboard input; callback requests a time or comment ID. No media side effects inside this component.",
      },
    ],
  },
  "production-task-list": {
    name: "ProductionTaskList",
    description:
      "A production checklist with nested stems, derived parent completion, assignees, due dates and timestamp links.",
    code: "<ProductionTaskList tasks={tasks}\n onToggle={(id,done) => setTasks(toggleTask(tasks,id,done))}\n onSeek={(seconds,versionId) => selectAndSeek(versionId,seconds)} />",
    rows: [
      {
        prop: "tasks",
        type: "ProductionTask[]",
        desc: "Unique IDs, title, done, assignee, due; optional children, seconds and versionId. Parent completion is derived from all children. Empty list has the shared centered state.",
      },
      {
        prop: "onToggle",
        type: "optional (id,done) callback",
        desc: "Host owns mutation and undo. Exported toggleTask immutably updates a node and its descendants.",
      },
      {
        prop: "onSeek",
        type: "optional callback",
        desc: "Timestamp link requests the correct version and position. Missing callback disables the link.",
      },
    ],
  },
  "mix-version-list": {
    name: "MixVersionList",
    description:
      "Selectable audio versions with title, uploader, duration, notes and an explicit latest entry.",
    code: "<MixVersionList versions={versions} value={selected}\n onChange={selectVersion} />",
    rows: [
      {
        prop: "versions",
        type: "MixVersion[]",
        desc: "Newest first. Each item has id, title, author, date, duration in seconds, src and note. Empty list shows a shared state.",
      },
      {
        prop: "value / onChange",
        type: "string / optional callback",
        desc: "Controlled version ID; aria-pressed identifies the selection. Host must stop previous audio and load the selected version. No upload side effect.",
      },
    ],
  },
};
export function MusicProjectDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["annotated-waveform"];
  const title = s.name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              href="/music-project"
              className="mt-4 inline-block text-sm underline"
            >
              Open Music Project ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name}${s.name === "ProductionTaskList" ? ", toggleTask" : ""} } from "@/components/music-project";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template uses actual HTML audio playback with the existing
              synthesized demo. All four seeded versions share that source and
              an illustrative envelope, not decoded amplitude data. A local
              replacement file becomes a new version; old audio and comments
              remain available until reload. No uploads or external messages
              occur. Comments belong to one version and a fixed timestamp.
              Native range, Base UI tabs and explicit timestamp buttons provide
              keyboard navigation. Reduced motion hides the colored progress
              overlay while keeping time and controls.
            </p>
            <a
              href="https://x.com/designflyio/status/2110867727741341732"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Reference by Brad / Designfly ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
