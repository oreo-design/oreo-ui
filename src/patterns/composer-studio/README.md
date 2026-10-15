# Composer Studio

Route: `/composer-studio`. Components: `/toggle-composer`.

Inspired by Greg Washington: https://x.com/gregmwashington/status/2110188748994675112

Quick and Long modes retain separate text. Controlled `ToggleComposer`, native-radio `ComposerModeSwitch`, `ComposerFormattingToolbar`, and `formatComposerText` can be copied independently. Markdown output reuses Oreo Response, actions reuse Button/IconButton, icons use the active adapter, and surfaces use semantic tokens. Frosted mode reuses the existing Kyoto image; it does not redistribute the reference video's mountain imagery.

The template provides light/dark and solid/frosted variants, live preview, required-content validation, PNG/JPEG/WebP attachments up to 5 MB, session-only draft snapshots, open and delete. Opening a saved draft replaces the current editor. New draft clears both modes; saved drafts remain. Refreshing discards the session. Nothing is uploaded or published. Hosts own persistence, authentication, submission and any async loading/retry states.

Selection formatting produces Markdown, not a rich-text document. Links insert an editable placeholder URL. Quick actions keep a compact footer; Long separates headline, intro and body with a full-width save action. Pointer-only 180 ms transform moves the active indicator; high-frequency text, keyboard operations, theme, preview and form layout updates are immediate. Reduced motion removes movement. Static blur has an opaque fallback.
