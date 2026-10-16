import { useId } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Switch } from "@/components/switch";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { AgentWorkspaceState } from "@/components/automation";
import {
  fieldOperators,
  OPERATOR_LABELS,
  validateCondition,
} from "@/components/trace-query/model";
import {
  money,
  parseMoney,
  allocateTarget,
  summarize,
  segmentCustomers,
  targetError,
  type Customer,
  type Plan,
  type Leg,
  type Segment,
  type Target,
  type QueryField,
  type QueryCondition,
} from "./model";
import "./subscription-operations.css";
export * from "./model";
export function SegmentRuleBuilder({
  fields,
  rules,
  mode,
  onRulesChange,
  onModeChange,
}: {
  fields: QueryField[];
  rules: QueryCondition[];
  mode: "all" | "any";
  onRulesChange: (rules: QueryCondition[]) => void;
  onModeChange: (mode: "all" | "any") => void;
}) {
  const patch = (id: string, values: Partial<QueryCondition>) =>
    onRulesChange(rules.map((r) => (r.id === id ? { ...r, ...values } : r)));
  return (
    <section className="so-rules" aria-label="Segment rules">
      <header>
        <h3>Rules</h3>
        <div role="group" aria-label="Match rules">
          {(["all", "any"] as const).map((m) => (
            <Button
              key={m}
              type={mode === m ? "secondary" : "tertiary"}
              size="sm"
              tapScale={1}
              aria-pressed={mode === m}
              onClick={() => onModeChange(m)}
            >
              Match {m}
            </Button>
          ))}
        </div>
      </header>
      {rules.map((r, i) => {
        const f = fields.find((f) => f.key === r.field);
        return (
          <div key={r.id} className="so-rule">
            <span>{i === 0 ? "Where" : mode === "all" ? "and" : "or"}</span>
            <InlineSearchSelect
              label={`Rule ${i + 1} field`}
              value={r.field}
              options={fields.map((f) => ({
                value: f.key,
                label: f.label,
                icon: (
                  <Icon
                    name={f.type === "number" ? "clock-history" : "sliders"}
                    size="sm"
                  />
                ),
              }))}
              onValueChange={(field) => {
                const next = fields.find((f) => f.key === field)!;
                patch(r.id, {
                  field,
                  operator: fieldOperators(next)[0],
                  value:
                    next.options?.[0] ?? (next.type === "number" ? "0" : ""),
                });
              }}
            />
            <label>
              <span className="sr-only">Rule {i + 1} operator</span>
              <select
                value={r.operator}
                onChange={(e) =>
                  patch(r.id, {
                    operator: e.target.value as QueryCondition["operator"],
                  })
                }
              >
                {(f ? fieldOperators(f) : []).map((op) => (
                  <option key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </option>
                ))}
              </select>
            </label>
            {f?.type === "enum" ? (
              <InlineSearchSelect
                label={`Rule ${i + 1} value`}
                value={r.value}
                options={(f.options ?? []).map((v) => ({
                  value: v,
                  label: v,
                  icon: <Icon name="hash" size="sm" />,
                }))}
                onValueChange={(value) => patch(r.id, { value })}
              />
            ) : (
              <label>
                <span className="sr-only">Rule {i + 1} value</span>
                <input
                  aria-invalid={Boolean(validateCondition(r, fields))}
                  type={f?.type === "number" ? "number" : "text"}
                  min={f?.min}
                  max={f?.max}
                  value={r.value}
                  onChange={(e) => patch(r.id, { value: e.target.value })}
                />
              </label>
            )}
            <IconButton
              aria-label={`Remove rule ${i + 1}`}
              type="secondary"
              size="sm"
              tapScale={1}
              icon={<Icon name="x" size="sm" />}
              onClick={() => onRulesChange(rules.filter((v) => v.id !== r.id))}
            />
            {validateCondition(r, fields) && (
              <p className="so-error" role="alert">
                Rule {i + 1}: {validateCondition(r, fields)}
              </p>
            )}
          </div>
        );
      })}
      {!rules.length && (
        <p className="so-muted">No rules: all active customers are included.</p>
      )}
      <Button
        type="tertiary"
        size="sm"
        tapScale={1}
        disabled={!fields.length || rules.length >= 10}
        leadingIcon={<Icon name="plus" size="sm" />}
        onClick={() => {
          const f = fields[0];
          onRulesChange([
            ...rules,
            {
              id: crypto.randomUUID(),
              field: f.key,
              operator: fieldOperators(f)[0],
              value: f.options?.[0] ?? (f.type === "number" ? "0" : ""),
            },
          ]);
        }}
      >
        Add rule
      </Button>
    </section>
  );
}
export function SegmentPreview({
  customers,
  plans,
  legs,
  segment,
  today,
}: {
  customers: Customer[];
  plans: Plan[];
  legs: Leg[];
  segment: Pick<Segment, "rules" | "mode">;
  today: string;
}) {
  const result = segmentCustomers(customers, segment, plans, legs, today),
    summary = summarize(result, plans, legs, today),
    total = summarize(customers, plans, legs, today).count;
  return (
    <section className="so-preview" aria-label="Live segment preview">
      <p className="so-eyebrow">LIVE COUNT</p>
      <div className="so-preview-stats">
        <div>
          <strong>{summary.count} customers</strong>
          <span>
            {total ? ((summary.count / total) * 100).toFixed(1) : "0"}% of
            active
          </span>
        </div>
        <dl>
          <div>
            <dt>MRR</dt>
            <dd>{money(summary.mrr)}</dd>
          </div>
          <div>
            <dt>Avg tenure</dt>
            <dd>{summary.tenure.toFixed(1)} mo</dd>
          </div>
          <div>
            <dt>At risk</dt>
            <dd>{summary.risk}</dd>
          </div>
        </dl>
      </div>
      {summary.count ? (
        <>
          <div className="so-segments" aria-hidden>
            {summary.groups.map(
              (g, i) =>
                g.count > 0 && (
                  <span
                    key={g.id}
                    data-color={i % 4}
                    style={{ flex: g.count }}
                  />
                ),
            )}
          </div>
          <ul className="so-legend">
            {summary.groups
              .filter((g) => g.count > 0)
              .map((g) => (
                <li key={g.id}>
                  <i data-color={legs.findIndex((l) => l.id === g.id) % 4} />
                  {g.name} <b>{g.count}</b>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <AgentWorkspaceState
          title="No customers match"
          description="Adjust the rules to include more active customers."
        />
      )}
    </section>
  );
}
export function SubscriptionPlanPicker({
  plans,
  value,
  onValueChange,
  disabled = false,
}: {
  plans: Plan[];
  value: string;
  onValueChange: (id: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="so-plan-field" disabled={disabled}>
      <legend>Plan</legend>
      <div className="so-plans">
        {plans.map((p) => (
          <label key={p.id} data-selected={p.id === value || undefined}>
            <span>
              <input
                type="radio"
                name={id}
                value={p.id}
                checked={p.id === value}
                onChange={() => onValueChange(p.id)}
              />
              <b>{p.name}</b>
            </span>
            <strong>
              {money(p.cents)}
              <small>/mo</small>
            </strong>
            <p>{p.description}</p>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function RevenueTargetEditor({
  value,
  onChange,
  customers,
  plans,
  legs,
  today,
}: {
  value: Target;
  onChange: (v: Target) => void;
  customers: Customer[];
  plans: Plan[];
  legs: Leg[];
  today: string;
}) {
  const id = useId(),
    summary = summarize(customers, plans, legs, today),
    amount = parseMoney(value.amount),
    allocation = allocateTarget(amount ?? 0, summary.groups),
    gap = Math.max(0, (amount ?? 0) - summary.mrr),
    arpu = summary.count ? summary.mrr / summary.count : 0,
    error = targetError(value, today);
  return (
    <section className="so-target" aria-label="Revenue target editor">
      <div className="so-field">
        <span>Metric</span>
        <div className="so-readonly">
          <Icon name="chart-line" />
          MRR · monthly recurring revenue
        </div>
      </div>
      <div className="so-pair">
        <label>
          Target (USD)
          <input
            inputMode="decimal"
            aria-invalid={!amount}
            value={value.amount}
            onChange={(e) => onChange({ ...value, amount: e.target.value })}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <small>
            Current {money(summary.mrr)} · gap {amount ? money(gap) : "—"}
          </small>
        </label>
        <label>
          Month
          <input
            type="month"
            min={today.slice(0, 7)}
            value={value.month}
            onChange={(e) => onChange({ ...value, month: e.target.value })}
          />
          <small>Target applies to the selected month</small>
        </label>
      </div>
      <div className="so-switch-row">
        <div>
          <h3>Split across legs</h3>
          <p>Allocate by current MRR share, with exact totals.</p>
        </div>
        <Switch
          checked={value.split}
          onCheckedChange={(split) => onChange({ ...value, split })}
          aria-label="Split across legs"
        />
      </div>
      {value.split && amount !== null && (
        <div className="so-allocation">
          <ul>
            {allocation.map((a) => (
              <li key={a.id}>
                <span>{legs.find((l) => l.id === a.id)?.name}</span>
                <span className="so-meter">
                  <i style={{ width: `${a.share * 100}%` }} />
                </span>
                <span>{(a.share * 100).toFixed(1)}%</span>
                <b>{money(a.cents)}</b>
              </li>
            ))}
          </ul>
          <footer>
            <span>Total</span>
            <strong>
              {money(allocation.reduce((s, a) => s + a.cents, 0))}
            </strong>
          </footer>
          {!summary.mrr && (
            <small>No current MRR. The target is divided equally.</small>
          )}
        </div>
      )}
      {error ? (
        <p id={`${id}-error`} className="so-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="so-notice">
          {gap === 0
            ? "Current MRR already meets this target."
            : arpu
              ? `Approximately ${Math.ceil(gap / arpu)} more subscriptions would close the gap at the current ARPU (${money(Math.round(arpu))}).`
              : "Add active customers to calculate an ARPU-based estimate."}
        </p>
      )}
    </section>
  );
}
