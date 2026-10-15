import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import { MultiSelectMenu } from "@/components/multi-select-menu";
import {
  MeetingCard,
  MeetingResponse,
  RescheduleSuggestions,
  type MeetingResponseValue,
} from "@/components/meeting";
import {
  initialMeetings,
  meetingCategories,
  meetingSuggestions,
} from "@/patterns/meeting-planner/data";
const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "selection", label: "Multi-select menu" },
  { id: "meeting", label: "Meeting card" },
  { id: "response", label: "Response & reschedule" },
  { id: "composition", label: "Composition" },
  { id: "api", label: "API reference" },
];
export function MeetingComponentsDocs({ nav }: { nav: DocsNav }) {
  const [selected, setSelected] = useState([
    "review",
    "brainstorm",
    "interview",
  ]);
  const [meeting, setMeeting] = useState(initialMeetings[0]);
  const [response, setResponse] = useState<MeetingResponseValue>("yes");
  const [notice, setNotice] = useState("");
  return (
    <DocsPage nav={nav} toc={toc} breadcrumb={["Components", "Meeting"]}>
      {() => (
        <>
          <header id="introduction" className="pb-8">
            <p className="mb-3 text-xs uppercase tracking-wider text-text-tertiary">
              Small details, better meetings
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Meeting components
            </h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              Independent selections, thoughtful meeting details, and a little
              room to reschedule. Built on Oreo’s existing menu, controls,
              avatars and tokens.
            </p>
            <Button
              className="mt-5"
              tapScale={1}
              render={<a href="/meeting-planner" />}
            >
              Open Meeting Planner ↗
            </Button>
            <p className="mt-4 text-xs leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                href="https://x.com/noman_huge/status/2110294792034996359"
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                Noman’s multi-select meeting dropdown
              </a>
              . Independently implemented using Oreo icons and primitives;
              light/dark and responsive states extend the static reference.
            </p>
          </header>
          <Section
            id="selection"
            title="Select more than one"
            description="A count at the entry, a leading checkbox on every row, and a menu that stays open while choosing. Arrow keys, typeahead, Space and Escape come from Base UI."
          >
            <div className="max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-3">
              <MultiSelectMenu
                options={meetingCategories}
                value={selected}
                onValueChange={setSelected}
              />
            </div>
            <p role="status" className="mt-4 text-sm text-text-secondary">
              {selected.length
                ? meetingCategories
                    .filter((item) => selected.includes(item.value))
                    .map((item) => item.label)
                    .join(" · ")
                : "No categories selected"}
            </p>
          </Section>
          <Section
            id="meeting"
            title="All the context, in one card"
            description="The card composes a shared multi-select, attendee disclosure, flexibility control, response buttons and suggested times. The host owns every change."
          >
            <MeetingCard
              meeting={meeting}
              categories={meetingCategories}
              suggestions={meetingSuggestions}
              onCategoriesChange={(categories) =>
                setMeeting({ ...meeting, categories })
              }
              onResponseChange={(response) =>
                setMeeting({ ...meeting, response })
              }
              onFlexibleChange={(flexible) =>
                setMeeting({ ...meeting, flexible })
              }
              onReschedule={(suggestion) =>
                setMeeting({ ...meeting, start: suggestion.start })
              }
              onJoin={() =>
                setNotice(
                  "Join callback received. Connect your own meeting URL.",
                )
              }
            />
            <p role="status" className="mt-4 text-sm text-text-secondary">
              {notice}
            </p>
          </Section>
          <Section
            id="response"
            title="Respond and make room"
            description="Responses are mutually exclusive. Suggested times are independent buttons; the template asks for confirmation before applying a time change."
          >
            <div className="space-y-8">
              <MeetingResponse value={response} onValueChange={setResponse} />
              <RescheduleSuggestions
                suggestions={meetingSuggestions}
                onSelect={(suggestion) =>
                  setNotice(`Selected ${suggestion.label}`)
                }
              />
            </div>
          </Section>
          <Section
            id="composition"
            title="Compose your own picker"
            description="Copy multi-select-menu and its menu/icon dependencies. Add meeting and the meeting-planner pattern for the full example."
          >
            <CodeBlock
              code={`import { MultiSelectMenu } from "@/components/multi-select-menu";\n\n<MultiSelectMenu\n  label="Event category"\n  options={[\n    { value: "review", label: "Project Review", icon: "star" },\n    { value: "ideas", label: "Brainstorming", icon: "brain" },\n  ]}\n  value={selected}\n  onValueChange={setSelected}\n  onEdit={() => setCategoryEditorOpen(true)}\n/>\n\nimport { MeetingPlanner } from "@/patterns/meeting-planner";\n<MeetingPlanner dark={dark} onToggleTheme={toggleTheme} />`}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              The template edits local fixture data, supports category
              management, RSVP, flexible scheduling, delete/undo and a
              meeting-service placeholder. Nothing sends an invitation or
              modifies a live calendar.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "MenuCheckboxItem",
                  type: "checked?; defaultChecked?; onCheckedChange?; icon?; disabled?",
                  desc: "Shared Menu primitive. Leading checkbox, menuitemcheckbox semantics and stays-open selection.",
                },
                {
                  prop: "MultiSelectMenu",
                  type: "options; value; onValueChange; label?; heading?; icon?",
                  desc: "Controlled string IDs. Options: value, label, optional Icon name and disabled. Unknown/duplicate selected IDs are excluded from the visible count.",
                },
                {
                  prop: "Position & controls",
                  type: "side?; align?; open?; onOpenChange?; defaultOpen?; disabled?",
                  desc: "Anchored collision-aware Menu. Supports either controlled or uncontrolled open state. Keyboard opening has no entry animation.",
                },
                {
                  prop: "Picker footer",
                  type: "onEdit?; editLabel?; footer?",
                  desc: "Optional category editor action or custom footer content.",
                },
                {
                  prop: "MeetingCard",
                  type: "meeting; categories; suggestions; controlled callbacks",
                  desc: "MeetingData: id, title, local ISO start, duration in minutes, attendees, categories, response, flexible, location. Host owns validation and persistence.",
                },
                {
                  prop: "MeetingResponse",
                  type: "value: yes | no | maybe; onValueChange; disabled?",
                  desc: "A mutually exclusive group of pressed-state buttons.",
                },
                {
                  prop: "RescheduleSuggestions",
                  type: "suggestions; onSelect; onFindMore?; disabled?",
                  desc: "Suggestion: id, label, local ISO start. Host confirms and applies changes.",
                },
                {
                  prop: "AttendeeCalendars",
                  type: "people: MeetingPerson[]",
                  desc: "Illustrative local availability; explicitly labeled sample data, never a connected calendar.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
