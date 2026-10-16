import { useEffect, useId, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { IconButton } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import {
  CURRENCIES,
  formatCurrency,
  balanceTotal,
  validMinor,
  type Currency,
  type CurrencyAccount,
  type MoneyEntry,
  type CashFlowDay,
} from "./model";
import "./currency-finance.css";
export * from "./model";
export function CurrencyBalanceCard({
  account,
  selected = false,
  hidden = false,
  onSelect,
}: {
  account: CurrencyAccount;
  selected?: boolean;
  hidden?: boolean;
  onSelect?: (currency: Currency) => void;
}) {
  const body = (
    <>
      <span className="cf-flag" aria-hidden="true">
        {CURRENCIES[account.currency].flag}
      </span>
      <span className="cf-account-name">
        {CURRENCIES[account.currency].name}
        <span>{account.currency}</span>
      </span>
      <strong>
        {hidden ? (
          <>
            <span aria-hidden="true">••••••</span>
            <span className="sr-only">Balance hidden</span>
          </>
        ) : (
          formatCurrency(account.balance, account.currency)
        )}
      </strong>
    </>
  );
  return onSelect ? (
    <button
      type="button"
      className="cf-account"
      aria-pressed={selected}
      onClick={() => onSelect(account.currency)}
    >
      {body}
    </button>
  ) : (
    <article className="cf-account">{body}</article>
  );
}
export function CurrencyBalanceSummary({
  accounts,
  base = "USD",
  hidden = false,
  onVisibilityChange,
}: {
  accounts: CurrencyAccount[];
  base?: Currency;
  hidden?: boolean;
  onVisibilityChange?: (hidden: boolean) => void;
}) {
  return (
    <section className="cf-summary" aria-label="Combined account balance">
      <div className="cf-flag-stack" aria-hidden="true">
        {accounts.map((a) => (
          <span key={a.currency}>{CURRENCIES[a.currency].flag}</span>
        ))}
      </div>
      <p>
        Total balance <span>in {base}</span>
      </p>
      <div>
        <strong>
          {hidden ? (
            <>
              <span aria-hidden="true">••••••••</span>
              <span className="sr-only">Balance hidden</span>
            </>
          ) : (
            formatCurrency(balanceTotal(accounts, base), base)
          )}
        </strong>
        {onVisibilityChange && (
          <IconButton
            type="secondary"
            tapScale={1}
            size="sm"
            aria-label={hidden ? "Show balances" : "Hide balances"}
            aria-pressed={hidden}
            onClick={() => onVisibilityChange(!hidden)}
            icon={<Icon name={hidden ? "lock" : "scan-text"} size="sm" />}
          />
        )}
      </div>
      <small>Combined using fixed illustrative rates</small>
    </section>
  );
}
const kindLabel: Record<MoneyEntry["kind"], string> = {
  in: "Received",
  out: "Sent",
  exchange: "Converted",
  request: "Request draft",
  scheduled: "Scheduled draft",
};
const kindIcon: Record<MoneyEntry["kind"], IconName> = {
  in: "arrow-down",
  out: "arrow-up-right",
  exchange: "refresh",
  request: "copy",
  scheduled: "calendar",
};
export function MoneyActivityList({
  entries,
  onOpen,
  loading = false,
  error,
  onRetry,
  onReset,
}: {
  entries: MoneyEntry[];
  onOpen?: (entry: MoneyEntry) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onReset?: () => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Activity unavailable"
        description={error}
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  if (loading && !entries.length)
    return (
      <div
        className="cf-activity-skeleton"
        role="status"
        aria-label="Loading activity"
      >
        {[0, 1, 2, 3].map((n) => (
          <div key={n}>
            <i />
            <span />
            <b />
          </div>
        ))}
      </div>
    );
  if (!entries.length)
    return (
      <AgentWorkspaceState
        title="No transactions to show"
        description="Your activity will appear here. Try another search or choose all accounts."
        actionLabel={onReset ? "Clear filters" : undefined}
        onAction={onReset}
      />
    );
  return (
    <ul className="cf-activity" aria-label="Money activity" aria-busy={loading}>
      {entries.map((entry) => {
        const content = (
          <>
            <span className="cf-entry-icon" data-kind={entry.kind}>
              <Icon name={kindIcon[entry.kind]} size="sm" />
            </span>
            <span className="cf-entry-copy">
              <strong>{entry.description}</strong>
              <small>
                {kindLabel[entry.kind]} · {entry.date} · {entry.currency}
              </small>
            </span>
            <span className="cf-entry-amount" data-kind={entry.kind}>
              {entry.kind === "in" ? "+" : entry.kind === "out" ? "−" : ""}
              {formatCurrency(entry.amount, entry.currency)}
              {entry.to && entry.received !== undefined && (
                <small>→ {formatCurrency(entry.received, entry.to)}</small>
              )}
            </span>
          </>
        );
        return (
          <li key={entry.id}>
            {onOpen ? (
              <button type="button" onClick={() => onOpen(entry)}>
                {content}
              </button>
            ) : (
              <div>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
export function CashFlowBars({
  days,
  label = "Cash flow in USD",
}: {
  days: CashFlowDay[];
  label?: string;
}) {
  const id = useId(),
    [selected, setSelected] = useState<string | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const firstDate = days[0]?.date,
    lastDate = days[days.length - 1]?.date;
  useEffect(() => {
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [firstDate, lastDate]);
  if (
    days.some((d) => !validMinor(d.incoming) || !validMinor(d.outgoing)) ||
    new Set(days.map((d) => d.date)).size !== days.length
  )
    return (
      <AgentWorkspaceState
        error
        title="Cash flow unavailable"
        description="Supply unique dates and non-negative integer USD cents."
      />
    );
  if (!days.length)
    return (
      <AgentWorkspaceState
        title="No cash flow yet"
        description="Completed incoming and outgoing payments will appear here."
      />
    );
  const max = Math.max(100, ...days.flatMap((d) => [d.incoming, d.outgoing])),
    current = days.find((d) => d.date === selected) ?? days[days.length - 1];
  return (
    <figure className="cf-flow" aria-labelledby={id}>
      <figcaption id={id}>
        <span>{label}</span>
        <span>
          <i />
          Incoming <i />
          Outgoing
        </span>
      </figcaption>
      <div className="cf-flow-plot">
        <div className="cf-flow-axis" aria-hidden="true">
          <span>{formatCurrency(max, "USD")}</span>
          <span>{formatCurrency(max / 2, "USD")}</span>
          <span>$0</span>
        </div>
        <div
          ref={scroll}
          className="cf-flow-scroll"
          role="region"
          aria-label="Cash flow bars"
          tabIndex={0}
        >
          <div
            className="cf-flow-columns"
            style={{ minWidth: Math.max(300, days.length * 38) }}
          >
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                aria-pressed={current.date === day.date}
                aria-label={`${day.date}, incoming ${formatCurrency(day.incoming, "USD")}, outgoing ${formatCurrency(day.outgoing, "USD")}`}
                aria-describedby={`${id}-readout`}
                onClick={() => setSelected(day.date)}
                onFocus={() => setSelected(day.date)}
                onMouseEnter={() => setSelected(day.date)}
              >
                <span className="cf-flow-pair">
                  <i style={{ height: `${(day.incoming / max) * 100}%` }} />
                  <i style={{ height: `${(day.outgoing / max) * 100}%` }} />
                </span>
                <small>{day.date.slice(8)}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="cf-flow-hint">Scroll to explore earlier dates</p>
      <p id={`${id}-readout`} className="cf-flow-readout">
        <strong>{current.date}</strong>
        <span>In {formatCurrency(current.incoming, "USD")}</span>
        <span>Out {formatCurrency(current.outgoing, "USD")}</span>
      </p>
      <details className="cf-exact">
        <summary>View exact amounts</summary>
        <div>
          <table>
            <caption className="sr-only">{label}</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Incoming</th>
                <th>Outgoing</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}>
                  <th scope="row">{d.date}</th>
                  <td>{formatCurrency(d.incoming, "USD")}</td>
                  <td>{formatCurrency(d.outgoing, "USD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
