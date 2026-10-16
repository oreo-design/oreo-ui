import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { Switch } from "@/components/switch";
import {
  AgentWorkspaceNav,
  AgentWorkspaceState,
} from "@/components/automation";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { DashboardStatCard } from "@/components/dashboard-suite";
import { validateCondition } from "@/components/trace-query/model";
import {
  SegmentRuleBuilder,
  SegmentPreview,
  SubscriptionPlanPicker,
  RevenueTargetEditor,
  segmentFields,
  segmentCustomers,
  summarize,
  money,
  parseMoney,
  targetError,
  personError,
  nextRenewal,
  SOURCES,
  allocateTarget,
  type Customer,
  type Member,
  type Segment,
  type Target,
} from "@/components/subscription-operations";
import {
  PLANS,
  LEGS,
  TODAY,
  CUSTOMERS,
  MEMBERS,
  INITIAL_SEGMENT,
} from "./data";
import "./workspace.css";
type Mode = "segment" | "target" | "customer" | "member";
const descriptions = {
  segment: "Customers who match the rules · count updates as you edit",
  target: "Set a monthly goal and distribute it across your network.",
  customer: "Create a local subscription and assign it to a leg.",
  member: "Choose a sponsor. Their leg is inherited automatically.",
};
const titles = {
  segment: "New segment",
  target: "Set a revenue target",
  customer: "Add customer",
  member: "Add member",
};
const actions = {
  segment: "Save segment",
  target: "Save target",
  customer: "Add local customer",
  member: "Add local member",
};
const blankPerson = () => ({
  name: "",
  phone: "",
  planId: "plus",
  legId: LEGS[0].id,
  source: "Referral",
  start: TODAY,
  sponsorId: LEGS[0].id,
  welcome: true,
});
export function SubscriptionWorkspacePage() {
  const [customers, setCustomers] = useState(CUSTOMERS),
    [members, setMembers] = useState(MEMBERS),
    [segments, setSegments] = useState<Segment[]>([INITIAL_SEGMENT]),
    [target, setTarget] = useState<Target>({
      amount: "1800",
      month: "2026-10",
      split: true,
    }),
    [tab, setTab] = useState<"customers" | "members" | "revenue">("customers"),
    [selectedSegment, setSelectedSegment] = useState("all"),
    [query, setQuery] = useState(""),
    [dark, setDark] = useState(true),
    [mode, setMode] = useState<Mode | null>(null),
    [segmentDraft, setSegmentDraft] = useState<Segment>(INITIAL_SEGMENT),
    [targetDraft, setTargetDraft] = useState(target),
    [person, setPerson] = useState(blankPerson),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(
      "Local sample · no payments or messages are sent · resets on reload",
    ),
    [undo, setUndo] = useState<{
      customers: Customer[];
      members: Member[];
      segments: Segment[];
      target: Target;
    } | null>(null);
  const root = useRef<HTMLDivElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const summary = summarize(customers, PLANS, LEGS, TODAY),
    fields = segmentFields(PLANS, LEGS),
    selected = segments.find((s) => s.id === selectedSegment),
    filtered = (
      selected
        ? segmentCustomers(customers, selected, PLANS, LEGS, TODAY)
        : customers
    ).filter((c) =>
      `${c.name} ${c.phone}`.toLowerCase().includes(query.toLowerCase()),
    ),
    filteredMembers = members.filter((m) =>
      `${m.name} ${m.phone}`.toLowerCase().includes(query.toLowerCase()),
    ),
    sponsor = LEGS.find((l) => l.id === person.sponsorId)!,
    plan = PLANS.find((p) => p.id === person.planId)!,
    activeMembers = members.filter((m) => m.start <= TODAY),
    targetCents = parseMoney(target.amount) ?? 0,
    allocations = allocateTarget(targetCents, summary.groups);
  const open = (next: Mode, segment?: Segment) => {
    returnTo.current = document.activeElement as HTMLElement;
    setError("");
    setPerson(blankPerson());
    setTargetDraft(target);
    setSegmentDraft(
      segment
        ? { ...segment, rules: segment.rules.map((r) => ({ ...r })) }
        : {
            ...INITIAL_SEGMENT,
            id: crypto.randomUUID(),
            rules: INITIAL_SEGMENT.rules.map((r) => ({ ...r })),
          },
    );
    setMode(next);
  };
  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mode) return;
    let problem: string | null = null;
    if (mode === "segment")
      problem = !segmentDraft.name.trim()
        ? "Enter a segment name."
        : (segmentDraft.rules
            .map((r) => validateCondition(r, fields))
            .find(Boolean) ?? null);
    if (mode === "target") problem = targetError(targetDraft, TODAY);
    if (mode === "customer" || mode === "member")
      problem = personError(
        person.name,
        person.phone,
        person.start,
        mode === "customer" ? customers : members,
      );
    if (problem) {
      // Rule and target editors already expose their own inline errors.
      setError(
        mode === "target" || (mode === "segment" && segmentDraft.name.trim())
          ? ""
          : problem,
      );
      return;
    }
    setUndo({ customers, members, segments, target });
    if (mode === "segment") {
      const next = { ...segmentDraft, name: segmentDraft.name.trim() };
      setSegments((prev) =>
        prev.some((s) => s.id === next.id)
          ? prev.map((s) => (s.id === next.id ? next : s))
          : [...prev, next],
      );
      setSelectedSegment(next.id);
      setTab("customers");
      setQuery("");
      setNotice(`Saved “${next.name}” locally.`);
    }
    if (mode === "target") {
      setTarget(targetDraft);
      setTab("revenue");
      setNotice(
        `Saved ${money(parseMoney(targetDraft.amount)!)} target for ${targetDraft.month}.`,
      );
    }
    if (mode === "customer") {
      setCustomers((prev) => [
        {
          id: crypto.randomUUID(),
          name: person.name.trim(),
          phone: person.phone.trim(),
          planId: person.planId,
          legId: person.legId,
          source: person.source,
          start: person.start,
          active: true,
          risk: false,
        },
        ...prev,
      ]);
      setTab("customers");
      setSelectedSegment("all");
      setQuery("");
      setNotice(
        `${person.name.trim()} added locally. ${person.start > TODAY ? "Scheduled for " + person.start + "; current MRR unchanged." : "No payment was charged."}`,
      );
    }
    if (mode === "member") {
      setMembers((prev) => [
        {
          id: crypto.randomUUID(),
          name: person.name.trim(),
          phone: person.phone.trim(),
          sponsorId: person.sponsorId,
          start: person.start,
          welcome: person.welcome,
        },
        ...prev,
      ]);
      setTab("members");
      setQuery("");
      setNotice(
        `${person.name.trim()} added to ${sponsor.name}. ${person.welcome ? "Welcome kit marked as requested; nothing sent." : "No welcome kit requested."}`,
      );
    }
    setMode(null);
  };
  const field = <K extends keyof typeof person>(
    key: K,
    value: (typeof person)[K],
  ) => {
    setPerson((prev) => ({ ...prev, [key]: value }));
    setError("");
  };
  return (
    <div ref={root} className={`subw-page ${dark ? "theme-dark" : ""}`}>
      <aside className="subw-nav">
        <AgentWorkspaceNav
          brand={
            <>
              <Icon name="users" />
              <strong>Oreo Network</strong>
            </>
          }
          groups={[
            {
              label: "WORKSPACE",
              items: [
                {
                  label: "Subscriptions",
                  href: "/subscription-workspace",
                  icon: "chart-line",
                  active: true,
                },
                {
                  label: "Companies",
                  href: "/company-directory",
                  icon: "folder",
                },
                {
                  label: "Activity",
                  href: "/project-feed",
                  icon: "clock-history",
                },
              ],
            },
            {
              label: "EXPLORE",
              items: [
                {
                  label: "Components",
                  href: "/segment-rule-builder",
                  icon: "columns",
                },
                { label: "Changelog", href: "/changelog", icon: "list" },
              ],
            },
          ]}
          footer={
            <div className="subw-user">
              <Avatar name="Alex Morgan" color="purple" size="sm" />
              <span>
                Alex Morgan<small>Local workspace</small>
              </span>
            </div>
          }
        />
      </aside>
      <div className="subw-workspace">
        <header className="subw-top">
          <span>
            Workspace <b>/</b> Subscriptions
          </span>
          <div>
            <Tag>Sample · {TODAY}</Tag>
            <IconButton
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              type="tertiary"
              size="sm"
              tapScale={1}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
          </div>
        </header>
        <main className="subw-main">
          <div className="subw-heading">
            <div>
              <p className="so-eyebrow">CUSTOMERS & GROWTH</p>
              <h1 ref={heading} tabIndex={-1}>
                Your network, in view.
              </h1>
              <p>Understand your customers. Give every leg a clear target.</p>
            </div>
            <div>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => open("member")}
                leadingIcon={<Icon name="users" size="sm" />}
              >
                Add member
              </Button>
              <Button
                size="sm"
                tapScale={1}
                onClick={() => open("customer")}
                leadingIcon={<Icon name="plus" size="sm" />}
              >
                Add customer
              </Button>
            </div>
          </div>
          <div className="subw-stats">
            <DashboardStatCard
              label="Monthly recurring revenue"
              value={money(summary.mrr)}
              change={null}
              variant="plain"
            />
            <DashboardStatCard
              label="Active customers"
              value={String(summary.count)}
              change={null}
              variant="plain"
            />
            <DashboardStatCard
              label="Network members"
              value={String(activeMembers.length)}
              change={null}
              variant="plain"
            />
          </div>
          <section className="subw-content">
            <div className="subw-tabs" role="group" aria-label="Workspace view">
              {(["customers", "members", "revenue"] as const).map((t) => (
                <Button
                  key={t}
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  aria-pressed={tab === t}
                  onClick={() => {
                    setTab(t);
                    setQuery("");
                  }}
                >
                  {t === "customers"
                    ? "Customers"
                    : t === "members"
                      ? "Members"
                      : "Revenue target"}
                </Button>
              ))}
              <span />
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => open(tab === "revenue" ? "target" : "segment")}
                leadingIcon={
                  <Icon
                    name={tab === "revenue" ? "chart-line" : "filter"}
                    size="sm"
                  />
                }
              >
                {tab === "revenue" ? "Edit target" : "New segment"}
              </Button>
            </div>
            {tab === "customers" && (
              <div
                className="subw-segment-tabs"
                role="group"
                aria-label="Saved segments"
              >
                <Button
                  size="sm"
                  type={selectedSegment === "all" ? "secondary" : "tertiary"}
                  aria-pressed={selectedSegment === "all"}
                  tapScale={1}
                  onClick={() => setSelectedSegment("all")}
                >
                  All customers {customers.length}
                </Button>
                {segments
                  .filter((s) => s.pinned)
                  .map((s) => (
                    <Button
                      key={s.id}
                      size="sm"
                      type={selectedSegment === s.id ? "secondary" : "tertiary"}
                      aria-pressed={selectedSegment === s.id}
                      tapScale={1}
                      onClick={() => setSelectedSegment(s.id)}
                    >
                      {s.name}{" "}
                      <span>
                        {
                          segmentCustomers(customers, s, PLANS, LEGS, TODAY)
                            .length
                        }
                      </span>
                    </Button>
                  ))}
                <InlineSearchSelect
                  label="Saved segment"
                  value={selectedSegment}
                  options={[
                    { value: "all", label: "All segments" },
                    ...segments.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  onValueChange={setSelectedSegment}
                />
                {selected && (
                  <IconButton
                    aria-label="Edit selected segment"
                    title="Edit selected segment"
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    icon={<Icon name="pencil" size="sm" />}
                    onClick={() => open("segment", selected)}
                  />
                )}
              </div>
            )}
            {tab !== "revenue" && (
              <label className="subw-search">
                <Icon name="search" size="sm" />
                <input
                  aria-label={`Search ${tab}`}
                  placeholder={`Search ${tab}…`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span>
                  {tab === "customers"
                    ? filtered.length
                    : filteredMembers.length}{" "}
                  results
                </span>
              </label>
            )}
            {tab === "customers" &&
              (filtered.length ? (
                <div
                  className="subw-table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Customers table"
                >
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Plan</th>
                        <th>Leg</th>
                        <th>Source</th>
                        <th>MRR</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <span className="subw-identity">
                              <Avatar name={c.name} size="sm" color="default" />
                              <span>
                                <b>{c.name}</b>
                                <small>{c.phone}</small>
                              </span>
                            </span>
                          </td>
                          <td>{PLANS.find((p) => p.id === c.planId)?.name}</td>
                          <td>{LEGS.find((l) => l.id === c.legId)?.name}</td>
                          <td>{c.source}</td>
                          <td>
                            {c.active && c.start <= TODAY
                              ? money(
                                  PLANS.find((p) => p.id === c.planId)?.cents ??
                                    0,
                                )
                              : "—"}
                          </td>
                          <td>
                            <Tag>
                              {!c.active
                                ? "Inactive"
                                : c.start > TODAY
                                  ? "Scheduled"
                                  : c.risk
                                    ? "At risk"
                                    : "Active"}
                            </Tag>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <AgentWorkspaceState
                  title="No matching customers"
                  description="Clear the search or select all customers to widen this view."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setQuery("");
                    setSelectedSegment("all");
                  }}
                />
              ))}
            {tab === "members" &&
              (filteredMembers.length ? (
                <div
                  className="subw-table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Members table"
                >
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Sponsor</th>
                        <th>Inherited leg</th>
                        <th>Start date</th>
                        <th>Welcome kit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((m) => {
                        const sponsor = LEGS.find((l) => l.id === m.sponsorId);
                        return (
                          <tr key={m.id}>
                            <td>
                              <span className="subw-identity">
                                <Avatar
                                  name={m.name}
                                  size="sm"
                                  color="default"
                                />
                                <span>
                                  <b>{m.name}</b>
                                  <small>
                                    Platinum ·{" "}
                                    {m.start > TODAY ? "Scheduled" : "Active"}
                                  </small>
                                </span>
                              </span>
                            </td>
                            <td>{sponsor?.sponsor}</td>
                            <td>{sponsor?.name}</td>
                            <td>{m.start}</td>
                            <td>
                              {m.welcome
                                ? "Requested locally"
                                : "Not requested"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <AgentWorkspaceState
                  title="No matching members"
                  description="Try another name or phone number."
                  actionLabel="Clear search"
                  onAction={() => setQuery("")}
                />
              ))}
            {tab === "revenue" && (
              <div className="subw-revenue">
                <header>
                  <div>
                    <p className="so-eyebrow">{target.month} · MRR TARGET</p>
                    <h2>
                      {money(summary.mrr)} <span>of {money(targetCents)}</span>
                    </h2>
                  </div>
                  <Tag>
                    {((summary.mrr / targetCents) * 100).toFixed(1)}% achieved
                  </Tag>
                </header>
                <div
                  className="subw-target-track"
                  role="progressbar"
                  aria-label="Revenue target progress"
                  aria-valuenow={Math.min(
                    100,
                    Math.round((summary.mrr / targetCents) * 100),
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    style={{
                      width: `${Math.min(100, (summary.mrr / targetCents) * 100)}%`,
                    }}
                  />
                  <i />
                </div>
                <p className="so-muted">
                  Current active subscriptions compared with the {target.month}{" "}
                  target. The dashed marker is the target; this is not a future
                  revenue projection.
                </p>
                <div className="subw-leg-cards">
                  {summary.groups.map((g, i) => (
                    <article key={g.id}>
                      <header>
                        <Avatar
                          name={g.sponsor}
                          color={
                            i === 0
                              ? "purple"
                              : i === 1
                                ? "blue"
                                : i === 2
                                  ? "pink"
                                  : "orange"
                          }
                          size="sm"
                        />
                        <div>
                          <h3>{g.name}</h3>
                          <span>{g.sponsor}</span>
                        </div>
                      </header>
                      <strong>{money(g.cents)}</strong>
                      <p>{g.count} active customers</p>
                      {target.split && (
                        <footer>
                          Target <b>{money(allocations[i].cents)}</b>
                        </footer>
                      )}
                    </article>
                  ))}
                </div>
                <p className="so-notice">
                  {Math.max(0, targetCents - summary.mrr) > 0
                    ? `${money(targetCents - summary.mrr)} to the target. Shares are recalculated from current MRR.`
                    : "Target reached. Set a new goal when you are ready."}
                </p>
              </div>
            )}
          </section>
          <div className="subw-status" role="status">
            <span>{notice}</span>
            {undo && (
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setCustomers(undo.customers);
                  setMembers(undo.members);
                  setSegments(undo.segments);
                  setTarget(undo.target);
                  setSelectedSegment("all");
                  setUndo(null);
                  setNotice("Last saved change undone.");
                }}
              >
                Undo
              </Button>
            )}
          </div>
        </main>
      </div>
      <Dialog.Root
        open={mode !== null}
        onOpenChange={(open) => {
          if (!open) setMode(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="subw-backdrop" />
          <Dialog.Viewport className="subw-dialog-viewport">
            <Dialog.Popup
              className="subw-dialog"
              finalFocus={() =>
                returnTo.current?.isConnected
                  ? returnTo.current
                  : heading.current
              }
            >
              {mode && (
                <>
                  <header>
                    <span className="subw-dialog-mark">
                      <Icon
                        name={
                          mode === "target"
                            ? "chart-line"
                            : mode === "segment"
                              ? "filter"
                              : "users"
                        }
                      />
                    </span>
                    <div>
                      <Dialog.Title>{titles[mode]}</Dialog.Title>
                      <Dialog.Description>
                        {descriptions[mode]}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      render={
                        <IconButton
                          aria-label="Close dialog"
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          icon={<Icon name="x" size="sm" />}
                        />
                      }
                    />
                  </header>
                  <form onSubmit={save} noValidate>
                    <div className="subw-form-body">
                      {mode === "segment" && (
                        <>
                          <label className="so-field">
                            Segment name
                            <input
                              autoFocus
                              maxLength={80}
                              value={segmentDraft.name}
                              onChange={(e) => {
                                setSegmentDraft({
                                  ...segmentDraft,
                                  name: e.target.value,
                                });
                                setError("");
                              }}
                            />
                          </label>
                          <SegmentRuleBuilder
                            fields={fields}
                            rules={segmentDraft.rules}
                            mode={segmentDraft.mode}
                            onRulesChange={(rules) => {
                              setSegmentDraft({ ...segmentDraft, rules });
                              setError("");
                            }}
                            onModeChange={(mode) =>
                              setSegmentDraft({ ...segmentDraft, mode })
                            }
                          />
                          {segmentDraft.rules.some((r) =>
                            validateCondition(r, fields),
                          ) ? (
                            <p className="so-notice">
                              Complete the rules to calculate a preview.
                            </p>
                          ) : (
                            <SegmentPreview
                              customers={customers}
                              plans={PLANS}
                              legs={LEGS}
                              segment={segmentDraft}
                              today={TODAY}
                            />
                          )}
                        </>
                      )}
                      {mode === "target" && (
                        <RevenueTargetEditor
                          value={targetDraft}
                          onChange={(v) => {
                            setTargetDraft(v);
                            setError("");
                          }}
                          customers={customers}
                          plans={PLANS}
                          legs={LEGS}
                          today={TODAY}
                        />
                      )}
                      {(mode === "customer" || mode === "member") && (
                        <>
                          <div className="so-pair">
                            <label>
                              Full name
                              <input
                                autoFocus
                                autoComplete="off"
                                maxLength={100}
                                value={person.name}
                                onChange={(e) => field("name", e.target.value)}
                                placeholder="e.g. Lucía Reyes"
                              />
                            </label>
                            <label>
                              Phone
                              <input
                                autoComplete="off"
                                type="tel"
                                maxLength={30}
                                value={person.phone}
                                onChange={(e) => field("phone", e.target.value)}
                                placeholder="+1 555 010 0123"
                              />
                            </label>
                          </div>
                          {mode === "customer" ? (
                            <>
                              <SubscriptionPlanPicker
                                plans={PLANS}
                                value={person.planId}
                                onValueChange={(v) => field("planId", v)}
                              />
                              <div className="so-pair">
                                <div className="so-field">
                                  <span>Leg</span>
                                  <InlineSearchSelect
                                    label="Customer leg"
                                    value={person.legId}
                                    options={LEGS.map((l) => ({
                                      value: l.id,
                                      label: l.name,
                                      description: l.sponsor,
                                      icon: <Icon name="users" size="sm" />,
                                    }))}
                                    onValueChange={(v) => field("legId", v)}
                                  />
                                  <small>
                                    Owner:{" "}
                                    {
                                      LEGS.find((l) => l.id === person.legId)
                                        ?.sponsor
                                    }
                                  </small>
                                </div>
                                <label>
                                  First payment date
                                  <input
                                    type="date"
                                    value={person.start}
                                    onChange={(e) =>
                                      field("start", e.target.value)
                                    }
                                  />
                                  <small>
                                    Renews monthly · next{" "}
                                    {nextRenewal(person.start) || "—"}
                                  </small>
                                </label>
                              </div>
                              <fieldset className="so-source">
                                <legend>Source</legend>
                                {SOURCES.map((s) => (
                                  <label
                                    key={s}
                                    data-selected={
                                      s === person.source || undefined
                                    }
                                  >
                                    <input
                                      type="radio"
                                      name="source"
                                      value={s}
                                      checked={s === person.source}
                                      onChange={() => field("source", s)}
                                    />
                                    {s}
                                  </label>
                                ))}
                              </fieldset>
                              <p className="so-notice">
                                {person.start > TODAY
                                  ? `Scheduled for ${person.start}. Current MRR stays ${money(summary.mrr)}.`
                                  : `Adds ${money(plan.cents)} to MRR → ${money(summary.mrr + plan.cents)}.`}{" "}
                                No payment is charged.
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="so-field">
                                <span>Sponsor</span>
                                <InlineSearchSelect
                                  label="Sponsor"
                                  value={person.sponsorId}
                                  options={LEGS.map((l) => ({
                                    value: l.id,
                                    label: l.sponsor,
                                    description: l.name,
                                    meta: l.tier,
                                    icon: <Icon name="users" size="sm" />,
                                  }))}
                                  onValueChange={(v) => field("sponsorId", v)}
                                />
                              </div>
                              <div className="so-field">
                                <span>Inherited leg</span>
                                <div className="so-readonly">
                                  <Icon name="lock" size="sm" />
                                  {sponsor.name}
                                </div>
                                <small>
                                  Set by the sponsor ·{" "}
                                  {
                                    activeMembers.filter(
                                      (m) => m.sponsorId === sponsor.id,
                                    ).length
                                  }{" "}
                                  active members
                                </small>
                              </div>
                              <section
                                className="subw-tiers"
                                aria-label="Starting tier"
                              >
                                <h3>Start tier</h3>
                                <div>
                                  {[
                                    "Platinum",
                                    "Eagle",
                                    "Emerald",
                                    "Diamond",
                                  ].map((t, i) => (
                                    <div
                                      key={t}
                                      data-entry={i === 0 || undefined}
                                    >
                                      <Tag>{t}</Tag>
                                      <Icon
                                        name={i === 0 ? "check" : "lock"}
                                        size="sm"
                                      />
                                      <small>
                                        {i === 0 ? "Entry tier" : "Earned tier"}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                                <p>
                                  New members start at Platinum. Other tiers are
                                  earned after joining.
                                </p>
                              </section>
                              <div className="so-pair">
                                <label>
                                  Start date
                                  <input
                                    type="date"
                                    value={person.start}
                                    onChange={(e) =>
                                      field("start", e.target.value)
                                    }
                                  />
                                </label>
                                <div className="so-switch-row">
                                  <span>Request welcome kit</span>
                                  <Switch
                                    checked={person.welcome}
                                    onCheckedChange={(v) => field("welcome", v)}
                                    aria-label="Request welcome kit"
                                  />
                                </div>
                              </div>
                              <p className="so-notice">
                                {person.start > TODAY
                                  ? `Membership starts ${person.start}. Active count stays ${activeMembers.length}.`
                                  : `Network becomes ${activeMembers.length + 1} members · ${sponsor.name} reaches ${activeMembers.filter((m) => m.sponsorId === sponsor.id).length + 1} active members.`}{" "}
                                Welcome requests are stored locally; nothing is
                                sent.
                              </p>
                            </>
                          )}
                        </>
                      )}
                      {error && (
                        <p className="so-error" role="alert">
                          {error}
                        </p>
                      )}
                    </div>
                    <footer>
                      {mode === "segment" ? (
                        <label className="subw-pin">
                          <input
                            type="checkbox"
                            checked={segmentDraft.pinned}
                            onChange={(e) =>
                              setSegmentDraft({
                                ...segmentDraft,
                                pinned: e.target.checked,
                              })
                            }
                          />
                          Pin as a toolbar tab
                        </label>
                      ) : (
                        <span className="so-muted">Local sample only</span>
                      )}
                      <div>
                        <Dialog.Close
                          render={
                            <Button type="secondary" size="sm" tapScale={1} />
                          }
                        >
                          Cancel
                        </Dialog.Close>
                        <Button
                          size="sm"
                          tapScale={1}
                          onClick={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          {actions[mode]}
                        </Button>
                      </div>
                    </footer>
                  </form>
                </>
              )}
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
