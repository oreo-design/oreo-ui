# Adaptive Issues

A complete local project issue template inspired by [Componest’s video](https://x.com/componest/status/2112057747739172953), credited in the post to @haaarshsingh. The actual video shows a resizable grouped list whose metadata separates into aligned columns as it expands.

## Extracted components

- `PullRequestPill`: display-only identity and named PR status.
- `AdaptiveIssueRow`: compact inline metadata, aligned medium columns, expanded labels and avatar groups. Render as a list item inside `.adapt-table` (the container-query owner).
- `AdaptiveIssueTable`: status grouping, collapse, selection and shared loading/empty/error presentation.
- `ResizeFrame`: controlled width with pointer capture, bounded parent sizing, release snapping, Escape cancellation and keyboard controls.

Routes: `/adaptive-issues`, `/adaptive-issue-table`, `/adaptive-issue-row`, `/pull-request-pill`, `/resize-frame`. All component routes include editable playgrounds, source exports and API documentation.

## Composition and behavior

Reuse `TaskStatusGroup` (new optional `tone="neutral"`; existing status-colored default unchanged), `AvatarGroup`, `Avatar`, `Tag`, `Button`, `Icon`, `SkeletonReveal` and `AgentWorkspaceState`. Colors, typography, radii and spacing use Oreo tokens. The PR graph is a small component-specific SVG; the shared icon vocabulary does not contain this glyph. Container thresholds (480 / 650 / 850px), width stops and the maximum 1120px are behavioral geometry, not copied design tokens. Mobile rows retain full titles, with all hidden metadata accessible in the row label and detail view.

The template owns search, selected issue, creation, status changes, one-level undo, overview counts, activity, demo states and theme. Data resets on reload; it does not create GitHub issues or PRs. PR numbers for new sample rows are illustrative. No network requests, account mutations, external assets or new packages.

Resize: arrows ±10px, Shift arrows ±40px, Home minimum, End available width. Drag release snaps within 18px of 360 / 640 / 840 / 1120px or parent edge. Double-click fills; Escape cancels a drag. Reduced motion disables width interpolation and metadata entrance animations. Responsive metadata is based on the container, not the viewport.

Validation and visual evidence: [review](../../../docs/reviews/componest-table-20261019/REVIEW.md).
