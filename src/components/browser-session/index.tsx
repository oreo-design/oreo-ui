import { useSyncExternalStore, type ReactNode } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { ThinkingState, type ThinkingPhase } from "@/components/thinking-state";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ACTION_LABELS,
  BROWSER_STATUS_LABELS,
  type BrowserAction,
  type BrowserRunStatus,
} from "./model";
import "./browser-session.css";
export * from "./model";
const PHASES: Record<BrowserAction, ThinkingPhase> = {
  navigating: "building",
  reading: "analyzing",
  searching: "searching",
  typing: "debugging",
  waiting: "pondering",
};
const subscribe = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const visible = () => !document.hidden;
export type BrowserTab = {
  id: string;
  title: string;
  icon?: IconName;
  closable?: boolean;
  activity?: { status: BrowserRunStatus; action: BrowserAction };
};
/** Tabs carry activity independently of selection: switching views never changes the agent target. */
export function BrowserSessionTabs({
  tabs,
  value,
  onValueChange,
  onClose,
  onAdd,
  renderPanel,
}: {
  tabs: BrowserTab[];
  value: string;
  onValueChange: (id: string) => void;
  onClose?: (id: string) => void;
  onAdd?: () => void;
  renderPanel?: (tab: BrowserTab) => ReactNode;
}) {
  const pageVisible = useSyncExternalStore(subscribe, visible, () => true);
  if (!tabs.length)
    return (
      <AgentWorkspaceState
        title="No browser tabs"
        description="Open a tab to start exploring this session."
        actionLabel={onAdd ? "Open tab" : undefined}
        onAction={onAdd}
      />
    );
  const selected = tabs.some((t) => t.id === value) ? value : tabs[0].id;
  return (
    <Tabs.Root
      className="bs-tabs"
      value={selected}
      onValueChange={(id) => onValueChange(String(id))}
      data-page-visible={pageVisible}
    >
      <div className="bs-tab-strip">
        <Tabs.List aria-label="Session tabs" className="bs-tab-list">
          {tabs.map((tab) => {
            const running = tab.activity?.status === "running";
            return (
              <div
                className="bs-tab-item"
                key={tab.id}
                data-running={running || undefined}
                data-selected={selected === tab.id || undefined}
              >
                <Tabs.Tab
                  value={tab.id}
                  className="bs-tab"
                  aria-label={`${tab.title}${tab.activity ? `, ${tab.activity.status === "running" ? ACTION_LABELS[tab.activity.action] : BROWSER_STATUS_LABELS[tab.activity.status]}` : ""}`}
                >
                  <span className="bs-tab-icon" aria-hidden>
                    {running ? (
                      <ThinkingState
                        phase={PHASES[tab.activity!.action]}
                        shape="circle"
                        grid={false}
                        label=""
                        announce={false}
                      />
                    ) : (
                      <Icon name={tab.icon ?? "globe"} size="sm" />
                    )}
                  </span>
                  <span className="bs-tab-title">{tab.title}</span>
                  {tab.activity &&
                    !running &&
                    ["paused", "user", "error"].includes(
                      tab.activity.status,
                    ) && (
                      <span className="bs-tab-state">
                        {tab.activity.status === "user"
                          ? "You"
                          : tab.activity.status === "paused"
                            ? "Paused"
                            : "Error"}
                      </span>
                    )}
                </Tabs.Tab>
                {onClose && tab.closable !== false && (
                  <IconButton
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    disabled={running}
                    aria-label={`Close ${tab.title}${running ? " (agent is using this tab)" : ""}`}
                    icon={<Icon name="x" size="sm" />}
                    onClick={() => onClose(tab.id)}
                  />
                )}
                <span className="bs-tab-glow" aria-hidden />
              </div>
            );
          })}
        </Tabs.List>
        {onAdd && (
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label="Open new tab"
            icon={<Icon name="plus" />}
            onClick={onAdd}
          />
        )}
      </div>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.id} value={tab.id} className="bs-tab-panel">
          {renderPanel ? (
            renderPanel(tab)
          ) : (
            <div className="bs-panel-placeholder">{tab.title}</div>
          )}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
export function BrowserControlBar({
  status,
  action = "reading",
  target,
  detail,
  onStart,
  onPause,
  onResume,
  onTakeOver,
  onReturnControl,
  onStop,
  onRetry,
}: {
  status: BrowserRunStatus;
  action?: BrowserAction;
  target?: string;
  detail?: string;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onTakeOver?: () => void;
  onReturnControl?: () => void;
  onStop?: () => void;
  onRetry?: () => void;
}) {
  return (
    <section
      className="bs-control"
      aria-label="Browser control"
      data-status={status}
    >
      <div
        className="bs-control-copy"
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="bs-control-icon" aria-hidden>
          {status === "running" ? (
            <ThinkingState
              phase={PHASES[action]}
              shape="circle"
              grid={false}
              label=""
              announce={false}
            />
          ) : (
            <Icon
              name={
                status === "error"
                  ? "warning-circle"
                  : status === "complete"
                    ? "check"
                    : status === "user"
                      ? "cursor"
                      : status === "paused"
                        ? "hand"
                        : "globe"
              }
            />
          )}
        </span>
        <div>
          <strong>{BROWSER_STATUS_LABELS[status]}</strong>
          <p>
            {detail ??
              (status === "running"
                ? `${ACTION_LABELS[action]}${target ? ` · ${target}` : ""}`
                : status === "user"
                  ? "Automatic actions are paused until you hand control back."
                  : status === "paused"
                    ? "Your tabs stay open. Resume when you are ready."
                    : status === "complete"
                      ? "Review the results or start a fresh session."
                      : status === "error"
                        ? "The current action failed. Retry it or stop this session."
                        : status === "stopped"
                          ? "Progress is preserved. Start again for a fresh run."
                          : "Start a run to see browser activity here.")}
          </p>
        </div>
      </div>
      <div className="bs-control-actions">
        {status === "running" && onPause && (
          <Button type="secondary" size="sm" tapScale={1} onClick={onPause}>
            Pause
          </Button>
        )}
        {["running", "paused"].includes(status) && onTakeOver && (
          <Button type="secondary" size="sm" tapScale={1} onClick={onTakeOver}>
            Take over
          </Button>
        )}
        {status === "paused" && onResume && (
          <Button size="sm" tapScale={1} onClick={onResume}>
            Resume
          </Button>
        )}
        {status === "user" && onReturnControl && (
          <Button size="sm" tapScale={1} onClick={onReturnControl}>
            Return to agent
          </Button>
        )}
        {status === "error" && onRetry && (
          <Button size="sm" tapScale={1} onClick={onRetry}>
            Retry
          </Button>
        )}
        {["running", "paused", "user", "error"].includes(status) && onStop && (
          <Button type="tertiary" size="sm" tapScale={1} onClick={onStop}>
            Stop
          </Button>
        )}
        {["ready", "complete", "stopped"].includes(status) && onStart && (
          <Button size="sm" tapScale={1} onClick={onStart}>
            {status === "ready" ? "Start browsing" : "Run again"}
          </Button>
        )}
      </div>
    </section>
  );
}
