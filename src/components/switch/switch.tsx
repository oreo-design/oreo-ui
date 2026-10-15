import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { cn } from "@/lib/cn";
import { switchStyles } from "./switch.variants";
import "./switch.stretch.css";

const slots = switchStyles();

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** Optional liquid thumb travel. The existing default surface is unchanged. */
  variant?: "default" | "stretch";
  /** Required unless named with aria-labelledby or Base UI Field.Label. */
  "aria-label"?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
  "checked" | "defaultChecked" | "onCheckedChange" | "disabled" | "className"
>;

/** Base UI owns state, form integration, disabled behavior and keyboard input. */
export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  readOnly,
  className,
  variant = "default",
  onClickCapture,
  onKeyDownCapture,
  onBlurCapture,
  ...rest
}: SwitchProps) {
  const [pointer, setPointer] = React.useState(false);
  return (
    <BaseSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(next, details) => {
        // The installed Base UI beta allows a wrapping label to activate its
        // hidden input even when the root is read-only. Cancel at the state owner.
        if (readOnly) {
          details.cancel();
          return;
        }
        // Label activation clicks the hidden native input, outside the visual root.
        if (
          variant === "stretch" &&
          "detail" in details.event &&
          Number(details.event.detail) > 0
        )
          setPointer(true);
        onCheckedChange?.(next);
      }}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        slots.root(),
        variant === "stretch" && "oreo-switch-stretch",
        className,
      )}
      {...rest}
      data-pointer-motion={pointer ? "true" : "false"}
      onClickCapture={(event) => {
        if (variant === "stretch") setPointer(event.detail > 0);
        onClickCapture?.(event);
      }}
      onKeyDownCapture={(event) => {
        if (variant === "stretch") setPointer(false);
        onKeyDownCapture?.(event);
      }}
      onBlurCapture={(event) => {
        if (variant === "stretch") setPointer(false);
        onBlurCapture?.(event);
      }}
    >
      {variant === "stretch" ? (
        <BaseSwitch.Thumb
          className="oreo-switch-stretch-tail"
          aria-hidden="true"
        >
          <span className="oreo-switch-stretch-head" />
        </BaseSwitch.Thumb>
      ) : (
        <BaseSwitch.Thumb className={slots.thumb()} />
      )}
    </BaseSwitch.Root>
  );
}
