import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries: Record<
  string,
  {
    title: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "command-search": {
    title: "Command Search",
    description:
      "An anchored, grouped action search with keyboard navigation. Composed from the same Base UI Combobox behavior as Inline Search Select, plus Oreo Icon, Shortcut and empty-state primitives.",
    code: "<CommandSearch groups={groups} onSelect={handleCommand} shortcuts />",
    rows: [
      {
        prop: "groups",
        type: "CommandGroup[]",
        desc: "Each group has a label and items. Each item has a unique id, label, optional keywords, IconName icon and disabled flag. IDs must be unique across groups.",
      },
      {
        prop: "onSelect",
        type: "(command) => void",
        desc: "Host owns the action. Disabled items cannot execute. Selection closes and resets search.",
      },
      {
        prop: "shortcuts",
        type: "boolean",
        desc: "Default false. Enable once per workspace for F and Cmd/Ctrl+K. Bare F ignores editable fields; shortcuts do not intercept another dialog or IME composition.",
      },
      {
        prop: "label / placeholder",
        type: "string",
        desc: "Accessible field name and visible hint. Defaults: Find in workspace / Find. Each open starts with an empty query.",
      },
    ],
  },
  "workspace-metric": {
    title: "Workspace Metric",
    description:
      "A quiet metric card with a value, supporting context and an optional icon. Formatting and data aggregation stay with the host.",
    code: '<WorkspaceMetric label="Requests" value="181.2k"\n  detail="Across the last 7 days" icon={<Icon name="chart-bar" />} />',
    rows: [
      {
        prop: "label / value / detail",
        type: "string",
        desc: "Required visible label, formatted value and explanation. Use explicit units and time periods.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        desc: "Optional decorative glyph; inherits the shared secondary text color.",
      },
    ],
  },
  "deployment-row": {
    title: "Deployment Row",
    description:
      "An actionable build record with project identity, branch, revision, timestamp and an explicit Ready or Failed label.",
    code: "<DeploymentRow deployment={deployment} onOpen={openDetails} />",
    rows: [
      {
        prop: "deployment",
        type: "Deployment",
        desc: "id, name, branch, commit, time and status (ready or failed). Demo timestamps are labels, not a live clock.",
      },
      {
        prop: "onOpen",
        type: "(deployment) => void",
        desc: "Called on click or keyboard activation. The host owns navigation, detail UI and any retry behavior.",
      },
    ],
  },
};
export function CommandSearchDocs({ nav }: { nav: DocsNav }) {
  const item = entries[nav.active] ?? entries["command-search"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", item.title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {item.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {item.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/command-dashboard"
            >
              Open Command Dashboard ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${item.title.replaceAll(" ", "")} } from "@/components/command-search";\n\n${item.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={item.rows} />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              Filtering matches labels and keywords, case-insensitively. Arrow
              keys highlight results, Enter executes, Escape dismisses, and the
              trigger receives focus on dismissal. Search is synchronous: no
              invented loading state. The input stays visible above the
              scrollable result list. Menus inherit the containing theme and
              open instantly, including under reduced motion.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The dashboard extends the cropped reference with seven local
              pages, project creation, fixture build recovery, saved resource
              links and local settings. It does not deploy, connect an account,
              or create real credentials. State resets on reload. Base UI is
              already the project’s accessible primitive layer, so no second
              command-menu dependency is added.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/efferdco/status/2110449789066490250"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Efferd ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
