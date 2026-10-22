# Prompt Box compositions

The original attachment/mention layout stays the default. Configure the quiet
reference composition without duplicating the component:

```tsx
import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";
import { AppBrand } from "@/components/icon";

<PromptBox
  entryStyle="add"
  showMention={false}
  onAttach={openAttachmentPicker}
  permission={{
    value: permission,
    options: [
      { value: "approval", label: "Ask for approval" },
      { value: "unrestricted", label: "Unrestricted access", tone: "warning" },
    ],
    onValueChange: requestPermissionChange,
  }}
  connectApps={{
    label: "Connect apps",
    apps: [
      { id: "gmail", label: "Gmail", icon: <AppBrand name="gmail" /> },
      { id: "slack", label: "Slack", icon: <AppBrand name="slack" /> },
      { id: "clickup", label: "ClickUp", icon: <AppBrand name="clickup" /> },
    ],
    onAppClick: openConnectionFlow,
  }}
  modelSelect={<PromptBoxModelSelect label="ChatGPT" />}
  voice="mic"
  onVoiceToggle={toggleVoice}
/>
```

- `entryStyle` changes only the built-in attachment entry. `attachControl` wins.
- `showMention` defaults to true and also controls a custom `mentionControl`.
- `permission` is optional and controlled. Its selected label and semantic tone
  come from `options`. Unknown values hide the chip; no handler disables it.
- `connectApps` shows up to three decorative marks and offers every app in the
  menu. `onClick` can replace the menu with a host-owned flow. The caller confirms
  `connected`; clicking never grants access or changes it internally. Empty lists
  disable the menu; per-app disabled and connection states remain visible.
- Explicit `footer`, including `null`, overrides `connectApps`. `inset` works for
  either footer. The existing dictation wrapper accepts these options too.
- The Playground has independent Toolbar and Connect apps controls; connection
  toggles are explicitly local demo state. No OAuth or permission policy runs.
- All surfaces use theme tokens, existing state layers, smooth-corner utilities,
  and the site's property transition owner. Warning orange communicates permission
  state independently of brand accent; brand marks retain their identity colors.
- Narrow previews wrap semantic action clusters instead of clipping operations.

Standalone `PromptBoxPermission` and `PromptBoxConnectApps` are exported with
prop types for composition elsewhere. Custom icons stay in the central icon module.
