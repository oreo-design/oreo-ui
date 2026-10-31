# Status view

`StatusView` presents empty or error content using the existing Icon and Button.
`title`, `description`, `error` and the optional action are independent of the
host's loading/filter state. Error adds the warning icon, semantic color and alert
role; it does not choose another size. Loading uses the host's content skeleton.

Use an action label only with its real callback. An action renders only when both
exist. The component forwards activation immediately; it does not emulate retry
success or clear a filter itself. Keep product-specific recovery and concise copy
at the call site. This extraction preserves the existing title-plus-description
contract; it does not introduce truncation or auto-hide required explanations.

The imported status-view.css owns the base layout. The application still supplies
Oreo index.css tokens/Tailwind utilities. Hosts own available height, scrolling and
compact/region placement; the legacy min-height is not proof of remaining-region
centering. Keep useful headers and filters mounted around the affected content.

The `agent-workspace-state` class and direct h3/p/Button children remain compatible
with existing scoped host overrides. `components/automation` re-exports this same
function as `AgentWorkspaceState`. New non-Agent consumers should import the
neutral entry. Changing the legacy marker requires migrating all CSS consumers,
including the TokenBridge action-style exclusion, with matched visual evidence.
