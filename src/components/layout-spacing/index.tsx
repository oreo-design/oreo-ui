import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { spacingVariables, type SpacingValues } from "./model";
import "./layout-spacing.css";
export * from "./model";

type BoxProps = HTMLAttributes<HTMLDivElement>;
/** Scoped composition tokens; does not change any global component defaults. */
export function LayoutScope({
  values,
  className,
  style,
  ...props
}: BoxProps & { values?: SpacingValues }) {
  return (
    <div
      className={cn("oreo-layout", className)}
      style={
        {
          ...(values ? spacingVariables(values) : {}),
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
export function LayoutSection({ className, ...props }: BoxProps) {
  return <div className={cn("oreo-layout-sections", className)} {...props} />;
}
export function LayoutGrid({ className, ...props }: BoxProps) {
  return <div className={cn("oreo-layout-grid", className)} {...props} />;
}
export function LayoutCard({ className, ...props }: BoxProps) {
  return <div className={cn("oreo-layout-card", className)} {...props} />;
}
