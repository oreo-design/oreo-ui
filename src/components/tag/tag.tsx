import { Icon } from "@/components/icon";
import * as React from "react";
import { cn } from "@/lib/cn";
import { tag, type TagVariants } from "./tag.variants";

export type TagProps = {
  /** Leading icon, typically an <Icon icon={…} size="sm" />. */
  icon?: React.ReactNode;
  /** Prepend a "#" to the label (the canonical keyword-tag look). */
  hash?: boolean;
  /** When provided, renders a trailing remove button. */
  onRemove?: () => void;
  /** Accessible label for the remove button. Defaults to "Remove {children}". */
  removeLabel?: string;
} & TagVariants &
  React.ComponentPropsWithoutRef<"span">;

export function Tag({
  color,
  size,
  icon,
  hash = false,
  onRemove,
  removeLabel,
  children,
  className,
  ...rest
}: TagProps) {
  return (
    <span className={cn(tag({ color, size }), className)} {...rest}>
      {icon}
      <span>
        {hash && <span className="opacity-70">#</span>}
        {children}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "tag"}`}
          className="-mr-0.5 ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none [&_svg]:size-3"
        >
          <Icon name="x" size="sm" />
        </button>
      )}
    </span>
  );
}
