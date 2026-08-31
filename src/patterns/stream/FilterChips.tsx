import { Chip, ChipGroup } from "@/components/chip";
import { cn } from "@/lib/cn";
import { stream } from "./stream.variants";
import type { StreamFilterChip } from "./useStream";
import type { StreamTopic } from "./types";

export type FilterChipsProps = {
  chips: StreamFilterChip[];
  active: StreamTopic | null;
  /** Receives the clicked topic; the toggle-off lives in the state layer. */
  onChange: (topic: StreamTopic) => void;
  className?: string;
};

/**
 * Single-select filter row. Chips carry their would-be result count as a
 * quieter trailing figure; topics with nothing to show don't render at all,
 * so the row disappears entirely on an empty stream.
 */
export function FilterChips({ chips, active, onChange, className }: FilterChipsProps) {
  const slots = stream();
  if (chips.length === 0) return null;
  return (
    <ChipGroup className={className}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          size="sm"
          selected={active === chip.id}
          onClick={() => onChange(chip.id)}
        >
          {chip.label}
          <span className={cn(slots.filterCount())}>{chip.count}</span>
        </Chip>
      ))}
    </ChipGroup>
  );
}
