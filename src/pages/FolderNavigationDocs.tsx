import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function FolderNavigationDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Folder Navigation"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "properties", label: "Properties" },
        { id: "rules", label: "States & composition" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Folder Navigation</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Compact folders with a name that travels between the list and
              breadcrumb. Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/dev_ya/status/2122731623192072502"
              >
                Yanis Lebzar’s folder navigation
              </a>
              .
            </p>
            <a
              className="inline-block mt-4 underline"
              href="/folder-navigation-workspace"
            >
              Open the complete workspace →
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                "const [folderId, setFolderId] = useState(root.id);\n<FolderNavigator root={root} folderId={folderId}\n  onNavigate={setFolderId} onFileOpen={openFile} />"
              }
            />
          </Section>
          <Section id="properties" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "FolderNavigator",
                  type: "root, folderId, onNavigate",
                  desc: "Controlled tree and current folder. IDs must be unique, and the tree must be acyclic. Folder sizes derive from descendant files. Unknown or file IDs show a recoverable unavailable state.",
                },
                {
                  prop: "File and filter actions",
                  type: "onFileOpen?, query?, onClearQuery?",
                  desc: "Files without an open callback are disabled. Search filters the current folder only. The host owns query, recovery and data requests; no persistence is implied.",
                },
                {
                  prop: "Motion",
                  type: "motionEnabled?",
                  desc: "Defaults to true. Pointer navigation moves the name for 240ms with the existing easeOut; new rows resolve over 180ms. Keyboard and reduced motion skip interpolation. Content switches immediately without timers or queues.",
                },
                {
                  prop: "FolderNavigationRow",
                  type: "entry, onOpen, disabled?, transfer?",
                  desc: "Native button with folder/file identity and derived size. Callback receives entry and input method. transfer is for a coordinated LayoutGroup, not standalone animation.",
                },
                {
                  prop: "FolderPathTrail",
                  type: "path, onNavigate, transfer?",
                  desc: "Root and last two path elements remain visible; hidden ancestors use the shared Menu. Current folder is text, not a redundant navigation action.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy and layout">
            <div className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Use for compact folder browsing. Existing FolderTree and
                KnowledgeFileTable remain the choices for a persistent tree or
                dense multi-column metadata. Menu, Icon, StatusView, Button and
                the theme tokens remain canonical owners.
              </p>
              <p>
                Long names wrap. Counts distinguish folders and files; sizes use
                decimal units. Empty folders, no matches and invalid
                destinations have distinct recovery actions. No artificial
                loading state is inserted into local data.
              </p>
              <p>
                The breadcrumb stays outside the bounded scrolling body.
                Enter/Space opens a row; ArrowLeft returns to the parent.
                Entering focuses the current breadcrumb; returning focuses the
                folder you left. Search stays editable and theme actions remain
                reachable. Rapid navigation does not wait for motion.
              </p>
              <p>
                The template adds current-folder search and a Base UI dialog
                with file metadata and Escape focus return. Files and totals are
                illustrative local fixtures, reset on reload. It does not fetch,
                upload or download original client files. Source imagery is not
                redistributed. Foundation colors, spacing, type, radii and
                shadows map to existing Oreo tokens; motion blur is a deliberate
                2px effect, not a new design scale.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
