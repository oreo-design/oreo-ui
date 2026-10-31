import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { button, type ButtonVariants } from "./button.variants";
import { useButtonPress, type ButtonPressOptions } from "./use-button-press";

export type ButtonProps = {
  /** Replaces the renderer; custom elements own their native type and motion. */
  render?: useRender.RenderProp;
  /** Native type for the default button renderer. Visual emphasis remains `type`. */
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
} & ButtonPressOptions & ButtonVariants &
  Omit<React.ComponentPropsWithoutRef<"button">, "type">;

export function Button({
  render,
  htmlType = "button",
  type,
  size,
  danger,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  className,
  bounce,
  duration,
  tapScale,
  ...rest
}: ButtonProps) {
  const press = useButtonPress({ disabled, bounce, duration, tapScale });
  // Default element is a motion.button so the press uses a real spring.
  const defaultRender = (
    <motion.button
      type={htmlType}
      {...press}
    />
  );

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(button({ type, size, danger, disabled }), className),
      disabled: Boolean(disabled),
      "data-disabled": disabled ? "" : undefined,
      ...rest,
      children: (
        <>
          {leadingIcon}
          <span>{children}</span>
          {trailingIcon}
        </>
      ),
    },
  });
}
