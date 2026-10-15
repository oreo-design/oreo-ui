import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Accordion } from "@base-ui-components/react/accordion";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import type { PaletteColor } from "@/lib/palette";
import "./tree-stepper.css";

export type TreeStepNode = {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  badge?: { label: string; color?: PaletteColor };
  disabled?: boolean;
  children?: readonly TreeStepNode[];
};
export type TreeStep = { node: TreeStepNode; parents: readonly TreeStepNode[] };
/** Depth-first leaf order, excluding disabled nodes and their descendants. IDs must be globally unique. */
export function getTreeSteps(
  nodes: readonly TreeStepNode[],
  parents: readonly TreeStepNode[] = [],
): TreeStep[] {
  return nodes.flatMap((node) =>
    node.disabled
      ? []
      : node.children?.length
        ? getTreeSteps(node.children, [...parents, node])
        : [{ node, parents }],
  );
}
export type TreeStepperProps = {
  nodes: readonly TreeStepNode[];
  value: string;
  onValueChange: (value: string) => void;
  completed?: readonly string[];
  attention?: readonly string[];
  label?: string;
  disabled?: boolean;
};
export function TreeStepper({
  nodes,
  value,
  onValueChange,
  completed = [],
  attention = [],
  label = "Review steps",
  disabled = false,
}: TreeStepperProps) {
  const steps = useMemo(() => getTreeSteps(nodes), [nodes]);
  const active = steps.find((step) => step.node.id === value);
  const [expanded, setExpanded] = useState<string[]>(
    () => active?.parents.map((n) => n.id) ?? [],
  );
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    setExpanded(
      steps.find((step) => step.node.id === value)?.parents.map((n) => n.id) ??
        [],
    );
  }, [value, steps]);
  // Next/Previous can live outside this component. Honor their input modality too.
  useEffect(() => {
    const key = () => setKeyboard(true);
    const pointer = () => setKeyboard(false);
    document.addEventListener("keydown", key, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);
  function level(
    items: readonly TreeStepNode[],
    depth: number,
    parents: string[],
  ) {
    return (
      <Accordion.Root
        multiple={false}
        value={expanded[depth] ? [expanded[depth]] : []}
        disabled={disabled}
        onValueChange={(next) =>
          setExpanded(next.length ? [...parents, String(next[0])] : parents)
        }
        className="ts-level"
      >
        {items.map((node, index) => {
          const branch = Boolean(node.children?.length);
          const leaves = branch ? getTreeSteps([node]) : [];
          const done = branch
            ? leaves.length > 0 &&
              leaves.every((s) => completed.includes(s.node.id))
            : completed.includes(node.id);
          const current = node.id === value;
          const inPath =
            current || Boolean(active?.parents.some((n) => n.id === node.id));
          const flagged = branch
            ? leaves.some((s) => attention.includes(s.node.id))
            : attention.includes(node.id);
          const indicator = (
            <span
              aria-hidden
              className="ts-marker"
              data-state={
                flagged
                  ? "attention"
                  : done
                    ? "done"
                    : inPath
                      ? "active"
                      : "pending"
              }
            >
              {flagged ? (
                <Icon name="warning-circle" className="size-3" />
              ) : done ? (
                <Icon name="check" className="size-3" />
              ) : branch ? (
                index + 1
              ) : current ? (
                <span className="ts-current-dot" />
              ) : null}
            </span>
          );
          const content = (
            <>
              {branch && (
                <Icon name="chevron-right" className="ts-chevron size-3" />
              )}
              {depth === 0 && node.icon ? (
                <span aria-hidden className="ts-root-icon">
                  {node.icon}
                </span>
              ) : (
                indicator
              )}
              <span className="ts-label">{node.label}</span>
              {node.count !== undefined && (
                <span className="ts-count">{node.count}</span>
              )}
              {node.badge && (
                <Tag className="ml-auto" color={node.badge.color}>
                  {node.badge.label}
                </Tag>
              )}
            </>
          );
          return branch ? (
            <Accordion.Item
              key={node.id}
              value={node.id}
              disabled={node.disabled}
            >
              <Accordion.Header className="ts-heading">
                <Accordion.Trigger
                  className="ts-row ts-branch"
                  data-active-path={inPath || undefined}
                >
                  {content}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="ts-panel">
                <div className="ts-children">
                  {level(node.children!, depth + 1, [...parents, node.id])}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ) : (
            <div key={node.id}>
              <button
                type="button"
                className="ts-row ts-leaf"
                disabled={disabled || node.disabled}
                aria-current={current ? "step" : undefined}
                onClick={() => onValueChange(node.id)}
              >
                {content}
                <span className="sr-only">
                  {flagged
                    ? ", needs attention"
                    : done
                      ? ", completed"
                      : current
                        ? ", current"
                        : ", pending"}
                </span>
              </button>
            </div>
          );
        })}
      </Accordion.Root>
    );
  }
  return (
    <nav
      className="oreo-tree-stepper"
      aria-label={label}
      data-keyboard={keyboard || undefined}
    >
      {nodes.length ? (
        level(nodes, 0, [])
      ) : (
        <AgentWorkspaceState
          title="No steps yet"
          description="Add a branch and its checks to get started."
        />
      )}
    </nav>
  );
}
