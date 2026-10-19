import { useRef, useState, type ReactNode } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "@/components/menu";
import "./data-operations.css";

export type FilterValues = Record<string, string[]>;
export type FilterGroup = {
  id: string;
  label: string;
  display?: "checks" | "pills" | "select";
  options: { value: string; label: string; count?: number; mark?: string }[];
};
export const filterCount = (value: FilterValues) =>
  Object.values(value).reduce((n, values) => n + values.length, 0);
/** Edits a local draft; dismissing the popover never changes the applied filters. */
export function DataFilterPopover({
  groups,
  value,
  onApply,
  resultCount,
  label = "Filter",
}: {
  groups: FilterGroup[];
  value: FilterValues;
  onApply: (value: FilterValues) => void;
  resultCount?: (draft: FilterValues) => number;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState<FilterValues>({});
  const changeOpen = (next: boolean) => {
    if (next)
      setDraft(
        Object.fromEntries(
          Object.entries(value).map(([key, values]) => [key, [...values]]),
        ),
      );
    setOpen(next);
  };
  const toggle = (key: string, option: string) =>
    setDraft((old) => ({
      ...old,
      [key]: old[key]?.includes(option)
        ? old[key].filter((v) => v !== option)
        : [...(old[key] ?? []), option],
    }));
  const count = filterCount(value),
    total = resultCount?.(draft);
  return (
    <div ref={host} className="data-operations">
      <Popover.Root open={open} onOpenChange={changeOpen}>
        <Popover.Trigger
          render={
            <Button
              type="secondary"
              tapScale={1}
              leadingIcon={<Icon name="sliders" size="sm" />}
            />
          }
        >
          {label}
          {count > 0 ? ` · ${count}` : ""}
        </Popover.Trigger>
        <Popover.Portal container={host}>
          <Popover.Positioner
            side="bottom"
            align="end"
            sideOffset={8}
            collisionPadding={12}
            positionMethod="fixed"
            className="z-50 outline-none"
          >
            <Popover.Popup className="data-filter-popup" finalFocus>
              <header>
                <Popover.Title>Filters</Popover.Title>
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => setDraft({})}
                >
                  Clear all
                </Button>
              </header>
              <Popover.Description className="sr-only">
                Choose filters, then apply. Dismissing keeps your previous
                filters.
              </Popover.Description>
              <div className="data-filter-body">
                {groups.map((group) => (
                  <fieldset key={group.id}>
                    <legend>{group.label}</legend>
                    {group.display === "select" ? (
                      <select
                        aria-label={group.label}
                        value={draft[group.id]?.[0] ?? ""}
                        onChange={(e) =>
                          setDraft((old) => ({
                            ...old,
                            [group.id]: e.target.value ? [e.target.value] : [],
                          }))
                        }
                      >
                        <option value="">Anyone</option>
                        {group.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className={
                          group.display === "pills"
                            ? "data-filter-pills"
                            : "data-filter-checks"
                        }
                      >
                        {group.options.map((option) => {
                          const selected =
                            draft[group.id]?.includes(option.value) ?? false;
                          return group.display === "pills" ? (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggle(group.id, option.value)}
                            >
                              {option.mark && (
                                <span aria-hidden>{option.mark}</span>
                              )}
                              {option.label}
                            </button>
                          ) : (
                            <label key={option.value}>
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggle(group.id, option.value)}
                              />
                              <span>{option.label}</span>
                              {option.count !== undefined && (
                                <small>{option.count}</small>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </fieldset>
                ))}
              </div>
              <footer>
                <span aria-live="polite">
                  {filterCount(draft)} selected
                  {total !== undefined && ` · ${total} results`}
                </span>
                <Button
                  tapScale={1}
                  onClick={() => {
                    onApply(draft);
                    setOpen(false);
                  }}
                >
                  Apply
                </Button>
              </footer>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
export type DataSort = { key: string; direction: "asc" | "desc" };
export type SortOption = {
  key: string;
  label: string;
  icon?: IconName;
  ascending?: string;
  descending?: string;
};
export function DataSortMenu({
  options,
  value,
  onChange,
}: {
  options: SortOption[];
  value: DataSort;
  onChange: (value: DataSort) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    option = options.find((o) => o.key === value.key);
  return (
    <div ref={host} className="data-operations">
      <Menu>
        <MenuTrigger
          render={
            <Button
              type="secondary"
              tapScale={1}
              leadingIcon={<Icon name="sort-descending" size="sm" />}
              trailingIcon={<Icon name="chevron-down" size="sm" />}
            />
          }
          aria-label={`Sort: ${option?.label ?? "Choose field"}`}
        >
          {option?.label ?? "Sort"}
        </MenuTrigger>
        <MenuPopup container={host} align="end" className="data-action-menu">
          <p className="data-menu-label">Sort by</p>
          {options.map((o) => (
            <MenuItem
              key={o.key}
              icon={o.icon && <Icon name={o.icon} />}
              selected={value.key === o.key}
              aria-current={value.key === o.key ? "true" : undefined}
              onClick={() => onChange({ ...value, key: o.key })}
            >
              {o.label}
            </MenuItem>
          ))}
          <MenuSeparator />
          <p className="data-menu-label">Order</p>
          <MenuItem
            icon={<Icon name="arrow-down" />}
            selected={value.direction === "desc"}
            aria-current={value.direction === "desc" ? "true" : undefined}
            onClick={() => onChange({ ...value, direction: "desc" })}
          >
            {option?.descending ?? "Descending"}
          </MenuItem>
          <MenuItem
            icon={<Icon name="arrow-up" />}
            selected={value.direction === "asc"}
            aria-current={value.direction === "asc" ? "true" : undefined}
            onClick={() => onChange({ ...value, direction: "asc" })}
          >
            {option?.ascending ?? "Ascending"}
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  );
}
export type DataAction = {
  id: string;
  label: string;
  icon?: IconName;
  danger?: boolean;
  disabled?: boolean;
  selected?: boolean;
  separatorBefore?: boolean;
  children?: DataAction[];
};
/** Shared row/bulk action menu. Nested action IDs are passed unchanged to the host. */
export function RowActionMenu({
  label,
  actions,
  onAction,
  trigger,
}: {
  label: string;
  actions: DataAction[];
  onAction: (id: string) => void;
  trigger?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const items = (list: DataAction[]): ReactNode =>
    list.map((action) => (
      <div key={action.id}>
        {action.separatorBefore && <MenuSeparator />}
        {action.children ? (
          <MenuSubmenu>
            <MenuSubmenuTrigger
              icon={action.icon && <Icon name={action.icon} />}
              disabled={action.disabled}
            >
              {action.label}
            </MenuSubmenuTrigger>
            <MenuPopup
              container={host}
              side="right"
              align="start"
              className="data-action-menu"
            >
              {items(action.children)}
            </MenuPopup>
          </MenuSubmenu>
        ) : (
          <MenuItem
            disabled={action.disabled}
            selected={action.selected}
            aria-current={action.selected ? "true" : undefined}
            icon={action.icon && <Icon name={action.icon} />}
            className={action.danger ? "data-danger" : undefined}
            onClick={() => onAction(action.id)}
          >
            {action.label}
          </MenuItem>
        )}
      </div>
    ));
  return (
    <div ref={host} className="data-operations">
      <Menu>
        <MenuTrigger
          aria-label={label}
          render={
            trigger ? (
              <Button type="secondary" tapScale={1} />
            ) : (
              <IconButton
                aria-label={label}
                type="tertiary"
                size="sm"
                tapScale={1}
                icon={<Icon name="ellipsis" />}
              />
            )
          }
        >
          {trigger}
        </MenuTrigger>
        <MenuPopup container={host} align="end" className="data-action-menu">
          {items(actions)}
        </MenuPopup>
      </Menu>
    </div>
  );
}
export function BulkActionBar({
  count,
  total,
  onSelectAll,
  onClear,
  children,
}: {
  count: number;
  total: number;
  onSelectAll: () => void;
  onClear: () => void;
  children: ReactNode;
}) {
  if (!count) return null;
  return (
    <div
      className="data-bulk-bar"
      role="region"
      aria-label="Selected row actions"
    >
      <strong aria-live="polite">
        <Icon name="check" size="sm" />
        {count} selected
      </strong>
      {count < total && (
        <Button type="tertiary" size="sm" tapScale={1} onClick={onSelectAll}>
          Select all {total}
        </Button>
      )}
      <div className="data-bulk-actions">{children}</div>
      <IconButton
        type="tertiary"
        size="sm"
        tapScale={1}
        icon={<Icon name="x" />}
        aria-label="Clear selection"
        onClick={onClear}
      />
    </div>
  );
}
