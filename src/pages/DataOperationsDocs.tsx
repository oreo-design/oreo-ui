import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { documentationCode } from "@/docs/playground/code";
import { formatCode } from "@/docs/playground/code-types";
import { dataFilterPopoverRecipe } from "@/docs/playground/adapters/data-operations";
import { PAGE_META } from "@/lib/site";
import {
  DataFilterPopover,
  DataSortMenu,
  RowActionMenu,
  BulkActionBar,
  type FilterValues,
  type DataSort,
} from "@/components/data-operations";
import {
  WorkflowStatusBadge,
  WorkflowRunBars,
  WorkflowTable,
  workflowRows,
} from "@/components/workflow-table";
import { Button } from "@/components/button";
import {
  WORKFLOWS,
  SORT_OPTIONS,
  FOLDERS,
  workflowFilterGroups,
} from "@/patterns/workflow-directory/data";
export function DataOperationsDocs({ nav }: { nav: DocsNav }) {
  const [filters, setFilters] = useState<FilterValues>({}),
    [sort, setSort] = useState<DataSort>({ key: "edited", direction: "desc" }),
    [selected, setSelected] = useState<string[]>(["wf-1", "wf-2", "wf-3"]),
    [notice, setNotice] = useState("");
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ?? "Data Operations";
  const preview =
    nav.active === "data-filter-popover" ? (
      <DataFilterPopover
        groups={workflowFilterGroups(WORKFLOWS)}
        value={filters}
        onApply={setFilters}
        resultCount={(draft) =>
          workflowRows(WORKFLOWS, { filters: draft }).length
        }
      />
    ) : nav.active === "data-sort-menu" ? (
      <DataSortMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
    ) : nav.active === "row-action-menu" ? (
      <RowActionMenu
        label="Workflow actions"
        actions={[
          { id: "duplicate", label: "Duplicate", icon: "copy" },
          {
            id: "move",
            label: "Move to folder",
            icon: "folder",
            children: FOLDERS.map((f) => ({
              id: f,
              label: f,
              icon: "folder" as const,
            })),
          },
          {
            id: "archive",
            label: "Archive",
            icon: "folder",
            danger: true,
            separatorBefore: true,
          },
        ]}
        onAction={setNotice}
      />
    ) : nav.active === "bulk-action-bar" ? (
      <BulkActionBar
        count={selected.length}
        total={WORKFLOWS.length}
        onSelectAll={() => setSelected(WORKFLOWS.map((r) => r.id))}
        onClear={() => setSelected([])}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => setNotice("Sample selection paused")}
        >
          Pause
        </Button>
      </BulkActionBar>
    ) : nav.active === "workflow-status-badge" ? (
      <div className="flex flex-wrap gap-2">
        {(
          [
            "Live",
            "Degraded",
            "Failing",
            "Draft",
            "Paused",
            "Archived",
          ] as const
        ).map((status) => (
          <WorkflowStatusBadge key={status} status={status} />
        ))}
      </div>
    ) : nav.active === "workflow-run-bars" ? (
      <WorkflowRunBars values={[4, 6, 7, 6, 8, 7, 10]} total={4812} />
    ) : (
      <WorkflowTable
        rows={WORKFLOWS.slice(0, 5)}
        selected={selected}
        onSelectionChange={setSelected}
      />
    );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "installation", label: "Installation" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Composed from Oreo controls, inspired by{" "}
              <a
                className="underline"
                href="https://x.com/jubayer6910/status/2111721342316020098"
              >
                Jubayer's table interactions
              </a>
              . Hosts own data, permissions and mutations.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/workflow-directory"
            >
              Open the complete Workflow Directory →
            </a>
          </header>
          <Section id="installation" title="Installation">
            <CodeBlock
              lang="text"
              code="Copy src/components/data-operations/ and src/components/workflow-table/, plus their Oreo imports.\nTemplate: src/patterns/workflow-directory/. No additional packages required."
            />
          </Section>
          <Section
            id="composition"
            title="Composition"
            description="Live local examples. Connect callbacks to your own data source."
          >
            <PreviewTabs
              preview={
                <div className="w-full p-4">
                  {preview}
                  <p role="status" className="mt-4 text-xs text-text-secondary">
                    {notice}
                  </p>
                </div>
              }
              code={nav.active === "data-filter-popover" ? formatCode(dataFilterPopoverRecipe({ selection: JSON.stringify(filters) })) : documentationCode(preview, { "data-operations": { DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar }, "workflow-table": { WorkflowStatusBadge, WorkflowRunBars, WorkflowTable }, button: { Button } })}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "DataFilterPopover: groups / value / onApply",
                  type: "FilterGroup[] / FilterValues / callback",
                  desc: "Groups use checks, pills or single select. Values within a group are OR; the template combines groups with AND. Dismissal cancels the draft. Clear all changes only the draft until Apply.",
                },
                {
                  prop: "DataFilterPopover: resultCount",
                  type: "(draft: FilterValues) => number",
                  desc: "Optional synchronous matching-result count shown before applying.",
                },
                {
                  prop: "DataSortMenu: options / value / onChange",
                  type: "SortOption[] / DataSort / callback",
                  desc: "Controlled field and asc/desc direction. Options can customize direction labels. Template puts absent success metrics last.",
                },
                {
                  prop: "RowActionMenu: actions / onAction / trigger",
                  type: "DataAction[] / callback / ReactNode",
                  desc: "Nested children share the canonical Menu. IDs must be unique. Optional selected, disabled, danger and separatorBefore flags. Omit trigger for an ellipsis icon button.",
                },
                {
                  prop: "BulkActionBar: count / total / onSelectAll / onClear",
                  type: "number / number / callback / callback",
                  desc: "Host supplies scoped counts and action children. Bar hides when count is zero. Select all explicitly means all matching rows, not only the current page.",
                },
                {
                  prop: "WorkflowTable: rows / selected / onSelectionChange",
                  type: "Workflow[] / string[] / callback",
                  desc: "Stable IDs, native mixed-state header checkbox. Selection can span pages; template clears it on filter/view/search changes and intersects it with current results before bulk operations.",
                },
                {
                  prop: "WorkflowTable: onOpen / actions / loading / error / onReset",
                  type: "callback / render callback / boolean / string / callback",
                  desc: "Controlled row detail and action rendering. Initial loading uses a content-shaped skeleton; shared empty/error presentation provides recovery.",
                },
                {
                  prop: "WorkflowStatusBadge: status",
                  type: "WorkflowStatus",
                  desc: "Semantic icon and visible label. Colors map to existing Oreo Tag palettes.",
                },
                {
                  prop: "WorkflowRunBars: values / total / failing",
                  type: "number[] / number / boolean",
                  desc: "Decorative relative bars alongside an accessible count. Values represent one consistent time range.",
                },
              ]}
            />
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              The full template has local creation/editing, duplicate, move,
              pause, archive/restore, undo, pagination and CSV export. Its
              sample tests never invoke external services; only the current
              fixture version is available. Mobile keeps the table in a labeled
              scroll region. Popovers use local theme portals, keyboard focus
              return and reduced-motion-aware transitions.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
