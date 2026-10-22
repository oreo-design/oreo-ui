# Composer · Oreo Figma reconciliation

Date: 2026-10-22. User requested foundation reconciliation and exact static alignment with six sections of the Oreo Agentic UI Library.

- [Prompt](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-13568)
- [Context](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-14490)
- [Attachment](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4024-1263)
- [Keyword](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-5890)
- [Usage](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4363-3315)
- [Menus](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=5069-5580)

Implemented in the existing prompt-box, context-bar, attachment, keyword-tag owners and the new composer family. `/composer` includes the complete local template and source-sized variants. Shared foundation changes include Mona Sans / Fragment Mono, placeholder color, Card Large radius and missing semantic tokens. Explicit legacy Inter instances are retained.

The single task evidence owner is [REVIEW.md](/Users/ziye/Documents/Project/Research/oreo-ui-composer-20261022/artifacts/composer-20261022/REVIEW.md). It contains the source exports, before/after screenshots, geometry comparison, responsive/dark coverage, recordings and delivery status. Evidence stays local; source is tracked here. This note links that owner and does not duplicate its audit.

Static comparison covers the supplied native dimensions and browser-rendered specimens. Font rasterization is platform dependent; no zero-pixel-difference claim is made. WebGPU renders the original Ultracode shader; unsupported browsers retain the neutral track. Local fixtures do not prove upload services, model execution, real microphone transcription or deployment.

Adoption: implemented; PR and remote result are recorded in the task review index.
