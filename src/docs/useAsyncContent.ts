import { useEffect, useSyncExternalStore } from "react";
import { createAsyncResource } from "./async-resource";

type Loader<T> = () => Promise<T>;
const resources = new WeakMap<Loader<unknown>, ReturnType<typeof createAsyncResource<unknown>>>();
export function useAsyncContent<T>(loader: Loader<T>) {
  let cached = resources.get(loader);
  if (!cached) { cached = createAsyncResource(loader); resources.set(loader, cached); }
  const resource = cached as ReturnType<typeof createAsyncResource<T>>;
  const snapshot = useSyncExternalStore(resource.subscribe, resource.getSnapshot, resource.getSnapshot);
  useEffect(() => { void resource.start(); }, [resource]);
  return { ...snapshot, retry: resource.retry };
}
