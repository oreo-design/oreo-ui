import { useId, useRef, useState } from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Tag, type PaletteColor } from "@/components/tag";
import { TASK_STATUS } from "@/components/task-row";
import {
  completion,
  type CapsuleItem,
  type CapsulePerson,
  type CapsuleStatus,
} from "./model";
import "./task-capsule.css";
export * from "./model";
const states: CapsuleStatus[] = ["todo", "progress", "review", "done"];
// Matches the existing TaskRow status palette, rather than introducing a second status system.
const colors: Record<CapsuleStatus, PaletteColor> = {
  todo: "default",
  progress: "blue",
  review: "purple",
  done: "mint",
};
const icons: Record<CapsuleStatus, IconName> = {
  todo: "circle-dashed",
  progress: "clock-history",
  review: "eye",
  done: "check",
};
function StatusTag({ value }: { value: CapsuleStatus }) {
  return (
    <Tag color={colors[value]} icon={<Icon name={icons[value]} size="sm" />}>
      {TASK_STATUS[value]}
    </Tag>
  );
}

/** Finite counts; above 24 items the ring samples the proportion into 24 segments. */
export function SegmentedTaskProgress({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  const c = completion(value, total),
    n = c.segments;
  const point = (angle: number) => [
    20 + 17 * Math.cos(angle),
    20 + 17 * Math.sin(angle),
  ];
  return (
    <span
      className="tc-progress"
      role="progressbar"
      aria-label="Checklist completion"
      aria-valuemin={0}
      aria-valuemax={c.total || 1}
      aria-valuenow={c.done}
      aria-valuetext={
        c.total
          ? `${c.done} of ${c.total} items complete`
          : "No checklist items"
      }
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        {n ? (
          Array.from({ length: n }, (_, i) => {
            const start = -Math.PI / 2 + (i * 2 * Math.PI) / n + 0.055,
              end = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n - 0.055;
            const a = point(start),
              b = point(end);
            return (
              <path
                key={i}
                d={`M ${a.join(" ")} A 17 17 0 ${end - start > Math.PI ? 1 : 0} 1 ${b.join(" ")}`}
                data-complete={
                  i < Math.round((c.done / c.total) * n) || undefined
                }
              />
            );
          })
        ) : (
          <circle cx="20" cy="20" r="17" />
        )}
      </svg>
      <span aria-hidden="true">{c.done}</span>
    </span>
  );
}
export function TaskStatusChoices({
  value,
  onChange,
  disabled = false,
  label = "Task status",
}: {
  value: CapsuleStatus;
  onChange: (value: CapsuleStatus) => void;
  disabled?: boolean;
  label?: string;
}) {
  const name = useId();
  return (
    <fieldset className="tc-status-choices" disabled={disabled}>
      <legend className="sr-only">{label}</legend>
      {states.map((s) => (
        <label
          key={s}
          className="tc-status-choice oreo-focus-proxy"
          data-selected={value === s || undefined}
        >
          <input
            className="sr-only"
            type="radio"
            name={name}
            value={s}
            checked={value === s}
            onChange={() => onChange(s)}
          />
          <StatusTag value={s} />
        </label>
      ))}
    </fieldset>
  );
}
export function CompactTaskChecklist({
  items,
  people = [],
  onChange,
  disabled = false,
  label = "Checklist",
}: {
  items: CapsuleItem[];
  people?: CapsulePerson[];
  onChange: (items: CapsuleItem[]) => void;
  disabled?: boolean;
  label?: string;
}) {
  if (!items.length) return <p className="tc-empty">No checklist items yet.</p>;
  return (
    <ul className="tc-checklist" aria-label={label}>
      {items.map((item) => {
        const person = people.find((p) => p.id === item.assigneeId);
        return (
          <li key={item.id}>
            <label
              className="tc-check-row oreo-state-layer oreo-focus-proxy"
              data-done={item.done || undefined}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={item.done}
                disabled={disabled}
                onChange={(e) =>
                  onChange(
                    items.map((x) =>
                      x.id === item.id ? { ...x, done: e.target.checked } : x,
                    ),
                  )
                }
              />
              <span className="tc-check" aria-hidden="true">
                {item.done && <Icon name="check" size="sm" />}
              </span>
              <span className="tc-item-title">{item.title}</span>
              {person && (
                <Avatar
                  name={person.name}
                  src={person.src}
                  color={person.color}
                  size="xs"
                />
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
export function TaskCapsule({
  title,
  status,
  due,
  people = [],
  items,
  onStatusChange,
  onItemsChange,
  onOpen,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: {
  title: string;
  status: CapsuleStatus;
  due?: string;
  people?: CapsulePerson[];
  items: CapsuleItem[];
  onStatusChange: (value: CapsuleStatus) => void;
  onItemsChange: (items: CapsuleItem[]) => void;
  onOpen?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}) {
  const [keyboard, setKeyboard] = useState(false),
    [statusOpen, setStatusOpen] = useState(false);
  const statusId = useId(),
    statusButton = useRef<HTMLButtonElement>(null);
  const c = completion(items.filter((i) => i.done).length, items.length);
  return (
    <Collapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className="tc-capsule oreo-squircle"
      data-instant={keyboard || undefined}
      data-disabled={disabled || undefined}
      onKeyDownCapture={() => setKeyboard(true)}
      onPointerDownCapture={() => setKeyboard(false)}
    >
      <div className="tc-face oreo-squircle">
        <header className="tc-header">
          <SegmentedTaskProgress value={c.done} total={c.total} />
          <Collapsible.Trigger
            className="tc-title oreo-focus"
            aria-label={`${title} checklist`}
          >
            <span>{title}</span>
            <Icon name="chevron-down" size="sm" className="tc-chevron" />
          </Collapsible.Trigger>
          <AvatarGroup
            size="xs"
            max={3}
            className="tc-people"
            aria-label={
              people.length
                ? `Team: ${people.map((p) => p.name).join(", ")}`
                : "No team assigned"
            }
          >
            {people.map((p) => (
              <Avatar
                key={p.id}
                name={p.name}
                src={p.src}
                color={p.color}
                size="xs"
              />
            ))}
          </AvatarGroup>
          <div className="tc-meta">
            <button
              ref={statusButton}
              type="button"
              disabled={disabled}
              className="tc-status-button oreo-focus"
              aria-label={`Change status: ${TASK_STATUS[status]}`}
              aria-expanded={statusOpen}
              aria-controls={statusId}
              onClick={() => setStatusOpen((v) => !v)}
            >
              <StatusTag value={status} />
            </button>
            {due && <span className="tc-due">Due {due}</span>}
          </div>
        </header>
        <Collapsible.Root
          open={statusOpen}
          onOpenChange={setStatusOpen}
          disabled={disabled}
        >
          <Collapsible.Panel
            id={statusId}
            className="tc-collapse"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setStatusOpen(false);
                statusButton.current?.focus();
              }
            }}
          >
            <div className="tc-status-panel">
              <TaskStatusChoices
                value={status}
                disabled={disabled}
                onChange={onStatusChange}
                label={`${title} status`}
              />
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
        <Collapsible.Panel className="tc-collapse tc-content">
          <div className="tc-check-body">
            <CompactTaskChecklist
              items={items}
              people={people}
              onChange={onItemsChange}
              disabled={disabled}
              label={`${title} checklist items`}
            />
          </div>
          <footer className="tc-footer">
            <span aria-live="polite">
              {!c.total ? "No items" : c.left ? `${c.left} left` : "All done"}
            </span>
            {onOpen && (
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                disabled={disabled}
                trailingIcon={<Icon name="chevron-right" size="sm" />}
                onClick={onOpen}
                aria-label={`Open ${title}`}
              >
                Open
              </Button>
            )}
          </footer>
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  );
}
