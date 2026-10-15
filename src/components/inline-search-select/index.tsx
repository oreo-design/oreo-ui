import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Combobox } from "@base-ui-components/react/combobox";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import "./inline-search-select.css";

export type InlineSearchOption = {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: ReactNode;
};
export type InlineSearchSelectProps = {
  options: readonly InlineSearchOption[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};
export function InlineSearchSelect({
  options,
  value,
  onValueChange,
  label,
  placeholder = "Search…",
  disabled,
  loading,
  error,
  onRetry,
}: InlineSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  const selected = options.find((o) => o.value === value) ?? null;
  const items = loading || error ? [] : options;
  return (
    <div
      ref={host}
      className="oreo-inline-search"
      data-keyboard={keyboard || undefined}
      onPointerDownCapture={() => setKeyboard(false)}
      onKeyDownCapture={() => setKeyboard(true)}
    >
      <Combobox.Root<InlineSearchOption | null>
        items={items}
        value={selected}
        onValueChange={(next) => {
          if (next) onValueChange(next.value);
        }}
        itemToStringLabel={(item) => item?.label ?? ""}
        isItemEqualToValue={(a, b) => a?.value === b?.value}
        filter={(item, q) =>
          `${item?.label ?? ""} ${item?.description ?? ""}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())
        }
        open={open}
        onOpenChange={(next, details) => {
          if (details.event.type.startsWith("key")) setKeyboard(true);
          setOpen(next);
          setQuery("");
        }}
        inputValue={query}
        onInputValueChange={setQuery}
        autoHighlight
      >
        <div ref={anchor} className="iss-anchor">
          <span className="iss-icon" aria-hidden>
            {selected?.icon ?? <Icon name="search" size="sm" />}
          </span>
          <Combobox.Trigger
            ref={trigger}
            disabled={disabled}
            aria-label={`${label}: ${selected?.label ?? "Choose"}`}
            className="iss-trigger"
            style={{ display: open ? "none" : undefined }}
          >
            <span>{selected?.label ?? "Choose"}</span>
            <Icon name="chevron-down" size="sm" />
          </Combobox.Trigger>
          <Combobox.Input
            ref={input}
            disabled={disabled}
            aria-label={`Search ${label.toLowerCase()}`}
            placeholder={placeholder}
            className="iss-input"
            style={{ display: open ? undefined : "none" }}
          />
        </div>
        <Combobox.Portal container={host}>
          <Combobox.Positioner
            anchor={anchor}
            positionMethod="fixed"
            side="bottom"
            align="end"
            sideOffset={8}
            className="z-50 outline-none"
          >
            <Combobox.Popup
              initialFocus={false}
              finalFocus={trigger}
              className="iss-popup"
            >
              {loading ? (
                <div
                  role="status"
                  aria-label="Loading options"
                  className="iss-skeletons"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i}>
                      <span />
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <AgentWorkspaceState
                  error
                  title="Couldn’t load options"
                  description={error}
                  actionLabel={onRetry ? "Try again" : undefined}
                  onAction={onRetry}
                />
              ) : (
                <>
                  <Combobox.Empty>
                    <AgentWorkspaceState
                      title="No matches"
                      description="Try a different name or symbol."
                    />
                  </Combobox.Empty>
                  <Combobox.List className="iss-list">
                    {(item: InlineSearchOption) => (
                      <Combobox.Item
                        key={item.value}
                        value={item}
                        className="iss-option"
                      >
                        <span aria-hidden className="iss-option-icon">
                          {item.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">
                            {item?.label ?? ""}
                          </span>
                          <span className="block text-xs text-text-tertiary">
                            {item.description}
                          </span>
                        </span>
                        <span className="text-xs text-text-secondary">
                          {item.meta}
                        </span>
                        <Combobox.ItemIndicator>
                          <Icon name="check" size="sm" />
                        </Combobox.ItemIndicator>
                      </Combobox.Item>
                    )}
                  </Combobox.List>
                </>
              )}
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}
