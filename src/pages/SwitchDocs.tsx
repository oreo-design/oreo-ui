import { useId, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import { Switch } from "@/components/switch";
export function SwitchDocs({ nav }: { nav: DocsNav }) {
  const [checked, setChecked] = useState(false);
  const id = useId();
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Switch"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "states", label: "States" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              A small switch. A softer landing.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              An immediate on/off control with an optional stretch: the leading
              edge travels first, the tail follows, and the thumb settles back
              into a circle.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Inspired by{" "}
              <a
                href="https://x.com/samosemudiamhe/status/2110425458806235278"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Sakani UI’s stretch toggle
              </a>
              . Built on Oreo’s existing Base UI Switch, with the same track,
              tokens and form behavior.
            </p>
            <Button
              className="my-6"
              tapScale={1}
              render={<a href="/preference-studio" />}
            >
              Open Preference Studio ↗
            </Button>
            <div className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-card-medium border border-border-subtle bg-bg-base">
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 text-base font-medium"
              >
                <Switch
                  id={id}
                  aria-label="Stretch motion"
                  checked={checked}
                  onCheckedChange={setChecked}
                  variant="stretch"
                />
                Stretch motion
              </label>
              <p className="text-sm text-text-tertiary" role="status">
                {checked ? "On" : "Off"}
              </p>
            </div>
          </header>
          <Section
            id="states"
            title="One control, familiar states"
            description="The default variant remains unchanged. Stretch is an explicit opt-in; keyboard activation and reduced motion skip its movement."
          >
            <div className="grid gap-6 rounded-card-medium border border-border-subtle p-6 sm:grid-cols-2">
              {[
                { label: "Default", variant: "default" as const },
                { label: "Stretch", variant: "stretch" as const },
                {
                  label: "Disabled off",
                  variant: "stretch" as const,
                  disabled: true,
                },
                {
                  label: "Disabled on",
                  variant: "stretch" as const,
                  disabled: true,
                  defaultChecked: true,
                },
                {
                  label: "Read only",
                  variant: "stretch" as const,
                  readOnly: true,
                  defaultChecked: true,
                },
              ].map(({ label, ...item }) => (
                <label key={label} className="flex items-center gap-3 text-sm">
                  <Switch {...item} aria-label={label} />
                  {label}
                </label>
              ))}
            </div>
            <div dir="rtl" className="mt-6 flex justify-end">
              <label className="flex items-center gap-3 text-sm">
                <Switch variant="stretch" aria-label="Right-to-left example" />
                Right-to-left example
              </label>
            </div>
          </Section>
          <Section
            id="usage"
            title="Keep the state close"
            description="Use switches for changes that take effect immediately. Preference Studio demonstrates labels, descriptions, filtering, reset, empty recovery and the same switch in a complete layout."
          >
            <CodeBlock
              code={
                'import { Switch } from "@/components/switch";\n\n<label htmlFor="activity">Show activity</label>\n<Switch id="activity" aria-label="Show activity" variant="stretch"\n  checked={enabled} onCheckedChange={setEnabled} />'
              }
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Copy the switch directory, including switch.stretch.css, with its
              existing Base UI, cn and tv dependencies. The resting track is 34
              × 20 px and the thumb is 16 px. Two rounded clips travel for 180
              ms with a 40 ms trailing delay. No width or height is animated.
              Reversals retarget the current edges; reduced motion removes both
              movement and delay. A visible label or accessible name is
              required. The settings template reuses SettingsRow and the
              existing centered empty-state component.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "variant",
                  type: '"default" | "stretch"',
                  def: '"default"',
                  desc: "Optional stretch motion. Default retains the original Oreo switch styling and motion.",
                },
                {
                  prop: "checked / defaultChecked",
                  type: "boolean",
                  desc: "Controlled state or initial uncontrolled state. Base UI owns the underlying input.",
                },
                {
                  prop: "onCheckedChange",
                  type: "(checked: boolean) => void",
                  desc: "Runs when the user changes state. Apply the setting immediately.",
                },
                {
                  prop: "disabled / readOnly",
                  type: "boolean",
                  desc: "Prevent changes; disabled controls leave the Tab order, read-only controls remain discoverable.",
                },
                {
                  prop: "id / aria-label / aria-describedby",
                  type: "string",
                  desc: "Associate a visible label and supporting description. Label clicks activate the control.",
                },
                {
                  prop: "name / value / uncheckedValue",
                  type: "string",
                  desc: "Native form data is handled by Base UI. Other Base UI root props are forwarded.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
