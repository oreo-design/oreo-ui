# Oreo UI

A small, copy-paste React component library that reproduces the **Oreo UI** design language on a modern headless stack. Built as a design-system reference: own the source, theme via tokens, animate with springs.

**[Live demo →](https://oreo-ui-preview.vercel.app)**

## Stack

| Layer | Choice |
| --- | --- |
| Behavior / a11y | [Base UI](https://base-ui.com) (`useRender` for polymorphism) |
| Styling | Tailwind CSS v4 + [tailwind-variants](https://www.tailwind-variants.org) (`tv`) |
| Class merging | `clsx` + `tailwind-merge` (`cn`) |
| Motion | [Motion](https://motion.dev) springs (`bounce` / `duration`) |
| Theming | Design tokens as CSS variables (light + dark) |

## What's inside

- **Button** — `primary` / `secondary` / `tertiary` variants, `danger` flag, leading/trailing icons, Material-style state-layer hover/press, and a tunable Motion spring on press.
- **Icon Button** — square, icon-only action sharing Button's surface, with a `shape` switch (capsule / rounded square) and an optional `floating` elevation.
- **Chip** — compact, tappable suggestion pill with leading icon, four states (default / hover / selected / disabled), a Motion press spring, and a scrollable `ChipGroup`.
- **Tag** — small palette-driven label for metadata and filters: seven tones, optional `#` prefix, leading icon, and a trailing remove action.
- **Shortcut** — keyboard key-caps (`⌘ ⇧ ⌥ ^`) rendered from tokens, with modifier glyph mapping and a `combine` mode for merged combos. Semantic `<kbd>`.
- **Avatar** — circular avatar that infers its type from props (photo / gradient agent / brand logo / initials / empty), with four sizes and an overlapping `AvatarGroup` (`+N` overflow).
- **Switch** — the boolean control for settings rows: Base UI state on the Oreo track/thumb surface, with a slight overshoot on the thumb.
- **Page Loader** — story-driven page loading sized to the wait: six storylines (snake / breakout / runner / fishing / orbit / kitchen), each at three tiers — a glyph loop under 5s, a CSS ambient scene to 30s, and a playable canvas minigame beyond, with `tierForEstimate` mapping an estimate to a tier.
- **Settings pattern** — a configurable settings-page framework (`/settings`): three appearance axes (background hierarchy · card style · nav icons) expressed through a local `--settings-*` variable layer, a full row vocabulary (setting / link-out / stat / meter / entity picker / editor / callout), a filtering nav rail that collapses into a drawer, and a six-page showcase with a floating axis switcher.
- **Icon** — thin adapter over [Phosphor](https://phosphoricons.com) that drives size/color via tokens and `currentColor`.
- **Docs app** — three-column layout (component nav · content · on-this-page scrollspy) with Preview/Code tabs, an API table, and a floating **"Make them yours"** panel that drives theme, radius, and the press spring live across every preview.

Design tokens are extracted 1:1 from the Oreo UI Figma file; switching theme or radius only changes CSS variables — components are never touched. The palette tones used by Tag and the Avatar "alphabet" type ship with both light and dark skins.

## Skills catalog

Inspired by [@_heyrico’s Skills interface](https://x.com/_heyrico/status/2109682274090545238), `/skill-card` provides a live playground and documentation for seven exports: `SkillCard`, `SkillProviderBadge`, `SkillSearch`, `SkillCatalogTabs`, `SkillSection`, `SkillEmptyState`, and `SkillWorkspaceShell`.

`/skills-workspace` composes them with the existing `WorkspaceRail` into a responsive template. Search across names, descriptions and providers, add/remove skills, and switch between Installed and Discover. Installation is a local demo only and resets on reload. Provider initials replace brand artwork; dark mode and mobile behavior extend the cropped reference.

Copy `src/components/skill-card` with its Oreo dependencies for the primitives, or add `src/patterns/skills-workspace` for the complete fixture. The components use existing theme, palette and radius tokens without new dependencies.

## Develop

### Settings design-language experiment

`/settings-lab` compares content changes, composition and deliberate extensions of the original Settings pattern. The reusable implementation, lineage contract and checks are documented in [the experiment guide](docs/settings-language/README.md), with evidence in [the results](docs/settings-language/RESULTS.md).

Run `pnpm settings:verify` to compare against the pinned original and exercise the lab. It starts its own local servers on available ports and closes them when done.

Requires Node 18+ and pnpm.

```bash
pnpm install
pnpm approve-builds   # approve esbuild's build script (pnpm blocks it by default)
pnpm dev              # http://localhost:5173
pnpm build            # type-check + production build
pnpm preview          # serve the production build
```

> **Why `approve-builds`?** pnpm v9+ blocks dependency build scripts unless approved.
> esbuild (Vite's bundler) needs its postinstall to fetch a platform binary — run the
> command once and select `esbuild`. If you skip it and `pnpm dev` fails to start, that's why.

## Structure

```
src/
├─ index.css                  # design tokens (CSS vars), light + dark skins
├─ lib/                       # cn, tv helpers + palette (shared color tones)
├─ components/
│  ├─ button/                 # Button + IconButton (shared surface.ts)
│  ├─ chip/                   # Chip + ChipGroup
│  ├─ tag/                    # Tag
│  ├─ shortcut/               # Shortcut (kbd key-caps)
│  ├─ avatar/                 # Avatar + AvatarGroup (agents.ts gradients)
│  ├─ switch/                 # Switch (Base UI Switch on Oreo tokens)
│  └─ icon/                   # Phosphor adapter
├─ patterns/
│  ├─ board/                  # Onboarding Board pattern
│  └─ settings/               # Settings framework (3 appearance axes + row vocabulary + demo/)
├─ docs/                      # DocsLayout, Sidebar, OnThisPage, CustomizePanel, primitives
├─ pages/                     # one *Docs.tsx page per component
├─ lib/site.ts                # route table: slug → title + description (drives <head> and sitemap)
└─ App.tsx                    # page registry + nav state
```

Adding a docs page means one entry in `src/lib/site.ts` (title + meta description) and one in
`App.tsx` — the `<title>`, canonical URL, Open Graph tags and `sitemap.xml` all follow from it.
The favicons, app icons and social card in `public/` are drawn from the Oreo mark by
`node scripts/generate-brand-assets.mjs` (headless Chrome does the rasterizing); re-run it if the
mark or the card copy changes.

Each component folder is self-contained — `*.tsx` + `*.variants.ts` + `index.ts` — so you can copy a single folder into your project and own the code.

## Component pattern

Each component = **Base UI behavior** + **`tv()` variants** + **`cn()` merge** + **token-driven theme**. Interactive states use Tailwind `data-[*]` variants tied to Base UI's data attributes; press animation is an optional Motion spring exposed as props (`bounce`, `duration`, `tapScale`).
