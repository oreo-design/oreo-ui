/** Family-owned preview adapters and local export bindings. */
import { AppBrand } from "@/components/icon";
import { promptBoxDemo } from "../prompt-box.demo";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { ComposerAsset } from "@/components/composer/assets";
import { PromptBox, PromptBoxModelSelect, PromptBoxDictation } from "@/components/prompt-box";
import claudeModelLogo from "@/components/composer/assets/dc1a3.svg";
import openaiModelLogo from "@/components/icon/assets/brands/openai.svg";
import geminiModelLogo from "@/components/icon/assets/brands/gemini-color.svg";
import { KeywordTag } from "@/components/keyword-tag";
import { ContextBar, ContextBarLabel } from "@/components/context-bar";
import { MenuItem } from "@/components/menu";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const spring = { bounce: { ...number(.4, 0, 1, .05), group: "Press spring" }, duration: { ...number(.3, .1, 1, .05), group: "Press spring" }, tapScale: { ...number(.96, .8, 1, .01), group: "Press spring" } };
const promptModelIcons = {
  Claude: <img src={claudeModelLogo} alt="" />,
  ChatGPT: <img src={openaiModelLogo} alt="" className="[.theme-dark_&]:invert" />,
  Gemini: <img src={geminiModelLogo} alt="" />,
};
const playgrounds: Record<string, PlaygroundSpec> = {
"prompt-box": define("Prompt Box", {
    dictation: { ...toggle(), label: "Dictation & action review", description: "Switch to the structured dictation composer. The documentation includes a timed sample.", group: "Voice" },
    dictationStatus: { ...select(["idle", "listening", "processing", "ready", "error"], "ready"), label: "Dictation status", group: "Action review" },
    dictationTranscript: { ...text("And remember which palette I picked last…"), label: "Partial transcript", group: "Action review" },
    shortcutAction: { ...toggle(true), label: "Palette shortcut", group: "Action review" },
    memoryAction: { ...toggle(true), label: "Remember palette", group: "Action review" },
    motionAction: { ...toggle(true), label: "Smooth transition", group: "Action review" },
    value: { ...text("", true), label: "Prompt", group: "Prompt Box" },
    placeholder: { ...text("Start by typing…"), group: "Prompt Box" },
    running: { ...toggle(), group: "Prompt Box" },
    attachments: { ...toggle(), label: "Show attachments", group: "Prompt Box" },
    footer: { ...toggle(true), label: "Show footer", group: "Prompt Box" },
    entryStyle: { ...select(["attachment", "add"], "add"), label: "Entry style", group: "Toolbar" },
    showMention: { ...toggle(false), label: "Show mention", group: "Toolbar" },
    permission: { ...select(["hidden", "approval", "unrestricted"], "unrestricted"), label: "Permission", group: "Toolbar" },
    footerStyle: { ...select(["workspace", "apps"], "apps"), label: "Footer style", group: "Connect apps" },
    appsLabel: { ...text("Connect apps"), label: "Label", group: "Connect apps" },
    gmail: { ...toggle(true), label: "Gmail", group: "Connect apps" },
    slack: { ...toggle(true), label: "Slack", group: "Connect apps" },
    clickup: { ...toggle(true), label: "ClickUp", group: "Connect apps" },
    gmailConnected: { ...toggle(false), label: "Gmail connected (demo)", group: "Connect apps" },
    slackConnected: { ...toggle(false), label: "Slack connected (demo)", group: "Connect apps" },
    clickupConnected: { ...toggle(false), label: "ClickUp connected (demo)", group: "Connect apps" },
    inset: { ...toggle(), group: "Prompt Box" },
    keywords: { ...toggle(), label: "Show keywords", group: "Keyword Tag" },
    keyword: { ...text("Design system"), label: "Label", group: "Keyword Tag" },
    keywordColor: { ...select(["surface", "mint", "pink", "blue", "purple", "orange"], "purple"), label: "Color", group: "Keyword Tag" },
    voice: { ...select(["none", "mic", "wave"], "mic"), label: "Type", group: "Voice" },
    voiceStatus: { ...select(["idle", "inputting", "thinking"], "idle"), label: "Status", group: "Voice" },
    model: { ...select(["Claude", "ChatGPT", "Gemini"], "ChatGPT"), label: "Model", group: "Model select" },
    ...spring,
  }, (v, set) => v.dictation ? <PromptBoxDictation
    draft={{ text: v.value, actions: [
      ...(v.shortcutAction ? [{ id: "shortcutAction", label: "Palette shortcut", text: "Add a keyboard shortcut to cycle through the color palettes." }] : []),
      ...(v.memoryAction ? [{ id: "memoryAction", label: "Remember palette", text: "Remember the last selected palette between sessions." }] : []),
      ...(v.motionAction ? [{ id: "motionAction", label: "Smooth transition", text: "Animate the transition when switching palettes." }] : []),
    ] }}
    onDraftChange={draft => {
      set("value", draft.text);
      for (const key of ["shortcutAction", "memoryAction", "motionAction"] as const) set(key, draft.actions.some(action => action.id === key));
    }}
    status={v.dictationStatus} transcript={v.dictationTranscript}
    onStart={() => set("dictationStatus", "listening")} onFinish={() => set("dictationStatus", "ready")}
    onCancel={() => set("dictationStatus", "idle")} onRetry={() => set("dictationStatus", "listening")}
    entryStyle={v.entryStyle} showMention={v.showMention}
    permission={v.permission === "hidden" ? undefined : { value: v.permission, options: [
      { value: "approval", label: "Ask for approval" },
      { value: "unrestricted", label: "Unrestricted access", tone: "warning" },
    ], onValueChange: value => set("permission", value as typeof v.permission) }}
    connectApps={v.footer && v.footerStyle === "apps" ? {
      label: v.appsLabel,
      apps: (["gmail", "slack", "clickup"] as const).filter(id => v[id]).map(id => ({ id, label: { gmail: "Gmail", slack: "Slack", clickup: "ClickUp" }[id], icon: <AppBrand name={id} />, connected: v[`${id}Connected`] })),
      onAppClick: app => { const key = `${app.id}Connected` as "gmailConnected" | "slackConnected" | "clickupConnected"; set(key, !v[key]); },
    } : undefined}
    footer={v.footer && v.footerStyle === "workspace" ? <ContextBar position="footer"><ContextBarLabel muted>Connected to your workspace</ContextBarLabel></ContextBar> : undefined}
    onSubmit={() => set("running", true)} running={v.running} onStop={() => set("running", false)}
    modelSelect={<PromptBoxModelSelect icon={promptModelIcons[v.model]} label={v.model} />} inset={v.inset}
    bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}
  /> : <PromptBox
    value={v.value} onValueChange={value => set("value", value)} placeholder={v.placeholder} running={v.running}
    onSubmit={() => set("running", true)} onStop={() => set("running", false)} onAttach={() => set("attachments", !v.attachments)} onMention={() => set("keywords", !v.keywords)}
    attachments={v.attachments ? <AttachmentBar><Attachment type="pdf" label="Design brief.pdf" onRemove={() => set("attachments", false)} /></AttachmentBar> : undefined}
    tags={v.keywords ? <KeywordTag color={v.keywordColor} icon={<ComposerAsset name="plus" />} onRemove={() => set("keywords", false)}>{v.keyword}</KeywordTag> : undefined}
    voice={v.voice === "none" ? undefined : v.voice} voiceStatus={v.voiceStatus} onVoiceToggle={() => set("voiceStatus", v.voiceStatus === "idle" ? "inputting" : "idle")}
    modelSelect={<PromptBoxModelSelect icon={promptModelIcons[v.model]} label={v.model} menu={<>{["Claude", "ChatGPT", "Gemini"].map(model => <MenuItem key={model} selected={model === v.model} trailing={model === v.model ? <ComposerAsset name="check" className="text-text-primary" /> : undefined} onClick={() => set("model", model as typeof v.model)}>{model}</MenuItem>)}</>} />}
    entryStyle={v.entryStyle} showMention={v.showMention}
    permission={v.permission === "hidden" ? undefined : { value: v.permission, options: [
      { value: "approval", label: "Ask for approval" },
      { value: "unrestricted", label: "Unrestricted access", tone: "warning" },
    ], onValueChange: value => set("permission", value as typeof v.permission) }}
    connectApps={v.footer && v.footerStyle === "apps" ? {
      label: v.appsLabel,
      apps: (["gmail", "slack", "clickup"] as const).filter(id => v[id]).map(id => ({ id, label: { gmail: "Gmail", slack: "Slack", clickup: "ClickUp" }[id], icon: <AppBrand name={id} />, connected: v[`${id}Connected`] })),
      onAppClick: app => { const key = `${app.id}Connected` as "gmailConnected" | "slackConnected" | "clickupConnected"; set(key, !v[key]); },
    } : undefined}
    footer={v.footer && v.footerStyle === "workspace" ? <ContextBar position="footer"><ContextBarLabel muted>Connected to your workspace</ContextBarLabel></ContextBar> : undefined}
    inset={v.inset} bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}
  />)
};
playgrounds["prompt-box"].demo = promptBoxDemo;
const exports = {
"icon": { AppBrand },
"composer": { ComposerAsset },
"attachment": { Attachment, AttachmentBar },
"prompt-box": { PromptBox, PromptBoxModelSelect, PromptBoxDictation },
"keyword-tag": { KeywordTag },
"context-bar": { ContextBar, ContextBarLabel },
"menu": { MenuItem }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "prompt-box"; spec.exports = exports; }
export default playgrounds;
