import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { ProgressiveSteps } from "@/components/progressive-steps";
import {
  CheckoutSummary,
  SavedPaymentMethods,
  quoteCheckout,
  money,
} from "@/components/checkout";
import { SAMPLE_METHODS } from "@/patterns/plan-upgrade/data";
import {
  CHECKOUT_STEPS,
  detailsErrors,
  invalidateFrom,
  reachable,
  type Details,
} from "./model";
import "./checkout.css";
export function ProgressiveCheckoutPage() {
  const [dark, setDark] = useState(false),
    [step, setStep] = useState("cart"),
    [completed, setCompleted] = useState<string[]>([]),
    [quantity, setQuantity] = useState(1),
    [hasItem, setHasItem] = useState(true),
    [details, setDetails] = useState<Details>({
      name: "",
      email: "",
      country: "",
    }),
    [errors, setErrors] = useState<Partial<Details>>({}),
    [method, setMethod] = useState("visa"),
    [methods, setMethods] = useState(SAMPLE_METHODS),
    [loading, setLoading] = useState(false),
    [paymentError, setPaymentError] = useState(false),
    [fail, setFail] = useState(false),
    [orderError, setOrderError] = useState(false),
    [finished, setFinished] = useState(false),
    [compact, setCompact] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    first = useRef(true),
    form = useRef<HTMLFormElement>(null);
  const quote = quoteCheckout(4800, quantity, 0, 0),
    selected = methods.find((m) => m.id === method),
    idx = CHECKOUT_STEPS.findIndex((s) => s.id === step);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, finished]);
  function invalidate(id: string) {
    setCompleted((old) => invalidateFrom(old, id));
    setOrderError(false);
  }
  function visit(id: string) {
    if (reachable(id, step, completed)) {
      setStep(id);
      setOrderError(false);
    }
  }
  function next() {
    if (step === "cart" && !hasItem) return;
    if (step === "details") {
      const nextErrors = detailsErrors(details);
      setErrors(nextErrors);
      if (Object.values(nextErrors).some(Boolean)) {
        const key = Object.keys(nextErrors).find(
          (k) => nextErrors[k as keyof Details],
        );
        form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
        return;
      }
    }
    if (step === "payment" && (!selected || loading || paymentError)) return;
    setCompleted((old) => Array.from(new Set([...old, step])));
    setStep(CHECKOUT_STEPS[idx + 1].id);
  }
  function place() {
    if (
      !hasItem ||
      !selected ||
      Object.values(detailsErrors(details)).some(Boolean) ||
      !["cart", "details", "payment"].every((id) => completed.includes(id))
    )
      return;
    if (fail) {
      setOrderError(true);
      return;
    }
    setCompleted(CHECKOUT_STEPS.map((s) => s.id));
    setFinished(true);
  }
  function restart() {
    setStep("cart");
    setCompleted([]);
    setQuantity(1);
    setHasItem(true);
    setDetails({ name: "", email: "", country: "" });
    setErrors({});
    setMethod("visa");
    setMethods(SAMPLE_METHODS);
    setLoading(false);
    setPaymentError(false);
    setFail(false);
    setOrderError(false);
    setFinished(false);
  }
  const field = (key: keyof Details, value: string) => {
    setDetails((old) => ({ ...old, [key]: value }));
    invalidate("details");
    setErrors((old) => ({ ...old, [key]: "" }));
  };
  return (
    <div className={`pc-page${dark ? " theme-dark" : ""}`}>
      <header className="pc-top">
        <a href="/progressive-steps">
          <span className="pc-logo">o</span>oreo / studio
        </a>
        <div>
          <Tag size="sm">Local demo</Tag>
          <IconButton
            aria-label={dark ? "Light theme" : "Dark theme"}
            type="tertiary"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </div>
      </header>
      <main className="pc-main">
        <div className="pc-intro">
          <p className="pc-eyebrow">A SMALL STEP TOWARDS SOMETHING GREAT</p>
          <h1>Make room for your next idea.</h1>
          <p>
            A thoughtful set of components. A faster start for your next
            project.
          </p>
        </div>
        <section className="pc-checkout">
          <div className="pc-progress">
            <ProgressiveSteps
              steps={CHECKOUT_STEPS.map((s) => ({
                ...s,
                disabled: finished || !reachable(s.id, step, completed),
              }))}
              value={finished ? "" : step}
              completed={completed}
              onValueChange={visit}
              variant={compact ? "compact" : "expanded"}
            />
            <label className="pc-compact">
              <input
                type="checkbox"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
              />{" "}
              Compact steps
            </label>
          </div>
          <div className="pc-columns">
            <section className="pc-content" aria-labelledby="checkout-heading">
              <div className="pc-section-heading">
                <div>
                  <p className="pc-eyebrow">
                    {finished ? "ALL SET" : `STEP 0${idx + 1}`}
                  </p>
                  <h2 id="checkout-heading" ref={heading} tabIndex={-1}>
                    {finished
                      ? "Your sample order is ready."
                      : {
                          cart: "A little kit. A lot of possibilities.",
                          details: "Let's make it yours.",
                          payment: "Choose how you'd pay.",
                          review: "One last look.",
                        }[step]}
                  </h2>
                </div>
                {!finished && (
                  <span className="pc-step-icon">
                    <Icon
                      name={
                        step === "cart"
                          ? "columns"
                          : step === "details"
                            ? "users"
                            : step === "payment"
                              ? "lock"
                              : "check"
                      }
                    />
                  </span>
                )}
              </div>
              {finished ? (
                <div className="pc-success">
                  <span className="pc-success-icon">
                    <Icon name="check" />
                  </span>
                  <h3>Thanks, {details.name.trim().split(" ")[0]}.</h3>
                  <p>
                    This is a local order preview. No payment was made and no
                    email was sent.
                  </p>
                  <dl>
                    <div>
                      <dt>Sample reference</dt>
                      <dd>OREO-DEMO-1048</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{details.email.trim()}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>{money(quote.total)}</dd>
                    </div>
                  </dl>
                  <Button tapScale={1} onClick={restart}>
                    Start a new preview
                  </Button>
                </div>
              ) : (
                <>
                  {step === "cart" &&
                    (hasItem ? (
                      <>
                        <div className="pc-product">
                          <div className="pc-art" aria-hidden="true">
                            <div className="pc-art-window">
                              <span />
                              <span />
                              <span />
                              <i />
                              <i />
                              <i />
                            </div>
                            <b>Oreo Studio Kit</b>
                            <small>Build with a little more care.</small>
                          </div>
                          <div className="pc-product-info">
                            <Tag size="sm">Digital collection</Tag>
                            <h3>Oreo Studio Kit</h3>
                            <p>
                              Components, page templates and the small details
                              that make a product feel finished.
                            </p>
                            <ul>
                              <li>
                                <Icon name="check" size="sm" />A reusable design
                                foundation
                              </li>
                              <li>
                                <Icon name="check" size="sm" />
                                Light and dark themes
                              </li>
                              <li>
                                <Icon name="check" size="sm" />
                                Responsive building blocks
                              </li>
                            </ul>
                            <strong>
                              {money(4800)} <span>/ license</span>
                            </strong>
                          </div>
                        </div>
                        <div className="pc-quantity">
                          <div>
                            <strong>Team licenses</strong>
                            <p>Choose between 1 and 5 sample licenses.</p>
                          </div>
                          <div>
                            <IconButton
                              aria-label="Remove one license"
                              type="secondary"
                              tapScale={1}
                              disabled={quantity === 1}
                              icon={<Icon name="minus" size="sm" />}
                              onClick={() => {
                                setQuantity(quantity - 1);
                                invalidate("cart");
                              }}
                            />
                            <output aria-label="License quantity">
                              {quantity}
                            </output>
                            <IconButton
                              aria-label="Add one license"
                              type="secondary"
                              tapScale={1}
                              disabled={quantity === 5}
                              icon={<Icon name="plus" size="sm" />}
                              onClick={() => {
                                setQuantity(quantity + 1);
                                invalidate("cart");
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          type="tertiary"
                          size="sm"
                          tapScale={1}
                          onClick={() => {
                            setHasItem(false);
                            invalidate("cart");
                          }}
                        >
                          Remove kit
                        </Button>
                      </>
                    ) : (
                      <AgentWorkspaceState
                        title="Your cart is empty"
                        description="Add the sample kit to explore the checkout."
                        actionLabel="Restore sample kit"
                        onAction={() => setHasItem(true)}
                      />
                    ))}
                  {step === "details" && (
                    <form
                      ref={form}
                      id="pc-details"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        next();
                      }}
                      className="pc-form"
                    >
                      <p>Use example details to explore this local flow.</p>
                      <Button
                        type="secondary"
                        size="sm"
                        tapScale={1}
                        onClick={() => {
                          setDetails({
                            name: "Alex Morgan",
                            email: "alex@example.com",
                            country: "United States",
                          });
                          setErrors({});
                          invalidate("details");
                        }}
                      >
                        Use example details
                      </Button>
                      {(["name", "email"] as const).map((k) => (
                        <label key={k}>
                          {k === "name" ? "Full name" : "Email address"}
                          <input
                            name={k}
                            autoComplete="off"
                            type={k === "email" ? "email" : "text"}
                            value={details[k]}
                            aria-invalid={!!errors[k]}
                            aria-describedby={
                              errors[k] ? `pc-${k}-error` : undefined
                            }
                            onChange={(e) => field(k, e.target.value)}
                          />
                          {errors[k] && (
                            <span
                              id={`pc-${k}-error`}
                              className="pc-field-error"
                            >
                              {errors[k]}
                            </span>
                          )}
                        </label>
                      ))}
                      <label>
                        Invoice country
                        <select
                          name="country"
                          value={details.country}
                          onChange={(e) => field("country", e.target.value)}
                          aria-invalid={!!errors.country}
                          aria-describedby={
                            errors.country ? "pc-country-error" : undefined
                          }
                        >
                          <option value="">Select a country</option>
                          {[
                            "United States",
                            "United Kingdom",
                            "Canada",
                            "Australia",
                            "Singapore",
                            "Other",
                          ].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        {errors.country && (
                          <span
                            id="pc-country-error"
                            className="pc-field-error"
                          >
                            {errors.country}
                          </span>
                        )}
                      </label>
                      <p className="pc-note">
                        Example pricing has no tax calculation. Country is
                        stored only in this page's temporary state.
                      </p>
                    </form>
                  )}
                  {step === "payment" && (
                    <div className="pc-payment">
                      <p>
                        Saved sample methods. No card details are collected.
                      </p>
                      <SavedPaymentMethods
                        methods={methods}
                        value={method}
                        onValueChange={(id) => {
                          setMethod(id);
                          invalidate("payment");
                        }}
                        loading={loading}
                        error={
                          paymentError
                            ? "The sample methods could not be loaded. Your details are preserved."
                            : undefined
                        }
                        onRetry={() => {
                          setPaymentError(false);
                          setLoading(false);
                        }}
                        onAdd={() => {
                          setMethods(SAMPLE_METHODS);
                          setMethod("visa");
                        }}
                      />
                      <details className="pc-demo">
                        <summary>Demo states</summary>
                        <Button
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          onClick={() => {
                            setLoading(!loading);
                            setMethods(loading ? SAMPLE_METHODS : []);
                            invalidate("payment");
                          }}
                        >
                          {loading ? "Finish loading" : "Show loading"}
                        </Button>
                        <Button
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          onClick={() => {
                            setMethods([]);
                            setLoading(false);
                            invalidate("payment");
                          }}
                        >
                          Show empty methods
                        </Button>
                        <Button
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          onClick={() => setPaymentError(true)}
                        >
                          Show error
                        </Button>
                      </details>
                    </div>
                  )}
                  {step === "review" && (
                    <div className="pc-review">
                      <p>
                        Everything below comes from the steps you completed.
                      </p>
                      {[
                        {
                          title: "Your kit",
                          text: `${quantity} × Oreo Studio Kit`,
                          id: "cart",
                        },
                        {
                          title: "Your details",
                          text: `${details.name} · ${details.email} · ${details.country}`,
                          id: "details",
                        },
                        {
                          title: "Payment method",
                          text:
                            selected?.brand === "Wallet"
                              ? selected.name
                              : `${selected?.brand} ending in ${selected?.last4}`,
                          id: "payment",
                        },
                      ].map((r) => (
                        <div className="pc-review-row" key={r.id}>
                          <div>
                            <h3>{r.title}</h3>
                            <p>{r.text}</p>
                          </div>
                          <Button
                            type="tertiary"
                            size="sm"
                            tapScale={1}
                            onClick={() => visit(r.id)}
                          >
                            Edit<span className="sr-only"> {r.title}</span>
                          </Button>
                        </div>
                      ))}
                      {orderError && (
                        <AgentWorkspaceState
                          title="The sample order did not complete"
                          description="Your selections are safe. Turn off the demo failure below and try again."
                          error
                        />
                      )}
                      <label className="pc-demo-check">
                        <input
                          type="checkbox"
                          checked={fail}
                          onChange={(e) => {
                            setFail(e.target.checked);
                            setOrderError(false);
                          }}
                        />{" "}
                        Simulate order failure
                      </label>
                    </div>
                  )}
                  <footer className="pc-actions">
                    <Button
                      type="tertiary"
                      tapScale={1}
                      disabled={idx === 0}
                      onClick={() => visit(CHECKOUT_STEPS[idx - 1].id)}
                    >
                      Back
                    </Button>
                    {step === "review" ? (
                      <Button tapScale={1} onClick={place}>
                        Place sample order{" "}
                        <Icon name="chevron-right" size="sm" />
                      </Button>
                    ) : (
                      <Button
                        tapScale={1}
                        {...(step === "details"
                          ? {
                              render: (
                                <button type="submit" form="pc-details" />
                              ),
                            }
                          : { onClick: next })}
                        disabled={
                          (step === "cart" && !hasItem) ||
                          (step === "payment" &&
                            (!selected || loading || paymentError))
                        }
                      >
                        Continue <Icon name="chevron-right" size="sm" />
                      </Button>
                    )}
                  </footer>
                </>
              )}
            </section>
            <aside className="pc-summary">
              {hasItem ? (
                <CheckoutSummary
                  item={`${quantity} × Studio Kit`}
                  period="One-time sample purchase"
                  quote={quote}
                >
                  <div className="pc-summary-art" aria-hidden="true">
                    o<span>studio kit</span>
                  </div>
                </CheckoutSummary>
              ) : (
                <AgentWorkspaceState
                  title="Nothing to total yet"
                  description="Restore the sample kit to see your order summary."
                />
              )}
              <p>
                <Icon name="lock" size="sm" />
                Local preview. Nothing is charged or sent.
              </p>
              <div className="pc-help">
                <strong>Good things, thoughtfully made.</strong>
                <p>Reusable components with room for your own ideas.</p>
                <a href="/progressive-steps">
                  Explore the step component <Icon name="arrow-out" size="sm" />
                </a>
              </div>
            </aside>
          </div>
        </section>
        <footer className="pc-bottom">
          <span>© Oreo Studio · Interface demo</span>
          <a
            href="https://x.com/uiinspoo/status/2110595633120002332"
            target="_blank"
            rel="noreferrer"
          >
            Reference: Saivion / uiinspoo ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
