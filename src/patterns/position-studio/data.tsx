import type { InlineSearchOption } from "@/components/inline-search-select";
const badge = (symbol: string) => (
  <span className="grid size-5 place-items-center rounded-full bg-bg-inverse text-bg-base text-xs font-semibold">
    {symbol}
  </span>
);
export const SAMPLE_ASSETS: readonly InlineSearchOption[] = [
  {
    value: "eth",
    label: "ETH",
    description: "Ethereum",
    meta: "$2,640.00",
    icon: badge("Ξ"),
  },
  {
    value: "btc",
    label: "BTC",
    description: "Bitcoin",
    meta: "$94,200.00",
    icon: badge("₿"),
  },
  {
    value: "bnb",
    label: "BNB",
    description: "BNB",
    meta: "$729.81",
    icon: badge("B"),
  },
  {
    value: "sol",
    label: "SOL",
    description: "Solana",
    meta: "$182.40",
    icon: badge("S"),
  },
  {
    value: "avax",
    label: "AVAX",
    description: "Avalanche",
    meta: "$24.60",
    icon: badge("A"),
  },
];
