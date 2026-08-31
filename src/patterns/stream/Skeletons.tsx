import { cn } from "@/lib/cn";
import { streamSkeleton } from "./stream.variants";

/**
 * Skeleton twin of the generic card: same surface, radius and padding, so the
 * swap to real content never jumps. Purely decorative — hidden from the
 * accessibility tree; the page announces loading elsewhere if it needs to.
 */
export function StreamCardSkeleton({ lines = 2 }: { lines?: number }) {
  const slots = streamSkeleton();
  return (
    <div className={slots.card()} aria-hidden>
      <div className={slots.header()}>
        <span className={cn(slots.block(), "size-6 rounded-lg")} />
        <span className={cn(slots.block(), "h-3.5 w-28")} />
        <span className={cn(slots.block(), "h-3 w-20")} />
      </div>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="flex gap-2">
          <span className={cn(slots.block(), "size-6 shrink-0 rounded-full")} />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
            <span className={cn(slots.block(), "h-3 w-24")} />
            {/* Vary the line ends so the stack doesn't read as a barcode. */}
            <span className={cn(slots.block(), "h-3", i % 2 ? "w-3/5" : "w-4/5")} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The whole-feed loading state — a handful of twins at the card gap. */
export function StreamSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3.5">
      <StreamCardSkeleton lines={2} />
      <StreamCardSkeleton lines={3} />
      <StreamCardSkeleton lines={1} />
    </div>
  );
}
