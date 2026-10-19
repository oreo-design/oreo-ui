import { AuroraAccordion, AuroraSurface, AURORA_QUESTIONS } from "@/components/aurora-accordion";
import { OutlineWordmark, PathGlyph, FooterLinkGroups, OREO_WORDMARK, STUDIO_WORDMARK, FOOTER_LINK_GROUPS } from "@/components/outline-wordmark";
import { BreakoutNavigator, DestinationProgress, RecoveryMessage, BREAKOUT_DESTINATIONS } from "@/components/breakout-navigation";
import { AgentTaskQueue, QueueTaskRow, TaskClarification, QueuedRequestStack } from "@/components/agent-task-queue";
import { QUEUE_TASKS, QUEUE_QUESTIONS } from "@/patterns/agent-task-queue/data";
import { LinkedDocumentRow, LinkedDocumentsList, LinkedDocumentsSelector, LinkedDocumentDetails } from "@/components/linked-documents";
import { SAMPLE_DOCUMENTS } from "@/patterns/unlink-documents/data";
import { AgentLanes, AgentLaneIdentity, AgentTaskBar, AgentTimelineAxis } from "@/components/agent-lanes";
import { LANE_AGENTS, LANE_TASKS } from "@/patterns/agent-lanes/data";
import {AdaptiveIssueTable,AdaptiveIssueRow,PullRequestPill,ResizeFrame} from "@/components/adaptive-issues";
import {ADAPTIVE_ISSUES} from "@/patterns/adaptive-issues/data";
import {TestResults,TestRunSummary,TestResultFilters,TestFileGroup,TestFailureDetail,TestStackTrace} from "@/components/test-results";
import {SAMPLE_TESTS as RESULT_TESTS,COMPLETED_RUN as RESULT_RUN} from "@/patterns/test-workspace/data";
import { DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar, type FilterValues } from "@/components/data-operations";
import { WorkflowStatusBadge, WorkflowRunBars, WorkflowTable, workflowRows } from "@/components/workflow-table";
import { WORKFLOWS, SORT_OPTIONS, workflowFilterGroups, FOLDERS } from "@/patterns/workflow-directory/data";
import { BranchHistory, MergeStatusBadge, MergeChecks, ChangeSummary, PullRequestCard, initialMergeRun } from "@/components/merge-review";
import { COMMITS as MERGE_COMMITS, MERGE_TITLE, SAMPLE_DIFF as MERGE_DIFF, commitsFor, checksFor } from "@/patterns/merge-workspace/data";
import {TaskScheduleChip,TaskCalendar,TaskTimeline} from "@/components/task-schedule";
import {INITIAL_TASKS as SCHEDULE_TASKS,PROJECTS as SCHEDULE_PROJECTS,PEOPLE as SCHEDULE_PEOPLE} from "@/patterns/project-workspace/data";
import {MonitorReveal} from "@/components/monitor-reveal";
import {SegmentRuleBuilder,SegmentPreview,SubscriptionPlanPicker,RevenueTargetEditor,segmentFields} from "@/components/subscription-operations";
import {CUSTOMERS as SUB_CUSTOMERS,PLANS as SUB_PLANS,LEGS as SUB_LEGS,INITIAL_SEGMENT as SUB_SEGMENT,TODAY as SUB_TODAY} from "@/patterns/subscription-workspace/data";
import {IssueRow,IssueQueue,IssueReader} from "@/components/issue-browser";
import {SAMPLE_ISSUES} from "@/patterns/issue-browser/data";
import {TaskProperties,TaskSubtasks,TaskDetailPanel,type TaskDetails} from "@/components/task-editor";
import {CAMPAIGN_TASKS,TASK_PEOPLE} from "@/patterns/task-board/data";
import {AnnotatedWaveform,ProductionTaskList,MixVersionList,toggleTask,type ProductionTask} from "@/components/music-project";
import {MIX_SAMPLES,MIX_COMMENTS,MIX_TASKS,MIX_VERSIONS} from "@/patterns/music-project/data";
import {VoiceSignal,VoiceLatencyBreakdown,TurnLatencyHistory} from "@/components/voice-telemetry";
import {VOICE_TURNS} from "@/patterns/voice-agent/data";
import {BudgetCapControl,BudgetOutcome,MonthlyBudgetCard} from "@/components/agent-budget";
import {DEMO_BUDGET} from "@/patterns/agent-budget";
import {StorageUsageCard,StorageModuleTable,RetentionPolicyRow} from "@/components/storage-management";
import {initialStorage} from "@/patterns/storage-manager/data";
import {DashboardStatCard,ComparisonBarChart,TrendAreaChart,ChannelBreakdown} from "@/components/dashboard-suite";
import {DEMO_POINTS} from "@/patterns/dashboard-suite/data";
import {SkeletonReveal,BalanceSparkBars,FinanceAttentionList,BankAccountList} from "@/components/finance-overview";
import {SAMPLE_ACCOUNTS as FINANCE_ACCOUNTS,SAMPLE_NOTICES as FINANCE_NOTICES} from "@/patterns/finance-overview/data";
import {AgentRunCard,AgentRunActivity,AgentInboxBoard} from "@/components/agent-inbox";
import {INITIAL_RUNS as INBOX_RUNS} from "@/patterns/agent-inbox/data";
import {CalendarEventBlock,CalendarColorPicker,CalendarSourceList,CalendarWeekGrid,weekDates} from "@/components/color-calendar";
import {INITIAL_EVENTS as COLOR_EVENTS,INITIAL_SOURCES as COLOR_SOURCES} from "@/patterns/color-calendar/data";
import {CurrencyBalanceCard,CurrencyBalanceSummary,MoneyActivityList,CashFlowBars,cashFlowDays} from "@/components/currency-finance";
import {INITIAL_WALLET} from "@/patterns/cross-currency/data";
import {StayPriceLabel,StayResultCard,StaySelectionCard,distanceKm} from "@/components/stay-results";
import {STAYS,LANDMARKS} from "@/patterns/landmark-stays/data";
import {PixelMeter,InferenceChart,RegionalTraffic,AgentHealthTable} from "@/components/agent-observability";
import {AGENTS as OBSERVATORY_AGENTS,trafficRegions,inferenceSeries} from "@/patterns/agent-observatory/data";
import { RouteJobCard, AllocationTimeline } from "@/components/dispatch-allocation";
import { RESOURCES, SAMPLE_JOBS, DEMO_DATE } from "@/patterns/dispatch-allocation/data";
import {FolderEmptyState,FolderCollection} from "@/components/writing-folders";
import {SAMPLE_FOLDER_ROWS} from "@/patterns/writing-folders/data";
import {PerformanceScore,ReviewProgress,MemberPerformanceTable} from "@/components/team-performance";
import {PERFORMANCE_MEMBERS} from "@/patterns/team-performance/data";
import {ChainTokenBadge,TokenAmountPanel,ChainTokenPicker} from "@/components/token-bridge";
import {BRIDGE_CHAINS,BRIDGE_TOKENS} from "@/patterns/token-bridge/data";
import {AgentMentionComposer,AgentSessionCard,type HandoffStatus} from "@/components/agent-handoff";
import {HANDOFF_AGENTS} from "@/patterns/engineering-handoff/data";
import { CompanyIdentity, CompanyTable, companyRows, type CompanySort } from "@/components/company";
import { COMPANIES } from "@/patterns/company-directory/data";
import { ActivityEventRow, GroupedActivityFeed } from "@/components/project-activity";
import { FEED_EVENTS, FEED_NOW } from "@/patterns/project-feed/data";
import { WeeklyHeatmap, AgentRunsCard, type RunMetric } from "@/components/agent-runs";
import { selectedWeek } from "@/patterns/agent-runs/data";
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
import { RegionTrafficMap,RegionSpotlight,IncidentRecommendation } from "@/components/edge-monitor";
import { REGIONS, latencySamples } from "@/patterns/edge-observatory/data";
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
 "aurora-accordion": {AuroraAccordion,AuroraSurface},
 "outline-wordmark": {OutlineWordmark,PathGlyph,FooterLinkGroups},
 "breakout-navigation": {BreakoutNavigator,DestinationProgress,RecoveryMessage},
 "agent-task-queue": {AgentTaskQueue,QueueTaskRow,TaskClarification,QueuedRequestStack},
 "linked-documents": {LinkedDocumentRow,LinkedDocumentsList,LinkedDocumentsSelector,LinkedDocumentDetails},
 "agent-lanes": {AgentLanes,AgentLaneIdentity,AgentTaskBar,AgentTimelineAxis},
 "adaptive-issues": {AdaptiveIssueTable,AdaptiveIssueRow,PullRequestPill,ResizeFrame},
 "data-operations": { DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar },
 "workflow-table": { WorkflowStatusBadge, WorkflowRunBars, WorkflowTable },
 "test-results": {TestResults,TestRunSummary,TestResultFilters,TestFileGroup,TestFailureDetail,TestStackTrace},
 "merge-review": { BranchHistory, MergeStatusBadge, MergeChecks, ChangeSummary, PullRequestCard },
 "subscription-operations":{SegmentRuleBuilder,SegmentPreview,SubscriptionPlanPicker,RevenueTargetEditor},
 "issue-browser":{IssueRow,IssueQueue,IssueReader},
 "task-editor":{TaskProperties,TaskSubtasks,TaskDetailPanel},
 "music-project":{AnnotatedWaveform,ProductionTaskList,MixVersionList},
 "voice-telemetry":{VoiceSignal,VoiceLatencyBreakdown,TurnLatencyHistory},
 "agent-budget":{BudgetCapControl,BudgetOutcome,MonthlyBudgetCard},
 "storage-management":{StorageUsageCard,StorageModuleTable,RetentionPolicyRow},
 "dashboard-suite":{DashboardStatCard,ComparisonBarChart,TrendAreaChart,ChannelBreakdown},
 "finance-overview":{SkeletonReveal,BalanceSparkBars,FinanceAttentionList,BankAccountList},
 "agent-inbox":{AgentRunCard,AgentRunActivity,AgentInboxBoard},
 "color-calendar":{CalendarEventBlock,CalendarColorPicker,CalendarSourceList,CalendarWeekGrid},
 "agent-observability": {PixelMeter,InferenceChart,RegionalTraffic,AgentHealthTable},
 "dispatch-allocation": {RouteJobCard,AllocationTimeline},
  "writing-folders": {FolderEmptyState,FolderCollection},
  "team-performance": {PerformanceScore,ReviewProgress,MemberPerformanceTable},
  "token-bridge": {ChainTokenBadge,TokenAmountPanel,ChainTokenPicker},
  "agent-handoff": {AgentMentionComposer,AgentSessionCard},
  company: {CompanyIdentity,CompanyTable},
  "project-activity": {ActivityEventRow,GroupedActivityFeed},
  "agent-runs": {WeeklyHeatmap,AgentRunsCard},
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
  "currency-finance": { CurrencyBalanceCard, CurrencyBalanceSummary, MoneyActivityList, CashFlowBars },
  "stay-results": { StayPriceLabel, StayResultCard, StaySelectionCard },
  "place-map": { PlaceMap, PlaceDetailCard, MapStylePicker },
  "agent-connect": { AgentConnectCard, QuotaUsage, AgentClientPicker },
  finance: { BalanceChart, AllocationBar, SpendingGauge, PaymentCard },
  presence: { PresenceStack, PresenceBadge },
  "release-entry": { ReleaseEntry }, "upgrade-prompt": { UpgradePrompt },
  "brand-swatch": { BrandSwatch }, "type-scale": { TypeScale }, "email-signature": { EmailSignature },
  "project-summary": { ProjectSummary },
  "task-schedule":{TaskScheduleChip,TaskCalendar,TaskTimeline},
  "task-row": { TaskRow },
  "tree-stepper": { TreeStepper },
  "step-progress": { StepProgress },
  "timeframe-selector": { TimeframeSelector },
  "inline-search-select": { InlineSearchSelect },
  "studio-inbox": { InboxNotification },
  "monitor-reveal":{MonitorReveal},
  "edge-monitor": { RegionTrafficMap,RegionSpotlight,IncidentRecommendation },
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

function parseFilters(raw: string): FilterValues { try { const value = JSON.parse(raw); return value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].every(v => typeof v === "string"))) : {}; } catch { return {}; } }
function linkedDocumentPlayground(selector = false): PlaygroundSpec {
  return {...define(selector ? "Linked Documents Selector" : "Linked Documents", {
    scenario:select(["ready","loading","error","empty"],"ready"),selected:text("statement"),unlinked:text("")
  },(v,set)=>{
    const removed=v.unlinked.split(",").filter(Boolean), documents=SAMPLE_DOCUMENTS.filter(document=>!removed.includes(document.id));
    const Component=selector?LinkedDocumentsSelector:LinkedDocumentsList;
    return <div className="w-full max-w-md p-4"><Component documents={v.scenario==="empty"?[]:documents} selectedId={v.selected}
      onSelect={id=>set("selected",id)} onUnlink={id=>{set("unlinked",[...removed,id].join(","));if(v.selected===id){const i=documents.findIndex(d=>d.id===id),remaining=documents.filter(d=>d.id!==id);set("selected",remaining[Math.min(i,remaining.length-1)]?.id??"");}}}
      loading={v.scenario==="loading"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}
      footer={<><span>Original files are kept</span><Button type="tertiary" size="sm" onClick={()=>{if(removed.length){set("unlinked",removed.slice(0,-1).join(","));if(!v.selected)set("selected",removed.at(-1)!);}else{set("selected","statement");set("unlinked","");set("scenario","ready");}}}>{removed.length?"Undo unlink":"Reset"}</Button></>}/></div>;
  }),source:"linked-documents"};
}
function queueAnswers(raw:string):Record<string,string>{try{const value=JSON.parse(raw);return value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).filter((entry):entry is [string,string]=>typeof entry[1]==="string")):{};}catch{return {};}}
export const playgrounds: Record<string, PlaygroundSpec> = {
 "aurora-accordion": {...define("Aurora Accordion",{tone:select(["spectrum","mint","neutral"],"spectrum"),animated:toggle(true),disabled:toggle(false),empty:toggle(false),label:text("Frequently asked questions")},v=><div className="w-full p-8"><AuroraAccordion items={v.empty?[]:AURORA_QUESTIONS} tone={v.tone} animated={v.animated} disabled={v.disabled} label={v.label}/></div>),source:"aurora-accordion"},
 "aurora-surface": {...define("Aurora Surface",{active:toggle(true),tone:select(["spectrum","mint","neutral"],"spectrum"),animated:toggle(true),title:text("A little atmosphere"),description:text("Soft color. Quiet detail.")},v=><div className="w-full p-8"><AuroraSurface active={v.active} tone={v.tone} animated={v.animated} className="mx-auto max-w-sm p-6"><h3 className="font-medium">{v.title}</h3><p className="mt-2 text-sm text-text-secondary">{v.description}</p></AuroraSurface></div>),source:"aurora-accordion"},
 "outline-wordmark": {...define("Outline Wordmark",{artwork:select(["oreo","studio"],"oreo"),accent:select(["amber","mint","neutral"],"amber"),nodes:toggle(true),animated:toggle(true),release:number(700,0,1500,50),revealed:toggle(false),empty:toggle(false),resetKey:number(0,0,99,1)},v=><div className="w-full p-8"><OutlineWordmark glyphs={v.empty?[]:v.artwork==="oreo"?OREO_WORDMARK:STUDIO_WORDMARK} label={v.artwork} accent={v.accent} nodes={v.nodes} animated={v.animated} release={v.release} revealed={v.revealed} resetKey={v.resetKey}/></div>),source:"outline-wordmark"},
 "path-glyph": {...define("Path Glyph",{active:toggle(false),nodes:toggle(true),accent:select(["amber","mint","neutral"],"amber"),animated:toggle(true),release:number(700,0,1500,50)},v=><div className="w-56 p-8"><PathGlyph active={v.active} nodes={v.nodes} accent={v.accent} animated={v.animated} release={v.release}/></div>),source:"outline-wordmark"},
 "footer-link-groups": {...define("Footer Link Groups",{compact:toggle(false),groups:number(2,0,2,1),label:text("Footer navigation")},v=><div className="w-full p-8"><FooterLinkGroups groups={FOOTER_LINK_GROUPS.slice(0,v.groups)} compact={v.compact} label={v.label}/></div>),source:"outline-wordmark"},
 "breakout-navigator":{...define("Breakout Navigator",{goal:number(8,1,12,1),speed:select(["calm","brisk"],"calm"),trail:toggle(true),count:number(6,0,6,1),resetKey:number(0,0,99,1)},v=><div className="w-full p-5"><BreakoutNavigator destinations={BREAKOUT_DESTINATIONS.slice(0,v.count)} goal={v.goal} speed={v.speed} trail={v.trail} resetKey={v.resetKey}/></div>),source:"breakout-navigation"},
 "destination-progress":{...define("Destination Progress",{hits:number(3,0,8,1),goal:number(8,1,12,1),compact:toggle(false),count:number(6,0,6,1)},v=><div className="w-full max-w-md p-6"><DestinationProgress destinations={BREAKOUT_DESTINATIONS.slice(0,v.count)} hits={Object.fromEntries(BREAKOUT_DESTINATIONS.map(d=>[d.id,v.hits]))} goal={v.goal} compact={v.compact}/></div>),source:"breakout-navigation"},
 "recovery-message":{...define("Recovery Message",{title:text("Breakout of the 404 maze"),description:text("This page is missing. Take a detour, or go straight to"),linkLabel:text("components"),eyebrow:text("404 · PAGE NOT FOUND")},v=><div className="w-full p-8"><RecoveryMessage title={v.title} description={v.description} href="/button" linkLabel={v.linkLabel} eyebrow={v.eyebrow}/></div>),source:"breakout-navigation"},
 "queue-task-row":{...define("Queue Task Row",{title:text(QUEUE_TASKS[0].title),status:select(["queued","running","paused","needs-context","done"],"running"),expanded:toggle(false),suspended:toggle(false),removed:toggle(false)},(v,set)=><div className="w-full max-w-xl p-6">{v.removed?<Button type="secondary" onClick={()=>set("removed",false)}>Undo removal</Button>:<QueueTaskRow task={{...QUEUE_TASKS[0],title:v.title,status:v.status}} expanded={v.expanded} suspended={v.suspended} onToggle={()=>set("expanded",!v.expanded)} onPause={()=>set("status","paused")} onResume={()=>set("status","queued")} onRemove={()=>set("removed",true)}><p className="text-sm text-text-secondary">Context is supplied by the host application.</p></QueueTaskRow>}</div>),source:"agent-task-queue"},
 "queued-request-stack":{...define("Queued Request Stack",{expanded:toggle(false),count:number(5,0,5,1)},(v,set)=><div className="w-full max-w-lg p-6"><QueuedRequestStack requests={QUEUE_TASKS.slice(0,v.count)} expanded={v.expanded} onExpandedChange={value=>set("expanded",value)}/></div>),source:"agent-task-queue"},
 "task-clarification":{...define("Task Clarification",{step:number(0,0,2,1),answers:text("{}",true),pending:toggle(false),error:text(""),saved:toggle(false)},(v,set)=><div className="w-full max-w-md p-6"><TaskClarification questions={QUEUE_QUESTIONS} answers={queueAnswers(v.answers)} step={v.step} onChange={answers=>{set("answers",JSON.stringify(answers));set("saved",false);}} onStepChange={step=>set("step",step)} onSubmit={()=>set("saved",true)} pending={v.pending} error={v.error}/>{v.saved&&<p role="status" className="text-sm mt-3">Answers saved in this local preview.</p>}</div>),source:"agent-task-queue"},
 "agent-task-queue":{...define("Agent Task Queue",{scenario:select(["ready","loading","refreshing","empty","error"],"ready"),active:text("height"),expanded:text(""),order:text(QUEUE_TASKS.map(t=>t.id).join(",")),paused:text("later"),removed:text(""),needsContext:toggle(true),suspended:toggle(false)},(v,set)=>{const ids=[...new Set([...v.order.split(","),...QUEUE_TASKS.map(t=>t.id)])],tasks=ids.flatMap(id=>{const task=QUEUE_TASKS.find(t=>t.id===id);return task&&!v.removed.split(",").includes(id)?[{...task,status:v.active===id?"running" as const:v.paused.split(",").includes(id)?"paused" as const:id==="gradient"&&v.needsContext?"needs-context" as const:"queued" as const}]:[];});return <div className="w-full max-w-xl p-6"><AgentTaskQueue tasks={v.scenario==="empty"||v.scenario==="loading"?[]:tasks} expandedId={v.expanded} onExpand={id=>set("expanded",id??"")} onMove={(id,over)=>{const next=[...ids],from=next.indexOf(id),to=next.indexOf(over);next.splice(from,1);next.splice(to,0,id);set("order",next.join(","));}} onPause={id=>{set("paused",[...v.paused.split(","),id].join(","));if(v.active===id)set("active","");}} onResume={id=>set("paused",v.paused.split(",").filter(item=>item!==id).join(","))} onRemove={id=>set("removed",[...v.removed.split(","),id].join(","))} suspended={v.suspended} loading={v.scenario==="loading"||v.scenario==="refreshing"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")} onReset={()=>{set("removed","");set("scenario","ready");}} renderDetail={task=><p className="text-sm text-text-secondary">{task.context}</p>}/></div>;}),source:"agent-task-queue"},
 "linked-document-row":{...define("Linked Document Row",{name:text("Bank-Statement_1026.pdf"),selected:toggle(true),unlinked:toggle(false)},(v,set)=><div className="w-full max-w-md p-4">{v.unlinked?<div role="status" className="flex items-center justify-between gap-3 text-sm"><span>Document unlinked.</span><Button type="secondary" size="sm" onClick={()=>set("unlinked",false)}>Undo unlink</Button></div>:<LinkedDocumentRow document={{...SAMPLE_DOCUMENTS[0],name:v.name}} index={0} selected={v.selected} onSelect={()=>set("selected",true)} onUnlink={()=>set("unlinked",true)}/>}</div>),source:"linked-documents"},
 "linked-document-details":{...define("Linked Document Details",{name:text("Bank-Statement_1026.pdf")},v=><div className="w-full max-w-sm p-6"><LinkedDocumentDetails document={{...SAMPLE_DOCUMENTS[0],name:v.name}}/></div>),source:"linked-documents"},
 "linked-documents":linkedDocumentPlayground(),
 "linked-documents-selector":linkedDocumentPlayground(true),
 "agent-lane-identity":{...define("Agent Lane Identity",{name:text("Researcher"),model:text("Research model"),status:select(["running","waiting","idle"],"running")},v=><div className="p-6"><AgentLaneIdentity agent={{id:"research",name:v.name,model:v.model}} status={v.status}/></div>),source:"agent-lanes"},
 "agent-task-bar":{...define("Agent Task Bar",{status:select(["running","waiting","done","failed"],"running"),selected:toggle(false),title:text("Customer interviews")},(v,set)=><div className="w-full max-w-lg p-6"><AgentTaskBar task={{...LANE_TASKS[1],title:v.title,status:v.status}} now={0} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"agent-lanes"},
 "agent-timeline-axis":{...define("Agent Timeline Axis",{minutes:number(30,5,120,5)},v=><div className="w-full pt-12 pr-8"><AgentTimelineAxis minutes={v.minutes}/></div>),source:"agent-lanes"},
 "agent-lanes":{...define("Agent Lanes",{scenario:select(["ready","loading","refreshing","empty","error"],"ready"),minutes:number(30,15,60,15),now:number(0,0,15,1),selected:text("")},(v,set)=><div className="w-full p-4"><AgentLanes agents={LANE_AGENTS} tasks={v.scenario==="empty"||v.scenario==="loading"?[]:LANE_TASKS} now={v.now} minutes={v.minutes} selectedId={v.selected} onSelect={id=>set("selected",id)} loading={v.scenario==="loading"||v.scenario==="refreshing"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}/></div>),source:"agent-lanes"},
 "pull-request-pill": {...define("Pull Request Pill",{state:select(["open","draft","closed","merged"],"open"),number:number(1184,1,99999,1)},v=><PullRequestPill number={v.number} state={v.state}/>),source:"adaptive-issues"},
 "adaptive-issue-row": {...define("Adaptive Issue Row",{width:number(840,320,1120,10),selected:toggle(false)},(v,set)=><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><div className="adapt-table"><ul className="adapt-rows"><AdaptiveIssueRow issue={ADAPTIVE_ISSUES[0]} selected={v.selected} onOpen={()=>set("selected",!v.selected)}/></ul></div></ResizeFrame>),source:"adaptive-issues"},
 "adaptive-issue-table": {...define("Adaptive Issue Table",{width:number(1120,320,1120,10),scenario:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-4"><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><AdaptiveIssueTable issues={v.scenario==="empty"||v.scenario==="loading"?[]:ADAPTIVE_ISSUES} loading={v.scenario==="loading"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}/></ResizeFrame></div>),source:"adaptive-issues"},
 "resize-frame": {...define("Resize Frame",{width:number(640,320,1120,10)},(v,set)=><div className="w-full p-4"><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><div className="rounded-xl border border-border-default p-8 text-sm">Drag the right edge, or focus it and use arrow keys. Requested width: {v.width}px.</div></ResizeFrame></div>),source:"adaptive-issues"},
 "test-results": {...define("Test Results",{scenario:select(["failed","passed","empty","error"],"failed")},v=><div className="w-full max-w-3xl p-4"><TestResults key={v.scenario} run={{...RESULT_RUN,phase:v.scenario==="error"?"error":"complete",error:"Sample runner disconnected.",tests:v.scenario==="empty"?[]:v.scenario==="passed"?RESULT_TESTS.map(t=>t.status==="failed"?{...t,status:"passed",failure:undefined}:t):RESULT_TESTS}}/></div>),source:"test-results"},
 "test-run-summary": {...define("Test Run Summary",{running:toggle(true)},v=><div className="w-full max-w-2xl p-4"><TestRunSummary run={{...RESULT_RUN,phase:v.running?"running":"complete",tests:v.running?RESULT_TESTS.map((t,i)=>i<8?t:{...t,status:i===8?"running":"queued",durationMs:undefined,failure:undefined}):RESULT_TESTS}}/></div>),source:"test-results"},
 "test-result-filters": {...define("Test Result Filters",{filter:select(["all","failed","skipped","slow"],"all")},(v,set)=><TestResultFilters tests={RESULT_TESTS} value={v.filter} onChange={next=>set("filter",next)}/>),source:"test-results"},
 "test-file-group": {...define("Test File Group",{open:toggle(true),filter:select(["all","failed","skipped","slow"],"all")},(v,set)=><div className="w-full max-w-3xl p-4"><TestFileGroup file={RESULT_TESTS[0].file} tests={RESULT_TESTS.slice(0,4)} filter={v.filter} open={v.open} onOpenChange={next=>set("open",next)}/></div>),source:"test-results"},
 "test-failure-detail": {...define("Test Failure Detail",{kind:select(["assertion","timeout"],"assertion")},v=><div className="w-full max-w-2xl p-4"><TestFailureDetail test={RESULT_TESTS.find(t=>t.failure?.kind===v.kind)!}/></div>),source:"test-results"},
 "test-stack-trace": {...define("Test Stack Trace",{framework:toggle(true)},v=><div className="w-full max-w-2xl p-4"><TestStackTrace frames={RESULT_TESTS[1].failure!.frames.filter(f=>v.framework||!f.framework)}/></div>),source:"test-results"},
 "data-filter-popover": {...define("Data Filter Popover", {selection:text("{}")}, (v,set)=><DataFilterPopover groups={workflowFilterGroups(WORKFLOWS)} value={parseFilters(v.selection)} onApply={next=>set("selection",JSON.stringify(next))} resultCount={draft=>workflowRows(WORKFLOWS,{filters:draft}).length}/>),source:"data-operations"},
 "data-sort-menu": {...define("Data Sort Menu", {field:select(["edited","name","runs","success","owner"],"edited"),direction:select(["asc","desc"],"desc")},(v,set)=><DataSortMenu options={SORT_OPTIONS} value={{key:v.field,direction:v.direction}} onChange={s=>{set("field",s.key as "edited" | "name" | "runs" | "success" | "owner");set("direction",s.direction);}}/>),source:"data-operations"},
 "row-action-menu": {...define("Row Action Menu", {lastAction:text("None")},(v,set)=><div className="flex items-center gap-4"><span className="text-sm text-text-secondary">Last action: {v.lastAction}</span><RowActionMenu label="Workflow actions" actions={[{id:"open",label:"Open workflow",icon:"columns"},{id:"duplicate",label:"Duplicate",icon:"copy"},{id:"move",label:"Move to folder",icon:"folder",children:FOLDERS.map(f=>({id:f,label:f,icon:"folder" as const}))},{id:"archive",label:"Archive",icon:"folder",danger:true,separatorBefore:true}]} onAction={id=>set("lastAction",id)}/></div>),source:"data-operations"},
 "bulk-action-bar": {...define("Bulk Action Bar", {count:number(3,0,15),notice:text("")},(v,set)=><div className="p-4"><BulkActionBar count={v.count} total={15} onSelectAll={()=>set("count",15)} onClear={()=>set("count",0)}><Button type="secondary" size="sm" onClick={()=>set("notice","Paused selected sample rows")}>Pause</Button><Button type="secondary" danger size="sm" onClick={()=>{set("count",0);set("notice","Archived selected sample rows");}}>Archive</Button></BulkActionBar><p role="status" className="mt-3 text-xs text-text-secondary">{v.notice}</p></div>),source:"data-operations"},
 "workflow-status-badge": {...define("Workflow Status Badge",{status:select(["Live","Degraded","Failing","Draft","Paused","Archived"],"Live")},v=><WorkflowStatusBadge status={v.status}/>),source:"workflow-table"},
 "workflow-run-bars": {...define("Workflow Run Bars",{total:number(4812,0,10000),failing:toggle(false)},v=><WorkflowRunBars values={[4,6,7,6,8,7,10]} total={v.total} failing={v.failing}/>),source:"workflow-table"},
 "workflow-table": {...define("Workflow Table",{state:select(["ready","loading","empty","error"],"ready"),selection:text("")},(v,set)=><div className="w-full p-4"><WorkflowTable rows={v.state==="ready"?WORKFLOWS.slice(0,5):[]} selected={v.selection.split(",").filter(Boolean)} onSelectionChange={ids=>set("selection",ids.join(","))} loading={v.state==="loading"} error={v.state==="error"?"Sample request failed.":undefined} onReset={()=>set("state","ready")}/></div>),source:"workflow-table"},
  "branch-history": {...define("Branch History", {empty:toggle(false),merged:toggle(false),selected:text("")}, (v,set)=><div className="w-full max-w-3xl p-4"><BranchHistory commits={v.empty?[]:MERGE_COMMITS} merged={v.merged} selectedId={v.selected} onSelect={commit=>set("selected",commit.id)}/></div>),source:"merge-review"},
  "merge-status-badge": {...define("Merge Status Badge", {phase:select(["creating","conflicts","resolving","checking","ready","merging","merged","error"],"conflicts"),number:number(128,1,9999),conflicts:number(3,0,99)},v=><MergeStatusBadge phase={v.phase} number={v.number} conflicts={v.conflicts}/>),source:"merge-review"},
  "merge-checks": {...define("Merge Checks", {phase:select(["checking","ready","error"],"ready")},v=><MergeChecks checks={checksFor({...initialMergeRun,phase:v.phase,checksPassed:v.phase==="ready"?4:1,resolved:3})}/>),source:"merge-review"},
  "change-summary": {...define("Change Summary", {additions:number(48,0,999),deletions:number(7,0,999),disclosure:toggle(true)},v=><div className="w-full max-w-2xl p-4"><ChangeSummary additions={v.additions} deletions={v.deletions}>{v.disclosure?<CodeDiff title="middleware.ts · sample excerpt" lines={MERGE_DIFF}/>:undefined}</ChangeSummary></div>),source:"merge-review"},
  "pull-request-card": {...define("Pull Request Card", {title:text(MERGE_TITLE),phase:select(["conflicts","creating","resolving","checking","ready","merging","merged","error"],"conflicts")},(v,set)=>{const run={...initialMergeRun,phase:v.phase,resolved:["checking","ready","merging","merged","error"].includes(v.phase)?3:0,checksPassed:["ready","merging","merged"].includes(v.phase)?4:v.phase==="error"?1:0};return <div className="w-full max-w-3xl p-4"><PullRequestCard title={v.title} number={128} phase={v.phase} commits={commitsFor(run)} checks={checksFor(run)} resolved={run.resolved} onResolve={()=>set("phase","ready")} onMerge={()=>set("phase","merged")} onRetry={()=>set("phase","ready")} onCancel={()=>set("phase","conflicts")}/></div>;}),source:"merge-review"},

 "segment-rule-builder":{...define("Segment Rule Builder",{mode:select(["all","any"],"all"),rules:text(JSON.stringify(SUB_SEGMENT.rules))},(v,set)=>{let rules:QueryCondition[];try{rules=JSON.parse(v.rules);if(!Array.isArray(rules)||rules.some(r=>typeof r.id!=="string"||typeof r.field!=="string"||typeof r.value!=="string"||typeof r.operator!=="string"))throw new Error();}catch{return <p role="alert">Enter an array of valid rule objects.</p>;}return <div className="w-full max-w-3xl p-4"><SegmentRuleBuilder fields={segmentFields(SUB_PLANS,SUB_LEGS)} rules={rules} mode={v.mode} onModeChange={mode=>set("mode",mode)} onRulesChange={rules=>set("rules",JSON.stringify(rules))}/></div>;}),source:"subscription-operations"},
 "segment-preview":{...define("Segment Preview",{mode:select(["all","any"],"all"),empty:toggle(false)},v=><div className="w-full max-w-3xl p-4"><SegmentPreview customers={v.empty?[]:SUB_CUSTOMERS} plans={SUB_PLANS} legs={SUB_LEGS} segment={{...SUB_SEGMENT,mode:v.mode}} today={SUB_TODAY}/></div>),source:"subscription-operations"},
 "subscription-plan-picker":{...define("Subscription Plan Picker",{plan:select(["essential","plus","family"],"plus"),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-4"><SubscriptionPlanPicker plans={SUB_PLANS} value={v.plan} onValueChange={plan=>set("plan",plan as "essential"|"plus"|"family")} disabled={v.disabled}/></div>),source:"subscription-operations"},
 "revenue-target-editor":{...define("Revenue Target Editor",{amount:text("1800"),month:text("2026-10"),split:toggle(true),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-4"><RevenueTargetEditor value={{amount:v.amount,month:v.month,split:v.split}} onChange={next=>{set("amount",next.amount);set("month",next.month);set("split",next.split);}} customers={v.empty?[]:SUB_CUSTOMERS} plans={SUB_PLANS} legs={SUB_LEGS} today={SUB_TODAY}/></div>),source:"subscription-operations"},
 "issue-row":{...define("Issue Row",{selected:toggle(true),state:select(["open","closed"],"open"),title:text(SAMPLE_ISSUES[0].title)},(v,set)=><div className="w-full max-w-2xl"><IssueRow issue={{...SAMPLE_ISSUES[0],title:v.title,state:v.state}} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"issue-browser"},
 "issue-queue":{...define("Issue Queue",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),selected:number(8428,8400,8500,1)},(v,set)=><div className="w-full max-w-2xl h-96"><IssueQueue issues={v.state==="ready"||v.state==="refreshing"?SAMPLE_ISSUES.slice(0,5):[]} selectedId={v.selected} onSelect={id=>set("selected",id)} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The sample request failed. Try again to restore the list.":undefined} onRetry={()=>set("state","ready")} filtered={v.state==="filtered"} onClear={()=>set("state","ready")}/></div>),source:"issue-browser"},
 "issue-reader":{...define("Issue Reader",{draft:text(""),open:toggle(true),posted:text("")},(v,set)=>v.open?<div className="w-full max-w-md h-[38rem]"><IssueReader issue={{...SAMPLE_ISSUES[0],comments:[...SAMPLE_ISSUES[0].comments,...(v.posted?[{id:"local",author:"You",body:v.posted,date:"Just now"}]:[])]}} draft={v.draft} onDraftChange={draft=>set("draft",draft)} onComment={()=>{set("posted",v.draft.trim());set("draft","");}} onClose={()=>set("open",false)}/></div>:<Button onClick={()=>set("open",true)} tapScale={1}>Open issue reader</Button>),source:"issue-browser"},
 "task-properties":{...define("Task Properties",{task:text(JSON.stringify(CAMPAIGN_TASKS[1]))},(v,set)=>{let task:TaskDetails;try{task=JSON.parse(v.task);if(!task||["id","title","status","priority","assigneeId","start","due","repeat","estimate","blockedBy"].some(k=>typeof task[k as keyof TaskDetails]!=="string")||!Array.isArray(task.labels)||task.labels.some((l:unknown)=>typeof l!=="string"))throw new Error();}catch{return <p role="alert">Enter a valid TaskDetails JSON object.</p>}return <div className="w-full max-w-md p-6"><TaskProperties task={task} people={TASK_PEOPLE} dependencies={CAMPAIGN_TASKS} onChange={patch=>set("task",JSON.stringify({...task,...patch}))}/></div>;}),source:"task-editor"},
 "task-subtasks":{...define("Task Subtasks",{items:text(JSON.stringify(CAMPAIGN_TASKS[4].subtasks))},(v,set)=>{let items;try{items=JSON.parse(v.items);if(!Array.isArray(items)||items.some(x=>typeof x.id!=="string"||typeof x.title!=="string"||typeof x.done!=="boolean"))throw new Error();}catch{return <p role="alert">Enter a valid Subtask array.</p>}return <div className="w-full max-w-md p-6"><TaskSubtasks items={items} onChange={next=>set("items",JSON.stringify(next))}/></div>;}),source:"task-editor"},
 "task-detail-panel":{...define("Task Detail Panel",{title:text("Paid social creatives"),complete:toggle(false),open:toggle(true)},(v,set)=>v.open?<div className="h-[32rem] w-full max-w-md"><TaskDetailPanel taskId="MKT-109" title={v.title} complete={v.complete} onComplete={()=>set("complete",!v.complete)} onClose={()=>set("open",false)}><p className="text-sm text-text-secondary">Compose task properties, checklists and discussions here.</p></TaskDetailPanel></div>:<Button type="secondary" onClick={()=>set("open",true)}>Open task details</Button>),source:"task-editor"},
 "annotated-waveform":{...define("Annotated Waveform",{position:number(84,0,238,1),markers:toggle(true),invalid:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-3xl p-6"><AnnotatedWaveform samples={v.invalid?[]:MIX_SAMPLES} duration={238} position={v.position} comments={v.markers?MIX_COMMENTS:[]} selectedId={v.selected} onSeek={n=>set("position",n)} onComment={id=>{set("selected",id);set("position",MIX_COMMENTS.find(c=>c.id===id)!.seconds);}}/></div>),source:"music-project"},
 "production-task-list":{...define("Production Task List",{completed:text("s1,s2,t6"),empty:toggle(false)},(v,set)=>{const ids=v.completed.split(",");const restore=(list:ProductionTask[]):ProductionTask[]=>list.map(t=>({...t,done:ids.includes(t.id),children:t.children?restore(t.children):undefined}));const list=restore(MIX_TASKS);return <div className="w-full max-w-3xl p-6"><ProductionTaskList tasks={v.empty?[]:list} onToggle={(id,done)=>{const updated=toggleTask(list,id,done);const collect=(ts:ProductionTask[]):string[]=>ts.flatMap(t=>t.children?.length?collect(t.children):t.done?[t.id]:[]);set("completed",collect(updated).join(","));}}/></div>;}),source:"music-project"},
 "mix-version-list":{...define("Mix Version List",{value:select(["v4","v3","v2","v1"],"v4"),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><MixVersionList versions={v.empty?[]:MIX_VERSIONS} value={v.value} onChange={id=>set("value",id as typeof v.value)}/></div>),source:"music-project"},
 "voice-signal":{...define("Voice Signal",{position:number(3800,0,8000,100),interrupted:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><VoiceSignal turn={VOICE_TURNS[11]} position={v.position} interrupted={v.interrupted} onSeek={n=>set("position",n)}/></div>),source:"voice-telemetry"},
 "voice-latency-breakdown":{...define("Voice Latency Breakdown",{budget:number(800,200,1200,100),invalid:toggle(false)},v=><div className="w-full max-w-2xl p-6"><VoiceLatencyBreakdown stages={v.invalid?[{id:"bad",label:"Invalid",ms:-1,tone:"neutral"}]:VOICE_TURNS[11].stages} budget={v.budget} turnLabel="turn 12"/></div>),source:"voice-telemetry"},
 "turn-latency-history":{...define("Turn Latency History",{selectedId:number(12,1,12,1),budget:number(800,200,1200,100),empty:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><TurnLatencyHistory turns={v.empty?[]:VOICE_TURNS} budget={v.budget} selectedId={v.selectedId} onSelect={n=>set("selectedId",n)}/></div>),source:"voice-telemetry"},
 "budget-cap-control":{...define("Budget Cap Control",{value:number(120000,64000,200000,1000),disabled:toggle(false)},(v,set)=><div className="w-full max-w-xl p-6"><BudgetCapControl value={v.value} spent={64000} planMax={200000} disabled={v.disabled} onChange={n=>set("value",n)}/></div>),source:"agent-budget"},
 "budget-outcome":{...define("Budget Outcome",{cap:number(120000,64000,200000,1000),dailySpend:number(4000,0,10000,1000),invalid:toggle(false)},v=><div className="w-full max-w-xl p-6"><BudgetOutcome budget={{...DEMO_BUDGET,cap:v.cap,dailySpend:v.dailySpend,costPerRun:v.invalid?0:25}}/></div>),source:"agent-budget"},
 "monthly-budget-card":{...define("Monthly Budget Card",{cap:number(120000,64000,200000,1000),saved:number(120000,64000,200000,1000),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><MonthlyBudgetCard budget={{...DEMO_BUDGET,cap:v.cap}} disabled={v.disabled} dirty={v.cap!==v.saved} onChange={n=>set("cap",n)} onSave={()=>set("saved",v.cap)} onCancel={()=>set("cap",v.saved)}/></div>),source:"agent-budget"},
 "storage-usage-card":{...define("Storage Usage Card",{capacity:number(20,1,100,1),recycled:number(0,0,10,.1)},v=><div className="w-full p-6"><StorageUsageCard modules={initialStorage.modules} capacity={v.capacity*1e9} recycledBytes={Math.round(v.recycled*1e9)}/></div>),source:"storage-management"},
 "storage-module-table":{...define("Storage Module Table",{empty:toggle(false),selected:text("")},(v,set)=><div className="w-full p-6"><StorageModuleTable modules={v.empty?[]:initialStorage.modules} totalUsed={18800000000} selected={v.selected?v.selected.split(","):[]} onSelectionChange={ids=>set("selected",ids.join(","))}/></div>),source:"storage-management"},
 "retention-policy-row":{...define("Retention Policy Row",{days:select(["7","30","90","180","365","0"],"30"),disabled:toggle(false)},(v,set)=><div className="w-full p-6"><RetentionPolicyRow title="Recycle bin retention" description="Keep deleted records recoverable." icon="trash" value={Number(v.days)} onChange={days=>set("days",String(days) as typeof v.days)} disabled={v.disabled}/></div>),source:"storage-management"},
 "dashboard-stat-card":{...define("Dashboard Stat Card",{variant:select(["footer","header","plain"],"header"),label:text("Total revenue"),value:text("$42,800"),change:number(12.4,-100,100,.1)},v=><div className="w-80"><DashboardStatCard {...v}/></div>),source:"dashboard-suite"},
 "comparison-bar-chart":{...define("Comparison Bar Chart",{mode:select(["stacked","grouped"],"stacked"),state:select(["ready","zero","empty","invalid"],"ready")},v=><div className="w-full p-6"><ComparisonBarChart mode={v.mode} series={["New","Returning"]} points={v.state==="empty"?[]:v.state==="invalid"?[{label:"Invalid",values:[-1,2]}]:v.state==="zero"?[{label:"Oct 16",values:[0,0]}]:DEMO_POINTS}/></div>),source:"dashboard-suite"},
 "trend-area-chart":{...define("Trend Area Chart",{state:select(["ready","single","zero","empty","invalid"],"ready")},v=><div className="w-full p-6"><TrendAreaChart points={v.state==="empty"?[]:v.state==="invalid"?[{label:"Invalid",values:[-1]}]:v.state==="zero"?[{label:"Oct 16",values:[0]}]:v.state==="single"?[{label:"Oct 16",values:[120]}]:DEMO_POINTS.map(p=>({...p,values:[p.values[0]+p.values[1]]}))}/></div>),source:"dashboard-suite"},
 "channel-breakdown":{...define("Channel Breakdown",{selected:text(""),empty:toggle(false)},(v,set)=><div className="w-80 p-4"><ChannelBreakdown channels={v.empty?[]:[{id:"organic",label:"Organic search",value:4200},{id:"direct",label:"Direct",value:2900},{id:"social",label:"Social",value:1600}]} selected={v.selected} onSelect={id=>set("selected",id)}/></div>),source:"dashboard-suite"},
 "skeleton-reveal":{...define("Skeleton Reveal",{loading:toggle(true),hasData:toggle(false),animate:toggle(true)},v=><div className="w-full p-6"><SkeletonReveal {...v} skeleton={<div className="h-24 rounded-card-small bg-state-hover"/>}><div className="flex h-24 items-center rounded-card-small border border-border-default p-5 text-sm">Your data is ready.</div></SkeletonReveal></div>),source:"finance-overview"},
 "balance-spark-bars":{...define("Balance Spark Bars",{state:select(["ready","zero","empty","invalid"],"ready")},v=><BalanceSparkBars values={v.state==="ready"?FINANCE_ACCOUNTS[0].history:v.state==="zero"?[0,0,0,0]:v.state==="invalid"?[-1,2]:[]} label="Sample balance in cents"/>),source:"finance-overview"},
 "finance-attention-list":{...define("Finance Attention List",{state:select(["ready","loading","refreshing","empty","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><FinanceAttentionList items={v.state==="ready"||v.state==="refreshing"?FINANCE_NOTICES:[]} loading={v.state==="loading"||v.state==="refreshing"} hasData={v.state==="ready"||v.state==="refreshing"} error={v.state==="error"?"The sample feed could not be loaded.":undefined} onRetry={()=>set("state","ready")} onOpen={item=>set("opened",item.title)}/>{v.opened&&<p role="status" className="mt-3 text-sm">Selected: {v.opened}. Open the template for full details.</p>}</div>),source:"finance-overview"},
 "bank-account-list":{...define("Bank Account List",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><BankAccountList accounts={v.state==="ready"||v.state==="refreshing"?FINANCE_ACCOUNTS:[]} loading={v.state==="loading"||v.state==="refreshing"} hasData={v.state==="ready"||v.state==="refreshing"} error={v.state==="error"?"The sample accounts could not be loaded.":undefined} onRetry={()=>set("state","ready")} onOpen={a=>set("opened",a.name)} onConnect={()=>set("opened","Connect requested. Open the template to add a sample account.")} filtered={v.state==="filtered"} onClear={()=>set("state","ready")}/>{v.opened&&<p role="status" className="mt-3 text-sm">{v.opened}</p>}</div>),source:"finance-overview"},
 "agent-run-card":{...define("Agent Run Card",{expanded:toggle(true),status:select(["waiting","failed","running","done"],"waiting")},(v,set)=><div className="w-full max-w-sm p-4"><AgentRunCard run={{...INBOX_RUNS[0],status:v.status}} expanded={v.expanded} onExpandedChange={open=>set("expanded",open)} onStatusChange={status=>set("status",status)}/></div>),source:"agent-inbox"},
 "agent-run-activity":{...define("Agent Run Activity",{empty:toggle(false)},v=><div className="w-full max-w-sm p-6"><AgentRunActivity model={INBOX_RUNS[0].model} items={v.empty?[]:INBOX_RUNS[0].activity}/></div>),source:"agent-inbox"},
 "agent-inbox-board":{...define("Agent Inbox Board",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),view:select(["board","list"],"board"),expanded:text(""),migration:{...select(["waiting","failed","running","done"],"waiting"),group:"Sample run status"},contacts:{...select(["waiting","failed","running","done"],"failed"),group:"Sample run status"},review:{...select(["waiting","failed","running","done"],"running"),group:"Sample run status"},release:{...select(["waiting","failed","running","done"],"running"),group:"Sample run status"},metrics:{...select(["waiting","failed","running","done"],"done"),group:"Sample run status"}},(v,set)=><div className="w-full p-4"><AgentInboxBoard runs={v.state==="ready"||v.state==="refreshing"?INBOX_RUNS.map(r=>({...r,status:v[r.id as "migration"]})):[]} view={v.view} onViewChange={view=>set("view",view)} expandedId={v.expanded} onExpandedChange={id=>set("expanded",id??"")} onStatusChange={(id,status)=>set(id as "migration",status)} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"Sample runs could not be loaded.":undefined} onRetry={()=>set("state","ready")} filtered={v.state==="filtered"} onClearFilters={()=>set("state","ready")}/></div>),source:"agent-inbox"},
 "calendar-event-block":{...define("Calendar Event Block",{selected:toggle(false),compact:toggle(false),color:select(["blue","mint","pink","purple","orange","brown","default"],"blue")},(v,set)=><div className="w-64 h-24"><CalendarEventBlock event={{...COLOR_EVENTS[0],color:v.color}} source={COLOR_SOURCES[2]} selected={v.selected} compact={v.compact} onOpen={()=>set("selected",!v.selected)}/></div>),source:"color-calendar"},
 "calendar-color-picker":{...define("Calendar Color Picker",{color:select(["blue","mint","pink","purple","orange","brown","default"],"blue"),disabled:toggle(false)},(v,set)=><CalendarColorPicker value={v.color} disabled={v.disabled} onChange={color=>{if(color)set("color",color);}}/>),source:"color-calendar"},
 "calendar-source-list":{...define("Calendar Source List",{work:toggle(true)},(v,set)=><div className="w-64"><CalendarSourceList sources={[{...COLOR_SOURCES[0],visible:v.work}]} onVisibilityChange={(_,visible)=>set("work",visible)}/></div>),source:"color-calendar"},
 "calendar-week-grid":{...define("Calendar Week Grid",{state:select(["ready","loading","empty","error"],"ready"),day:toggle(false)},(v,set)=><div className="w-full"><CalendarWeekGrid dates={v.day?["2026-10-19"]:weekDates("2026-10-19",5)} events={v.state==="ready"?COLOR_EVENTS:[]} sources={COLOR_SOURCES} loading={v.state==="loading"} error={v.state==="error"?"The demo calendar could not be loaded.":undefined} onRetry={()=>set("state","ready")} onEmptyAction={()=>set("state","ready")}/></div>),source:"color-calendar"},
 "pixel-meter": {...define("Pixel Meter",{value:number(92.6,0,150,.1),max:number(100,1,200,1),label:text("Success rate"),tone:select(["success","warning","neutral"],"success"),unknown:toggle(false)},v=><PixelMeter value={v.unknown?-1:v.value} max={v.max} label={v.label} tone={v.tone}/>),source:"agent-observability"},
 "inference-chart": {...define("Inference Chart",{state:select(["ready","loading","empty","error","zero"],"ready")},(v,set)=><div className="w-full max-w-2xl p-6"><InferenceChart points={v.state==="ready"?inferenceSeries(118629,"Last 30 days"):v.state==="zero"?inferenceSeries(0,"Last 30 days"):[]} loading={v.state==="loading"} error={v.state==="error"?"Sample telemetry could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-observability"},
 "regional-traffic": {...define("Regional Traffic",{region:select(["all","us-east","eu-central","ap-south"],"all"),state:select(["ready","empty","invalid"],"ready")},(v,set)=><div className="w-full max-w-xl p-6"><RegionalTraffic regions={v.state==="empty"?[]:trafficRegions(OBSERVATORY_AGENTS).map(r=>({...r,requests:v.state==="invalid"?-1:r.requests}))} value={v.region} onValueChange={id=>set("region",id as "all")}/></div>),source:"agent-observability"},
 "agent-health-table": {...define("Agent Health Table",{state:select(["ready","loading","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><AgentHealthTable agents={v.state==="ready"?OBSERVATORY_AGENTS:[]} loading={v.state==="loading"} filtered={v.state==="filtered"} error={v.state==="error"?"Sample agent health could not be loaded.":undefined} onReset={()=>set("state","ready")} onOpen={a=>set("opened",a.name)}/>{v.opened&&<p className="mt-4 text-sm" role="status">Selected {v.opened}. Open the template for full details.</p>}</div>),source:"agent-observability"},
 "route-job-card": {...define("Route Job Card", {category:select(["Private hire","Provisional","Contract"],"Private hire"), passengers:number(8,1,16)}, v=><div className="w-full max-w-sm p-4"><RouteJobCard job={{...SAMPLE_JOBS[0],category:v.category,passengers:v.passengers}}/></div>),source:"dispatch-allocation"},
 "allocation-timeline": {...define("Allocation Timeline", {view:select(["driver","vehicle"],"driver"),state:select(["ready","loading","empty","filtered","error"],"ready")}, (v,set)=><div className="w-full"><AllocationTimeline jobs={v.state==="empty"||v.state==="loading"?[]:SAMPLE_JOBS} resources={RESOURCES} date={DEMO_DATE} resourceView={v.view} query={v.state==="filtered"?"no-match":""} loading={v.state==="loading"} error={v.state==="error"?"Sample schedule could not be loaded.":undefined} onRetry={()=>set("state","ready")} onClearFilters={()=>set("state","ready")}/></div>),source:"dispatch-allocation"},
 "folder-empty-state": {...define("Folder Empty State",{title:text("It’s empty here"),description:text("Create a folder to start organizing your writing."),created:toggle(false)},(v,set)=><div className="w-full"><FolderEmptyState title={v.title} description={v.description} onCreate={()=>set("created",true)}/>{v.created&&<p role="status" className="px-6 text-sm">Creation requested. Open the template to create a folder.</p>}</div>),source:"writing-folders"},
 "folder-collection": {...define("Folder Collection",{view:select(["list","grid"],"list"),state:select(["ready","loading","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><FolderCollection folders={v.state==="ready"?SAMPLE_FOLDER_ROWS:[]} view={v.view as "list"|"grid"} loading={v.state==="loading"} filtered={v.state==="filtered"} error={v.state==="error"?"Sample library unavailable.":undefined} onReset={()=>set("state","ready")} onCreate={()=>set("state","ready")} onOpen={f=>set("opened",f.name)}/>{v.opened&&<p role="status" className="mt-4 text-sm">Selected {v.opened}</p>}</div>),source:"writing-folders"},
 "performance-score": {...define("Performance Score",{value:number(94,0,100,1),label:text("Performance")},v=><PerformanceScore value={v.value} label={v.label}/>),source:"team-performance"},
 "review-progress": {...define("Review Progress",{completed:number(6,0,20,1),pending:number(4,0,20,1),overdue:number(2,0,20,1),selected:select(["none","Completed","Pending","Overdue"],"none")},(v,set)=><div className="w-full p-6"><ReviewProgress counts={{Completed:v.completed,Pending:v.pending,Overdue:v.overdue}} selected={v.selected==="none"?undefined:v.selected as "Completed"} onSelect={s=>set("selected",v.selected===s?"none":s)}/></div>),source:"team-performance"},
 "member-performance-table": {...define("Member Performance Table",{state:select(["ready","loading","empty","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><MemberPerformanceTable members={v.state==="ready"?PERFORMANCE_MEMBERS.slice(0,7):[]} loading={v.state==="loading"} error={v.state==="error"?"Sample reviews are unavailable.":undefined} onReset={()=>set("state","ready")} onOpen={m=>set("opened",m.name)}/>{v.opened&&<p role="status" className="mt-4 text-sm">Selected {v.opened}</p>}</div>),source:"team-performance"},
 "chain-token-badge": {...define("Chain Token Badge",{chain:select(["ethereum","solana","arbitrum"],"ethereum"),compact:toggle(false)},v=><ChainTokenBadge chain={BRIDGE_CHAINS.find(c=>c.id===v.chain)!} token={BRIDGE_TOKENS[0]} compact={v.compact}/>),source:"token-bridge"},
 "token-amount-panel": {...define("Token Amount Panel",{amount:text("200"),output:toggle(false),disabled:toggle(false),error:text("")},(v,set)=><div className="w-full p-6"><TokenAmountPanel label={v.output?"To":"From"} chain={BRIDGE_CHAINS[0]} token={BRIDGE_TOKENS[0]} amount={v.amount} onAmountChange={v.output?undefined:value=>set("amount",value)} onMax={v.output?undefined:()=>set("amount",BRIDGE_TOKENS[0].balance)} disabled={v.disabled} error={v.error} estimate="Sample amount"/></div>),source:"token-bridge"},
 "chain-token-picker": {...define("Chain Token Picker",{selected:text("eth-usdc"),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-4"><ChainTokenPicker chains={BRIDGE_CHAINS} tokens={v.state==="empty"?[]:BRIDGE_TOKENS} value={v.selected} onSelect={t=>set("selected",t.id)} loading={v.state==="loading"} error={v.state==="error"?"Sample token data is unavailable.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"token-bridge"},
 "agent-mention-composer": {...define("Agent Mention Composer",{agent:select(["none","claude","codex"],"none"),disabled:toggle(false),lastComment:text("")},(v,set)=><div className="w-full p-6"><AgentMentionComposer agents={HANDOFF_AGENTS} agentId={v.agent==="none"?"":v.agent} onAgentChange={id=>set("agent",(id||"none") as "none"|"claude"|"codex")} disabled={v.disabled} onSend={(body,id)=>{set("lastComment",`${id?"@"+id+" ":""}${body}`);set("agent","none");}}/>{v.lastComment&&<p className="mt-4 text-sm text-text-secondary" role="status">Local preview: {v.lastComment}</p>}</div>),source:"agent-handoff"},
 "agent-session-card": {...define("Agent Session Card",{agent:text("Claude"),status:select(["idle","analyzing","awaiting","implementing","review","completed","failed","stopped"],"awaiting"),loading:toggle(false)},(v,set)=><div className="w-full p-6"><AgentSessionCard agent={v.agent} status={v.status as HandoffStatus} loading={v.loading} messages={v.status==="idle"?[]:[{id:"sample",author:{id:"agent",name:v.agent},body:"Should we use the existing job queue? Keep the change scoped to exports.",time:"Sample message"}]} result={<p className="text-sm">Illustrative export patch. Not executed.</p>} onStop={()=>set("status","stopped")} onRetry={()=>set("status","analyzing")}/></div>),source:"agent-handoff"},
 "company-identity": {...define("Company Identity",{name:text("Northstar Labs"),domain:text("northstar.example"),hot:toggle(true)},v=><div className="p-6"><CompanyIdentity name={v.name} domain={v.domain} hot={v.hot}/></div>),source:"company"},
 "company-table": {...define("Company Table",{count:number(6,1,23,1),state:select(["ready","loading","empty","error"],"ready"),sort:select(["name","arrCents","employees","lastContact"],"name"),direction:select(["asc","desc"],"asc")},(v,set)=><div className="w-full p-6"><CompanyTable companies={v.state==="ready"?companyRows(COMPANIES.slice(0,Math.floor(v.count)),{sort:{key:v.sort as CompanySort["key"],direction:v.direction as "asc"|"desc"}}):[]} sort={{key:v.sort as CompanySort["key"],direction:v.direction as "asc"|"desc"}} onSort={s=>{set("sort",s.key);set("direction",s.direction);}} loading={v.state==="loading"} error={v.state==="error"?"Sample company data is unavailable.":undefined} onReset={()=>set("state","ready")}/></div>),source:"company"},
 "activity-event-row": {...define("Activity Event Row",{event:number(1,1,18,1),unread:toggle(true),selected:toggle(),interactive:toggle(true)},(v,set)=><div className="w-full p-6"><ActivityEventRow event={FEED_EVENTS[Math.floor(v.event)-1]} now={FEED_NOW} currentUserId="alex" unread={v.unread} selected={v.selected} onOpen={v.interactive?()=>{set("selected",!v.selected);set("unread",false);}:undefined}/></div>),source:"project-activity"},
 "grouped-activity-feed": {...define("Grouped Activity Feed",{count:number(8,1,18,1),state:select(["ready","loading","empty","error"],"ready"),read:toggle(),selected:number(0,0,18,1)},(v,set)=><div className="w-full p-6"><GroupedActivityFeed events={v.state==="ready"?FEED_EVENTS.slice(0,Math.floor(v.count)):[]} now={FEED_NOW} currentUserId="alex" readIds={v.read?FEED_EVENTS.map(e=>e.id):[]} selectedId={v.selected?FEED_EVENTS[Math.floor(v.selected)-1]?.id:undefined} onOpen={event=>set("selected",FEED_EVENTS.findIndex(e=>e.id===event.id)+1)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onReset={()=>set("state","ready")}/></div>),source:"project-activity"},
 "weekly-heatmap": {...define("Weekly Heatmap",{metric:select(["runs","credits","failures"],"runs"),slot:number(82,0,167,1),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-6"><WeeklyHeatmap data={v.state==="ready"?selectedWeek():[]} metric={v.metric as RunMetric} value={Math.floor(v.slot)} onValueChange={i=>set("slot",i)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-runs"},
 "agent-runs-card": {...define("Agent Runs Card",{metric:select(["runs","credits","failures"],"runs"),slot:number(82,0,167,1),agent:select(["all","triage","research","digest"],"all"),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-6"><AgentRunsCard data={v.state==="ready"?selectedWeek(v.agent):[]} previousData={selectedWeek(v.agent,true)} description={`${v.agent === "all" ? "All agents" : v.agent} · Oct 5–11, 2026 · UTC`} metric={v.metric as RunMetric} onMetricChange={m=>set("metric",m)} value={Math.floor(v.slot)} onValueChange={i=>set("slot",i)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-runs"},
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
  "currency-balance-card": {...define("Currency Balance Card",{selected:toggle(false),hidden:toggle(false)},(v,set)=><div className="w-64"><CurrencyBalanceCard account={INITIAL_WALLET.accounts[0]} selected={v.selected} hidden={v.hidden} onSelect={()=>set("selected",!v.selected)}/></div>),source:"currency-finance"},
  "currency-balance-summary": {...define("Currency Balance Summary",{base:select(["USD","GBP","NGN","GHS","EUR"],"USD"),hidden:toggle(false)},(v,set)=><CurrencyBalanceSummary accounts={INITIAL_WALLET.accounts} base={v.base} hidden={v.hidden} onVisibilityChange={hidden=>set("hidden",hidden)}/>),source:"currency-finance"},
  "money-activity-list": {...define("Money Activity List",{state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full max-w-2xl"><MoneyActivityList entries={v.state==="ready"?INITIAL_WALLET.entries.slice(0,4):[]} loading={v.state==="loading"} error={v.state==="error"?"The sample activity could not be loaded.":undefined} onRetry={()=>set("state","ready")} onReset={()=>set("state","ready")}/></div>),source:"currency-finance"},
  "cash-flow-bars": {...define("Cash Flow Bars",{period:select(["all","week"],"week"),empty:toggle(false)},v=><div className="w-full max-w-3xl"><CashFlowBars days={v.empty?[]:cashFlowDays(INITIAL_WALLET.entries,v.period)}/></div>),source:"currency-finance"},
  "stay-price-label": {...define("Stay Price Label",{selected:toggle(true),nightly:number(148,0,500,1)},v=><div className="rounded-full border border-border-subtle bg-bg-inverse text-text-on-inverse px-3 py-2 text-sm"><StayPriceLabel name="Atelier de la Tour" nightly={v.nightly} selected={v.selected}/></div>),source:"stay-results"},
  "stay-result-card": {...define("Stay Result Card",{selected:toggle(false),saved:toggle(false)},(v,set)=><StayResultCard stay={STAYS[0]} distance={distanceKm(STAYS[0],LANDMARKS[0])} selected={v.selected} saved={v.saved} onSelect={()=>set("selected",!v.selected)}/>),source:"stay-results"},
  "stay-selection-card": {...define("Stay Selection Card",{stay:select(["atelier","jardin","rue"],"atelier"),saved:toggle(false)},(v,set)=>{const index=STAYS.findIndex(stay=>stay.id===v.stay);return <div className="w-full max-w-3xl"><StaySelectionCard stay={STAYS[index]} distance={distanceKm(STAYS[index],LANDMARKS[0])} landmark="Eiffel Tower" index={index} total={3} saved={v.saved} onSave={()=>set("saved",!v.saved)} onPrevious={()=>set("stay",["atelier","jardin","rue"][(index+2)%3] as typeof v.stay)} onNext={()=>set("stay",["atelier","jardin","rue"][(index+1)%3] as typeof v.stay)}/></div>;}),source:"stay-results"},
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
  "task-schedule-chip":{...define("Task Schedule Chip",{title:text("Finalize navigation"),status:select(["backlog","todo","progress","review","done"],"progress"),disabled:toggle(),message:text("")},(v,set)=><div className="w-80 max-w-full"><TaskScheduleChip task={{...SCHEDULE_TASKS[1],title:v.title,status:v.status}} project={{id:"website",name:"Website redesign",color:"purple"}} person={SCHEDULE_PEOPLE[0]} disabled={v.disabled} onOpen={()=>set("message","Task opened. The template provides the shared editor.")}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"},
  "task-calendar":{...define("Task Calendar",{date:text("2026-10-15"),mode:select(["month","week"],"month"),empty:toggle(),message:text("")},(v,set)=><div className="w-full"><TaskCalendar tasks={v.empty?[]:SCHEDULE_TASKS} projects={SCHEDULE_PROJECTS.map((p,i)=>({...p,color:(["purple","blue","mint"] as const)[i]}))} people={SCHEDULE_PEOPLE} date={v.date} mode={v.mode} today="2026-10-15" onDateChange={d=>set("date",d)} onModeChange={m=>set("mode",m)} onOpen={t=>set("message",`Open ${t.title}`)} onCreate={d=>set("message",`Create task due ${d}`)}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"},
  "task-timeline":{...define("Task Timeline",{date:text("2026-10-12"),empty:toggle(),message:text("")},(v,set)=><div className="w-full"><TaskTimeline tasks={v.empty?[]:SCHEDULE_TASKS} projects={SCHEDULE_PROJECTS.map((p,i)=>({...p,color:(["purple","blue","mint"] as const)[i]}))} people={SCHEDULE_PEOPLE} date={v.date} today="2026-10-15" onDateChange={d=>set("date",d)} onOpen={t=>set("message",`Open ${t.title}`)}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"},
  "task-row": define("Task Row", { title:text("Finalize navigation"), status:select(["backlog","todo","progress","review","done"],"progress"), priority:select(["Low","Medium","High"],"High"), overdue:toggle(), disabled:toggle() }, (v,set)=><div className="w-full rounded-card-medium border border-border-subtle"><TaskRow {...v} id="WEB-102" project="Website redesign" due="Today" person={{name:"Alex Morgan",color:"purple"}} onOpen={()=>window.location.assign("/project-workspace")} onComplete={done=>set("status",done?"done":"todo")}/></div>),
  "tree-stepper": define("Tree Stepper", { value: select(getTreeSteps(REVIEW_TREE).map(s=>s.node.id),"suspicious"), disabled: toggle(), empty: toggle(), attention: toggle() }, (v,set)=><div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-4"><TreeStepper nodes={v.empty?[]:REVIEW_TREE} value={v.value} onValueChange={value=>{if(value==="desktop"||value==="editor"||value==="terminal"||value==="custom") set("value",value);}} completed={["devices","ownership","overview"]} attention={v.attention?["overview"]:[]} disabled={v.disabled}/></div>),
  "step-progress": define("Step Progress", { completed:number(3,0,18,1), total:number(18,0,18,1), label:text("Review progress") }, v=><div className="w-full max-w-sm"><StepProgress {...v}/></div>),
  "timeframe-selector": define("Timeframe Selector", { value: select(["1h","4h","24h","3d","1w"],"24h"), disabled: toggle() }, (v,set) => <TimeframeSelector {...v} onValueChange={value=>set("value",value as typeof v.value)} />),
  "inline-search-select": define("Inline Search Select", { value: select(["eth","btc","bnb","sol","avax"],"eth"), disabled: toggle(), loading: toggle(), error: toggle() }, (v,set) => <div className="w-48"><InlineSearchSelect options={SAMPLE_ASSETS} label="Token" value={v.value} disabled={v.disabled} loading={v.loading} error={v.error?"The sample catalog is unavailable.":undefined} onRetry={()=>set("error",false)} onValueChange={value=>set("value",value as typeof v.value)} /></div>),
  "studio-inbox-components": define("Inbox Notification", { selected: toggle(true), unread: toggle(true), preview: text(NOTIFICATIONS[0].preview) }, (v,set) => <div className="w-full max-w-md rounded-card-medium border border-border-subtle bg-bg-base p-2"><InboxNotification item={{...NOTIFICATIONS[0], unread:v.unread, preview:v.preview}} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),
  "monitor-reveal":{...define("Monitor Reveal",{play:number(1,0,100,1),variant:select(["rise","wipe"],"rise"),delay:number(100,0,400,50)},v=><MonitorReveal className="w-96 max-w-full" play={v.play} variant={v.variant} delay={v.delay}><RegionSpotlight region={REGIONS[6]} samples={latencySamples("24h",REGIONS[6])}/></MonitorReveal>),source:"monitor-reveal"},
  "region-spotlight":{...define("Region Spotlight",{selected:select(REGIONS.map(r=>r.id),"sin1"),trend:toggle(true)},v=><div className="w-96 max-w-full"><RegionSpotlight region={REGIONS.find(r=>r.id===v.selected)!} samples={v.trend?latencySamples("24h",REGIONS.find(r=>r.id===v.selected)):[]}/></div>),source:"edge-monitor"},
  "incident-recommendation":{...define("Incident Recommendation",{share:number(30,1,50,1),action:text("")},(v,set)=><div className="w-full max-w-lg"><IncidentRecommendation source={REGIONS[6]} baseline={38} target={REGIONS[7]} headroom={41} share={v.share} onReview={()=>set("action","Review requested. The complete template opens a local routing draft.")} onTrace={()=>set("action","Trace requested. Open the template to inspect the sample requests.")}/><p role="status" className="px-3 text-sm text-text-secondary">{v.action}</p></div>),source:"edge-monitor"},
  "edge-monitor": define("Region Traffic Map", { selected: select(REGIONS.map(r=>r.id), "sin1"), empty: toggle() }, (v,set) => <div className="w-full max-w-3xl rounded-card-medium border border-border-subtle bg-bg-elevated"><RegionTrafficMap regions={v.empty?[]:REGIONS} selected={v.selected} onSelect={id=>set("selected",id)}/></div>),
  switch: define("Switch", { checked: toggle(false), variant: select(["default", "stretch"], "stretch"), disabled: toggle(), readOnly: toggle() }, (v,set) => <Switch aria-label="Stretch motion" checked={v.checked} onCheckedChange={checked=>set("checked",checked)} variant={v.variant} disabled={v.disabled} readOnly={v.readOnly} />),
  "toggle-composer": define("Toggle Composer", { mode: select(["quick", "long"], "quick"), surface: select(["solid", "frosted"], "solid"), quick: text("A thought worth sharing."), headline: text("A longer story"), intro: text("Start with a little context."), body: text("Make room for the details."), disabled: toggle() }, (v,set) => <div className="w-full max-w-lg"><ToggleComposer mode={v.mode as ComposerMode} onModeChange={mode=>set("mode",mode)} surface={v.surface} disabled={v.disabled} value={{...EMPTY_COMPOSER,quick:v.quick,headline:v.headline,intro:v.intro,body:v.body}} onValueChange={value=>{for (const key of Object.keys(EMPTY_COMPOSER) as (keyof typeof EMPTY_COMPOSER)[]) set(key,value[key]);}} /></div>),
  "canvas-toolbar": define("Canvas Toolbar", { zoom: number(95,10,200,5), mode: select(["pan","select"],"select"), disabled: toggle() }, (v,set) => <CanvasToolbar zoom={v.zoom} onZoomChange={zoom=>set("zoom",zoom)} mode={v.mode as CanvasMode} onModeChange={mode=>set("mode",mode)} disabled={v.disabled} onFit={()=>set("zoom",95)} />),
  "text-toolbar": define("Text Toolbar", { bold: toggle(), italic: toggle(), underline: toggle(), strikethrough: toggle(), code: toggle(), highlight: toggle(), color: select(["ink","mint","pink","blue","purple","orange","brown"],"ink"), font: select(["sans","serif","hand","mono"],"hand"), size: number(22,12,72,1), align: select(["left","center","right"],"center"), disabled: toggle() }, (v,set) => <TextToolbar disabled={v.disabled} value={{...DEFAULT_TEXT_FORMAT,...v,color:v.color as TextColor,font:v.font as TextFont,align:v.align as TextAlignment}} onValueChange={value=>{for(const key of Object.keys(DEFAULT_TEXT_FORMAT) as (keyof typeof DEFAULT_TEXT_FORMAT)[]) set(key,value[key]);}} />),
  "meeting-components": { ...define("Multi-select Menu", { label: text("Event category"), heading: text("Meeting category"), disabled: toggle(), empty: toggle(), selected: text("review,brainstorm,interview") }, (v,set) => <div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-3"><MultiSelectMenu label={v.label} heading={v.heading} disabled={v.disabled} options={v.empty ? [] : meetingCategories} value={v.selected.split(",").map(id=>id.trim()).filter(Boolean)} onValueChange={value=>set("selected",value.join(","))} /></div>), source: "multi-select-menu" },
  "automation-components": { ...define("Agent Result", { title: text("Selected account and ad sets"), status: select(["ready", "running", "error", "reviewed"], "ready"), open: toggle(false), details: text("Oreo Store · Weekend essentials · $200 daily budget") }, (v, set) => <div className="w-full max-w-xl"><AgentResultCard title={v.title} status={v.status} open={v.open} onOpenChange={open => set("open", open)}>{v.details}</AgentResultCard></div>), source: "automation" },
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
