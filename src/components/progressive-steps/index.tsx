import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import "./steps.css";
export type ProgressiveStep = { id: string; label: string; disabled?: boolean };
export type ProgressiveStepsProps = {
  steps: readonly ProgressiveStep[];
  value: string;
  completed?: readonly string[];
  onValueChange?: (id: string) => void;
  variant?: "expanded" | "compact";
  label?: string;
  disabled?: boolean;
};
export function ProgressiveSteps({
  steps,
  value,
  completed = [],
  onValueChange,
  variant = "expanded",
  label = "Checkout progress",
  disabled = false,
}: ProgressiveStepsProps) {
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const key = () => setKeyboard(true),
      pointer = () => setKeyboard(false);
    document.addEventListener("keydown", key, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);
  if (!steps.length)
    return (
      <AgentWorkspaceState
        title="No steps yet"
        description="Add steps to describe this journey."
      />
    );
  if (new Set(steps.map((s) => s.id)).size !== steps.length)
    return (
      <AgentWorkspaceState
        title="Steps unavailable"
        description="Each step needs a unique ID."
        error
      />
    );
  const index = steps.findIndex((s) => s.id === value),
    allDone = steps.every((s) => completed.includes(s.id));
  const wide = variant === "expanded" && index >= 0,
    extra = wide ? 104 : 0,
    width = steps.length * 48 + extra;
  const start = (i: number) => i * 48 + (wide && i > index ? extra : 0);
  let top = "M24 1",
    bottom = "";
  for (let i = 0; i < steps.length; i++) {
    const end = start(i) + (wide && i === index ? 152 : 48);
    top += ` H${end - 24}`;
    if (i < steps.length - 1)
      top += ` C${end - 12} 1 ${end - 12} 7 ${end} 7 C${end + 12} 7 ${end + 12} 1 ${end + 24} 1`;
  }
  for (let i = steps.length - 1; i >= 0; i--) {
    const left = start(i);
    bottom += ` H${left + 24}`;
    if (i > 0)
      bottom += ` C${left + 12} 47 ${left + 12} 41 ${left} 41 C${left - 12} 41 ${left - 12} 47 ${left - 24} 47`;
  }
  const path = `${top} A23 23 0 0 1 ${width - 1} 24 A23 23 0 0 1 ${width - 24} 47 ${bottom} A23 23 0 0 1 1 24 A23 23 0 0 1 24 1 Z`;
  return (
    <nav
      className="oreo-progressive-steps"
      aria-label={label}
      data-keyboard={keyboard || undefined}
    >
      <div className="pgs-scroll">
        <div className="pgs-track" style={{ width }}>
          <svg
            className="pgs-outline"
            width={width}
            height="48"
            aria-hidden="true"
          >
            <path d={path} />
          </svg>
          {index >= 0 && (
            <span
              className="pgs-active"
              style={{
                width: wide ? 152 : 48,
                transform: `translateX(${start(index)}px)`,
              }}
              aria-hidden="true"
            >
              <span className="pgs-number">{index + 1}</span>
              {wide && <span className="pgs-name">{steps[index].label}</span>}
            </span>
          )}
          <ol>
            {steps.map((s, i) => {
              const active = i === index,
                done = completed.includes(s.id);
              return (
                <li
                  key={s.id}
                  style={{
                    width: active && wide ? 152 : 48,
                    transform: `translateX(${start(i)}px)`,
                  }}
                >
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    aria-label={`${i + 1}. ${s.label}${done ? ", completed" : ""}`}
                    disabled={disabled || s.disabled || !onValueChange}
                    onClick={() => onValueChange?.(s.id)}
                    data-active={active || undefined}
                    title={s.label}
                  >
                    <span className="pgs-number" aria-hidden="true">
                      {done && !active ? (
                        <Icon name="check" size="sm" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    {active && wide && (
                      <span className="pgs-name" aria-hidden="true">
                        {s.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <p className="pgs-caption" role="status">
        {allDone && index < 0 ? (
          `${steps.length} steps completed`
        ) : index >= 0 ? (
          <>
            {variant === "compact" && <strong>{steps[index].label}</strong>}Step{" "}
            {index + 1} of {steps.length}
          </>
        ) : (
          "Choose a step to begin"
        )}
      </p>
    </nav>
  );
}
