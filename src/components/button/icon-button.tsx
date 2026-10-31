import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { motion } from "motion/react";
import { tv } from "@/lib/tv";
import { cn } from "@/lib/cn";
import { surfaceBase, typeVariants, dangerCompounds, disabledCompounds } from "./surface";
import { useButtonPress, type ButtonPressOptions } from "./use-button-press";

/**
 * Oreo UI Icon Button — a square action with only an icon.
 *
 * Reuses the shared button surface (`surface.ts`), adds a square size scale,
 * a `shape` (capsule vs. rounded-rect), and an optional `floating` elevation.
 * Matches the Figma icon-button: 32px / 20px icon at `md`.
 */
export const iconButton = tv({
  base: [...surfaceBase],
  variants: {
    type: typeVariants,
    size: {
      sm: "size-7 [&_svg]:size-4",
      md: "size-8 [&_svg]:size-5",
      lg: "size-10 [&_svg]:size-6",
    },
    shape: {
      rounded: "rounded-[var(--radius-capsule)]",
      rectangle: "rounded-[var(--radius-control)]",
    },
    floating: { true: "shadow-[0_6px_12px_rgba(0,0,0,0.06)]", false: "" },
    danger: { true: "", false: "" },
    disabled: { true: "text-[var(--color-text-disabled)]", false: "" },
  },
  compoundVariants: [...dangerCompounds, ...disabledCompounds],
  defaultVariants: {
    type: "primary",
    size: "md",
    shape: "rounded",
    floating: false,
    danger: false,
    disabled: false,
  },
});

type IconButtonVariants = Parameters<typeof iconButton>[0];

export type IconButtonProps = {
  /** Required for accessibility — an icon-only button needs a name. */
  "aria-label": string;
  icon: React.ReactNode;
  /** Replaces the renderer; custom elements own their native type and motion. */
  render?: useRender.RenderProp;
  /** Native type for the default button renderer. Visual emphasis remains `type`. */
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
} & ButtonPressOptions & IconButtonVariants &
  Omit<React.ComponentPropsWithoutRef<"button">, "type" | "children">;

export function IconButton({
  render,
  htmlType = "button",
  type,
  size,
  shape,
  floating,
  danger,
  disabled,
  icon,
  className,
  bounce,
  duration,
  tapScale,
  ...rest
}: IconButtonProps) {
  const press = useButtonPress({ disabled, bounce, duration, tapScale });
  const defaultRender = (
    <motion.button
      type={htmlType}
      {...press}
    />
  );

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(iconButton({ type, size, shape, floating, danger, disabled }), className),
      disabled: Boolean(disabled),
      "data-disabled": disabled ? "" : undefined,
      ...rest,
      children: icon,
    },
  });
}
