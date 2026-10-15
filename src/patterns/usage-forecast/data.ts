import { DAY, type UsageAccount } from "@/components/usage-forecast/model";
export const FORECAST_NOW = Date.UTC(2026, 9, 16, 12);
const make = (
  id: string,
  name: string,
  plan: string,
  used: number,
  remaining: number,
  increments: number[],
  connected = true,
): UsageAccount => {
  const initial = used - increments.reduce((a, b) => a + b, 0);
  let cumulative = initial;
  return {
    id,
    name,
    plan,
    windowStart: FORECAST_NOW - 14 * DAY,
    resetAt: FORECAST_NOW + remaining * DAY,
    connected,
    observations: [
      { at: FORECAST_NOW - 6 * DAY, used: initial },
      ...increments.map((amount, i) => ({
        at: FORECAST_NOW - (5 - i) * DAY,
        used: (cumulative += amount),
      })),
    ],
  };
};
export const USAGE_ACCOUNTS: UsageAccount[] = [
  make(
    "claude-pro",
    "Claude Pro",
    "Side project",
    85,
    1.5,
    [8, 7, 9, 11, 10, 12],
  ),
  make("grok", "SuperGrok", "Research", 62, 5, [4, 5, 6, 8, 9, 10]),
  make(
    "grok-heavy",
    "SuperGrok Heavy",
    "Deep research",
    74,
    3,
    [4, 5, 5, 6, 7, 8],
  ),
  make("cursor-team", "Cursor", "Team workspace", 48, 9, [3, 4, 4, 5, 6, 7]),
  make("google", "Google AI Pro", "Personal", 51, 2, [3, 5, 2, 3, 4, 3]),
  make("copilot", "Copilot", "Work", 35, 7, [2, 2, 3, 2, 3, 2]),
  make("codex-plus", "Codex Plus", "Experiments", 39, 5, [2, 3, 2, 2, 3, 2]),
  make("claude-max", "Claude Max", "Studio", 27, 4, [1, 2, 2, 1, 2, 1]),
  make("cursor-personal", "Cursor", "Personal", 22, 5, [1, 1, 2, 1, 2, 1]),
  make("codex-pro", "Codex Pro", "Archive", 18, 2, [1, 1, 1, 2, 1, 1]),
  make("offline", "Antigravity", "Sandbox", 30, 4, [1, 2, 2, 2, 3, 2], false),
];
