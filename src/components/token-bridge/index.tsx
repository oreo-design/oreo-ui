import { useId, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  displayAmount,
  filterTokens,
  type Chain,
  type BridgeToken,
} from "./model";
import "./token-bridge.css";
export * from "./model";
export function ChainTokenBadge({
  chain,
  token,
  compact = false,
}: {
  chain: Chain;
  token: Pick<BridgeToken, "symbol" | "mark">;
  compact?: boolean;
}) {
  return (
    <span className="tb-badge" data-tone={chain.tone}>
      <span className="tb-marks" aria-hidden>
        <i>{chain.mark}</i>
        <i>{token.mark}</i>
      </span>
      {!compact && <span className="tb-chain-name">{chain.name}</span>}
      <strong>{token.symbol}</strong>
    </span>
  );
}
export function TokenAmountPanel({
  label,
  chain,
  token,
  amount,
  onAmountChange,
  onSelect,
  onMax,
  disabled = false,
  estimate,
  wallet = "Demo wallet",
  error,
}: {
  label: string;
  chain: Chain;
  token: BridgeToken;
  amount: string;
  onAmountChange?: (value: string) => void;
  onSelect?: () => void;
  onMax?: () => void;
  disabled?: boolean;
  estimate?: string;
  wallet?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <section
      className="tb-amount"
      data-tone={chain.tone}
      aria-label={`${label} amount`}
    >
      <header>
        <span>{label}</span>
        <span className="tb-wallet">
          <Icon name="columns" size="sm" />
          {wallet}
        </span>
        <span className="tb-balance">
          Balance: {displayAmount(token.balance)} {token.symbol}
        </span>
        {onMax && (
          <Button
            type="tertiary"
            size="sm"
            tapScale={1}
            disabled={disabled}
            onClick={onMax}
          >
            Max
          </Button>
        )}
      </header>
      <div className="tb-amount-body">
        <div>
          <label htmlFor={id}>{estimate ?? "Sample amount"}</label>
          {onAmountChange ? (
            <input
              id={id}
              aria-label={`${label} token amount`}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              maxLength={40}
              value={amount}
              disabled={disabled}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0"
            />
          ) : (
            <output id={id} aria-label={`${label} token amount`}>
              {amount || "—"}
            </output>
          )}
        </div>
        {onSelect ? (
          <button
            type="button"
            disabled={disabled}
            className="tb-token-trigger"
            onClick={onSelect}
            aria-label={`Choose ${label.toLowerCase()} token: ${chain.name} ${token.symbol}`}
          >
            <ChainTokenBadge chain={chain} token={token} />
            <Icon name="chevron-down" size="sm" />
          </button>
        ) : (
          <ChainTokenBadge chain={chain} token={token} />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="tb-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
export function ChainTokenPicker({
  chains,
  tokens,
  value,
  onSelect,
  loading = false,
  error,
  onRetry,
}: {
  chains: Chain[];
  tokens: BridgeToken[];
  value?: string;
  onSelect: (token: BridgeToken) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const [chainId, setChainId] = useState("all"),
    [chainQuery, setChainQuery] = useState(""),
    [query, setQuery] = useState("");
  const shownChains = chains.filter((c) =>
      c.name.toLowerCase().includes(chainQuery.trim().toLowerCase()),
    ),
    shown = filterTokens(tokens, chainId, query),
    chain = chains.find((c) => c.id === chainId);
  return (
    <div className="tb-picker" aria-busy={loading}>
      <section aria-label="Chains">
        <header>
          <h3>Chains</h3>
          <label>
            <Icon name="search" size="sm" />
            <input
              type="search"
              aria-label="Search chains"
              placeholder="Search chains"
              value={chainQuery}
              onChange={(e) => setChainQuery(e.target.value)}
            />
          </label>
        </header>
        <div className="tb-chain-list">
          <button
            type="button"
            aria-pressed={chainId === "all"}
            onClick={() => setChainId("all")}
          >
            <span className="tb-chain-mark tb-chain-all" aria-hidden>
              ↕
            </span>
            All chains
          </button>
          {loading ? (
            <div
              className="tb-picker-skeleton"
              role="status"
              aria-label="Loading chains"
            >
              <i />
              <i />
              <i />
            </div>
          ) : (
            <>
              {(["Popular chains", "Other chains"] as const).map((group, i) => {
                const list = shownChains.filter(
                  (c) => !!c.popular === (i === 0),
                );
                return list.length ? (
                  <div className="tb-chain-group" key={group}>
                    <h4>{group}</h4>
                    {list.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        aria-pressed={chainId === c.id}
                        onClick={() => setChainId(c.id)}
                      >
                        <span
                          className="tb-chain-mark"
                          data-tone={c.tone}
                          aria-hidden
                        >
                          {c.mark}
                        </span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                ) : null;
              })}
              {!shownChains.length && (
                <p className="tb-search-note" role="status">
                  No chains match this search.
                </p>
              )}
            </>
          )}
        </div>
      </section>
      <section aria-label="Tokens">
        <header>
          <h3>{chain ? `${chain.name} tokens` : "Tokens"}</h3>
          <label>
            <Icon name="search" size="sm" />
            <input
              type="search"
              aria-label="Search tokens"
              placeholder="Search tokens"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </header>
        <div className="tb-token-list">
          {loading ? (
            <div
              className="tb-picker-skeleton"
              role="status"
              aria-label="Loading tokens"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : error ? (
            <AgentWorkspaceState
              error
              title="Tokens unavailable"
              description={error}
              actionLabel={onRetry ? "Retry" : undefined}
              onAction={onRetry}
            />
          ) : !shown.length ? (
            <AgentWorkspaceState
              title="No tokens found"
              description="Try another token name or view all chains."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery("");
                setChainQuery("");
                setChainId("all");
              }}
            />
          ) : (
            <ul>
              {shown.map((t) => {
                const c = chains.find((c) => c.id === t.chainId);
                return c ? (
                  <li key={t.id}>
                    <button
                      type="button"
                      aria-pressed={value === t.id}
                      onClick={() => onSelect(t)}
                    >
                      <span className="tb-token-identity">
                        <ChainTokenBadge chain={c} token={t} compact />
                        <span>
                          {t.name}
                          <small>{c.name}</small>
                        </span>
                      </span>
                      <span className="tb-token-balance">
                        {displayAmount(t.balance)} <small>{t.symbol}</small>
                      </span>
                      {value === t.id && <Icon name="check" size="sm" />}
                    </button>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
