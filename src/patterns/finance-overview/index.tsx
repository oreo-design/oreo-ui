import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import {
  BankAccountList,
  FinanceAttentionList,
  BalanceSparkBars,
  resolveNotice,
  searchAccounts,
  validateBankDraft,
  type BankAccount,
  type FinanceNotice,
} from "@/components/finance-overview";
import {
  CURRENCIES,
  formatCurrency,
  type Currency,
} from "@/components/currency-finance/model";
import { SAMPLE_ACCOUNTS, SAMPLE_NOTICES } from "./data";
import "./finance-overview-page.css";
type Data = { accounts: BankAccount[]; notices: FinanceNotice[] };
type Selection =
  | { kind: "notice"; item: FinanceNotice }
  | { kind: "account"; item: BankAccount }
  | { kind: "connect" }
  | null;
const INITIAL: Data = { accounts: SAMPLE_ACCOUNTS, notices: SAMPLE_NOTICES };
export function FinanceOverviewPage() {
  const [data, setData] = useState<Data | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [dark, setDark] = useThemeMode(false),
    [selection, setSelection] = useState<Selection>(null),
    [undo, setUndo] = useState<Data | null>(null),
    [notice, setNotice] = useState(""),
    [animate, setAnimate] = useState(true),
    [draft, setDraft] = useState({
      name: "",
      bank: "",
      last4: "",
      currency: "USD" as Currency,
    }),
    [validation, setValidation] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    heading = useRef<HTMLHeadingElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      setData(INITIAL);
      setLoading(false);
      setNotice("Sample data loaded.");
    }, 1200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (validation) errorRef.current?.focus();
  }, [validation]);
  function load(fail = false, replay = false) {
    const previous = data;
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    setError("");
    setSelection(null);
    if (replay) {
      setData(null);
    }
    setNotice(replay ? "Loading sample data…" : "Refreshing sample data…");
    timer.current = setTimeout(() => {
      if (fail) {
        setError(
          "The simulated connection timed out. Your existing data is preserved.",
        );
        setNotice("Refresh failed. Try again.");
      } else {
        setData((current) => current ?? previous ?? INITIAL);
        setNotice("Sample data is up to date.");
      }
      setLoading(false);
    }, 1200);
  }
  function open(next: Selection) {
    trigger.current = document.activeElement as HTMLElement;
    setValidation("");
    if (next?.kind === "connect")
      setDraft({ name: "", bank: "", last4: "", currency: "USD" });
    setSelection(next);
  }
  function review(item: FinanceNotice) {
    if (!data) return;
    setUndo(data);
    setData({ ...data, notices: resolveNotice(data.notices, item.id) });
    setSelection(null);
    setNotice(
      "Reminder marked reviewed in this demo. No external action was taken.",
    );
  }
  function connect(event: FormEvent) {
    event.preventDefault();
    if (!data) return;
    const err = validateBankDraft(draft, data.accounts);
    if (err) {
      setValidation(err);
      return;
    }
    setUndo(data);
    setData({
      ...data,
      accounts: [
        ...data.accounts,
        {
          id: crypto.randomUUID(),
          name: draft.name.trim(),
          bank: draft.bank.trim(),
          last4: draft.last4,
          currency: draft.currency,
          balance: 0,
          history: [0, 0, 0, 0, 0, 0, 0, 0],
          tone: "blue",
        },
      ],
    });
    setSelection(null);
    setQuery("");
    setNotice(
      "Sample account added with a zero balance. No bank connection was made.",
    );
  }
  const accounts = searchAccounts(data?.accounts ?? [], query),
    items = (data?.notices ?? []).filter((item) => !item.resolved);
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div
        className="fo-page"
        onKeyDownCapture={() => setAnimate(false)}
        onPointerDownCapture={() => setAnimate(true)}
      >
        <header className="fo-sitebar">
          <a href="/bank-account-list">
            <OreoLogo className="h-5 w-8" />
            Oreo UI <span>/ Templates</span>
          </a>
          <span className="fo-demo-label">Local demo · fixed sample data</span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <main className="fo-main">
          <div className="fo-page-heading">
            <div>
              <p>HOME / OVERVIEW</p>
              <h1 ref={heading} tabIndex={-1}>
                Your money, in focus.
              </h1>
              <span>Know what needs you. See where you stand.</span>
            </div>
            <Button
              type="secondary"
              tapScale={1}
              disabled={loading}
              onClick={(event) => {
                setAnimate(event.detail > 0);
                load();
              }}
              leadingIcon={<Icon name="refresh" size="sm" />}
            >
              {loading ? "Loading…" : "Refresh"}
            </Button>
          </div>
          <div className="fo-toolbar">
            <label>
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search bank accounts"
                placeholder="Search bank accounts…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                disabled={loading}
                onClick={(event) => {
                  setAnimate(event.detail > 0);
                  load(false, true);
                }}
              >
                Replay loading
              </Button>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                disabled={loading}
                onClick={(event) => {
                  setAnimate(event.detail > 0);
                  load(true);
                }}
              >
                Simulate failure
              </Button>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                disabled={!undo || loading}
                onClick={() => {
                  if (undo) {
                    setData(undo);
                    setUndo(null);
                    setNotice("Previous local change restored.");
                  }
                }}
              >
                Undo
              </Button>
            </div>
          </div>
          <div className="fo-overview-grid">
            <div className="theme-dark">
              <FinanceAttentionList
                items={items}
                loading={loading}
                hasData={!!data}
                error={error || undefined}
                onRetry={() => load()}
                onOpen={(item) => open({ kind: "notice", item })}
                animate={animate}
              />
            </div>
            <BankAccountList
              accounts={accounts}
              loading={loading}
              hasData={!!data}
              error={error || undefined}
              onRetry={() => load()}
              onOpen={(item) => open({ kind: "account", item })}
              onConnect={() => open({ kind: "connect" })}
              filtered={!!query.trim()}
              onClear={() => setQuery("")}
              animate={animate}
            />
          </div>
          <p className="fo-feedback" role="status">
            {notice || "Loading sample data…"}
          </p>
          <footer className="fo-page-footer">
            <span>Read-only sample balances. Changes reset on reload.</span>
            <a
              href="https://x.com/hakimhn_/status/2110770755713814650"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Hakim Haiman ↗
            </a>
          </footer>
        </main>
      </div>
      <Dialog.Root
        open={selection !== null}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="fo-backdrop" />
          <Dialog.Popup
            className="fo-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <header>
              <Dialog.Title>
                {selection?.kind === "notice"
                  ? selection.item.title
                  : selection?.kind === "account"
                    ? selection.item.name
                    : "Add a sample account"}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close details"
                    icon={<Icon name="x" />}
                  />
                }
              />
            </header>
            <div className="fo-dialog-body">
              <Dialog.Description>
                {selection?.kind === "notice"
                  ? "Review this sample reminder before marking it complete."
                  : selection?.kind === "account"
                    ? "A read-only snapshot of this sample account."
                    : "Create a local account row. No credentials or bank access are requested."}
              </Dialog.Description>
              {selection?.kind === "notice" && (
                <>
                  <p className="fo-detail-copy">{selection.item.detail}</p>
                  <p className="fo-detail-note">
                    Marking reviewed only removes this reminder. Undo restores
                    it.
                  </p>
                </>
              )}
              {selection?.kind === "account" && (
                <>
                  <dl className="fo-facts">
                    <div>
                      <dt>Bank</dt>
                      <dd>{selection.item.bank}</dd>
                    </div>
                    <div>
                      <dt>Account ending</dt>
                      <dd>••{selection.item.last4}</dd>
                    </div>
                    <div>
                      <dt>Balance</dt>
                      <dd>
                        {formatCurrency(
                          selection.item.balance,
                          selection.item.currency,
                        )}
                      </dd>
                    </div>
                  </dl>
                  <BalanceSparkBars
                    values={selection.item.history}
                    label="Sample balance history in minor units"
                  />
                  <table className="fo-history">
                    <caption>
                      Sample daily balances · {selection.item.currency}
                    </caption>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selection.item.history.map((value, index) => (
                        <tr key={index}>
                          <td>Day {index + 1}</td>
                          <td>
                            {formatCurrency(value, selection.item.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {selection?.kind === "connect" && (
                <form id="fo-connect-form" onSubmit={connect} noValidate>
                  <label>
                    Account name
                    <input
                      value={draft.name}
                      maxLength={50}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                      autoFocus
                    />
                  </label>
                  <label>
                    Bank name
                    <input
                      value={draft.bank}
                      maxLength={70}
                      onChange={(e) =>
                        setDraft({ ...draft, bank: e.target.value })
                      }
                    />
                  </label>
                  <div className="fo-form-pair">
                    <label>
                      Last four digits
                      <input
                        inputMode="numeric"
                        value={draft.last4}
                        maxLength={4}
                        onChange={(e) =>
                          setDraft({ ...draft, last4: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Currency
                      <select
                        value={draft.currency}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            currency: e.target.value as Currency,
                          })
                        }
                      >
                        {Object.keys(CURRENCIES).map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {validation && (
                    <p
                      className="fo-form-error"
                      ref={errorRef}
                      tabIndex={-1}
                      role="alert"
                    >
                      {validation}
                    </p>
                  )}
                </form>
              )}
            </div>
            <footer>
              <Dialog.Close
                render={
                  <Button type="secondary" tapScale={1}>
                    Close
                  </Button>
                }
              />
              {selection?.kind === "notice" && (
                <Button tapScale={1} onClick={() => review(selection.item)}>
                  Mark reviewed
                </Button>
              )}
              {selection?.kind === "connect" && (
                <Button
                  tapScale={1}
                  render={<button type="submit" />}
                  form="fo-connect-form"
                >
                  Add sample account
                </Button>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
