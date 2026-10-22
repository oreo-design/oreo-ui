import * as React from "react";
import {
  Composer,
  ComposerAsset,
  ComposerMenuSurface,
  ComposerAddMenu,
  ComposerConnectorMenu,
  ComposerApprovalMenu,
  ComposerModelSettings,
  ComposerModelList,
  ComposerDescribedModels,
  ComposerEffort,
  ComposerUsageMenu,
  ComposerUsageMeters,
  ComposerCommandList,
} from "@/components/composer";
import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";
import {
  Attachment,
  AttachmentBar,
  type AttachmentType,
} from "@/components/attachment";
import {
  KeywordTag,
  PlusGlyph,
  CodeGlyph,
  LinkGlyph,
  TextGlyph,
  FolderGlyph,
} from "@/components/keyword-tag";
import {
  ContextBar,
  ContextBarLabel,
  ContextBarTasks,
} from "@/components/context-bar";
import { Chip, ChipGroup } from "@/components/chip";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import type { DocsNav } from "@/docs/DocsPage";
import imageThumb from "@/components/composer/assets/1ebaa.png";
import videoThumb from "@/components/composer/assets/e9ccd.png";
import imageThumb2 from "@/components/composer/assets/19b16.png";
import imageThumb3 from "@/components/composer/assets/4f3e9.png";
import figmaLogo from "@/components/icon/assets/brands/figma-color.svg";
import geminiLogo from "@/components/icon/assets/brands/gemini-color.svg";
import claudeLogo from "@/components/icon/assets/brands/claude-color.svg";
import grokLogo from "@/components/icon/assets/brands/grok.svg";
import klingLogo from "@/components/icon/assets/brands/kling-color.svg";
import qwenLogo from "@/components/icon/assets/brands/qwen-color.svg";
import midjourneyLogo from "@/components/icon/assets/brands/midjourney.svg";
import openaiLogo from "@/components/icon/assets/brands/openai.svg";
import notionLogo from "@/components/icon/assets/brands/notion.svg";
import gmailLogo from "@/components/icon/assets/brands/gmail.svg";
import calendarLogo from "@/components/icon/assets/brands/google-calendar.svg";
import githubLogo from "@/components/icon/assets/brands/github.svg";
import "./composer-docs.css";

const FILLED =
  "Building a To-Do application requires a balance between simplicity for quick entries and enough structure to stay organized. Here is a comprehensive blueprint.";
const KEYWORDS =
  "Building a To-Do application requires a balance between simplicity for\nstay organized. Here is a comprehensive blueprint for the app's architecture and logic.";
const files: { type: AttachmentType; label: string; src?: string }[] = [
  { type: "image", label: "Image.jpg", src: imageThumb },
  { type: "video", label: "Video.mp4", src: videoThumb },
  { type: "doc", label: "Draft.pdf" },
  { type: "text", label: "ReadMe.txt" },
  { type: "code", label: "index.html" },
  { type: "json", label: "config.json" },
  { type: "music", label: "City of Stars.mp3" },
  { type: "unknown", label: "Unknown File" },
  { type: "link", label: "oreo.com" },
  { type: "pdf", label: "oreo.com" },
];
function Files({
  layout = "preview",
  loading = false,
}: {
  layout?: "preview" | "label" | "small";
  loading?: boolean;
}) {
  const [removed, setRemoved] = React.useState<number[]>([]);
  const list =
    layout === "preview"
      ? [
          files[0],
          { type: "image" as const, label: "Image 2", src: imageThumb2 },
          { type: "image" as const, label: "Image 3", src: imageThumb3 },
          files[1],
          ...files.slice(2, 8),
        ]
      : layout === "label"
        ? files.slice(0, 4)
        : [files[0], files[1], files[3], files[4]];
  return (
    <AttachmentBar>
      {list.map(
        (f, i) =>
          !removed.includes(i) && (
            <Attachment
              key={i}
              type={f.type}
              src={f.src}
              label={layout === "preview" ? undefined : f.label}
              size={layout === "small" ? "sm" : "md"}
              loading={loading && i === 1}
              onRemove={() => setRemoved((v) => [...v, i])}
            />
          ),
      )}
    </AttachmentBar>
  );
}
function Model() {
  return (
    <PromptBoxModelSelect
      label="Claude"
      icon={<ComposerAsset name="claude" />}
    />
  );
}
function Prompt(props: React.ComponentProps<typeof PromptBox>) {
  return <PromptBox voice="wave" modelSelect={<Model />} {...props} />;
}
function Sample({
  id,
  label,
  children,
  width = 629,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div className="composer-sample">
      <div data-figma={id} style={{ width, maxWidth: "100%" }}>
        {children}
      </div>
      <p>{label}</p>
    </div>
  );
}
function Panel({
  id,
  width = 260,
  children,
  label,
}: {
  id: string;
  width?: number;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Sample id={id} width={width} label={label}>
      <ComposerMenuSurface style={{ width }}>{children}</ComposerMenuSurface>
    </Sample>
  );
}
function Queue() {
  const [rows, setRows] = React.useState([
    "build main page integrating all components",
    "build core logic",
    "adjust to dark mode",
  ]);
  return (
    <ContextBar>
      {rows.map((s, i) => (
        <ContextBarLabel
          key={s}
          status="queue"
          onSteer={() => setRows([s, ...rows.filter((t) => t !== s)])}
          onRemove={() => setRows(rows.filter((_, n) => n !== i))}
          onMore={() =>
            setRows(rows.map((v, n) => (n === i ? `${v} · queued` : v)))
          }
        >
          {s}
        </ContextBarLabel>
      ))}
    </ContextBar>
  );
}
export default function ComposerDocs({ nav }: { nav: DocsNav }) {
  const [removedTags, setRemovedTags] = React.useState<string[]>([]);
  const [dark, setDark] = useThemeMode();
  const [submitted, setSubmitted] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [voice, setVoice] = React.useState<"idle" | "inputting" | "thinking">(
    "idle",
  );
  return (
    <div className="composer-reference">
      <header>
        <a
          href="/prompt-box"
          onClick={(e) => {
            e.preventDefault();
            nav.onNavigate("prompt-box");
          }}
        >
          Oreo UI / Composer
        </a>
        <nav>
          {[
            "template",
            "prompt",
            "context",
            "attachments",
            "keywords",
            "usage",
            "menus",
          ].map((s) => (
            <a key={s} href={`#${s}`}>
              {s}
            </a>
          ))}
        </nav>
        <button type="button" onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
      </header>
      <main>
        <h1>Composer</h1>
        <p className="composer-intro">
          Prompt, context, attachments and menus. The complete Oreo composer
          family.
        </p>
        <section id="template">
          <h2>Complete composer</h2>
          <p className="composer-section-copy">
            Type a prompt, attach local files, or enter @ and / to explore
            commands. This example keeps all actions local.
          </p>
          <div className="composer-live">
            <Composer
              running={running}
              onStop={() => setRunning(false)}
              voiceStatus={voice}
              onVoiceToggle={() =>
                setVoice((v) =>
                  v === "idle"
                    ? "inputting"
                    : v === "inputting"
                      ? "thinking"
                      : "idle",
                )
              }
              onSubmit={(v) => {
                setSubmitted(v);
                setRunning(true);
              }}
            />
            {submitted && (
              <div className="composer-submitted" role="status">
                <strong>Submitted prompt</strong>
                <p>{submitted}</p>
                <button onClick={() => setRunning(false)}>
                  Finish sample response
                </button>
              </div>
            )}
          </div>
        </section>
        <section id="prompt">
          <h2>Prompt Box</h2>
          <div className="composer-grid">
            <Sample id="4111:13598" label="Default">
              <Prompt />
            </Sample>
            <Sample id="4111:13604" label="Filled">
              <Prompt defaultValue={FILLED} />
            </Sample>
            <Sample id="4111:13610" label="Running">
              <Prompt running />
            </Sample>
            <Sample id="4111:13621" label="Attachments / Preview">
              <Prompt defaultValue={FILLED} attachments={<Files />} />
            </Sample>
            <Sample id="4111:13627" label="Attachments / Label M">
              <Prompt
                defaultValue={FILLED}
                attachments={<Files layout="label" />}
              />
            </Sample>
            <Sample id="4111:13633" label="Attachments / Label S">
              <Prompt
                defaultValue={FILLED}
                attachments={<Files layout="small" />}
              />
            </Sample>
            <Sample id="4111:13644" label="Keyword / Figma">
              <Prompt
                defaultValue={KEYWORDS}
                tags={
                  <KeywordTag
                    icon={
                      <span className="relative size-4">
                        <img
                          src={figmaLogo}
                          alt=""
                          style={{
                            position: "absolute",
                            left: "23.61%",
                            top: "11.46%",
                            width: "52.78%",
                            height: "79.16%",
                          }}
                        />
                      </span>
                    }
                  >
                    Figma
                  </KeywordTag>
                }
              />
            </Sample>
            <Sample id="4111:13651" label="Keyword / Action">
              <Prompt
                defaultValue={KEYWORDS}
                tags={
                  <KeywordTag color="purple" icon={<PlusGlyph />}>
                    Create Image
                  </KeywordTag>
                }
              />
            </Sample>
            <Sample id="4111:13663" label="Voice A / Listening">
              <Prompt defaultValue={FILLED} voiceStatus="inputting" />
            </Sample>
            <Sample id="4111:13664" label="Voice A / Thinking">
              <Prompt defaultValue={FILLED} voiceStatus="thinking" />
            </Sample>
            <Sample id="4111:13671" label="Voice B / Default">
              <Prompt voice="mic" />
            </Sample>
            <Sample id="4111:13672" label="Voice B / Listening">
              <Prompt
                defaultValue={FILLED}
                voice="mic"
                voiceStatus="inputting"
              />
            </Sample>
            <Sample id="4111:13683" label="Add-ons / Suggestions">
              <div className="flex flex-col gap-2">
                <ChipGroup>
                  <Chip
                    className="font-normal"
                    icon={<ComposerAsset name="suggestion" />}
                  >
                    Summarize this page
                  </Chip>
                  <Chip
                    className="font-normal"
                    icon={<ComposerAsset name="suggestion" />}
                  >
                    Debug my code
                  </Chip>
                </ChipGroup>
                <Prompt voice="mic" />
              </div>
            </Sample>
          </div>
        </section>
        <section id="context">
          <h2>Context Bar</h2>
          <div className="composer-grid">
            <Sample width={581} id="4064:15574" label="Header / full">
              <Prompt
                voice="mic"
                running
                header={
                  <ContextBar>
                    <ContextBarLabel>Select projects</ContextBarLabel>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample width={581} id="4064:15579" label="Header / inset">
              <Prompt
                voice="mic"
                running
                inset
                header={
                  <ContextBar>
                    <ContextBarLabel>Select projects</ContextBarLabel>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample width={581} id="4064:15585" label="Footer / full">
              <Prompt
                voice="mic"
                running
                footer={
                  <ContextBar position="footer">
                    <ContextBarLabel>Select projects</ContextBarLabel>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample width={581} id="4064:15590" label="Footer / inset">
              <Prompt
                voice="mic"
                running
                inset
                footer={
                  <ContextBar position="footer">
                    <ContextBarLabel>Select projects</ContextBarLabel>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample id="4111:14549" label="Task progress / expanded">
              <Prompt
                voice="mic"
                running
                inset
                header={
                  <ContextBar>
                    <ContextBarTasks
                      summary="2/4 tasks in progress"
                      defaultOpen
                    >
                      <ContextBarLabel status="done">
                        Build core logics
                      </ContextBarLabel>
                      <ContextBarLabel status="loading">
                        Build image canvas
                      </ContextBarLabel>
                      <ContextBarLabel status="waiting">
                        Build toolbar and adjustment panels
                      </ContextBarLabel>
                    </ContextBarTasks>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample id="context-folded" label="Task progress / folded">
              <Prompt
                voice="mic"
                running
                inset
                header={
                  <ContextBar>
                    <ContextBarTasks summary="2/4 tasks in progress">
                      <ContextBarLabel status="loading">
                        Build image canvas
                      </ContextBarLabel>
                    </ContextBarTasks>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample id="context-upgrade" label="Upgrade">
              <Prompt
                voice="mic"
                running
                inset
                header={
                  <ContextBar>
                    <ContextBarLabel icon={null}>
                      Need more messages? Get higher limits with Premium.
                    </ContextBarLabel>
                  </ContextBar>
                }
              />
            </Sample>
            <Sample id="4111:14571" label="Queue">
              <Prompt voice="mic" running inset header={<Queue />} />
            </Sample>
          </div>
        </section>
        <section id="attachments">
          <h2>Attachment Bar</h2>
          <div className="composer-grid">
            <Sample id="4020:2047" label="Preview">
              <Files />
            </Sample>
            <Sample id="4020:2058" label="Preview + Label">
              <Files layout="label" />
            </Sample>
            <Sample id="4020:2067" label="Small Label">
              <Files layout="small" />
            </Sample>
            <Sample id="attachments-loading" label="Upload in progress">
              <Files layout="label" loading />
            </Sample>
          </div>
          <div className="composer-file-grid">
            {files.map((f) => (
              <div key={f.type}>
                <span>{f.type}</span>
                <Attachment {...f} label={undefined} />
                <Attachment {...f} />
                <Attachment {...f} size="sm" />
              </div>
            ))}
          </div>
        </section>
        <section id="keywords">
          <h2>Keyword Tag</h2>
          <div className="composer-keywords">
            {[
              ["Nano Banana", geminiLogo],
              ["Claude", claudeLogo],
              ["Grok", grokLogo],
              ["Kling", klingLogo],
              ["Qwen", qwenLogo],
              ["Midjourney", midjourneyLogo],
              ["GPT 5.4", openaiLogo],
              ["Figma", figmaLogo],
              ["Notion", notionLogo],
              ["Gmail", gmailLogo],
              ["Google Calendar", calendarLogo],
              ["GitHub", githubLogo],
            ].map(([label, src]) => (
              <KeywordTag key={label} icon={label === "Figma" ? <span className="relative size-4"><img src={src} alt="" style={{position: "absolute", left: "23.61%", top: "11.46%", width: "52.78%", height: "79.16%"}} /></span> : <img src={src} alt="" />}>
                {label}
              </KeywordTag>
            ))}
            <KeywordTag src={imageThumb}>Image</KeywordTag>
            <KeywordTag icon={<LinkGlyph />}>oreoui.com</KeywordTag>
            <KeywordTag icon={<TextGlyph />}>memory.md</KeywordTag>
            <KeywordTag icon={<FolderGlyph />}>Folder</KeywordTag>
            <KeywordTag icon={<PlusGlyph />} color="purple">
              Create Image
            </KeywordTag>
            <KeywordTag icon={<CodeGlyph />} color="blue">
              Create Code
            </KeywordTag>
          </div>
          <div className="composer-keywords" data-figma="keyword-removable">
            {[
              "Nano Banana",
              "Figma",
              "Image",
              "oreoui.com",
              "Create Image",
              "Create Code",
            ].map(
              (label, i) =>
                !removedTags.includes(label) && (
                  <KeywordTag
                    key={label}
                    src={i === 2 ? imageThumb : undefined}
                    icon={
                      i === 0 ? (
                        <img src={geminiLogo} alt="" />
                      ) : i === 1 ? (
                        <span className="relative size-4">
                          <img
                            src={figmaLogo}
                            alt=""
                            style={{
                              position: "absolute",
                              left: "23.61%",
                              top: "11.46%",
                              width: "52.78%",
                              height: "79.16%",
                            }}
                          />
                        </span>
                      ) : i === 3 ? (
                        <LinkGlyph />
                      ) : i === 4 ? (
                        <PlusGlyph />
                      ) : (
                        <CodeGlyph />
                      )
                    }
                    color={i === 4 ? "purple" : i === 5 ? "blue" : "surface"}
                    onRemove={() => setRemovedTags((v) => [...v, label])}
                  >
                    {label}
                  </KeywordTag>
                ),
            )}
          </div>
        </section>
        <section id="usage">
          <h2>Usage</h2>
          <div className="composer-menu-grid">
            <Panel id="4112:3429" label="Variant A">
              <ComposerUsageMenu />
            </Panel>
            <Panel id="4243:6946" label="Variant B / collapsed">
              <ComposerUsageMenu variant="inline" />
            </Panel>
            <Panel id="4243:6759" label="Variant B / expanded">
              <ComposerUsageMenu variant="inline" defaultExpanded />
            </Panel>
            <Panel id="4363:3268" label="Variant C">
              <ComposerUsageMenu variant="submenu" />
            </Panel>
            <Panel id="4242:6375" label="Usage details" width={440}>
              <ComposerUsageMeters />
            </Panel>
          </div>
        </section>
        <section id="menus">
          <h2>Composer menus</h2>
          <div className="composer-menu-grid">
            <Panel id="4228:1094" label="Add">
              <ComposerAddMenu />
            </Panel>
            <Panel id="4228:1195" label="Connectors">
              <ComposerConnectorMenu />
            </Panel>
            <Panel id="4228:3886" label="Approval">
              <ComposerApprovalMenu />
            </Panel>
            <Panel id="4232:4292" label="Detailed approval" width={438}>
              <ComposerApprovalMenu detailed value="automatic" />
            </Panel>
            <Panel id="5009:11211" label="Model settings" width={237}>
              <ComposerModelSettings activeSetting="model" />
            </Panel>
            <Panel id="5009:11219" label="Model list" width={237}>
              <ComposerModelList />
            </Panel>
            <Panel id="5009:11343" label="Model search" width={237}>
              <ComposerModelList searchable />
            </Panel>
            <Panel id="5009:11453" label="Model categories" width={237}>
              <ComposerModelList categorized />
            </Panel>
            <Panel id="4256:2644" label="Effort / Low" width={304}>
              <ComposerEffort value={0} />
            </Panel>
            <Panel id="4234:4917" label="Effort / High" width={304}>
              <ComposerEffort value={3} />
            </Panel>
            <Panel id="4256:2593" label="Effort / Ultracode" width={304}>
              <ComposerEffort value={5} />
            </Panel>
            <Panel id="4234:5005" label="Described model list" width={304}>
              <ComposerDescribedModels />
            </Panel>
            <Panel id="4238:5469" label="@ menu" width={629}>
              <ComposerCommandList />
            </Panel>
            <Panel id="4238:5521" label="/ menu" width={629}>
              <ComposerCommandList kind="slash" />
            </Panel>
          </div>
        </section>
      </main>
    </div>
  );
}
