import type { WritingLibrary } from "@/components/writing-folders";
export function makeWritingLibrary(): WritingLibrary {
  return {
    folders: [],
    documents: [
      "A small beginning",
      "Notes on noticing",
      "An idea worth keeping",
      "The weekly letter",
    ].map((title, i) => ({
      id: `document-${i + 1}`,
      title,
      body: [
        "Every good idea starts with a little space to think.",
        "A collection of observations from this week.",
        "Make room for the things that matter.",
        "What we learned, what we made, and what comes next.",
      ][i],
      folderId: null,
      modified: `2026-10-${String(12 + i).padStart(2, "0")}T09:00:00.000Z`,
    })),
  };
}
export const SAMPLE_FOLDER_ROWS = [
  {
    id: "essays",
    name: "Essays & ideas",
    visibility: "Private" as const,
    modified: "2026-10-15T09:00:00.000Z",
    documentCount: 8,
  },
  {
    id: "letters",
    name: "Studio letters",
    visibility: "Workspace" as const,
    modified: "2026-10-14T09:00:00.000Z",
    documentCount: 3,
  },
];
