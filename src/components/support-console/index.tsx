import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { formatMoney } from "@/components/activity";
import {
  splitSpend,
  validCents,
  type SpendDay,
  type ApiKeyRecord,
} from "./model";
import "./support-console.css";
export * from "./model";
const money = (cents: number) => formatMoney(cents / 100);

/** Values are integer USD cents. Limit is a reporting threshold, not a spending cap. */
export function SpendLimitChart({
  days,
  dailyLimitCents,
}: {
  days: SpendDay[];
  dailyLimitCents: number;
}) {
  const [selection, setSelection] = useState<string | null>(null);
  const id = useId();
  if (
    !validCents(dailyLimitCents) ||
    days.some((d) => !validCents(d.cents)) ||
    new Set(days.map((d) => d.id)).size !== days.length
  )
    return (
      <AgentWorkspaceState
        error
        title="Spend data unavailable"
        description="Use unique day IDs and non-negative integer amounts in cents."
      />
    );
  if (!days.length)
    return (
      <AgentWorkspaceState
        title="No spending yet"
        description="Daily amounts will appear after your first request."
      />
    );
  const max =
    Math.ceil(
      Math.max(100, dailyLimitCents, ...days.map((d) => d.cents)) / 2500,
    ) * 2500;
  const selected = days.find((d) => d.id === selection) ?? days[0];
  const parts = splitSpend(selected.cents, dailyLimitCents)!;
  return (
    <figure className="qz-spend" aria-labelledby={id}>
      <figcaption id={id} className="qz-chart-caption">
        <strong>Daily spend</strong>
        <span>Daily threshold {money(dailyLimitCents)}</span>
      </figcaption>
      <div
        className="qz-chart-scroll"
        tabIndex={0}
        role="region"
        aria-label="Daily spend chart"
      >
        <div className="qz-chart-plot">
          <div className="qz-chart-axis" aria-hidden>
            {[4, 3, 2, 1, 0].map((n) => (
              <span key={n}>{money((max * n) / 4)}</span>
            ))}
          </div>
          <div
            className="qz-chart-bars"
            style={{ minWidth: `${Math.max(280, days.length * 32)}px` }}
          >
            <div className="qz-chart-grid" aria-hidden>
              {[0, 1, 2, 3, 4].map((n) => (
                <i key={n} />
              ))}
            </div>
            {days.map((day) => {
              const split = splitSpend(day.cents, dailyLimitCents)!;
              return (
                <button
                  type="button"
                  key={day.id}
                  aria-pressed={selected.id === day.id}
                  aria-describedby={`${id}-detail`}
                  aria-label={`${day.label}: ${money(day.cents)}, ${money(split.over)} over threshold`}
                  onFocus={() => setSelection(day.id)}
                  onMouseEnter={() => setSelection(day.id)}
                  onClick={() => setSelection(day.id)}
                  className="qz-chart-day"
                >
                  <span className="qz-chart-column" aria-hidden>
                    <i
                      hidden={split.over === 0}
                      className="qz-spend-over"
                      style={{ height: `${(split.over / max) * 100}%` }}
                    />
                    <i
                      hidden={split.within === 0}
                      className="qz-spend-within"
                      style={{ height: `${(split.within / max) * 100}%` }}
                    />
                  </span>
                  <span className="qz-day-label">{day.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div id={`${id}-detail`} className="qz-spend-detail">
        <strong>{selected.label}</strong>
        <span>
          Within limit <b>{money(parts.within)}</b>
        </span>
        <span>
          Over limit <b>{money(parts.over)}</b>
        </span>
        <span>
          Total <b>{money(selected.cents)}</b>
        </span>
      </div>
      <details className="qz-data">
        <summary>View exact amounts</summary>
        <table>
          <caption className="sr-only">Daily spend in USD</caption>
          <thead>
            <tr>
              <th>Day</th>
              <th>Within limit</th>
              <th>Over limit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => {
              const s = splitSpend(d.cents, dailyLimitCents)!;
              return (
                <tr key={d.id}>
                  <th scope="row">{d.label}</th>
                  <td>{money(s.within)}</td>
                  <td>{money(s.over)}</td>
                  <td>{money(d.cents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export type SecretFieldProps = {
  value: string;
  label?: string;
  onCopy?: (value: string) => Promise<void>;
};
/** Masking is presentation, not security. Never put a secret in persistent table metadata. */
export function SecretField(props: SecretFieldProps) {
  return <SecretFieldValue key={props.value} {...props} />;
}
function SecretFieldValue({
  value,
  label = "API key",
  onCopy = (value) => navigator.clipboard.writeText(value),
}: SecretFieldProps) {
  const [visible, setVisible] = useState(false),
    [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
      "idle",
    );
  const id = useId(),
    alive = useRef(true),
    busy = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function copy() {
    if (busy.current || !value) return;
    busy.current = true;
    setStatus("copying");
    try {
      await onCopy(value);
      if (alive.current) setStatus("copied");
    } catch {
      if (alive.current) setStatus("error");
    } finally {
      busy.current = false;
    }
  }
  return (
    <div className="qz-secret">
      <label htmlFor={id}>{label}</label>
      <div className="qz-secret-control">
        <input
          id={id}
          readOnly
          type={visible ? "text" : "password"}
          value={value}
          autoComplete="off"
          spellCheck={false}
        />
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Reveal"}
        </Button>
        <IconButton
          type="tertiary"
          tapScale={1}
          size="sm"
          aria-label={status === "copied" ? "Copy key again" : "Copy key"}
          disabled={!value || status === "copying"}
          icon={
            <Icon name={status === "copied" ? "check" : "copy"} size="sm" />
          }
          onClick={copy}
        />
      </div>
      <p
        role="status"
        className={
          status === "error" ? "text-status-error" : "text-text-secondary"
        }
      >
        {status === "error"
          ? "Could not copy. Reveal and select the key to copy manually."
          : status === "copying"
            ? "Copying…"
            : status === "copied"
              ? "Copied to clipboard."
              : "Keep this key somewhere safe."}
      </p>
    </div>
  );
}

/** Metadata only. The host owns creation, secret lifetime, revoke confirmation and storage. */
export function ApiKeyTable({
  keys,
  actions,
}: {
  keys: ApiKeyRecord[];
  actions?: (key: ApiKeyRecord) => ReactNode;
}) {
  if (!keys.length)
    return (
      <AgentWorkspaceState
        title="No keys found"
        description="Create a key or try another search."
      />
    );
  return (
    <div
      className="qz-table-scroll"
      role="region"
      aria-label="API keys"
      tabIndex={0}
    >
      <table className="qz-key-table">
        <caption className="sr-only">API key permissions and last use</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Permission</th>
            <th scope="col">Key</th>
            <th scope="col">Last used</th>
            {actions && (
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <th scope="row">
                {key.name}
                {key.revoked && <span className="qz-revoked">Revoked</span>}
              </th>
              <td>
                <Tag color={key.revoked ? "default" : "purple"}>
                  {key.permission}
                </Tag>
              </td>
              <td>
                <code>••••{key.suffix.slice(-4)}</code>
              </td>
              <td>{key.lastUsed}</td>
              {actions && <td>{actions(key)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
