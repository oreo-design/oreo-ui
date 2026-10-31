export type AsyncSnapshot<T> =
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "error"; error: unknown };

/** Cache successful modules, share pending work, and allow failures to retry.
 * Each loader has a separate resource, so late navigation results cannot replace
 * another route. Rendering never invokes a loader or mutates browser state. */
export function createAsyncResource<T>(load: () => Promise<T>) {
  let snapshot: AsyncSnapshot<T> = { status: "loading" };
  let pending: Promise<void> | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: AsyncSnapshot<T>) => {
    snapshot = next;
    listeners.forEach(listener => listener());
  };
  const start = () => {
    if (pending || snapshot.status === "ready") return pending;
    publish({ status: "loading" });
    pending = Promise.resolve().then(load).then(
      value => publish({ status: "ready", value }),
      error => publish({ status: "error", error }),
    ).finally(() => { pending = undefined; });
    return pending;
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    start,
    retry: () => { if (!pending && snapshot.status !== "ready") void start(); },
  };
}
