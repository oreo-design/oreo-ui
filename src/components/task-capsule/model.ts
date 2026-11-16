import type { AvatarProps } from "@/components/avatar";
import type { Subtask } from "@/components/task-editor/model";
import type { TaskStatus } from "@/components/task-row";
export type CapsuleStatus = Exclude<TaskStatus, "backlog">;
export type CapsulePerson = {
  id: string;
  name: string;
  color?: AvatarProps["color"];
  src?: string;
};
export type CapsuleItem = Subtask & { assigneeId?: string };
export type CapsuleTask = {
  id: string;
  title: string;
  description: string;
  status: CapsuleStatus;
  due: string;
  people: CapsulePerson[];
  items: CapsuleItem[];
};
export function completion(value: number, total: number) {
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const done = Number.isFinite(value)
    ? Math.min(count, Math.max(0, Math.floor(value)))
    : 0;
  return {
    total: count,
    done,
    left: count - done,
    segments: Math.min(count, 24),
  };
}
