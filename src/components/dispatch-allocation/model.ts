export type AllocationResource = {
  id: string;
  name: string;
  vehicle: string;
  seats: number;
};
export type Allocation = { resourceId: string; start: number; date: string };
export type RouteJob = {
  id: string;
  customer: string;
  from: string;
  to: string;
  category: "Private hire" | "Provisional" | "Contract";
  duration: number;
  passengers: number;
  luggage: number;
  allocation?: Allocation;
  dispatched?: boolean;
};
export const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
export const hourLabel = (hour: number) =>
  `${String(hour).padStart(2, "0")}:00`;
export function allocationError(
  jobs: RouteJob[],
  resources: AllocationResource[],
  id: string,
  value: Allocation,
): string | undefined {
  const job = jobs.find((j) => j.id === id),
    resource = resources.find((r) => r.id === value.resourceId);
  if (!job) return "This job is no longer available.";
  if (job.dispatched)
    return "Dispatched jobs cannot be moved. Undo dispatch first.";
  if (!resource) return "Choose an available driver.";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
    !Number.isFinite(Date.parse(value.date)) ||
    new Date(value.date).toISOString().slice(0, 10) !== value.date
  )
    return "Choose a valid date.";
  if (
    !Number.isInteger(job.duration) ||
    job.duration < 1 ||
    !Number.isInteger(value.start) ||
    value.start < 8 ||
    value.start + job.duration > 18
  )
    return "The entire job must fit between 08:00 and 18:00.";
  if (job.passengers > resource.seats)
    return `${resource.name}'s vehicle has ${resource.seats} seats; this job needs ${job.passengers}.`;
  if (
    jobs.some(
      (j) =>
        j.id !== id &&
        j.allocation?.resourceId === value.resourceId &&
        j.allocation.date === value.date &&
        value.start < j.allocation.start + j.duration &&
        value.start + job.duration > j.allocation.start,
    )
  )
    return "This driver already has a job in that time slot. Choose another time or driver.";
}
export function assignJob(
  jobs: RouteJob[],
  resources: AllocationResource[],
  id: string,
  value?: Allocation,
): RouteJob[] {
  const job = jobs.find((j) => j.id === id);
  if (!job) throw new Error("This job is no longer available.");
  if (job.dispatched)
    throw new Error("Dispatched jobs cannot be moved. Undo dispatch first.");
  if (value) {
    const error = allocationError(jobs, resources, id, value);
    if (error) throw new Error(error);
  }
  return jobs.map((j) => (j.id === id ? { ...j, allocation: value } : j));
}
export function dispatchDay(jobs: RouteJob[], date: string): RouteJob[] {
  return jobs.map((j) =>
    j.allocation?.date === date && !j.dispatched
      ? { ...j, dispatched: true }
      : j,
  );
}
