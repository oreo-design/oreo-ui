import { useRef, useState, type ReactNode } from "react";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuCheckboxItem,
  MenuSeparator,
  MenuItem,
} from "@/components/menu";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
export type MultiSelectOption = {
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
};
export type MultiSelectMenuProps = {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  label?: string;
  heading?: string;
  icon?: IconName;
  disabled?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  footer?: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
};
/** Controlled selection with independent toggles and an anchored, keyboard-accessible popup. */
export function MultiSelectMenu({
  options,
  value,
  onValueChange,
  label = "Event category",
  heading = "Meeting category",
  icon = "hash",
  disabled = false,
  side = "bottom",
  align = "start",
  open,
  onOpenChange,
  defaultOpen = false,
  footer,
  onEdit,
  editLabel = "Edit categories",
  className,
}: MultiSelectMenuProps) {
  const container = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [keyboard, setKeyboard] = useState(false);
  const selected = [...new Set(value)].filter((id) =>
    options.some((option) => option.value === id),
  );
  const changeOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div ref={container}>
      <Menu open={open ?? internalOpen} onOpenChange={changeOpen}>
        <MenuTrigger
          disabled={disabled}
          aria-label={`${label}, ${selected.length} selected`}
          onKeyDown={() => setKeyboard(true)}
          onPointerDown={() => setKeyboard(false)}
          render={
            <button
              type="button"
              className={cn(
                "group flex w-full items-center gap-3 rounded-card-small px-3 py-3 text-left text-sm font-medium text-text-primary outline-none hover:bg-state-hover focus-visible:ring-2 focus-visible:ring-accent disabled:text-text-disabled data-[popup-open]:bg-state-press",
                className,
              )}
            />
          }
        >
          <Icon
            name={icon}
            className="shrink-0 text-text-secondary group-disabled:text-text-disabled"
          />
          <span className="min-w-0 flex-1 break-words">{label}</span>
          <span
            aria-hidden
            className="grid size-6 shrink-0 place-items-center rounded-full border border-border-subtle bg-bg-base text-xs tabular-nums text-status-success group-disabled:text-text-disabled"
          >
            {selected.length}
          </span>
          <Icon
            name="chevron-right"
            size="sm"
            className="text-text-tertiary group-disabled:text-text-disabled"
          />
        </MenuTrigger>
        <MenuPopup
          container={container}
          collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "end" }}
          side={side}
          align={align}
          sideOffset={12}
          className={cn(
            "w-72 max-w-[calc(100vw-2rem)] max-h-[var(--available-height)] overflow-y-auto",
            keyboard && "transition-none",
          )}
        >
          <p className="px-3 pb-2 pt-3 text-xs font-medium text-text-tertiary">
            {heading}
          </p>
          {options.length ? (
            options.map((option) => (
              <MenuCheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                disabled={option.disabled}
                icon={option.icon && <Icon name={option.icon} />}
                onCheckedChange={(checked) =>
                  onValueChange(
                    checked
                      ? [...selected, option.value]
                      : selected.filter((id) => id !== option.value),
                  )
                }
              >
                {option.label}
              </MenuCheckboxItem>
            ))
          ) : (
            <p
              role="status"
              className="px-4 py-6 text-center text-sm text-text-secondary"
            >
              No categories yet.
            </p>
          )}
          {(onEdit || footer) && <MenuSeparator />}
          {footer}
          {onEdit && (
            <>
              <p className="px-3 py-2 text-xs text-text-tertiary">Settings</p>
              <MenuItem
                icon={<Icon name="sliders" />}
                trailing={<Icon name="arrow-up-right" size="sm" />}
                onClick={onEdit}
              >
                {editLabel}
              </MenuItem>
            </>
          )}
        </MenuPopup>
      </Menu>
    </div>
  );
}
