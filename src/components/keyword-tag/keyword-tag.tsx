import { CloseGlyph } from "@/components/icon";
import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { pressSpring } from "@/lib/motion";
import { keywordTag, type KeywordTagVariants } from "./keyword-tag.variants";

export type KeywordTagProps = {
  /** Leading 16px glyph — a brand `<img>` or an `<Icon>`. */
  icon?: React.ReactNode;
  /** Thumbnail URL — switches to the referenced-image form. */
  src?: string;
  /** When set, hover swaps the leading slot for an × that removes the tag. */
  onRemove?: () => void;
} & KeywordTagVariants &
  React.ComponentPropsWithoutRef<"span">;

/**
 * Inline keyword chip for composers and context rows ("Figma", "Create
 * Image"). Extends native `<span>` props, so `onClick` passes through; the
 * hover × is its own button and never triggers the tag's own click.
 */
export function KeywordTag({ icon, src, color, onRemove, className, children, ...rest }: KeywordTagProps) {
  const media = src != null;
  const removable = onRemove != null;
  const slots = keywordTag({ color, media, removable });
  const label = typeof children === "string" ? children : undefined;
  const removeLabel = label ? `Remove ${label}` : "Remove tag";
  const hasLeading = media || icon != null || removable;

  return (
    <span className={cn(slots.root(), className)} {...rest}>
      {hasLeading && (
        <span className={slots.leading()}>
          {media ? (
            <span className={slots.thumb()}>
              <img src={src} alt="" />
            </span>
          ) : icon != null ? (
            <span className={slots.icon()}>{icon}</span>
          ) : null}
          {removable && (
            <motion.button
              type="button"
              aria-label={removeLabel}
              whileTap={{ scale: 0.88 }}
              transition={pressSpring}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              className={slots.ghost()}
            >
              <CloseGlyph className="size-[14px]" />
            </motion.button>
          )}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
