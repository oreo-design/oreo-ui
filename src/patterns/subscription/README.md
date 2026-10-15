# Subscription workspace

`SubscriptionWorkspace` composes the copyable components in `components/subscription` into a fictional personal membership workspace. The template opens its offer on first render and keeps a visible trigger for reopening it. Its continuation is local preview state only; it never creates an account or subscription.

## Pieces

- `LayeredProductCard`: two decorative slots, independent pointer-following translations, static mark and caption. No tilt, scale, or looping motion. Decorative slots must not contain focusable controls; accessible information belongs in the caption.
- `ProductPreview`: original social, assistant and code illustrations using Oreo Avatar and Icon. No third-party artwork requests.
- `SubscriptionFeatureGrid`: responsive three-column group and explicit empty collection state.
- `SharedUsageNotice`: native disclosure for plan-specific details.
- `SubscriptionDialog`: Base UI modal with a real trigger, title and description, focus trap/return, pointer and Escape dismissal. Host owns continuation, pending, errors and cancellation. A `dark` prop carries theme tokens into the portal.

## Host integration

Use `onContinue` to start your actual plan selection flow, and provide `pending`, `error`, real terms and product copy. Do not treat the default illustrations, notice or local completion as billing functionality. The dialog remains dismissible while pending; cancel or ignore in-flight work in your `onOpenChange` handler when appropriate. The docs demo demonstrates cancellation and one-shot failure/retry.

## Reference and deliberate differences

https://x.com/HamzaInstantly/status/2110392051074511159 — Hamza A. shares a short desktop video credited to Benji Taylor. Observed: a centered offer, three clipped product scenes with two subtly moving layers, captions, shared usage notice, CTA and fine print. Exact spring values are not exposed by the video.

Oreo adapts the visual into existing surfaces, spacing, type, radius, palette, Button, IconButton, Avatar and Icon primitives. Original illustration geometry is scoped to the component stylesheet. A back plane uses 35% of the front plane's travel, with the front clamped to 0–8 CSS pixels. The default is 4px. Pointer motion uses the house spring recipe (0.5s / 0.2 bounce); only transforms change. Touch, disabled motion and reduced motion are static. Dialog entry/exit uses the house 250ms ease-out recipe, with instant keyboard entry/dismissal. The source only establishes desktop light hover behavior; other states are independent Oreo extensions.

See `/subscription-components` for the live playground, documentation and state demos; `/subscription` for the complete template.
