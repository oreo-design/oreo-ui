import { useState } from "react";
import {
  TaskCapsule,
  SegmentedTaskProgress,
  CompactTaskChecklist,
  TaskStatusChoices,
  type CapsuleStatus,
} from "@/components/task-capsule";
import { CAPSULE_TASKS } from "@/patterns/task-capsule-workspace/data";
import {
  definePlayground as define,
  toggle,
  number,
  text,
  select,
} from "../schema";
import type { PlaygroundSpec } from "../schema";
const source = "task-capsule",
  exports = {
    "task-capsule": {
      TaskCapsule,
      SegmentedTaskProgress,
      CompactTaskChecklist,
      TaskStatusChoices,
    },
  };
function Demo({
  title,
  disabled,
  empty,
  open,
}: {
  title: string;
  disabled: boolean;
  empty: boolean;
  open: boolean;
}) {
  const [task, setTask] = useState(CAPSULE_TASKS[0]);
  return (
    <div className="w-full p-6">
      <TaskCapsule
        key={String(open)}
        title={title}
        status={task.status}
        items={empty ? [] : task.items}
        people={task.people}
        due={task.due}
        defaultOpen={open}
        disabled={disabled}
        onStatusChange={(status) => setTask((t) => ({ ...t, status }))}
        onItemsChange={(items) => setTask((t) => ({ ...t, items }))}
      />
    </div>
  );
}
function ChecklistDemo({
  empty,
  disabled,
}: {
  empty: boolean;
  disabled: boolean;
}) {
  const [items, setItems] = useState(CAPSULE_TASKS[0].items);
  return (
    <div className="w-full max-w-md p-6">
      <CompactTaskChecklist
        items={empty ? [] : items}
        people={CAPSULE_TASKS[0].people}
        onChange={setItems}
        disabled={disabled}
      />
    </div>
  );
}
const specs: Record<string, PlaygroundSpec> = {
  "task-capsule": {
    ...define(
      "Task Capsule",
      {
        title: text("Onboarding flow"),
        open: toggle(false),
        disabled: toggle(false),
        empty: toggle(false),
      },
      (v) => <Demo {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import { useState } from "react";',
        'import { TaskCapsule, type CapsuleItem, type CapsuleStatus } from "@/components/task-capsule";',
      ],
      setup: [
        'const [status, setStatus] = useState<CapsuleStatus>("progress");',
        `const [items, setItems] = useState<CapsuleItem[]>(${JSON.stringify(v.empty ? [] : CAPSULE_TASKS[0].items)});`,
      ],
      jsx: `<TaskCapsule title={${JSON.stringify(v.title)}} status={status} items={items} onStatusChange={setStatus} onItemsChange={setItems} defaultOpen={${v.open}} disabled={${v.disabled}} />`,
      notes: [
        "Add people and due metadata as needed. onOpen is optional and belongs to the host; no inert Open action is rendered.",
      ],
    }),
  },
  "segmented-task-progress": {
    ...define(
      "Segmented Task Progress",
      { value: number(3, 0, 100), total: number(5, 0, 100) },
      (v) => <SegmentedTaskProgress {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import { SegmentedTaskProgress } from "@/components/task-capsule";',
      ],
      setup: [],
      jsx: `<SegmentedTaskProgress value={${v.value}} total={${v.total}} />`,
      notes: [
        "Counts clamp to a finite total. Above 24 items the ring shows a 24-segment proportion; accessible counts remain exact.",
      ],
    }),
  },
  "compact-task-checklist": {
    ...define(
      "Compact Task Checklist",
      { disabled: toggle(false), empty: toggle(false) },
      (v) => <ChecklistDemo {...v} />,
    ),
    exportRecipe: (v) => ({
      imports: [
        'import { useState } from "react";',
        'import { CompactTaskChecklist, type CapsuleItem } from "@/components/task-capsule";',
      ],
      setup: [
        `const [items, setItems] = useState<CapsuleItem[]>(${JSON.stringify(v.empty ? [] : CAPSULE_TASKS[0].items)});`,
      ],
      notes: [],
      jsx: `<CompactTaskChecklist items={items} onChange={setItems} disabled={${v.disabled}} />`,
    }),
  },
  "task-status-choices": {
    ...define(
      "Task Status Choices",
      {
        value: select(
          ["todo", "progress", "review", "done"] as const,
          "progress",
        ),
        disabled: toggle(false),
      },
      (v, set) => (
        <div className="p-6">
          <TaskStatusChoices
            value={v.value}
            disabled={v.disabled}
            onChange={(value) => set("value", value)}
          />
        </div>
      ),
    ),
    exportRecipe: (v) => ({
      imports: [
        'import { useState } from "react";',
        'import { TaskStatusChoices, type CapsuleStatus } from "@/components/task-capsule";',
      ],
      setup: [
        `const [status, setStatus] = useState<CapsuleStatus>(${JSON.stringify(v.value)});`,
      ],
      notes: [],
      jsx: `<TaskStatusChoices value={status} onChange={setStatus} disabled={${v.disabled}} />`,
    }),
  },
};
for (const spec of Object.values(specs)) {
  spec.source = source;
  spec.exports = exports;
}
export default specs;
