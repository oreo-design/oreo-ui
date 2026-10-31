import { ComponentRules } from "@/docs/ComponentRules";
import { composerRules } from "@/components/composer/rules";
import { SourceReference } from "@/docs/SourceReference";
import VIDEO_THUMB from "@/components/composer/assets/e9ccd.png";
import IMG_THUMB from "@/components/composer/assets/1ebaa.png";
import { useState, type ReactNode } from "react";
import { PromptBoxDictationDemo } from "@/docs/playground/PromptBoxDictationDemo";
import { AnimatePresence, motion } from "motion/react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Button } from "@/components/button";
import { Chip, ChipGroup } from "@/components/chip";
import { Attachment, AttachmentBar, type AttachmentType } from "@/components/attachment";
import { MenuItem, MenuPopup, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger } from "@/components/menu";
import { PromptBox, PromptBoxModelSelect, KeywordTag } from "@/components/prompt-box";
import { ComposerAsset } from "@/components/composer/assets";
import type { SpringProps } from "@/docs/DocsPage";
import openaiLogo from "@/components/icon/assets/brands/openai.svg";
import claudeLogo from "@/components/icon/assets/brands/claude-color.svg";
import googleLogo from "@/components/icon/assets/brands/google-color.svg";

const TOC: TocItem[] = [
  { id: "prompt-box", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "input", label: "Input" },
  { id: "attachments", label: "Attachments" },
  { id: "keyword-tags", label: "Keyword tags" },
  { id: "voice", label: "Voice input" },
  { id: "dictation", label: "Dictation & actions" },
  { id: "model-select", label: "Model select" },
  { id: "add-ons", label: "Add-ons" },
  { id: "api", label: "API Reference" },
  { id: "component-rules", label: "Usage rules" },
];

const PROPS: PropRow[] = [
  { prop: "value / defaultValue", type: "string", desc: "Controlled or uncontrolled input text." },
  { prop: "onValueChange", type: "(value: string) => void", desc: "Fires on every keystroke." },
  { prop: "onSubmit", type: "(value: string) => void", desc: "Send button or Enter (without Shift)." },
  { prop: "running", type: "boolean", def: "false", desc: "Streaming state — the send button becomes a stop square and the empty hint reads “Continue asking...”." },
  { prop: "submitDisabled / readOnly", type: "boolean", def: "false", desc: "Block submission while a provider finalizes input; keep generated text selectable during action review." },
  { prop: "onStop", type: "() => void", desc: "Stop button press while running." },
  { prop: "placeholder", type: "ReactNode", desc: "Empty-state hint. Defaults to the “press / for commands” row." },
  { prop: "attachments", type: "ReactNode", desc: "Row above the text — usually an <AttachmentBar>." },
  { prop: "tags", type: "ReactNode", desc: "Inline <KeywordTag> chips at the head of the first text line." },
  { prop: "modelSelect", type: "ReactNode", desc: "The model picker — usually a <PromptBoxModelSelect>." },
  { prop: "voice", type: '"wave" | "mic"', desc: "Voice add-on: wave and mic sit beside the send button." },
  { prop: "voiceStatus", type: '"idle" | "inputting" | "thinking"', def: '"idle"', desc: "Drives the wave button ↔ Stop pill ↔ Thinking pill." },
  { prop: "entryStyle", type: '"attachment" | "add"', def: '"attachment"', desc: "Choose the bordered attachment entry or quiet plus entry; both call onAttach. Custom attachControl takes priority." },
  { prop: "showMention", type: "boolean", def: "true", desc: "Independently show or hide the mention control." },
  { prop: "permission", type: "PromptBoxPermissionProps", desc: "Controlled value, options (value, label, neutral/warning tone), onValueChange and disabled. Permission policy remains host-owned." },
  { prop: "connectApps", type: "PromptBoxConnectAppsProps", desc: "Attached footer: apps (id, label, icon, connected, disabled), label, onAppClick; or onClick to launch your own connection flow. No authorization is performed by the UI." },
  { prop: "onAttach / onMention / onVoiceToggle", type: "() => void", desc: "Toolbar button callbacks." },
  { prop: "header / footer", type: "ReactNode", desc: "A <ContextBar> docked above or below. Explicit footer content (including null) takes priority over connectApps." },
  { prop: "inset", type: "boolean", def: "false", desc: "Indents docked bars by 12px (Figma “Is Inset”)." },
];

const FILLED =
  "Building a To-Do application requires a balance between simplicity for quick entries and enough structure to stay organized. Here is a comprehensive blueprint.";



const brandImg = "[.theme-dark_&]:invert";

/** The Model Select dropdown content — see the Menu page for the primitive. */
function ModelMenu() {
  return (
    <>
      <MenuItem selected trailing={<ComposerAsset name="check" className="text-text-primary" />}>Auto</MenuItem>
      <MenuItem>Use multiple models</MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuSubmenuTrigger trailingIcon={<ComposerAsset name="right" className="text-text-tertiary" />} icon={<img src={openaiLogo} alt="" className={brandImg} />}>OpenAI</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>GPT-5.2 Pro</MenuItem>
          <MenuItem>GPT-5.2</MenuItem>
          <MenuItem>GPT-5 mini</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger trailingIcon={<ComposerAsset name="right" className="text-text-tertiary" />} icon={<img src={claudeLogo} alt="" />}>Anthropic</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem selected trailing={<ComposerAsset name="check" className="text-text-primary" />}>Claude Opus 4.5</MenuItem>
          <MenuItem>Claude Sonnet 4.5</MenuItem>
          <MenuItem>Claude Haiku 4.5</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger trailingIcon={<ComposerAsset name="right" className="text-text-tertiary" />} icon={<img src={googleLogo} alt="" />}>Google</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>Gemini 3.1 Pro</MenuItem>
          <MenuItem>Gemini 3 Flash</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
    </>
  );
}

function ClaudeSelect({ menu = false }: { menu?: boolean }) {
  return (
    <PromptBoxModelSelect
      icon={<img src={claudeLogo} alt="" />}
      label="Claude"
      menu={menu ? <ModelMenu /> : undefined}
    />
  );
}

const ATTACH_FILES = [
  { id: 1, type: "image" as AttachmentType, label: "Image.jpg" },
  { id: 2, type: "video" as AttachmentType, label: "Video.mp4" },
  { id: 3, type: "doc" as AttachmentType, label: "Draft.pdf" },
  { id: 4, type: "text" as AttachmentType, label: "ReadMe.txt" },
];

function srcFor(type: AttachmentType) {
  return type === "image" ? IMG_THUMB : type === "video" ? VIDEO_THUMB : undefined;
}

/** A PromptBox with a live attachment bar: hover a chip for the ×, click to
 * spring it out; when the last one goes the whole row collapses away. */
function AttachmentsDemo({ spring, labeled = false, size = "md" }: { spring: SpringProps; labeled?: boolean; size?: "md" | "sm" }) {
  const [files, setFiles] = useState(ATTACH_FILES);
  const chipSpring = { type: "spring", bounce: 0.3, duration: 0.35 } as const;
  return (
    <div className="flex w-full flex-col items-start gap-[var(--space-x4)]">
      <PromptBox
        defaultValue={FILLED}
        attachments={
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div key="bar" exit={{ opacity: 0, height: 0 }} transition={chipSpring} className="w-full overflow-hidden">
                <AttachmentBar>
                  <AnimatePresence>
                    {files.map((f) => (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={chipSpring}
                      >
                        <Attachment
                          size={size}
                          type={f.type}
                          src={srcFor(f.type)}
                          label={labeled ? f.label : undefined}
                          onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </AttachmentBar>
              </motion.div>
            )}
          </AnimatePresence>
        }
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
      {files.length === 0 && (
        <Button type="secondary" size="sm" onClick={() => setFiles(ATTACH_FILES)}>
          Reset
        </Button>
      )}
    </div>
  );
}

/** A PromptBox whose keyword tag is live: hover for the ×, remove collapses
 * the first-line indent back; Reset restores it. */
function TagsDemo({ spring, render }: { spring: SpringProps; render: (remove: () => void) => ReactNode }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex w-full flex-col items-start gap-[var(--space-x4)]">
      <PromptBox
        defaultValue={`Building a To-Do application requires a balance between simplicity for quick entries and stay organized. Here is a comprehensive blueprint for the app's architecture and logic.`}
        tags={visible ? render(() => setVisible(false)) : undefined}
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
      {!visible && (
        <Button type="secondary" size="sm" onClick={() => setVisible(true)}>
          Reset
        </Button>
      )}
    </div>
  );
}

function VoiceWaveDemo({ spring }: { spring: SpringProps }) {
  const [status, setStatus] = useState<"idle" | "inputting">("idle");
  return (
    <PromptBox
      defaultValue={FILLED}
      voice="wave"
      voiceStatus={status}
      onVoiceToggle={() => setStatus((s) => (s === "idle" ? "inputting" : "idle"))}
      modelSelect={<ClaudeSelect />}
      {...spring}
    />
  );
}

function VoiceMicDemo({ spring }: { spring: SpringProps }) {
  const [status, setStatus] = useState<"idle" | "inputting">("idle");
  return (
    <PromptBox
      voice="mic"
      voiceStatus={status}
      onVoiceToggle={() => setStatus((s) => (s === "idle" ? "inputting" : "idle"))}
      modelSelect={<ClaudeSelect />}
      {...spring}
    />
  );
}

const INPUT_CODE = `import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";

<PromptBox modelSelect={<PromptBoxModelSelect icon={…} label="Claude" menu={…} />} />
<PromptBox defaultValue="Building a To-Do application…" onSubmit={send} />
<PromptBox running onStop={stop} />`;

const ATTACH_CODE = `<PromptBox
  defaultValue="…"
  attachments={
    <AttachmentBar>
      {files.map((f) => (
        <Attachment
          key={f.id}
          type={f.type}
          src={f.src}
          label={f.label}
          onRemove={() => remove(f.id)}
        />
      ))}
    </AttachmentBar>
  }
/>`;

const TAGS_CODE = `<PromptBox
  defaultValue="…"
  tags={
    <KeywordTag icon={<ComposerAsset name="figmaSmall" />} onRemove={remove}>
      Figma
    </KeywordTag>
  }
/>

<PromptBox
  defaultValue="…"
  tags={
    <KeywordTag color="purple" icon={<ComposerAsset name="plus" />} onRemove={remove}>
      Create Image
    </KeywordTag>
  }
/>`;

const VOICE_CODE = `// Type A — a wave button beside send; tap to talk, tap to stop
<PromptBox voice="wave" voiceStatus={status} onVoiceToggle={toggle} />
<PromptBox voice="wave" voiceStatus="thinking" />

// Type B — a quiet mic beside the send button
<PromptBox voice="mic" voiceStatus={status} onVoiceToggle={toggle} />`;

const ADDONS_CODE = `<div className="flex w-full flex-col gap-[var(--space-x4)]">
  <ChipGroup>
    <Chip icon={<ComposerAsset name="suggestion" />}>Summarize this page</Chip>
    <Chip icon={<ComposerAsset name="suggestion" />}>Debug my code</Chip>
  </ChipGroup>
  <PromptBox … />
</div>`;

const DICTATION_CODE = `import { PromptBoxDictation } from "@/components/prompt-box";

<PromptBoxDictation
  draft={draft} // { text: "", actions: [{ id, label, text }] }
  onDraftChange={setDraft}
  status={status}
  transcript={partialTranscript}
  onStart={startRecognition}
  onFinish={finalizeRecognition}
  onCancel={cancelRecognition}
  onRetry={retryRecognition}
  onSubmit={({ prompt, actions }) => send(prompt, actions)}
/>

// PromptBoxActions is also exported for your own composer.
// composePromptDraft(draft) produces the same reviewed text.`;

export function PromptBoxDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Prompt Box"]} nav={nav}>
      {({ spring }) => (
        <>
          <header id="prompt-box" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Prompt Box</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A multi-state input component for agent conversations. The card adapts its controls to
              the interaction state — empty, filled, running — and hosts attachments, keyword tags,
              voice input, and the model picker without owning any of them.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="prompt-box" />
          </Section>

          <Section
            id="input"
            title="Input"
            description="Empty shows the slash-command hint; typing arms the send button; running swaps it for a stop square and hints “Continue asking...”."
          >
            <PreviewTabs
              code={INPUT_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />
                  <PromptBox defaultValue={FILLED} modelSelect={<ClaudeSelect menu />} {...spring} />
                  <PromptBox running modelSelect={<ClaudeSelect menu />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section
            id="attachments"
            title="Attachments"
            description="An Attachment Bar docks above the text: preview squares for tight rows, labeled chips when the filename matters, small labels for dense surfaces. Hover a chip for its × — removing the last one collapses the row."
          >
            <PreviewTabs
              code={ATTACH_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <AttachmentsDemo spring={spring} />
                  <AttachmentsDemo spring={spring} labeled />
                  <AttachmentsDemo spring={spring} labeled size="sm" />
                </div>
              }
            />
          </Section>

          <Section
            id="keyword-tags"
            title="Keyword tags"
            description="Inline chips at the head of the first line — a source context (“Figma”) or a generative keyword (“Create Image”). The text wraps around them; hover one for its ×."
          >
            <PreviewTabs
              code={TAGS_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <TagsDemo
                    spring={spring}
                    render={(remove) => (
                      <KeywordTag icon={<ComposerAsset name="figmaSmall" />} onRemove={remove}>
                        Figma
                      </KeywordTag>
                    )}
                  />
                  <TagsDemo
                    spring={spring}
                    render={(remove) => (
                      <KeywordTag color="purple" icon={<ComposerAsset name="plus" />} onRemove={remove}>
                        Create Image
                      </KeywordTag>
                    )}
                  />
                </div>
              }
            />
          </Section>

          <Section
            id="voice"
            title="Voice input"
            description="Type A keeps a wave button beside send — tap to talk, the pill pulses while listening, and “Thinking” shimmers while the model works. Type B uses a quiet mic beside send."
          >
            <PreviewTabs
              code={VOICE_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <VoiceWaveDemo spring={spring} />
                  <PromptBox defaultValue={FILLED} voice="wave" voiceStatus="thinking" modelSelect={<ClaudeSelect />} {...spring} />
                  <VoiceMicDemo spring={spring} />
                </div>
              }
            />
          </Section>

          <Section id="dictation" title="Dictation & actions" description="Turn a spoken idea into a reviewable prompt. Actions arrive in the docked bar; remove one to remove its instruction from the prompt, or edit everything as text. Listening and processing prevent premature submission.">
            <PreviewTabs code={DICTATION_CODE} preview={<PromptBoxDictationDemo />} />
            <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">The component handles presentation and draft review. Supply a speech provider and action extractor in your app. Use stable action IDs, remember removed IDs while streaming, cancel in-flight work when a session ends, and ignore late results from older sessions. Cancel and Keep draft retain accepted actions; Reset sample clears the fixture.</p>
            <PropsTable rows={[
              { prop: "draft / onDraftChange", type: "PromptBoxDraft / (draft) => void", desc: "Controlled text plus actions: { id, label, text }. Only retained actions enter the composed prompt." },
              { prop: "status", type: "idle | listening | processing | ready | error", desc: "Provider lifecycle. Error blocks submission until retry or Keep draft." },
              { prop: "transcript", type: "string", desc: "Interim speech caption, shown while listening; never submitted automatically." },
              { prop: "onStart / onFinish / onCancel / onRetry", type: "() => void", desc: "Host callbacks. Stop finalizes recognition; cancel should abort pending provider work." },
              { prop: "onSubmit", type: "({ prompt, actions }) => void", desc: "Composed text and a snapshot of the reviewed actions. Caller owns clearing and delivery." },
              { prop: "error", type: "string", desc: "Recoverable provider error with retry and Keep draft actions." },
            ]} />
          </Section>

          <Section
            id="model-select"
            title="Model select"
            description="The “Claude ⌄” trigger opens the real dropdown — a Menu with provider submenus. See the Menu page for the primitive."
          >
            <PreviewTabs
              code={`<PromptBoxModelSelect icon={<img src={claudeLogo} alt="" />} label="Claude" menu={<ModelMenu />} />`}
              preview={<PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />}
            />
          </Section>

          <Section
            id="add-ons"
            title="Add-ons"
            description="Contextual suggestion chips float above the card — prompts the agent thinks you might want next."
          >
            <PreviewTabs
              code={ADDONS_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-[var(--space-x4)]">
                  <ChipGroup>
                    <Chip icon={<ComposerAsset name="suggestion" />} {...spring}>
                      Summarize this page
                    </Chip>
                    <Chip icon={<ComposerAsset name="suggestion" />} {...spring}>
                      Debug my code
                    </Chip>
                  </ChipGroup>
                  <PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="PromptBox extends native <div> props. KeywordTag and PromptBoxModelSelect ship alongside.">
            <PropsTable rows={PROPS} />
          </Section>
        <ComponentRules rule={composerRules} />
          </>
      )}
    </DocsPage>
  );
}
