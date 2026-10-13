import { promptBoxDemo } from "./prompt-box.demo";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/chip";
import { Tag } from "@/components/tag";
import { Shortcut } from "@/components/shortcut";
import { Avatar } from "@/components/avatar";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";
import { KeywordTag } from "@/components/keyword-tag";
import { ContextBar, ContextBarLabel } from "@/components/context-bar";
import { ToolCall, ToolCallRow } from "@/components/tool-call";
import { Reasoning } from "@/components/reasoning";
import { Plan, PlanStep } from "@/components/plan";
import { Sources, Source } from "@/components/sources";
import { Confirmation } from "@/components/confirmation";
import { WebSearch, WebSearchResult } from "@/components/web-search";
import { CodeDiff } from "@/components/code-diff";
import { Terminal } from "@/components/terminal";
import { Subagent } from "@/components/subagents";
import { ThreadList, ThreadListItem } from "@/components/thread-list";
import { AssistantModal } from "@/components/assistant-modal";
import { Message, MessageContent } from "@/components/message";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/conversation";
import { Response } from "@/components/response";
import { CodeBlock } from "@/components/code-block";
import { StreamingText } from "@/components/streaming-text";
import { BranchPicker } from "@/components/branch-picker";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { GradientMask } from "@/components/gradient-mask";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, number, select, type PlaygroundSpec } from "./schema";

// Registered names also make the JSX export independent of minified function names.
export const componentModules = {
  button: { Button, IconButton }, icon: { Icon }, chip: { Chip }, tag: { Tag }, shortcut: { Shortcut }, avatar: { Avatar },
  attachment: { Attachment, AttachmentBar }, "prompt-box": { PromptBox, PromptBoxModelSelect }, "keyword-tag": { KeywordTag },
  "context-bar": { ContextBar, ContextBarLabel }, "tool-call": { ToolCall, ToolCallRow }, reasoning: { Reasoning }, plan: { Plan, PlanStep },
  sources: { Sources, Source }, confirmation: { Confirmation }, "web-search": { WebSearch, WebSearchResult }, "code-diff": { CodeDiff },
  terminal: { Terminal }, subagents: { Subagent }, "thread-list": { ThreadList, ThreadListItem }, "assistant-modal": { AssistantModal },
  message: { Message, MessageContent }, conversation: { Conversation, ConversationContent, ConversationScrollButton }, response: { Response },
  "code-block": { CodeBlock }, "streaming-text": { StreamingText }, "branch-picker": { BranchPicker }, menu: { Menu, MenuTrigger, MenuPopup, MenuItem },
  "gradient-mask": { GradientMask },
};
const sizes = select(["sm", "md", "lg"], "md");
const emphasis = select(["primary", "secondary", "tertiary"], "primary");
const color = select(PALETTE, "default");
const spring = { bounce: { ...number(.4, 0, 1, .05), group: "Press spring" }, duration: { ...number(.3, .1, 1, .05), group: "Press spring" }, tapScale: { ...number(.96, .8, 1, .01), group: "Press spring" } };
const promptText = "Help me design a thoughtful workspace.";

export const playgrounds: Record<string, PlaygroundSpec> = {
  button: define("Button", { children: { ...text("Continue"), label: "Label" }, type: emphasis, size: sizes, danger: toggle(), disabled: toggle(), leadingIcon: toggle(true), trailingIcon: toggle(), ...spring }, (v) =>
    <Button type={v.type} size={v.size} danger={v.danger} disabled={v.disabled} leadingIcon={v.leadingIcon ? <Icon name="sparkle" /> : undefined} trailingIcon={v.trailingIcon ? <Icon name="chevron-right" /> : undefined} bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}>{v.children}</Button>),
  "icon-button": define("Icon Button", { type: emphasis, size: sizes, shape: select(["rounded", "rectangle"], "rounded"), floating: toggle(), danger: toggle(), disabled: toggle(), ...spring }, v =>
    <IconButton aria-label="Add item" icon={<Icon name="plus" />} {...v} />),
  chip: define("Chip", { children: { ...text("Summarize this page"), label: "Label" }, size: select(["sm", "md"], "md"), selected: toggle(), disabled: toggle(), icon: toggle(true), ...spring }, (v, set) =>
    <Chip {...v} icon={v.icon ? <Icon name="sparkle" /> : undefined} onClick={() => set("selected", !v.selected)}>{v.children}</Chip>),
  tag: define("Tag", { children: { ...text("Design"), label: "Label" }, color, size: select(["sm", "md"], "sm"), hash: toggle(), icon: toggle() }, v =>
    <Tag {...v} icon={v.icon ? <Icon name="sparkle" /> : undefined}>{v.children}</Tag>),
  shortcut: define("Shortcut", { keys: { ...text("cmd, shift, K"), description: "Separate key names with commas." }, size: select(["sm", "md"], "sm"), combine: toggle() }, v =>
    <Shortcut {...v} keys={v.keys.split(",").map(key => key.trim()).filter(Boolean)} />),
  avatar: define("Avatar", { name: text("Alex Morgan"), size: select(["xs", "sm", "md", "lg"], "md"), color: select([...PALETTE, "black", "white"], "default"), agent: select(["none", "nova", "void", "jade", "bloom", "silk", "flare"], "none") }, v =>
    <Avatar {...v} agent={v.agent === "none" ? undefined : v.agent} />),
  "prompt-box": define("Prompt Box", {
    value: { ...text("", true), label: "Prompt", group: "Prompt Box" },
    placeholder: { ...text("Start by typing…"), group: "Prompt Box" },
    running: { ...toggle(), group: "Prompt Box" },
    attachments: { ...toggle(), label: "Show attachments", group: "Prompt Box" },
    footer: { ...toggle(true), label: "Show context bar", group: "Prompt Box" },
    inset: { ...toggle(), group: "Prompt Box" },
    keywords: { ...toggle(), label: "Show keywords", group: "Keyword Tag" },
    keyword: { ...text("Design system"), label: "Label", group: "Keyword Tag" },
    keywordColor: { ...select(["surface", "mint", "pink", "blue", "purple", "orange"], "purple"), label: "Color", group: "Keyword Tag" },
    voice: { ...select(["none", "mic", "wave"], "mic"), label: "Type", group: "Voice" },
    voiceStatus: { ...select(["idle", "inputting", "thinking"], "idle"), label: "Status", group: "Voice" },
    model: { ...select(["Claude", "ChatGPT", "Gemini"], "Claude"), label: "Model", group: "Model select" },
    ...spring,
  }, (v, set) => <PromptBox
    value={v.value} onValueChange={value => set("value", value)} placeholder={v.placeholder} running={v.running}
    onSubmit={() => set("running", true)} onStop={() => set("running", false)} onAttach={() => set("attachments", !v.attachments)} onMention={() => set("keywords", !v.keywords)}
    attachments={v.attachments ? <AttachmentBar><Attachment type="pdf" label="Design brief.pdf" onRemove={() => set("attachments", false)} /></AttachmentBar> : undefined}
    tags={v.keywords ? <KeywordTag color={v.keywordColor} icon={<Icon name="sparkle" />} onRemove={() => set("keywords", false)}>{v.keyword}</KeywordTag> : undefined}
    voice={v.voice === "none" ? undefined : v.voice} voiceStatus={v.voiceStatus} onVoiceToggle={() => set("voiceStatus", v.voiceStatus === "idle" ? "inputting" : "idle")}
    modelSelect={<PromptBoxModelSelect label={v.model} menu={<>{["Claude", "ChatGPT", "Gemini"].map(model => <MenuItem key={model} selected={model === v.model} onClick={() => set("model", model as typeof v.model)}>{model}</MenuItem>)}</>} />}
    footer={v.footer ? <ContextBar position="footer"><ContextBarLabel muted>Connected to your workspace</ContextBarLabel></ContextBar> : undefined}
    inset={v.inset} bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}
  />),
  attachment: define("Attachment", { label: text("Design brief.pdf"), type: select(["image", "video", "doc", "text", "code", "json", "music", "unknown", "link", "pdf"], "pdf"), size: select(["md", "sm"], "md"), loading: toggle() }, v => <Attachment {...v} src={v.type === "image" || v.type === "video" ? new URL("../../components/prompt-box/assets/figma-color.svg", import.meta.url).href : undefined} />),
  "keyword-tag": define("Keyword Tag", { children: { ...text("Create image"), label: "Label" }, color: select(["surface", "mint", "pink", "blue", "purple", "orange"], "purple"), icon: toggle(true) }, v => <KeywordTag color={v.color} icon={v.icon ? <Icon name="sparkle" /> : undefined}>{v.children}</KeywordTag>),
  "context-bar": define("Context Bar", { children: { ...text("Reviewing your workspace"), label: "Label" }, status: select(["default", "progress", "loading", "waiting", "done", "queue"], "default"), muted: toggle(), position: select(["detached", "header", "footer"], "detached") }, v =>
    <ContextBar position={v.position}><ContextBarLabel status={v.status} muted={v.muted}>{v.children}</ContextBarLabel></ContextBar>),
  "tool-call": define("Tool Call", { name: text("Search workspace"), badge: text("components/"), state: select(["running", "complete", "error"], "complete"), open: toggle(true), children: { ...text("Found 12 matching components.", true), label: "Result" } }, (v, set) =>
    <ToolCall name={v.name} badge={v.badge} state={v.state} open={v.open} onOpenChange={open => set("open", open)}><ToolCallRow label="Result">{v.children}</ToolCallRow></ToolCall>),
  reasoning: define("Reasoning", { label: text("Thought process"), status: select(["running", "finished"], "finished"), container: toggle(true), open: toggle(true), children: { ...text("Start with the existing components and keep the interaction familiar.", true), label: "Content" } }, (v, set) =>
    <Reasoning {...v} onOpenChange={open => set("open", open)}>{v.children}</Reasoning>),
  plan: define("Plan", { title: text("Build the playground"), first: { ...select(["done", "active", "pending"], "done"), group: "Plan steps", label: "Explore components" }, second: { ...select(["done", "active", "pending"], "active"), group: "Plan steps", label: "Connect properties" }, third: { ...select(["done", "active", "pending"], "pending"), group: "Plan steps", label: "Review the result" } }, v =>
    <Plan title={v.title}><PlanStep status={v.first}>Explore components</PlanStep><PlanStep status={v.second}>Connect properties</PlanStep><PlanStep status={v.third}>Review the result</PlanStep></Plan>),
  sources: define("Sources", { label: text("Sources"), open: toggle(true), title: { ...text("Build interfaces from components"), group: "Source" }, domain: { ...text("react.dev"), group: "Source" } }, (v, set) =>
    <Sources label={v.label} open={v.open} onOpenChange={open => set("open", open)}><Source title={v.title} domain={v.domain} href="https://react.dev/" /></Sources>),
  confirmation: define("Confirmation", { title: text("Apply these changes?"), description: text("Update the selected component in this local preview.", true), state: select(["pending", "approved", "denied"], "pending"), danger: toggle(), approveLabel: text("Approve"), denyLabel: text("Deny") }, (v, set) =>
    <Confirmation {...v} onApprove={() => set("state", "approved")} onDeny={() => set("state", "denied")} />),
  "web-search": define("Web Search", { query: text("Accessible component patterns"), searching: toggle(), summary: text("Read 1 source"), title: { ...text("Accessible interfaces"), group: "Result" } }, v =>
    <WebSearch query={v.query} searching={v.searching} summary={v.summary}><WebSearchResult domain="w3.org" title={v.title} href="https://www.w3.org/WAI/" /></WebSearch>),
  "code-diff": define("Code Diff", { title: text("button.tsx"), before: { ...text('<Button>Submit</Button>', true), label: "Removed line" }, after: { ...text('<Button type="primary">Continue</Button>', true), label: "Added line" } }, v =>
    <CodeDiff title={v.title} lines={[...v.before.split("\n").map(content => ({ type: "remove" as const, content })), ...v.after.split("\n").map(content => ({ type: "add" as const, content }))]} />),
  terminal: define("Terminal", { command: text("pnpm build"), running: toggle(), exitCode: number(0, 0, 255), children: { ...text("Build complete.", true), label: "Output" } }, v => <Terminal {...v}>{v.children}</Terminal>),
  subagents: define("Subagents", { name: text("Design reviewer"), meta: text("Reviewing components"), status: select(["running", "done", "error"], "running"), progress: number(45, 0, 100) }, v => <Subagent {...v} />),
  "thread-list": define("Thread List", { title: text("A new workspace"), meta: text("Just now"), active: toggle(true), unread: toggle() }, (v, set) =>
    <ThreadList><ThreadListItem {...v} onSelect={() => set("active", !v.active)} /><ThreadListItem title="Explore the design system" meta="Yesterday" /></ThreadList>),
  "assistant-modal": define("Assistant Modal", { label: text("Open assistant"), open: toggle(true), children: { ...text("How can I help you today?", true), label: "Content" } }, (v, set) =>
    <div className="relative h-128 w-full"><AssistantModal className="start-4 flex justify-end" panelClassName="h-96 max-w-full" label={v.label} open={v.open} onOpenChange={open => set("open", open)} inline><div className="p-6 text-sm">{v.children}</div></AssistantModal></div>),
  message: define("Message", { role: select(["user", "assistant"], "user"), variant: select(["bubble", "flat"], "bubble"), children: { ...text(promptText, true), label: "Content" }, avatar: toggle() }, v =>
    <Message role={v.role} variant={v.variant} avatar={v.avatar ? <Avatar name="Alex Morgan" size="sm" /> : undefined}><MessageContent>{v.children}</MessageContent></Message>),
  conversation: define("Conversation", { autoScroll: toggle(true), count: { ...number(5, 2, 20), label: "Message count" } }, v =>
    <Conversation autoScroll={v.autoScroll} className="h-96 w-full"><ConversationContent>{Array.from({ length: v.count }, (_, i) => <Message key={i} role={i % 2 ? "assistant" : "user"}><MessageContent>{i % 2 ? "Let's start with the existing Oreo components." : `Step ${Math.floor(i / 2) + 1}: ${promptText}`}</MessageContent></Message>)}</ConversationContent><ConversationScrollButton /></Conversation>),
  response: define("Response", { children: { ...text("### A thoughtful workspace\n\nStart with **familiar components**.\n\n- Clear hierarchy\n- Accessible controls\n- Room to focus", true), label: "Markdown" } }, v => <Response>{v.children}</Response>),
  "streaming-text": define("Streaming Text", { children: { ...text("A little clarity makes room for great work.", true), label: "Text" }, variant: select(["plain", "fade", "gradient"], "fade") }, v => <StreamingText variant={v.variant}>{v.children}</StreamingText>),
  "code-block": define("Code Block", { code: text('const greeting = "Hello, Oreo";', true), language: select(["tsx", "javascript", "css", "json", "bash", "text"], "tsx"), title: text("example.tsx"), header: toggle(true), copyable: toggle(true), highlight: toggle(true), wrap: toggle() }, v => <CodeBlock {...v} />),
  "branch-picker": define("Branch Picker", { current: { ...number(1, 1, 10), maxFrom: "total" }, total: number(3, 1, 10) }, (v, set) =>
    <BranchPicker current={Math.min(v.current, v.total)} total={v.total} onPrevious={() => set("current", Math.max(1, Math.min(v.current, v.total) - 1))} onNext={() => set("current", Math.min(v.total, v.current + 1))} />),
  menu: define("Menu", { label: text("Open menu"), side: select(["top", "bottom", "left", "right"], "bottom"), align: select(["start", "center", "end"], "start"), sideOffset: number(4, 0, 24), disabled: { ...toggle(), label: "Disable duplicate" } }, v =>
    <Menu><MenuTrigger render={<Button type="secondary" trailingIcon={<Icon name="chevron-down" />} />}>{v.label}</MenuTrigger><MenuPopup side={v.side} align={v.align} sideOffset={v.sideOffset}><MenuItem icon={<Icon name="copy" />} disabled={v.disabled}>Duplicate</MenuItem><MenuItem icon={<Icon name="pencil" />}>Rename</MenuItem></MenuPopup></Menu>),
  "gradient-mask": define("Gradient Mask", { direction: select(["top", "right", "bottom", "left"], "bottom"), easing: select(["linear", "ease-in", "ease-out", "ease-in-out"], "ease-in-out"), start: { ...number(0, 0, 100), maxFrom: "end" }, end: { ...number(100, 0, 100), minFrom: "start" }, strength: number(1, 0, 1, .05) }, v =>
    <GradientMask {...v} end={Math.max(v.start, v.end)}><div className="grid grid-cols-3 gap-3 p-4">{PALETTE.filter(c => c !== "default").map(c => <div key={c} className="grid h-24 place-items-center rounded-xl bg-[var(--color-bg-base)]"><Avatar name="Oreo" color={c} size="lg" /></div>)}</div></GradientMask>),
};

// IconButton is exported and installed from the button module.
playgrounds["icon-button"].source = "button";

playgrounds["prompt-box"].demo = promptBoxDemo;
