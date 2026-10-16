import { useId, type ReactNode } from "react";
import { Button } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import { money, type SavedMethod, type CheckoutQuote } from "./model";
import "./checkout.css";
export * from "./model";
export function SavedPaymentMethods({
  methods,
  value,
  onValueChange,
  onEdit,
  onRemove,
  onAdd,
  disabled = false,
  loading = false,
  error,
  onRetry,
}: {
  methods: SavedMethod[];
  value?: string;
  onValueChange: (id: string) => void;
  onEdit?: (method: SavedMethod) => void;
  onRemove?: (method: SavedMethod) => void;
  onAdd?: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const id = useId();
  if (error)
    return (
      <AgentWorkspaceState
        title="Payment methods unavailable"
        description={error}
        error
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  if (loading && !methods.length)
    return (
      <div
        className="co-methods"
        aria-busy="true"
        aria-label="Loading payment methods"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="co-skeleton" />
        ))}
      </div>
    );
  if (!methods.length)
    return (
      <AgentWorkspaceState
        title="No saved payment methods"
        description="Add a sample payment method to continue."
        actionLabel={onAdd ? "Add sample method" : undefined}
        onAction={onAdd}
      />
    );
  return (
    <fieldset
      className="co-methods"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      <legend className="sr-only">Saved payment methods</legend>
      {methods.map((m) => (
        <div
          className="co-method"
          data-selected={m.id === value || undefined}
          key={m.id}
        >
          <label className="co-method-choice">
            <span className="co-brand" aria-hidden="true">
              {m.brand === "Mastercard"
                ? "MC"
                : m.brand === "Wallet"
                  ? "W"
                  : "VISA"}
            </span>
            <span>
              <strong>
                {m.brand === "Wallet"
                  ? m.name
                  : `${m.brand} ending in ${m.last4}`}
              </strong>
              <span className="co-muted">
                {m.brand === "Wallet" ? m.detail : `Expiry ${m.expiry}`}
              </span>
            </span>
            <input
              type="radio"
              name={id}
              value={m.id}
              checked={value === m.id}
              onChange={() => onValueChange(m.id)}
            />
          </label>
          <div className="co-method-actions">
            {onRemove && (
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                onClick={() => onRemove(m)}
                aria-label={`Remove ${m.brand} ${m.last4 ?? m.name}`}
              >
                Remove
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                onClick={() => onEdit(m)}
                aria-label={`Edit ${m.brand} ${m.last4 ?? m.name}`}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
export function DiscountCodeField({
  value,
  onValueChange,
  onApply,
  onRemove,
  applied,
  error,
  disabled = false,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onApply: () => void;
  onRemove?: () => void;
  applied?: string;
  error?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="co-discount">
      <label htmlFor={id}>Discount code</label>
      <div className="co-discount-input">
        <input
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onApply();
            }
          }}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={`${id}-status`}
          placeholder="Enter code"
        />
        <Button
          size="sm"
          type="secondary"
          tapScale={1}
          disabled={disabled || !value.trim()}
          onClick={onApply}
        >
          Apply
        </Button>
      </div>
      <p
        id={`${id}-status`}
        className={error ? "co-error" : "co-muted"}
        role={error ? "alert" : "status"}
      >
        {error ||
          (applied
            ? `${applied} applied`
            : "Try FRIENDS for 20% off in this demo.")}
      </p>
      {applied && onRemove && (
        <Button
          size="sm"
          type="tertiary"
          tapScale={1}
          disabled={disabled}
          onClick={onRemove}
        >
          Remove discount
        </Button>
      )}
    </div>
  );
}
export function CheckoutSummary({
  title = "Summary",
  item,
  period,
  quote,
  children,
  action,
}: {
  title?: string;
  item: string;
  period: string;
  quote: CheckoutQuote;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="co-summary" aria-label={title}>
      <h2>{title}</h2>
      <div className="co-line">
        <div>
          <strong>{item}</strong>
          <p className="co-muted">{period}</p>
        </div>
        <strong>{money(quote.subtotal)}</strong>
      </div>
      {children && <div className="co-summary-middle">{children}</div>}
      <dl className="co-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(quote.subtotal)}</dd>
        </div>
        {quote.discount > 0 && (
          <div>
            <dt>
              Discount <span>{quote.discountBps / 100}%</span>
            </dt>
            <dd>−{money(quote.discount)}</dd>
          </div>
        )}
        <div>
          <dt>
            Demo tax <span>{quote.taxBps / 100}%</span>
          </dt>
          <dd>+{money(quote.tax)}</dd>
        </div>
      </dl>
      <p className="co-tax-note">
        Tax calculated on{" "}
        {quote.taxBasis === "subtotal"
          ? "the pre-discount subtotal"
          : "the discounted subtotal"}
        .
      </p>
      <div className="co-due">
        <strong>Due today</strong>
        <strong>{money(quote.total)}</strong>
      </div>
      {action && <div className="co-summary-action">{action}</div>}
    </section>
  );
}
