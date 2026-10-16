export type FolderVisibility = "Private" | "Workspace";
export type WritingFolder = {
  id: string;
  name: string;
  visibility: FolderVisibility;
  modified: string;
};
export type WritingDocument = {
  id: string;
  title: string;
  body: string;
  folderId: string | null;
  modified: string;
};
export type WritingLibrary = {
  folders: WritingFolder[];
  documents: WritingDocument[];
};
const normalize = (name: string) => name.normalize("NFC").trim();
export function saveFolder(
  library: WritingLibrary,
  folder: WritingFolder,
): WritingLibrary {
  const name = normalize(folder.name);
  if (!name || name.length > 80)
    throw new Error("Use a folder name between 1 and 80 characters.");
  if (
    library.folders.some(
      (f) =>
        f.id !== folder.id &&
        normalize(f.name).toLocaleLowerCase("en") ===
          name.toLocaleLowerCase("en"),
    )
  )
    throw new Error("A folder with this name already exists.");
  if (!["Private", "Workspace"].includes(folder.visibility))
    throw new Error("Choose a valid visibility.");
  const next = { ...folder, name };
  return {
    ...library,
    folders: library.folders.some((f) => f.id === folder.id)
      ? library.folders.map((f) => (f.id === folder.id ? next : f))
      : [...library.folders, next],
  };
}
export function saveDocument(
  library: WritingLibrary,
  doc: WritingDocument,
): WritingLibrary {
  const title = normalize(doc.title);
  if (!title || title.length > 120)
    throw new Error("Use a document title between 1 and 120 characters.");
  if (doc.body.length > 20000)
    throw new Error("Keep this sample document within 20,000 characters.");
  if (
    doc.folderId !== null &&
    !library.folders.some((f) => f.id === doc.folderId)
  )
    throw new Error("Choose an existing folder or Unorganized.");
  const previous = library.documents.find((d) => d.id === doc.id);
  const next = { ...doc, title };
  return {
    folders: library.folders.map((f) =>
      f.id === doc.folderId || f.id === previous?.folderId
        ? { ...f, modified: doc.modified }
        : f,
    ),
    documents: previous
      ? library.documents.map((d) => (d.id === doc.id ? next : d))
      : [...library.documents, next],
  };
}
export function removeFolder(
  library: WritingLibrary,
  id: string,
  now: string,
): WritingLibrary {
  if (!library.folders.some((f) => f.id === id))
    throw new Error("This folder no longer exists.");
  return {
    folders: library.folders.filter((f) => f.id !== id),
    documents: library.documents.map((d) =>
      d.folderId === id ? { ...d, folderId: null, modified: now } : d,
    ),
  };
}
export function folderRows(
  library: WritingLibrary,
  query = "",
  visibility = "All visibility",
  sort = "recent",
) {
  return library.folders
    .filter(
      (f) =>
        f.name
          .toLocaleLowerCase("en")
          .includes(query.trim().toLocaleLowerCase("en")) &&
        (visibility === "All visibility" || f.visibility === visibility),
    )
    .map((f) => ({
      ...f,
      documentCount: library.documents.filter((d) => d.folderId === f.id)
        .length,
    }))
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "en")
        : b.modified.localeCompare(a.modified) ||
          a.name.localeCompare(b.name, "en"),
    );
}
