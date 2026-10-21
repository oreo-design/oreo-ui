import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { AgentWorkspaceState } from "@/components/automation";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { TimeframeSelector, TIMEFRAMES } from "@/components/timeframe-selector";
import { SAMPLE_ASSETS } from "./data";
import "./position-studio.css";

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host}>
      <Menu modal={false}>
        <MenuTrigger aria-label={`${label}: ${value}`} className="ps-choice">
          {value}
          <Icon name="chevron-down" size="sm" />
        </MenuTrigger>
        <MenuPopup container={host} align="end">
          {options.map((o) => (
            <MenuItem
              key={o}
              selected={value === o}
              onClick={() => onChange(o)}
            >
              {o}
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
}
type Position = {
  id: number;
  asset: string;
  type: string;
  direction: string;
  timeframe: string;
  stake: number;
  target?: string;
  opponent?: string;
};
export function PositionStudio() {
  const [dark, setDark] = useThemeMode(false);
  const [asset, setAsset] = useState("eth");
  const [opponent, setOpponent] = useState("btc");
  const [type, setType] = useState("Up / Down");
  const [direction, setDirection] = useState("Goes up");
  const [timeframe, setTimeframe] = useState("24h");
  const [stake, setStake] = useState("50");
  const [target, setTarget] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const stakeInput = useRef<HTMLInputElement>(null);
  const targetInput = useRef<HTMLInputElement>(null);
  const balance = 1000 - positions.reduce((sum, p) => sum + p.stake, 0);
  const amount = Number(stake);
  const validAmount =
    Number.isInteger(amount) && amount > 0 && amount <= balance;
  const directions =
    type === "Over / Under"
      ? ["Goes over", "Goes under"]
      : type === "Token vs Token"
        ? ["Outperforms", "Underperforms"]
        : ["Goes up", "Goes down"];
  function edit() {
    setOpened(false);
    setError("");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (opened) return;
    if (!validAmount) {
      setError(`Enter a whole number from 1 to ${balance} points.`);
      stakeInput.current?.focus();
      return;
    }
    if (
      type === "Over / Under" &&
      (!target || !Number.isFinite(Number(target)) || Number(target) <= 0)
    ) {
      setError("Enter a target price greater than zero.");
      targetInput.current?.focus();
      return;
    }
    if (type === "Token vs Token" && asset === opponent) {
      setError("Choose two different tokens.");
      return;
    }
    setPositions((p) => [
      {
        id: p.length + 1,
        asset,
        type,
        direction,
        timeframe,
        stake: amount,
        target: type === "Over / Under" ? target : undefined,
        opponent: type === "Token vs Token" ? opponent : undefined,
      },
      ...p,
    ]);
    setOpened(true);
    setError("");
  }
  return (
    <div className={`position-studio ${dark ? "theme-dark" : ""}`}>
      <header className="ps-top">
        <a
          href="/timeframe-selector"
          className="flex items-center gap-2 text-sm"
        >
          <Icon name="chevron-left" size="sm" />
          Oreo UI <span className="text-text-tertiary">/ Templates</span>
        </a>
        <IconButton
          type="tertiary"
          tapScale={1}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          icon={<Icon name={dark ? "sun" : "moon"} />}
          onClick={() => setDark((v) => !v)}
        />
      </header>
      <main className="ps-main">
        <div className="ps-intro">
          <span className="ps-eyebrow">A LITTLE CONVICTION.</span>
          <h1>Make your next move.</h1>
          <p>
            Pick a token. Set your horizon.
            <br />
            See where your intuition takes you.
          </p>
          <div className="ps-balance">
            <span className="size-2 rounded-full bg-status-success" />{" "}
            <strong>{balance.toLocaleString("en-US")}</strong> practice points
            available
          </div>
        </div>
        <div className="ps-workspace">
          <section aria-label="New position" className="ps-card">
            <div className="ps-card-heading">
              <h2>New position</h2>
              <span>Practice mode</span>
            </div>
            <form noValidate onSubmit={submit}>
              <div className="ps-fields">
                <div className="ps-row">
                  <span>Token</span>
                  <InlineSearchSelect
                    label="Token"
                    placeholder="Search tokens"
                    options={SAMPLE_ASSETS}
                    value={asset}
                    onValueChange={(v) => {
                      setAsset(v);
                      edit();
                    }}
                  />
                </div>
                <div className="ps-row">
                  <span>Position type</span>
                  <Choice
                    label="Position type"
                    value={type}
                    options={["Up / Down", "Over / Under", "Token vs Token"]}
                    onChange={(v) => {
                      setType(v);
                      setDirection(
                        v === "Over / Under"
                          ? "Goes over"
                          : v === "Token vs Token"
                            ? "Outperforms"
                            : "Goes up",
                      );
                      edit();
                    }}
                  />
                </div>
                <div className="ps-row">
                  <span>Direction</span>
                  <Choice
                    label="Direction"
                    value={direction}
                    options={directions}
                    onChange={(v) => {
                      setDirection(v);
                      edit();
                    }}
                  />
                </div>
                {type === "Over / Under" && (
                  <div className="ps-row">
                    <label htmlFor="target-price">Target price</label>
                    <input
                      ref={targetInput}
                      id="target-price"
                      className="ps-number"
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="2,800"
                      value={target}
                      aria-describedby={error ? "position-error" : undefined}
                      onChange={(e) => {
                        setTarget(e.target.value);
                        edit();
                      }}
                    />
                  </div>
                )}
                {type === "Token vs Token" && (
                  <div className="ps-row">
                    <span>Compared with</span>
                    <InlineSearchSelect
                      label="Comparison token"
                      options={SAMPLE_ASSETS.filter((a) => a.value !== asset)}
                      value={opponent}
                      onValueChange={(v) => {
                        setOpponent(v);
                        edit();
                      }}
                    />
                  </div>
                )}
                <div className="ps-row">
                  <span>Timeframe</span>
                  <TimeframeSelector
                    value={timeframe}
                    onValueChange={(v) => {
                      setTimeframe(v);
                      edit();
                    }}
                  />
                </div>
                <div className="ps-row">
                  <label htmlFor="stake">Stake amount</label>
                  <input
                    ref={stakeInput}
                    id="stake"
                    className="ps-number"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={balance}
                    step="1"
                    value={stake}
                    aria-describedby={error ? "position-error" : "stake-help"}
                    onChange={(e) => {
                      setStake(e.target.value);
                      edit();
                    }}
                  />
                </div>
              </div>
              <dl className="ps-totals">
                <div>
                  <dt>Total stake</dt>
                  <dd>
                    {Number.isFinite(amount) && amount > 0
                      ? amount.toLocaleString("en-US")
                      : "—"}{" "}
                    points
                  </dd>
                </div>
                <div>
                  <dt>Practice pool</dt>
                  <dd>
                    {Number.isFinite(amount) && amount > 0
                      ? (amount * 2).toLocaleString("en-US")
                      : "—"}{" "}
                    points
                  </dd>
                </div>
              </dl>
              <p id="stake-help" className="ps-help">
                Sample prices, imaginary points. Positions stay in this page and
                reset on reload.
              </p>
              {error && (
                <p id="position-error" role="alert" className="ps-error">
                  {error}
                </p>
              )}
              <Button
                render={<button type="submit" />}
                tapScale={1}
                disabled={opened || balance === 0}
                leadingIcon={
                  opened ? <Icon name="check" size="sm" /> : undefined
                }
                className={`w-full rounded-capsule ${opened ? "ps-success" : ""}`}
              >
                {opened
                  ? "Position opened"
                  : balance === 0
                    ? "No points remaining"
                    : "Open new position"}
              </Button>
              <p className="sr-only" role="status">
                {opened
                  ? "Position opened. Edit a field to start another position."
                  : ""}
              </p>
            </form>
          </section>
          <aside className="ps-history" aria-label="Practice positions">
            <div className="ps-history-title">
              <h2>Your positions</h2>
              <span>{positions.length.toString().padStart(2, "0")}</span>
            </div>
            {positions.length === 0 ? (
              <AgentWorkspaceState
                title="Room for a first move"
                description="Your practice positions will appear here."
              />
            ) : (
              <ol>
                {positions.map((p) => (
                  <li key={p.id}>
                    <div className="flex items-center justify-between">
                      <strong>{p.asset.toUpperCase()}</strong>
                      <span>
                        {TIMEFRAMES.find((t) => t.value === p.timeframe)?.label}
                      </span>
                    </div>
                    <p>
                      {p.direction}
                      {p.target ? ` $${p.target}` : ""}
                      {p.opponent ? ` ${p.opponent.toUpperCase()}` : ""}
                    </p>
                    <div className="ps-position-foot">
                      <span>{p.stake} points</span>
                      <span>Open · #{p.id.toString().padStart(2, "0")}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {positions.length > 0 && (
              <Button
                type="tertiary"
                tapScale={1}
                size="sm"
                onClick={() => {
                  setPositions([]);
                  edit();
                }}
              >
                Reset practice
              </Button>
            )}
          </aside>
        </div>
      </main>
      <footer className="ps-footer">
        <span>Position Studio · Built with Oreo UI</span>
        <a
          href="https://x.com/rndr_realm/status/2110457217451462693"
          target="_blank"
          rel="noreferrer"
        >
          Interaction reference by Rndr Realm ↗
        </a>
      </footer>
    </div>
  );
}
