# Film Cover

Reusable `FilmReveal`, `FilmCoverUpload`, `CoverTransfer` and `MediaTray`.

- Independent properties: image identity, normalized progress, confirmed status, disabled and animation preferences. The host owns async work and layout.
- States: empty, preparation, ready, recoverable error. Always offer native picker and keyboard selection alongside drag. Progress reaching 100% is not upload success. Cancel/replace must invalidate stale results.
- Copy: use factual source and status. Keep names and file sizes visible. Describe images; expose complete long names. This template uses local samples and says so.
- Composition: 8:5 cover, identity row below; persistent library alongside editor/reader, wrapping above on narrow screens. Buttons/focus/theme come from Oreo. No new foundation token system.

`FilmReveal` loads its renderer only while developing. Its shader coefficients describe optical processing, not UI design values. A grayscale image overlay is the no-WebGL/CORS fallback; reduced motion uses the still color image. It renders only on progress/resize events, limits DPR and disposes GPU resources. Native images remain semantic content.

Template: `/film-cover-studio`; interactive APIs: `/film-cover-upload`, `/film-reveal`, `/media-tray`. The template's 2.4s preparation is a clearly labeled demonstration. Files remain in memory; no persistence, upload, Drive connection or external publishing is claimed.
