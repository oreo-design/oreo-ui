/** Family-owned preview adapters and local export bindings. */
import { ChainTokenBadge, TokenAmountPanel, ChainTokenPicker } from "@/components/token-bridge";
import { BRIDGE_CHAINS, BRIDGE_TOKENS } from "@/patterns/token-bridge/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"chain-token-badge": {...define("Chain Token Badge",{chain:select(["ethereum","solana","arbitrum"],"ethereum"),compact:toggle(false)},v=><ChainTokenBadge chain={BRIDGE_CHAINS.find(c=>c.id===v.chain)!} token={BRIDGE_TOKENS[0]} compact={v.compact}/>),source:"token-bridge"},
"token-amount-panel": {...define("Token Amount Panel",{amount:text("200"),output:toggle(false),disabled:toggle(false),error:text("")},(v,set)=><div className="w-full p-6"><TokenAmountPanel label={v.output?"To":"From"} chain={BRIDGE_CHAINS[0]} token={BRIDGE_TOKENS[0]} amount={v.amount} onAmountChange={v.output?undefined:value=>set("amount",value)} onMax={v.output?undefined:()=>set("amount",BRIDGE_TOKENS[0].balance)} disabled={v.disabled} error={v.error} estimate="Sample amount"/></div>),source:"token-bridge"},
"chain-token-picker": {...define("Chain Token Picker",{selected:text("eth-usdc"),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-4"><ChainTokenPicker chains={BRIDGE_CHAINS} tokens={v.state==="empty"?[]:BRIDGE_TOKENS} value={v.selected} onSelect={t=>set("selected",t.id)} loading={v.state==="loading"} error={v.state==="error"?"Sample token data is unavailable.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"token-bridge"}
};
const exports = {
"token-bridge": { ChainTokenBadge, TokenAmountPanel, ChainTokenPicker }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "token-bridge"; spec.exports = exports; }
export default playgrounds;
