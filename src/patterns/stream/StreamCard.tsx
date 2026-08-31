import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { streamCard } from "./stream.variants";
import type { StreamSource } from "./types";

export type StreamCardProps = {
  /** Optional generic header: leading glyph, truncating title, caption. */
  source?: StreamSource;
  /** Makes the header's icon+title an open target (adds the trailing arrow). */
  onOpen?: () => void;
  /** Renders the standard dismiss accessory (double-check, hover-revealed). */
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Extra header accessory, same reveal rules as the dismiss button. */
  accessory?: React.ReactNode;
  className?: string;
  /** Card body — arbitrary host content. */
  children: React.ReactNode;
};

/**
 * The generic card shell: an Oreo surface, an optional header, a
 * hover-revealed accessory row, and a content slot. Everything a host puts in
 * `children` gets the card-level hover scope (`group/stream-card`) for free.
 */
export function StreamCard({
  source,
  onOpen,
  onDismiss,
  dismissLabel = "Mark read",
  accessory,
  className,
  children,
}: StreamCardProps) {
  const slots = streamCard();
  const hasAccessories = Boolean(onDismiss ?? accessory);

  const identity = source && (
    <>
      {source.icon && (
        <span className={slots.headerIcon()}>
          <Icon name={source.icon} size="sm" />
        </span>
      )}
      <span className={slots.title()}>{source.title}</span>
      {onOpen && (
        <span className={slots.titleArrow()} aria-hidden>
          <Icon name="arrow-up-right" size="sm" />
        </span>
      )}
    </>
  );

  return (
    <section className={cn(slots.root(), className)}>
      {(source || hasAccessories) && (
        <header className={slots.header()}>
          {source &&
            (onOpen ? (
              <button type="button" className={slots.headerOpen()} onClick={onOpen}>
                {identity}
              </button>
            ) : (
              identity
            ))}
          {source?.meta && <span className={slots.meta()}>{source.meta}</span>}
          {hasAccessories && (
            // stopPropagation so accessory clicks never fall through to any
            // click surface a host wires around or under the card.
            <span className={slots.accessory()} onClick={(e) => e.stopPropagation()}>
              {accessory}
              {onDismiss && (
                <IconButton
                  aria-label={dismissLabel}
                  type="tertiary"
                  size="sm"
                  icon={<Icon name="checks" size="sm" />}
                  onClick={onDismiss}
                />
              )}
            </span>
          )}
        </header>
      )}
      <div className={slots.body()}>{children}</div>
    </section>
  );
}
