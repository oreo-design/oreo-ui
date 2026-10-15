import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import {
  CALLBACK_STAGES,
  callbackDate,
  callbackMoney,
  type Callback,
  type CallbackPerson,
  type CallbackPriorityLevel,
  type CallbackStage,
} from "./types";
import "./callback.css";
export * from "./types";

export function CallbackPriority({
  priority = "Medium",
}: {
  priority?: CallbackPriorityLevel;
}) {
  const level = ["Low", "Medium", "High", "Critical"].indexOf(priority) + 1;
  return (
    <span
      className="callback-priority"
      data-critical={priority === "Critical" || undefined}
    >
      <span className="callback-bars" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <i key={n} data-filled={n <= level || undefined} />
        ))}
      </span>
      {priority}
    </span>
  );
}
/** A single keyboard-operable target; the host owns details and changes. */
export function CallbackCard({
  callback,
  person,
  onOpen,
  showBranch = false,
}: {
  callback: Callback;
  person?: CallbackPerson;
  onOpen: () => void;
  showBranch?: boolean;
}) {
  return (
    <button
      type="button"
      className="callback-card"
      onClick={onOpen}
      aria-label={`Open ${callback.id}: ${callback.customer}`}
    >
      <span className="callback-card-meta">
        <CallbackPriority priority={callback.priority} />
        <span className="callback-date">
          <Icon name="calendar" size="sm" />
          {callbackDate(callback.reported)}
        </span>
      </span>
      <strong>{callback.customer}</strong>
      <span className="callback-card-description">
        {callback.id} · {callback.issue}
      </span>
      {showBranch && <span className="callback-branch">{callback.branch}</span>}
      <span className="callback-card-footer">
        <Avatar name={person?.name ?? "Unassigned"} size="xs" />
        <span>{person?.name ?? "Unassigned"}</span>
        <b>{callbackMoney(callback.cost)}</b>
      </span>
    </button>
  );
}
export type CallbackBoardProps = {
  callbacks: Callback[];
  people: CallbackPerson[];
  stages?: CallbackStage[];
  onOpen: (callback: Callback) => void;
  onCreate?: (stage: CallbackStage) => void;
  showBranch?: boolean;
};
/** Operational board. Stage changes are host-owned; no drag behavior is implied. */
export function CallbackBoard({
  callbacks,
  people,
  stages = ["new", "review", "scheduled"],
  onOpen,
  onCreate,
  showBranch = false,
}: CallbackBoardProps) {
  return (
    <div
      className="callback-board"
      role="region"
      aria-label="Callback stages"
      tabIndex={0}
    >
      {stages.map((stage) => {
        const items = callbacks.filter((c) => c.stage === stage);
        return (
          <section
            key={stage}
            className="callback-column"
            aria-label={CALLBACK_STAGES[stage]}
          >
            <header>
              <h3>{CALLBACK_STAGES[stage]}</h3>
              <span>{items.length}</span>
              {onCreate && (
                <IconButton
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  aria-label={`Add callback to ${CALLBACK_STAGES[stage]}`}
                  icon={<Icon name="plus" size="sm" />}
                  onClick={() => onCreate(stage)}
                />
              )}
            </header>
            <div className="callback-column-content">
              {items.length ? (
                items.map((c) => (
                  <CallbackCard
                    key={c.id}
                    callback={c}
                    person={people.find((p) => p.id === c.ownerId)}
                    onOpen={() => onOpen(c)}
                    showBranch={showBranch}
                  />
                ))
              ) : (
                <AgentWorkspaceState
                  title="All clear"
                  description="No callbacks in this stage."
                />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
