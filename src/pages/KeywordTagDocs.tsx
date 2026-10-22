import IMG_THUMB from "@/components/composer/assets/1ebaa.png";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Button } from "@/components/button";
import {
  KeywordTag,
  PlusGlyph,
  CodeGlyph,
  LinkGlyph,
  TextGlyph,
  FolderGlyph,
} from "@/components/keyword-tag";
import openaiLogo from "@/components/icon/assets/brands/openai.svg";
import claudeLogo from "@/components/icon/assets/brands/claude-color.svg";
import figmaLogo from "@/components/icon/assets/brands/figma-color.svg";
import geminiLogo from "@/components/icon/assets/brands/gemini-color.svg";
import grokLogo from "@/components/icon/assets/brands/grok.svg";
import klingLogo from "@/components/icon/assets/brands/kling-color.svg";
import qwenLogo from "@/components/icon/assets/brands/qwen-color.svg";
import midjourneyLogo from "@/components/icon/assets/brands/midjourney.svg";
import notionLogo from "@/components/icon/assets/brands/notion.svg";
import gmailLogo from "@/components/icon/assets/brands/gmail.svg";
import calendarLogo from "@/components/icon/assets/brands/google-calendar.svg";
import githubLogo from "@/components/icon/assets/brands/github.svg";

const TOC: TocItem[] = [
  { id: "keyword-tag", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "types", label: "Types" },
  { id: "removable", label: "Removable" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "icon", type: "ReactNode", desc: "Leading 16px glyph — a brand <img> or an <Icon>." },
  { prop: "src", type: "string", desc: "Thumbnail URL — switches to the referenced-image form (hairline frame, wider gap)." },
  { prop: "color", type: '"surface" | "purple" | "mint" | "pink" | "blue" | "orange"', def: '"surface"', desc: "Surface is the bordered white look; palette tones drop the border." },
  { prop: "onRemove", type: "() => void", desc: "Hover swaps the leading slot for an × in place and tints the chip. The × is its own button — the tag's onClick never fires from it." },
];


/** Monochrome brand marks flip to white in the dark theme. */
const mono = "[.theme-dark_&]:invert";

function Caption({ children }: { children: string }) {
  return <p className="font-mono text-[12px] leading-4 text-[var(--color-text-placeholder)]">{children}</p>;
}

const TYPES_CODE = `import { KeywordTag, LinkGlyph, PlusGlyph, CodeGlyph } from "@/components/keyword-tag";

// Model / integration — a brand glyph and a name
<KeywordTag icon={<img src={claudeLogo} alt="" />}>Claude</KeywordTag>

// Referenced content — thumbnail, link, file
<KeywordTag src={thumb}>Image</KeywordTag>
<KeywordTag icon={<LinkGlyph />}>oreoui.com</KeywordTag>

// Agent actions — palette tones, glyphs follow the text color
<KeywordTag color="purple" icon={<PlusGlyph />}>Create Image</KeywordTag>
<KeywordTag color="blue" icon={<CodeGlyph />}>Create Code</KeywordTag>`;

const REMOVABLE_CODE = `<KeywordTag
  icon={<img src={figmaLogo} alt="" />}
  onRemove={() => remove(id)}
>
  Figma
</KeywordTag>`;

const INITIAL = [
  { id: 1, label: "Figma", icon: <img src={figmaLogo} alt="" /> },
  { id: 2, label: "Claude", icon: <img src={claudeLogo} alt="" /> },
  { id: 3, label: "Image", src: IMG_THUMB },
  { id: 4, label: "oreoui.com", icon: <LinkGlyph /> },
  { id: 5, label: "Create Image", color: "purple" as const, icon: <PlusGlyph /> },
  { id: 6, label: "Create Code", color: "blue" as const, icon: <CodeGlyph /> },
];

function RemovableDemo() {
  const [tags, setTags] = useState(INITIAL);
  return (
    <div className="flex min-h-10 w-full max-w-xl flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-[var(--space-x4)]">
        <AnimatePresence>
          {tags.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            >
              <KeywordTag
                icon={t.icon}
                src={t.src}
                color={t.color}
                onRemove={() => setTags((p) => p.filter((x) => x.id !== t.id))}
              >
                {t.label}
              </KeywordTag>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {tags.length === 0 && (
        <Button type="secondary" size="sm" onClick={() => setTags(INITIAL)}>
          Reset
        </Button>
      )}
    </div>
  );
}

export function KeywordTagDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Keyword Tag"]} nav={nav}>
      {() => (
        <>
          <header id="keyword-tag" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Keyword Tag</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A compact tag used to represent models, integrations, referenced content, and agent
              actions. Supports an optional leading icon and a hover remove action — designed for
              dense agent interfaces such as prompt composers, context panels, and configuration
              views.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add keyword-tag\n# or copy src/components/keyword-tag/* by hand`} />
          </Section>

          <Section
            id="types"
            title="Types"
            description="Four families straight from the kit: models, integrations, referenced content, and palette-toned agent actions."
          >
            <PreviewTabs
              code={TYPES_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <div className="flex flex-col gap-3">
                    <Caption>Model</Caption>
                    <div className="flex flex-wrap items-center gap-6">
                      <KeywordTag icon={<img src={geminiLogo} alt="" />}>Nano Banana</KeywordTag>
                      <KeywordTag icon={<img src={claudeLogo} alt="" />}>Claude</KeywordTag>
                      <KeywordTag icon={<img src={grokLogo} alt="" className={mono} />}>Grok</KeywordTag>
                      <KeywordTag icon={<img src={klingLogo} alt="" className={mono} />}>Kling</KeywordTag>
                      <KeywordTag icon={<img src={qwenLogo} alt="" />}>Qwen</KeywordTag>
                      <KeywordTag icon={<img src={midjourneyLogo} alt="" className={mono} />}>Midjourney</KeywordTag>
                      <KeywordTag icon={<img src={openaiLogo} alt="" className={mono} />}>GPT 5.4</KeywordTag>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Caption>Integration</Caption>
                    <div className="flex flex-wrap items-center gap-6">
                      <KeywordTag icon={<span className="relative size-4"><img src={figmaLogo} alt="" style={{position: "absolute", left: "23.61%", top: "11.46%", width: "52.78%", height: "79.16%"}} /></span>}>Figma</KeywordTag>
                      <KeywordTag icon={<img src={notionLogo} alt="" className={mono} />}>Notion</KeywordTag>
                      <KeywordTag icon={<img src={gmailLogo} alt="" />}>Gmail</KeywordTag>
                      <KeywordTag icon={<img src={calendarLogo} alt="" />}>Google Calendar</KeywordTag>
                      <KeywordTag icon={<img src={githubLogo} alt="" className={mono} />}>GitHub</KeywordTag>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Caption>Content</Caption>
                    <div className="flex flex-wrap items-center gap-6">
                      <KeywordTag src={IMG_THUMB}>Image</KeywordTag>
                      <KeywordTag icon={<LinkGlyph />}>oreoui.com</KeywordTag>
                      <KeywordTag icon={<TextGlyph />}>memory.md</KeywordTag>
                      <KeywordTag icon={<FolderGlyph />}>Folder</KeywordTag>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Caption>Agent actions</Caption>
                    <div className="flex flex-wrap items-center gap-6">
                      <KeywordTag color="purple" icon={<PlusGlyph />}>Create Image</KeywordTag>
                      <KeywordTag color="blue" icon={<CodeGlyph />}>Create Code</KeywordTag>
                    </div>
                  </div>
                </div>
              }
            />
          </Section>

          <Section
            id="removable"
            title="Removable"
            description="Hover a tag and the leading glyph gives way to the × in place while the chip tints; tags spring out on removal. onClick still passes through the tag body."
          >
            <PreviewTabs code={REMOVABLE_CODE} preview={<RemovableDemo />} />
          </Section>

          <Section id="api" title="API Reference" description="KeywordTag extends native <span> props — onClick passes through. The kit's small glyphs (PlusGlyph, CodeGlyph, LinkGlyph, TextGlyph, FolderGlyph) ship alongside and paint with the text color.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
