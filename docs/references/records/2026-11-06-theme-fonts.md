# Theme typography: Oreo, Claude and GPT

Researched and implemented 2026-11-06 (Asia/Shanghai).

| Source | Observed evidence | Adoption |
| --- | --- | --- |
| [Mona Sans official stylistic sets](https://github.com/github/mona-sans#stylistic-sets) | ss05 is Double-storey a | Enable at the shared Oreo theme boundary, reset elsewhere |
| [Claude product](https://claude.ai/login) | Computed controls: anthropic-sans; response-role heading: anthropic-serif. Live font-face declarations include anthropic-mono. Sans and Serif loaded in browser | Explicit UI/input/display/response/mono roles; current versioned public font endpoints in fonts.css |
| [ChatGPT product](https://chatgpt.com/) | Current account sidebar, new-chat heading and composer resolve to -apple-system-body / ui-sans-serif / system stack. OpenAI Sans declarations present but unloaded | Use observed product system stack; no vendor font download |
| [OpenAI brand](https://openai.com/brand/#typography) | Marketing typography is OpenAI Sans | Distinguish marketing from observed product; do not infer rendered product font from brand name |

Claude login/public pricing is accessible; authenticated Claude conversation
rendering was not available. The page's own --font-claude-response token is Serif.
ChatGPT evidence is account/rollout-specific, not a statement about all variants.
Chinese uses the platform fallback; Latin font confirmation does not prove every
script. Font assets remain vendor-hosted, not bundled or relicensed by Oreo.

Canonical implementation: src/lib/theme/typography.ts and fonts.css, consumed by
variationTokens, root provider, previews, exports and assistant Message content.
ASCII keeps its existing role choices. Existing explicit artistic specimens remain
exceptions; this task does not rewrite their compositions or change font sizes.

Single task review (original before/after images, recordings, environment,
validation and gaps):
[REVIEW.md](/Users/ziye/Documents/Project/Research/oreo-theme-fonts-20261106/REVIEW.md).
