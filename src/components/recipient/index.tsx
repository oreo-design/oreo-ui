import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  PAYMENT_RAILS,
  emptyRecipient,
  recipientName,
  recipientDestination,
  validateRecipient,
  type PaymentRail,
  type Recipient,
  type RecipientDraft,
  type RecipientErrors,
} from "./model";
import "./recipient.css";
export * from "./model";
export function PaymentRailPicker({
  value,
  onValueChange,
  disabled = false,
}: {
  value: PaymentRail;
  onValueChange: (rail: PaymentRail) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="payment-rail-picker" disabled={disabled}>
      <legend>Payment details</legend>
      <div>
        {PAYMENT_RAILS.map((r) => (
          <label key={r.id} data-selected={value === r.id || undefined}>
            <input
              type="radio"
              name={id}
              value={r.id}
              checked={value === r.id}
              onChange={() => onValueChange(r.id)}
            />
            <span aria-hidden className={`rail-mark rail-${r.id}`}>
              {r.mark}
            </span>
            <span>
              <strong>{r.currency}</strong> <small>{r.label}</small>
            </span>
            <Icon name="check" size="sm" className="rail-check" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function RecipientSearch({
  recipients,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  onCreate,
  creating = false,
}: {
  creating?: boolean;
  recipients: Recipient[];
  query: string;
  onQueryChange: (query: string) => void;
  selectedId?: string;
  onSelect: (recipient: Recipient) => void;
  onCreate?: (name: string) => void;
}) {
  const matches = recipients.filter((r) =>
    `${recipientName(r)} ${r.email}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <section className="recipient-search" aria-label="Choose a recipient">
      <label className="recipient-search-field">
        <Icon name="search" />
        <input
          type={creating ? "text" : "search"}
          readOnly={creating}
          aria-label="Search recipients"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>
      {!creating && (
        <>
          <p className="recipient-result-count" role="status">
            {matches.length} {matches.length === 1 ? "recipient" : "recipients"}
          </p>
          <ul>
            {matches.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  aria-pressed={selectedId === r.id}
                  onClick={() => onSelect(r)}
                >
                  <span className="recipient-monogram" aria-hidden>
                    {recipientName(r).slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    <strong>{recipientName(r)}</strong>
                    <small>{recipientDestination(r)}</small>
                  </span>
                  <Tag>
                    {PAYMENT_RAILS.find((p) => p.id === r.rail)!.currency}
                  </Tag>
                  {selectedId === r.id ? (
                    <Icon name="check" />
                  ) : (
                    <Icon name="chevron-right" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          {!matches.length && !onCreate && (
            <AgentWorkspaceState
              title="No recipients found"
              description="Try another name or email address."
            />
          )}
          {onCreate && (
            <Button
              type="tertiary"
              className="recipient-add"
              tapScale={1}
              leadingIcon={<Icon name="plus" />}
              onClick={() => onCreate(query.trim())}
            >
              {query.trim()
                ? `Add “${query.trim()}” as a recipient`
                : "Add a new recipient"}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
/** Owns a local draft. Remount with a new key when changing the edited recipient. */
export function RecipientForm({
  initialValue,
  initialName = "",
  onSave,
  onCancel,
}: {
  initialValue?: RecipientDraft;
  initialName?: string;
  onSave: (value: RecipientDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(() => ({
      ...(initialValue ?? emptyRecipient(initialName)),
    })),
    [errors, setErrors] = useState<RecipientErrors>({});
  const id = useId(),
    form = useRef<HTMLFormElement>(null);
  function patch<K extends keyof RecipientDraft>(
    key: K,
    value: RecipientDraft[K],
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }
  function save(e: FormEvent) {
    e.preventDefault();
    const next = validateRecipient(draft);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      iban: draft.iban.replace(/\s/g, "").toUpperCase(),
      bic: draft.bic.trim().toUpperCase(),
      wallet: draft.wallet.trim(),
      routing: draft.routing.replace(/\s/g, ""),
      account: draft.account.trim(),
    });
  }
  const field = (
    key: keyof RecipientDraft,
    label: string,
    placeholder = "",
    wide = false,
  ) => (
    <label className={wide ? "rf-wide" : undefined} key={key}>
      {label}
      <input
        name={key}
        aria-label={label}
        value={draft[key]}
        placeholder={placeholder}
        maxLength={key === "email" ? 254 : 120}
        inputMode={
          key === "email"
            ? "email"
            : ["routing", "account"].includes(key) && draft.rail === "ach"
              ? "numeric"
              : "text"
        }
        autoComplete="off"
        aria-invalid={!!errors[key] || undefined}
        aria-describedby={errors[key] ? `${id}-${key}` : undefined}
        onChange={(e) => patch(key, e.target.value as never)}
      />
      {errors[key] && (
        <small id={`${id}-${key}`} className="recipient-field-error">
          {errors[key]}
        </small>
      )}
    </label>
  );
  const selectField = (
    key: "country" | "bankCountry" | "network",
    label: string,
    options: string[],
  ) => (
    <label>
      {label}
      <select value={draft[key]} onChange={(e) => patch(key, e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
  const countries = ["United States", "United Kingdom", "Germany", "France"];
  return (
    <form ref={form} className="recipient-form" onSubmit={save} noValidate>
      <header>
        <div>
          <span className="recipient-monogram" aria-hidden>
            <Icon name={draft.kind === "business" ? "folder" : "users"} />
          </span>
          <strong>{recipientName(draft) || "New recipient"}</strong>
        </div>
        <fieldset>
          <legend className="sr-only">Recipient type</legend>
          {(["business", "individual"] as const).map((kind) => (
            <label key={kind}>
              <input
                type="radio"
                name={`${id}-kind`}
                value={kind}
                checked={draft.kind === kind}
                onChange={() => {
                  patch("kind", kind);
                  setErrors({});
                }}
              />
              {kind === "business" ? "Business" : "Individual"}
            </label>
          ))}
        </fieldset>
      </header>
      <div className="rf-scroll">
        <div className="rf-fields">
          {draft.kind === "business" ? (
            field("name", "Legal business name", "Northstar Studio", true)
          ) : (
            <>
              {field("firstName", "First name", "Alex")}
              {field("lastName", "Last name", "Morgan")}
            </>
          )}
          {field("email", "Email", "finance@example.com", true)}
        </div>
        <PaymentRailPicker
          value={draft.rail}
          onValueChange={(rail) => {
            patch("rail", rail);
            setErrors({});
          }}
        />
        <div className="rf-fields rf-bank">
          {draft.rail === "ach" && (
            <>
              {field("routing", "Routing number", "9 digits")}
              {field("account", "Account number", "4–17 digits")}
            </>
          )}
          {draft.rail === "swift" && (
            <>
              {field("bic", "SWIFT / BIC code", "8 or 11 characters")}
              {field("account", "Account number")}
              {selectField("bankCountry", "Bank country", countries)}
            </>
          )}
          {draft.rail === "sepa" && (
            <>
              {field("iban", "IBAN", "Country code and account number", true)}
              {field("bic", "BIC", "8 or 11 characters")}
            </>
          )}
          {draft.rail !== "usdc" ? (
            field("bank", "Bank name")
          ) : (
            <>
              {selectField("network", "Network", [
                "Ethereum",
                "Base",
                "Polygon",
                "Arbitrum",
              ])}
              {field("wallet", "Wallet address", "0x…", true)}
            </>
          )}
        </div>
        <h3>Recipient address</h3>
        <div className="rf-fields">
          {selectField("country", "Country", countries)}
          {field("street", "Street address", "Street and number", true)}
          {field("city", "City")}
          {field("postal", "Postal code")}
        </div>
        <p className="rf-note">
          Demo form · Basic format checks only. No account or address is
          verified.
        </p>
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="recipient-field-error">
            Check the highlighted fields to continue.
          </p>
        )}
      </div>
      <footer>
        <Button type="secondary" tapScale={1} onClick={onCancel}>
          Cancel
        </Button>
        <Button tapScale={1} render={<button type="submit" />}>
          {initialValue ? "Save recipient" : "Add recipient"}
        </Button>
      </footer>
    </form>
  );
}
