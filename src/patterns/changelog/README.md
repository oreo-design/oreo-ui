# Changelog

The Oreo website's `/changelog` route doubles as a complete template. Inspired by [Micka's changelog](https://x.com/micka_design/status/2110389160062390442), it uses the existing docs navigation, right-side contents, Button, TypeScale, StepProgress and AgentResultCard.

Reusable primitives:
- `src/components/release-entry`: category, heading, description, docs/source links, optional preview slot.
- `src/components/upgrade-prompt`: readable text, asynchronous clipboard feedback, manual-copy recovery.

`data.ts` owns the curated history, Markdown export and agent prompt. Add verified main-branch merges here; use merge dates in Asia/Shanghai and actual PR numbers. Keep entries in descending date order. This is selected history, not an automatic feed, package release log or deployment announcement. Do not infer breaking changes or publication versions.

Search and type filters scope the visible entries and upgrade prompt. The Markdown download always contains the full selected history. Real component previews use local sample state. The template is ready immediately and makes no release-data request; there is no artificial loading state.

To adapt this to another product, replace the data, repository/docs destinations and preview renderer, then provide the host's `DocsNav` or swap the docs shell. The example intentionally keeps navigation and data ownership in the host.
