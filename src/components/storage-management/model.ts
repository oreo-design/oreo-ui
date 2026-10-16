export type StorageTone =
  | "documents"
  | "photos"
  | "video"
  | "mint"
  | "yellow"
  | "pink"
  | "neutral";
export type StorageModule = {
  id: string;
  name: string;
  bytes: number;
  files: number;
  growth: number;
  tone: StorageTone;
  archivedBytes: number;
  archivedFiles: number;
};
export type RecycledBatch = {
  id: string;
  moduleId: string;
  name: string;
  bytes: number;
  files: number;
};
export type StorageState = { modules: StorageModule[]; bin: RecycledBatch[] };
export const GB = 1_000_000_000;
export function formatStorage(bytes: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(bytes / GB)} GB`;
}
export function validModules(modules: StorageModule[]) {
  return (
    new Set(modules.map((m) => m.id)).size === modules.length &&
    modules.every(
      (m) =>
        m.id &&
        Number.isSafeInteger(m.bytes) &&
        m.bytes >= 0 &&
        Number.isSafeInteger(m.files) &&
        m.files >= 0 &&
        Number.isFinite(m.growth) &&
        Number.isSafeInteger(m.archivedBytes) &&
        m.archivedBytes >= 0 &&
        m.archivedBytes <= m.bytes &&
        Number.isSafeInteger(m.archivedFiles) &&
        m.archivedFiles >= 0 &&
        m.archivedFiles <= m.files &&
        (m.archivedFiles > 0 || m.archivedBytes === 0),
    ) &&
    Number.isSafeInteger(modules.reduce((sum, m) => sum + m.bytes, 0))
  );
}
export function usedBytes(state: StorageState) {
  return (
    state.modules.reduce((s, m) => s + m.bytes, 0) +
    state.bin.reduce((s, m) => s + m.bytes, 0)
  );
}
export function cleanupEstimate(modules: StorageModule[], ids: string[]) {
  return modules
    .filter((m) => ids.includes(m.id))
    .reduce(
      (s, m) => ({
        bytes: s.bytes + m.archivedBytes,
        files: s.files + m.archivedFiles,
      }),
      { bytes: 0, files: 0 },
    );
}
/** Moving archived files to the bin must not free quota until they are purged. */
export function recycleArchived(
  state: StorageState,
  ids: string[],
  batchId: string,
): StorageState {
  const moved = state.modules.filter(
    (m) => ids.includes(m.id) && m.archivedFiles > 0,
  );
  return {
    modules: state.modules.map((m) =>
      moved.includes(m)
        ? {
            ...m,
            bytes: m.bytes - m.archivedBytes,
            files: m.files - m.archivedFiles,
            archivedBytes: 0,
            archivedFiles: 0,
          }
        : m,
    ),
    bin: [
      ...state.bin,
      ...moved.map((m) => ({
        id: `${batchId}-${m.id}`,
        moduleId: m.id,
        name: m.name,
        bytes: m.archivedBytes,
        files: m.archivedFiles,
      })),
    ],
  };
}
export function restoreBatch(state: StorageState, id: string): StorageState {
  const item = state.bin.find((b) => b.id === id);
  if (!item || !state.modules.some((m) => m.id === item.moduleId)) return state;
  return {
    modules: state.modules.map((m) =>
      m.id === item.moduleId
        ? {
            ...m,
            bytes: m.bytes + item.bytes,
            files: m.files + item.files,
            archivedBytes: m.archivedBytes + item.bytes,
            archivedFiles: m.archivedFiles + item.files,
          }
        : m,
    ),
    bin: state.bin.filter((b) => b.id !== id),
  };
}
export function purgeBatch(state: StorageState, id: string): StorageState {
  return { ...state, bin: state.bin.filter((b) => b.id !== id) };
}
export const RETENTION_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 180, label: "6 months" },
  { value: 365, label: "1 year" },
  { value: 0, label: "Keep forever" },
];
