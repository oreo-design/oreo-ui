import { useId, useRef, useState } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { AgentWorkspaceState } from "@/components/automation";
import {
  OPERATOR_LABELS,
  fieldOperators,
  validateCondition,
  TRACE_COLUMNS,
  TRACE_COLUMN_LABELS,
  DEFAULT_TRACE_COLUMNS,
  formatDuration,
  formatTraceTime,
  type QueryField,
  type QueryCondition,
  type QueryOperator,
  type TraceRecord,
  type TraceColumn,
} from "./model";
import "./trace-query.css";
export * from "./model";
function FilterEditor({
  fields,
  condition,
  onApply,
  disabled = false,
}: {
  fields: QueryField[];
  condition?: QueryCondition;
  onApply: (condition: QueryCondition) => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [fieldKey, setFieldKey] = useState(condition?.field ?? ""),
    [operator, setOperator] = useState<QueryOperator>(
      condition?.operator ?? "eq",
    ),
    [value, setValue] = useState(condition?.value ?? ""),
    [error, setError] = useState("");
  const field = fields.find((f) => f.key === fieldKey);
  const id = useId();
  const reset = () => {
    setFieldKey(condition?.field ?? "");
    setOperator(condition?.operator ?? "eq");
    setValue(condition?.value ?? "");
    setError("");
    setQuery("");
  };
  return (
    <div ref={host} className="tq-editor">
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (next) reset();
          setOpen(next);
        }}
      >
        <Popover.Trigger
          disabled={disabled}
          className={`tq-filter-trigger ${condition ? "tq-filter-active" : ""}`}
          aria-label={
            condition
              ? `Edit ${fields.find((f) => f.key === condition.field)?.label ?? condition.field} filter`
              : "Add filter"
          }
        >
          <Icon name="filter" size="sm" />
          {condition ? (
            <>
              <span>
                {fields.find((f) => f.key === condition.field)?.label ??
                  condition.field}
              </span>
              <span className="tq-operator">
                {OPERATOR_LABELS[condition.operator]}
              </span>
              <strong>{condition.value}</strong>
            </>
          ) : (
            <span>Filter traces…</span>
          )}
        </Popover.Trigger>
        <Popover.Portal container={host.current}>
          <Popover.Positioner
            sideOffset={6}
            align="start"
            className="tq-positioner"
          >
            <Popover.Popup className="tq-filter-popup" finalFocus>
              <Popover.Title className="sr-only">
                {condition ? "Edit filter" : "Add filter"}
              </Popover.Title>
              {!field ? (
                <>
                  <label className="tq-field-search">
                    <Icon name="search" size="sm" />
                    <input
                      autoFocus
                      aria-label="Search fields"
                      placeholder="Search fields…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <div className="tq-field-options">
                    {fields
                      .filter((f) =>
                        f.label.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((f) => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => {
                            setFieldKey(f.key);
                            setOperator(fieldOperators(f)[0]);
                            setValue("");
                            setError("");
                          }}
                        >
                          <Icon
                            name={
                              f.type === "number"
                                ? "hash"
                                : f.type === "enum"
                                  ? "sliders"
                                  : "scan-text"
                            }
                            size="sm"
                          />
                          {f.label}
                          <Icon name="chevron-right" size="sm" />
                        </button>
                      ))}
                    {!fields.some((f) =>
                      f.label.toLowerCase().includes(query.toLowerCase()),
                    ) && (
                      <p className="tq-no-fields">
                        No fields match. Try another search.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const next = {
                      id: condition?.id ?? crypto.randomUUID(),
                      field: field.key,
                      operator,
                      value: value.trim(),
                    };
                    const problem = validateCondition(next, fields);
                    if (problem) {
                      setError(problem);
                      return;
                    }
                    onApply(next);
                    setOpen(false);
                  }}
                  noValidate
                >
                  <button
                    className="tq-back"
                    type="button"
                    onClick={() => {
                      setFieldKey("");
                      setError("");
                    }}
                  >
                    <Icon name="chevron-left" size="sm" />
                    {field.label}
                  </button>
                  <label>
                    Condition
                    <select
                      autoFocus={field.type === "enum"}
                      value={operator}
                      onChange={(e) =>
                        setOperator(e.target.value as QueryOperator)
                      }
                    >
                      {fieldOperators(field).map((op) => (
                        <option value={op} key={op}>
                          {OPERATOR_LABELS[op]}
                        </option>
                      ))}
                    </select>
                  </label>
                  {field.type === "enum" ? (
                    <div className="tq-enum-value">
                      <span>Value</span>
                      <InlineSearchSelect
                        label="Filter value"
                        placeholder="Choose a value…"
                        options={(field.options ?? []).map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        value={value}
                        onValueChange={setValue}
                      />
                    </div>
                  ) : (
                    <label>
                      Value
                      <input
                        autoFocus
                        aria-label="Filter value"
                        type={field.type === "number" ? "number" : "text"}
                        step="any"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        aria-invalid={!!error}
                        aria-describedby={error ? id : undefined}
                      />
                    </label>
                  )}
                  {error && (
                    <p role="alert" className="tq-error" id={id}>
                      {error}
                    </p>
                  )}
                  <div className="tq-filter-actions">
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      tapScale={1}
                      render={<button type="submit" />}
                    >
                      Apply filter
                    </Button>
                  </div>
                </form>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
export function QueryFilterBar({
  fields,
  value,
  onChange,
  disabled = false,
}: {
  fields: QueryField[];
  value: QueryCondition[];
  onChange: (value: QueryCondition[]) => void;
  disabled?: boolean;
}) {
  return (
    <div className="tq-filter-bar" role="group" aria-label="Trace conditions">
      <span className="sr-only">All conditions must match.</span>
      {value.map((condition) => (
        <div className="tq-filter-chip" key={condition.id}>
          <FilterEditor
            fields={fields}
            condition={condition}
            disabled={disabled}
            onApply={(next) =>
              onChange(value.map((c) => (c.id === next.id ? next : c)))
            }
          />
          <IconButton
            className="tq-filter-remove"
            type="tertiary"
            size="sm"
            tapScale={1}
            disabled={disabled}
            aria-label={`Remove ${fields.find((f) => f.key === condition.field)?.label ?? condition.field} filter`}
            icon={<Icon name="x" size="sm" />}
            onClick={() => onChange(value.filter((c) => c.id !== condition.id))}
          />
        </div>
      ))}
      <FilterEditor
        fields={fields}
        disabled={disabled || fields.length === 0}
        onApply={(next) => onChange([...value, next])}
      />
      {value.length > 0 && (
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          disabled={disabled}
          onClick={() => onChange([])}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
export function TraceTable({
  traces,
  columns = DEFAULT_TRACE_COLUMNS,
  selectedId,
  onSelect,
  loading = false,
  error,
  onRetry,
  onClear,
}: {
  traces: TraceRecord[];
  columns?: TraceColumn[];
  selectedId?: string;
  onSelect: (trace: TraceRecord) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onClear?: () => void;
}) {
  const requested = TRACE_COLUMNS.filter((c) => columns.includes(c));
  const shown = requested.length ? requested : ["name" as const];
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Traces unavailable"
        description={error}
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  if (!loading && !traces.length)
    return (
      <AgentWorkspaceState
        title="No traces match"
        description="Try a wider time range or remove a filter to find more runs."
        actionLabel={onClear ? "Reset query" : undefined}
        onAction={onClear}
      />
    );
  const cell = (t: TraceRecord, c: TraceColumn) => {
    switch (c) {
      case "startedAt":
        return (
          <time dateTime={t.startedAt}>{formatTraceTime(t.startedAt)}</time>
        );
      case "kind":
        return (
          <span className="tq-kind">
            <Icon
              name={
                t.kind === "Agent"
                  ? "assistant"
                  : t.kind === "Workflow"
                    ? "list-checks"
                    : "gauge"
              }
              size="sm"
            />
            {t.kind}
          </span>
        );
      case "status":
        return (
          <Tag
            color={
              t.status === "success"
                ? "mint"
                : t.status === "error"
                  ? "pink"
                  : "blue"
            }
          >
            {t.status === "success"
              ? "OK"
              : t.status === "error"
                ? "ERR"
                : "Running"}
          </Tag>
        );
      case "durationMs":
        return formatDuration(t.durationMs);
      case "costUsd":
        return t.costUsd === null ? "—" : `$${t.costUsd.toFixed(4)}`;
      case "score":
        return t.score === null ? "—" : t.score.toFixed(2);
      case "feedback":
        return t.feedback ?? "—";
      default:
        return t[c];
    }
  };
  return (
    <div className="tq-table-wrap" aria-busy={loading}>
      <div
        className="tq-table-scroll"
        role="region"
        aria-label="Trace results"
        tabIndex={0}
      >
        <table className="tq-table">
          <caption className="sr-only">
            Trace results. Times in UTC; each row opens full trace details.
          </caption>
          <thead>
            <tr>
              {shown.map((c) => (
                <th key={c} scope="col" className={`tq-col-${c}`}>
                  {TRACE_COLUMN_LABELS[c]}
                </th>
              ))}
              <th scope="col">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && !traces.length
              ? Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} aria-hidden>
                    {shown.map((c) => (
                      <td key={c}>
                        <span className="tq-skeleton" />
                      </td>
                    ))}
                    <td>
                      <span className="tq-skeleton" />
                    </td>
                  </tr>
                ))
              : traces.map((t) => (
                  <tr
                    key={t.id}
                    data-selected={selectedId === t.id || undefined}
                  >
                    {shown.map((c) => (
                      <td
                        key={c}
                        className={`tq-col-${c}`}
                        title={c === "input" ? t.input : undefined}
                      >
                        {c === "input" ? (
                          <span className="tq-input-preview">{cell(t, c)}</span>
                        ) : (
                          cell(t, c)
                        )}
                      </td>
                    ))}
                    <td>
                      <IconButton
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        aria-label={`Open trace ${t.id}`}
                        icon={<Icon name="arrow-up-right" size="sm" />}
                        onClick={() => onSelect(t)}
                      />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <span role="status" className="sr-only">
          {traces.length ? "Refreshing traces" : "Loading traces"}
        </span>
      )}
    </div>
  );
}
