export type Chain = {
  id: string;
  name: string;
  mark: string;
  tone: "blue" | "purple" | "mint" | "orange";
  popular?: boolean;
};
export type BridgeToken = {
  id: string;
  chainId: string;
  name: string;
  symbol: string;
  mark: string;
  decimals: number;
  balance: string;
};
export function parseUnits(value: string, decimals = 6): bigint | null {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) return null;
  const text = value.trim();
  if (!/^\d{1,20}(\.\d*)?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  if (fraction.length > decimals) return null;
  return (
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, "0") || "0")
  );
}
export function formatUnits(value: bigint, decimals = 6) {
  if (
    value < 0n ||
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    decimals > 18
  )
    throw new RangeError("Invalid token amount");
  const digits = value.toString().padStart(decimals + 1, "0");
  if (!decimals) return digits;
  const fraction = digits.slice(-decimals).replace(/0+$/, "");
  return digits.slice(0, -decimals) + (fraction ? "." + fraction : "");
}
export function displayAmount(value: string) {
  const [whole, fraction] = value.split(".");
  return (
    whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (fraction ? "." + fraction : "")
  );
}
export type BridgeQuote = {
  amount: bigint;
  fee: bigint;
  received: bigint;
  seconds: number;
};
export function quoteBridge(
  from: BridgeToken,
  to: BridgeToken,
  value: string,
  fast = false,
): BridgeQuote {
  if (from.chainId === to.chainId)
    throw new Error("Choose a different destination chain.");
  if (from.symbol !== to.symbol)
    throw new Error("Choose the same token on both chains.");
  if (
    !["USDC", "USDT"].includes(from.symbol) ||
    from.decimals !== 6 ||
    to.decimals !== 6
  )
    throw new Error("This sample supports USDC and USDT routes only.");
  const amount = parseUnits(value, from.decimals),
    balance = parseUnits(from.balance, from.decimals);
  if (amount === null || amount <= 0n)
    throw new Error("Enter a positive amount with up to 6 decimal places.");
  if (balance === null) throw new Error("Balance is unavailable.");
  if (amount > balance) throw new Error("Amount exceeds your demo balance.");
  const base =
    from.chainId === "ethereum"
      ? 3850000n
      : from.chainId === "arbitrum"
        ? 420000n
        : 150000n;
  const fee = fast ? base + 250000n : base;
  if (amount <= fee)
    throw new Error(
      `Amount must exceed the sample fee of ${formatUnits(fee)} ${from.symbol}.`,
    );
  return {
    amount,
    fee,
    received: amount - fee,
    seconds: fast ? 10 : from.chainId === "ethereum" ? 30 : 20,
  };
}
export function filterTokens(
  tokens: BridgeToken[],
  chainId: string,
  query: string,
) {
  const q = query.trim().toLowerCase();
  return tokens.filter(
    (t) =>
      (chainId === "all" || t.chainId === chainId) &&
      `${t.name} ${t.symbol} ${t.chainId}`.toLowerCase().includes(q),
  );
}
/** Pure settlement for the local fixture; a second application must be rejected by the host run ID. */
export function applyBridge(
  tokens: BridgeToken[],
  fromId: string,
  toId: string,
  quote: BridgeQuote,
) {
  const from = tokens.find((t) => t.id === fromId),
    to = tokens.find((t) => t.id === toId);
  if (
    !from ||
    !to ||
    fromId === toId ||
    from.chainId === to.chainId ||
    from.symbol !== to.symbol ||
    from.decimals !== to.decimals
  )
    throw new Error("Invalid sample route");
  const source = parseUnits(from.balance, from.decimals),
    destination = parseUnits(to.balance, to.decimals);
  if (
    source === null ||
    destination === null ||
    source < quote.amount ||
    quote.amount <= 0n ||
    quote.received <= 0n ||
    quote.fee < 0n ||
    quote.received + quote.fee !== quote.amount
  )
    throw new Error("Invalid sample settlement");
  return tokens.map((t) =>
    t.id === fromId
      ? { ...t, balance: formatUnits(source - quote.amount, t.decimals) }
      : t.id === toId
        ? {
            ...t,
            balance: formatUnits(destination + quote.received, t.decimals),
          }
        : t,
  );
}
export type BridgeRecord = {
  id: string;
  fromId: string;
  toId: string;
  amount: string;
  fee: string;
  received: string;
  symbol: string;
  time: string;
};
export type BridgeLedger = {
  tokens: BridgeToken[];
  pending: null | {
    id: string;
    fromId: string;
    toId: string;
    quote: BridgeQuote;
    fail: boolean;
  };
  history: BridgeRecord[];
  error: string;
};
export type BridgeAction =
  | {
      type: "start";
      id: string;
      fromId: string;
      toId: string;
      amount: string;
      fast: boolean;
      fail: boolean;
    }
  | { type: "finish"; id: string; time: string }
  | { type: "cancel" }
  | { type: "clear-error" };
export function bridgeReducer(
  state: BridgeLedger,
  action: BridgeAction,
): BridgeLedger {
  if (action.type === "clear-error") return { ...state, error: "" };
  if (action.type === "cancel") return { ...state, pending: null };
  if (action.type === "start") {
    if (
      state.pending ||
      state.history.some((r) => r.id === action.id) ||
      !action.id
    )
      return state;
    const from = state.tokens.find((t) => t.id === action.fromId),
      to = state.tokens.find((t) => t.id === action.toId);
    if (!from || !to) return { ...state, error: "Choose a valid route." };
    try {
      return {
        ...state,
        error: "",
        pending: {
          id: action.id,
          fromId: from.id,
          toId: to.id,
          quote: quoteBridge(from, to, action.amount, action.fast),
          fail: action.fail,
        },
      };
    } catch (e) {
      return {
        ...state,
        error: e instanceof Error ? e.message : "Route unavailable",
      };
    }
  }
  if (!state.pending || state.pending.id !== action.id) return state;
  const p = state.pending;
  if (p.fail)
    return {
      ...state,
      pending: null,
      error: "The sample route failed. No balances changed. Try again.",
    };
  const from = state.tokens.find((t) => t.id === p.fromId)!;
  return {
    ...state,
    tokens: applyBridge(state.tokens, p.fromId, p.toId, p.quote),
    pending: null,
    error: "",
    history: [
      {
        id: p.id,
        fromId: p.fromId,
        toId: p.toId,
        amount: formatUnits(p.quote.amount),
        fee: formatUnits(p.quote.fee),
        received: formatUnits(p.quote.received),
        symbol: from.symbol,
        time: action.time,
      },
      ...state.history,
    ],
  };
}
