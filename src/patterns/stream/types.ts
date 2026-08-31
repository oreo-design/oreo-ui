import type { ReactNode } from "react";
import type { IconName } from "@/components/icon";

/**
 * Inbox stream — domain types.
 *
 * The framework deliberately knows nothing about what lives inside a card:
 * `content` is an opaque ReactNode slot, so any host component (a digest, a
 * plan, a chart) drops into the shell unchanged. The stream only owns the
 * *around*: tiers, filtering, dismissal, and the enter/exit choreography.
 */

/**
 * Two tiers, by urgency. "attention" renders first and is meant for items that
 * need action; "rest" is everything else, under a small heading.
 */
export type StreamTier = "attention" | "rest";

/** A filter-chip bucket. Free-form so hosts can invent their own taxonomy. */
export type StreamTopic = string;

export type StreamSource = {
  /** Leading glyph in the card header — e.g. `hash` for a channel. */
  icon?: IconName;
  /** Card title. Truncates; the trailing open-arrow survives truncation. */
  title: string;
  /** Caption after the title — participants, a count, a time. */
  meta?: string;
};

export type StreamItem = {
  /** Unique and stable — it keys the card's enter/exit animation. */
  id: string;
  tier: StreamTier;
  topic: StreamTopic;
  /** Optional generic header rendered by the card shell. */
  source?: StreamSource;
  /** Card body — arbitrary host content. The framework never looks inside. */
  content: ReactNode;
  /**
   * Opt long content into the height clamp (collapse + fade + expand).
   * `true` uses the defaults (`max(320px, 70vh)` + 96px slack); pass an
   * object to tune them per card.
   */
  clamp?: boolean | { minPx?: number; vhRatio?: number; slack?: number };
};
