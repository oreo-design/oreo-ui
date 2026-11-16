# Task Capsule

Four composable roles: TaskCapsule disclosure, SegmentedTaskProgress count, CompactTaskChecklist completion list, TaskStatusChoices radio group. Reuse existing Avatar/AvatarGroup, Tag, Icon, Button, TaskRow status labels and Base UI Collapsible. The template reuses TaskDetailPanel and TaskSubtasks.

- Properties: controlled items/status, optional controlled expansion, independent disabled state, members, due copy and host Open action. Completion does not set status; status does not change items.
- Interaction/states: title disclosure; separate inline status choices with Escape return; native checkbox/radio keys; empty/partial/all-complete and disabled. No async request is implied. Above 24 items the progress ring samples the exact proportion.
- Copy: concise titles, full wrapping, full accessible member names, host-owned due label. Empty is distinct from completed. No inert action or unconfirmed save receipt.
- Layout: concentric card face and recessed footer, 200ms measured disclosure using the existing ConnectionRow recipe. Keyboard and reduced motion skip movement. Checklist scroll belongs to its containing document; details reuse the existing bounded editor.

Routes: /task-capsule, /segmented-task-progress, /compact-task-checklist, /task-status-choices, /task-capsule-workspace. Full API/state/copy/layout rules live on the family docs page. SVG circle coordinates and stroke widths describe the progress icon geometry; other visual values use existing tokens.
