import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { BudgetMeter, formatMoney } from "@/components/activity";
import { InboxNotification } from "@/components/studio-inbox";
import { ToolCall } from "@/components/tool-call";
import { Attachment } from "@/components/attachment";
import {
  EmailDraft,
  type EmailDraftValue,
} from "@/components/review-workspace";
import { InlineConfirm } from "@/components/inline-confirm";
import {
  SpendLimitChart,
  SecretField,
  ApiKeyTable,
  parseDollars,
  type ApiKeyRecord,
} from "@/components/support-console";
import { CASES, SAMPLE_KEYS, SPEND_DAYS } from "./data";
import "./workspace.css";
export function SupportConsolePage() {
  const root = useRef<HTMLDivElement>(null),
    createTrigger = useRef<HTMLButtonElement>(null),
    budgetTrigger = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useThemeMode(false),
    [tab, setTab] = useState("Inbox"),
    [selected, setSelected] = useState("screen");
  const [drafts, setDrafts] = useState<Record<string, EmailDraftValue>>({}),
    [sent, setSent] = useState<string[]>([]);
  const [keys, setKeys] = useState(SAMPLE_KEYS),
    [resetVersion, setResetVersion] = useState(0),
    [query, setQuery] = useState(""),
    [notice, setNotice] = useState("");
  const [daily, setDaily] = useState(7000),
    [monthly, setMonthly] = useState(150000);
  const [modal, setModal] = useState<"key" | "budget" | null>(null),
    [name, setName] = useState(""),
    [permission, setPermission] =
      useState<ApiKeyRecord["permission"]>("Send only"),
    [secret, setSecret] = useState<string | null>(null),
    [error, setError] = useState(""),
    [budgetDraft, setBudgetDraft] = useState({ daily: "70", monthly: "1500" });
  const current = CASES.find((c) => c.id === selected)!;
  const draft = drafts[selected] ?? {
    subject: current.subject,
    body: current.reply,
  };
  const used = SPEND_DAYS.reduce((sum, d) => sum + d.cents, 0);
  function close() {
    setModal(null);
    setSecret(null);
    setError("");
  }
  function createKey() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give this key a name.");
      return;
    }
    if (
      keys.some(
        (k) => !k.revoked && k.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setError("An active key already uses that name.");
      return;
    }
    const id = crypto.randomUUID(),
      value = `demo_only_${id.replaceAll("-", "")}`;
    setKeys((old) => [
      {
        id,
        name: trimmed,
        permission,
        suffix: value.slice(-4),
        lastUsed: "Never",
      },
      ...old,
    ]);
    setSecret(value);
    setError("");
    setNotice(`Created demo key ${trimmed}.`);
  }
  function saveBudget() {
    const d = parseDollars(budgetDraft.daily),
      m = parseDollars(budgetDraft.monthly);
    if (d === null || m === null || d <= 0 || m <= 0) {
      setError(
        "Enter positive dollar amounts with at most two decimal places.",
      );
      return;
    }
    setDaily(d);
    setMonthly(m);
    setNotice("Budget updated. Daily amounts are unchanged.");
    close();
  }
  return (
    <div
      ref={root}
      className={`qz-workspace ${dark ? "theme-dark" : "theme-light"}`}
    >
      <header className="qz-top">
        <a href="/spend-limit-chart">
          <Icon name="chat" /> Oreo <span>/ Support console</span>
        </a>
        <div>
          <Tag>Local demo</Tag>
          <IconButton
            type="tertiary"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
            onClick={() => setDark(!dark)}
          />
        </div>
      </header>
      <main className="qz-main">
        <div className="qz-heading">
          <div>
            <p>SUPPORT, WITH CONTEXT</p>
            <h1>A little more clarity.</h1>
            <span>
              Keep your conversations, spending and access in one place.
            </span>
          </div>
          <Button
            type="secondary"
            tapScale={1}
            onClick={() => {
              setKeys(SAMPLE_KEYS);
              setResetVersion((v) => v + 1);
              setDrafts({});
              setSent([]);
              setQuery("");
              setDaily(7000);
              setMonthly(150000);
              setNotice("Sample workspace restored.");
            }}
          >
            Reset demo
          </Button>
        </div>
        <Tabs.Root
          value={tab}
          onValueChange={(value) => {
            setTab(String(value));
            setNotice("");
          }}
        >
          <Tabs.List aria-label="Support console" className="qz-tabs">
            {["Inbox", "Usage", "API keys"].map((t) => (
              <Tabs.Tab key={t} value={t}>
                {t}
                {t === "Inbox" && <span>{CASES.length - sent.length}</span>}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <p className="qz-notice" role="status">
            {notice}
          </p>
          <Tabs.Panel value="Inbox">
            <div className="qz-inbox">
              <section className="qz-card qz-queue" aria-label="Support cases">
                <header>
                  <h2>Open conversations</h2>
                  <Tag>{CASES.length - sent.length}</Tag>
                </header>
                {CASES.map((c) => (
                  <InboxNotification
                    key={c.id}
                    selected={selected === c.id}
                    onSelect={setSelected}
                    item={{
                      id: c.id,
                      author: c.name,
                      action: c.subject,
                      preview: c.message,
                      project: sent.includes(c.id)
                        ? "Reply saved"
                        : c.draft
                          ? "Draft ready"
                          : "Needs review",
                      category: "Tasks",
                      time: c.time,
                      day: "Today",
                      unread: !sent.includes(c.id),
                    }}
                  />
                ))}
              </section>
              <section className="qz-card qz-case">
                <header>
                  <div>
                    <h2>{current.subject}</h2>
                    <p>
                      {current.name} · Order {current.order}
                    </p>
                  </div>
                  <Tag color={sent.includes(selected) ? "default" : "mint"}>
                    {sent.includes(selected) ? "Saved" : "Draft"}
                  </Tag>
                </header>
                <div className="qz-conversation">
                  <p className="qz-bubble">{current.message}</p>
                  {selected === "screen" && (
                    <div className="qz-attachment">
                      <Attachment type="unknown" label="screen.jpg" />
                      <span>2.4 MB · sample attachment</span>
                    </div>
                  )}
                  <div className="qz-tools">
                    <ToolCall
                      name="Looked up order"
                      badge={current.order}
                      state="complete"
                    >
                      <p className="text-xs text-text-secondary">
                        Sample order details are ready for review.
                      </p>
                    </ToolCall>
                    {selected === "screen" && (
                      <ToolCall
                        name="Checked the photo"
                        badge="Screen cracked on arrival"
                        state="complete"
                      >
                        <p className="text-xs text-text-secondary">
                          The reference attachment is represented by local
                          sample metadata.
                        </p>
                      </ToolCall>
                    )}
                    <ToolCall
                      name="Prepared a reply"
                      badge="Ready for review"
                      state="complete"
                    >
                      <p className="text-xs text-text-secondary">
                        Review the draft below before saving it.
                      </p>
                    </ToolCall>
                  </div>
                </div>
                <div className="qz-draft">
                  <p>
                    <Tag color="mint">support-agent</Tag> drafted a reply
                  </p>
                  <EmailDraft
                    from={{ name: "Support", email: "support@example.com" }}
                    to={{
                      name: current.name,
                      email: `${current.name.split(" ")[0].toLowerCase()}@example.com`,
                    }}
                    value={draft}
                    onChange={(value) =>
                      setDrafts((old) => ({ ...old, [selected]: value }))
                    }
                    onSend={() => {
                      if (!draft.body.trim() || !draft.subject.trim()) {
                        setNotice("Add a subject and reply before saving.");
                        return;
                      }
                      setSent((old) => [...new Set([...old, selected])]);
                      setNotice("Demo reply saved. No message was sent.");
                    }}
                    disabled={sent.includes(selected)}
                    status={
                      sent.includes(selected)
                        ? "Demo reply saved. No message was sent."
                        : "Local preview · sending saves this reply in the demo only."
                    }
                  />
                  {sent.includes(selected) && (
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() =>
                        setSent((old) => old.filter((id) => id !== selected))
                      }
                    >
                      Edit saved reply
                    </Button>
                  )}
                </div>
              </section>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="Usage">
            <div className="qz-section-heading">
              <div>
                <h2>Usage</h2>
                <p>September 1–18 · USD</p>
              </div>
              <Button
                tapScale={1}
                onClick={(event) => {
                  budgetTrigger.current = event.currentTarget;
                  createTrigger.current = event.currentTarget;
                  setBudgetDraft({
                    daily: String(daily / 100),
                    monthly: String(monthly / 100),
                  });
                  setError("");
                  setModal("budget");
                }}
              >
                Edit budget
              </Button>
            </div>
            <div className="qz-budget">
              <BudgetMeter
                used={used / 100}
                limit={monthly / 100}
                label="Monthly budget"
              />
              <div>
                <span>Period spend</span>
                <strong>{formatMoney(used / 100)}</strong>
                <small>
                  {SPEND_DAYS.filter((d) => d.cents > daily).length} days above
                  the daily threshold
                </small>
              </div>
            </div>
            <div className="qz-card">
              <SpendLimitChart days={SPEND_DAYS} dailyLimitCents={daily} />
            </div>
            <p className="qz-footnote">
              Thresholds highlight spending; they do not stop requests.
            </p>
          </Tabs.Panel>
          <Tabs.Panel value="API keys">
            <div className="qz-section-heading">
              <div>
                <h2>API keys</h2>
                <p>Control how your tools connect.</p>
              </div>
              <Button
                tapScale={1}
                leadingIcon={<Icon name="plus" />}
                onClick={(event) => {
                  createTrigger.current = event.currentTarget;
                  setName("");
                  setPermission("Send only");
                  setSecret(null);
                  setError("");
                  setModal("key");
                }}
              >
                Create key
              </Button>
            </div>
            <div className="qz-card">
              <header className="qz-keys-heading">
                <h3>
                  Production{" "}
                  <span>{keys.filter((k) => !k.revoked).length} keys</span>
                </h3>
                <label>
                  <span className="sr-only">Search keys</span>
                  <input
                    placeholder="Search keys…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </header>
              <ApiKeyTable
                keys={keys.filter((k) =>
                  `${k.name} ${k.permission}`
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()),
                )}
                actions={(key) => (
                  <InlineConfirm
                    key={`${key.id}-${resetVersion}`}
                    disabled={key.revoked}
                    label={key.revoked ? "Revoked" : "Revoke"}
                    question="Revoke this key?"
                    confirmLabel="Revoke"
                    successLabel="Revoked"
                    onConfirm={() => {
                      setKeys((old) =>
                        old.map((k) =>
                          k.id === key.id ? { ...k, revoked: true } : k,
                        ),
                      );
                      setNotice(`Revoked demo key ${key.name}.`);
                    }}
                  />
                )}
              />
            </div>
            <p className="qz-footnote">
              Demo keys cannot access any service. Changes reset when you
              reload.
            </p>
          </Tabs.Panel>
        </Tabs.Root>
      </main>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="qz-backdrop" />
          <Dialog.Popup
            className="qz-dialog"
            finalFocus={() =>
              modal === "budget" ? budgetTrigger.current : createTrigger.current
            }
          >
            <Dialog.Title>
              {modal === "budget"
                ? "Edit budget"
                : secret
                  ? "Key created"
                  : "Create a key"}
            </Dialog.Title>
            <Dialog.Description>
              {modal === "budget"
                ? "Set the thresholds used to review your spending."
                : secret
                  ? "Copy it now. It will not be shown again after you close this dialog."
                  : "Choose a name and the access this tool needs."}
            </Dialog.Description>
            {secret ? (
              <div className="qz-key-created">
                <SecretField value={secret} label={name.trim()} />
                <p>{permission} · For local demonstration only.</p>
                <Button tapScale={1} onClick={close}>
                  Done
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (modal === "budget") saveBudget();
                  else createKey();
                }}
              >
                {modal === "budget" ? (
                  <>
                    <label>
                      Daily threshold (USD)
                      <input
                        inputMode="decimal"
                        value={budgetDraft.daily}
                        onChange={(e) =>
                          setBudgetDraft((v) => ({
                            ...v,
                            daily: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Monthly budget (USD)
                      <input
                        inputMode="decimal"
                        value={budgetDraft.monthly}
                        onChange={(e) =>
                          setBudgetDraft((v) => ({
                            ...v,
                            monthly: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Key name
                      <input
                        maxLength={60}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. support-widget"
                      />
                    </label>
                    <label>
                      Permission
                      <select
                        value={permission}
                        onChange={(e) =>
                          setPermission(
                            e.target.value as ApiKeyRecord["permission"],
                          )
                        }
                      >
                        {["Send only", "Read only", "Full access"].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                {error && (
                  <p role="alert" className="text-status-error text-sm">
                    {error}
                  </p>
                )}
                <footer>
                  <Button type="secondary" tapScale={1} onClick={close}>
                    Cancel
                  </Button>
                  <Button render={<button type="submit" />} tapScale={1}>
                    {modal === "budget" ? "Save budget" : "Create demo key"}
                  </Button>
                </footer>
              </form>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
