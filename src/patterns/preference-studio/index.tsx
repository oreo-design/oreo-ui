import { useId, useState } from "react";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Switch } from "@/components/switch";
import { SettingsRow } from "@/patterns/settings/rows";
import { AgentWorkspaceState } from "@/components/automation";
import "./preference-studio.css";

export type PreferenceValues = {
  compact: boolean;
  people: boolean;
  messages: boolean;
  updates: boolean;
  quiet: boolean;
  stretch: boolean;
};
export const DEFAULT_PREFERENCES: PreferenceValues = {
  compact: false,
  people: true,
  messages: true,
  updates: true,
  quiet: false,
  stretch: true,
};
function PreferenceRow({
  title,
  description,
  value,
  onChange,
  stretch,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  stretch: boolean;
}) {
  const id = useId();
  return (
    <SettingsRow
      title={
        <label htmlFor={id} className="cursor-pointer">
          {title}
        </label>
      }
      description={<span id={`${id}-description`}>{description}</span>}
      control={
        <Switch
          id={id}
          checked={value}
          onCheckedChange={onChange}
          variant={stretch ? "stretch" : "default"}
          aria-label={title}
          aria-describedby={`${id}-description`}
        />
      }
    />
  );
}
const feed: {
  id: number;
  kind: "messages" | "updates";
  name: string;
  initials: string;
  title: string;
  text: string;
  time: string;
  icon: IconName;
}[] = [
  {
    id: 1,
    kind: "messages",
    name: "Maya Chen",
    initials: "MC",
    title: "A small detail, a better day",
    text: "The new workspace feels calmer already. I left a few thoughts for you.",
    time: "2 min ago",
    icon: "chat",
  },
  {
    id: 2,
    kind: "updates",
    name: "Oreo Studio",
    initials: "OS",
    title: "Design review is ready",
    text: "Three updates are ready for your next look. Everything is in one place.",
    time: "12 min ago",
    icon: "check",
  },
  {
    id: 3,
    kind: "messages",
    name: "Alex Rivera",
    initials: "AR",
    title: "Room for one more idea",
    text: "What if we made the little things feel a little more thoughtful?",
    time: "25 min ago",
    icon: "chat",
  },
];
export function PreferenceStudio({
  dark,
  onDarkChange,
}: {
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}) {
  const [value, setValue] = useState<PreferenceValues>({
    ...DEFAULT_PREFERENCES,
  });
  const [notice, setNotice] = useState("");
  function update(key: keyof PreferenceValues, next: boolean) {
    setValue((current) => ({ ...current, [key]: next }));
    setNotice("");
  }
  const visible = value.quiet ? [] : feed.filter((item) => value[item.kind]);
  return (
    <main className="preference-studio">
      <header className="preference-topbar">
        <a href="/switch" className="font-semibold">
          Oreo UI{" "}
          <span className="ml-2 font-normal text-text-tertiary">
            / Preference Studio
          </span>
        </a>
        <Button
          type="secondary"
          tapScale={1}
          onClick={() => {
            setValue({ ...DEFAULT_PREFERENCES });
            onDarkChange(false);
            setNotice("Default preferences restored.");
          }}
          leadingIcon={<Icon name="reset" />}
        >
          Reset
        </Button>
      </header>
      <section className="preference-heading">
        <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
          Your space, your pace
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Make yourself at home.
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-text-secondary">
          A few small choices can make a workspace feel like yours. Try a switch
          and see the difference.
        </p>
      </section>
      <div className="preference-grid">
        <div className="preference-controls">
          <section aria-labelledby="appearance-title">
            <div className="preference-section-title">
              <Icon name="paintbrush" />
              <h2 id="appearance-title">Look & feel</h2>
            </div>
            <div className="preference-card">
              <PreferenceRow
                title="Dark appearance"
                description="A softer glow for a quieter workspace."
                value={dark}
                onChange={onDarkChange}
                stretch={value.stretch}
              />
              <PreferenceRow
                title="Compact spacing"
                description="Keep more of your activity in view."
                value={value.compact}
                onChange={(next) => update("compact", next)}
                stretch={value.stretch}
              />
              <PreferenceRow
                title="Show people"
                description="Put a familiar face beside each update."
                value={value.people}
                onChange={(next) => update("people", next)}
                stretch={value.stretch}
              />
            </div>
          </section>
          <section aria-labelledby="activity-title">
            <div className="preference-section-title">
              <Icon name="bell" />
              <h2 id="activity-title">Your activity</h2>
            </div>
            <div className="preference-card">
              <PreferenceRow
                title="Team messages"
                description="Keep conversations in your preview feed."
                value={value.messages}
                onChange={(next) => update("messages", next)}
                stretch={value.stretch}
              />
              <PreferenceRow
                title="Project updates"
                description="See progress and completed work."
                value={value.updates}
                onChange={(next) => update("updates", next)}
                stretch={value.stretch}
              />
              <PreferenceRow
                title="Quiet mode"
                description="Pause the feed without changing your filters."
                value={value.quiet}
                onChange={(next) => update("quiet", next)}
                stretch={value.stretch}
              />
            </div>
          </section>
          <section aria-labelledby="details-title">
            <div className="preference-section-title">
              <Icon name="sliders" />
              <h2 id="details-title">The little details</h2>
            </div>
            <div className="preference-card">
              <PreferenceRow
                title="Stretch feedback"
                description="A gentle stretch as the switch changes state."
                value={value.stretch}
                onChange={(next) => update("stretch", next)}
                stretch={value.stretch}
              />
            </div>
          </section>
          <p role="status" className="min-h-6 text-sm text-text-secondary">
            {notice ||
              "Changes apply to this preview. Refresh restores defaults."}
          </p>
        </div>
        <section
          aria-labelledby="workspace-preview-title"
          className="preference-preview-wrap"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="workspace-preview-title" className="text-sm font-medium">
              Your workspace
            </h2>
            <span className="text-xs text-text-tertiary">Live preview</span>
          </div>
          <div className="preference-preview" data-compact={value.compact}>
            <header className="preference-preview-header">
              <div className="flex items-center gap-3">
                <span className="preference-logo">
                  <Icon name="sparkle" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Oreo Studio</h3>
                  <p className="mt-1 text-xs text-text-tertiary">
                    A little room to do good work
                  </p>
                </div>
              </div>
              <span className="text-xs text-text-secondary">
                {value.quiet ? "Paused" : "Personal"}
              </span>
            </header>
            <div className="preference-preview-intro">
              <p className="text-xs font-medium text-text-tertiary">
                MONDAY, OCTOBER 19
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                A good place to begin.
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {value.quiet
                  ? "Take a moment. Your feed can wait."
                  : `${visible.length} ${visible.length === 1 ? "update" : "updates"} for your day.`}
              </p>
            </div>
            {visible.length ? (
              <ul className="preference-feed">
                {visible.map((item) => (
                  <li key={item.id} className="preference-feed-item">
                    {value.people && (
                      <span aria-hidden="true" className="preference-person">
                        {item.initials}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-xs font-medium">{item.name}</p>
                        <span className="shrink-0 text-xs text-text-tertiary">
                          {item.time}
                        </span>
                      </div>
                      <h4 className="mt-3 text-sm font-medium">{item.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {item.text}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-tertiary">
                        <Icon name={item.icon} size="sm" />
                        {item.kind === "messages"
                          ? "Team message"
                          : "Project update"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <AgentWorkspaceState
                title={
                  value.quiet ? "A little quiet." : "Nothing in your feed."
                }
                description={
                  value.quiet
                    ? "Your filters are saved. Come back whenever you’re ready."
                    : "Turn on team messages or project updates to bring your activity back."
                }
                actionLabel={
                  value.quiet ? "Resume activity" : "Show all activity"
                }
                onAction={() => {
                  setValue((current) => ({
                    ...current,
                    quiet: false,
                    ...(!current.quiet && { messages: true, updates: true }),
                  }));
                  setNotice("");
                }}
              />
            )}
            <footer className="preference-preview-footer">
              <Icon name="lock" size="sm" />
              Only this preview changes. No system settings are modified.
            </footer>
          </div>
        </section>
      </div>
      <footer className="preference-footer">
        <span>
          Inspired by{" "}
          <a
            href="https://x.com/samosemudiamhe/status/2110425458806235278"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Sakani UI’s stretch toggle
          </a>
          .
        </span>
        <a href="/switch" className="underline">
          Explore the component ↗
        </a>
      </footer>
    </main>
  );
}
