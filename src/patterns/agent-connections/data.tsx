import { Icon } from "@/components/icon";
import type { AgentClient } from "@/components/agent-connect";
export const AGENT_CLIENTS: AgentClient[] = [
  { id:"desktop", name:"Desktop assistant", description:"Your everyday copilot", mark:<Icon name="assistant" size="lg"/> },
  { id:"editor", name:"Code editor", description:"Stay in your workflow", mark:<Icon name="inline-code" size="lg"/> },
  { id:"terminal", name:"Terminal agent", description:"Build from the command line", mark:<Icon name="keyboard" size="lg"/> },
  { id:"custom", name:"Custom client", description:"Any compatible MCP client", mark:<Icon name="plug" size="lg"/> },
];
export const AGENT_MARKS = [<Icon name="brain" size="lg"/>, <Icon name="inline-code" size="lg"/>, <Icon name="assistant" size="xl"/>, <Icon name="sparkle" size="lg"/>, <Icon name="keyboard" size="lg"/>];
export const AGENT_TOOLS = [
  { id:"balances", name:"Account balances", description:"Read available and current balances.", tool:"get_balances", icon:"chart-bar" as const },
  { id:"transactions", name:"Transactions", description:"Search and summarize workspace activity.", tool:"list_transactions", icon:"list" as const },
  { id:"reports", name:"Financial reports", description:"Read cash flow and spending summaries.", tool:"get_reports", icon:"chart-line" as const },
];
export const DEMO_ENDPOINT = "https://mcp.example.invalid/oreo";
