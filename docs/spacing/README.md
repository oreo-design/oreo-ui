# Layout spacing

Interactive guide: `/spacing-guide`. Playground: `/spacing`.

The canonical field definitions, limits and recipes live in `src/components/layout-spacing/model.ts`. This is an opt-in composition layer, not a migration of existing template spacing.

| Role | Token | Balanced | Typical Tailwind equivalent |
| --- | --- | --- | --- |
| Navigation width | `--layout-sidebar` | 240px | `w-60` |
| Content perimeter | `--layout-page` | 32px | `p-8` |
| Between independent groups | `--layout-section` | 40px | `gap-10` |
| Between related cards | `--layout-grid` | 16px | `gap-4` |
| Inside a card family | `--layout-card` | 24px | `p-6` |

Use the existing 4px Tailwind layout scale; keep Oreo's 2px/6px fine control tokens for icons, labels and compact controls. Keep related elements closer than unrelated groups, align titles with their content, and choose density by task. Settings rows and a reading pane may legitimately differ. Do not give every `Card` or `Button` a new global padding.

## Reusable owners

- `LayoutScope`: sets five CSS custom properties on its subtree. `values` is an optional `SpacingValues` object; omit it to use the exported CSS class (load the recipe after layout-spacing.css); normal div props, styles and children are supported.
- `LayoutSection`: stacks groups using the section gap. Put headings near their own group, not as independent siblings between groups.
- `LayoutGrid`: responsive auto-fit card grid using the card gap. Override grid columns for a specific product layout.
- `LayoutCard`: Oreo surface, border, radius and scoped inner padding. Avoid another padded wrapper unless it has a distinct role.
- The consuming shell applies `--layout-sidebar` to desktop navigation and `--layout-page` to its content. It owns mobile navigation and breakpoints.

See the runnable composition example in `/spacing-guide`. The teaching dashboard in `SpacingPreview.tsx` uses the real primitives and static data, without remote requests or fake actions.

## Playground behavior

Five sliders and normalized numeric inputs change only current spacing. Inputs snap to the 4px scale and clamp to field limits; empty/invalid input restores the previous value on blur. Balanced and Compact are Oreo starting recipes. Reference reproduces the final illustrated values (248/40/48/12/24) from https://x.com/recentdesign/status/2111763882507149567?s=20, attributed in the post to Michael Filipiuk. The unusual 248px sidebar is deliberately retained for reference study, not a global standard.

Compare displays equal-width, unscaled specimens with identical content. The baseline is frozen; “Set current as baseline” copies current values, and “Restore baseline” restores the original 184/20/20/20/12 example. Reset affects current spacing only. Presets do not overwrite the baseline. Long content affects both specimens equally. State is session-local and resets on navigation/reload.

Highlight spacing paints the owning boxes using Oreo palette tokens. Each layer is also named in the inspector, and a select can isolate one layer. Focusing a numeric field selects its layer. CSS export always reflects current values; if clipboard access fails, the complete code remains selectable with an explicit recovery message.

The preview deliberately remains at least 800px wide and scrolls horizontally on smaller screens. This preserves meaningful numeric comparisons rather than silently scaling the layout. The page and inspector themselves adapt to the viewport. This specimen is not a mobile dashboard template.

## Validation

Use the production build and focused browser checks for presets, numeric limits/step, keyboard adjustment, baseline isolation/reset, overlays, long text, CSS success/failure, route navigation, dark theme and narrow/medium/wide layouts. Inspect actual rendered media. Local fixture checks do not establish production deployment or backend behavior.
