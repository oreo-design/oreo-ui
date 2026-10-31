# Row layout

`RowLayout` owns the existing horizontal geometry and last-child divider. It does
not own selection, navigation, form labels or responsive composition. `RowLabel`
owns the shared title/description hierarchy; `strong` changes only title emphasis.

Use children for real controls and keep their accessible names and event handlers
in the host. Text and controls remain independent. Preserve full meaningful copy;
do not add a description when the product has none. Use Settings `AdaptiveRow`
when a settings composition needs narrow-container wrapping and media/detail slots.

The host owns the group surface, its padding and width. A standalone row is also
the last child, so its divider is hidden. `--row-divider` defaults to the project's
`--color-border-subtle`; the Settings compatibility entry maps its local hairline.
The application must load Oreo's index.css tokens and generated Tailwind utilities.
This module does not load settings.css or choose a business-specific theme.
