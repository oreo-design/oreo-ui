import { StudioInboxDocs } from "@/pages/StudioInboxDocs";
import { StudioInboxPage } from "@/pages/StudioInboxPage";
import { EdgeMonitorDocs } from "@/pages/EdgeMonitorDocs";
import { EdgeObservatoryPage } from "@/pages/EdgeObservatoryPage";
import { SwitchDocs } from "@/pages/SwitchDocs";
import { PreferenceStudioPage } from "@/pages/PreferenceStudioPage";
import { ToggleComposerDocs } from "@/pages/ToggleComposerDocs";
import { ComposerStudioPage } from "@/pages/ComposerStudioPage";
import { CanvasToolbarDocs } from "@/pages/CanvasToolbarDocs";
import { CanvasStudioPage } from "@/pages/CanvasStudioPage";
import { TextToolbarDocs } from "@/pages/TextToolbarDocs";
import { WritingStudioPage } from "@/pages/WritingStudioPage";
import { MeetingComponentsDocs } from "@/pages/MeetingComponentsDocs";
import { MeetingPlannerPage } from "@/pages/MeetingPlannerPage";
import { AutomationComponentsDocs } from "@/pages/AutomationComponentsDocs";
import { AutomationStudioPage } from "@/pages/AutomationStudioPage";
import { DocumentActivityDocs } from "@/pages/DocumentActivityDocs";
import { DocumentWorkspacePage } from "@/pages/DocumentWorkspacePage";
import { ConnectionStateDocs } from "@/pages/ConnectionStateDocs";
import { CalendarSyncPage } from "@/pages/CalendarSyncPage";
import { CommentThreadDocs } from "@/pages/CommentThreadDocs";
import { CommentWorkspacePage } from "@/pages/CommentWorkspacePage";

import { SubscriptionComponentsDocs } from "@/pages/SubscriptionComponentsDocs";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { InlineConfirmDocs } from "@/pages/InlineConfirmDocs";
import { InlineQuickMenuDocs } from "@/pages/InlineQuickMenuDocs";
import { ProjectChatDocs } from "@/pages/ProjectChatDocs";
import { MusicWorkspacePage } from "@/pages/MusicWorkspacePage";
import { KnowledgeComponentsDocs } from "@/pages/KnowledgeComponentsDocs";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { ConnectionComponentsDocs } from "@/pages/ConnectionComponentsDocs";
import { ConnectionsWorkspacePage } from "@/pages/ConnectionsWorkspacePage";
import { OrbitGalleryDocs } from "@/pages/OrbitGalleryDocs";
import { OrbitGalleryShowcasePage } from "@/pages/OrbitGalleryShowcasePage";
import { FeatureCardsDocs } from "@/pages/FeatureCardsDocs";
import { FeaturesShowcasePage } from "@/pages/FeaturesShowcasePage";
import { ProspectingComponentsDocs } from "@/pages/ProspectingComponentsDocs";
import { ProspectingDashboardPage } from "@/pages/ProspectingDashboardPage";
import { ActivityComponentsDocs } from "@/pages/ActivityComponentsDocs";
import { ActivityWorkspacePage } from "@/pages/ActivityWorkspacePage";
import { CutRevealDocs } from "@/pages/CutRevealDocs";
import { NeutomniIntroPage } from "@/pages/NeutomniIntroPage";
import { SkillCardDocs } from "@/pages/SkillCardDocs";
import { SkillsWorkspacePage } from "@/pages/SkillsWorkspacePage";
import { StatusIconDocs } from "@/pages/StatusIconDocs";
import { ContextWindowDocs } from "@/pages/ContextWindowDocs";
import { ReviewWorkspacePage } from "@/pages/ReviewWorkspacePage";
import { ReviewComponentsDocs } from "@/pages/ReviewComponentsDocs";
import { useEffect, useState, type ComponentType } from "react";
import { KanbanDocs } from "@/pages/KanbanDocs";
import { ButtonDocs } from "@/pages/ButtonDocs";
import { GradientMaskDocs } from "@/pages/GradientMaskDocs";
import { IconButtonDocs } from "@/pages/IconButtonDocs";
import { ShortcutDocs } from "@/pages/ShortcutDocs";
import { ChipDocs } from "@/pages/ChipDocs";
import { TagDocs } from "@/pages/TagDocs";
import { AvatarDocs } from "@/pages/AvatarDocs";
import { BoardPage } from "@/pages/BoardPage";
import { SettingsLab } from "@/pages/settings-lab/SettingsLab";
import { SettingsPage } from "@/pages/SettingsPage";
import { StreamPage } from "@/pages/StreamPage";
import { CodeBlockDocs } from "@/pages/CodeBlockDocs";
import { ResponseDocs } from "@/pages/ResponseDocs";
import { StreamingTextDocs } from "@/pages/StreamingTextDocs";
import { MessageDocs } from "@/pages/MessageDocs";
import { ConversationDocs } from "@/pages/ConversationDocs";
import { ToolCallDocs } from "@/pages/ToolCallDocs";
import { ReasoningDocs } from "@/pages/ReasoningDocs";
import { PlanDocs } from "@/pages/PlanDocs";
import { SourcesDocs } from "@/pages/SourcesDocs";
import { ConfirmationDocs } from "@/pages/ConfirmationDocs";
import { AttachmentDocs } from "@/pages/AttachmentDocs";
import { BranchPickerDocs } from "@/pages/BranchPickerDocs";
import { ThreadListDocs } from "@/pages/ThreadListDocs";
import { AssistantModalDocs } from "@/pages/AssistantModalDocs";
import { PageLoaderDocs } from "@/pages/PageLoaderDocs";
import { CodeDiffDocs } from "@/pages/CodeDiffDocs";
import { TerminalDocs } from "@/pages/TerminalDocs";
import { WebSearchDocs } from "@/pages/WebSearchDocs";
import { SubagentsDocs } from "@/pages/SubagentsDocs";
import { MenuDocs } from "@/pages/MenuDocs";
import { PromptBoxDocs } from "@/pages/PromptBoxDocs";
import { KeywordTagDocs } from "@/pages/KeywordTagDocs";
import { ContextBarDocs } from "@/pages/ContextBarDocs";
import type { DocsNav } from "@/docs/DocsPage";
import { DEFAULT_PAGE, isPageSlug, metaForRoute, type PageSlug } from "@/lib/site";
import { applyRouteMeta } from "@/lib/head";

const PAGES: Record<PageSlug, ComponentType<{ nav: DocsNav }>> = {
  "studio-inbox-components": StudioInboxDocs,
  "studio-inbox": StudioInboxPage,
  "edge-monitor": EdgeMonitorDocs,
  "edge-observatory": EdgeObservatoryPage,
  switch: SwitchDocs,
  "preference-studio": PreferenceStudioPage,
  "toggle-composer": ToggleComposerDocs,
  "composer-studio": ComposerStudioPage,
  "canvas-toolbar": CanvasToolbarDocs,
  "canvas-studio": CanvasStudioPage,
  "text-toolbar": TextToolbarDocs,
  "writing-studio": WritingStudioPage,
  "meeting-components": MeetingComponentsDocs,
  "meeting-planner": MeetingPlannerPage,
  "automation-components": AutomationComponentsDocs,
  "automation-studio": AutomationStudioPage,
  "document-activity": DocumentActivityDocs,
  "document-workspace": DocumentWorkspacePage,
  "connection-state": ConnectionStateDocs,
  "calendar-sync": CalendarSyncPage,
  "comment-thread": CommentThreadDocs,
  "comment-workspace": CommentWorkspacePage,

  "subscription-components": SubscriptionComponentsDocs,
  subscription: SubscriptionPage,
  "inline-confirm": InlineConfirmDocs,
  "inline-quick-menu": InlineQuickMenuDocs,
  "project-chat": ProjectChatDocs,
  "music-workspace": MusicWorkspacePage,
  "knowledge-components": KnowledgeComponentsDocs,
  "knowledge-base": KnowledgeBasePage,
  "connection-components": ConnectionComponentsDocs,
  "connections-workspace": ConnectionsWorkspacePage,
  "orbit-gallery": OrbitGalleryDocs,
  "orbit-gallery-showcase": OrbitGalleryShowcasePage,
  "feature-cards": FeatureCardsDocs,
  "features-showcase": FeaturesShowcasePage,
  "prospecting-components": ProspectingComponentsDocs,
  "prospecting-dashboard": ProspectingDashboardPage,
  "activity-components": ActivityComponentsDocs,
  "activity-workspace": ActivityWorkspacePage,
  "cut-reveal": CutRevealDocs,
  "neutomni-intro": NeutomniIntroPage,
  "skill-card": SkillCardDocs,
  "skills-workspace": SkillsWorkspacePage,
  "status-icon": StatusIconDocs,
  "context-window": ContextWindowDocs,
  "review-workspace": ReviewWorkspacePage,
  "review-components": ReviewComponentsDocs,
  kanban: KanbanDocs,
  button: ButtonDocs,
  "gradient-mask": GradientMaskDocs,
  "icon-button": IconButtonDocs,
  shortcut: ShortcutDocs,
  chip: ChipDocs,
  tag: TagDocs,
  avatar: AvatarDocs,
  menu: MenuDocs,
  "code-block": CodeBlockDocs,
  response: ResponseDocs,
  "streaming-text": StreamingTextDocs,
  message: MessageDocs,
  conversation: ConversationDocs,
  "tool-call": ToolCallDocs,
  reasoning: ReasoningDocs,
  plan: PlanDocs,
  sources: SourcesDocs,
  confirmation: ConfirmationDocs,
  attachment: AttachmentDocs,
  "branch-picker": BranchPickerDocs,
  "thread-list": ThreadListDocs,
  "assistant-modal": AssistantModalDocs,
  "page-loader": PageLoaderDocs,
  "code-diff": CodeDiffDocs,
  terminal: TerminalDocs,
  "web-search": WebSearchDocs,
  subagents: SubagentsDocs,
  "prompt-box": PromptBoxDocs,
  "keyword-tag": KeywordTagDocs,
  "context-bar": ContextBarDocs,
  "inbox-stream": StreamPage,
  "onboarding-board": BoardPage,
  settings: SettingsPage,
  "settings-lab": SettingsLab,
};

type Route = { page: PageSlug; home: boolean };

/**
 * Every page lives at /<slug> so any component doc can be shared as a URL.
 * "/" is the landing route (it renders the default page but keeps the site
 * title); an unknown slug is normalized back to "/" so we never serve the same
 * content under an unbounded set of soft-404 URLs.
 */
function routeFromPath(): Route {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (isPageSlug(slug)) return { page: slug, home: false };
  if (slug) window.history.replaceState(null, "", "/");
  return { page: DEFAULT_PAGE, home: true };
}

export default function App() {
  const [route, setRoute] = useState(routeFromPath);
  const { page, home } = route;

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    applyRouteMeta(metaForRoute(page, home));
  }, [page, home]);

  const nav: DocsNav = {
    active: page,
    onNavigate: (id) => {
      if (!isPageSlug(id)) return;
      if (id !== page || home) window.history.pushState(null, "", `/${id}`);
      setRoute({ page: id, home: false });
      window.scrollTo({ top: 0 });
    },
  };

  const Page = PAGES[page];
  return <Page key={page} nav={nav} />;
}
