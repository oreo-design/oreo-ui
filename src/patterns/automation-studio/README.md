# Automation Studio

An independent implementation inspired by [rico’s agentic product design](https://x.com/_heyrico/status/2110385506685186429). Open `/automation-components` for the playground and API docs, or `/automation-studio` for the complete template.

## Reference breakdown

| Visible in the image | Oreo component | Reused foundation |
| --- | --- | --- |
| Grouped labeled sidebar | `AgentWorkspaceNav` | Icon vocabulary, semantic links, state tokens |
| Three-column composition | `AgentWorkspaceShell` | Review workspace’s bordered panel hierarchy |
| Ask AI / Automations headers | `AgentWorkspacePanel` | Opaque headers outside scroll regions |
| Account / ad-set result | `AgentResultCard` | Base UI Collapsible, mint palette, accessible status |
| Duration and numbered explanation | `AgentRunSummary` | Message typography and neutral text hierarchy |
| Build / Canvas toggle and dot grid | `AutomationViews` | Base UI Tabs, Skills tab styling, existing `preview-grid` |
| Workflow nodes (Oreo extension) | `AutomationStepCard` | Existing radius, border and icon tokens |
| Empty / failure (Oreo extension) | `AgentWorkspaceState` | Centered icon/title/description/action hierarchy, Button |

The supplied image crops the right and bottom of the interface. It does **not** establish workflow node geometry, composer behavior, mobile behavior, loading states or execution logic. Those are explicitly independent extensions. The quoted Skills image is already covered by `/skills-workspace` and is not duplicated. Original branding is replaced by Oreo’s mark; no remote artwork is required at runtime.

## Behavior

- Expand the account result, inspect the three workflow nodes, switch between Build and Canvas, and edit the minimum ROAS and budget increment.
- Base UI tabs support arrow keys; disclosures support Enter/Space. Selecting a canvas condition/action focuses its corresponding settings field.
- Local demo runs take approximately 1.8 seconds. Shared `StreamCardSkeleton` communicates loading. Stop cancels the pending timer; starting a new draft also cancels it. Timers are cleaned up on unmount.
- “Simulate failed run” demonstrates an explicit error. Retry retains the last submitted request and settings. A new draft restores the valid sample settings.
- The PromptBox shows the submitted request as context but always uses a fixed budget recipe. It is not an AI integration. Mention inserts `@Oreo Store`; attachments retain filenames only, with removal, and never read or upload file contents.
- Nothing schedules, publishes, connects an ad account or changes a budget. The draft stays inactive and resets on reload.

## Reuse and accessibility

Copy `src/components/automation/` with its Oreo imports. Components own presentation only; the template owns sample data and local state. Hosts must supply real authorization, run timing, persistence, validation and service calls. Link destinations are host-owned. Base UI owns keyboard behavior and disclosure/tab semantics. No additional package is introduced.

All colors use existing semantic tokens. Spacing, type sizes and radii map to the existing Tailwind/Oreo scale. The shell’s 14rem/11rem navigation tracks and 960px/640px breakpoints are layout geometry specific to the expanded three-column role; the icon-only Review rail is intentionally narrower. The dotted background reuses the existing `preview-grid` utility.

Desktop uses independently scrolling panels with opaque headers and composer footer. Below 960px, navigation wraps above the two panels; below 640px, panels stack in reading order and use document scrolling. No content is hidden on mobile. New tab and disclosure changes are immediate, with no custom movement; existing PromptBox and attachment motion retain their original implementation.

## Verification

TypeScript and Vite build; interactive Playwriter checks for result disclosure, arrow-key view selection, canvas-to-field focus, range validation, failure/retry with retained settings, stop, new draft, prompt submit, mention and attachment removal. Screenshots cover light/dark at 1440×1000, 820×1180 and 390×844. These are local fixtures, not proof of live automation or production deployment.

The task-owned evidence index is `/Users/ziye/Documents/Project/Research/output/oreo-agent-20261015/REVIEW.md`, with source images, baseline redirect, peer comparison, screenshots and the recorded workflow. It is local evidence, not a public asset URL.
