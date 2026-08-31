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
