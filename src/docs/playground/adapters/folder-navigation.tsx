import { useState } from "react";
import {
  FolderNavigator,
  FolderNavigationRow,
  FolderPathTrail,
  folderPath,
  type NavigationFolder,
} from "@/components/folder-navigation";
import { FIELDWORK } from "@/patterns/folder-navigation-workspace/data";
import {
  definePlayground as define,
  toggle,
  text,
  select,
  type PlaygroundSpec,
} from "../schema";
function Demo({
  empty,
  unavailable,
  motionEnabled,
  query,
}: {
  empty: boolean;
  unavailable: boolean;
  motionEnabled: boolean;
  query: string;
}) {
  const [id, setId] = useState(
    unavailable ? "missing" : empty ? "fieldwork" : "maison",
  );
  const root: NavigationFolder = empty
    ? { ...FIELDWORK, children: [] }
    : FIELDWORK;
  return (
    <div className="w-full p-6">
      <FolderNavigator
        root={root}
        folderId={id}
        onNavigate={setId}
        query={query}
        motionEnabled={motionEnabled}
      />
    </div>
  );
}
function RowDemo({ name, disabled }: { name: string; disabled: boolean }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="w-full max-w-lg p-6">
      <FolderNavigationRow
        entry={{ id: "demo", name, kind: "folder", children: [] }}
        disabled={disabled}
        onOpen={() => setOpened(true)}
      />
      <p className="text-xs text-text-tertiary mt-4" role="status">
        {opened
          ? `Navigation callback: ${name}`
          : "Select the row to inspect its navigation callback."}
      </p>
    </div>
  );
}
function TrailDemo({ depth }: { depth: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="w-full p-6">
      <FolderPathTrail
        path={folderPath(FIELDWORK, selected ?? depth)}
        onNavigate={setSelected}
      />
    </div>
  );
}
const fixtures = JSON.stringify(FIELDWORK);
const specs: Record<string, PlaygroundSpec> = {
  "folder-navigator": {
    ...define(
      "Folder Navigator",
      {
        empty: toggle(false),
        unavailable: toggle(false),
        motionEnabled: toggle(true),
        query: text(""),
      },
      (v) => <Demo key={`${v.empty}-${v.unavailable}`} {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import {useState} from "react";',
        'import {FolderNavigator, type NavigationFolder} from "@/components/folder-navigation";',
      ],
      setup: [
        `const root:NavigationFolder = ${v.empty ? JSON.stringify({ ...FIELDWORK, children: [] }) : fixtures};`,
        `const [folderId,setFolderId] = useState(${JSON.stringify(v.unavailable ? "missing" : v.empty ? "fieldwork" : "maison")});`,
      ],
      jsx: `<FolderNavigator root={root} folderId={folderId} onNavigate={setFolderId} query={${JSON.stringify(v.query)}} motionEnabled={${v.motionEnabled}} />`,
      notes: [
        "Provide onFileOpen to enable file rows. The host owns query and asynchronous data; this component performs no requests.",
      ],
    }),
  },
  "folder-navigation-row": {
    ...define(
      "Folder Navigation Row",
      { name: text("Campaigns"), disabled: toggle(false) },
      (v) => <RowDemo {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import {FolderNavigationRow} from "@/components/folder-navigation";',
      ],
      setup: [
        "const openFolder = (entry: {id:string}) => console.info(entry.id);",
      ],
      jsx: `<FolderNavigationRow entry={{id:"campaigns",name:${JSON.stringify(v.name)},kind:"folder",children:[]}} disabled={${v.disabled}} onOpen={openFolder} />`,
      notes: [
        "Replace openFolder with host navigation. Folder bytes are derived from children.",
      ],
    }),
  },
  "folder-path-trail": {
    ...define(
      "Folder Path Trail",
      { depth: select(["fieldwork", "maison", "selects"] as const, "selects") },
      (v) => <TrailDemo key={v.depth} {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import {useState} from "react";',
        'import {FolderPathTrail,folderPath,type NavigationFolder} from "@/components/folder-navigation";',
      ],
      setup: [
        `const root:NavigationFolder = ${fixtures};`,
        `const [folderId,setFolderId]=useState(${JSON.stringify(v.depth)});`,
      ],
      jsx: "<FolderPathTrail path={folderPath(root,folderId)} onNavigate={setFolderId} />",
      notes: [
        "The current location is readable text. Hidden ancestors use the shared Menu with keyboard and Escape support.",
      ],
    }),
  },
};
for (const spec of Object.values(specs)) {
  spec.source = "folder-navigation";
  spec.exports = {
    "folder-navigation": {
      FolderNavigator,
      FolderNavigationRow,
      FolderPathTrail,
      folderPath,
    },
  };
}
export default specs;
