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
  "storage-usage-card": {
    name: "StorageUsageCard",
    description:
      "A segmented capacity summary built on DocumentStorage, with exact module totals and recycle-bin accounting.",
    code: "<StorageUsageCard modules={modules} capacity={20_000_000_000} recycledBytes={0} />",
    rows: [
      {
        prop: "modules",
        type: "StorageModule[]",
        desc: "Unique IDs and non-negative safe integer byte/file counts. The card rejects invalid data rather than hiding it.",
      },
      {
        prop: "capacity / recycledBytes",
        type: "number",
        desc: "Capacity in decimal bytes, greater than zero. Recycled bytes count toward occupied quota. Over-capacity usage remains visible; segment widths normalize to total used.",
      },
    ],
  },
  "storage-module-table": {
    name: "StorageModuleTable",
    description:
      "A selectable storage inventory with precise file counts, occupancy shares and detail actions.",
    code: "<StorageModuleTable modules={modules} totalUsed={18_800_000_000}\n selected={selected} onSelectionChange={setSelected} onDetails={openModule} />",
    rows: [
      {
        prop: "modules / totalUsed",
        type: "StorageModule[] / number",
        desc: "Host supplies filtered/sorted modules. Share denominator is all occupied bytes, including recycled files; it must be at least the visible module total.",
      },
      {
        prop: "selected / onSelectionChange",
        type: "string[] / callback",
        desc: "Controlled selection. Select-all acts on visible rows, preserves selected IDs outside the view, and reflects mixed state. Omit callback for nonselectable table.",
      },
      {
        prop: "onDetails / empty",
        type: "callback / ReactNode",
        desc: "Optional named View action and custom empty state. Scrollable table keeps an opaque header.",
      },
    ],
  },
  "retention-policy-row": {
    name: "RetentionPolicyRow",
    description:
      "An existing settings row composed with an accessible duration control and neutral leading icon.",
    code: '<RetentionPolicyRow title="Recycle bin retention"\n description="Keep deleted records recoverable." value={days} onChange={setDays} icon="trash" />',
    rows: [
      {
        prop: "title / description / icon",
        type: "string / string / IconName",
        desc: "Title names the native select; description explains the policy. Reuses RowShell and RowLabel.",
      },
      {
        prop: "value / onChange",
        type: "number / callback",
        desc: "Days: 7, 30, 90, 180, 365, or 0 (keep forever). Host owns draft/save and scheduling; this row never deletes anything.",
      },
      {
        prop: "disabled",
        type: "boolean",
        desc: "Disables the native selection control.",
      },
    ],
  },
};
export function StorageManagementDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["storage-usage-card"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", s.name.replace(/([a-z])([A-Z])/g, "$1 $2")]}
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
              {s.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/storage-manager"
            >
              Open Storage Manager ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name} } from "@/components/storage-management";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              StorageModule contains id, name, bytes, files, growth (signed
              percent), tone, archivedBytes and archivedFiles. Bytes use decimal
              GB (1 GB = 1,000,000,000 bytes). Archived counts must fit the
              module total. The template keeps active modules and recycle-bin
              batches in one local model: recycling preserves quota, restoring
              reverses the move, purging frees only the reviewed batch. One-step
              undo restores the previous file operation. Retention preferences
              are drafts until saved and never schedule a real job. Export is a
              complete JSON snapshot; all changes reset on reload.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/Tanjim38/status/2110794332525715550"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Tanjim ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
