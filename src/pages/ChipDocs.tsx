import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import type { SpringProps } from "@/docs/DocsPage";
import type { IconName, IconWeight } from "@/components/icon";
import { Chip, ChipGroup } from "@/components/chip";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "chip", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "states", label: "States" },
  { id: "selection", label: "Selection" },
  { id: "group", label: "Chip group" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "selected", type: "boolean", def: "false", desc: "Fills with the inverse palette to show an active choice." },
  { prop: "disabled", type: "boolean", def: "false", desc: "Disables interaction and dims the chip." },
  { prop: "icon", type: "ReactNode", desc: "Leading icon before the label." },
  { prop: "size", type: `"sm" | "md"`, def: `"md"`, desc: "Chip height: sm 32px, md 36px." },
  { prop: "render", type: "useRender.RenderProp", desc: "Base UI render prop for polymorphism." },
  { prop: "bounce / duration / tapScale", type: "number", desc: "Press-spring controls." },
];

const CODE_STATES = `import { Chip } from "@/components/chip";
import { Icon } from "@/components/icon";

<Chip icon={<Icon name="plane" />}>Plan a trip</Chip>
<Chip icon={<Icon name="plane" />} selected>Plan a trip</Chip>
<Chip icon={<Icon name="plane" />} disabled>Plan a trip</Chip>`;

const CODE_GROUP = `import { Chip, ChipGroup } from "@/components/chip";

<ChipGroup>
  <Chip icon={<Icon name="sparkle" />}>Make an App</Chip>
  <Chip icon={<Icon name="calendar" />}>Schedule my week</Chip>
  <Chip icon={<Icon name="bell" />}>Set a reminder</Chip>
</ChipGroup>`;

const SUGGESTIONS: { label: string; icon: IconName }[] = [
  { label: "Plan a trip", icon: "plane" },
  { label: "Schedule my week", icon: "calendar" },
  { label: "Set a reminder", icon: "bell" },
  { label: "Make a to-do list", icon: "list-checks" },
  { label: "Search the web", icon: "globe" },
  { label: "Summarize this", icon: "align-left" },
  { label: "Analyze data", icon: "chart-line" },
];

function SelectionDemo({ spring, weight }: { spring: SpringProps; weight: IconWeight }) {
  const [active, setActive] = useState("Schedule my week");
  return (
    <ChipGroup className="w-full max-w-xl">
      {SUGGESTIONS.slice(0, 5).map((s) => (
        <Chip
          key={s.label}
          icon={<Icon name={s.icon} weight={weight} />}
          selected={active === s.label}
          onClick={() => setActive(s.label)}
          {...spring}
        >
          {s.label}
        </Chip>
      ))}
    </ChipGroup>
  );
}

export function ChipDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Chip"]} nav={nav}>
      {({ spring, icon }) => (
        <>
          <header id="chip" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Chip</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A compact, tappable suggestion pill that surfaces quick-start actions for the agent. Each chip pairs a
              short action label with an optional icon. Built on Base UI&apos;s <code>useRender</code> with a Motion
              press spring, and four states: default, hover, selected, and disabled.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <CodeBlock lang="bash" code={`npx oreo-ui add chip\n# or copy src/components/chip/* by hand`} />
          </Section>

          <Section id="states" title="States" description="Default reads as a bordered pill; selected fills with the inverse palette; disabled dims. Hover and press are Material-style state layers.">
            <PreviewTabs
              code={CODE_STATES}
              preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Chip icon={<Icon name="plane" weight={icon.weight} />} {...spring}>Plan a trip</Chip>
                  <Chip icon={<Icon name="plane" weight={icon.weight} />} selected {...spring}>Plan a trip</Chip>
                  <Chip icon={<Icon name="plane" weight={icon.weight} />} disabled {...spring}>Plan a trip</Chip>
                  <Chip icon={<Icon name="plane" weight={icon.weight} />} selected disabled {...spring}>Plan a trip</Chip>
                </div>
              }
            />
          </Section>

          <Section id="selection" title="Selection" description="Click a chip to select it — selection is single-choice here, but the selected prop is fully controlled.">
            <PreviewTabs
              code={`const [active, setActive] = useState("Schedule my week");\n<Chip selected={active === label} onClick={() => setActive(label)}>{label}</Chip>`}
              preview={<SelectionDemo spring={spring} weight={icon.weight} />}
            />
          </Section>

          <Section id="group" title="Chip group" description="ChipGroup lays chips out in a horizontal, scrollable row — the canonical layout at the start of a conversation.">
            <PreviewTabs
              code={CODE_GROUP}
              preview={
                <ChipGroup className="w-full max-w-xl">
                  {SUGGESTIONS.map((s) => (
                    <Chip key={s.label} icon={<Icon name={s.icon} weight={icon.weight} />} {...spring}>
                      {s.label}
                    </Chip>
                  ))}
                </ChipGroup>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Chip extends all native <button> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
