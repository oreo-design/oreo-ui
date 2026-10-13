import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/menu";

/**
 * Row-sized controls. The Select borrows the library Menu for its popup so a
 * settings page and an app's menus share one floating surface; the segmented
 * control is the quiet text-button strip from the reference apps.
 */

export function SettingsSelect({
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
  responsive = false,
  disabled = false,
}: {
  responsive?: boolean;
  disabled?: boolean;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  "aria-label": string;
}) {
  return (
    <Menu>
      <MenuTrigger
        disabled={disabled}
        aria-label={ariaLabel}
        className="oreo-squircle [--squircle-radius:var(--radius-control)] flex h-8 items-center gap-1.5 border-[0.5px] border-[var(--color-border-default)] px-3 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-state-hover)] data-[popup-open]:bg-[var(--color-state-press)]"
      >
        {value}
        <Icon name="chevron-down" size="sm" weight="light" className="text-[var(--color-text-tertiary)]" />
      </MenuTrigger>
      <MenuPopup align="end" className={responsive ? "max-w-[calc(100vw-2rem)]" : undefined}>
        {options.map((option) => (
          <MenuItem className={responsive ? "[&>span:first-child]:whitespace-normal [&>span:first-child]:break-words" : undefined} key={option} selected={option === value} onClick={() => onChange(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

export function SettingsSegmented<T extends string>({
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  "aria-label": string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex items-center gap-1">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={cn(
              "oreo-squircle [--squircle-radius:var(--radius-control)] h-7 px-3 text-[13px] font-medium transition-colors",
              active
                ? "bg-[var(--color-state-press)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
