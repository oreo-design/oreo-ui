export type MixComment = {
  id: string;
  versionId: string;
  author: string;
  seconds: number;
  text: string;
  resolved: boolean;
};
export type MixVersion = {
  id: string;
  title: string;
  author: string;
  date: string;
  duration: number;
  src: string;
  note: string;
};
export type ProductionTask = {
  id: string;
  title: string;
  done: boolean;
  assignee: string;
  due: string;
  seconds?: number;
  versionId?: string;
  children?: ProductionTask[];
};
export const trackTime = (seconds: number) =>
  `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, "0")}`;
export const clampTime = (seconds: number, duration: number) =>
  Number.isFinite(seconds) && Number.isFinite(duration)
    ? Math.max(0, Math.min(seconds, Math.max(0, duration)))
    : 0;
export function taskDone(task: ProductionTask): boolean {
  return task.children?.length ? task.children.every(taskDone) : task.done;
}
export function toggleTask(
  tasks: ProductionTask[],
  id: string,
  done: boolean,
): ProductionTask[] {
  const setAll = (t: ProductionTask): ProductionTask => ({
    ...t,
    done,
    ...(t.children ? { children: t.children.map(setAll) } : {}),
  });
  return tasks.map((t) =>
    t.id === id
      ? setAll(t)
      : {
          ...t,
          ...(t.children ? { children: toggleTask(t.children, id, done) } : {}),
        },
  );
}
export function validComment(text: string, seconds: number, duration: number) {
  return (
    !!text.trim() &&
    text.trim().length <= 2000 &&
    Number.isFinite(seconds) &&
    seconds >= 0 &&
    seconds <= duration
  );
}
