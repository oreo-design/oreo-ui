import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { StepProgress } from "@/components/step-progress";
import {
  SavedPaymentMethods,
  DiscountCodeField,
  CheckoutSummary,
  quoteCheckout,
  validateMethod,
  money,
  type SavedMethod,
} from "@/components/checkout";
import { SAMPLE_METHODS } from "./data";
import "./upgrade.css";
export function PlanUpgradePage() {
  const [dark, setDark] = useState(false),
    [step, setStep] = useState(1),
    [cycle, setCycle] = useState("annual"),
    [seats, setSeats] = useState("4"),
    [methods, setMethods] = useState(SAMPLE_METHODS),
    [selected, setSelected] = useState("visa"),
    [code, setCode] = useState("FRIENDS"),
    [applied, setApplied] = useState("FRIENDS"),
    [codeError, setCodeError] = useState(""),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [removed, setRemoved] = useState<SavedMethod | null>(null),
    [editing, setEditing] = useState<string | null>(null),
    [form, setForm] = useState({
      name: "",
      last4: "",
      expiry: "",
      brand: "Visa" as SavedMethod["brand"],
    }),
    [formError, setFormError] = useState(""),
    [failure, setFailure] = useState(false),
    [simulate, setSimulate] = useState(false);
  const title = useRef<HTMLHeadingElement>(null),
    nameInput = useRef<HTMLInputElement>(null),
    first = useRef(true);
  const count = Number(seats),
    validSeats = /^\d+$/.test(seats) && count >= 1 && count <= 100;
  const quote = quoteCheckout(
    cycle === "annual" ? 11520 : 1200,
    validSeats ? count : 1,
    applied ? 2000 : 0,
  );
  const method = methods.find((m) => m.id === selected);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    title.current?.focus();
  }, [step]);
  function applyCode() {
    if (code.trim().toUpperCase() === "FRIENDS") {
      setApplied("FRIENDS");
      setCodeError("");
      setCode("FRIENDS");
    } else {
      setApplied("");
      setCodeError("This demo code is not valid. Try FRIENDS.");
    }
  }
  function edit(m: SavedMethod) {
    setEditing(m.id);
    setForm({
      name: m.name,
      last4: m.last4 ?? "",
      expiry: m.expiry ?? "",
      brand: m.brand,
    });
    setFormError("");
    nameInput.current?.scrollIntoView({ block: "center" });
    nameInput.current?.focus();
  }
  function saveMethod(e: React.FormEvent) {
    e.preventDefault();
    const issue =
      form.brand === "Wallet"
        ? !form.name.trim()
          ? "Enter an account name."
          : null
        : validateMethod(form.name, form.last4, form.expiry);
    if (issue) {
      setFormError(issue);
      return;
    }
    const id = editing ?? crypto.randomUUID();
    const next: SavedMethod = {
      id,
      brand: form.brand,
      name: form.name.trim(),
      last4: form.brand === "Wallet" ? undefined : form.last4,
      expiry: form.brand === "Wallet" ? undefined : form.expiry,
      detail: editing
        ? (methods.find((m) => m.id === editing)?.detail ?? "Sample card")
        : "Sample card",
    };
    setMethods((old) =>
      editing ? old.map((m) => (m.id === editing ? next : m)) : [...old, next],
    );
    setSelected(id);
    setEditing(null);
    setForm({ name: "", last4: "", expiry: "", brand: "Visa" });
    setFormError("");
    setNotice("Sample payment method saved for this session.");
  }
  function complete() {
    if (!method) {
      setError("Select or add a payment method first.");
      return;
    }
    if (codeError || code.trim().toUpperCase() !== applied) {
      setError("Apply your discount code or clear it before continuing.");
      return;
    }
    if (simulate) {
      setFailure(true);
      setError(
        "The demo payment attempt failed. Your selection and totals are preserved. Turn off the demo failure and try again.",
      );
      return;
    }
    setError("");
    setFailure(false);
    setRemoved(null);
    setNotice("");
    setStep(2);
  }
  return (
    <div className={`up-page${dark ? " theme-dark" : ""}`}>
      <div className="up-window">
        <aside className="up-rail">
          <a
            href="/saved-payment-methods"
            aria-label="Oreo UI components"
            className="up-mark"
          >
            o
          </a>
          <a href="/client-workspace" aria-label="Client workspace">
            <Icon name="columns" />
          </a>
          <a href="/payment-workspace" aria-label="Payment workspace">
            <Icon name="columns" />
          </a>
          <a href="/finance-workspace" aria-label="Finance workspace">
            <Icon name="chart-bar" />
          </a>
          <span className="up-rail-bottom">
            <Icon name="gear" />
          </span>
        </aside>
        <aside className="up-sidebar">
          <strong>Settings</strong>
          <nav>
            <a href="/settings">
              <Icon name="users" />
              Profile settings
            </a>
            <a href="/subscription">
              <Icon name="columns" />
              Subscription
            </a>
            <span aria-current="page">
              <Icon name="sparkle" />
              Upgrade to Pro
            </span>
            <a href="/security-review">
              <Icon name="lock" />
              Security review
            </a>
            <a href="/studio-inbox">
              <Icon name="bell" />
              Studio inbox
            </a>
          </nav>
          <div className="up-person">
            <Avatar name="Alex Morgan" size="sm" />
            <span>
              <strong>Alex Morgan</strong>
              <small>alex@example.com</small>
            </span>
          </div>
        </aside>
        <main className="up-main">
          <header className="up-header">
            <div>
              <h1 ref={title} tabIndex={-1}>
                {step === 2 ? "Your upgrade is ready" : "Upgrade your plan"}
              </h1>
              <p>More room for your team. A little less in your way.</p>
            </div>
            <div className="up-header-actions">
              <Tag size="sm" color="default">
                Local demo
              </Tag>
              <IconButton
                size="sm"
                type="tertiary"
                tapScale={1}
                aria-label={
                  dark ? "Switch to light theme" : "Switch to dark theme"
                }
                onClick={() => setDark(!dark)}
                icon={<Icon name={dark ? "sun" : "moon"} />}
              />
              <Avatar name="Alex Morgan" size="sm" />
            </div>
          </header>
          <nav className="up-steps" aria-label="Upgrade steps">
            {["Plan", "Payment", "Complete"].map((label, i) => (
              <span key={label}>
                <button
                  disabled={i === 2 || step === 2}
                  aria-current={step === i ? "step" : undefined}
                  onClick={() => {
                    if (i === 1 && !validSeats) {
                      setError("Choose between 1 and 100 seats.");
                      return;
                    }
                    setError("");
                    setStep(i);
                  }}
                >
                  <b>{i < step ? "✓" : i + 1}</b>
                  {label}
                </button>
                {i < 2 && <i aria-hidden="true" />}
              </span>
            ))}
          </nav>
          {notice && (
            <div className="up-notice" role="status">
              {notice}
              {removed && (
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setMethods((old) =>
                      old.some((m) => m.id === removed.id)
                        ? old
                        : [...old, removed],
                    );
                    setSelected(removed.id);
                    setRemoved(null);
                    setNotice("Payment method restored.");
                  }}
                >
                  Undo
                </Button>
              )}
            </div>
          )}
          {step === 2 ? (
            <section className="up-complete">
              <span className="up-success">✓</span>
              <h2>All set, Alex.</h2>
              <p>Your sample Pro upgrade has been saved in this preview.</p>
              <strong>
                {validSeats ? count : 1} seats · {cycle} · {money(quote.total)}
              </strong>
              <p>
                {method?.brand}{" "}
                {method?.last4 ? `ending in ${method.last4}` : method?.name}
              </p>
              <StepProgress completed={3} total={3} label="Upgrade complete" />
              <p className="co-muted">
                No payment was charged and no subscription was changed.
                Reloading clears this demo.
              </p>
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => {
                  setStep(0);
                  setNotice("");
                  setRemoved(null);
                }}
              >
                Start another upgrade
              </Button>
            </section>
          ) : (
            <div className="up-columns">
              <section className="up-content">
                {step === 0 ? (
                  <>
                    <h2>Choose your plan</h2>
                    <p className="co-muted">
                      Pro brings your team together with unlimited projects and
                      shared libraries.
                    </p>
                    <div className="up-plan">
                      <Tag color="default" size="sm">
                        PRO
                      </Tag>
                      <h3>Good work starts here.</h3>
                      <p>
                        <strong>
                          {cycle === "annual" ? "$9.60" : "$12.00"}
                        </strong>{" "}
                        per seat / month
                      </p>
                      <ul>
                        <li>Unlimited projects and shared libraries</li>
                        <li>Team permissions and version history</li>
                        <li>Priority support</li>
                      </ul>
                    </div>
                    <fieldset className="up-cycle">
                      <legend>Billing period</legend>
                      {["annual", "monthly"].map((c) => (
                        <label key={c}>
                          <input
                            type="radio"
                            name="billing"
                            checked={cycle === c}
                            onChange={() => setCycle(c)}
                          />
                          {c === "annual" ? "Annual · save 20%" : "Monthly"}
                        </label>
                      ))}
                    </fieldset>
                    <label className="up-field">
                      Team seats
                      <input
                        value={seats}
                        inputMode="numeric"
                        onChange={(e) => setSeats(e.target.value)}
                        aria-invalid={!validSeats}
                      />
                      <small>
                        1–100 seats. Annual price is $115.20 per seat.
                      </small>
                    </label>
                    {!validSeats && (
                      <p className="co-error" role="alert">
                        Choose between 1 and 100 seats.
                      </p>
                    )}
                    <Button
                      tapScale={1}
                      disabled={!validSeats}
                      onClick={() => {
                        setError("");
                        setStep(1);
                      }}
                    >
                      Continue to payment details
                    </Button>
                  </>
                ) : (
                  <>
                    <h2>Payment details</h2>
                    <div className="up-section-heading">
                      <h3>Default payment method</h3>
                      <p>Select a saved payment method.</p>
                    </div>
                    <SavedPaymentMethods
                      methods={methods}
                      value={selected}
                      onValueChange={(id) => {
                        setSelected(id);
                        setError("");
                      }}
                      onEdit={edit}
                      onRemove={(m) => {
                        setMethods((old) => old.filter((x) => x.id !== m.id));
                        if (selected === m.id) setSelected("");
                        setRemoved(m);
                        setNotice(`${m.brand} method removed.`);
                        if (editing === m.id) {
                          setEditing(null);
                          setForm({
                            name: "",
                            last4: "",
                            expiry: "",
                            brand: "Visa",
                          });
                        }
                      }}
                      onAdd={() => nameInput.current?.focus()}
                    />
                    <div className="up-or">
                      <span />
                      OR
                      <span />
                    </div>
                    <form className="up-form" onSubmit={saveMethod} noValidate>
                      <h3>
                        {editing
                          ? "Edit payment method"
                          : "Add a sample method"}
                      </h3>
                      <p className="co-muted">
                        Use a name, ending digits and expiry. No card number or
                        security code is collected.
                      </p>
                      <label className="up-field">
                        {form.brand === "Wallet"
                          ? "Account name"
                          : "Name on card"}
                        <input
                          ref={nameInput}
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          autoComplete="off"
                        />
                      </label>
                      {form.brand !== "Wallet" && (
                        <>
                          <label className="up-field">
                            Card network
                            <select
                              value={form.brand}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  brand: e.target.value as SavedMethod["brand"],
                                })
                              }
                            >
                              <option>Visa</option>
                              <option>Mastercard</option>
                            </select>
                          </label>
                          <div className="up-field-pair">
                            <label className="up-field">
                              Last four digits
                              <input
                                value={form.last4}
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="4242"
                                onChange={(e) =>
                                  setForm({ ...form, last4: e.target.value })
                                }
                              />
                            </label>
                            <label className="up-field">
                              Expiry
                              <input
                                value={form.expiry}
                                placeholder="MM/YYYY"
                                onChange={(e) =>
                                  setForm({ ...form, expiry: e.target.value })
                                }
                              />
                            </label>
                          </div>
                        </>
                      )}
                      {formError && (
                        <p className="co-error" role="alert">
                          {formError}
                        </p>
                      )}
                      <div className="up-form-actions">
                        <Button
                          render={<button type="submit" />}
                          type="secondary"
                          tapScale={1}
                        >
                          {editing ? "Save changes" : "Save sample method"}
                        </Button>
                        {editing && (
                          <Button
                            type="tertiary"
                            tapScale={1}
                            onClick={() => {
                              setEditing(null);
                              setForm({
                                name: "",
                                last4: "",
                                expiry: "",
                                brand: "Visa",
                              });
                              setFormError("");
                            }}
                          >
                            Cancel edit
                          </Button>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </section>
              <aside className="up-summary">
                {validSeats ? (
                  <CheckoutSummary
                    item={`${validSeats ? count : "—"} × Pro licenses (${cycle})`}
                    period={
                      cycle === "annual"
                        ? "12 months · billed annually"
                        : "1 month · billed monthly"
                    }
                    quote={quote}
                    action={
                      <Button
                        tapScale={1}
                        disabled={!validSeats}
                        onClick={() => (step === 0 ? setStep(1) : complete())}
                      >
                        {step === 0
                          ? "Continue to payment"
                          : failure
                            ? "Try again"
                            : "Confirm demo upgrade"}
                      </Button>
                    }
                  >
                    <DiscountCodeField
                      value={code}
                      onValueChange={(v) => {
                        setCode(v);
                        setApplied("");
                        setCodeError("");
                      }}
                      applied={applied}
                      error={codeError}
                      onApply={applyCode}
                      onRemove={() => {
                        setApplied("");
                        setCode("");
                        setCodeError("");
                      }}
                    />
                  </CheckoutSummary>
                ) : (
                  <AgentWorkspaceState
                    title="Choose your team size"
                    description="Enter 1–100 seats to calculate your checkout total."
                  />
                )}
                {error && (
                  <p className="up-error" role="alert">
                    {error}
                  </p>
                )}
                <p className="up-summary-note">
                  A local checkout preview. Nothing is charged or sent.
                </p>
                {step === 1 && (
                  <details className="up-demo">
                    <summary>Demo states</summary>
                    <label>
                      <input
                        type="checkbox"
                        checked={simulate}
                        onChange={(e) => {
                          setSimulate(e.target.checked);
                          if (!e.target.checked) {
                            setError("");
                            setFailure(false);
                          }
                        }}
                      />{" "}
                      Simulate a failed attempt
                    </label>
                  </details>
                )}
              </aside>
            </div>
          )}
          <footer className="up-footer">
            <a href="/saved-payment-methods">Explore the components ↗</a>
            <a
              href="https://x.com/jordanphughes/status/2110767174008574457"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Jordan Hughes ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
