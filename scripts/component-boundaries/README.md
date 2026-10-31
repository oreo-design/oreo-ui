# Focused component boundaries

Run from the repository root:

```sh
node scripts/component-boundaries/check.mjs
node --test scripts/component-boundaries/*.test.mjs
```

The checker rejects component imports/re-exports to patterns, pages and docs after
normalizing relative paths and the @/ alias. It includes literal dynamic imports,
require calls and import types. The new neutral owners also cannot depend on a
business component. Existing component-to-component composition remains valid.

This is a small source-level architectural check, not a security sandbox or a
visual consistency test. Computed module strings and indirect dependencies still
need review. Compatibility tests use Vite's module loader without starting a
network listener; they check the actual old/new exports, row wrapper structure,
status semantics and action contract. CSS rendering needs the normal preview.
