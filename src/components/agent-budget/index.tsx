import { useId } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { budgetOutlook, clampCap, money, type BudgetInputs } from "./model";
import "./agent-budget.css";
export * from "./model";
export type BudgetCapProps = {
  value: number;
  spent: number;
  planMax: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
};
export function BudgetCapControl({
  value,
  spent,
  planMax,
  onChange,
  step = 5000,
  disabled = false,
}: BudgetCapProps) {
  const id = useId();
  const valid =
    [value, spent, planMax, step].every(Number.isSafeInteger) &&
    spent >= 0 &&
    planMax > 0 &&
    value >= spent &&
    value <= planMax &&
    step > 0;
  if (!valid)
    return (
      <AgentWorkspaceState
        error
        title="Budget unavailable"
        description="Use a cap between spent and plan maximum, with a positive step. Amounts are integer USD cents."
      />
    );
  function propose(next: number) {
    if (!Number.isFinite(next)) return;
    onChange(clampCap(next, spent, planMax));
  }
  return (
    <div className="ab-cap">
      <div className="ab-amount-row">
        <output
          className="ab-amount"
          aria-label={`Monthly budget ${money(value)}`}
        >
          <span aria-hidden>$</span>
          {money(value).slice(1)}
        </output>
        <div className="ab-stepper">
          <IconButton
            aria-label="Decrease budget"
            type="tertiary"
            tapScale={1}
            disabled={disabled}
            onClick={() => propose(value - step)}
            icon={<Icon name="minus" />}
          />
          <IconButton
            aria-label="Increase budget"
            type="tertiary"
            tapScale={1}
            disabled={disabled}
            onClick={() => propose(value + step)}
            icon={<Icon name="plus" />}
          />
        </div>
      </div>
      <div className="ab-rail">
        <div
          className="ab-allowance"
          style={{ width: `${(value / planMax) * 100}%` }}
        />
        <div
          className="ab-spent"
          style={{ width: `${(spent / planMax) * 100}%` }}
        />
        <div className="ab-ticks" />
        <input
          aria-label="Monthly budget cap"
          aria-describedby={`${id}-legend ${id}-notice`}
          aria-valuetext={`${money(value)} budget; ${money(spent)} already spent; plan maximum ${money(planMax)}`}
          type="range"
          min="0"
          max={planMax}
          step="1"
          value={value}
          disabled={disabled}
          onChange={(e) =>
            propose(Math.round(Number(e.target.value) / step) * step)
          }
          onKeyDown={(e) => {
            if (
              [
                "ArrowLeft",
                "ArrowDown",
                "ArrowRight",
                "ArrowUp",
                "Home",
                "End",
                "PageUp",
                "PageDown",
              ].includes(e.key)
            ) {
              e.preventDefault();
              propose(
                e.key === "Home"
                  ? spent
                  : e.key === "End"
                    ? planMax
                    : value +
                      (["ArrowLeft", "ArrowDown", "PageDown"].includes(e.key)
                        ? -step
                        : step),
              );
            }
          }}
        />
      </div>
      <div id={`${id}-legend`} className="ab-legend">
        <span>
          <i /> Used <strong>{money(spent)}</strong> so far
        </span>
        <span>
          Team plan, up to <strong>{money(planMax)}</strong>
        </span>
      </div>
      <p id={`${id}-notice`} className="ab-boundary" role="status">
        {value === spent
          ? `Already spent ${money(spent)} this month.`
          : value === planMax
            ? `Team plan tops out at ${money(planMax)}.`
            : "Drag the cap or use the arrow keys to adjust."}
      </p>
    </div>
  );
}
export function BudgetOutcome({ budget }: { budget: BudgetInputs }) {
  const o = budgetOutlook(budget);
  if (!o)
    return (
      <AgentWorkspaceState
        error
        title="Estimate unavailable"
        description="Check the cap, spend, run cost, daily pace and reset horizon."
      />
    );
  const lasts = o.paused
    ? "Paused"
    : o.days === null
      ? "No recent spend"
      : o.days >= budget.daysToReset
        ? "Through reset"
        : `${o.days < 1 ? "< 1" : Math.floor(o.days)} ${Math.floor(o.days) === 1 ? "day" : "days"}`;
  return (
    <div className="ab-outcome">
      <div>
        <span>Agent runs left</span>
        <strong>≈ {o.runs.toLocaleString("en-US")}</strong>
        <small>
          {money(o.remaining)} remaining · {money(budget.costPerRun)}/run
        </small>
      </div>
      <div>
        <span>Lasts</span>
        <strong>{lasts}</strong>
        <small>
          {o.days === null
            ? "Add a daily pace to estimate time"
            : `${money(budget.dailySpend)}/day · ${budget.daysToReset} days to reset`}
        </small>
      </div>
    </div>
  );
}
export function MonthlyBudgetCard({
  budget,
  onChange,
  onSave,
  onCancel,
  dirty = false,
  resetLabel = "Nov 1",
  disabled = false,
}: {
  budget: BudgetInputs;
  onChange: (cap: number) => void;
  onSave: () => void;
  onCancel?: () => void;
  dirty?: boolean;
  resetLabel?: string;
  disabled?: boolean;
}) {
  const o = budgetOutlook(budget),
    id = useId();
  if (!o)
    return (
      <AgentWorkspaceState
        error
        title="Budget unavailable"
        description="Check budget inputs before editing."
      />
    );
  return (
    <section className="ab-card" aria-labelledby={id}>
      <header>
        <h2 id={id}>
          <Icon name="sparkle" />
          Monthly AI budget
        </h2>
        <span className="ab-reset">
          <Icon name="calendar" size="sm" />
          Resets {resetLabel}
        </span>
      </header>
      <BudgetCapControl
        value={budget.cap}
        spent={budget.spent}
        planMax={budget.planMax}
        onChange={onChange}
        disabled={disabled}
      />
      <BudgetOutcome budget={budget} />
      <p className="ab-assumption">
        About {o.totalRuns.toLocaleString("en-US")} runs for the whole cap.
        Estimates assume a steady pace and the same average run cost.
      </p>
      <footer>
        <div>
          <span>
            {o.paused ? "Agents pause at this cap" : "Agents pause at the cap"}
          </span>
          <small>{dirty ? "Unsaved changes" : "Budget is up to date"}</small>
        </div>
        <div className="ab-actions">
          {dirty && onCancel && (
            <Button
              type="tertiary"
              tapScale={1}
              onClick={onCancel}
              disabled={disabled}
            >
              Cancel
            </Button>
          )}
          <Button tapScale={1} disabled={!dirty || disabled} onClick={onSave}>
            Save budget
          </Button>
        </div>
      </footer>
    </section>
  );
}
