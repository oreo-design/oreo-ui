import { useRef, useState, type ReactNode } from "react";
import { Menu } from "@base-ui-components/react/menu";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import "./inline-quick-menu.css";

export type InlineQuickMenuOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export const visibilityOptions: readonly InlineQuickMenuOption[] = [
  { value: "private", label: "Private", icon: <Icon name="lock" size="sm" weight="fill" /> },
  { value: "public", label: "Public", icon: <Icon name="globe" size="sm" /> },
];

export type InlineQuickMenuProps = {
  options?: readonly InlineQuickMenuOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/** A compact pick-one menu. Base UI owns focus, arrow navigation and dismissal. */
export function InlineQuickMenu({
  options = visibilityOptions, value, defaultValue = "private", onValueChange,
  open, defaultOpen = false, onOpenChange, label = "Visibility", disabled = false, className,
}: InlineQuickMenuProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [keyboard, setKeyboard] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.value === (value ?? internalValue));
  const isOpen = open ?? internalOpen;

  return <div ref={container} className={cn("oreo-inline-quick-menu inline-flex", className)} data-keyboard={keyboard || undefined}>
    <Menu.Root orientation="horizontal" modal={false} open={isOpen} onOpenChange={(next, details) => {
      if (details.event.type.startsWith("key")) setKeyboard(true);
      setInternalOpen(next);
      onOpenChange?.(next);
    }}>
      <Menu.Trigger
        disabled={disabled || options.every(option => option.disabled)}
        aria-label={`${label}: ${selected?.label ?? "Choose"}`}
        onPointerDown={() => setKeyboard(false)}
        onKeyDown={() => setKeyboard(true)}
        className="oreo-quick-trigger inline-flex h-11 max-w-full items-center gap-2 rounded-capsule bg-bg-elevated px-4 text-sm font-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected?.icon && <span aria-hidden className="shrink-0 text-text-tertiary">{selected.icon}</span>}
        <span className="truncate">{selected?.label ?? "Choose"}</span>
        <span aria-hidden className="oreo-quick-chevron shrink-0 text-text-tertiary"><Icon name="chevron-down" size="sm" weight="bold" /></span>
      </Menu.Trigger>
      {/* Keep the portal in the local theme scope, including standalone docs. */}
      <Menu.Portal container={container}>
        <Menu.Positioner side="top" align="center" sideOffset={12} className="z-50 max-w-[calc(100vw-2rem)] outline-none">
          <Menu.Popup aria-label={label} className="oreo-quick-popup rounded-capsule border-4 border-bg-elevated bg-bg-base text-text-secondary outline-none">
            <Menu.Arrow className="oreo-quick-arrow" />
            <Menu.RadioGroup value={selected?.value ?? ""} onValueChange={next => {
              if (value === undefined) setInternalValue(next);
              onValueChange?.(next);
            }} className="flex max-w-full overflow-x-auto rounded-capsule">
              {options.map(option => <Menu.RadioItem key={option.value} value={option.value} label={option.label} disabled={option.disabled} closeOnClick
                className="oreo-quick-option flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 border-r-4 border-bg-elevated px-3 text-sm font-medium whitespace-nowrap outline-none last:border-r-0 data-[checked]:text-text-primary data-[highlighted]:bg-state-press data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40">
                {option.icon && <span aria-hidden className="shrink-0">{option.icon}</span>}
                {option.label}
              </Menu.RadioItem>)}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>;
}
