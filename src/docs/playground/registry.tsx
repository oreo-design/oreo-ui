import { AgentResultCard } from "@/components/automation";
import { DocumentStorage } from "@/components/document-activity";
import { CommentThread } from "@/components/comment-thread";
import { initialThreads as commentThreadFixtures } from "@/patterns/comment-workspace/data";

import { ProductPreview } from "@/components/subscription";
import { InlineConfirm } from "@/components/inline-confirm";
import { InlineQuickMenu } from "@/components/inline-quick-menu";
import { FolderCard, FolderArtwork, FOLDER_TONES } from "@/components/knowledge-base";
import { ConnectionGroup, ConnectionRow, ConnectionSetup, ProjectIdentity } from "@/components/connections";
import { OrbitGallery, ORBIT_LAYOUTS } from "@/components/orbit-gallery";
import { orbitGalleryItems } from "@/patterns/orbit-gallery/items";
import { InvoicePreview, UsageSummary } from "@/components/feature-cards";
import { ProspectMetric, ScoreMeter, BuyingSignal, ProspectAction, SIGNAL_TYPES } from "@/components/prospecting";
import { ActivityCard, BudgetMeter } from "@/components/activity";
import { CutReveal } from "@/components/cut-reveal";
import { SkillCard, SkillProviderBadge } from "@/components/skill-card";
import { searchSources, searchAnswer, webSearchDemo } from "./web-search.demo";
import { statusIconDemo } from "./status-icon.demo";
import { StatusIcon, STATUS_ICON_STATES, STATUS_ICON_PROGRESS } from "@/components/status-icon";
import { promptBoxDemo } from "./prompt-box.demo";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/chip";
import { Tag } from "@/components/tag";
import { Shortcut } from "@/components/shortcut";
import { Avatar } from "@/components/avatar";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { PromptBox, PromptBoxModelSelect, PromptBoxDictation } from "@/components/prompt-box";
import { KeywordTag } from "@/components/keyword-tag";
import { ContextBar, ContextBarLabel } from "@/components/context-bar";
import { ToolCall, ToolCallRow } from "@/components/tool-call";
import { Reasoning } from "@/components/reasoning";
import { Plan, PlanStep } from "@/components/plan";
import { Sources, Source } from "@/components/sources";
import { Confirmation } from "@/components/confirmation";
import { WebSearch, WebSearchResult, WebSearchAnswer, WebSearchCitation, WebSearchSourceCard, WebSearchSourceStack } from "@/components/web-search";
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
  automation: { AgentResultCard },
  "document-activity": { DocumentStorage },
  "comment-thread": { CommentThread },

  subscription: { ProductPreview },
  "inline-confirm": { InlineConfirm },
  "inline-quick-menu": { InlineQuickMenu },
  "knowledge-base": { FolderCard, FolderArtwork },
  connections: { ConnectionGroup, ConnectionRow, ConnectionSetup, ProjectIdentity },
  "orbit-gallery": { OrbitGallery },
  prospecting: { ProspectMetric, ScoreMeter, BuyingSignal, ProspectAction },
  activity: { ActivityCard, BudgetMeter },
  "cut-reveal": { CutReveal },
  "skill-card": { SkillCard, SkillProviderBadge },
  "feature-cards": { InvoicePreview, UsageSummary },
  "status-icon": { StatusIcon },
  button: { Button, IconButton }, icon: { Icon }, chip: { Chip }, tag: { Tag }, shortcut: { Shortcut }, avatar: { Avatar },
  attachment: { Attachment, AttachmentBar }, "prompt-box": { PromptBox, PromptBoxModelSelect, PromptBoxDictation }, "keyword-tag": { KeywordTag },
  "context-bar": { ContextBar, ContextBarLabel }, "tool-call": { ToolCall, ToolCallRow }, reasoning: { Reasoning }, plan: { Plan, PlanStep },
  sources: { Sources, Source }, confirmation: { Confirmation }, "web-search": { WebSearch, WebSearchResult, WebSearchAnswer, WebSearchCitation, WebSearchSourceCard, WebSearchSourceStack }, "code-diff": { CodeDiff },
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
  "automation-components": { ...define("Agent Result", { title: text("Selected account and ad sets"), status: select(["ready", "running", "error"], "ready"), open: toggle(false), details: text("Oreo Store · Weekend essentials · $200 daily budget") }, (v, set) => <div className="w-full max-w-xl"><AgentResultCard title={v.title} status={v.status} open={v.open} onOpenChange={open => set("open", open)}>{v.details}</AgentResultCard></div>), source: "automation" },
  "document-activity": define("Document Storage", { capacity: number(20, 0, 100), photos: number(7.2, 0, 100, .1), documents: number(3.8, 0, 100, .1), video: number(1.8, 0, 100, .1) }, v => <div className="w-full max-w-sm"><DocumentStorage capacity={v.capacity} segments={[{label:"Photos",value:v.photos,tone:"photos"},{label:"Documents",value:v.documents,tone:"documents"},{label:"Video",value:v.video,tone:"video"}]} /></div>),
  "comment-thread": define("Comment Thread", { state: select(["open", "resolution", "resolved"], "open"), resolutionId: text("r5") }, (v, set) => <CommentThread key={v.state} thread={{ id: commentThreadFixtures[0].id, comments: commentThreadFixtures[0].comments, resolved: v.state === "resolved", resolutionId: v.state === "open" ? undefined : v.resolutionId }} onChange={thread => { if (thread.resolutionId) set("resolutionId", thread.resolutionId); set("state", thread.resolved ? "resolved" : thread.resolutionId ? "resolution" : "open"); }} className="w-full max-w-xl" />),

  "subscription-components": { ...define("Product Preview", {
    variant: select(["social", "assistant", "code"], "social"),
    title: text(""), description: text(""), travel: number(4, 0, 8, 1), motionEnabled: toggle(true),
  }, v => <ProductPreview variant={v.variant} title={v.title || undefined} description={v.description || undefined} travel={v.travel} motionEnabled={v.motionEnabled} className="w-full max-w-xs" />), source: "subscription" },
  "inline-confirm": define("Inline Confirm", {
    label: text("Delete project"), question: text("Delete project?"), confirmLabel: text("Delete"), cancelLabel: text("Cancel"),
    pendingLabel: text("Deleting"), successLabel: text("Deleted"), disabled: toggle(), simulateError: toggle(),
  }, v => <div className="flex min-h-80 w-full items-center justify-center rounded-card-medium border border-border-subtle bg-bg-base p-5"><div className="flex w-full max-w-xl flex-wrap items-center gap-5">
    <span className="flex items-center gap-2 text-sm font-medium"><span className="text-text-secondary"><Icon name="folder" /></span>Northwind redesign</span>
    <InlineConfirm label={v.label} question={v.question} confirmLabel={v.confirmLabel} cancelLabel={v.cancelLabel} pendingLabel={v.pendingLabel} successLabel={v.successLabel} disabled={v.disabled} onConfirm={async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (v.simulateError) throw new Error("Demo failure");
    }} />
  </div></div>),
  "inline-quick-menu": define("Inline Quick Menu", { value: select(["private", "public"], "private"), open: toggle(), label: text("Visibility"), disabled: toggle() }, (v, set) => <div className="flex min-h-80 w-full items-center justify-center rounded-card-medium border border-border-subtle bg-bg-base"><InlineQuickMenu {...v} onValueChange={value => { if (value === "private" || value === "public") set("value", value); }} onOpenChange={open => set("open", open)} /></div>),
  "knowledge-components": { ...define("Folder Card", { tone: select(FOLDER_TONES, "violet"), title: text("Onboarding"), description: text("2 files · 2 subfolders"), updated: text("Updated 2h"), selected: toggle(true), disabled: toggle(), members: toggle(true) }, (v, set) => <FolderCard tone={v.tone} title={v.title} description={v.description} updated={v.updated || undefined} selected={v.selected} disabled={v.disabled} members={v.members ? [{ name: "Maya", color: "purple" }, { name: "Alex", color: "mint" }] : []} onClick={() => set("selected", !v.selected)} className="max-w-xs" />), source: "knowledge-base" },
  "connection-components": define("Connections", { direction: select(["readers", "sources"], "readers"), open: toggle(true), project: text("vercel-site"), connectedProject: text("browser-api") }, (v, set) => {
    const project = { id: "prj_demo_source", name: v.project };
    const target = { id: "prj_demo_target", name: v.connectedProject, mark: "flame" as const, tone: "orange" as const };
    return <div className="w-full max-w-2xl"><ConnectionGroup project={project} direction={v.direction}><ConnectionRow project={target} open={v.open} onOpenChange={open => set("open", open)}><ConnectionSetup source={v.direction === "readers" ? project : target} target={v.direction === "readers" ? target : project} /></ConnectionRow></ConnectionGroup></div>;
  }),
  "orbit-gallery": define("Orbit Gallery", { layout: select(ORBIT_LAYOUTS, "flat"), label: text("Selected works"), empty: toggle() }, (v, set) => <OrbitGallery items={v.empty ? [] : orbitGalleryItems} layout={v.layout} label={v.label} onLayoutChange={value => set("layout", value)} className="w-full" style={{ height: 560 }} />),
  "feature-cards": define("Feature Cards", {
    variant: select(["invoice", "usage"], "invoice"), fade: toggle(),
    number: text("INV-456789"), amount: text("$284,342.57"), due: text("Due in 15 days"),
    recipient: text(""), sender: text(""), address: text(""),
    title: text("Spending Limit"), description: text("New users by First user primary channel group"),
    running: number(20, 0, 100), swimming: number(20, 0, 100),
  }, v => <div className="w-full max-w-md">{v.variant === "invoice" ? <InvoicePreview number={v.number} amount={v.amount} due={v.due} recipient={v.recipient || undefined} sender={v.sender || undefined} address={v.address || undefined} fade={v.fade} /> : <UsageSummary title={v.title} description={v.description} fade={v.fade} segments={[{ label: "Running", value: v.running, tone: "purple", detail: "average of 12 minutes" }, { label: "Swimming", value: v.swimming, tone: "blue" }]} />}</div>),
  "prospecting-components": { ...define("Prospecting", {
    preview: select(["metric", "score", "signal", "action"], "metric"),
    label: text("Prospects discovered"), value: text("1,284"), change: text("+18%"), description: text("vs. 1,088 prior 7 days"),
    trend: select(["up", "down"], "up"), score: number(92, 0, 100), signal: select(SIGNAL_TYPES, "funding"), signalText: text("Raised $40M Series B"), disabled: toggle(),
  }, v => v.preview === "score" ? <ScoreMeter value={v.score} /> : v.preview === "signal" ? <BuyingSignal type={v.signal}>{v.signalText}</BuyingSignal> : v.preview === "action" ? <ProspectAction disabled={v.disabled} /> : <ProspectMetric label={v.label} value={v.value} change={v.change} description={v.description} trend={v.trend} className="w-full max-w-md rounded-card-medium border border-border-subtle" />), source: "prospecting" },
  "activity-components": { source: "activity", ...define("Activity", { title: text("Billing"), description: text("Invoiced monthly"), used: number(6516.17, 0, 20000, .01), limit: number(10000, 0, 20000, 100), label: text("Workspace limit") }, v => <ActivityCard title={v.title} description={v.description} className="w-full max-w-sm"><BudgetMeter used={v.used} limit={v.limit} label={v.label} /></ActivityCard>) },
  "cut-reveal": define("Cut Reveal", { duration: number(5200, 1000, 12000, 200), label: text("OREO®"), skipLabel: text("Skip intro") }, v => <CutReveal key={`${v.duration}-${v.label}-${v.skipLabel}`} duration={v.duration} skipLabel={v.skipLabel} wordmark={<div className="text-[clamp(48px,9vw,120px)] font-semibold leading-none tracking-tighter">{v.label}</div>} className="w-full max-w-3xl rounded-card-medium"><div className="flex min-h-96 flex-col items-center justify-center gap-4 bg-bg-surface p-6 text-center"><p className="text-xs uppercase tracking-widest text-text-secondary">Made to be yours</p><h2 className="text-4xl font-medium tracking-tight">Good things inside.</h2><a href="/neutomni-intro" className="text-sm underline underline-offset-4">Open Neutomni demo ↗</a></div></CutReveal>),
  "skill-card": define("Skill Card", {
    title: text("Pipeline review"), description: text("Reviews every open deal each Monday, flags the ones with no activity in 14 days and suggests your next move.", true),
    provider: text("Attio"), color, icon: select(["circle-dashed", "sparkle", "chart-line", "calendar"], "circle-dashed"), installed: toggle(), pending: toggle(), disabled: toggle(), error: text(""),
  }, (v, set) => <SkillCard title={v.title} description={v.description} provider={{ name: v.provider, color: v.color }} icon={v.icon} installed={v.installed} pending={v.pending} disabled={v.disabled} error={v.error} onInstalledChange={next => set("installed", next)} className="w-full max-w-md" />),
  "status-icon": {
    ...define("Status Icon", { status: select(STATUS_ICON_STATES, "todo"), progress: select(STATUS_ICON_PROGRESS, "half"), size: select(["sm", "md", "lg", "xl"], "xl"), monochrome: toggle(), animated: toggle(true), "aria-label": text("Task status") }, v => <StatusIcon {...v} />),
    demo: statusIconDemo,
  },
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
    footer: { ...toggle(true), label: "Show context bar", group: "Prompt Box" },
    inset: { ...toggle(), group: "Prompt Box" },
    keywords: { ...toggle(), label: "Show keywords", group: "Keyword Tag" },
    keyword: { ...text("Design system"), label: "Label", group: "Keyword Tag" },
    keywordColor: { ...select(["surface", "mint", "pink", "blue", "purple", "orange"], "purple"), label: "Color", group: "Keyword Tag" },
    voice: { ...select(["none", "mic", "wave"], "mic"), label: "Type", group: "Voice" },
    voiceStatus: { ...select(["idle", "inputting", "thinking"], "idle"), label: "Status", group: "Voice" },
    model: { ...select(["Claude", "ChatGPT", "Gemini"], "Claude"), label: "Model", group: "Model select" },
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
    onSubmit={() => set("running", true)} running={v.running} onStop={() => set("running", false)}
    modelSelect={<PromptBoxModelSelect label={v.model} />} inset={v.inset}
    bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}
  /> : <PromptBox
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
  "web-search": {
    ...define("Web Search", {
      variant: select(["cards", "list"], "cards"), query: text("spring animations react"),
      searching: toggle(), sourceCount: number(6, 0, 6), open: toggle(true), expanded: toggle(),
      answer: toggle(true), error: toggle(),
    }, (v, set) => <div className="w-full space-y-6 rounded-card-medium bg-bg-base p-4 sm:p-6">
      {v.variant === "cards" ? <WebSearch query={v.query} sources={searchSources.slice(0, v.sourceCount)} searching={v.searching}
        open={v.open} onOpenChange={next => set("open", next)} expanded={v.expanded} onExpandedChange={next => set("expanded", next)}
        error={v.error ? "Search could not finish. Please try again." : undefined} onRetry={() => { set("error", false); set("searching", true); }} />
        : <WebSearch query={v.query} searching={v.searching} summary={`Read ${v.sourceCount} sources`}>
          {searchSources.slice(0, v.sourceCount).map(source => <WebSearchResult key={source.id} domain={source.name ?? source.id} title={source.title} href={source.url} />)}
        </WebSearch>}
      {v.answer && v.sourceCount > 0 && <WebSearchAnswer parts={searchAnswer.filter(part => searchSources.slice(0, v.sourceCount).some(source => source.id === part.source?.id))}
        play={!v.searching && !v.error} replayKey={String(v.searching)} />}
    </div>),
    demo: webSearchDemo,
  },
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

playgrounds["connection-components"].source = "connections";
