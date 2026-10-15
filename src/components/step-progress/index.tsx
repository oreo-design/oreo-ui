import "./step-progress.css";
export type StepProgressProps = {
  completed: number;
  total: number;
  label?: string;
};
export function StepProgress({
  completed,
  total,
  label = "Review progress",
}: StepProgressProps) {
  const max = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const done = Number.isFinite(completed)
    ? Math.max(0, Math.min(max, Math.floor(completed)))
    : 0;
  return (
    <div className="oreo-step-progress">
      <div className="sp-label">
        <span>{label}</span>
        <span>
          {done} / {max}
        </span>
      </div>
      <div
        className="sp-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max || 1}
        aria-valuenow={done}
        aria-valuetext={
          max ? `${done} of ${max} checks completed` : "No checks"
        }
      >
        <span style={{ transform: `scaleX(${max ? done / max : 0})` }} />
      </div>
    </div>
  );
}
