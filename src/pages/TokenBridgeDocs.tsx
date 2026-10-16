import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TokenBridgeDocs({ nav }: { nav: DocsNav }) {
  const badge = nav.active === "chain-token-badge",
    panel = nav.active === "token-amount-panel",
    name = badge
      ? "Chain Token Badge"
      : panel
        ? "Token Amount Panel"
        : "Chain Token Picker";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {badge
                ? "Overlapping chain and token marks with optional network text."
                : panel
                  ? "An amount surface with wallet context, exact balance, Max action and a chain-aware token trigger."
                  : "Two independent searches for chains and tokens, with grouped networks, token balances and controlled selection."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/token-bridge"
            >
              Open Token Bridge ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                badge
                  ? 'import { ChainTokenBadge } from "@/components/token-bridge";\n\n<ChainTokenBadge chain={chain} token={token} />'
                  : panel
                    ? 'import { TokenAmountPanel } from "@/components/token-bridge";\n\n<TokenAmountPanel label="From" chain={chain} token={token} amount={amount} onAmountChange={setAmount} onSelect={openPicker} onMax={useBalance} />'
                    : 'import { ChainTokenPicker } from "@/components/token-bridge";\n\n<ChainTokenPicker chains={chains} tokens={tokens} value={selectedId} onSelect={selectToken} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                badge
                  ? [
                      {
                        prop: "chain / token",
                        type: "Chain / {symbol, mark}",
                        desc: "Caller-owned identity data. Chain tone maps to blue, purple, mint or orange Oreo palette pairs; marks are decorative text glyphs.",
                      },
                      {
                        prop: "compact",
                        type: "boolean",
                        desc: "Hides the network label while keeping the token symbol. Default false.",
                      },
                    ]
                  : panel
                    ? [
                        {
                          prop: "label / chain / token / amount",
                          type: "string / Chain / BridgeToken / string",
                          desc: "Amount stays a decimal string. Token balance is an exact decimal string; no floating-point conversion. Use From/To labels or your own context.",
                        },
                        {
                          prop: "onAmountChange / onSelect / onMax",
                          type: "callbacks",
                          desc: "Input becomes a read-only output when onAmountChange is omitted. Selection and Max only appear when their callbacks are supplied. Host validates amount and chooses the token.",
                        },
                        {
                          prop: "wallet / estimate / error / disabled",
                          type: "string / string / string / boolean",
                          desc: "Context, helper copy, linked validation message and disabled interaction. Disabled leaves values intact.",
                        },
                      ]
                    : [
                        {
                          prop: "chains / tokens",
                          type: "Chain[] / BridgeToken[]",
                          desc: "Unique IDs; every token chainId must reference a supplied chain. Caller supplies decimal balances and popular flags. Search chains and tokens independently; selected chain scopes token results.",
                        },
                        {
                          prop: "value / onSelect",
                          type: "string / (token) => void",
                          desc: "Controlled token ID and native button selection. Selection does not close the picker; the host owns its dialog. Arrow behavior follows native inputs; Tab navigates token buttons.",
                        },
                        {
                          prop: "loading / error / onRetry",
                          type: "boolean / string / callback",
                          desc: "Loading uses static row skeletons; errors/empty results reuse AgentWorkspaceState. Retry is optional; Clear filters resets both searches and chain scope.",
                        },
                      ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template composes the picker in a Base UI Dialog with
              protected headings and independently scrolling lists. On mobile,
              networks and tokens stack. Source token changes choose a matching
              token on another network when available; incompatible selections
              are explained before review. The fixture supports USDC/USDT routes
              and includes ETH to demonstrate unsupported-route recovery.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              All balances, fees and estimated times are samples. Amount parsing
              uses integer base units; simulation updates both balances
              atomically and records the fee. Cancelled, failed and stale
              operations never settle. Review, failure/retry, history and JSON
              export remain in the browser and reset on reload. No wallet,
              chain, signing request or actual transfer is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/vanjek/status/2110693639664050203"
              target="_blank"
              rel="noreferrer"
            >
              Reference by George / Bondin ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
