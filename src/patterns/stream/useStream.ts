import { useCallback, useMemo, useState } from "react";
import { SEED, TOPIC_LABELS, makeCard } from "./seed";
import type { StreamItem, StreamTier, StreamTopic } from "./types";

export type StreamFilterChip = { id: StreamTopic; label: string; count: number };

export type UseStreamResult = {
  /** Per-tier lists after read-state + filter. Drives the tier presences. */
  visible: { attention: StreamItem[]; rest: StreamItem[] };
  /**
   * Filter chips. Counts are taken over the *unfiltered* unread set — each
   * chip advertises what selecting it would show, so counts don't self-erase
   * when a filter is active. Zero-count topics are dropped entirely.
   */
  chips: StreamFilterChip[];
  filter: StreamTopic | null;
  loading: boolean;
  /** True when both tiers are empty (and not loading) — the empty state. */
  isEmpty: boolean;
  injectCard: (tier?: StreamTier) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setFilter: (topic: StreamTopic | null) => void;
  toggleLoading: () => void;
  reset: () => void;
};

/**
 * Demo state for the stream — deliberately the *simplest thing that exercises
 * the motion contract*: a flat item list, a read-set, one filter, a loading
 * flag. In-memory only (reset should be trivial), no persistence, no data
 * machinery. A real host replaces this hook wholesale and keeps the UI.
 */
export function useStream(): UseStreamResult {
  const [items, setItems] = useState<StreamItem[]>(SEED);
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());
  const [filter, setFilterState] = useState<StreamTopic | null>(null);
  const [loading, setLoading] = useState(false);

  const derived = useMemo(() => {
    const unread = items.filter((item) => !readIds.has(item.id));

    const counts = new Map<StreamTopic, number>();
    for (const item of unread) counts.set(item.topic, (counts.get(item.topic) ?? 0) + 1);
    const chips: StreamFilterChip[] = Object.keys(TOPIC_LABELS)
      .filter((topic) => (counts.get(topic) ?? 0) > 0)
      .map((topic) => ({ id: topic, label: TOPIC_LABELS[topic], count: counts.get(topic) ?? 0 }));

    // Self-healing filter: when the active topic's count drops to zero its
    // chip is gone, so the filter demotes to "all" in the same render — the
    // user is never stranded on an empty view behind an invisible chip.
    const activeFilter = filter != null && (counts.get(filter) ?? 0) > 0 ? filter : null;

    const inView = activeFilter ? unread.filter((item) => item.topic === activeFilter) : unread;
    const visible = {
      attention: inView.filter((item) => item.tier === "attention"),
      rest: inView.filter((item) => item.tier === "rest"),
    };

    return { chips, activeFilter, visible };
  }, [items, readIds, filter]);

  const injectCard = useCallback((tier: StreamTier = "attention") => {
    setItems((prev) => [makeCard(tier), ...prev]);
  }, []);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const setFilter = useCallback((topic: StreamTopic | null) => {
    // Clicking the active chip clears it — single-select toggle.
    setFilterState((prev) => (prev === topic ? null : topic));
  }, []);

  const toggleLoading = useCallback(() => setLoading((prev) => !prev), []);

  const reset = useCallback(() => {
    setItems(SEED);
    setReadIds(new Set());
    setFilterState(null);
    setLoading(false);
  }, []);

  return {
    visible: derived.visible,
    chips: derived.chips,
    filter: derived.activeFilter,
    loading,
    isEmpty:
      !loading && derived.visible.attention.length === 0 && derived.visible.rest.length === 0,
    injectCard,
    markRead,
    markAllRead,
    setFilter,
    toggleLoading,
    reset,
  };
}
