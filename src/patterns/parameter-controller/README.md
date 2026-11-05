# Parameter Controller template

Route `/parameter-controller` presents the four reference compositions. `?example=panel|basic|xy|shadow` selects the initial view. Catalog pages expose the independent parameter controls, panel, XY and shadow editor with controlled playground properties and correct per-example code exports.

`ParameterControllerDemo` composes a full Tuner: Original/reset, local A–H saved presets, two independently collapsible sections, minimize/expand, shared theme toggle and a 50-entry undo/redo history. Typing and drag gestures each create one undo entry; a new edit invalidates redo. The examples are local fixtures and do not persist across reloads. The panel sets parameter values; it does not pretend to change an external canvas.

The example navigation in normal document flow belongs to the demonstration page, not the exported panel. Narrow screens keep all controls in normal scroll flow. Theme and Reduce Motion come from existing site owners.
