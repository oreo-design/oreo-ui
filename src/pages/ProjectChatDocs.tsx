import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { CodeBlock, PropsTable, Section } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  AudioClip,
  CollaboratorPresence,
  ProjectChannels,
} from "@/components/project-chat";
import {
  ProjectChatDemo,
  ComposerFailureExample,
} from "@/patterns/music-workspace/ProjectChatDemo";
import { collaborators, songs } from "@/patterns/music-workspace/data";
import { useState } from "react";
import "@/patterns/music-workspace/music-workspace.css";
const toc = [
  { id: "preview", label: "Project chat" },
  { id: "parts", label: "Building blocks" },
  { id: "recovery", label: "Failure & recovery" },
  { id: "usage", label: "Composition" },
  { id: "api", label: "API" },
];
export function ProjectChatDocs({ nav }: { nav: DocsNav }) {
  const [channel, setChannel] = useState("on-my-mind");
  return (
    <DocsPage nav={nav} breadcrumb={["Chat", "Project Chat"]} toc={toc}>
      {() => (
        <>
          <header>
            <p className="mb-3 text-xs text-text-tertiary">
              COLLABORATION, IN CONTEXT
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Project Chat
            </h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              Keep the conversation close to the work. Seven composable pieces
              for collaborators, project channels, audio feedback and a floating
              chat.
            </p>
            <Button
              render={<a href="/music-workspace" />}
              className="mt-5"
              tapScale={1}
            >
              Open Music Workspace ↗
            </Button>
            <p className="mt-4 text-xs leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/designflyio/status/2110182813714805096"
                target="_blank"
                rel="noreferrer"
              >
                Brad’s light-mode project chat
              </a>
              . The two stills define the floating panel and its project-list
              context. Responsive layout, dark theme and demo behavior are
              implementation extensions. Initials replace the reference
              portraits; audio is a locally generated demo track.
            </p>
          </header>
          <Section
            id="preview"
            title="A conversation for every project"
            description="Switch songs, keep a draft, send a message, attach a local file, or jump to 1:24 in the mix. Minimize and reopen without losing your place."
          >
            <div className="flex justify-center rounded-3xl bg-bg-elevated px-3 py-8 sm:px-8">
              <ProjectChatDemo />
            </div>
          </Section>
          <Section
            id="parts"
            title="Small pieces, shared context"
            description="Presence and channels accept your data. The audio clip uses an actual HTML audio element with a keyboard-accessible seek control."
          >
            <div className="space-y-6 rounded-card-medium border border-border-subtle p-4">
              <CollaboratorPresence people={collaborators} />
              <ProjectChannels
                channels={songs.slice(0, 4)}
                value={channel}
                onChange={setChannel}
              />
              <div className="max-w-sm">
                <AudioClip
                  title="Demo mix"
                  src="/examples/music-workspace/mix-demo.wav"
                  duration={238}
                />
              </div>
              <CollaboratorPresence
                people={collaborators.map((p) => ({ ...p, online: false }))}
                title="Offline collaborators"
              />
            </div>
          </Section>
          <Section
            id="recovery"
            title="Failure keeps the draft"
            description="Send once to see an error, enable delivery, then retry. Attachments stay local; these examples never upload or contact other people."
          >
            <ComposerFailureExample />
            <div className="mt-5 max-w-sm">
              <AudioClip
                title="Missing mix"
                src="data:audio/wav;base64,AAAA"
                duration={238}
              />
            </div>
          </Section>
          <Section
            id="usage"
            title="Compose your own project chat"
            description="Copy components/project-chat with its existing Oreo imports. Bring patterns/music-workspace for the full local demo. The host owns authorization, storage and delivery."
          >
            <CodeBlock
              code={`import { ProjectChatPanel, CollaboratorPresence,\n  ProjectChannels, ChatBubble, CollaborationComposer }\n  from "@/components/project-chat";\n\n<ProjectChatPanel\n  header={<CollaboratorPresence people={people} />}\n  channels={<ProjectChannels channels={projects}\n    value={projectId} onChange={setProjectId} />}\n  composer={<CollaborationComposer onSend={sendToProject} />}\n>\n  <ChatBubble author={people[0]} time="4:12 PM">\n    The latest mix is ready for your feedback.\n  </ChatBubble>\n</ProjectChatPanel>`}
            />
          </Section>
          <Section id="api" title="Component API">
            <div className="overflow-x-auto">
              <div className="min-w-xl">
                <PropsTable
                  rows={[
                    {
                      prop: "CollaboratorPresence",
                      type: "people; title?",
                      desc: "Collaborator[]: id, name, optional src and online. Uses AvatarGroup and derives online count.",
                    },
                    {
                      prop: "ProjectChannels",
                      type: "channels; value; onChange",
                      desc: "ProjectChannel[]: id, name and optional unread. Controlled selection using aria-current; horizontally scrollable.",
                    },
                    {
                      prop: "ChatBubble",
                      type: "author?; time?; outgoing?; receipt?; children",
                      desc: "Composes Oreo Message with a bordered incoming bubble or a muted outgoing bubble. Receipt is supplied by your app.",
                    },
                    {
                      prop: "AudioClip",
                      type: "src; title; duration; seek?",
                      desc: "Native audio playback, metadata duration, seek range and retry feedback. seek: {seconds, request} allows repeated timestamp clicks. Waveform is illustrative.",
                    },
                    {
                      prop: "TypingPresence",
                      type: "person?; people?; animate?",
                      desc: "Quiet single-person text and avatar by default. Optional people supports multiple typers; an empty list hides the row. animate adds reduced-motion-aware typing dots. Presence data stays with the host.",
                    },
                    {
                      prop: "CollaborationComposer",
                      type: "onSend; note?",
                      desc: "Receives {text, files: File[]}. Enter sends, Shift+Enter adds a line. Promise rejection preserves draft and files; blank sends are disabled.",
                    },
                    {
                      prop: "ProjectChatPanel",
                      type: "header; channels; children; composer; onMinimize?; onClose?; className?",
                      desc: "Slot-based panel with a named message log. Host owns visibility, sizing and focus when dismissing.",
                    },
                  ]}
                />
              </div>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
