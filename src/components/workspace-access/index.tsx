import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { StepProgress } from "@/components/step-progress";
import { AgentWorkspaceState } from "@/components/automation";
import "./workspace-access.css";

export type AccessTool = {
  id: string;
  name: string;
  description: string;
  mark: string;
  tone: "mint" | "orange" | "purple" | "blue";
  ready: boolean;
};
export type AccessMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  tools: string[];
};
export type SetupStep = {
  id: string;
  title: string;
  description: string;
  complete: boolean;
};
export function WorkspaceSetup({
  steps,
  onSelect,
}: {
  steps: SetupStep[];
  onSelect?: (id: string) => void;
}) {
  return (
    <section className="wa-setup">
      <StepProgress
        label="Workspace setup"
        completed={steps.filter((s) => s.complete).length}
        total={steps.length}
      />
      <div className="wa-steps">
        {steps.map((step, i) => (
          <div className="wa-step" key={step.id}>
            <span
              className={`wa-step-number ${step.complete ? "is-done" : ""}`}
            >
              {step.complete ? <Icon name="check" size="sm" /> : i + 1}
            </span>
            <div>
              {onSelect ? (
                <button onClick={() => onSelect(step.id)}>
                  {step.title}
                  <Icon name="arrow-up-right" size="sm" />
                </button>
              ) : (
                <strong>{step.title}</strong>
              )}
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function ToolAccessRow({
  tool,
  detail,
  action,
}: {
  tool: AccessTool;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="wa-tool-row">
      <span className={`wa-mark wa-mark-${tool.tone}`} aria-hidden="true">
        {tool.mark}
      </span>
      <div className="wa-tool-identity">
        <strong>{tool.name}</strong>
        <p>{detail ?? tool.description}</p>
      </div>
      {action && <div className="wa-tool-action">{action}</div>}
    </div>
  );
}
export function MemberAccessTable({
  members,
  tools,
  activeMemberIds = [],
  onEdit,
}: {
  members: AccessMember[];
  tools: AccessTool[];
  activeMemberIds?: string[];
  onEdit?: (id: string) => void;
}) {
  if (!members.length)
    return (
      <AgentWorkspaceState
        title="No members found"
        description="Try another name or email."
      />
    );
  return (
    <div
      className="wa-table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Workspace members"
    >
      <table className="wa-table">
        <caption className="sr-only">
          Workspace members and assigned tools
        </caption>
        <thead>
          <tr>
            <th>Member</th>
            <th>Role</th>
            <th>Assigned tools</th>
            <th>Status</th>
            {onEdit && (
              <th>
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="wa-person">
                  <Avatar name={member.name} size="sm" />
                  <span>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </span>
                </div>
              </td>
              <td>{member.role}</td>
              <td>
                <div className="wa-tool-tags">
                  {member.tools.length ? (
                    member.tools.map((id) => (
                      <span key={id}>
                        {tools.find((t) => t.id === id)?.name ?? id}
                      </span>
                    ))
                  ) : (
                    <span>No access</span>
                  )}
                </div>
              </td>
              <td>
                <Tag
                  color={
                    activeMemberIds.includes(member.id) ? "mint" : "default"
                  }
                >
                  {activeMemberIds.includes(member.id)
                    ? "In session"
                    : "Available"}
                </Tag>
              </td>
              {onEdit && (
                <td>
                  <Button
                    size="sm"
                    type="tertiary"
                    onClick={() => onEdit(member.id)}
                    aria-label={`Edit access for ${member.name}`}
                  >
                    Edit access
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function WorkspaceInvitation({
  inviter,
  workspace,
  email,
  tools,
  status = "pending",
  onAccept,
}: {
  inviter: string;
  workspace: string;
  email: string;
  tools: AccessTool[];
  status?: "pending" | "accepted" | "expired";
  onAccept?: () => void;
}) {
  return (
    <section className="wa-invitation">
      <div>
        <span className="wa-invite-symbol">
          <Icon name="columns" size="lg" />
        </span>
        <p className="wa-eyebrow">YOUR WORKSPACE IS READY</p>
        <h2>
          {inviter} invited you to {workspace}
        </h2>
        <p>
          One place for your team’s shared tools. Join as{" "}
          <strong>{email}</strong> and keep your work together.
        </p>
        <div className="wa-invite-action">
          {status === "pending" ? (
            onAccept && (
              <Button
                onClick={onAccept}
                trailingIcon={<Icon name="arrow-up-right" size="sm" />}
              >
                Accept demo invitation
              </Button>
            )
          ) : (
            <Tag color={status === "accepted" ? "mint" : "orange"}>
              {status === "accepted"
                ? "Invitation accepted"
                : "Invitation expired"}
            </Tag>
          )}
        </div>
        <p className="wa-invite-note">
          {status === "expired"
            ? "Ask your workspace owner for a new invitation."
            : "Local preview · no email is sent and no external app is opened."}
        </p>
      </div>
      <div className="wa-invite-tools">
        <h3>Apps you’re invited to</h3>
        {tools.length ? (
          tools.map((tool) => <ToolAccessRow key={tool.id} tool={tool} />)
        ) : (
          <p>
            No tools assigned yet. Your workspace owner can add access later.
          </p>
        )}
      </div>
    </section>
  );
}
