import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Combobox } from "@base-ui-components/react/combobox";
import { Icon, type IconName } from "@/components/icon";
import { Shortcut } from "@/components/shortcut";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import "./command-search.css";

export type WorkspaceCommand = {
  id: string;
  label: string;
  keywords?: string;
  icon?: IconName;
  disabled?: boolean;
};
export type CommandGroup = { label: string; items: WorkspaceCommand[] };
export type CommandSearchProps = {
  groups: CommandGroup[];
  onSelect: (command: WorkspaceCommand) => void;
  /** Opt in only once per workspace. F ignores editable fields; Cmd/Ctrl+K opens search. */
  shortcuts?: boolean;
  label?: string;
  placeholder?: string;
};
/** An action combobox, anchored to the Find field. Base UI owns keyboard navigation and dismissal. */
export function CommandSearch({
  groups,
  onSelect,
  shortcuts = false,
  label = "Find in workspace",
  placeholder = "Find",
}: CommandSearchProps) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const anchor = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!shortcuts) return;
    const keydown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey
      )
        return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest('[role="dialog"],dialog')) return;
      const editing = target?.closest(
        'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
      );
      const modifier = event.metaKey || event.ctrlKey;
      if (
        (modifier && event.key.toLowerCase() === "k") ||
        (!modifier && !editing && event.key.toLowerCase() === "f")
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [shortcuts]);
  return (
    <div
      ref={setHost}
      className="oreo-command-search"
      data-open={open || undefined}
    >
      <Combobox.Root<WorkspaceCommand | null>
        items={groups}
        value={null}
        inputValue={query}
        onInputValueChange={setQuery}
        itemToStringLabel={(item) => item?.label ?? ""}
        isItemEqualToValue={(a, b) => a?.id === b?.id}
        filter={(item, q) =>
          `${item?.label ?? ""} ${item?.keywords ?? ""}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())
        }
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        autoHighlight
        onValueChange={(command) => {
          if (command && !command.disabled) {
            setOpen(false);
            setQuery("");
            onSelect(command);
          }
        }}
      >
        <div ref={anchor} className="command-anchor">
          <Icon name="search" />
          <Combobox.Trigger
            ref={trigger}
            className="command-trigger"
            aria-label={label}
            style={{ display: open ? "none" : undefined }}
          >
            <span>{placeholder}</span>
            {shortcuts && <Shortcut keys={["F"]} size="sm" />}
          </Combobox.Trigger>
          <Combobox.Input
            ref={input}
            className="command-input"
            aria-label={label}
            placeholder={placeholder}
            style={{ display: open ? undefined : "none" }}
          />
          {open && (
            <button
              type="button"
              className="command-escape"
              aria-label="Close search"
              onClick={() => {
                setOpen(false);
                setQuery("");
                requestAnimationFrame(() => trigger.current?.focus());
              }}
            >
              <Shortcut keys={["ESC"]} size="sm" />
            </button>
          )}
        </div>
        <Combobox.Portal container={host}>
          <Combobox.Positioner
            anchor={anchor}
            align="end"
            sideOffset={4}
            positionMethod="fixed"
            className="command-positioner"
          >
            <Combobox.Popup
              className="command-popup"
              initialFocus={false}
              finalFocus={trigger}
            >
              <Combobox.Empty>
                <AgentWorkspaceState
                  title="No commands found"
                  description="Try a page name or action, such as deployments or theme."
                  actionLabel="Clear search"
                  onAction={() => {
                    setQuery("");
                    input.current?.focus();
                  }}
                />
              </Combobox.Empty>
              <Combobox.List className="command-list">
                {(group: CommandGroup) => (
                  <Combobox.Group key={group.label} items={group.items}>
                    <Combobox.GroupLabel className="command-group-label">
                      {group.label}
                    </Combobox.GroupLabel>
                    <Combobox.Collection>
                      {(item: WorkspaceCommand) => (
                        <Combobox.Item
                          key={item.id}
                          value={item}
                          disabled={item.disabled}
                          className="command-option"
                        >
                          <span aria-hidden>
                            {item.icon && <Icon name={item.icon} />}
                          </span>
                          <span>{item.label}</span>
                          {item.disabled && (
                            <span className="command-unavailable">
                              Unavailable
                            </span>
                          )}
                        </Combobox.Item>
                      )}
                    </Combobox.Collection>
                  </Combobox.Group>
                )}
              </Combobox.List>
              <footer className="command-hint">
                <span>
                  <Shortcut keys={["up", "down"]} size="sm" /> Navigate
                </span>
                <span>
                  <Shortcut keys={["enter"]} size="sm" /> Open
                </span>
              </footer>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

export function WorkspaceMetric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
}) {
  return (
    <article className="workspace-metric">
      <div>
        <h3>{label}</h3>
        <span aria-hidden>{icon}</span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
export type Deployment = {
  id: string;
  name: string;
  branch: string;
  commit: string;
  time: string;
  status: "ready" | "failed";
};
export function DeploymentRow({
  deployment,
  onOpen,
}: {
  deployment: Deployment;
  onOpen: (deployment: Deployment) => void;
}) {
  return (
    <button
      type="button"
      className="deployment-row"
      onClick={() => onOpen(deployment)}
    >
      <span className="deployment-mark">
        <Icon name="globe" />
      </span>
      <span className="deployment-name">
        <strong>{deployment.name}</strong>
        <span>
          {deployment.branch} · {deployment.commit}
        </span>
      </span>
      <Tag color={deployment.status === "ready" ? "mint" : "pink"}>
        {deployment.status === "ready" ? "Ready" : "Failed"}
      </Tag>
      <time>{deployment.time}</time>
      <Icon name="chevron-right" size="sm" />
    </button>
  );
}
