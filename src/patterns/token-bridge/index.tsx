import { useEffect, useReducer, useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ChainTokenPicker,
  TokenAmountPanel,
  ChainTokenBadge,
  bridgeReducer,
  quoteBridge,
  formatUnits,
  type BridgeQuote,
  type BridgeToken,
} from "@/components/token-bridge";
import { BRIDGE_CHAINS, BRIDGE_TOKENS } from "./data";
import "./workspace.css";
export function TokenBridgePage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    returnTo = useRef<HTMLElement | null>(null);
  const [ledger, dispatch] = useReducer(bridgeReducer, {
      tokens: BRIDGE_TOKENS,
      pending: null,
      history: [],
      error: "",
    }),
    [fromId, setFromId] = useState("eth-usdc"),
    [toId, setToId] = useState("sol-usdc"),
    [amount, setAmount] = useState("200"),
    [dark, setDark] = useState(true),
    [connected, setConnected] = useState(true),
    [fast, setFast] = useState(false),
    [failNext, setFailNext] = useState(false),
    [modal, setModal] = useState<
      "from" | "to" | "settings" | "review" | "history" | null
    >(null),
    [pickerState, setPickerState] = useState("ready"),
    [notice, setNotice] = useState("");
  const from = ledger.tokens.find((t) => t.id === fromId)!,
    to = ledger.tokens.find((t) => t.id === toId)!,
    fromChain = BRIDGE_CHAINS.find((c) => c.id === from.chainId)!,
    toChain = BRIDGE_CHAINS.find((c) => c.id === to.chainId)!,
    busy = !!ledger.pending;
  let quote: BridgeQuote | null = null,
    error = "";
  try {
    quote = quoteBridge(from, to, amount, fast);
  } catch (e) {
    error = e instanceof Error ? e.message : "Route unavailable";
  }
  useEffect(() => {
    if (!ledger.pending) return;
    const id = ledger.pending.id,
      timer = setTimeout(
        () => dispatch({ type: "finish", id, time: new Date().toISOString() }),
        1800,
      );
    return () => clearTimeout(timer);
  }, [ledger.pending]);
  useEffect(() => {
    if (ledger.history.length)
      setNotice("Simulation complete. Demo balances updated.");
  }, [ledger.history.length]);
  function open(next: typeof modal) {
    returnTo.current = document.activeElement as HTMLElement;
    setModal(next);
    setPickerState("ready");
  }
  function choose(token: BridgeToken) {
    if (modal === "from") {
      setFromId(token.id);
      if (token.symbol !== to.symbol || token.chainId === to.chainId) {
        const candidate = ledger.tokens.find(
          (t) => t.symbol === token.symbol && t.chainId !== token.chainId,
        );
        if (candidate) setToId(candidate.id);
      }
    } else setToId(token.id);
    dispatch({ type: "clear-error" });
    setNotice("");
    setModal(null);
  }
  function changeAmount(value: string) {
    setAmount(value);
    setNotice("");
    dispatch({ type: "clear-error" });
  }
  function simulate() {
    if (!connected || !quote || busy) return;
    dispatch({
      type: "start",
      id: crypto.randomUUID(),
      fromId,
      toId,
      amount,
      fast,
      fail: failNext,
    });
    setFailNext(false);
    setNotice("");
    setModal(null);
  }
  function exportHistory() {
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              {
                demo: true,
                transfers: ledger.history,
                balances: ledger.tokens,
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
    a.href = url;
    a.download = "oreo-bridge-demo.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Demo history exported.");
  }
  const title =
    modal === "from"
      ? "Select a source token"
      : modal === "to"
        ? "Select a destination token"
        : modal === "settings"
          ? "Route preferences"
          : modal === "review"
            ? "Review sample transfer"
            : "Simulation history";
  return (
    <div ref={root} className={`bt-workspace ${dark ? "theme-dark" : ""}`}>
      <header className="bt-header">
        <a href="/" className="bt-brand">
          o. <span>Oreo Bridge</span>
        </a>
        <nav aria-label="Bridge navigation">
          <a href="/chain-token-picker">Components</a>
          <a href="/changelog">Changelog</a>
        </nav>
        <div>
          <Tag>Local demo</Tag>
          <IconButton
            icon={<Icon name={dark ? "sun" : "moon"} />}
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => setDark(!dark)}
          />
        </div>
      </header>
      <main className="bt-main">
        <div className="bt-intro">
          <span className="bt-eyebrow">A LITTLE LESS BETWEEN</span>
          <h1 ref={heading} tabIndex={-1}>
            Move across chains.
          </h1>
          <p>One token. A different network. A clear view of every step.</p>
        </div>
        <section className="bt-bridge" aria-label="Token bridge">
          <header>
            <h2>Bridge</h2>
            <span className="bt-connection">
              <i data-connected={connected} />
              {connected ? "Demo wallet" : "Disconnected"}
            </span>
            <IconButton
              icon={<Icon name="gear" />}
              type="secondary"
              tapScale={1}
              disabled={busy}
              aria-label="Route preferences"
              onClick={() => open("settings")}
            />
            <IconButton
              icon={<Icon name="clock-history" />}
              type="secondary"
              tapScale={1}
              aria-label="Simulation history"
              onClick={() => open("history")}
            />
          </header>
          <TokenAmountPanel
            label="From"
            chain={fromChain}
            token={from}
            amount={amount}
            onAmountChange={changeAmount}
            onSelect={() => open("from")}
            onMax={() => changeAmount(from.balance)}
            disabled={busy}
            wallet={connected ? "Demo wallet" : "Not connected"}
            estimate="You send · sample balance"
            error={amount ? error : undefined}
          />
          <div className="bt-route-meta">
            <span>
              Fee{" "}
              <strong>
                {quote ? `${formatUnits(quote.fee)} ${from.symbol}` : "—"}
              </strong>
            </span>
            <IconButton
              icon={<Icon name="arrow-down" />}
              type="tertiary"
              tapScale={1}
              disabled={busy}
              aria-label="Reverse route"
              onClick={() => {
                setFromId(toId);
                setToId(fromId);
                setNotice("");
                dispatch({ type: "clear-error" });
              }}
            />
            <span>
              <strong>{quote ? `${quote.seconds} sec` : "—"}</strong> estimate
            </span>
          </div>
          <TokenAmountPanel
            label="To"
            chain={toChain}
            token={to}
            amount={quote ? formatUnits(quote.received) : ""}
            onSelect={() => open("to")}
            disabled={busy}
            wallet={connected ? "Demo wallet" : "Not connected"}
            estimate="You receive · after sample fee"
          />
          {ledger.error && (
            <div className="bt-error">
              <AgentWorkspaceState
                error
                title="Simulation interrupted"
                description={ledger.error}
                actionLabel="Try again"
                onAction={() => open("review")}
              />
            </div>
          )}
          {busy ? (
            <div className="bt-progress" role="status">
              <Icon name="clock-history" />
              <span>
                Simulating the route…
                <small>No transaction is being sent.</small>
              </span>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  dispatch({ type: "cancel" });
                  setNotice("Simulation cancelled. Balances unchanged.");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="bt-submit"
              tapScale={1}
              leadingIcon={<Icon name={connected ? "arrow-out" : "plug"} />}
              disabled={connected && (!quote || !!error)}
              onClick={() =>
                connected
                  ? open("review")
                  : (setConnected(true), setNotice("Demo wallet connected."))
              }
            >
              {connected ? "Review sample transfer" : "Use demo wallet"}
            </Button>
          )}
          <div className="bt-note">
            <Icon name="info" size="sm" />
            <span>
              Sample balances, fees and timing. No wallet connection or real
              transfer.
            </span>
          </div>
          <p role="status" className="bt-notice">
            {notice}
          </p>
        </section>
        <footer className="bt-footer">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConnected(!connected);
              setNotice(
                connected
                  ? "Demo wallet disconnected."
                  : "Demo wallet connected.",
              );
            }}
          >
            {connected ? "Disconnect demo wallet" : "Connect demo wallet"}
          </button>
          <a
            href="https://x.com/vanjek/status/2110693639664050203"
            target="_blank"
            rel="noreferrer"
          >
            Inspired by George / Bondin ↗
          </a>
        </footer>
      </main>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(v) => {
          if (!v) setModal(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="bt-backdrop" />
          <Dialog.Popup
            className={`bt-dialog ${modal === "from" || modal === "to" ? "bt-dialog-picker" : ""}`}
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>
                  {modal === "from" || modal === "to"
                    ? "Choose a chain, then a token from the demo wallet."
                    : modal === "history"
                      ? "Local simulations only. This history resets on reload."
                      : modal === "settings"
                        ? "These preferences change the fictional route quote."
                        : "Nothing will be broadcast. Only the demo balances will change."}
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    icon={<Icon name="x" />}
                    aria-label="Close dialog"
                    tapScale={1}
                  />
                }
              />
            </header>
            {modal === "from" || modal === "to" ? (
              <>
                <ChainTokenPicker
                  key={modal}
                  chains={BRIDGE_CHAINS}
                  tokens={ledger.tokens}
                  value={modal === "from" ? fromId : toId}
                  onSelect={choose}
                  loading={pickerState === "loading"}
                  error={
                    pickerState === "error"
                      ? "The sample token list could not load."
                      : undefined
                  }
                  onRetry={() => setPickerState("ready")}
                />
                <footer className="bt-picker-fixture">
                  <label>
                    Preview state{" "}
                    <select
                      aria-label="Token picker preview state"
                      value={pickerState}
                      onChange={(e) => setPickerState(e.target.value)}
                    >
                      <option value="ready">Ready</option>
                      <option value="loading">Loading</option>
                      <option value="error">Error</option>
                    </select>
                  </label>
                  <span>Demo assets</span>
                </footer>
              </>
            ) : modal === "settings" ? (
              <div className="bt-dialog-scroll">
                <fieldset>
                  <legend>Sample route speed</legend>
                  {[
                    {
                      id: false,
                      title: "Standard",
                      text: "20–30 sec · base sample fee",
                    },
                    {
                      id: true,
                      title: "Express",
                      text: "10 sec · adds 0.25 token to the sample fee",
                    },
                  ].map((s) => (
                    <label className="bt-setting" key={String(s.id)}>
                      <input
                        type="radio"
                        name="speed"
                        checked={fast === s.id}
                        onChange={() => setFast(s.id)}
                      />
                      <span>
                        <strong>{s.title}</strong>
                        <small>{s.text}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
                <label className="bt-setting">
                  <input
                    type="checkbox"
                    checked={failNext}
                    onChange={(e) => setFailNext(e.target.checked)}
                  />
                  <span>
                    <strong>Fail next simulation</strong>
                    <small>Try recovery without changing demo balances.</small>
                  </span>
                </label>
              </div>
            ) : modal === "review" ? (
              <>
                <div className="bt-dialog-scroll">
                  <div className="bt-review-route">
                    <ChainTokenBadge chain={fromChain} token={from} />
                    <Icon name="arrow-down" />
                    <ChainTokenBadge chain={toChain} token={to} />
                  </div>
                  {!quote ? (
                    <AgentWorkspaceState
                      error
                      title="Route unavailable"
                      description={error}
                    />
                  ) : (
                    <dl className="bt-quote">
                      <div>
                        <dt>Send</dt>
                        <dd>
                          {formatUnits(quote.amount)} {from.symbol}
                        </dd>
                      </div>
                      <div>
                        <dt>Sample fee</dt>
                        <dd>
                          {formatUnits(quote.fee)} {from.symbol}
                        </dd>
                      </div>
                      <div>
                        <dt>Receive</dt>
                        <dd>
                          {formatUnits(quote.received)} {to.symbol}
                        </dd>
                      </div>
                      <div>
                        <dt>Estimated route time</dt>
                        <dd>{quote.seconds} seconds</dd>
                      </div>
                      <div>
                        <dt>Execution</dt>
                        <dd>Local simulation</dd>
                      </div>
                    </dl>
                  )}
                </div>
                <footer>
                  <Dialog.Close
                    render={<Button type="secondary" tapScale={1} />}
                  >
                    Go back
                  </Dialog.Close>
                  <Button
                    tapScale={1}
                    disabled={!quote || !connected || busy}
                    onClick={simulate}
                  >
                    Simulate transfer
                  </Button>
                </footer>
              </>
            ) : (
              <>
                <div className="bt-dialog-scroll">
                  {!ledger.history.length ? (
                    <AgentWorkspaceState
                      title="No simulations yet"
                      description="Review a route and simulate a transfer to see it here."
                    />
                  ) : (
                    <ol className="bt-history">
                      {ledger.history.map((r) => {
                        const f = ledger.tokens.find((t) => t.id === r.fromId)!,
                          t = ledger.tokens.find((t) => t.id === r.toId)!;
                        return (
                          <li key={r.id}>
                            <header>
                              <Tag color="mint">Simulated</Tag>
                              <time dateTime={r.time}>
                                {new Date(r.time).toLocaleString("en-US")}
                              </time>
                            </header>
                            <strong>
                              {r.amount} {r.symbol}
                            </strong>
                            <p>
                              {
                                BRIDGE_CHAINS.find((c) => c.id === f.chainId)
                                  ?.name
                              }{" "}
                              →{" "}
                              {
                                BRIDGE_CHAINS.find((c) => c.id === t.chainId)
                                  ?.name
                              }
                            </p>
                            <small>
                              Received {r.received} · Fee {r.fee} {r.symbol}
                            </small>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
                <footer>
                  <Button type="secondary" tapScale={1} onClick={exportHistory}>
                    Export demo history
                  </Button>
                  <Dialog.Close render={<Button tapScale={1} />}>
                    Done
                  </Dialog.Close>
                </footer>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
