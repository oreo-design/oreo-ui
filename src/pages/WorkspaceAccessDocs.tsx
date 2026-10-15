import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "workspace-setup": {
    name: "Workspace Setup",
    description:
      "A compact onboarding checklist with a shared progress indicator and host-owned next steps.",
    code: "<WorkspaceSetup steps={steps} onSelect={id => navigate(id)} />",
    rows: [
      {
        prop: "steps",
        type: "SetupStep[]",
        desc: "Unique id, title, description and complete flag. Progress is derived from these flags; an empty list is 0 of 0.",
      },
      {
        prop: "onSelect",
        type: "(id: string) => void",
        desc: "Optional. Without it, steps are informational text rather than inactive buttons.",
      },
    ],
  },
  "tool-access-row": {
    name: "Tool Access Row",
    description:
      "A compact shared-tool identity with a consistent mark, description and optional action slot.",
    code: '<ToolAccessRow tool={tool} detail="4 people have access" action={<Tag>Ready</Tag>} />',
    rows: [
      {
        prop: "tool",
        type: "AccessTool",
        desc: "id, name, description, mark, tone and ready. tone is mint, orange, purple or blue; readiness behavior is host-owned.",
      },
      {
        prop: "detail / action",
        type: "string / ReactNode",
        desc: "Override supporting copy and provide an optional status or action. No implicit navigation or external connection.",
      },
    ],
  },
  "member-access-table": {
    name: "Member Access Table",
    description:
      "Member identity, assigned tools and live-session status in an accessible, horizontally scrollable table.",
    code: "<MemberAccessTable members={members} tools={tools} activeMemberIds={ids} onEdit={edit} />",
    rows: [
      {
        prop: "members / tools",
        type: "AccessMember[] / AccessTool[]",
        desc: "Host-owned members and tool directory. Unknown tool IDs remain visible. Empty members use the shared workspace empty state.",
      },
      {
        prop: "activeMemberIds / onEdit",
        type: "string[] / (id: string) => void",
        desc: "Active session identities and optional edit callback. Without onEdit, the action column is omitted.",
      },
    ],
  },
  "workspace-invitation": {
    name: "Workspace Invitation",
    description:
      "An invitation acceptance panel with the workspace, recipient and assigned apps kept together.",
    code: '<WorkspaceInvitation inviter="Sophia" workspace="Studio" email="you@studio.example" tools={tools} onAccept={accept} />',
    rows: [
      {
        prop: "inviter / workspace / email",
        type: "string",
        desc: "Host-supplied invitation identity. Long email addresses wrap.",
      },
      {
        prop: "tools / status",
        type: 'AccessTool[] / "pending" | "accepted" | "expired"',
        desc: "Assigned apps and invitation state. No assigned apps has explicit copy. Accepted and expired states remove the acceptance action.",
      },
      {
        prop: "onAccept",
        type: "() => void",
        desc: "Optional host-owned action. The component never sends email, downloads an app or grants external access.",
      },
    ],
  },
};
export function WorkspaceAccessDocs({ nav }: { nav: DocsNav }) {
  const item =
    entries[nav.active as keyof typeof entries] ?? entries["workspace-setup"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", item.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {item.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {item.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/access-workspace"
            >
              Open Access Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${item.name.replaceAll(" ", "")} } from "@/components/workspace-access";\n\n${item.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={item.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Access Workspace combines these components with Button, Avatar,
              Tag, WorkspaceMetric, StepProgress, SettingsRow, the shared empty
              state and Base UI Dialog. Dashboard, Tools, Team, Sessions, Audit
              and Settings share one local dataset. Invite acceptance adds a
              member; revoking tool access ends that member’s affected sessions.
              New sessions validate grants, tool readiness, duplicate sessions
              and the saved member limit. Workspace defaults apply to new
              invitations; they do not rewrite existing grants. Modal forms
              support Escape, focus trapping and return focus.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The October 15, 2026 fixture resets on reload. Roles are
              illustrative; this frontend does not enforce real authorization,
              store credentials, send email, launch third-party apps or provide
              a security boundary. Connect a production backend for those
              capabilities. Invitation expiry is a controlled component state;
              the demo does not run an expiry timer.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/marcelkargul/status/2110467790343737666"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Marcel Kargul ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
