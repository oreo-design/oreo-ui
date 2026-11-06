# Theme typography: Oreo, Claude and GPT

Researched and implemented 2026-11-06 (Asia/Shanghai).

| Source | Observed evidence | Adoption |
| --- | --- | --- |
| [Mona Sans official stylistic sets](https://github.com/github/mona-sans#stylistic-sets) | ss05 is Double-storey a in the full official font; the installed Fontsource subset omits it | Bundle the official v2.0.27 WOFF2 under OFL and enable ss05 at the Oreo boundary |
| [Claude product](https://claude.ai/login) | Computed controls: anthropic-sans; response-role heading: anthropic-serif. Live font-face declarations include anthropic-mono. Sans and Serif loaded in browser | Explicit UI/input/display/response/mono roles; current versioned public font endpoints in fonts.css |
| [ChatGPT product](https://chatgpt.com/) | Current account sidebar, new-chat heading and composer resolve to -apple-system-body / ui-sans-serif / system stack. OpenAI Sans declarations present but unloaded | Use observed product system stack; no vendor font download |
| [OpenAI brand](https://openai.com/brand/#typography) | Marketing typography is OpenAI Sans | Distinguish marketing from observed product; do not infer rendered product font from brand name |

Claude login/public pricing is accessible; authenticated Claude conversation
rendering was not available. The page's own --font-claude-response token is Serif.
ChatGPT evidence is account/rollout-specific, not a statement about all variants.
Chinese uses the platform fallback; Latin font confirmation does not prove every
script. Font assets remain vendor-hosted, not bundled or relicensed by Oreo.

Canonical implementation: src/lib/theme/typography.ts and fonts.css, consumed by
variationTokens, root provider, previews, exports, assistant Message content, Response and WebSearchAnswer.
ASCII keeps its existing role choices. Existing explicit artistic specimens remain
exceptions; this task does not rewrite their compositions or change font sizes.

Single task review (original before/after images, recordings, environment,
validation and gaps):
[REVIEW.md](/Users/ziye/Documents/Project/Research/oreo-theme-fonts-20261106/REVIEW.md).

## Full-coverage follow-up

The user requested the remaining work together. Bare mono/font shorthand
declarations in component charts, operational templates and inspector chrome now
use theme roles. Oreo legacy labels also use Mona Sans and ss05. Editorial remix
and Neutomni live text follow display/response roles. Existing authored text-font
choices and portable email output remain explicit content exceptions.

A real-component nested fixture reproduced portal font leakage (outer Claude,
inner Oreo). ThemeScope and ThemePortalTypography carry font roles across the
portal boundary; all existing Base UI portals use the shared wrapper. Existing
Base UI behavior and portal containers are retained. Compare and exported snippets
use ThemeScope. Root and nested behavior, font-family/ss05, responsive screenshots
and failure/recovery evidence live in the same local REVIEW linked above.

The final upstream refresh also added InputSelect (React Aria). Its Popover now uses the same ThemePortalTypography boundary; selection and Escape plus all four font presets were verified in a real-component fixture. The final source audit covers 159 CSS font declarations, 50 Base UI portal entries and one React Aria popover.

## User correction: verify the actual glyph

The user rejected the delivered single-storey a. Earlier computed-style checks falsely implied ss05 worked: the installed Fontsource 5.3.0 WOFF2 has no ss05 feature, and normal/ss05 render identically. The fix is the official full-featured Mona Sans v2.0.27 WOFF2, with its OFL license, served by fonts.css. The theme keeps the same family role and ss05 API; Claude/GPT roles and portal scoping remain unchanged. Review actual Container/label glyphs, not just CSS strings. The prior review success claim is superseded by the correction evidence in the same REVIEW.
