# Working on Oreo UI

This is a motion-heavy design-system reference: Base UI behavior, Tailwind v4 + `tv` styling, Motion springs, tokens as CSS variables. Read the [README](README.md) for the stack and component inventory.

## Design & motion skills

`.claude/skills/` ships [emilkowalski/skills](https://github.com/emilkowalski/skills) — Emil Kowalski's design-engineering and animation skills. They are the house standard for this repo; use them instead of improvising motion values.

Auto-triggering (they load themselves when the work matches):

| Skill | Use for |
| --- | --- |
| `emil-design-eng` | General UI polish, component design, the invisible details |
| `animate` | Building a new animation or transition from scratch |
| `apple-design` | Gesture-driven UI, springs, drag/swipe/sheets, materials, typography |
| `find-animation-opportunities` | "What here should animate?" (and what shouldn't) |
| `improve-animations` | Auditing the codebase's motion and planning fixes |
| `animation-vocabulary` | Naming a motion effect the user described loosely |
| `ask-sonner` | Anything involving Sonner toasts |

Invoke-only (they never trigger on their own — run them by name):

- `/review-animations` — strict review of animation code in a diff. Run this before committing motion changes.
- `/prototype` — build several variants of a UI piece behind a live picker.
- `/pick-ui-library` — choose a dependency from a curated list rather than hand-rolling one.

Upstream updates: `npx skills@latest add emilkowalski/skills`, then copy the refreshed folders into `.claude/skills/`.

Everything else under `.claude/` stays git-ignored; only `skills/` is committed.

## Research continuity

Start reference research from [docs/references/README.md](docs/references/README.md). Keep user-requested analyses in that tracked archive with source URLs, dates, evidence limits and adoption status; link an existing task REVIEW instead of duplicating its authority. Historical suggestions are not automatically current requirements or implemented features.
