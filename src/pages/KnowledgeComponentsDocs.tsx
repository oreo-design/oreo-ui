import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  FolderCard,
  FolderTree,
  WorkspaceSwitcher,
  KnowledgeSearch,
  KnowledgeFileTable,
  FOLDER_TONES,
} from "@/components/knowledge-base";
import { folders, files, workspaces } from "@/patterns/knowledge-base/data";
const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "folders", label: "Folder cards" },
  { id: "navigation", label: "Navigation & search" },
  { id: "files", label: "File table" },
  { id: "composition", label: "Composition" },
  { id: "api", label: "API reference" },
];
function Examples() {
  const [selected, setSelected] = useState("violet");
  const [active, setActive] = useState("general");
  const [expanded, setExpanded] = useState(["general", "onboarding"]);
  const [workspace, setWorkspace] = useState("acme");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"none" | "ascending" | "descending">("none");
  const [opened, setOpened] = useState("");
  const filtered = files
    .filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) =>
      sort === "none"
        ? 0
        : (sort === "ascending" ? 1 : -1) * a.name.localeCompare(b.name),
    );
  return (
    <>
      <Section
        id="folders"
        title="Folder cards"
        description="Layered paper, a softly shaded cover and metadata placed on the folder. Three independent SVG illustrations stay sharp at any size; each instance has unique gradient IDs."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {FOLDER_TONES.map((tone, index) => (
            <FolderCard
              key={tone}
              tone={tone}
              title={["Onboarding", "Design System", "Documents"][index]}
              description="2 files"
              selected={selected === tone}
              onClick={() => setSelected(tone)}
              members={
                tone === "blue"
                  ? []
                  : [
                      { name: "Maya", color: "purple" },
                      { name: "Alex", color: "mint" },
                    ]
              }
              updated={tone === "violet" ? "Updated 2h" : undefined}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-text-secondary" role="status">
          Selected: {selected}
        </p>
      </Section>
      <Section
        id="navigation"
        title="Navigation & search"
        description="Workspace picker, search field and nested disclosure navigation. Expand buttons are separate from folder selection; every action supports native keyboard focus. Search below filters the file example."
      >
        <div className="max-w-sm space-y-4 rounded-card-medium border border-border-subtle bg-bg-elevated p-4">
          <WorkspaceSwitcher
            workspaces={workspaces}
            value={workspace}
            onChange={setWorkspace}
          />
          <KnowledgeSearch value={query} onChange={setQuery} />
          <FolderTree
            folders={folders}
            activeId={active}
            expandedIds={expanded}
            onSelect={setActive}
            onToggle={(id) =>
              setExpanded((v) =>
                v.includes(id) ? v.filter((item) => item !== id) : [...v, id],
              )
            }
          />
        </div>
      </Section>
      <Section
        id="files"
        title="File table"
        description="Sortable names and Oreo avatars. Open callbacks are controlled by the host. The author column is hidden on small screens; the complete template retains author details in the file preview."
      >
        <KnowledgeFileTable
          files={filtered}
          sort={sort}
          onSort={() =>
            setSort((v) => (v === "ascending" ? "descending" : "ascending"))
          }
          onOpen={(file) => setOpened(file.name)}
          empty={
            <>
              <p className="mb-3">No matching files.</p>
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            </>
          }
        />
        <p role="status" className="mt-4 text-xs text-text-secondary">
          {opened
            ? `Open callback: ${opened}`
            : "Select a file to try the callback."}
        </p>
      </Section>
    </>
  );
}
export function KnowledgeComponentsDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage nav={nav} toc={toc} breadcrumb={["Components", "Knowledge Base"]}>
      {() => (
        <>
          <header id="introduction" className="pb-8">
            <p className="mb-3 text-xs uppercase tracking-wider text-text-tertiary">
              A place for everything
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Knowledge base components
            </h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              Tactile folders, a clear hierarchy, and the files your team needs.
              Six reusable pieces for a quieter knowledge workspace.
            </p>
            <div className="mt-5">
              <Button render={<a href="/knowledge-base" />} tapScale={1}>
                Open Knowledge Base template ↗
              </Button>
            </div>
            <p className="mt-4 text-xs leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                href="https://x.com/david_visuals_/status/2109652303129252256"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                David’s Folders UI
              </a>
              . Independently recreated with SVG, Oreo tokens, Avatar, Menu and
              Icon. The static light reference is extended with dark mode,
              responsive layouts and local interactions.
            </p>
          </header>
          <Examples />
          <Section
            id="composition"
            title="Compose a knowledge base"
            description="Copy components/knowledge-base with its Oreo dependencies. Add patterns/knowledge-base for the complete local template."
          >
            <CodeBlock
              code={`import { FolderCard } from "@/components/knowledge-base";\n\n<FolderCard title="Onboarding" description="2 files · 2 subfolders"\n  tone="violet" updated="Updated 2h"\n  members={[{ name: "Maya", color: "purple" }]}\n  onClick={() => openFolder("onboarding")} />\n\nimport { KnowledgeBase } from "@/patterns/knowledge-base";\n<KnowledgeBase dark={dark} onToggleTheme={toggleTheme} />`}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              The template supports folder-scoped search (⌘/Ctrl K), nested
              navigation, name sorting, file summaries and workspace switching.
              Counts come from the fixture data. All state resets on reload. No
              storage, AI, upload or document service is connected.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <div className="overflow-x-auto">
              <PropsTable
                rows={[
                  {
                    prop: "FolderArtwork",
                    type: "tone?: violet | blue | yellow; className?",
                    desc: "Decorative vector art. Illustration colors use scoped Tailwind palette variables, independent of product chrome.",
                  },
                  {
                    prop: "FolderCard",
                    type: "title; description; tone?; members?; updated?; selected?",
                    desc: "Native button props including disabled/onClick. Members have name and optional Oreo Avatar color. Selected is optional for selection use cases.",
                  },
                  {
                    prop: "FolderTree",
                    type: "folders; activeId; expandedIds; onSelect; onToggle; label?",
                    desc: "Nested disclosure navigation. Folder: id, name, optional count/tone/children. IDs must be unique.",
                  },
                  {
                    prop: "WorkspaceSwitcher",
                    type: "workspaces; value; onChange",
                    desc: "Oreo Menu. Workspace: id, name, initials, members. Empty list renders nothing.",
                  },
                  {
                    prop: "KnowledgeSearch",
                    type: "value; onChange; inputRef?; placeholder?; label?",
                    desc: "Controlled search field. The host owns keyboard shortcut registration and filtering.",
                  },
                  {
                    prop: "KnowledgeFileTable",
                    type: "files; sort; onSort; onOpen; empty?",
                    desc: "Host owns sorting. sort: none/ascending/descending. Files include id, name, author, authorName, folderId, summary, size and optional avatar color.",
                  },
                ]}
              />
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
