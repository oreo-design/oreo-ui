import { ProgressiveSteps } from "@/components/progressive-steps";
import { ModelTrendChart, ModelUsageRing, AgentUsageRow, type UsageMetric } from "@/components/model-usage";
import { MODELS, sampleDays } from "@/patterns/model-costs/data";
import { SavedPaymentMethods, DiscountCodeField, CheckoutSummary, quoteCheckout } from "@/components/checkout";
import { SAMPLE_METHODS } from "@/patterns/plan-upgrade/data";
import { IconReveal } from "@/components/icon-reveal";
import { WordRoller } from "@/components/word-roller";
import { LoadingSequence } from "@/components/loading-sequence";
import { loadingSequencePlayground } from "./loading-sequence.preview";
import { EscalationCard, SourceConflictCard, KnowledgeSourceTable, ConversationActivity } from "@/components/consulting";
import { CASES, SOURCES, CONFLICTS, DAYS } from "@/patterns/consulting-workspace/data";
import { BrowserSessionTabs, BrowserControlBar, type BrowserRunStatus, type BrowserAction } from "@/components/browser-session";
import { QueryFilterBar, TraceTable, TRACE_FIELDS, type QueryCondition } from "@/components/trace-query";
import { SAMPLE_TRACES } from "@/patterns/trace-explorer/data";
import { TaskStatusGroup, TaskListRow, GroupedTaskList } from "@/components/grouped-tasks";
import { SAMPLE_TASKS, MEMBERS } from "@/patterns/grouped-tasks/data";
import type { TaskStatus } from "@/components/task-row";
import { SpendLimitChart, SecretField, ApiKeyTable } from "@/components/support-console";
import { SPEND_DAYS, SAMPLE_KEYS } from "@/patterns/support-console/data";
import { ForecastTimeline, UsageProjection, DailyUsagePace, forecastUsage } from "@/components/usage-forecast";
import { USAGE_ACCOUNTS, FORECAST_NOW } from "@/patterns/usage-forecast/data";
import { RecipientSearch, PaymentRailPicker, RecipientForm, recipientName } from "@/components/recipient";
import { SAMPLE_RECIPIENTS } from "@/patterns/payment-workspace/data";
import { RevenueMatrix, PipelineFunnel, DealStageBadge, DealTable, salesSummary } from "@/components/sales";
import { SALES_DEALS, REVENUE_DAYS } from "@/patterns/sales-workspace/data";
import { OperationsMap, OperationsFeed, HealthMeters, RouteTimeline, PipelineFile, CameraCheckpoint } from "@/components/operations";
import { VEHICLES, vehicleEvent, vehiclePoint, vehicleStops, HEALTH, MODULES } from "@/patterns/operations-suite/data";
import { ExperimentChart, VariantResults, ExperimentDecision, summarizeExperiment } from "@/components/experiment";
import { SAMPLE_DAYS } from "@/patterns/experiment-workspace/data";
import { ProjectCreateCard, ProjectBoardOverview } from "@/components/project-board";
import { BOARD_PROJECTS, BOARD_PEOPLE } from "@/patterns/project-board/data";
import { WorkspaceSetup, ToolAccessRow, MemberAccessTable, WorkspaceInvitation } from "@/components/workspace-access";
import { ACCESS_TOOLS, ACCESS_MEMBERS, SETUP_STEPS } from "@/patterns/access-workspace/data";
import { ClientSummary, ClientContactStrip, ClientFinanceSummary } from "@/components/client";
import { CLIENT, CLIENT_INVOICES, CLIENT_DATE } from "@/patterns/client-workspace/data";
import { RoutingPolicyControl, RoutingFlow, RouteMetrics } from "@/components/model-routing";
import { routesFor } from "@/patterns/model-router/data";
import { CallbackPriority, CallbackCard, CallbackBoard } from "@/components/callback";
import { INITIAL_CALLBACKS, PEOPLE as CALLBACK_PEOPLE } from "@/patterns/callback-workspace/data";
import { ThinkingState, ThinkingTimeline, THINKING_STATES } from "@/components/thinking-state";
import { STEPS as THINKING_STEPS } from "@/patterns/thinking-workspace/data";
import { CommandSearch, WorkspaceMetric, DeploymentRow } from "@/components/command-search";
import { DEPLOYMENTS } from "@/patterns/command-dashboard/data";
import { InvoiceStatusBadge, InvoiceTable, InvoiceTotals, INVOICE_STATUSES, type InvoiceSortKey } from "@/components/invoice";
import { INITIAL_INVOICES, INVOICE_TODAY } from "@/patterns/invoice-workspace/data";
import { AskAnalytics, InsightSources, type AnalyticsRequest } from "@/components/ask-analytics";
import { SUGGESTIONS, ANALYTICS_SOURCES, ANSWERS, answerFor } from "@/patterns/analytics-assistant/data";
import { HubSearchHero, AgentCategoryGrid, IntegrationTile } from "@/components/agent-hub";
import { HUB_CATEGORIES, HUB_AGENTS, HUB_INTEGRATIONS } from "@/patterns/agent-hub/data";
import { PlaceMap, PlaceDetailCard, MapStylePicker, MAP_STYLES } from "@/components/place-map";
import { SAMPLE_PLACES } from "@/patterns/place-explorer/data";
import { AgentConnectCard, QuotaUsage, AgentClientPicker } from "@/components/agent-connect";
import { AGENT_CLIENTS, AGENT_MARKS } from "@/patterns/agent-connections/data";
import { BalanceChart, AllocationBar, SpendingGauge, PaymentCard } from "@/components/finance";
import { PERIODS, SAVINGS, SPENDING } from "@/patterns/finance-workspace/data";
import { PresenceStack, PresenceBadge } from "@/components/presence";
import { ROOM_PEOPLE } from "@/patterns/presence-room/data";
import { ReleaseEntry } from "@/components/release-entry";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { BrandSwatch } from "@/components/brand-swatch";
import { TypeScale } from "@/components/type-scale";
import { EmailSignature, SAMPLE_SIGNATURE } from "@/components/email-signature";
import { ProjectSummary } from "@/components/project-summary";
import { TaskRow } from "@/components/task-row";
import { TreeStepper, getTreeSteps } from "@/components/tree-stepper";
import { StepProgress } from "@/components/step-progress";
import { REVIEW_TREE } from "@/patterns/security-review/data";
import { TimeframeSelector } from "@/components/timeframe-selector";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { SAMPLE_ASSETS } from "@/patterns/position-studio/data";
import { InboxNotification } from "@/components/studio-inbox";
import { NOTIFICATIONS } from "@/patterns/studio-inbox/data";
import { RegionTrafficMap } from "@/components/edge-monitor";
import { REGIONS } from "@/patterns/edge-observatory/data";
import { Switch } from "@/components/switch";
import { ToggleComposer, ComposerModeSwitch, ComposerFormattingToolbar, EMPTY_COMPOSER, type ComposerMode } from "@/components/toggle-composer";
import { CanvasToolbar, type CanvasMode } from "@/components/canvas-toolbar";
import { TextToolbar, DEFAULT_TEXT_FORMAT, type TextColor, type TextFont, type TextAlignment } from "@/components/text-toolbar";
import { MultiSelectMenu } from "@/components/multi-select-menu";
import { meetingCategories } from "@/patterns/meeting-planner/data";
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
  "progressive-steps": {ProgressiveSteps},
 "model-usage": {ModelTrendChart,ModelUsageRing,AgentUsageRow},
 checkout: {SavedPaymentMethods,DiscountCodeField,CheckoutSummary},
  "icon-reveal": { IconReveal },
  "word-roller": { WordRoller },
  "loading-sequence": { LoadingSequence },
 consulting: {EscalationCard,SourceConflictCard,KnowledgeSourceTable,ConversationActivity},
 "browser-session": {BrowserSessionTabs,BrowserControlBar},
 "trace-query": {QueryFilterBar,TraceTable},
 "grouped-tasks": {TaskStatusGroup,TaskListRow,GroupedTaskList},
  "support-console": { SpendLimitChart, SecretField, ApiKeyTable },
  "usage-forecast": { ForecastTimeline, UsageProjection, DailyUsagePace },
  recipient: { RecipientSearch, PaymentRailPicker, RecipientForm },
  sales: { RevenueMatrix, PipelineFunnel, DealStageBadge, DealTable },
  operations: {OperationsMap, OperationsFeed, HealthMeters, RouteTimeline, PipelineFile, CameraCheckpoint},
  experiment: {ExperimentChart, VariantResults, ExperimentDecision},
  "project-board": {ProjectCreateCard, ProjectBoardOverview},
  "workspace-access": {WorkspaceSetup, ToolAccessRow, MemberAccessTable, WorkspaceInvitation},
  client: { ClientSummary, ClientContactStrip, ClientFinanceSummary },
  "model-routing": { RoutingPolicyControl, RoutingFlow, RouteMetrics },
  callback: { CallbackPriority, CallbackCard, CallbackBoard },
  "thinking-state": { ThinkingState, ThinkingTimeline },
  "command-search": { CommandSearch, WorkspaceMetric, DeploymentRow },
  "invoice": { InvoiceStatusBadge, InvoiceTable, InvoiceTotals },
  "ask-analytics": { AskAnalytics, InsightSources },
  "agent-hub": { HubSearchHero, AgentCategoryGrid, IntegrationTile },
  "place-map": { PlaceMap, PlaceDetailCard, MapStylePicker },
  "agent-connect": { AgentConnectCard, QuotaUsage, AgentClientPicker },
  finance: { BalanceChart, AllocationBar, SpendingGauge, PaymentCard },
  presence: { PresenceStack, PresenceBadge },
  "release-entry": { ReleaseEntry }, "upgrade-prompt": { UpgradePrompt },
  "brand-swatch": { BrandSwatch }, "type-scale": { TypeScale }, "email-signature": { EmailSignature },
  "project-summary": { ProjectSummary },
  "task-row": { TaskRow },
  "tree-stepper": { TreeStepper },
  "step-progress": { StepProgress },
  "timeframe-selector": { TimeframeSelector },
  "inline-search-select": { InlineSearchSelect },
  "studio-inbox": { InboxNotification },
  "edge-monitor": { RegionTrafficMap },
  switch: { Switch },
  "toggle-composer": { ToggleComposer, ComposerModeSwitch, ComposerFormattingToolbar },
  "canvas-toolbar": { CanvasToolbar },
  "text-toolbar": { TextToolbar },
  "multi-select-menu": { MultiSelectMenu },
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
 "progressive-steps": {...define("Progressive Steps",{variant:select(["expanded","compact"],"expanded"),count:select(["4","6"],"4"),step:number(1,1,6,1),completed:toggle(),disabled:toggle(),empty:toggle()},(v,set)=>{const labels=v.count==="6"?["Profile","Email","Phone","ID photo","Selfie","Review"]:["Cart","Details","Payment","Review"];const index=Math.max(0,Math.min(labels.length-1,Math.floor(v.step)-1));const steps=labels.map((label,i)=>({id:String(i+1),label}));return <div className="w-full max-w-lg p-6"><ProgressiveSteps steps={v.empty?[]:steps} value={v.completed?"":String(index+1)} completed={steps.slice(0,v.completed?steps.length:index).map(s=>s.id)} variant={v.variant as "expanded"|"compact"} disabled={v.disabled} onValueChange={id=>set("step",Number(id))}/></div>;}),source:"progressive-steps"},
 "model-trend-chart": {...define("Model Trend Chart",{metric:select(["costCents","tokens","requests"],"costCents"),highlight:text(""),state:select(["ready","empty","loading","error"],"ready")},(v,set)=><div className="w-full max-w-3xl p-6"><ModelTrendChart days={v.state==="ready"?sampleDays("production"):[]} models={MODELS} metric={v.metric as UsageMetric} highlighted={v.highlight} onHighlight={id=>set("highlight",id)} loading={v.state==="loading"} error={v.state==="error"?"Sample usage is unavailable.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"model-usage"},
 "model-usage-ring": {...define("Model Usage Ring",{highlight:text(""),empty:toggle()},(v,set)=><div className="w-full max-w-md p-6"><ModelUsageRing days={v.empty?[]:sampleDays("production")} models={MODELS} value={v.highlight} onValueChange={id=>set("highlight",id)}/></div>),source:"model-usage"},
 "agent-usage-row": {...define("Agent Usage Row",{status:select(["active","paused","complete"],"active"),notice:text("")},(v,set)=><div className="w-full max-w-2xl p-6"><AgentUsageRow title="Support triage" description="Classifies tickets and drafts helpful replies." model="GPT-4o" tokens={1842} costCents={5} status={v.status as "active"|"paused"|"complete"} time="09:42" onOpen={()=>set("notice","Inspect requested. Open Model Costs for the complete flow.")} onRun={()=>set("notice","Sample run requested. The host owns execution.")}/><p role="status" className="mt-4 text-sm text-text-secondary">{v.notice}</p></div>),source:"model-usage"},
 "saved-payment-methods": {...define("Saved Payment Methods",{value:select(["visa","mastercard","wallet"],"visa"),state:select(["ready","loading","refreshing","empty","error"],"ready"),disabled:toggle()},(v,set)=><div className="w-full max-w-lg p-6"><SavedPaymentMethods methods={["ready","refreshing"].includes(v.state)?SAMPLE_METHODS:[]} value={v.value} onValueChange={id=>set("value",id as typeof v.value)} loading={["loading","refreshing"].includes(v.state)} disabled={v.disabled} error={v.state==="error"?"The sample service is unavailable.":undefined} onRetry={()=>set("state","ready")} onAdd={()=>set("state","ready")}/></div>),source:"checkout"},
 "discount-code-field": {...define("Discount Code Field",{value:text("FRIENDS"),applied:text(""),error:text(""),disabled:toggle()},(v,set)=><div className="w-full max-w-md p-6"><DiscountCodeField value={v.value} applied={v.applied} error={v.error} disabled={v.disabled} onValueChange={code=>{set("value",code);set("applied","");set("error","");}} onApply={()=>{const ok=v.value.trim().toUpperCase()==="FRIENDS";set("applied",ok?"FRIENDS":"");set("error",ok?"":"Try FRIENDS for this demo.");}} onRemove={()=>{set("value","");set("applied","");set("error","");}}/></div>),source:"checkout"},
 "checkout-summary": {...define("Checkout Summary",{seats:number(4,1,100,1),discount:toggle(true),taxBasis:select(["subtotal","discounted"],"subtotal")},v=><div className="w-full max-w-md p-6"><CheckoutSummary item={`${v.seats} × Pro licenses (annual)`} period="12 months · billed annually" quote={quoteCheckout(11520,Math.max(1,Math.min(100,Math.round(v.seats))),v.discount?2000:0,1000,v.taxBasis as "subtotal"|"discounted")}/></div>),source:"checkout"},
  "loading-sequence": loadingSequencePlayground,
  "icon-reveal": define("Icon Reveal", {
    text: { ...text("Oreo UI"), label: "Text" },
    radius: { ...select(["sm", "md", "lg"], "md"), label: "Spotlight" },
    density: { ...select(["fine", "regular", "coarse"], "regular"), label: "Icon density" },
    revealed: { ...toggle(), label: "Reveal all" },
    animated: { ...toggle(true), label: "Animate" },
  }, v => <IconReveal {...v} />),
  "word-roller": define("Word Roller", {
    words: { ...text("Sprint, Hurdles, Relay, Marathon, Triathlon, Cycling, Rowing, Climbing, Tennis, Football, Skiing, Surfing, Boxing, Golf", true), description: "Separate words with commas." },
    suffix: text("for every season"),
    value: { ...text("Triathlon"), label: "Selected word" },
    loop: toggle(true), disabled: toggle(),
    size: select(["sm", "md", "lg"], "md"),
    visibleWords: select(["5", "7", "9"], "9"),
  }, (v, set) => <WordRoller words={v.words.split(",").map(word => word.trim()).filter(Boolean)} value={v.value} onValueChange={word => set("value", word)} suffix={v.suffix} loop={v.loop} disabled={v.disabled} size={v.size} visibleWords={Number(v.visibleWords) as 5 | 7 | 9} />),
 "escalation-card": {...define("Escalation Card",{open:toggle(true),caseIndex:number(0,0,CASES.length-1,1)},(v,set)=><div className="w-full p-4"><EscalationCard item={CASES[Math.round(v.caseIndex)]??CASES[0]} open={v.open} onOpenChange={open=>set("open",open)}/></div>),source:"consulting"},
 "source-conflict-card": {...define("Source Conflict Card",{resolution:select(["unresolved","s2","s3","ask"],"unresolved"),disabled:toggle()},(v,set)=><div className="w-full p-4"><SourceConflictCard conflict={{...CONFLICTS[0],resolution:v.resolution==="unresolved"?undefined:v.resolution}} disabled={v.disabled} onResolve={choice=>set("resolution",choice==="s2"?"s2":choice==="s3"?"s3":"ask")}/></div>),source:"consulting"},
 "knowledge-source-table": {...define("Knowledge Source Table",{state:select(["ready","loading","refreshing","empty","error"],"ready")},(v,set)=><div className="w-full min-w-0 p-4"><KnowledgeSourceTable sources={v.state==="ready"||v.state==="refreshing"?SOURCES:[]} conflicts={CONFLICTS} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The source preview is unavailable.":undefined} onRetry={()=>set("state","ready")} onClear={()=>set("state","ready")}/></div>),source:"consulting"},
 "conversation-activity": {...define("Conversation Activity",{empty:toggle()},v=><div className="w-full max-w-md p-4"><ConversationActivity days={v.empty?[]:DAYS}/></div>),source:"consulting"},
 "browser-session-tabs": {...define("Browser Session Tabs",{selected:select(["chat","guide"],"chat"),status:select(["ready","running","paused","user","complete","error","stopped"],"running"),action:select(["navigating","reading","searching","typing","waiting"],"reading"),empty:toggle()},(v,set)=><div className="w-full p-4"><BrowserSessionTabs value={v.selected} onValueChange={id=>set("selected",id==="guide"?"guide":"chat")} tabs={v.empty?[]:[{id:"chat",title:"Research task",icon:"chat",closable:false},{id:"guide",title:"Browser guide",activity:{status:v.status as BrowserRunStatus,action:v.action as BrowserAction}}]} renderPanel={tab=><p className="p-6 text-sm text-text-secondary">{tab.title} — selection and activity are independent.</p>} onAdd={v.empty?()=>set("empty",false):undefined}/></div>),source:"browser-session"},
 "browser-control-bar": {...define("Browser Control Bar",{status:select(["ready","running","paused","user","complete","error","stopped"],"running"),action:select(["navigating","reading","searching","typing","waiting"],"reading"),target:text("Browser guide")},(v,set)=><div className="w-full p-4"><BrowserControlBar status={v.status as BrowserRunStatus} action={v.action as BrowserAction} target={v.target} onStart={()=>set("status","running")} onPause={()=>set("status","paused")} onResume={()=>set("status","running")} onTakeOver={()=>set("status","user")} onReturnControl={()=>set("status","running")} onStop={()=>set("status","stopped")} onRetry={()=>set("status","running")}/></div>),source:"browser-session"},
 "query-filter-bar": {...define("Query Filter Bar",{conditions:text("[]"),disabled:toggle()},(v,set)=><div className="w-full p-4"><QueryFilterBar fields={TRACE_FIELDS} value={(()=>{try{const data=JSON.parse(v.conditions);return Array.isArray(data)?data.filter(c=>c&&typeof c.id==="string"&&typeof c.field==="string"&&typeof c.value==="string"&&["eq","neq","contains","gte","lte"].includes(c.operator)) as QueryCondition[]:[];}catch{return [];}})()} onChange={value=>set("conditions",JSON.stringify(value))} disabled={v.disabled}/></div>),source:"trace-query"},
 "trace-table": {...define("Trace Table",{state:select(["ready","loading","refreshing","empty","error"],"ready"),selected:text("")},(v,set)=><div className="w-full min-w-0 p-4"><TraceTable traces={v.state==="ready"||v.state==="refreshing"?SAMPLE_TRACES.slice(0,5):[]} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The trace service could not be reached.":undefined} selectedId={v.selected} onSelect={trace=>set("selected",trace.id)} onRetry={()=>set("state","ready")} onClear={()=>set("state","ready")}/>{v.selected&&<p className="mt-4 text-sm" role="status">Selected: {v.selected} · <a className="underline" href="/trace-explorer">Open complete template</a></p>}</div>),source:"trace-query"},
 "task-status-group": {...define("Task Status Group",{open:toggle(true),count:number(3,0,20,1)},(v,set)=><div className="w-full p-4"><TaskStatusGroup status="progress" count={v.count} open={v.open} onOpenChange={open=>set("open",open)}><p className="p-4 text-sm text-text-secondary">The host supplies the group contents.</p></TaskStatusGroup></div>),source:"grouped-tasks"},
 "task-list-row": {...define("Task List Row",{selected:toggle()},(v,set)=><div className="w-full min-w-0 p-4"><div className="gt-table-scroll"><table className="gt-table"><thead><tr>{["Name","Priority","List","Tag","Due date","Assignee"].map(t=><th key={t} scope="col">{t}</th>)}</tr></thead><tbody><TaskListRow task={SAMPLE_TASKS[0]} people={MEMBERS} onOpen={()=>set("selected",true)}/></tbody></table></div>{v.selected&&<p role="status" className="mt-4 text-sm">Selected: Craft user personas · <a className="underline" href="/grouped-tasks">Open editable template</a></p>}</div>),source:"grouped-tasks"},
 "grouped-task-list": {...define("Grouped Task List",{empty:toggle(),showEmpty:toggle(),collapsed:text(""),selected:text("")},(v,set)=><div className="w-full min-w-0 p-4"><GroupedTaskList tasks={v.empty?[]:SAMPLE_TASKS.slice(0,8)} people={MEMBERS} collapsed={v.collapsed.split(",").filter(Boolean) as TaskStatus[]} onCollapsedChange={statuses=>set("collapsed",statuses.join(","))} onTaskOpen={task=>set("selected",task.title)} showEmpty={v.showEmpty}/>{v.selected&&<p role="status" className="mt-4 text-sm">Selected: {v.selected} · <a className="underline" href="/grouped-tasks">Open editable template</a></p>}</div>),source:"grouped-tasks"},
  "spend-limit-chart": {...define("Spend Limit Chart",{limit:number(70,0,150,5),empty:toggle()},v=><div className="w-full p-4"><SpendLimitChart days={v.empty?[]:SPEND_DAYS} dailyLimitCents={v.limit*100}/></div>),source:"support-console"},
  "secret-field": {...define("Secret Field",{value:text("demo_only_0123456789abcdef"),failCopy:toggle()},v=><div className="w-full max-w-lg p-6"><SecretField value={v.value} onCopy={v.failCopy?async()=>{throw new Error("Demo clipboard failure")}:undefined}/></div>),source:"support-console"},
  "api-key-table": {...define("API Key Table",{empty:toggle()},v=><div className="w-full p-4"><ApiKeyTable keys={v.empty?[]:SAMPLE_KEYS}/></div>),source:"support-console"},
  "forecast-timeline": {...define("Forecast Timeline",{selected:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro"),days:number(7,1,14,1),empty:toggle()},(v,set)=><div className="w-full p-6"><ForecastTimeline forecasts={v.empty?[]:USAGE_ACCOUNTS.map(a=>forecastUsage(a,FORECAST_NOW))} selectedId={v.selected} onSelect={id=>set("selected",id)} days={v.days}/></div>),source:"usage-forecast"},
  "usage-projection": {...define("Usage Projection",{account:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro"),multiplier:number(1,0,2,.25),invalid:toggle()},v=><div className="w-full max-w-lg p-6"><UsageProjection forecast={forecastUsage({...USAGE_ACCOUNTS.find(a=>a.id===v.account)!,...(v.invalid?{observations:[]}:{} )},FORECAST_NOW,v.multiplier)}/></div>),source:"usage-forecast"},
  "daily-usage-pace": {...define("Daily Usage Pace",{account:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro")},v=><div className="w-full max-w-lg p-6"><DailyUsagePace forecast={forecastUsage(USAGE_ACCOUNTS.find(a=>a.id===v.account)!,FORECAST_NOW)}/></div>),source:"usage-forecast"},
  "recipient-search": {...define("Recipient Search",{query:text(""),selected:text(""),creation:toggle(true),notice:text("")},(v,set)=><div className="w-full max-w-xl p-6"><RecipientSearch recipients={SAMPLE_RECIPIENTS} query={v.query} onQueryChange={q=>set("query",q)} selectedId={v.selected} onSelect={r=>set("selected",r.id)} onCreate={v.creation?name=>set("notice",`Create requested for ${name||"a new recipient"}. Open the full template to fill the form.`):undefined}/><p role="status" className="mt-4 text-xs text-text-secondary">{v.notice}</p></div>),source:"recipient"},
  "payment-rail-picker": {...define("Payment Rail Picker",{value:select(["ach","swift","sepa","usdc"],"ach"),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><PaymentRailPicker value={v.value} disabled={v.disabled} onValueChange={r=>set("value",r)}/></div>),source:"recipient"},
  "recipient-form": {...define("Recipient Form",{sample:toggle(true),notice:text("")},(v,set)=><div className="w-full max-w-3xl p-6"><RecipientForm key={String(v.sample)} initialValue={v.sample?SAMPLE_RECIPIENTS[0]:undefined} onSave={r=>set("notice",`Validated ${recipientName(r)}. The host now owns this draft.`)} onCancel={()=>set("notice","Cancel callback received. The playground keeps the form visible.")}/><p role="status" className="mt-4 text-xs text-text-secondary">{v.notice}</p></div>),source:"recipient"},
  "revenue-matrix": {...define("Revenue Matrix",{period:select(["7","14","28"],"28"),state:select(["ready","empty","invalid"],"ready")},v=><div className="w-full max-w-2xl p-6"><RevenueMatrix days={v.state==="empty"?[]:v.state==="invalid"?[{date:"Sep 1",value:-1}]:REVENUE_DAYS.slice(-Number(v.period))}/></div>),source:"sales"},
  "pipeline-funnel": {...define("Pipeline Funnel",{state:select(["ready","empty","zero"],"ready")},v=><div className="w-full max-w-md p-6"><PipelineFunnel stages={v.state==="empty"?[]:salesSummary(SALES_DEALS).stages.map(s=>({...s,value:v.state==="zero"?0:s.value}))}/></div>),source:"sales"},
  "deal-stage-badge": {...define("Deal Stage Badge",{stage:select(["New","Contacted","Qualified","Negotiation","Won"],"Negotiation")},v=><DealStageBadge stage={v.stage}/>),source:"sales"},
  "deal-table": {...define("Deal Table",{empty:toggle(false)},v=><div className="w-full p-4"><DealTable deals={v.empty?[]:SALES_DEALS}/></div>),source:"sales"},
  "operations-map": {...define("Operations Map",{empty:toggle(false),selected:select(["TRK-04","TRK-03","TRK-05","TRK-06","TRK-07"],"TRK-04")},(v,set)=><div className="w-full max-w-2xl p-4"><OperationsMap points={v.empty?[]:VEHICLES.map(vehiclePoint)} selectedId={v.selected} onSelect={id=>set("selected",id as typeof v.selected)}/></div>),source:"operations"},
  "operations-feed": {...define("Operations Feed",{empty:toggle(false)},v=><div className="w-full max-w-md p-4"><OperationsFeed items={v.empty?[]:VEHICLES.map(vehicleEvent)}/></div>),source:"operations"},
  "health-meters": {...define("Health Meters",{schema:number(100,0,100,1)},v=><div className="w-full max-w-md p-6"><HealthMeters readings={HEALTH.map(r=>r.label==="Schema match"?{...r,value:v.schema,status:v.schema===100?"All fields match":"Review schema",tone:v.schema===100?"success":"warning"}:r)}/></div>),source:"operations"},
  "route-timeline": {...define("Route Timeline",{vehicle:select(["TRK-04","TRK-06","TRK-07"],"TRK-04")},v=><div className="w-full max-w-md p-6"><RouteTimeline stops={vehicleStops(VEHICLES.find(x=>x.id===v.vehicle)!)}/></div>),source:"operations"},
  "pipeline-file": {...define("Pipeline File",{name:text("feature_pipeline.py"),source:text(MODULES[1].source,true)},v=><div className="w-full max-w-3xl p-4"><PipelineFile name={v.name} source={v.source}/></div>),source:"operations"},
  "camera-checkpoint": {...define("Camera Checkpoint",{label:text("North Avenue"),selected:toggle(false)},(v,set)=><div className="w-full max-w-xs p-6"><CameraCheckpoint label={v.label} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"operations"},
  "experiment-chart": {...define("Experiment Chart",{mode:select(["cumulative","daily"],"cumulative"),empty:toggle(false)},v=><div className="w-full max-w-xl p-6"><ExperimentChart days={v.empty?[]:SAMPLE_DAYS} mode={v.mode}/></div>),source:"experiment"},
  "variant-results": {...define("Variant Results",{a:text("Design that ships."),b:text("Interfaces people get at a glance."),empty:toggle(false)},v=><div className="w-full max-w-xl p-6"><VariantResults a={v.empty?{visitors:0,conversions:0}:summarizeExperiment(SAMPLE_DAYS).a} b={v.empty?{visitors:0,conversions:0}:summarizeExperiment(SAMPLE_DAYS).b} labels={[v.a,v.b]}/></div>),source:"experiment"},
  "experiment-decision": {...define("Experiment Decision",{state:select(["ready","collecting","decided"],"ready"),confidence:number(96,0,100,1)},v=><div className="w-full max-w-lg p-6"><ExperimentDecision state={v.state} confidence={v.confidence}/></div>),source:"experiment"},
  "project-create-card": {...define("Project Create Card",{title:text("A little room for your next idea."),animated:toggle(true),action:toggle(true)},v=><div className="w-full max-w-xs p-4"><ProjectCreateCard title={v.title} animated={v.animated} onCreate={v.action?()=>{window.location.href="/project-board";}:undefined}/></div>),source:"project-board"},
  "project-board-overview": {...define("Project Board Overview",{empty:toggle(false),showCreate:toggle(true)},v=><div className="w-full min-w-0 p-4"><ProjectBoardOverview projects={v.empty?[]:BOARD_PROJECTS} people={BOARD_PEOPLE} showCreate={v.showCreate}/></div>),source:"project-board"},
  "workspace-setup": {...define("Workspace Setup",{complete:toggle(false),empty:toggle(false)},v=><div className="w-full p-6"><WorkspaceSetup steps={v.empty?[]:SETUP_STEPS.map(s=>({...s,complete:v.complete||s.complete}))}/></div>),source:"workspace-access"},
  "tool-access-row": {...define("Tool Access Row",{name:text("Claude"),detail:text("4 people have access")},v=><div className="w-full max-w-lg p-6"><ToolAccessRow tool={{...ACCESS_TOOLS[0],name:v.name}} detail={v.detail}/></div>),source:"workspace-access"},
  "member-access-table": {...define("Member Access Table",{empty:toggle(false),active:toggle(true)},v=><div className="w-full p-4"><MemberAccessTable members={v.empty?[]:ACCESS_MEMBERS} tools={ACCESS_TOOLS} activeMemberIds={v.active?["sophia","maya"]:[]}/></div>),source:"workspace-access"},
  "workspace-invitation": {...define("Workspace Invitation",{status:select(["pending","accepted","expired"],"pending"),email:text("riley@studio.example"),empty:toggle(false)},(v,set)=><div className="w-full"><WorkspaceInvitation inviter="Sophia" workspace="Studio workspace" email={v.email} tools={v.empty?[]:ACCESS_TOOLS.slice(0,3)} status={v.status} onAccept={()=>set("status","accepted")}/></div>),source:"workspace-access"},
  "client-summary": {...define("Client Summary",{name:text("Acme Corporation"),active:toggle(true)},v=><div className="w-full p-4"><ClientSummary client={{...CLIENT,...v}} projectCount={6} activeProjects={3} revenueCents={7970000}/></div>),source:"client"},
  "client-contact-strip": {...define("Client Contact Strip",{location:text(CLIENT.location),email:text(CLIENT.email)},v=><div className="w-full p-4"><ClientContactStrip client={{...CLIENT,...v}}/></div>),source:"client"},
  "client-finance-summary": {...define("Client Finance Summary",{empty:toggle(false),currency:select(["USD","EUR"],"USD")},v=><div className="w-full p-4"><ClientFinanceSummary invoices={v.empty?[]:CLIENT_INVOICES} asOf={CLIENT_DATE} currency={v.currency}/></div>),source:"client"},
  "routing-policy": { ...define("Routing Policy", {value:select(["cost","balanced","quality"],"balanced"),disabled:toggle(false)},(v,set)=><RoutingPolicyControl {...v} onChange={value=>set("value",value)}/>),source:"model-routing" },
  "routing-flow": { ...define("Routing Flow", {policy:select(["cost","balanced","quality"],"balanced"),active:toggle(true),empty:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-xl rounded-2xl bg-bg-elevated p-5"><RoutingFlow routes={v.empty?[]:routesFor(v.policy,333)} active={v.active} selected={v.selected} onSelect={id=>set("selected",v.selected===id?"":id)}/></div>),source:"model-routing" },
  "route-metrics": { ...define("Route Metrics", {policy:select(["cost","balanced","quality"],"balanced"),empty:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-2xl rounded-2xl bg-bg-elevated p-5"><RouteMetrics routes={v.empty?[]:routesFor(v.policy,333)} selected={v.selected} onSelect={id=>set("selected",v.selected===id?"":id)}/></div>),source:"model-routing" },
  "callback-priority": { ...define("Callback Priority", {priority:select(["Low","Medium","High","Critical"],"Critical")},v=><CallbackPriority {...v}/>),source:"callback" },
  "callback-card": { ...define("Callback Card", {customer:text("Hillside Dental"),priority:select(["Low","Medium","High","Critical"],"Critical"),cost:number(1280,0,10000,10),showBranch:toggle(true)},v=><div className="w-full max-w-sm rounded-3xl bg-bg-elevated p-4"><CallbackCard callback={{...INITIAL_CALLBACKS[4],customer:v.customer,priority:v.priority,cost:v.cost}} person={CALLBACK_PEOPLE[1]} showBranch={v.showBranch} onOpen={()=>{window.location.href="/callback-workspace";}}/></div>),source:"callback" },
  "callback-board": { ...define("Callback Board", {empty:toggle(false),showBranch:toggle(false)},v=><div className="w-full"><CallbackBoard callbacks={v.empty?[]:INITIAL_CALLBACKS} people={CALLBACK_PEOPLE} showBranch={v.showBranch} onOpen={()=>{window.location.href="/callback-workspace";}}/></div>),source:"callback" },
  "thinking-state": { ...define("Thinking State", {phase:select(THINKING_STATES,"thinking"),active:toggle(true),shape:select(["square","circle"],"square"),tone:select(["neutral","mint","purple","orange"],"mint"),speed:number(1,.5,2,.25),grid:toggle(true),shimmer:toggle(false)},v=><ThinkingState {...v}/>),source:"thinking-state" },
  "thinking-timeline": { ...define("Thinking Timeline", {empty:toggle(false),current:number(2,0,5,1),status:select(["idle","running","paused","complete","error","stopped"],"running"),tone:select(["neutral","mint","purple","orange"],"mint"),shape:select(["square","circle"],"square")},v=><div className="w-full max-w-sm p-6"><ThinkingTimeline steps={v.empty?[]:THINKING_STEPS} current={v.current} status={v.status} tone={v.tone} shape={v.shape}/></div>),source:"thinking-state" },
  "command-search": { ...define("Command Search", { empty:toggle(false), disabled:toggle(false), selected:text("") }, (v,set)=><div className="w-full max-w-sm"><CommandSearch groups={v.empty?[]:[{label:"Platform",items:[{id:"overview",label:"Overview",icon:"columns"},{id:"deployments",label:"Deployments",keywords:"build release",icon:"plane",disabled:v.disabled}]},{label:"Actions",items:[{id:"theme",label:"Switch theme",icon:"moon"}]}]} onSelect={command=>set("selected",command.label)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.selected?`Selected: ${v.selected}`:"Choose an action to see the host callback. Global shortcuts are off in this preview."}</p></div>), source:"command-search" },
  "workspace-metric": { ...define("Workspace Metric", {label:text("Requests"),value:text("181.2k"),detail:text("Across the last 7 days")},v=><div className="w-full max-w-sm"><WorkspaceMetric {...v} icon={<Icon name="chart-bar"/>}/></div>),source:"command-search" },
  "deployment-row": { ...define("Deployment Row", {status:select(["ready","failed"],"ready"),opened:toggle(false)},(v,set)=><div className="w-full"><DeploymentRow deployment={{...DEPLOYMENTS[0],status:v.status}} onOpen={()=>set("opened",true)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.opened?"Host callback: open dpl-1042":"Activate the row to emit an open callback."}</p></div>),source:"command-search" },
  "invoice-status-badge": { ...define("Invoice Status Badge",{status:select(INVOICE_STATUSES,"pending")},v=><InvoiceStatusBadge status={v.status}/>),source:"invoice" },
  "invoice-table": { ...define("Invoice Table",{compact:toggle(false),empty:toggle(false),sortKey:select(["dueDate","id","status","description","client","amountCents"],"status"),direction:select(["asc","desc"],"asc"),action:text("")},(v,set)=><div className="w-full"><InvoiceTable invoices={v.empty?[]:INITIAL_INVOICES.slice(0,9)} asOf={INVOICE_TODAY} sort={{key:v.sortKey as InvoiceSortKey,direction:v.direction}} onSortChange={sort=>{set("sortKey",sort.key);set("direction",sort.direction);}} compact={v.compact} onAction={(invoice,action)=>set("action",`${invoice.id}: ${action}`)} onClearFilters={()=>set("empty",false)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.action?`Host callback: ${v.action}`:"Actions emit callbacks in this isolated preview. Open the template to edit invoices."}</p></div>),source:"invoice" },
  "invoice-totals": { ...define("Invoice Totals",{empty:toggle(false)},v=><div className="w-full"><InvoiceTotals invoices={v.empty?[]:INITIAL_INVOICES} asOf={INVOICE_TODAY}/></div>),source:"invoice" },
  "ask-analytics": { ...define("Ask Analytics", { question:text(""), status:select(["idle","loading","success","empty","error"],"idle"), emptySuggestions:toggle(false), source:text("") }, (v,set)=>{
    const question=v.question||SUGGESTIONS[0].question;
    const request:AnalyticsRequest=v.status==="idle"?{status:"idle"}:v.status==="success"?{status:"success",question,answer:answerFor(question)??ANSWERS.signups}:v.status==="error"?{status:"error",question,message:"The source is unavailable. Try again."}:{status:v.status,question};
    return <div className="w-full max-w-xl"><AskAnalytics value={v.question} onValueChange={q=>set("question",q)} suggestions={v.emptySuggestions?[]:SUGGESTIONS} request={request} onAsk={q=>{set("question",q);set("status",answerFor(q)?"success":"empty");}} onReset={()=>{set("status","idle");set("source","");}} onSourceSelect={id=>set("source",id)} defaultExpanded/>{v.source&&<p role="status" className="mt-4 text-sm text-text-secondary">{ANALYTICS_SOURCES.find(s=>s.id===v.source)?.description}</p>}</div>;
  }), source:"ask-analytics" },
  "insight-sources": { ...define("Insight Sources", { empty:toggle(false), selected:text("") }, (v,set)=><div className="w-full max-w-xl"><InsightSources sources={v.empty?[]:ANALYTICS_SOURCES.slice(0,3)} onSelect={id=>set("selected",id)}/>{v.selected&&<p role="status" className="mt-4 text-sm text-text-secondary">{ANALYTICS_SOURCES.find(s=>s.id===v.selected)?.description}</p>}</div>),source:"ask-analytics" },
  "hub-search-hero": { ...define("Hub Search Hero", { query:text(""), title:text("Agent hub"), description:text("Discover agents and integrations built for your team.") }, (v,set)=><div className="w-full max-w-4xl"><HubSearchHero value={v.query} onValueChange={query=>set("query",query)} title={v.title} description={v.description}/></div>), source:"agent-hub" },
  "agent-category-grid": { ...define("Agent Category Grid", { selected:select(["support","sales","marketing","engineering","finance","operations","research","people","other"],"support"), empty:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><AgentCategoryGrid items={v.empty?[]:HUB_CATEGORIES.map(c=>({...c,count:HUB_AGENTS.filter(a=>a.category===c.id).length}))} selectedId={v.selected} onSelect={id=>set("selected",id as typeof v.selected)}/></div>), source:"agent-hub" },
  "integration-tile": { ...define("Integration Tile", { connected:toggle(true), agentCount:number(4,0,100), integration:select(["zendesk","slack","intercom","github","notion","hubspot"],"slack") }, (v,set)=><div className="w-full max-w-md"><IntegrationTile integration={HUB_INTEGRATIONS.find(i=>i.id===v.integration)!} connected={v.connected} agentCount={v.agentCount} onOpen={()=>set("connected",!v.connected)}/><p className="mt-3 text-xs text-text-secondary">Click to toggle the demo state.</p></div>), source:"agent-hub" },
  "place-map": { ...define("Place Map", { selected:select(["lakehouse","juniper","northlight"],"lakehouse"), mapStyle:select(MAP_STYLES,"meadow"), empty:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><PlaceMap places={v.empty?[]:SAMPLE_PLACES} selectedId={v.selected} mapStyle={v.mapStyle} onSelect={id=>{if(id==="lakehouse"||id==="juniper"||id==="northlight")set("selected",id);}} toolbar={<MapStylePicker value={v.mapStyle} onValueChange={style=>set("mapStyle",style)}/>}/></div>), source:"place-map" },
  "place-detail-card": { ...define("Place Detail Card", { place:select(["lakehouse","juniper","northlight"],"lakehouse"), saved:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><PlaceDetailCard place={SAMPLE_PLACES.find(p=>p.id===v.place)!} index={SAMPLE_PLACES.findIndex(p=>p.id===v.place)} total={3} instant onPrevious={()=>{const i=SAMPLE_PLACES.findIndex(p=>p.id===v.place);set("place",["lakehouse","juniper","northlight"][(i+2)%3] as typeof v.place);}} onNext={()=>{const i=SAMPLE_PLACES.findIndex(p=>p.id===v.place);set("place",["lakehouse","juniper","northlight"][(i+1)%3] as typeof v.place);}} saved={v.saved} onSave={()=>set("saved",!v.saved)}/></div>), source:"place-map" },
  "map-style-picker": { ...define("Map Style Picker", { value:select(MAP_STYLES,"meadow") }, (v,set)=><MapStylePicker value={v.value} onValueChange={value=>set("value",value)}/>), source:"place-map" },
  "agent-connect-card": { ...define("Agent Connect Card", { title:text("Your workspace, in your AI."), description:text("Connect your favorite tools with Oreo MCP."), actionLabel:text("Set up agents") }, v=><div className="w-full max-w-xs"><AgentConnectCard {...v} marks={AGENT_MARKS} onAction={()=>{window.location.href="/agent-connections";}}/></div>), source:"agent-connect" },
  "quota-usage": { ...define("Quota Usage", { label:text("Automations this month"), used:number(54,0,120000,1), limit:number(3000,0,100000,1) }, v=><QuotaUsage {...v}/>), source:"agent-connect" },
  "agent-client-picker": { ...define("Agent Client Picker", { value:select(["desktop","editor","terminal","custom"],"desktop"), empty:toggle(false), disableCustom:toggle(false) }, (v,set)=><div className="w-full max-w-xl"><AgentClientPicker clients={v.empty?[]:AGENT_CLIENTS.map(c=>({...c,disabled:c.id==="custom"&&v.disableCustom}))} value={v.value} onValueChange={value=>{if(value==="desktop"||value==="editor"||value==="terminal"||value==="custom") set("value",value);}}/></div>), source:"agent-connect" },
  "balance-chart": { ...define("Balance Chart", { period:select(["week","month"],"month"), empty:toggle(false) }, v=><div className="w-full max-w-3xl"><BalanceChart points={v.empty?[]:PERIODS[v.period].points}/></div>), source:"finance" },
  "allocation-bar": { ...define("Allocation Bar", { count:number(4,0,4,1) }, v=><div className="w-full max-w-md"><AllocationBar items={SAVINGS.slice(0,v.count)}/></div>), source:"finance" },
  "spending-gauge": { ...define("Spending Gauge", { limit:number(2000,0,5000,100), empty:toggle(false) }, v=><div className="w-full max-w-sm"><SpendingGauge items={v.empty?[]:SPENDING} limit={v.limit}/></div>), source:"finance" },
  "payment-card": { ...define("Payment Card", { holder:text("ALEX MORGAN"), lastFour:text("1327"), label:text("Everyday card"), frozen:toggle(false) }, v=><div className="w-full max-w-sm"><PaymentCard {...v}/></div>), source:"finance" },
  "presence-stack": { ...define("Presence Stack", { count:number(5,0,7,1), max:number(4,1,6,1), animate:toggle(true) }, v=><PresenceStack people={ROOM_PEOPLE.slice(0,v.count)} selfId="you" max={v.max} animate={v.animate} />), source:"presence" },
  "presence-badge": { ...define("Presence Badge", { status:select(["online","away","typing"],"typing"), animate:toggle(true) }, v=><div className="flex items-center gap-3 text-sm"><PresenceBadge {...v} /><span>{v.status}</span></div>), source:"presence" },
  "release-entry": define("Release Entry", { title:text("Brand Guide"), description:text("A practical toolkit for colours, typography and signatures."), kind:select(["Added","Updated","Fixed","Breaking"],"Added") }, v=><div className="w-full max-w-lg"><ReleaseEntry {...v} href="/brand-guide" sourceHref="https://github.com/oreo-design/oreo-ui/pull/43" sourceLabel="PR #43" /></div>),
  "upgrade-prompt": define("Upgrade Prompt", { prompt:text("Review Oreo UI PR #43 and the components used in my project. Preserve local customizations and propose only relevant changes. https://github.com/oreo-design/oreo-ui/pull/43") }, v=><div className="w-full max-w-lg"><UpgradePrompt {...v} /></div>),
  "brand-swatch": define("Brand Swatch", { name:text("Iris"), hex:select(["#6550b9","#027864","#202020","#ffffff"],"#6550b9"), role:text("Accent colour"), disabled:toggle() }, v=><div className="w-full max-w-xs"><BrandSwatch {...v} onCopy={hex=>navigator.clipboard.writeText(hex).catch(()=>window.prompt("Copy this colour",hex))}/></div>),
  "type-scale": define("Type Scale", { base:number(16,12,24,1), ratio:number(1.25,1.125,1.5,.025), sample:text("") }, v=><div className="w-full max-w-3xl"><TypeScale {...v}/></div>),
  "email-signature": define("Email Signature", { name:text(SAMPLE_SIGNATURE.name), role:text(SAMPLE_SIGNATURE.role), email:text(SAMPLE_SIGNATURE.email), phone:text(""), website:text("example.com"), company:text("Oreo Studio") }, v=><div className="w-full max-w-md rounded-card-medium border border-border-subtle bg-bg-elevated p-6"><EmailSignature data={v}/></div>),
  "project-summary": define("Project Summary", { title:text("Website redesign"), description:text("A clearer story, from first visit to first customer."), completed:number(3,0,18,1), total:number(12,0,18,1), status:select(["On track","At risk","Planning"],"On track"), due:text("Oct 30") }, v=><div className="w-full max-w-md"><ProjectSummary {...v} people={[{name:"Alex Morgan",color:"purple"},{name:"Sam Chen",color:"pink"},{name:"Jules Carter",color:"blue"},{name:"Maya Wilson",color:"mint"}]}/></div>),
  "task-row": define("Task Row", { title:text("Finalize navigation"), status:select(["backlog","todo","progress","review","done"],"progress"), priority:select(["Low","Medium","High"],"High"), overdue:toggle(), disabled:toggle() }, (v,set)=><div className="w-full rounded-card-medium border border-border-subtle"><TaskRow {...v} id="WEB-102" project="Website redesign" due="Today" person={{name:"Alex Morgan",color:"purple"}} onOpen={()=>window.location.assign("/project-workspace")} onComplete={done=>set("status",done?"done":"todo")}/></div>),
  "tree-stepper": define("Tree Stepper", { value: select(getTreeSteps(REVIEW_TREE).map(s=>s.node.id),"suspicious"), disabled: toggle(), empty: toggle(), attention: toggle() }, (v,set)=><div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-4"><TreeStepper nodes={v.empty?[]:REVIEW_TREE} value={v.value} onValueChange={value=>{if(value==="desktop"||value==="editor"||value==="terminal"||value==="custom") set("value",value);}} completed={["devices","ownership","overview"]} attention={v.attention?["overview"]:[]} disabled={v.disabled}/></div>),
  "step-progress": define("Step Progress", { completed:number(3,0,18,1), total:number(18,0,18,1), label:text("Review progress") }, v=><div className="w-full max-w-sm"><StepProgress {...v}/></div>),
  "timeframe-selector": define("Timeframe Selector", { value: select(["1h","4h","24h","3d","1w"],"24h"), disabled: toggle() }, (v,set) => <TimeframeSelector {...v} onValueChange={value=>set("value",value as typeof v.value)} />),
  "inline-search-select": define("Inline Search Select", { value: select(["eth","btc","bnb","sol","avax"],"eth"), disabled: toggle(), loading: toggle(), error: toggle() }, (v,set) => <div className="w-48"><InlineSearchSelect options={SAMPLE_ASSETS} label="Token" value={v.value} disabled={v.disabled} loading={v.loading} error={v.error?"The sample catalog is unavailable.":undefined} onRetry={()=>set("error",false)} onValueChange={value=>set("value",value as typeof v.value)} /></div>),
  "studio-inbox-components": define("Inbox Notification", { selected: toggle(true), unread: toggle(true), preview: text(NOTIFICATIONS[0].preview) }, (v,set) => <div className="w-full max-w-md rounded-card-medium border border-border-subtle bg-bg-base p-2"><InboxNotification item={{...NOTIFICATIONS[0], unread:v.unread, preview:v.preview}} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),
  "edge-monitor": define("Region Traffic Map", { selected: select(REGIONS.map(r=>r.id), "sin1"), empty: toggle() }, (v,set) => <div className="w-full max-w-3xl rounded-card-medium border border-border-subtle bg-bg-elevated"><RegionTrafficMap regions={v.empty?[]:REGIONS} selected={v.selected} onSelect={id=>set("selected",id)}/></div>),
  switch: define("Switch", { checked: toggle(false), variant: select(["default", "stretch"], "stretch"), disabled: toggle(), readOnly: toggle() }, (v,set) => <Switch aria-label="Stretch motion" checked={v.checked} onCheckedChange={checked=>set("checked",checked)} variant={v.variant} disabled={v.disabled} readOnly={v.readOnly} />),
  "toggle-composer": define("Toggle Composer", { mode: select(["quick", "long"], "quick"), surface: select(["solid", "frosted"], "solid"), quick: text("A thought worth sharing."), headline: text("A longer story"), intro: text("Start with a little context."), body: text("Make room for the details."), disabled: toggle() }, (v,set) => <div className="w-full max-w-lg"><ToggleComposer mode={v.mode as ComposerMode} onModeChange={mode=>set("mode",mode)} surface={v.surface} disabled={v.disabled} value={{...EMPTY_COMPOSER,quick:v.quick,headline:v.headline,intro:v.intro,body:v.body}} onValueChange={value=>{for (const key of Object.keys(EMPTY_COMPOSER) as (keyof typeof EMPTY_COMPOSER)[]) set(key,value[key]);}} /></div>),
  "canvas-toolbar": define("Canvas Toolbar", { zoom: number(95,10,200,5), mode: select(["pan","select"],"select"), disabled: toggle() }, (v,set) => <CanvasToolbar zoom={v.zoom} onZoomChange={zoom=>set("zoom",zoom)} mode={v.mode as CanvasMode} onModeChange={mode=>set("mode",mode)} disabled={v.disabled} onFit={()=>set("zoom",95)} />),
  "text-toolbar": define("Text Toolbar", { bold: toggle(), italic: toggle(), underline: toggle(), strikethrough: toggle(), code: toggle(), highlight: toggle(), color: select(["ink","mint","pink","blue","purple","orange","brown"],"ink"), font: select(["sans","serif","hand","mono"],"hand"), size: number(22,12,72,1), align: select(["left","center","right"],"center"), disabled: toggle() }, (v,set) => <TextToolbar disabled={v.disabled} value={{...DEFAULT_TEXT_FORMAT,...v,color:v.color as TextColor,font:v.font as TextFont,align:v.align as TextAlignment}} onValueChange={value=>{for(const key of Object.keys(DEFAULT_TEXT_FORMAT) as (keyof typeof DEFAULT_TEXT_FORMAT)[]) set(key,value[key]);}} />),
  "meeting-components": { ...define("Multi-select Menu", { label: text("Event category"), heading: text("Meeting category"), disabled: toggle(), empty: toggle(), selected: text("review,brainstorm,interview") }, (v,set) => <div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-3"><MultiSelectMenu label={v.label} heading={v.heading} disabled={v.disabled} options={v.empty ? [] : meetingCategories} value={v.selected.split(",").map(id=>id.trim()).filter(Boolean)} onValueChange={value=>set("selected",value.join(","))} /></div>), source: "multi-select-menu" },
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

playgrounds["studio-inbox-components"].source = "studio-inbox";
