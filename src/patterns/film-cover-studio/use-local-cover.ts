import { useCallback, useEffect, useRef, useState } from "react";
import {
  validateCover,
  type FilmAsset,
  type CoverStatus,
} from "@/components/film-cover/model";
export const SAMPLE_PHOTOS: FilmAsset[] = [
  {
    id: "kyoto",
    name: "kyoto-street.jpg",
    src: "/examples/gradient-mask/kyoto.jpg",
    alt: "A quiet street and pagoda in Kyoto",
  },
  {
    id: "garden",
    name: "garden-house.jpg",
    src: "/examples/document-workspace/garden.jpg",
    alt: "A house set in a green garden",
  },
  {
    id: "interior",
    name: "afternoon-light.jpg",
    src: "/examples/document-workspace/interior.jpg",
    alt: "Sunlit living room with warm natural materials",
  },
  {
    id: "villa",
    name: "summer-villa.jpg",
    src: "/examples/document-workspace/villa.jpg",
    alt: "A villa with an outdoor pool",
  },
];
// Deliberately paced local demonstration, never represented as network transfer.
export function useLocalCover() {
  const [value, setValue] = useState<FilmAsset | null>(null),
    [status, setStatus] = useState<CoverStatus>("empty"),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  const [animate, setAnimate] = useState(true);
  const generation = useRef(0),
    frame = useRef(0),
    urls = useRef<string[]>([]),
    last = useRef<FilmAsset | null>(null);
  const abort = useCallback(() => {
    generation.current++;
    cancelAnimationFrame(frame.current);
  }, []);
  useEffect(
    () => () => {
      abort();
      urls.current.forEach(URL.revokeObjectURL);
    },
    [abort],
  );
  const select = useCallback(
    async (asset: FilmAsset, keyboard = false) => {
      abort();
      const current = generation.current;
      last.current = asset;
      setValue(asset);
      setProgress(0);
      setError("");
      setStatus("loading");
      setAnimate(!keyboard);
      try {
        const img = new Image();
        img.src = asset.src;
        await img.decode();
        if (current !== generation.current) return;
        const start = performance.now();
        const duration =
          keyboard ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : 2400;
        const tick = (now: number) => {
          if (current !== generation.current) return;
          const p = duration ? Math.min(1, (now - start) / duration) : 1;
          setProgress(p);
          if (p < 1) frame.current = requestAnimationFrame(tick);
          else setStatus("ready");
        };
        frame.current = requestAnimationFrame(tick);
      } catch {
        if (current === generation.current) {
          setStatus("error");
          setError(
            "This image could not be opened. Retry or choose another image.",
          );
        }
      }
    },
    [abort],
  );
  const files = useCallback(
    (items: File[]) => {
      if (!items.length) return;
      const problem =
        items.length > 1
          ? "Choose one cover image at a time."
          : validateCover(items[0]);
      if (problem) {
        // Rejected input must not turn the existing valid cover into a failed one.
        setError(problem);
        return;
      }
      const file = items[0],
        src = URL.createObjectURL(file);
      urls.current.push(src);
      void select({
        id: src,
        src,
        name: file.name,
        alt: file.name,
        size: file.size,
      });
    },
    [abort, select],
  );
  const restore = useCallback(
    (asset: FilmAsset | null) => {
      abort();
      last.current = asset;
      setValue(asset);
      setProgress(asset ? 1 : 0);
      setStatus(asset ? "ready" : "empty");
      setError("");
    },
    [abort],
  );
  return {
    value,
    status,
    progress,
    error,
    animate,
    select,
    files,
    restore,
    remove: () => restore(null),
    retry: () => {
      if (last.current) void select(last.current);
    },
    canRetry: !!last.current,
  };
}
