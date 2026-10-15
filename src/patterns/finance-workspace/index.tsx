import { OreoLogo } from "@/docs/OreoLogo";
import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { ActivityCard, formatMoney } from "@/components/activity";
import { ProspectMetric } from "@/components/prospecting";
import { AgentWorkspaceState } from "@/components/automation";
import {
  AllocationBar,
  BalanceChart,
  PaymentCard,
  SpendingGauge,
  allocationTotal,
  type Allocation,
} from "@/components/finance";
import {
  CONTACTS,
  PERIODS,
  SAVINGS,
  SPENDING,
  TRANSACTIONS,
  type FinancePeriod,
  type LocalTransfer,
} from "./data";
import "./finance-workspace.css";

const NAV: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "columns" },
  { id: "balance", label: "Cash flow", icon: "chart-line" },
  { id: "savings", label: "Savings", icon: "gauge" },
  { id: "cards", label: "Cards", icon: "list" },
  { id: "transactions", label: "Activity", icon: "clock-history" },
];
const change = (value: number, previous: number) =>
  `${value >= previous ? "+" : "−"}${Math.abs((value / previous - 1) * 100).toFixed(1)}%`;
export function FinanceWorkspace() {
  const [dark, setDark] = useState(false),
    [period, setPeriod] = useState<FinancePeriod>("month");
  const [goals, setGoals] = useState(SAVINGS),
    [newGoal, setNewGoal] = useState(false),
    [goalName, setGoalName] = useState(""),
    [goalAmount, setGoalAmount] = useState("");
  const [goalError, setGoalError] = useState("");
  const [limit, setLimit] = useState(8000),
    [editingLimit, setEditingLimit] = useState(false),
    [limitDraft, setLimitDraft] = useState("8000"),
    [limitError, setLimitError] = useState("");
  const [card, setCard] = useState("everyday"),
    [frozen, setFrozen] = useState<Record<string, boolean>>({});
  const [recipient, setRecipient] = useState(""),
    [amount, setAmount] = useState(""),
    [transferError, setTransferError] = useState(""),
    [transfers, setTransfers] = useState<LocalTransfer[]>([]);
  const [query, setQuery] = useState(""),
    [notice, setNotice] = useState("");
  const recipientRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const amountRef = useRef<HTMLInputElement>(null),
    goalRef = useRef<HTMLInputElement>(null),
    limitRef = useRef<HTMLInputElement>(null),
    goalTrigger = useRef<HTMLButtonElement>(null),
    limitTrigger = useRef<HTMLButtonElement>(null);
  const overview = PERIODS[period];
  const baseSavings = overview.income - overview.expenses;
  const available = 27200 - transfers.reduce((sum, t) => sum + t.amount, 0);
  const allocations: Allocation[] =
    period === "week"
      ? SPENDING
      : SPENDING.map((i) => ({
          ...i,
          amount:
            i.id === "shopping" ? 3350 : i.id === "utilities" ? 2230 : 1120,
        }));
  const entries = [
    ...transfers.map((t) => ({ ...t, amount: -t.amount })),
    ...TRANSACTIONS,
  ].filter((t) =>
    `${t.name} ${t.note}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  function addGoal(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(goalAmount);
    if (
      !goalName.trim() ||
      !Number.isFinite(value) ||
      value <= 0 ||
      value > 1000000
    ) {
      setGoalError(
        "Give your goal a name and an amount from $0.01 to $1,000,000.",
      );
      goalRef.current?.focus();
      return;
    }
    const rounded = Math.round(value * 100) / 100;
    if (rounded < 0.01) {
      setGoalError("Enter at least $0.01.");
      return;
    }
    setGoals((g) => [
      ...g,
      {
        id: `goal-${Date.now()}`,
        label: goalName.trim(),
        amount: rounded,
        tone: "pink",
      },
    ]);
    setNewGoal(false);
    setGoalName("");
    setGoalAmount("");
    setGoalError("");
    setNotice("Savings goal added to this demo.");
    goalTrigger.current?.focus();
  }
  function send(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    const cents = Math.round(value * 100);
    if (frozen[card]) {
      setTransferError(
        "This card is frozen. Unfreeze it before adding a demo payment.",
      );
      return;
    }
    if (
      !recipient ||
      !Number.isFinite(value) ||
      cents < 1 ||
      cents > Math.round(available * 100)
    ) {
      setTransferError(
        `Enter an amount from $0.01 to ${formatMoney(available)}.`,
      );
      amountRef.current?.focus();
      return;
    }
    const payment = cents / 100;
    setTransfers((t) => [
      {
        id: Date.now(),
        name: recipient,
        amount: payment,
        note: "Demo payment · Just now",
      },
      ...t,
    ]);
    setNotice(
      `Demo payment of ${formatMoney(payment)} to ${recipient} added. No money moved.`,
    );
    setRecipient("");
    setAmount("");
    setTransferError("");
    recipientRefs.current[recipient]?.focus();
  }
  function saveLimit(e: React.FormEvent) {
    e.preventDefault();
    const next = Number(limitDraft);
    if (!Number.isFinite(next) || next < 1 || next > 1000000) {
      setLimitError("Enter a budget between $1 and $1,000,000.");
      limitRef.current?.focus();
      return;
    }
    setLimit(Math.round(next * 100) / 100);
    setLimitError("");
    setEditingLimit(false);
    setNotice("Monthly budget updated.");
    limitTrigger.current?.focus();
  }
  return (
    <div className={`finance-workspace ${dark ? "theme-dark" : ""}`}>
      <header className="fw-top">
        <a href="/balance-chart">
          <span aria-hidden="true">
            <OreoLogo className="h-5 w-8" />
          </span>{" "}
          Oreo UI <span>/ Templates</span>
        </a>
        <div>
          <Tag>Local demo</Tag>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark((v) => !v)}
          />
        </div>
      </header>
      <div className="fw-shell">
        <aside className="fw-sidebar">
          <a href="#overview" className="fw-brand">
            <Icon name="sparkle" size="lg" /> Clarity
            <span>Personal finance</span>
          </a>
          <nav aria-label="Finance sections">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                <Icon name={n.icon} />
                {n.label}
              </a>
            ))}
          </nav>
          <div className="fw-sidebar-note">
            <Icon name="lock" />
            <strong>A little more clarity.</strong>
            <p>
              Sample accounts, real interactions. Everything stays in this
              session.
            </p>
            <a href="/balance-chart">
              Explore the components <Icon name="arrow-up-right" size="sm" />
            </a>
          </div>
        </aside>
        <main id="overview" className="fw-main">
          <div className="fw-heading">
            <div>
              <p>YOUR MONEY, AT A GLANCE</p>
              <h1>A clearer picture.</h1>
              <span>Welcome back, Alex. Let’s make room for what matters.</span>
            </div>
            <label className="fw-period">
              <span className="sr-only">Reporting period</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as FinancePeriod)}
              >
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
              <Icon name="calendar" />
            </label>
          </div>
          <div className="fw-metrics">
            <ProspectMetric
              label="Total income"
              value={formatMoney(overview.income)}
              change={change(overview.income, overview.previousIncome)}
              description={`vs. previous ${period}`}
              bars={overview.points.map((p) => p.income)}
            />
            <ProspectMetric
              label="Total expenses"
              value={formatMoney(overview.expenses)}
              change={change(overview.expenses, overview.previousExpenses)}
              description={`vs. previous ${period} · lower spending`}
              bars={overview.points.map((p) => p.expenses)}
              trend="down"
              sentiment="positive"
            />
            <ProspectMetric
              label="Saved balance"
              value={formatMoney(baseSavings)}
              change={change(
                baseSavings,
                overview.previousIncome - overview.previousExpenses,
              )}
              description={`Income minus expenses · this ${period}`}
              bars={overview.points.map((p) => p.savings)}
            />
          </div>
          <div className="fw-dashboard">
            <div className="fw-primary">
              <section id="balance">
                <ActivityCard
                  title="Balance overview"
                  description={`${overview.label} · Cumulative snapshots in USD`}
                >
                  <div className="fw-balance-value">
                    {formatMoney(baseSavings)}
                    <span>net saved this {period}</span>
                  </div>
                  <BalanceChart key={period} points={overview.points} />
                </ActivityCard>
              </section>
              <div className="fw-bottom">
                <section id="savings">
                  <ActivityCard
                    title="Savings goals"
                    description="Small steps. Bigger possibilities."
                  >
                    <div className="fw-section-row">
                      <strong>{formatMoney(allocationTotal(goals))}</strong>
                      <Button
                        render={<button type="button" ref={goalTrigger} />}
                        type="secondary"
                        size="sm"
                        tapScale={1}
                        leadingIcon={<Icon name="plus" size="sm" />}
                        aria-expanded={newGoal}
                        aria-controls="new-savings-goal"
                        onClick={() => {
                          setNewGoal((v) => !v);
                          setGoalError("");
                        }}
                      >
                        New goal
                      </Button>
                    </div>
                    <AllocationBar items={goals} />
                    {newGoal && (
                      <form
                        id="new-savings-goal"
                        className="fw-form"
                        onSubmit={addGoal}
                        noValidate
                      >
                        <label>
                          Goal name
                          <input
                            ref={goalRef}
                            autoFocus
                            maxLength={60}
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            placeholder="A new adventure"
                          />
                        </label>
                        <label>
                          Amount (USD)
                          <input
                            inputMode="decimal"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            placeholder="500.00"
                          />
                        </label>
                        {goalError && <p role="alert">{goalError}</p>}
                        <div>
                          <Button
                            render={<button type="submit" />}
                            tapScale={1}
                          >
                            Add goal
                          </Button>
                          <Button
                            type="tertiary"
                            tapScale={1}
                            onClick={() => {
                              setNewGoal(false);
                              goalTrigger.current?.focus();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </ActivityCard>
                </section>
                <section>
                  <ActivityCard
                    title="Spending summary"
                    description={`${overview.label} · By category`}
                  >
                    <SpendingGauge
                      items={allocations}
                      limit={period === "week" ? limit / 4 : limit}
                      label={`${overview.label} spending`}
                    />
                    <Button
                      render={<button type="button" ref={limitTrigger} />}
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      className="mt-3 self-center"
                      aria-expanded={editingLimit}
                      onClick={() => {
                        setEditingLimit((v) => !v);
                        setLimitDraft(String(limit));
                        setLimitError("");
                      }}
                    >
                      Edit monthly budget
                    </Button>
                    {editingLimit && (
                      <form className="fw-form" onSubmit={saveLimit} noValidate>
                        <label>
                          Monthly budget (USD)
                          <input
                            ref={limitRef}
                            autoFocus
                            inputMode="decimal"
                            value={limitDraft}
                            onChange={(e) => setLimitDraft(e.target.value)}
                          />
                        </label>
                        {limitError && <p role="alert">{limitError}</p>}
                        <div>
                          <Button
                            render={<button type="submit" />}
                            tapScale={1}
                          >
                            Save budget
                          </Button>
                          <Button
                            type="tertiary"
                            tapScale={1}
                            onClick={() => {
                              setEditingLimit(false);
                              limitTrigger.current?.focus();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </ActivityCard>
                </section>
              </div>
            </div>
            <div className="fw-secondary">
              <section id="cards">
                <ActivityCard
                  title="Your cards"
                  description="Everyday essentials, in one place"
                >
                  <label className="fw-card-select">
                    <span>Account</span>
                    <select
                      aria-label="Card account"
                      value={card}
                      onChange={(e) => {
                        setCard(e.target.value);
                        setTransferError("");
                      }}
                    >
                      <option value="everyday">Everyday · 1327</option>
                      <option value="travel">Travel · 4829</option>
                    </select>
                  </label>
                  <PaymentCard
                    holder="ALEX MORGAN"
                    lastFour={card === "everyday" ? "1327" : "4829"}
                    label={
                      card === "everyday" ? "Everyday card" : "Travel card"
                    }
                    frozen={frozen[card]}
                  />
                  <dl className="fw-facts">
                    <div>
                      <dt>Shared demo balance</dt>
                      <dd>{formatMoney(available)}</dd>
                    </div>
                    <div>
                      <dt>Connected accounts</dt>
                      <dd>2 accounts</dd>
                    </div>
                    <div>
                      <dt>Card status</dt>
                      <dd>{frozen[card] ? "Frozen" : "Active"}</dd>
                    </div>
                  </dl>
                  <Button
                    type="secondary"
                    tapScale={1}
                    leadingIcon={
                      <Icon name={frozen[card] ? "refresh" : "lock"} />
                    }
                    onClick={() => {
                      setFrozen((v) => ({ ...v, [card]: !v[card] }));
                      setNotice(
                        `${card === "everyday" ? "Everyday" : "Travel"} demo card ${frozen[card] ? "unfrozen" : "frozen"}.`,
                      );
                      setTransferError("");
                    }}
                  >
                    {frozen[card] ? "Unfreeze card" : "Freeze card"}
                  </Button>
                </ActivityCard>
              </section>
              <ActivityCard
                title="Quick payment"
                description="Try a payment with sample funds"
              >
                <div
                  className="fw-contacts"
                  role="group"
                  aria-label="Payment recipients"
                >
                  {CONTACTS.map((name, i) => (
                    <button
                      type="button"
                      key={name}
                      ref={(el) => {
                        recipientRefs.current[name] = el;
                      }}
                      aria-pressed={recipient === name}
                      onClick={() => {
                        setRecipient(name);
                        setTransferError("");
                      }}
                    >
                      <span aria-hidden="true">
                        <Avatar
                          name={name}
                          size="md"
                          color={i % 2 ? "mint" : "purple"}
                        />
                      </span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
                {recipient ? (
                  <form className="fw-form" onSubmit={send} noValidate>
                    <label>
                      Amount for {recipient} (USD)
                      <input
                        ref={amountRef}
                        autoFocus
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setTransferError("");
                        }}
                      />
                    </label>
                    {transferError && <p role="alert">{transferError}</p>}
                    <Button
                      render={<button type="submit" />}
                      tapScale={1}
                      leadingIcon={<Icon name="paper-plane" />}
                    >
                      Add demo payment
                    </Button>
                  </form>
                ) : (
                  <p className="fw-hint">
                    Choose a person to try a demo payment. No money moves.
                  </p>
                )}
              </ActivityCard>
            </div>
          </div>
          <section id="transactions" className="fw-transactions">
            <ActivityCard
              title="Recent activity"
              description="Illustrative transactions and your local demo payments"
            >
              <label className="fw-search">
                <Icon name="search" />
                <input
                  aria-label="Search activity"
                  placeholder="Search activity…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {entries.length ? (
                <ul>
                  {entries.map((t) => (
                    <li key={t.id}>
                      <span className="fw-transaction-icon">
                        <Icon
                          name={t.amount > 0 ? "arrow-down" : "arrow-up-right"}
                        />
                      </span>
                      <span>
                        <strong>{t.name}</strong>
                        <small>{t.note}</small>
                      </span>
                      <b
                        className={t.amount > 0 ? "prospect-positive" : ""}
                      >
                        {t.amount > 0 ? "+" : "−"}
                        {formatMoney(Math.abs(t.amount))}
                      </b>
                    </li>
                  ))}
                </ul>
              ) : (
                <AgentWorkspaceState
                  title="No matching activity"
                  description="Try a name or category, or clear your search to see all activity."
                  actionLabel="Clear search"
                  onAction={() => setQuery("")}
                />
              )}
            </ActivityCard>
          </section>
          <p className="fw-notice" role="status">
            {notice ||
              "Illustrative USD data · Changes reset when you reload · No bank connection"}
          </p>
        </main>
      </div>
    </div>
  );
}
