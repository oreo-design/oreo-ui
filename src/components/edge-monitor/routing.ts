export type RoutingLoad = { id: string; requests: number };
/** Hypothetical capacity from an explicitly supplied headroom snapshot. */
export function routingPreview(
  source: RoutingLoad,
  target: RoutingLoad,
  percent: number,
  headroom: number,
) {
  if (source.id === target.id)
    return {
      error: "Choose different source and destination regions.",
    } as const;
  if (
    ![source.requests, target.requests].every(
      (n) => Number.isSafeInteger(n) && n > 0,
    )
  )
    return { error: "Positive whole request rates are required." } as const;
  if (!Number.isInteger(percent) || percent < 1 || percent > 50)
    return { error: "Choose a share from 1% to 50%." } as const;
  if (!Number.isFinite(headroom) || headroom <= 0 || headroom >= 100)
    return { error: "Destination capacity is unavailable." } as const;
  const moved = Math.round((source.requests * percent) / 100),
    capacity = Math.floor(target.requests / (1 - headroom / 100));
  if (moved === 0)
    return {
      error: "This share is too small to move a whole request per second.",
    } as const;
  if (target.requests + moved > capacity)
    return {
      error: "This share exceeds the destination's available capacity.",
    } as const;
  return {
    error: null,
    moved,
    sourceAfter: source.requests - moved,
    targetAfter: target.requests + moved,
    remainingHeadroom: (100 * (capacity - target.requests - moved)) / capacity,
  };
}
