# Input

Interaction reference: https://www.alignui.com/docs/v1.2/ui/input (reviewed 2026-11-06).

The base Input uses native input semantics and Oreo tokens. Import the lightweight
base from `@/components/input/input`, or all compositions from `@/components/input`.
`className` targets the field layout, `rootClassName` the border surface and
`inputClassName` the editor. Native props and refs target the input. Size is sm/md/lg.

InputRoot / InputWrapper / InputControl / InputIcon / InputAffix / InputInlineAffix
are also public. Root provides disabled/readOnly/hasError to InputControl; independent
custom actions must receive disabled themselves, or live in a disabled fieldset.
Wrapper focuses its editor when padding or decorative content is clicked; actions
keep their own semantics. A root contains exactly one input editor.

PasswordInput provides visibility and optional three-rule feedback. TagInput commits
trimmed unique tags with Enter and ignores composition events. DateInput and
CounterInput use React Aria (`isDisabled`, `isReadOnly`, `isRequired`, values/bounds,
locale). PaymentInput uses react-payment-inputs for card detection, formatting and
caret handling. Its styled-components peer is required by that library; Oreo does
not use its visual wrapper. InputSelect reuses Oreo's Menu surface tokens.

The only reference visual deviation is intentional: Oreo quiet border focus rather
than Align UI's halo/shadow; Oreo dimensions, colors, font, radius and state layers.
No external payment/auth request is made. See `/input?view=docs` for all 19 examples.
Four-part rules live in `rules.ts` and feed both docs and Agent exports.
