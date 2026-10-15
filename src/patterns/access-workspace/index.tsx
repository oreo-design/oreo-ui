import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { WorkspaceMetric } from "@/components/command-search";
import { AgentWorkspaceState } from "@/components/automation";
import { SettingsRow } from "@/patterns/settings/rows";
import {
  WorkspaceSetup,
  ToolAccessRow,
  MemberAccessTable,
  WorkspaceInvitation,
  type AccessMember,
} from "@/components/workspace-access";
import {
  ACCESS_TOOLS,
  ACCESS_MEMBERS,
  ACCESS_SESSIONS,
  SETUP_STEPS,
  type AccessInvite,
} from "./data";
import "./access-workspace.css";
const SECTIONS = [
  { name: "Dashboard", icon: "columns" },
  { name: "Tools", icon: "plug" },
  { name: "Team", icon: "users" },
  { name: "Sessions", icon: "clock-history" },
  { name: "Audit", icon: "list-checks" },
  { name: "Settings", icon: "gear" },
] as const;
type Section = (typeof SECTIONS)[number]["name"];
export function AccessWorkspacePage() {
  const [section, setSection] = useState<Section>("Dashboard"),
    [dark, setDark] = useState(false);
  const [tools, setTools] = useState(ACCESS_TOOLS),
    [members, setMembers] = useState(ACCESS_MEMBERS),
    [sessions, setSessions] = useState(ACCESS_SESSIONS);
  const [invites, setInvites] = useState<AccessInvite[]>([
    {
      id: "invite-initial",
      email: "riley@studio.example",
      role: "Member",
      tools: ["frame", "figma"],
    },
  ]);
  const [preview, setPreview] = useState<AccessInvite | null>(null),
    [accepted, setAccepted] = useState(false);
  const [audit, setAudit] = useState(["Workspace opened · October 15, 2026"]),
    [notice, setNotice] = useState("");
  const [search, setSearch] = useState(""),
    [sessionFilter, setSessionFilter] = useState("Live");
  const [settings, setSettings] = useState({
      role: "Member" as "Member" | "Admin",
      access: "none",
      limit: 2,
    }),
    [draft, setDraft] = useState(settings);
  const [editor, setEditor] = useState<
      "invite" | "member" | "tool" | "session" | null
    >(null),
    [editId, setEditId] = useState("");
  const [email, setEmail] = useState(""),
    [role, setRole] = useState<AccessMember["role"]>("Member"),
    [grants, setGrants] = useState<string[]>([]);
  const [toolName, setToolName] = useState(""),
    [selectedMember, setSelectedMember] = useState("sophia"),
    [selectedTool, setSelectedTool] = useState("claude"),
    [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null),
    origin = useRef<HTMLElement | null>(null),
    fallback = useRef<HTMLButtonElement>(null),
    first = useRef<HTMLInputElement>(null);
  const live = sessions.filter((s) => !s.ended),
    needs = tools.filter((t) => !t.ready);
  const record = (message: string) => {
    setNotice(message);
    setAudit((a) => [message, ...a]);
  };
  const open = (kind: NonNullable<typeof editor>, id?: string) => {
    origin.current = document.activeElement as HTMLElement;
    setEditor(kind);
    setError("");
    if (kind === "member") {
      const m = members.find((m) => m.id === id)!;
      setEditId(m.id);
      setRole(m.role);
      setGrants([...m.tools]);
    }
    if (kind === "invite") {
      setEmail("");
      setRole(settings.role);
      setGrants(settings.access === "all" ? tools.map((t) => t.id) : []);
    }
    if (kind === "tool") setToolName("");
  };
  const go = (next: Section) => {
    setSection(next);
    setPreview(null);
    setSearch("");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (editor === "invite") {
      const value = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError("Enter a valid email address.");
        return;
      }
      if (
        members.some((m) => m.email.toLowerCase() === value) ||
        invites.some((i) => i.email === value)
      ) {
        setError(
          "This email already belongs to a member or pending invitation.",
        );
        return;
      }
      setInvites((list) => [
        ...list,
        {
          id: crypto.randomUUID(),
          email: value,
          role: role === "Admin" ? "Admin" : "Member",
          tools: [...grants],
        },
      ]);
      record(`Demo invitation created for ${value}. No email sent.`);
    } else if (editor === "member") {
      const m = members.find((m) => m.id === editId)!;
      setMembers((list) =>
        list.map((member) =>
          member.id === editId
            ? {
                ...member,
                role: m.role === "Owner" ? "Owner" : role,
                tools: [...grants],
              }
            : member,
        ),
      );
      setSessions((list) =>
        list.map((s) =>
          s.member === editId && !s.ended && !grants.includes(s.tool)
            ? {
                ...s,
                ended: new Date().toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : s,
        ),
      );
      record(`Access updated for ${m.name}. Sessions for removed tools ended.`);
    } else if (editor === "tool") {
      const name = toolName.trim();
      if (!name) {
        setError("Enter a tool name.");
        return;
      }
      if (tools.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
        setError("This tool is already connected.");
        return;
      }
      const id = crypto.randomUUID();
      setTools((list) => [
        ...list,
        {
          id,
          name,
          description: "A shared workspace tool",
          mark: name[0].toUpperCase(),
          tone: "blue",
          ready: false,
        },
      ]);
      setMembers((list) =>
        list.map((m) =>
          m.role === "Owner" ? { ...m, tools: [...m.tools, id] } : m,
        ),
      );
      record(
        `${name} connected. Prepare demo access before starting a session.`,
      );
    } else if (editor === "session") {
      const member = members.find((m) => m.id === selectedMember),
        tool = tools.find((t) => t.id === selectedTool);
      if (!member || !tool || !member.tools.includes(tool.id)) {
        setError("Assign this tool to the selected member first.");
        return;
      }
      if (!tool.ready) {
        setError("Prepare demo access for this tool first.");
        return;
      }
      if (live.some((s) => s.member === member.id && s.tool === tool.id)) {
        setError("This member already has a live session in this tool.");
        return;
      }
      if (live.filter((s) => s.member === member.id).length >= settings.limit) {
        setError(
          `This member has reached the ${settings.limit}-session limit. End a session first.`,
        );
        return;
      }
      setSessions((list) => [
        {
          id: crypto.randomUUID(),
          member: member.id,
          tool: tool.id,
          started: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...list,
      ]);
      record(`Demo session started: ${member.name} → ${tool.name}.`);
    }
    setEditor(null);
  };
  const accept = () => {
    if (!preview || accepted || !invites.some((i) => i.id === preview.id))
      return;
    setMembers((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        name: preview.email.split("@")[0],
        email: preview.email,
        role: preview.role,
        tools: [...preview.tools],
      },
    ]);
    setInvites((list) => list.filter((i) => i.id !== preview.id));
    setAccepted(true);
    record(`${preview.email} joined the demo workspace.`);
  };
  const end = (id: string) => {
    setSessions((list) =>
      list.map((s) =>
        s.id === id
          ? {
              ...s,
              ended: new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : s,
      ),
    );
    record("Demo session ended.");
  };
  const changed = JSON.stringify(draft) !== JSON.stringify(settings);
  return (
    <div ref={root} className={`access-workspace ${dark ? "theme-dark" : ""}`}>
      <div className="aw-window">
        <header className="aw-chrome">
          <a href="/workspace-setup" aria-label="Oreo UI components">
            <Icon name="columns" size="md" />
          </a>
          <span className="aw-chrome-divider" />
          <span>Oreo / Access workspace</span>
          <div className="aw-chrome-right">
            <span>Local demo</span>
            <IconButton
              type="tertiary"
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark((v) => !v)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
          </div>
        </header>
        <div className="aw-layout">
          <aside className="aw-sidebar">
            <div className="aw-brand">
              <span className="aw-brand-mark">
                <Icon name="columns" size="md" />
              </span>
              <div>
                <strong>Studio workspace</strong>
                <small>Good work starts here.</small>
              </div>
            </div>
            <p className="aw-nav-label">WORKSPACE</p>
            <nav aria-label="Workspace sections">
              {SECTIONS.map((item) => (
                <button
                  key={item.name}
                  aria-current={
                    !preview && section === item.name ? "page" : undefined
                  }
                  onClick={() => go(item.name)}
                >
                  <Icon name={item.icon as IconName} size="md" />
                  {item.name}
                  {item.name === "Team" && <span>{members.length}</span>}
                </button>
              ))}
            </nav>
            <div className="aw-sidebar-foot">
              <Icon name="lock" size="md" />
              <p>
                A place for every tool.
                <br />
                Access for every teammate.
              </p>
              <a href="/member-access-table">
                Explore the components <Icon name="arrow-up-right" size="sm" />
              </a>
            </div>
            <div className="aw-profile">
              <Avatar name="Sophia Williams" size="sm" />
              <div>
                <strong>Sophia Williams</strong>
                <small>Workspace owner</small>
              </div>
            </div>
          </aside>
          <main className="aw-main">
            <header className="aw-heading">
              <div>
                <div className="aw-breadcrumb">
                  Studio workspace <span>/</span>{" "}
                  {preview ? "Invitation" : section}
                </div>
                <h1>{preview ? "A warm welcome." : section}</h1>
                <p>
                  {preview
                    ? "Preview a teammate’s invitation."
                    : {
                        Dashboard:
                          "A little overview of everything happening in your workspace.",
                        Tools: "All your team’s tools, thoughtfully connected.",
                        Team: "Good people. The right access.",
                        Sessions: "See who’s working, and where.",
                        Audit: "A clear record of changes made in this demo.",
                        Settings: "Make this workspace work for you.",
                      }[section]}
                </p>
              </div>
              <div className="aw-actions">
                {preview ? (
                  <Button type="secondary" onClick={() => setPreview(null)}>
                    Back to team
                  </Button>
                ) : section === "Settings" ? (
                  <>
                    <Button
                      type="secondary"
                      disabled={!changed}
                      onClick={() => setDraft(settings)}
                    >
                      Discard
                    </Button>
                    <Button
                      disabled={!changed}
                      onClick={() => {
                        setSettings({ ...draft });
                        record(
                          "Workspace defaults saved. Existing access and live sessions are unchanged.",
                        );
                      }}
                    >
                      Save changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="secondary" onClick={() => open("invite")}>
                      Invite member
                    </Button>
                    <Button
                      render={<button ref={fallback} />}
                      leadingIcon={<Icon name="plus" size="sm" />}
                      onClick={() =>
                        open(section === "Sessions" ? "session" : "tool")
                      }
                    >
                      {section === "Sessions"
                        ? "Start session"
                        : "Connect tool"}
                    </Button>
                  </>
                )}
              </div>
            </header>
            <div className="aw-notice" role="status" aria-live="polite">
              {notice ||
                "Sample workspace · changes reset on reload · no credentials or external connections"}
            </div>
            {preview ? (
              <div className="aw-panel">
                <WorkspaceInvitation
                  inviter="Sophia"
                  workspace="Studio workspace"
                  email={preview.email}
                  tools={tools.filter((t) => preview.tools.includes(t.id))}
                  status={accepted ? "accepted" : "pending"}
                  onAccept={accept}
                />
              </div>
            ) : (
              <>
                {section === "Dashboard" && (
                  <>
                    <div className="aw-overview">
                      <span>
                        <Icon name="calendar" size="sm" /> October 15, 2026
                      </span>
                      <Tag>Workspace snapshot</Tag>
                    </div>
                    <section
                      className="aw-metrics"
                      aria-label="Workspace overview"
                    >
                      <WorkspaceMetric
                        label="Live sessions"
                        value={String(live.length)}
                        detail="Working together, right now"
                        icon={<Icon name="clock-history" />}
                      />
                      <WorkspaceMetric
                        label="Tools connected"
                        value={String(tools.length)}
                        detail={`${tools.filter((t) => t.ready).length} ready to open`}
                        icon={<Icon name="plug" />}
                      />
                      <WorkspaceMetric
                        label="Team members"
                        value={String(members.length)}
                        detail={`${invites.length} invitation${invites.length === 1 ? "" : "s"} pending`}
                        icon={<Icon name="users" />}
                      />
                      <WorkspaceMetric
                        label="Needs attention"
                        value={String(needs.length)}
                        detail="Tools waiting for setup"
                        icon={<Icon name="warning-circle" />}
                      />
                    </section>
                    <section className="aw-panel aw-setup-panel">
                      <WorkspaceSetup
                        steps={SETUP_STEPS.map((s, i) => ({
                          ...s,
                          complete: i === 2 ? needs.length === 0 : s.complete,
                          description:
                            i === 2
                              ? `${needs.length} tool${needs.length === 1 ? "" : "s"} waiting for setup`
                              : s.description,
                        }))}
                        onSelect={(id) =>
                          go(id.startsWith("Tools") ? "Tools" : "Team")
                        }
                      />
                    </section>
                    <div className="aw-dashboard-grid">
                      <section className="aw-panel aw-list-panel">
                        <div className="aw-panel-title">
                          <h2>Your tools</h2>
                          <button onClick={() => go("Tools")}>
                            View all <Icon name="arrow-up-right" size="sm" />
                          </button>
                        </div>
                        {tools.slice(0, 4).map((tool) => (
                          <ToolAccessRow
                            key={tool.id}
                            tool={tool}
                            detail={`${members.filter((m) => m.tools.includes(tool.id)).length} people have access`}
                            action={
                              <Tag color={tool.ready ? "mint" : "orange"}>
                                {tool.ready ? "Ready" : "Setup"}
                              </Tag>
                            }
                          />
                        ))}
                      </section>
                      <section className="aw-panel aw-list-panel">
                        <div className="aw-panel-title">
                          <h2>People at work</h2>
                          <button onClick={() => go("Sessions")}>
                            View all <Icon name="arrow-up-right" size="sm" />
                          </button>
                        </div>
                        {live.length ? (
                          live.slice(0, 4).map((s) => (
                            <div key={s.id} className="aw-activity-person">
                              <Avatar
                                name={
                                  members.find((m) => m.id === s.member)?.name
                                }
                                size="sm"
                              />
                              <div>
                                <strong>
                                  {members.find((m) => m.id === s.member)?.name}
                                </strong>
                                <small>
                                  {tools.find((t) => t.id === s.tool)?.name} ·
                                  since {s.started}
                                </small>
                              </div>
                              <span
                                className="aw-online"
                                aria-label="In session"
                              />
                            </div>
                          ))
                        ) : (
                          <AgentWorkspaceState
                            title="A quiet moment"
                            description="Live sessions will appear here."
                          />
                        )}
                      </section>
                      <section className="aw-panel aw-attention">
                        <span className="aw-attention-icon">
                          <Icon
                            name={needs.length ? "warning-circle" : "checks"}
                            size="lg"
                          />
                        </span>
                        <h2>
                          {needs.length
                            ? "A little attention goes a long way."
                            : "Everything is ready."}
                        </h2>
                        <p>
                          {needs.length
                            ? `${needs.map((t) => t.name).join(", ")} ${needs.length === 1 ? "needs" : "need"} setup before your team can start a demo session.`
                            : "Your team’s connected tools are ready for their next session."}
                        </p>
                        <Button
                          type="secondary"
                          trailingIcon={
                            <Icon name="arrow-up-right" size="sm" />
                          }
                          onClick={() =>
                            go(needs.length ? "Tools" : "Sessions")
                          }
                        >
                          {needs.length ? "Review tools" : "View sessions"}
                        </Button>
                      </section>
                    </div>
                  </>
                )}
                {section === "Tools" && (
                  <section className="aw-panel aw-list-panel">
                    <div className="aw-panel-title">
                      <h2>
                        Connected tools <span>{tools.length}</span>
                      </h2>
                    </div>
                    {tools.map((tool) => (
                      <ToolAccessRow
                        key={tool.id}
                        tool={tool}
                        detail={`${tool.description} · ${members.filter((m) => m.tools.includes(tool.id)).length} members`}
                        action={
                          tool.ready ? (
                            <Tag color="mint">Ready</Tag>
                          ) : (
                            <Button
                              size="sm"
                              type="secondary"
                              onClick={() => {
                                setTools((list) =>
                                  list.map((t) =>
                                    t.id === tool.id
                                      ? { ...t, ready: true }
                                      : t,
                                  ),
                                );
                                record(`${tool.name} demo access prepared.`);
                              }}
                            >
                              Prepare demo access
                            </Button>
                          )
                        }
                      />
                    ))}
                  </section>
                )}
                {section === "Team" && (
                  <>
                    <section className="aw-panel">
                      <div className="aw-panel-title aw-pad">
                        <h2>
                          Active members <span>{members.length}</span>
                        </h2>
                        <label className="aw-search">
                          <Icon name="search" size="sm" />
                          <input
                            aria-label="Search members"
                            placeholder="Search members…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </label>
                      </div>
                      <MemberAccessTable
                        members={members.filter((m) =>
                          `${m.name} ${m.email}`
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                        )}
                        tools={tools}
                        activeMemberIds={live.map((s) => s.member)}
                        onEdit={(id) => open("member", id)}
                      />
                    </section>
                    <section className="aw-panel aw-list-panel">
                      <div className="aw-panel-title">
                        <h2>
                          Pending invitations <span>{invites.length}</span>
                        </h2>
                      </div>
                      {invites.length ? (
                        invites.map((invite) => (
                          <div className="aw-pending" key={invite.id}>
                            <span className="aw-pending-copy">
                              <strong>{invite.email}</strong>
                              <small>
                                {invite.role} · {invite.tools.length} tools
                              </small>
                            </span>
                            <Tag color="orange">Pending</Tag>
                            <Button
                              size="sm"
                              type="secondary"
                              onClick={() => {
                                setPreview(invite);
                                setAccepted(false);
                              }}
                            >
                              Preview invite
                            </Button>
                            <IconButton
                              type="tertiary"
                              aria-label={`Revoke invitation for ${invite.email}`}
                              onClick={() => {
                                setInvites((list) =>
                                  list.filter((i) => i.id !== invite.id),
                                );
                                record(
                                  `Invitation revoked for ${invite.email}.`,
                                );
                              }}
                              icon={<Icon name="x" size="sm" />}
                            />
                          </div>
                        ))
                      ) : (
                        <AgentWorkspaceState
                          title="Everyone’s here"
                          description="New invitations will appear here until they’re accepted."
                        />
                      )}
                    </section>
                  </>
                )}
                {section === "Sessions" && (
                  <section className="aw-panel aw-list-panel">
                    <div className="aw-panel-title">
                      <h2>Workspace sessions</h2>
                      <select
                        aria-label="Session status"
                        value={sessionFilter}
                        onChange={(e) => setSessionFilter(e.target.value)}
                      >
                        <option>Live</option>
                        <option>Ended</option>
                        <option>All</option>
                      </select>
                    </div>
                    {sessions.filter(
                      (s) =>
                        sessionFilter === "All" ||
                        (sessionFilter === "Live" ? !s.ended : !!s.ended),
                    ).length ? (
                      sessions
                        .filter(
                          (s) =>
                            sessionFilter === "All" ||
                            (sessionFilter === "Live" ? !s.ended : !!s.ended),
                        )
                        .map((s) => (
                          <div className="aw-pending" key={s.id}>
                            <Avatar
                              name={
                                members.find((m) => m.id === s.member)?.name
                              }
                              size="sm"
                            />
                            <span className="aw-pending-copy">
                              <strong>
                                {members.find((m) => m.id === s.member)?.name} ·{" "}
                                {tools.find((t) => t.id === s.tool)?.name}
                              </strong>
                              <small>
                                Started {s.started}
                                {s.ended
                                  ? ` · Ended ${s.ended}`
                                  : " · Local demo session"}
                              </small>
                            </span>
                            {s.ended ? (
                              <Tag>Ended</Tag>
                            ) : (
                              <Button
                                size="sm"
                                type="secondary"
                                onClick={() => end(s.id)}
                              >
                                End session
                              </Button>
                            )}
                          </div>
                        ))
                    ) : (
                      <AgentWorkspaceState
                        title="No sessions here"
                        description="Start a demo session or choose a different status."
                      />
                    )}
                  </section>
                )}
                {section === "Audit" && (
                  <section className="aw-panel aw-list-panel">
                    <div className="aw-panel-title">
                      <h2>Workspace activity</h2>
                      <Tag>{audit.length} events</Tag>
                    </div>
                    <ol className="aw-audit">
                      {audit.map((event, i) => (
                        <li key={`${event}-${audit.length - i}`}>
                          <span>
                            <Icon name="check" size="sm" />
                          </span>
                          <p>{event}</p>
                          <small>#{audit.length - i}</small>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
                {section === "Settings" && (
                  <section className="aw-panel aw-settings">
                    <div className="aw-panel-title">
                      <h2>Workspace defaults</h2>
                      <Tag>Workspace</Tag>
                    </div>
                    <SettingsRow
                      title="Default member role"
                      description="Preselected when you create a new invitation."
                      control={
                        <select
                          aria-label="Default member role"
                          value={draft.role}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              role: e.target.value as "Admin" | "Member",
                            })
                          }
                        >
                          <option>Member</option>
                          <option>Admin</option>
                        </select>
                      }
                    />
                    <SettingsRow
                      title="Default tool access"
                      description="Choose which tools new invitees start with."
                      control={
                        <select
                          aria-label="Default tool access"
                          value={draft.access}
                          onChange={(e) =>
                            setDraft({ ...draft, access: e.target.value })
                          }
                        >
                          <option value="none">No tools yet</option>
                          <option value="all">Every shared tool</option>
                        </select>
                      }
                    />
                    <SettingsRow
                      title="Simultaneous sessions"
                      description="Maximum live sessions per member. Applies when a new session starts."
                      control={
                        <select
                          aria-label="Simultaneous sessions"
                          value={draft.limit}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              limit: Number(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} per member
                            </option>
                          ))}
                        </select>
                      }
                    />
                    <div className="aw-settings-note">
                      <Icon name="info" size="sm" />
                      <p>
                        Roles and access are sample data in this template. A
                        real app must enforce authorization and session limits
                        on its server.
                      </p>
                    </div>
                  </section>
                )}
              </>
            )}
            <footer className="aw-footer">
              <span>Built for a little less friction.</span>
              <a
                href="https://kargul.studio/work/uniops"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Marcel Kargul{" "}
                <Icon name="arrow-up-right" size="sm" />
              </a>
            </footer>
          </main>
        </div>
      </div>
      <Dialog.Root
        open={editor !== null}
        onOpenChange={(value) => {
          if (!value) setEditor(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="aw-backdrop" />
          <Dialog.Popup
            className="aw-dialog"
            initialFocus={
              editor === "invite" || editor === "tool" ? first : undefined
            }
            finalFocus={() =>
              origin.current?.isConnected ? origin.current : fallback.current
            }
          >
            <form onSubmit={submit}>
              <header>
                <div>
                  <Dialog.Title>
                    {editor === "invite"
                      ? "Invite a teammate"
                      : editor === "member"
                        ? "Edit member access"
                        : editor === "tool"
                          ? "Connect a tool"
                          : "Start a demo session"}
                  </Dialog.Title>
                  <Dialog.Description>
                    Local workspace preview. No email, password or external app
                    connection.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      aria-label="Close dialog"
                      icon={<Icon name="x" />}
                    />
                  }
                />
              </header>
              <div className="aw-dialog-body">
                {editor === "invite" && (
                  <label>
                    Email address
                    <input
                      ref={first}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teammate@studio.example"
                      required
                      maxLength={180}
                    />
                  </label>
                )}
                {(editor === "invite" || editor === "member") && (
                  <>
                    {role === "Owner" ? (
                      <p>Workspace owner</p>
                    ) : (
                      <label>
                        Role
                        <select
                          value={role}
                          onChange={(e) =>
                            setRole(e.target.value as "Admin" | "Member")
                          }
                        >
                          <option>Member</option>
                          <option>Admin</option>
                        </select>
                      </label>
                    )}
                    <fieldset>
                      <legend>Assigned tools</legend>
                      {tools.map((t) => (
                        <label key={t.id} className="aw-check">
                          <input
                            type="checkbox"
                            checked={grants.includes(t.id)}
                            onChange={(e) =>
                              setGrants((list) =>
                                e.target.checked
                                  ? [...list, t.id]
                                  : list.filter((id) => id !== t.id),
                              )
                            }
                          />
                          <span>
                            {t.name}
                            <small>
                              {t.ready
                                ? "Ready for sessions"
                                : "Setup needed before opening"}
                            </small>
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}
                {editor === "tool" && (
                  <label>
                    Tool name
                    <input
                      ref={first}
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      placeholder="e.g. Linear"
                      maxLength={60}
                      required
                    />
                  </label>
                )}
                {editor === "session" && (
                  <>
                    <label>
                      Member
                      <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Tool
                      <select
                        value={selectedTool}
                        onChange={(e) => setSelectedTool(e.target.value)}
                      >
                        {tools.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                            {t.ready ? "" : " · setup needed"}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                {error && (
                  <p className="aw-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <footer>
                <Button type="secondary" onClick={() => setEditor(null)}>
                  Cancel
                </Button>
                <Button render={<button type="submit" />}>
                  {editor === "invite"
                    ? "Create demo invite"
                    : editor === "member"
                      ? "Save access"
                      : editor === "tool"
                        ? "Connect tool"
                        : "Start session"}
                </Button>
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
