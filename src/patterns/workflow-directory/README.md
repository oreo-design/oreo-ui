# Workflow Directory

Reference: [Jubayer — filter, sort, row menu, bulk actions](https://x.com/jubayer6910/status/2111721342316020098).

Reusable components: `data-operations` supplies DataFilterPopover, DataSortMenu, RowActionMenu and BulkActionBar. `workflow-table` supplies WorkflowStatusBadge, WorkflowRunBars and WorkflowTable. They compose existing Oreo Menu, Button, Icon, Tag, Avatar and AgentWorkspaceState primitives. Routes expose live playgrounds, JSX export and API documentation.

The template uses local fixture rows: draft/apply filters, sorting, paginated selection, select all matching, duplicate, edit, folder moves, pause, archive/restore, one-step undo and CSV export. Search/filter/folder/view changes clear selection; sorting and pagination retain it. Bulk mutations intersect selection with current matching IDs. Native mixed-state checkbox toggles only the current page. Archived rows live in their own view.

Create/edit validates names, allows owner selection and retains workflow integration metadata. Open workflow is intentionally a details editor, not a workflow engine. Sample tests return fixture results and never call providers. History shows only the current sample version. No API, persistence, real automation or integration permissions are claimed. No cosmetic view-switch or import action was added without working behavior.

Run bars use uniform status hue across all seven days; existing financial BalanceSparkBars emphasizes the last value. This domain distinction is why the throughput/count composition is separate. Table scroll/header protection follows CompanyTable. Form filters use Base UI Popover because Menu semantics are not appropriate for a draft form.

Review and original media: `docs/reviews/jubayer-table-20261019/REVIEW.md`.
