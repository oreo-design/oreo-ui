# Preference Studio

Routes: `/preference-studio` and `/switch`.

Reference: https://x.com/samosemudiamhe/status/2110425458806235278
Primary reference details: https://www.sakaniui.com/docs/components/switch

The reusable addition is `Switch variant="stretch"`, implemented in the existing Switch owner. Default consumers retain their original appearance and motion. Base UI continues to own checked state, labels, keyboard activation, form input, disabled and read-only behavior. Stretch uses two rounded clip boundaries: 180 ms movement with a 40 ms trailing delay, interruptible in either direction, immediate for keyboard and reduced motion. Its resting size remains 34×20 with a 16px thumb. No runtime dependency was added.

The template composes existing SettingsRow, Switch, Button, Icon and AgentWorkspaceState. Appearance changes the page theme; compact spacing and people toggles change the feed; category filters alter the visible items; quiet mode hides activity without discarding filters; recovery restores the relevant state. Reset restores the initial fixture. Changes are local to this page and reset on refresh. No system setting, notification permission, account or server is modified. This is an authored contextual template, not a screen shown in the source video.
