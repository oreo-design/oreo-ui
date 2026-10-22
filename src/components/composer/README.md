# Composer

`Composer` is the complete local composition template. It combines the existing
`PromptBox`, `Attachment`, `KeywordTag`, `ContextBar`, and Base UI menu primitives.
The `/composer` route renders the complete template and the Figma variants.

```tsx
import { Composer } from "@/components/composer";

<Composer
  running={running}
  onStop={stop}
  onSubmit={(prompt, { files, commands, model, approval }) => {
    // The host owns uploads, permissions and model execution.
    submit({ prompt, files, commands, model, approval });
  }}
/>
```

File selection stays local. `value`/`onValueChange` support controlled input;
`defaultValue` supplies the uncontrolled initial text. Enter submits, Shift+Enter
adds a line, and composition events never submit. `@` and `/` filter commands;
arrow keys move the active row, Enter chooses and Escape dismisses. Selected
commands and files can be removed. Model and approval selections are included
in `onSubmit` context. Menu actions in the showcase only update local preview state.

## Reusable parts

- `ComposerMenu` anchors contents to a trigger; `ComposerMenuSurface` renders the
  same contents as an interactive specimen.
- `ComposerAddMenu`, `ComposerConnectorMenu`, `ComposerApprovalMenu` expose actions
  and controlled selections.
- `ComposerModelSettings`, `ComposerModelList`, `ComposerDescribedModels` and
  `ComposerEffort` provide model/search/category/effort variants.
- `ComposerCommandList` provides mention and slash palettes.
- `ComposerUsageMenu` provides summary, expandable and nested variants;
  `ComposerUsageMeters` accepts numeric progress and independent display copy.
  The Figma specimen intentionally has illustrative fill lengths that differ
  from its printed percentages. Real consumers should supply consistent data.

## Figma mapping

File: [Oreo Agentic UI Library](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz)

| Section node | Owner |
| --- | --- |
| 4111:13568 | `prompt-box` plus the complete Composer template |
| 4111:14490 | `context-bar` |
| 4024:1263 | `attachment` |
| 4111:5890 | `keyword-tag` |
| 4363:3315 | `ComposerUsageMenu` / `ComposerUsageMeters` |
| 5069:5580 | Composer menu family |

Foundation text styles now use Mona Sans and Fragment Mono. Explicit legacy
Inter instances remain Inter (attachments, keyword labels and most menu rows).
Colors, spacing and radii resolve through the shared theme tokens. Native
reference widths (237/260/304/438/440/629px) and icon dimensions are intrinsic
specimen geometry; popups constrain themselves to the viewport. Permission
instance descriptions use explicit semantic tokens for the two source colors
that have no foundation equivalent. At narrow widths descriptions wrap so the
full permission explanation remains readable.

`assets.tsx` maps original downloaded Figma vectors to semantic names. Mask URLs
are quoted so Vite's inlined SVG data URLs remain valid. Runtime rendering never
uses temporary Figma asset URLs. The 16px Figma brand wrapper preserves the
original artwork's intrinsic aspect ratio.

## Ultracode fill

`shaders/dither-field.ts` is the original Figma module, copied verbatim with its
source parameters. `DitherFill` supplies a small WebGPU host and converts its
straight-alpha output for canvas presentation. The connector's referenced
`file://shader-runtime-index.json/` resource is unavailable (`Unknown resource`),
so the host is local rather than the unavailable Figma React runtime. It runs the
original shader, not a CSS imitation. The fill is static and respects the authored
4px pitch at any device pixel ratio. Buffers, textures and the device are released
on unmount. On browsers without WebGPU, the neutral underlying track remains;
`data-shader-status="unavailable"` exposes that decorative coverage limit.
