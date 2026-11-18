export type NavigationFile = {
  id: string;
  name: string;
  kind: "file";
  bytes: number;
  description?: string;
  tone?: "olive" | "sand" | "stone";
};
export type NavigationFolder = {
  id: string;
  name: string;
  kind: "folder";
  children: NavigationEntry[];
};
export type NavigationEntry = NavigationFile | NavigationFolder;
/** IDs are unique within a tree; unknown/file destinations do not silently open root. */
export function folderPath(
  root: NavigationFolder,
  id: string,
): NavigationFolder[] {
  if (root.id === id) return [root];
  for (const entry of root.children)
    if (entry.kind === "folder") {
      const path = folderPath(entry, id);
      if (path.length) return [root, ...path];
    }
  return [];
}
export function entryBytes(entry: NavigationEntry): number {
  return entry.kind === "folder"
    ? entry.children.reduce((n, e) => n + entryBytes(e), 0)
    : Number.isFinite(entry.bytes)
      ? Math.max(0, entry.bytes)
      : 0;
}
export function formatBytes(bytes: number): string {
  const n = Number.isFinite(bytes) ? Math.max(0, bytes) : 0;
  if (n < 1000) return `${Math.round(n)} B`;
  const unit = Math.min(3, Math.floor(Math.log10(n) / 3));
  return `${(n / 1000 ** unit).toLocaleString("en-US", { maximumFractionDigits: 1 })} ${["B", "KB", "MB", "GB"][unit]}`;
}
