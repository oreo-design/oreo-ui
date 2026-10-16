import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import {
  formatCurrency,
  balanceTotal,
} from "@/components/currency-finance/model";
import {
  balanceChange,
  sparkHeights,
  type BankAccount,
  type FinanceNotice,
} from "./model";
import "./finance-overview.css";
export * from "./model";
/** Both layers occupy one grid slot. Skeleton sets a stable minimum size; content remains inert until ready. */
export function SkeletonReveal({
  loading,
  hasData = false,
  skeleton,
  children,
  delay = 0,
  animate = true,
  label = "Loading content",
}: {
  loading: boolean;
  hasData?: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number;
  animate?: boolean;
  label?: string;
}) {
  const keyboard = useRef(false);
  useEffect(() => {
    const key = () => {
        keyboard.current = true;
      },
      pointer = () => {
        keyboard.current = false;
      };
    document.addEventListener("keydown", key, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);
  const pending = loading && !hasData;
  return (
    <div
      className="fo-reveal"
      aria-busy={loading}
      data-pending={pending}
      data-animate={animate && !keyboard.current}
      style={
        {
          "--reveal-delay": `${Math.min(120, Math.max(0, Number.isFinite(delay) ? delay : 0))}ms`,
        } as CSSProperties
      }
    >
      <div className="fo-skeleton-layer" aria-hidden="true" inert>
        {skeleton}
      </div>
      <div
        className="fo-content-layer"
        aria-hidden={pending || undefined}
        inert={pending || undefined}
      >
        {children}
      </div>
      {pending && (
        <span className="sr-only" role="status">
          {label}
        </span>
      )}
    </div>
  );
}
export function BalanceSparkBars({
  values,
  label = "Balance trend",
}: {
  values: number[];
  label?: string;
}) {
  const heights = sparkHeights(values);
  return heights.length ? (
    <span
      className="fo-spark"
      role="img"
      aria-label={`${label}: ${values.join(", ")}`}
    >
      <span aria-hidden="true">
        {heights.map((height, i) => (
          <i key={i} style={{ height: `${height}%` }} />
        ))}
      </span>
    </span>
  ) : (
    <span className="text-xs text-text-tertiary">No trend</span>
  );
}
const kindIcon: Record<FinanceNotice["kind"], IconName> = {
  forecast: "warning-circle",
  bill: "list-checks",
  collection: "users",
  reconcile: "refresh",
};
function RowSkeleton({ account = false }: { account?: boolean }) {
  return (
    <div className={account ? "fo-account-skeleton" : "fo-notice-skeleton"}>
      <i />
      <div>
        <i />
        <i />
        {!account && <i />}
      </div>
      {account && (
        <>
          <i className="fo-spark-placeholder" />
          <div>
            <i />
            <i />
          </div>
        </>
      )}
    </div>
  );
}
export function FinanceAttentionList({
  items,
  loading = false,
  hasData = items.length > 0,
  error,
  onRetry,
  onOpen,
  animate = true,
}: {
  items: FinanceNotice[];
  loading?: boolean;
  hasData?: boolean;
  error?: string;
  onRetry?: () => void;
  onOpen?: (item: FinanceNotice) => void;
  animate?: boolean;
}) {
  const id = useId();
  const pending = loading && !hasData;
  return (
    <section className="fo-panel fo-attention" aria-labelledby={id}>
      <header>
        <Icon name="warning-circle" />
        <h2 id={id}>Needs attention</h2>
        <span className="fo-count">
          {pending || (error && !hasData) ? "—" : items.length}
        </span>
      </header>
      <div className="fo-panel-inner">
        {error && (
          <AgentWorkspaceState
            error
            title="Attention feed unavailable"
            description={error}
            actionLabel="Try again"
            onAction={onRetry}
          />
        )}
        {!error && !pending && !items.length ? (
          <AgentWorkspaceState
            title="You’re all caught up"
            description="Nothing needs your attention right now."
          />
        ) : (
          <div>
            {(pending ? Array.from({ length: 4 }, () => null) : items).map(
              (item, index) => (
                <SkeletonReveal
                  key={index}
                  loading={loading}
                  hasData={hasData}
                  skeleton={<RowSkeleton />}
                  animate={animate}
                  delay={index * 30}
                  label="Loading attention item"
                >
                  {item && (
                    <article className="fo-notice">
                      <span className="fo-tile" data-tone={item.kind}>
                        <Icon name={kindIcon[item.kind]} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        {onOpen && (
                          <Button
                            type="tertiary"
                            size="sm"
                            tapScale={1}
                            disabled={loading}
                            trailingIcon={
                              <Icon name="arrow-up-right" size="sm" />
                            }
                            onClick={() => onOpen(item)}
                          >
                            {item.action}
                          </Button>
                        )}
                      </div>
                    </article>
                  )}
                </SkeletonReveal>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
export function BankAccountList({
  accounts,
  loading = false,
  hasData = accounts.length > 0,
  error,
  onRetry,
  onOpen,
  onConnect,
  filtered = false,
  onClear,
  animate = true,
}: {
  accounts: BankAccount[];
  loading?: boolean;
  hasData?: boolean;
  error?: string;
  onRetry?: () => void;
  onOpen?: (account: BankAccount) => void;
  onConnect?: () => void;
  filtered?: boolean;
  onClear?: () => void;
  animate?: boolean;
}) {
  const id = useId();
  const pending = loading && !hasData;
  return (
    <section className="fo-panel" aria-labelledby={id}>
      <header>
        <Icon name="columns" />
        <h2 id={id}>Bank accounts</h2>
        <strong className="fo-total">
          {pending || (error && !hasData)
            ? "—"
            : formatCurrency(balanceTotal(accounts, "USD"), "USD")}
        </strong>
      </header>
      <div className="fo-panel-inner">
        {error && (
          <AgentWorkspaceState
            error
            title="Accounts unavailable"
            description={error}
            actionLabel="Try again"
            onAction={onRetry}
          />
        )}
        {!error && !pending && !accounts.length ? (
          <AgentWorkspaceState
            title={filtered ? "No matching accounts" : "No accounts yet"}
            description={
              filtered
                ? "Search a different name, bank or account ending."
                : "Connect a sample account to explore your balances."
            }
            actionLabel={filtered ? "Clear search" : "Add sample account"}
            onAction={filtered ? onClear : onConnect}
          />
        ) : (
          <div>
            {(pending ? Array.from({ length: 5 }, () => null) : accounts).map(
              (account, index) => (
                <SkeletonReveal
                  key={index}
                  loading={loading}
                  hasData={hasData}
                  skeleton={<RowSkeleton account />}
                  animate={animate}
                  delay={index * 30}
                  label="Loading bank account"
                >
                  {account &&
                    (() => {
                      const change = balanceChange(account.history);
                      const content = (
                        <>
                          <span className="fo-tile" data-tone={account.tone}>
                            <Icon name="columns" />
                          </span>
                          <span className="fo-account-name">
                            <strong>
                              {account.name} <span>••{account.last4}</span>
                            </strong>
                            <small>{account.bank}</small>
                          </span>
                          <BalanceSparkBars
                            values={account.history}
                            label={`${account.name} balance history in minor units`}
                          />
                          <span className="fo-account-balance">
                            <strong>
                              {formatCurrency(
                                account.balance,
                                account.currency,
                              )}
                            </strong>
                            <small>
                              {change === null
                                ? "No comparison"
                                : `${change > 0 ? "+" : ""}${change.toFixed(1)}% this week`}
                            </small>
                          </span>
                        </>
                      );
                      return onOpen ? (
                        <button
                          type="button"
                          className="fo-account"
                          disabled={loading}
                          aria-label={`View ${account.name} ending ${account.last4}`}
                          onClick={() => onOpen(account)}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className="fo-account">{content}</div>
                      );
                    })()}
                </SkeletonReveal>
              ),
            )}
          </div>
        )}
        {onConnect && (
          <SkeletonReveal
            loading={loading}
            hasData={hasData}
            skeleton={<RowSkeleton account />}
            animate={animate}
            delay={120}
            label="Loading account connection"
          >
            <div className="fo-connect">
              <span className="fo-tile">
                <Icon name="plus" />
              </span>
              <div>
                <strong>Add account</strong>
                <p>Sample connection · read-only</p>
              </div>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                disabled={loading}
                trailingIcon={<Icon name="arrow-up-right" size="sm" />}
                onClick={onConnect}
              >
                Connect
              </Button>
            </div>
          </SkeletonReveal>
        )}
      </div>
      <p className="fo-rate-note">
        {filtered ? "Matching accounts" : "Total"} in USD · fixed sample FX: €1
        = $1.10
      </p>
    </section>
  );
}
