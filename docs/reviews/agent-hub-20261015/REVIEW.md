# Agent Hub — reference to Oreo UI

Reference: [Karthik_designs — agent hub](https://x.com/Karthik_designs/status/2110370046073581998). The supplied post contains one static 4096×2698 image. X fetch returned 403; public metadata identified the image, which was opened and visually inspected in Chromium. [Reference capture](reference.png), [metadata](source.json). No interaction is inferred as observed from this static reference.

## Scope and environment

Baseline: `0a1a34a4655cb7c644ad9842ddb82529d920cc2c` (main, PR #48). Branch: `codex/agent-hub-20261015`. Final product source: `a3fb928087ac6119c5aad6619d6a17dabd8388a3`. PR: [#49](https://github.com/oreo-design/oreo-ui/pull/49). Product hashes and capture environment are maintained in [manifest.json](manifest.json).

Local fixture preview: http://localhost:5223/agent-hub. Chromium / Playwriter session 56, English, local sample data. Viewports: desktop 1440×1000, mobile 390×844, intermediate 900×1000, navigation breakpoint 800×1000. Full-page images extend below the viewport. Primary checkout's unrelated settings and web-search work was preserved in place. No production deployment.

## Reference breakdown and product mapping

| Reference surface | Implementation | Canonical owner / difference |
| --- | --- | --- |
| Dark two-level navigation | Agent Hub workspace rail, section navigation and toolbar | Existing Oreo workspace conventions; selected mint accent uses semantic success color in dark mode for contrast. Mobile gets top navigation rather than squeezing the desktop rail. |
| Centered title, dot texture and search | `HubSearchHero` | Oreo colors, radius, input/focus and IconButton; dotted artwork uses CSS geometry (6px repeat, not a new spacing token). Controlled search, clear action and optional host-owned slash shortcut. |
| Nine category cells | `AgentCategoryGrid` | Native semantic buttons with count, description, selected state and neutral icon. Counts computed from actual local fixtures, not copied from the image. Shared `AgentWorkspaceState` for an empty directory. |
| Connected integration cards | `IntegrationTile` | Compact catalog-navigation role, distinct from the existing expandable flag `ConnectionRow`. Oreo glyphs and palette tokens represent tools; these are not claimed official brand logos. Text supplements status dots. |
| Agent discovery workspace | Complete `/agent-hub` template | 11 sample agents, 9 categories, 6 tools. Explore/Agents/Integrations, keyword filtering, personal collection, local draft form, agent/integration details and demo connection changes. |

Reuse: Button/IconButton (tapScale=1), Icon, OreoLogo, AgentWorkspaceState and existing Base UI Dialog behavior. Compared actual Skills Workspace Discover/Installed flow and empty state ([peer](peer-catalog.png)); inspected SkillCard/SkillSearch, ConnectionRow and Activity Workspace dialog ownership. New catalog cards navigate to details; skill install controls and flag setup rows have different jobs and were not copied as lookalikes.

## Evidence index

| Page / state | Baseline | Result | Notes |
| --- | --- | --- | --- |
| New template, light desktop | [Before](before-desktop.png) | [Final](final-desktop-default.png) | At baseline, /agent-hub did not exist and resolved to Button. Same 1440×1000 light viewport. |
| New template, light mobile | [Before](before-mobile.png) | [Final](final-mobile-default.png) | Same 390×844 light viewport; complete page, top navigation, one-column directory. |
| Default dark desktop | No prior Agent Hub | [Final](final-dark.png) | Reference-inspired default theme, readable selected navigation, three-column grid. |
| Dark mobile / form | No prior equivalent | [Page](after-mobile-dark.png), [Dialog](mobile-dialog.png) | Inputs and actions fit without horizontal overflow. |
| Intermediate and nav breakpoint | No prior equivalent | [900px](after-tablet.png), [800px](breakpoint-800.png) | Earlier 900px capture exposed unused grid cell background; final 800px capture shows corrected neutral cell fill. 800px includes GitHub connected through QA. |
| Agent details and personal collection | No prior equivalent | [Details](agent-detail.png), [My agents](my-agents.png) | Save/remove updates collection; existing personal agent removed during QA and a new draft added. |
| Create draft | No prior equivalent | [Form](create-draft.png), [Result](my-agents.png) | Blank create disabled; successful local draft appears in collection and changes category counts. |
| Unknown search / recovery | No prior equivalent | [Final empty](search-empty-final.png) | Canonical empty state per result group; Clear filters restores catalog. |
| Demo connection state | No prior equivalent | [Disconnected](integration-disconnected.png) | Connect/disconnect changes local groups and labels only. |
| Component docs/playgrounds | No prior modules | [Category playground](category-playground.png) | All three playgrounds exercised; documentation usage/API opened. |
| Website Changelog | [Before](changelog-before.png) | [After](changelog-after.png) | Existing release list, no new Changelog pattern. |
| Actual interaction | No prior interaction available | [Recording](interaction.mp4), [original timestamps/frames](interaction-original.json.xz), [timing map](interaction-timing.json) | Category → agent details → add to collection → integrations → connect demo. 1440×1000, 21.4s; encoded 30fps from 39 variable-rate CDP frames. Idle frame holds capped at 2s; 40.43s original timeline preserved. No FPS-performance claim. Contact sheet inspected. |

Historical diagnostic originals retained: `initial-desktop.png` has weak dark accent and barely visible texture; `after-dark.png` contains a transient text-rendering capture artifact (superseded by `final-dark.png`). `after-desktop.png`, `after-mobile.png`, `after-tablet.png` precede the grid empty-cell refinement. `final-desktop.png` captures the intentional post-interaction state with four connections; `final-desktop-default.png` is the reload/default state. `search-empty.png` shows duplicate browser/custom clear buttons; `search-empty-final.png` shows the correction. Other final screenshots predate only the native clear-button suppression, which has no effect on their empty search fields.

## Six-lens consistency review

| Lens | Target / peer / owner | Result and evidence |
| --- | --- | --- |
| Entry behavior | Catalog buttons → Base UI Dialog; same owner used by Activity Workspace | Checked: details, creation, Escape, focus return to original trigger. If a connection moves between groups and removes its trigger, focus safely returns to active navigation. View navigation scrolls to top. |
| Loading | Local synchronous fixture catalog | Not applicable: no network or agent runtime, no artificial loading state or simulation of a real request. |
| Empty states | Skills catalog peer and shared AgentWorkspaceState | Checked: Skills Installed empty inspected; new search no results, Other category zero results and category playground empty tested. Explanation and recovery centered in the owning region. |
| Actions | Shared Button/IconButton; category/card navigation | Checked: create, cancel, close, save/remove and connection actions use canonical controls; tiles use native full-card buttons because their entire surface opens details. Native duplicate search clear hidden in favor of the labeled canonical icon button. |
| Titled scrolling | Normal document flow, sticky sidebar, bounded dialog | Checked: page header scrolls with document; sidebar has its own opaque surface. No content passes behind a floating title. Mobile form fits; dialog can scroll within 85dvh. 800px root has no horizontal overflow. |
| Icons/color | Canonical Icon mappings, Oreo semantic variables | Checked in light/dark captures: ordinary actions neutral; selected navigation mint/success; tool identity palette accents and status dots have text equivalents. No global consistency claim beyond inspected families. |

## Functional validation

- TypeScript and Vite production build pass; existing large-bundle warning remains. `git diff --check` passes.
- A fresh final page loads without console errors; subsequent focused actions returned no new errors. Earlier HMR/disconnected-server logs were historical edit-time events, not presented as final runtime success.
- Category selection filters the 11-agent fixture and focuses stable search; Other shows zero results. Counts update after creating an Operations draft (1→2).
- New draft requires trimmed name/description; create navigates to Agents and saves it locally. Cancel restores Create focus.
- Add/remove collection updates My agents; details close via Escape/close button. Focus restoration and fallback explicitly checked.
- Unknown query shows two appropriate empty result groups; Clear filters restores catalog. Controlled component search and clear retain input focus.
- Slash shortcut focuses search outside editable fields. Dialog uses Base UI focus trap and actual labelled/described IDs. Screen-reader software itself was not exercised.
- Zendesk disconnect/reconnect and GitHub demo connect update groups and dialog status. No network credentials or external account access.
- All three playgrounds opened; empty toggle, integration-state toggle, controlled search and documentation switch exercised.
- Final screenshots inspected at representative widths and themes. Defaults reset on reload, verified after local changes.

## Craft and motion review

| Before / candidate | After | Why |
| --- | --- | --- |
| Weak dark selected accent | Semantic success accent with low-opacity background | Keeps selected navigation readable while respecting Oreo theme tokens. |
| Border-colored unused grid cell | Neutral grid background with per-cell border shadow | Two-column layout retains the same surface tone when item count is odd. |
| Native and custom search clear duplicated | One labeled clear button, focus retained | Avoid duplicate actions and accidental loss of keyboard focus. |
| Static reference could invite decorative entrance motion | Immediate search, category/view changes and dialogs; shared buttons use tapScale=1 | Frequent catalog navigation benefits from direct feedback; no inferred motion or fake loading added. |

**Motion verdict: Approve.** No new transitions, keyframes, timers or moving background. Keyboard and pointer changes are immediate; no reduced-motion-specific movement is introduced. Recording verifies interaction sequencing rather than a copied animation.

## Limits

All evidence is a local component fixture. It does not prove agent execution, authentication, external integration permissions, persistence or production deployment. The source is a static image, so there is no reference motion to reproduce. Screen-reader and physical-device coverage are not claimed. Changelog entry and its link to PR #49 were checked after the real PR number existed. Media gaps are separate from authorized delivery.
