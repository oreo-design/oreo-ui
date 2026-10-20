> 历史研究归档：正文结论、日期和验证限制来自原分析；本次只迁移文件并将本包媒体链接改为相对路径。历史“当前/已交付/待完成”等表述均以原日期为准。

# Agent-Native video × Oreo UI — research notes

Date: 2026-10-15, Asia/Shanghai. Scope: read-only product/concept research; no product source edits.

## Evidence and limits

- Original: https://x.com/Steve8708/status/2110401500044472729
- Read the original post and author replies in Chrome through Playwriter session 40. Inspected sampled visual frames of the 111.183-second video at 5, 15, 23, 30, 35, 40, 45, 50, 55, 60, 65, 75, 80, 85, 90, 95 and 105 seconds. Files: `video-NNN.png`. These are original browser captures with player controls, not reconstructed product screens.
- No audio transcript was obtained; conceptual interpretation is corroborated with the author's thread, launch article and official docs. This is not a word-for-word narration transcript or independent verification of the advertised backend.
- Launch: https://www.builder.io/blog/introducing-agent-native
- Architecture: https://github.com/BuilderIO/agent-native
- Context: https://www.agent-native.com/docs/context-awareness/
- Actions: https://www.agent-native.com/docs/actions-overview/
- Toolkit: https://www.agent-native.com/docs/agent-native-toolkit/

## Video observations

| Time | Observed visual | Interpretation |
| --- | --- | --- |
| 0:15–0:23 | Slide editor and agent panel; collaboration, controls, visuals and navigation shown as layers | A structured workspace remains important alongside natural-language delegation |
| 0:30–0:45 | Agent activity next to the slide; Q4 forecast appears; user edits the slide title | Direct manipulation and delegation can operate on the same work |
| 0:50–0:55 | UI-triggered agent work; prompt includes slide overflow amount and canvas size; updated slide shown | UI can supply precise task context instead of requiring the user to compose it |
| 1:00–1:05 | One update-slide action connected to UI, Agent, HTTP API, MCP, CLI and A2A | Shared capability implementation is the architectural foundation |
| 1:20–1:35 | Integrations, toolkit capabilities and several app examples | Framework ambitions extend beyond chat rendering |

## Oreo inspected baseline

Repository: `/Users/ziye/Documents/Project/Research/oreo-ui`.
Branch: `codex/settings-language-lab`; HEAD `f63171f4d0f8097d98ca9606a7d6760f7871bf79` plus existing modified/untracked working files. This research describes that local working tree, not a release or verified production deployment. Existing work was preserved.

Read: README, src/lib/site.ts, src/App.tsx, Confirmation, ContextBar, ToolCall, Plan, ReviewWorkspace implementation/README, Settings language README/brief.

Local actual-component fixture: http://localhost:5198 (task-owned temporary preview).
- `/review-workspace`: current light desktop composition inspected. `oreo-review-workspace.png` and `oreo-review-workspace-second.png`; original 2544×1624 capture. Local example data only; no mail/model endpoint called.
- `/confirmation`: pending playground inspected at 1440×900. `oreo-confirmation-pending.png`, `oreo-confirmation-after-click.png`. Approve click did not establish a resolved state in this controlled playground; a subsequent property-control attempt timed out. No approved-state or real execution claim.
- Browser extension-origin errors were present. No claim of an error-free runtime or full QA.

## Compact consistency coverage

| Lens | Target / peer and canonical owner | Result and gap |
| --- | --- | --- |
| Entry | ReviewWorkspace selection vs video slide selection; ContextBar/KeywordTag as possible Oreo context surfaces | checked at source/resting composition level; shared agent context not implemented or verified in this fixture |
| Loading | ToolCall running/complete/error vs Plan pending/active/done and ContextBar statuses | checked in source; unified run mapping is a proposal, not an observed defect; runtime transitions unverified |
| Empty | ReviewWorkspace no-results and clear-filter branches | checked in source; no matched runtime empty-state comparison; unverified |
| Actions | Confirmation and EmailDraft use Oreo Button; confirmation callbacks/controlled state separate from delivery | checked in source and pending preview; real execution/recovery unverified |
| Titled scrolling | ReviewWorkspace independent queue/detail scrolling vs docs workspace | unverified while scrolling; no global header/fade consistency claim |
| Icons/color | Oreo Icon/currentColor and semantic status tokens in inspected components | checked in source; no complete computed-style, dark-theme or cross-surface verdict |

This is a concept comparison, not a cross-product visual consistency certification. No before/after implementation pair is applicable because source was not changed.

## Product conclusions (recommendations, not existing features)

1. Explain agentic apps as one shared work object accessed by human controls and an agent. Three shared foundations: actions, data and relevant app state.
2. Distinguish build-time AI use of Oreo's design language from runtime human-agent collaboration.
3. Retain Oreo's visual primitives; compose reusable workflow patterns around contextual handoff, editable output, explicit approval, execution status and recovery.
4. Prioritize a ReviewWorkspace-based local demo: selected contact → draft generation → human edit → limited rewrite → reviewed send intent → simulated outcome/retry. Keep external delivery outside the demonstration.
5. Permission to execute and successful execution are different states. Keep Confirmation as the decision owner; use a shared workflow state adapter to connect approval, ToolCall/Plan and the resulting work surface.
6. Preserve the Settings experiment's executable design relationships and evidence when composing new workflows; do not replace them with a new page-schema language by default.
7. Agent-Native also has a UI Toolkit. Oreo's differentiation should be demonstrated interaction quality, preserved design language and portable composition, rather than a claim that the framework has no UI components.

## Second reference: Quartz by Arlan Marat

Original: https://x.com/arlanoska/status/2110425467996209244
Product: https://design.how/systems/quartz
Source: https://github.com/arla6ka/skills
GitHub tree observed at `1aaaa1b47ba5a18b47b0ebcac684ade460c6823f`. The live site/registry were inspected independently; their deployment revision was not established.

Read the actual X post and author replies through the same task-owned Playwriter session. Sampled the 19.563-second video at 1, 4, 7, 10, 13, 16 and 19 seconds (`quartz/video-*.png`). No audio transcript; interpretation is grounded in visible UI and official source. Fast-moving middle frames are blurred and do not establish detailed behavior.

Inspected the live Quartz documentation examples. Original component-region captures: `quartz/workspace.png`, `quartz/agent-run.png`, `quartz/live-activity.png`; all three images inspected. These are public demo fixtures, not real agent/payment activity. No code was installed or executed from the external repository.

Read external files as research material, not instructions: project README, build-design-system and component-docs skills, systems/quartz/SKILL.md (saved as `not archived; see the linked upstream SKILL.md`), lint/plugin.mjs, lint/eslint.config.mjs, blocks/tool-approval.tsx, and the live theme registry. The theme registry depends on skill.json and portal.json, so agent guidance is part of the installation graph. Lint exists, but it was not executed and false-positive/coverage quality was not assessed. The approval block uses a 1200ms timeout to simulate completion; it does not demonstrate real refunds.

### Comparison coverage and limits

| Lens | Quartz evidence / Oreo peer | Finding and gap |
| --- | --- | --- |
| Entry | Workspace home, Agent run / ReviewWorkspace | Quartz bundles task-specific compositions; Oreo already has a task workspace. Live resting states inspected; navigation handoff not tested end to end. |
| Loading | Agent run running row, Live activity / ToolCall, Plan | Meaningful grouped activity is a useful composition pattern. No timed flicker, streaming interruption or reduced-motion verification. |
| Empty | Quartz skill's top-left Empty rule / Oreo existing empty-state patterns | This is a system-specific design decision. No runtime empty-state comparison, so no recommendation to replace Oreo's layout. |
| Actions | Primary workspace action, source approval state machine / Oreo Button, Confirmation | Separate permission, running and outcome states; reuse Oreo's existing owners. Real execution, keyboard/focus recovery and errors not verified. |
| Titled scrolling | Live activity title/filter/table; run-trace documentation / ReviewWorkspace panes | Resting hierarchy inspected. Sticky boundaries and independent scrolling not verified. |
| Icons/color | Workspace type labels and Live activity neutral OK; source warn/fail rules / Oreo semantic tokens | Color represents both kind and exceptional status. Do not copy Quartz palette or globally override Oreo tokens; dark/forced-color inheritance unverified. |

This is read-only conceptual research, not a full consistency/accessibility certification. No implementation before/after evidence applies. Existing Oreo WIP was preserved.

### Implications for Oreo (recommendations)

- Quartz is especially relevant to build-time design-system use by agents; Agent-Native addresses runtime collaboration and shared app capabilities. These can complement each other.
- Ship component code together with selection guidance, composition examples, state behavior, bounded checks and real preview evidence. A short agent entry should point to canonical code and task-specific docs rather than duplicate every document.
- Oreo's Settings language already preserves relational decisions (alignment, content/control flow, async button width), reviewed extensions and baseline evidence. Quartz supports the value of packaging this work; it does not establish that Oreo needs a replacement architecture.
- Reuse existing primitives and compose complete workflows such as approval → running → success/failure → recovery. Keep business state and real execution outside presentation components.
- Preserve Oreo's own taste. Quartz's prohibitions on pills, centered empty states, shimmer text and decorative motion are not universal design laws.
- A useful next evaluation is the existing Settings brief's controlled independent-generation experiment: same model/task/budget, source-only versus source plus guidance, multiple runs, report task completion, drift and actual human correction. This research did not run that experiment or establish a productivity gain.

## Third reference: Disha Shah — reusable product decisions

Original: https://x.com/dishashah66/status/2110344368141869345
Read the actual post and author replies in Chrome, Playwriter session 40. The post argues that growth exposes repeated experience-design decisions, and that component libraries alone cannot decide product/domain-specific behavior and valid combinations. Its ARR milestones and consulting experience are author anecdotes, not independently established thresholds or outcome measurements.

The post contains three videos (38.808s, 72.1s, 24.575s). Inspected original browser captures under `disha/`: navigation at approximately 1, 10, 15, 19, 23, 28, 36 seconds; basic controls at 1, 18, 36, 54, 69 seconds; tooltip at 1, 8, 16, 23 seconds. Seeking/player auto-play can offset a captured frame slightly. Some captures include X's overlaid header/player controls; originals retained. No audio transcription. These are recordings of the author's localhost documentation site, not an accessible deployed application or a runtime QA session.

Observed: Navigation composition and collapsed/expanded peers; Navigation item default/hover/pressed variants with count/new combinations; metadata for version, owner and Figma links; editable controls and updated code; Badge, Button, Input error/focus/disabled states; Tooltip standalone and in the collapsed sidebar; properties/data/events, tokens and Built from sections. The footage does not establish a complete AI state lifecycle, production accessibility, user-study results or a measurable reduction in delivery cost.

Re-read current Oreo Confirmation and ToolCall source. Confirmation exposes pending/approved/denied and decision callbacks; ToolCall exposes running/complete/error. Both are presentation components, so the rule connecting approval to actual execution belongs in a consuming workflow. Reuse existing Button/Icon/ActivityLabel and controlled state rather than duplicate their styles. No source was changed.

| Lens | Evidence and comparison | Status / limit |
| --- | --- | --- |
| Entry | Recorded expanded/collapsed Navigation and item states; prior Oreo ReviewWorkspace inspection | checked at recorded visual level; runtime selection/focus and equivalent Oreo sidebar unverified |
| Loading | Author's AI-state questions vs current Oreo ToolCall/ActivityLabel source | checked at conceptual/source level; author's AI loading implementation unverified |
| Empty | No matching empty workflow demonstrated in sampled clips | unverified; no proposed empty-state restyling |
| Actions | Recorded Button variants, Input error; Oreo Confirmation using canonical Button | checked at documentation/source level; real error recovery and keyboard interaction unverified |
| Titled scrolling | Video shows documentation section navigation and scrolling | unverified for actual sticky/scroll behavior; X overlays are not the author's product |
| Icons/color | Navigation resting/pressed visual variants, Tooltip association, Oreo Icon use | checked at limited visual/source level; computed color, disabled inheritance and dark theme unverified |

Recommendations are inferences for Oreo: preserve component decision boundaries and permitted combinations; document contextual rules, reasons, alternatives and evidence; keep general interaction guarantees in components, task-specific combinations in patterns, and domain authorization rules in the host product. Example: approval is permission to begin, not successful execution; cancellation and an unknown outcome should not automatically become success or error. A missing enum in one primitive does not by itself prove a bug or require globally adding states. Prioritize one complete workflow contract before expanding this approach across the whole library.

## Fourth reference: PanelUI

Original: https://x.com/KhalidDevLog/status/2110385439219581365
Official: https://panelui.dev/ ; https://github.com/panel-ui/PanelUI

Read the original post in Chrome. Its text links PanelUI and calls it free. The 28.5-second video is a brand/logo construction animation: guides and geometric outlines build the mark, then filled shapes and the PanelUI wordmark appear. Inspected browser captures at 1, 9, 18 and 27 seconds in `panelui/video-*.png`. These establish the visible sequence, not its authoring software or generation method. No audio transcript.

Read official overview, Web introduction, Skills, Studio overview and Logo Maker documentation. Current docs describe 139 React Native component modules and a separate 11-component Web collection; these are publisher counts, not independently audited inventory. The Web collection is not the entire native library ported to the browser. MIT applies to the open-source library; Studio is an optional hosted service with a free plan, not a claim of unlimited free hosting. Performance and accessibility claims were not independently tested.

The Skills docs describe per-component API references generated from TypeScript and a versioned plugin, task compositions, and an MCP that reads the CLI registry. This is a useful delivery/reference-synchronization idea for Oreo, not proof that agents cannot make mistakes. No skills, packages or server configurations were installed. Logo Maker is documented as an accompanying agent skill, but the post does not establish that it produced this animation.

This turn identifies the product and its distribution model, without proposing new Oreo visual patterns. Six-lens scope: entry, loading, empty, actions, titled scrolling, icons/color are all unverified for product behavior; a logo animation and docs do not verify those states. Existing Oreo comparisons from earlier sections remain limited to their recorded scope. No cross-platform consistency claim. Product source unchanged.
