# Parameter Controller

Six independent controlled controls plus a composable panel and section shell. Built from [linci’s four Tuner references](https://x.com/lincidesign/status/2118152731642954107), then mapped to Oreo foundation tokens.

- `NumberParameter`: native number field and vertical pointer/keyboard dial. Supply `min < max`, positive step and a finite bounded value. Arrow keys move one step, Shift moves ten, Home/End reach bounds. Optional edit-start/end callbacks delimit one gesture/typing transaction.
- `ColorParameter`: six-digit HEX plus native color picker. Invalid draft restores the last valid value on blur. Optional opacity readout expands an inline percentage range.
- `ToggleParameter`: controlled Base UI switch in the source's power-button shape; custom on/off labels.
- `SelectParameter`: native short-list select with explicit value/label options; an empty list disables the field.
- `XYParameter`: X increases right, Y down; bounds and step apply to both axes. Full mode includes visible native X/Y fields for keyboard access. Compact mode must be paired with visible host-owned X/Y inputs, as in ShadowParameter.
- `ShadowParameter`: controlled stable-ID layers, maximum eight; add/select/remove, negative offset/spread, blur and opacity. Empty is valid; Add recovers it. `shadowCSS` returns the composed CSS value.
- `ParameterPanel`, `ParameterSection`, `ParameterCard`: structural compositions. Host owns history, presets, theme and data; minimize is local panel state.

No backend, persistence or application preview is implicit. Use the callbacks to update the host's real values. Avoid coupling labels and units to card geometry. Canonical IconButton, semantic Icon, smooth corners, focus and state layers remain shared owners.

## Tokens

Foundation aliases in `parameter-controller.css` resolve only to existing theme variables: bg-elevated/subtle/base, text-secondary/tertiary/placeholder, border-default, accent/accent-subtle, status-success, text-on-accent, the spacing scale, named type sizes, fonts, weights, radii and shadows. Source 22px numeric type uses nearest named 24px text-2xl. Source green/sky blue become Oreo success/accent; this is intentional token adoption. Percent coordinate geometry and 1/2px strokes are structural rather than new theme foundations. HEX literals in sample parameter values are editable data, not UI paint.

Reference-value and tokenized captures, known rendering differences and functional checks are in the [single task review](/Users/ziye/Documents/Project/Research/oreo-ui-evidence/parameter-controls-20261105/REVIEW.md). The tracked research entry records its durable local path; the evidence is outside the disposable LayerFS store.

## Validation

`node --test src/components/parameter-controller/model.test.mjs` (Node 24 strips TS model types) covers bounds, history branching/limit and shadow serialization. `pnpm exec tsc --noEmit` and a focused Vite production build verify integration. See REVIEW for real rendered and interaction evidence.
