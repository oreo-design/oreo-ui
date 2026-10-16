import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function WritingFoldersDocs({ nav }: { nav: DocsNav }) {
  const empty = nav.active === "folder-empty-state",
    name = empty ? "Folder Empty State" : "Folder Collection";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {empty
                ? "A quiet folder empty state with decorative rows fading behind a clear creation action."
                : "Controlled folder browsing in a table or grid, with document counts, visibility and host-owned actions."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/writing-folders"
            >
              Open Writing Folders ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                empty
                  ? 'import { FolderEmptyState } from "@/components/writing-folders";\n\n<FolderEmptyState onCreate={openCreateFolder} />'
                  : 'import { FolderCollection, folderRows } from "@/components/writing-folders";\n\n<FolderCollection folders={folderRows(library, query, visibility, sort)} view="list" onOpen={openFolder} onCreate={createFolder} onRename={renameFolder} onDelete={confirmDelete} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                empty
                  ? [
                      {
                        prop: "title / description",
                        type: "string",
                        desc: "Optional empty-state copy. Decorative rows are hidden from assistive technology and have no pointer interaction.",
                      },
                      {
                        prop: "onCreate",
                        type: "() => void",
                        desc: "Optional New folder action. Uses DocumentEmpty and its canonical secondary button. No callback means no action button.",
                      },
                    ]
                  : [
                      {
                        prop: "folders / view",
                        type: "FolderRow[] / list | grid",
                        desc: "Caller-owned unique IDs, names, ISO timestamps, Private or Workspace metadata and derived documentCount. Defaults to list; dates display in UTC.",
                      },
                      {
                        prop: "onOpen / onRename / onDelete",
                        type: "callbacks",
                        desc: "Optional host-owned actions. Omitted callbacks render text or omit the corresponding action. The host owns editing, confirmation and permissions.",
                      },
                      {
                        prop: "loading / error",
                        type: "boolean / string",
                        desc: "Initial loads show static skeletons; refresh preserves rows. Error reuses AgentWorkspaceState with optional onReset recovery.",
                      },
                      {
                        prop: "filtered / onReset / onCreate",
                        type: "boolean / callbacks",
                        desc: "Distinguish no matches from a fresh collection. Filtering empty states clear filters; initial empty states offer folder creation.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template starts with no folders and four unorganized
              sample documents. Create folders, switch views, search, filter
              visibility, sort, edit documents and move them between folders.
              Deleting a folder moves its contents to Unorganized. Undo restores
              the last library snapshot; JSON exports the entire library. Reload
              resets all changes.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Folder names are trimmed, Unicode-normalized and
              case-insensitively unique, up to 80 characters. Document titles
              allow 120 characters and body text allows 20,000. Visibility
              labels are sample metadata, not sharing or permission controls.
              The decorative empty illustration is static and distinct from
              loading.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/goutham/status/2110710268540117089"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Goutham ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
