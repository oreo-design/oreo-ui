import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import {
  CommandSearch,
  DeploymentRow,
  WorkspaceMetric,
  type CommandGroup,
  type Deployment,
} from "@/components/command-search";
import { Icon, type IconName } from "@/components/icon";
import { Button, IconButton } from "@/components/button";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { SegmentedUsage } from "@/components/feature-cards";
import { DEPLOYMENTS, TRAFFIC } from "./data";
import "./command-dashboard.css";

type Page =
  | "overview"
  | "deployments"
  | "analytics"
  | "storage"
  | "resources"
  | "integrations"
  | "settings";
const pages: {
  id: Page;
  label: string;
  icon: IconName;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "columns",
    description: "A little context for everything you’re building.",
  },
  {
    id: "deployments",
    label: "Deployments",
    icon: "plane",
    description: "Every build, from first commit to ready.",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "chart-bar",
    description: "A week of traffic across your sample projects.",
  },
  {
    id: "storage",
    label: "Storage",
    icon: "folder",
    description: "The space behind your workspace.",
  },
  {
    id: "resources",
    label: "Resources",
    icon: "book-open",
    description: "Keep useful project links close at hand.",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "plug",
    description: "Manage connections in this local demo.",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "gear",
    description: "Make this workspace feel like yours.",
  },
];
export function CommandDashboard() {
  const [dark, setDark] = useThemeMode(true),
    [page, setPage] = useState<Page>("overview"),
    [workspace, setWorkspace] = useState("Oreo Studio"),
    [workspaceDraft, setWorkspaceDraft] = useState("Oreo Studio");
  const [deployments, setDeployments] = useState(DEPLOYMENTS),
    [selected, setSelected] = useState<string | null>(null),
    [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState([
      "oreo-web",
      "design-system",
      "customer-portal",
    ]),
    [creating, setCreating] = useState(false),
    [name, setName] = useState(""),
    [error, setError] = useState("");
  const [notice, setNotice] = useState(""),
    [connected, setConnected] = useState(false),
    [saved, setSaved] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null),
    projectInput = useRef<HTMLInputElement>(null);
  const current = pages.find((p) => p.id === page)!;
  const go = (id: Page) => {
    setPage(id);
    setSelected(null);
    setCreating(false);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  };
  const create = () => {
    setPage("overview");
    setCreating(true);
    setError("");
    requestAnimationFrame(() => projectInput.current?.focus());
  };
  const groups: CommandGroup[] = [
    {
      label: "Platform",
      items: pages.slice(0, 5).map((p) => ({
        id: p.id,
        label: p.label,
        keywords: `navigate ${p.description}`,
        icon: p.icon,
      })),
    },
    {
      label: "Developer",
      items: pages.slice(5).map((p) => ({
        id: p.id,
        label: p.label,
        keywords: p.description,
        icon: p.icon,
      })),
    },
    {
      label: "Actions",
      items: [
        {
          id: "create",
          label: "Create project",
          keywords: "new app website",
          icon: "plus",
        },
        {
          id: "theme",
          label: dark ? "Switch to light theme" : "Switch to dark theme",
          keywords: "appearance mode",
          icon: dark ? "sun" : "moon",
        },
      ],
    },
  ];
  const openDeployment = (d: Deployment) => {
    setPage("deployments");
    setSelected(d.id);
    setCreating(false);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const detail = deployments.find((d) => d.id === selected);
  const visible = deployments.filter(
    (d) => filter === "all" || d.status === filter,
  );
  const requests = TRAFFIC.reduce((n, d) => n + d.requests, 0);
  function saveProject(e: FormEvent) {
    e.preventDefault();
    const clean = name.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean) || clean.length > 40) {
      setError("Use 1–40 lowercase letters, numbers and single hyphens.");
      return;
    }
    if (projects.includes(clean)) {
      setError("A project with this name already exists.");
      return;
    }
    setProjects((p) => [...p, clean]);
    setCreating(false);
    setName("");
    setError("");
    setNotice(`${clean} created locally. No deployment was started.`);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function saveWorkspace(e: FormEvent) {
    e.preventDefault();
    if (!workspaceDraft.trim()) {
      setError("Enter a workspace name.");
      return;
    }
    setWorkspace(workspaceDraft.trim());
    setError("");
    setNotice("Workspace name saved for this session.");
  }
  const traffic = (
    <section className="cd-card cd-traffic" aria-labelledby="traffic-title">
      <header>
        <div>
          <h2 id="traffic-title">Request volume</h2>
          <p>Last 7 days · Sample traffic</p>
        </div>
        <Tag>7 days</Tag>
      </header>
      <div
        className="cd-bars"
        role="img"
        aria-label={TRAFFIC.map(
          (d) => `${d.day}: ${d.requests.toLocaleString("en-US")} requests`,
        ).join("; ")}
      >
        {TRAFFIC.map((d) => (
          <div key={d.day}>
            <span>{(d.requests / 1000).toFixed(1)}k</span>
            <i style={{ height: `${(d.requests / 36400) * 100}%` }} />
            <small>{d.day}</small>
          </div>
        ))}
      </div>
      <footer>
        {requests.toLocaleString("en-US")} requests this week{" "}
        <span>All data is illustrative</span>
      </footer>
    </section>
  );
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="command-dashboard">
        <aside className="cd-sidebar">
          <a className="cd-logo" href="/command-search">
            <span>
              <Icon name="columns" />
            </span>
            oreo<span className="cd-logo-dot">/</span>
          </a>
          <div className="cd-workspace">
            <Avatar agent="void" size="sm" />
            <span>
              {workspace}
              <small>Personal workspace</small>
            </span>
          </div>
          <span className="cd-nav-label">WORKSPACE</span>
          <nav aria-label="Workspace">
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-current={page === p.id ? "page" : undefined}
                onClick={() => go(p.id)}
              >
                <Icon name={p.icon} size="sm" />
                {p.label}
                {p.id === "deployments" && <small>{deployments.length}</small>}
              </button>
            ))}
          </nav>
          <div className="cd-sidebar-bottom">
            <p>Build something good.</p>
            <span>This is your space to start.</span>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={create}
              leadingIcon={<Icon name="plus" size="sm" />}
            >
              Create project
            </Button>
          </div>
          <a className="cd-docs" href="/command-search">
            <Icon name="book-open" size="sm" /> Component documentation{" "}
            <Icon name="arrow-up-right" size="sm" />
          </a>
        </aside>
        <div className="cd-main">
          <header className="cd-topbar">
            <span className="cd-breadcrumb">
              {workspace}
              <span>/</span>
              <strong>{current.label}</strong>
            </span>
            <div className="cd-topbar-actions">
              <CommandSearch
                groups={groups}
                shortcuts
                onSelect={(command) => {
                  if (command.id === "theme") {
                    setDark((d) => !d);
                    setNotice("Theme updated.");
                  } else if (command.id === "create") create();
                  else go(command.id as Page);
                }}
              />
              <IconButton
                type="secondary"
                tapScale={1}
                aria-label={
                  dark ? "Switch to light theme" : "Switch to dark theme"
                }
                onClick={() => setDark((d) => !d)}
                icon={<Icon name={dark ? "sun" : "moon"} />}
              />
              <span className="cd-profile">
                <Avatar name="Alex Morgan" size="sm" />
              </span>
            </div>
          </header>
          <main>
            <div className="cd-heading">
              <div>
                <p>YOUR WORKSPACE, AT A GLANCE</p>
                <h1 ref={heading} tabIndex={-1}>
                  {current.label}
                </h1>
                <span>{current.description}</span>
              </div>
              <Button
                tapScale={1}
                onClick={create}
                leadingIcon={<Icon name="plus" size="sm" />}
              >
                New project
              </Button>
            </div>
            <nav className="cd-mobile-nav" aria-label="Workspace pages">
              {pages.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  aria-current={page === p.id ? "page" : undefined}
                  onClick={() => go(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </nav>
            {notice && (
              <div className="cd-notice" role="status">
                <Icon name="check" size="sm" />
                {notice}
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => setNotice("")}
                >
                  <Icon name="x" size="sm" />
                </button>
              </div>
            )}
            {creating && (
              <form
                className="cd-card cd-form"
                onSubmit={saveProject}
                noValidate
              >
                <h2>Create a project</h2>
                <p>
                  Give your next idea a home. This only creates a local draft.
                </p>
                <label>
                  Project name
                  <input
                    ref={projectInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="my-next-project"
                    maxLength={40}
                    aria-invalid={!!error}
                  />
                </label>
                {error && (
                  <p role="alert" className="cd-error">
                    {error}
                  </p>
                )}
                <div>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => {
                      setCreating(false);
                      setError("");
                      heading.current?.focus();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button render={<button type="submit" />} tapScale={1}>
                    Create project
                  </Button>
                </div>
              </form>
            )}
            {page === "overview" && (
              <>
                <div className="cd-metrics">
                  <WorkspaceMetric
                    label="Total projects"
                    value={String(projects.length).padStart(2, "0")}
                    detail="All projects in this workspace"
                    icon={<Icon name="folder" />}
                  />
                  <WorkspaceMetric
                    label="Ready deployments"
                    value={String(
                      deployments.filter((d) => d.status === "ready").length,
                    ).padStart(2, "0")}
                    detail={`${deployments.length} builds in this sample`}
                    icon={<Icon name="check" />}
                  />
                  <WorkspaceMetric
                    label="Requests"
                    value={`${(requests / 1000).toFixed(1)}k`}
                    detail="Across the last 7 days"
                    icon={<Icon name="chart-bar" />}
                  />
                  <WorkspaceMetric
                    label="Storage used"
                    value="2.4 GB"
                    detail="24% of your 10 GB allowance"
                    icon={<Icon name="gauge" />}
                  />
                </div>
                <div className="cd-overview-grid">
                  {traffic}
                  <section className="cd-card cd-projects">
                    <header>
                      <h2>Your projects</h2>
                      <span>{projects.length}</span>
                    </header>
                    <ul>
                      {projects.map((p) => (
                        <li key={p}>
                          <span className="cd-project-icon">
                            <Icon name="folder" size="sm" />
                          </span>
                          <span>
                            {p}
                            <small>
                              {deployments.some(
                                (d) => d.name === p && d.status === "failed",
                              )
                                ? "Needs attention"
                                : "Ready to build"}
                            </small>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      type="tertiary"
                      tapScale={1}
                      onClick={create}
                      leadingIcon={<Icon name="plus" size="sm" />}
                    >
                      Add a project
                    </Button>
                  </section>
                </div>
                <section className="cd-card">
                  <header>
                    <div>
                      <h2>Recent deployments</h2>
                      <p>The latest changes across your projects</p>
                    </div>
                    <button
                      type="button"
                      className="cd-text-button"
                      onClick={() => go("deployments")}
                    >
                      View all <Icon name="arrow-up-right" size="sm" />
                    </button>
                  </header>
                  {deployments.slice(0, 3).map((d) => (
                    <DeploymentRow
                      key={d.id}
                      deployment={d}
                      onOpen={openDeployment}
                    />
                  ))}
                </section>
              </>
            )}
            {page === "deployments" && (
              <>
                <div
                  className="cd-filter"
                  role="group"
                  aria-label="Deployment status"
                >
                  {["all", "ready", "failed"].map((s) => (
                    <button
                      type="button"
                      key={s}
                      aria-pressed={filter === s}
                      onClick={() => setFilter(s)}
                    >
                      {s[0].toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                {detail && (
                  <section className="cd-card cd-detail">
                    <header>
                      <div>
                        <h2>{detail.name}</h2>
                        <p>
                          {detail.id} · {detail.branch} · {detail.commit}
                        </p>
                      </div>
                      <IconButton
                        type="tertiary"
                        aria-label="Close deployment details"
                        tapScale={1}
                        onClick={() => {
                          setSelected(null);
                          requestAnimationFrame(() => heading.current?.focus());
                        }}
                        icon={<Icon name="x" />}
                      />
                    </header>
                    <div>
                      <Tag color={detail.status === "ready" ? "mint" : "pink"}>
                        {detail.status === "ready" ? "Ready" : "Failed"}
                      </Tag>
                      <p>
                        {detail.status === "failed"
                          ? "Build stopped: missing PUBLIC_APP_URL in the sample environment. Retry uses a corrected local fixture."
                          : "Build completed. This is a local record, not a live deployment."}
                      </p>
                      <pre>
                        {detail.status === "failed"
                          ? "> Checking environment\n× Missing PUBLIC_APP_URL\n  Build stopped."
                          : "> Installing dependencies\n> Building application\n✓ Static output ready"}
                      </pre>
                      {detail.status === "failed" && (
                        <Button
                          type="secondary"
                          tapScale={1}
                          onClick={() => {
                            setDeployments((items) =>
                              items.map((d) =>
                                d.id === detail.id
                                  ? { ...d, status: "ready" }
                                  : d,
                              ),
                            );
                            setNotice(
                              `${detail.name}: local retry completed. No remote deployment occurred.`,
                            );
                            requestAnimationFrame(() =>
                              heading.current?.focus(),
                            );
                          }}
                        >
                          Retry local build
                        </Button>
                      )}
                    </div>
                  </section>
                )}
                <section className="cd-card">
                  {visible.length ? (
                    visible.map((d) => (
                      <DeploymentRow
                        key={d.id}
                        deployment={d}
                        onOpen={openDeployment}
                      />
                    ))
                  ) : (
                    <AgentWorkspaceState
                      title="No deployments in this view"
                      description="Try another status to see your recent builds."
                      actionLabel="Show all"
                      onAction={() => {
                        setFilter("all");
                        requestAnimationFrame(() => heading.current?.focus());
                      }}
                    />
                  )}
                </section>
              </>
            )}
            {page === "analytics" && (
              <>
                <div className="cd-metrics">
                  <WorkspaceMetric
                    label="Total requests"
                    value={requests.toLocaleString("en-US")}
                    detail="Last 7 days"
                  />
                  <WorkspaceMetric
                    label="Daily average"
                    value={Math.round(requests / 7).toLocaleString("en-US")}
                    detail="Across seven sample days"
                  />
                </div>
                {traffic}
              </>
            )}
            {page === "storage" && (
              <section className="cd-card cd-storage">
                <h2>Workspace storage</h2>
                <p>Assets and build output · Local sample usage</p>
                <SegmentedUsage
                  label="Storage capacity"
                  segments={[
                    { label: "Project assets", value: 16, tone: "purple" },
                    { label: "Build artifacts", value: 8, tone: "mint" },
                  ]}
                />
                <dl>
                  <div>
                    <dt>Project assets</dt>
                    <dd>1.6 GB</dd>
                  </div>
                  <div>
                    <dt>Build artifacts</dt>
                    <dd>0.8 GB</dd>
                  </div>
                  <div>
                    <dt>Available</dt>
                    <dd>7.6 GB</dd>
                  </div>
                </dl>
              </section>
            )}
            {page === "resources" && (
              <section className="cd-card">
                <header>
                  <h2>Workspace resources</h2>
                  <span>{saved.length} saved</span>
                </header>
                {[
                  {
                    id: "components",
                    label: "Component library",
                    detail: "Explore the Oreo UI primitives used here.",
                    url: "/command-search",
                  },
                  {
                    id: "patterns",
                    label: "Invoice Workspace",
                    detail:
                      "A complete billing template with editable local data.",
                    url: "/invoice-workspace",
                  },
                  {
                    id: "updates",
                    label: "Changelog",
                    detail: "See what is new in the library.",
                    url: "/changelog",
                  },
                ].map((r) => (
                  <article className="cd-resource" key={r.id}>
                    <Icon name="book-open" />
                    <div>
                      <a href={r.url}>
                        {r.label} <Icon name="arrow-up-right" size="sm" />
                      </a>
                      <p>{r.detail}</p>
                    </div>
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      aria-label={`${saved.includes(r.id) ? "Unsave" : "Save"} ${r.label}`}
                      aria-pressed={saved.includes(r.id)}
                      onClick={() =>
                        setSaved((list) =>
                          list.includes(r.id)
                            ? list.filter((id) => id !== r.id)
                            : [...list, r.id],
                        )
                      }
                      icon={
                        <Icon
                          name="star"
                          weight={saved.includes(r.id) ? "fill" : "regular"}
                        />
                      }
                    />
                  </article>
                ))}
              </section>
            )}
            {page === "integrations" && (
              <section className="cd-card cd-integration">
                <Icon name="github-logo" size="xl" />
                <h2>GitHub</h2>
                <p>
                  Connect project activity to your workspace. This demo changes
                  only a local connection state.
                </p>
                <Tag color={connected ? "mint" : "default"}>
                  {connected ? "Connected · demo" : "Not connected"}
                </Tag>
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={() => {
                    setConnected(!connected);
                    setNotice(
                      connected
                        ? "Demo connection removed."
                        : "GitHub connected in the local demo. No account access was requested.",
                    );
                  }}
                >
                  {connected ? "Disconnect demo" : "Connect demo"}
                </Button>
              </section>
            )}
            {page === "settings" && (
              <form
                className="cd-card cd-form"
                onSubmit={saveWorkspace}
                noValidate
              >
                <h2>Workspace details</h2>
                <p>Changes stay in this browser page and reset on reload.</p>
                <label>
                  Workspace name
                  <input
                    value={workspaceDraft}
                    onChange={(e) => setWorkspaceDraft(e.target.value)}
                    maxLength={40}
                    aria-invalid={!!error}
                  />
                </label>
                {error && (
                  <p role="alert" className="cd-error">
                    {error}
                  </p>
                )}
                <div>
                  <Button render={<button type="submit" />} tapScale={1}>
                    Save changes
                  </Button>
                </div>
                <div className="cd-theme-setting">
                  <span>Appearance</span>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => setDark(!dark)}
                  >
                    {dark ? "Use light theme" : "Use dark theme"}
                  </Button>
                </div>
              </form>
            )}
            <footer className="cd-footer">
              <span>Local demo · Changes reset on reload</span>
              <a
                href="https://x.com/efferdco/status/2110449789066490250"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Efferd <Icon name="arrow-up-right" size="sm" />
              </a>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
