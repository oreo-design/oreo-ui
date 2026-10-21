import * as React from "react";
import { cn } from "@/lib/cn";
import { ICON_GLYPHS, LUCIDE_STROKE, useIconLibrary } from "./library";
import type { IconGlyph, IconWeight } from "./types";
import type { IconName } from "./names";

/**
 * Oreo UI Icon — one adapter over whichever icon set is active.
 *
 * Call sites name the *meaning* of a glyph, never a library's spelling of it:
 *
 *   <Icon name="chevron-down" weight="bold" />
 *
 * The name resolves through the registry using the library from
 * `IconLibraryProvider` (Lucide by default), so swapping the whole system
 * over to Lucide is one prop on one provider.
 *
 * Sizing and color are driven by Tailwind tokens (via `currentColor`) rather
 * than either library's numeric `size`/`color` props, so icons inherit color
 * from their container. Inside surfaces like `IconButton` the parent's
 * `[&_svg]:size-*` rule wins, so an `<Icon>` placed there scales automatically.
 */
const sizeMap = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

export type IconSize = keyof typeof sizeMap;

type IconBaseProps = {
  /** Token size; ignored when a parent sets `[&_svg]:size-*`. */
  size?: IconSize;
  /** Semantic weight — the lever for visual hierarchy (regular/bold/fill…). */
  weight?: IconWeight;
  className?: string;
  /**
   * Accessible name. When omitted the icon is hidden from assistive tech
   * (decorative), which is the right default inside labelled buttons.
   */
  "aria-label"?: string;
} & Omit<
  React.SVGProps<SVGSVGElement>,
  "ref" | "className" | "aria-label" | "width" | "height" | "color"
>;

export type IconProps = IconBaseProps &
  (
    | { name: IconName; icon?: never }
    /**
     * Escape hatch for a glyph outside the registry. It is handed the active
     * library's props, so pass one from the library you're actually running.
     */
    | { icon: IconGlyph; name?: never }
  );

export function Icon({
  name,
  icon,
  size = "md",
  weight,
  className,
  "aria-label": ariaLabel,
  ...rest
}: IconProps) {
  const library = useIconLibrary();
  const Glyph = icon ?? ICON_GLYPHS[library][name];

  // Phosphor draws a weight; Lucide strokes one. Only ever pass the prop the
  // active library understands — the other would land on the DOM as junk.
  const weightProps =
    library === "phosphor"
      ? { weight }
      : { strokeWidth: weight ? LUCIDE_STROKE[weight] : undefined };

  return (
    <Glyph
      {...weightProps}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(sizeMap[size], className)}
      {...rest}
    />
  );
}
