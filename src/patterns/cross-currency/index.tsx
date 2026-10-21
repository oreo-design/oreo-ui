import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import {
  CurrencyBalanceCard,
  CurrencyBalanceSummary,
  MoneyActivityList,
  CashFlowBars,
  CURRENCIES,
  DEMO_TODAY,
  formatCurrency,
  convertMinor,
  parseMinor,
  applyOperation,
  visibleEntries,
  cashFlowDays,
  type Currency,
  type Wallet,
  type MoneyEntry,
  type MoneyOperation,
} from "@/components/currency-finance";
import { INITIAL_WALLET } from "./data";
import "./cross-currency.css";
const actions: { kind: MoneyEntry["kind"]; label: string; icon: IconName }[] = [
  { kind: "in", label: "Add money", icon: "plus" },
  { kind: "out", label: "Send", icon: "paper-plane" },
  { kind: "exchange", label: "Convert money", icon: "refresh" },
  { kind: "request", label: "Request", icon: "arrow-down" },
];
const titles: Record<string, string> = {
  in: "Add demo money",
  out: "Send demo payment",
  exchange: "Convert between accounts",
  request: "Create payment request",
  scheduled: "Schedule a demo payment",
  currency: "Add a currency",
  rates: "Illustrative exchange rates",
  entry: "Transaction details",
};
type Mode = MoneyEntry["kind"] | "currency" | "rates" | "entry" | null;
export function CrossCurrencyPage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  const [dark, setDark] = useThemeMode(false),
    [hidden, setHidden] = useState(false),
    [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET),
    [undo, setUndo] = useState<Wallet | null>(null),
    [base, setBase] = useState<Currency>("USD");
  const [account, setAccount] = useState<Currency | "all">("all"),
    [query, setQuery] = useState(""),
    [period, setPeriod] = useState<"all" | "week">("all"),
    [notice, setNotice] = useState("");
  const [mode, setMode] = useState<Mode>(null),
    [entry, setEntry] = useState<MoneyEntry | null>(null),
    [preview, setPreview] = useState<Wallet | null>(null),
    [error, setError] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD"),
    [to, setTo] = useState<Currency>("GBP"),
    [amount, setAmount] = useState(""),
    [recipient, setRecipient] = useState(""),
    [date, setDate] = useState("2026-10-20"),
    [newCurrency, setNewCurrency] = useState<Currency>("EUR");
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const entries = visibleEntries(wallet.entries, query, account, period),
    days = cashFlowDays(
      visibleEntries(wallet.entries, "", account, period),
      period,
    );
  const available =
    wallet.accounts.find((a) => a.currency === currency)?.balance ?? 0;
  const closedCurrencies = (Object.keys(CURRENCIES) as Currency[]).filter(
    (c) => !wallet.accounts.some((a) => a.currency === c),
  );
  function open(next: Mode, item?: MoneyEntry) {
    trigger.current = document.activeElement as HTMLElement;
    setMode(next);
    setEntry(item ?? null);
    setPreview(null);
    setError("");
    setAmount("");
    setRecipient("");
    setCurrency(account === "all" ? "USD" : account);
    setTo(account === "GBP" ? "USD" : "GBP");
    setNewCurrency(closedCurrencies[0] ?? "EUR");
  }
  function close() {
    setMode(null);
    setPreview(null);
    setError("");
  }
  function review(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const op: MoneyOperation = {
        kind: mode as MoneyEntry["kind"],
        currency,
        to,
        amount,
        recipient,
        date,
      };
      setPreview(applyOperation(wallet, op, `demo-${Date.now()}`));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not prepare this demo operation.",
      );
    }
  }
  function commit() {
    if (!preview) return;
    setUndo(wallet);
    setWallet(preview);
    setNotice(`${preview.entries[0].description}. Local demo updated.`);
    close();
  }
  function addCurrency() {
    if (!closedCurrencies.includes(newCurrency)) return;
    setUndo(wallet);
    setWallet({
      ...wallet,
      accounts: [...wallet.accounts, { currency: newCurrency, balance: 0 }],
    });
    setNotice(`${newCurrency} account added with a zero balance.`);
    close();
  }
  function exportActivity() {
    const data = {
      demo: true,
      asOf: DEMO_TODAY,
      amountUnits: "integer minor units (1/100 of the named currency)",
      scope: { account, query, period },
      entries,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "cross-currency-activity.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${entries.length} visible activity entries.`);
  }
  function clearFilters() {
    setQuery("");
    setAccount("all");
    setPeriod("all");
  }
  const monetaryMode =
    mode && ["in", "out", "exchange", "request", "scheduled"].includes(mode);
  const pending = preview?.entries[0];
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="cc-root">
        <aside className="cc-rail">
          <a href="/currency-balance-card" aria-label="Oreo UI components">
            <OreoLogo className="h-5 w-8" />
          </a>
          <nav aria-label="Workspace sections">
            {[
              { id: "overview", name: "Overview", icon: "columns" },
              { id: "balances", name: "Balances", icon: "globe" },
              { id: "activity", name: "Activity", icon: "clock-history" },
              { id: "cash-flow", name: "Cash flow", icon: "chart-bar" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-label={item.name}
                title={item.name}
              >
                <Icon name={item.icon as IconName} />
              </a>
            ))}
          </nav>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => setDark(!dark)}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </aside>
        <div className="cc-content">
          <header className="cc-header">
            <span>
              Home <span>/</span> Overview
            </span>
            <label>
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search transactions"
                placeholder="Search transactions…"
                maxLength={100}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span className="cc-demo-badge">Local demo</span>
          </header>
          <main className="cc-main">
            <section id="overview" className="cc-overview">
              <div>
                <h1 ref={heading} tabIndex={-1} className="sr-only">
                  Cross-Currency Overview
                </h1>
                <CurrencyBalanceSummary
                  accounts={wallet.accounts}
                  base={base}
                  hidden={hidden}
                  onVisibilityChange={setHidden}
                />
              </div>
              <label className="cc-base">
                <span>Display total in</span>
                <select
                  aria-label="Total currency"
                  value={base}
                  onChange={(e) => setBase(e.target.value as Currency)}
                >
                  {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </section>
            <div className="cc-main-actions">
              {actions.map((a, i) => (
                <Button
                  key={a.kind}
                  type={i === 0 ? "primary" : "secondary"}
                  tapScale={1}
                  leadingIcon={<Icon name={a.icon} size="sm" />}
                  onClick={() => open(a.kind)}
                >
                  {a.label}
                </Button>
              ))}
            </div>
            <section id="balances">
              <div className="cc-section-heading">
                <h2>My balances</h2>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  disabled={!closedCurrencies.length}
                  onClick={() => open("currency")}
                  leadingIcon={<Icon name="plus" size="sm" />}
                >
                  {closedCurrencies.length
                    ? "Add a currency"
                    : "All currencies added"}
                </Button>
              </div>
              <div className="cc-accounts">
                {wallet.accounts.map((a) => (
                  <CurrencyBalanceCard
                    key={a.currency}
                    account={a}
                    hidden={hidden}
                    selected={account === a.currency}
                    onSelect={(c) => setAccount(account === c ? "all" : c)}
                  />
                ))}
              </div>
            </section>
            <div className="cc-middle">
              <section className="cc-quick">
                <div className="cc-section-heading">
                  <h2>Quick actions</h2>
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    onClick={() => open("rates")}
                  >
                    View rates
                  </Button>
                </div>
                {[
                  {
                    mode: "out",
                    title: "Make a payment",
                    desc: "Send from a sample account",
                    icon: "paper-plane",
                  },
                  {
                    mode: "scheduled",
                    title: "Schedule a payment",
                    desc: "Keep a dated payment draft",
                    icon: "calendar",
                  },
                  {
                    mode: "exchange",
                    title: "Transfer between currencies",
                    desc: "Move demo money internally",
                    icon: "refresh",
                  },
                ].map((a) => (
                  <Button
                    key={a.mode}
                    type="secondary"
                    tapScale={1}
                    className="cc-quick-action"
                    onClick={() => open(a.mode as Mode)}
                    leadingIcon={<Icon name={a.icon as IconName} />}
                    trailingIcon={<Icon name="chevron-right" size="sm" />}
                  >
                    <strong>{a.title}</strong>
                    <small>{a.desc}</small>
                  </Button>
                ))}
                <p>
                  Fixed sample rates · No fees modelled.
                  <br />
                  No banks are connected or money moved.
                </p>
              </section>
              <section id="activity" className="cc-recent">
                <div className="cc-section-heading">
                  <h2>Recent transactions</h2>
                  <label>
                    <span className="sr-only">Activity period</span>
                    <select
                      aria-label="Activity period"
                      value={period}
                      onChange={(e) =>
                        setPeriod(e.target.value as typeof period)
                      }
                    >
                      <option value="all">All activity</option>
                      <option value="week">October 10–16</option>
                    </select>
                  </label>
                </div>
                <div className="cc-activity-scope">
                  <span>
                    {account === "all" ? "All accounts" : account} ·{" "}
                    {entries.length} entries
                  </span>
                  {(account !== "all" || query || period !== "all") && (
                    <Button
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
                <div
                  className="cc-list-region"
                  role="region"
                  aria-label="Recent transaction list"
                  tabIndex={0}
                >
                  <MoneyActivityList
                    entries={entries}
                    onOpen={(e) => open("entry", e)}
                    onReset={clearFilters}
                  />
                </div>
              </section>
            </div>
            <section id="cash-flow">
              <div className="cc-section-heading">
                <div>
                  <h2>Cash flow</h2>
                  <p>
                    Completed payments ·{" "}
                    {period === "all" ? "Oct 1–16" : "Oct 10–16"} · USD ·{" "}
                    {account === "all" ? "All accounts" : account}
                  </p>
                </div>
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={exportActivity}
                  leadingIcon={<Icon name="arrow-down" size="sm" />}
                >
                  Export activity
                </Button>
              </div>
              <CashFlowBars days={days} />
              <p className="cc-flow-note">
                Excludes conversions, request drafts and scheduled drafts.
                Search filters the activity list only.
              </p>
            </section>
            <div className="cc-notice">
              <p role="status">
                {notice || "Your accounts, together in one place."}
              </p>
              {undo && (
                <Button
                  type="tertiary"
                  tapScale={1}
                  onClick={() => {
                    setWallet(undo);
                    setUndo(null);
                    setAccount("all");
                    setNotice("Last local change undone.");
                  }}
                >
                  Undo last change
                </Button>
              )}
            </div>
            <footer className="cc-footer">
              <span>
                Fictional account snapshot · October 16, 2026 · Changes reset on
                reload.
              </span>
              <a href="/currency-balance-card">Explore the components ↗</a>
            </footer>
          </main>
        </div>
        <Dialog.Root
          open={mode !== null}
          onOpenChange={(v) => {
            if (!v) close();
          }}
        >
          <Dialog.Portal container={root}>
            <Dialog.Backdrop className="cc-backdrop" />
            <Dialog.Popup
              className="cc-dialog"
              finalFocus={() =>
                trigger.current?.isConnected ? trigger.current : heading.current
              }
            >
              <div className="cc-dialog-heading">
                <Dialog.Title>
                  {preview ? "Review demo operation" : titles[mode ?? ""]}
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      aria-label="Close dialog"
                      icon={<Icon name="x" />}
                    />
                  }
                />
              </div>
              <Dialog.Description className="cc-description">
                {mode === "rates"
                  ? "Fixed illustrative rates for this demo. These are not market quotes."
                  : mode === "entry"
                    ? "A record in this local demonstration. No real transfer has occurred."
                    : "Use sample balances to explore the flow. Nothing is sent to a bank or recipient."}
              </Dialog.Description>
              {mode === "rates" && (
                <table className="cc-rates">
                  <caption>USD value of 1 unit</caption>
                  <tbody>
                    {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                      <tr key={c}>
                        <th>{c}</th>
                        <td>
                          {(CURRENCIES[c].num / CURRENCIES[c].den).toFixed(6)}{" "}
                          USD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {mode === "currency" && (
                <>
                  <label className="cc-field">
                    Currency
                    <select
                      value={newCurrency}
                      onChange={(e) =>
                        setNewCurrency(e.target.value as Currency)
                      }
                    >
                      {closedCurrencies.map((c) => (
                        <option key={c} value={c}>
                          {c} — {CURRENCIES[c].name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button tapScale={1} onClick={addCurrency}>
                    Add demo account
                  </Button>
                </>
              )}
              {mode === "entry" && entry && (
                <dl className="cc-review">
                  <div>
                    <dt>Description</dt>
                    <dd>{entry.description}</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd>{formatCurrency(entry.amount, entry.currency)}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>
                      {entry.kind === "request"
                        ? "Request draft"
                        : entry.kind === "scheduled"
                          ? "Scheduled draft"
                          : entry.kind === "exchange"
                            ? "Conversion"
                            : "Posted sample payment"}
                    </dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{entry.date}</dd>
                  </div>
                  {entry.to && entry.received !== undefined && (
                    <div>
                      <dt>Received</dt>
                      <dd>{formatCurrency(entry.received, entry.to)}</dd>
                    </div>
                  )}
                  {["request", "scheduled"].includes(entry.kind) && (
                    <p>
                      Draft only. Funds are not moved or reserved; no automatic
                      execution will occur.
                    </p>
                  )}
                </dl>
              )}
              {monetaryMode && !preview && (
                <form noValidate onSubmit={review}>
                  <label className="cc-field">
                    {mode === "in" || mode === "request"
                      ? "Account"
                      : "From account"}
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                    >
                      {wallet.accounts.map((a) => (
                        <option key={a.currency} value={a.currency}>
                          {a.currency} — {CURRENCIES[a.currency].name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="cc-available">
                    Available: {formatCurrency(available, currency)}
                  </p>
                  {mode === "exchange" && (
                    <label className="cc-field">
                      To account
                      <select
                        value={to}
                        onChange={(e) => setTo(e.target.value as Currency)}
                      >
                        {wallet.accounts.map((a) => (
                          <option key={a.currency}>{a.currency}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {["out", "request", "scheduled"].includes(mode!) && (
                    <label className="cc-field">
                      Recipient name
                      <input
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        maxLength={80}
                        placeholder="e.g. Alex Morgan"
                        autoComplete="off"
                      />
                    </label>
                  )}
                  <label className="cc-field">
                    Amount ({currency})
                    <input
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      maxLength={13}
                      placeholder="0.00"
                      autoComplete="off"
                    />
                  </label>
                  {mode === "exchange" &&
                    parseMinor(amount) !== null &&
                    currency !== to && (
                      <p className="cc-available">
                        Estimated receipt:{" "}
                        {formatCurrency(
                          convertMinor(parseMinor(amount)!, currency, to),
                          to,
                        )}{" "}
                        · Fixed demo rate
                      </p>
                    )}
                  {mode === "scheduled" && (
                    <label className="cc-field">
                      Scheduled date
                      <input
                        type="date"
                        min="2026-10-17"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </label>
                  )}
                  {error && (
                    <p
                      ref={errorRef}
                      tabIndex={-1}
                      role="alert"
                      className="cc-error"
                    >
                      {error}
                    </p>
                  )}
                  <Button tapScale={1} render={<button type="submit" />}>
                    Review demo operation
                  </Button>
                </form>
              )}
              {preview && pending && (
                <>
                  <dl className="cc-review">
                    <div>
                      <dt>Action</dt>
                      <dd>{pending.description}</dd>
                    </div>
                    <div>
                      <dt>Amount</dt>
                      <dd>
                        {formatCurrency(pending.amount, pending.currency)}
                      </dd>
                    </div>
                    {pending.received !== undefined && pending.to && (
                      <div>
                        <dt>Receive</dt>
                        <dd>{formatCurrency(pending.received, pending.to)}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Account balance after</dt>
                      <dd>
                        {formatCurrency(
                          preview.accounts.find(
                            (a) => a.currency === pending.currency,
                          )!.balance,
                          pending.currency,
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>{pending.date}</dd>
                    </div>
                  </dl>
                  <p className="cc-description">
                    {["request", "scheduled"].includes(pending.kind)
                      ? "This creates a local draft only. It will not execute automatically, reserve funds, or notify anyone."
                      : "Balances update only in this browser session. Conversion rates are fixed; fees are not modelled."}
                  </p>
                  <div className="cc-dialog-actions">
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() => setPreview(null)}
                    >
                      Back to edit
                    </Button>
                    <Button tapScale={1} onClick={commit}>
                      Apply demo
                    </Button>
                  </div>
                </>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
