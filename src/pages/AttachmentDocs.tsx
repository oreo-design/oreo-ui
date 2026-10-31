import { SourceReference } from "@/docs/SourceReference";
import VIDEO_THUMB from "@/components/composer/assets/e9ccd.png";
import IMG_THUMB from "@/components/composer/assets/1ebaa.png";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Attachment, AttachmentBar, type AttachmentType } from "@/components/attachment";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "attachment", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "layouts", label: "Layouts" },
  { id: "file-types", label: "File types" },
  { id: "removable", label: "Removable" },
  { id: "loading", label: "Loading" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "label", type: "string", desc: "Filename. Omit it for the icon-only 36px square." },
  { prop: "type", type: "AttachmentType", def: '"unknown"', desc: "image · video · doc · text · code · json · music · unknown · link · pdf. Defaults to image when src is set." },
  { prop: "src", type: "string", desc: "Thumbnail URL for image and video chips." },
  { prop: "size", type: '"md" | "sm"', def: '"md"', desc: "sm compacts the labeled chip to 28px tall." },
  { prop: "loading", type: "boolean", def: "false", desc: "Dot spinner in the icon slot, shimmered label." },
  { prop: "onRemove", type: "() => void", desc: "Square: floating × badge on hover. Labeled: the leading icon swaps to an × in place." },
];



const LAYOUTS_CODE = `import { Attachment, AttachmentBar } from "@/components/attachment";

// Preview — icon-only squares
<AttachmentBar>
  <Attachment type="image" src={url} onRemove={…} />
  <Attachment type="doc" onRemove={…} />
</AttachmentBar>

// Preview + Label
<AttachmentBar>
  <Attachment type="image" src={url} label="Image.jpg" onRemove={…} />
</AttachmentBar>

// Small Label
<AttachmentBar>
  <Attachment size="sm" type="pdf" label="Draft.pdf" onRemove={…} />
</AttachmentBar>`;

const FILE_TYPES: { type: AttachmentType; label: string }[] = [
  { type: "image", label: "Image.jpg" },
  { type: "video", label: "Video.mp4" },
  { type: "doc", label: "Draft.pdf" },
  { type: "text", label: "ReadMe.txt" },
  { type: "code", label: "index.html" },
  { type: "json", label: "config.json" },
  { type: "music", label: "City of Stars.mp3" },
  { type: "unknown", label: "Unknown File" },
  { type: "link", label: "oreo.com" },
  { type: "pdf", label: "oreo.com" },
];

function srcFor(type: AttachmentType) {
  return type === "image" ? IMG_THUMB : type === "video" ? VIDEO_THUMB : undefined;
}

const INITIAL = [
  { id: 1, type: "image" as const, label: "Image.jpg" },
  { id: 2, type: "video" as const, label: "Video.mp4" },
  { id: 3, type: "doc" as const, label: "Draft.pdf" },
  { id: 4, type: "music" as const, label: "City of Stars.mp3" },
];

function RemovableDemo() {
  const [files, setFiles] = useState(INITIAL);
  return (
    <div className="flex min-h-16 w-full max-w-xl flex-col items-start gap-4">
      <AttachmentBar>
        <AnimatePresence>
          {files.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            >
              <Attachment
                type={f.type}
                src={srcFor(f.type)}
                onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </AttachmentBar>
      <AttachmentBar>
        <AnimatePresence>
          {files.map((f) => (
            <motion.div
              key={`label-${f.id}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            >
              <Attachment
                type={f.type}
                src={srcFor(f.type)}
                label={f.label}
                onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </AttachmentBar>
      {files.length === 0 && (
        <Button type="secondary" size="sm" onClick={() => setFiles(INITIAL)}>
          Reset
        </Button>
      )}
    </div>
  );
}

export function AttachmentDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Attachment"]} nav={nav}>
      {() => (
        <>
          <header id="attachment" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Attachment</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              File chips for composers and messages. Image and video thumbnails fill the chip;
              every other kind gets its paper file icon. Three layouts — icon-only preview,
              labeled, and small — plus loading and removal states straight from the kit.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="attachment" />
          </Section>

          <Section
            id="layouts"
            title="Layouts"
            description="Preview squares for tight composer rows, labeled chips when the filename matters, small labels for dense surfaces."
          >
            <PreviewTabs
              code={LAYOUTS_CODE}
              preview={
                <div className="flex w-full max-w-xl flex-col items-start gap-6">
                  <AttachmentBar>
                    <Attachment type="image" src={IMG_THUMB} />
                    <Attachment type="video" src={VIDEO_THUMB} />
                    <Attachment type="doc" />
                    <Attachment type="text" />
                    <Attachment type="code" />
                    <Attachment type="json" />
                    <Attachment type="music" />
                  </AttachmentBar>
                  <AttachmentBar>
                    <Attachment type="image" src={IMG_THUMB} label="Image.jpg" />
                    <Attachment type="video" src={VIDEO_THUMB} label="Video.mp4" />
                    <Attachment type="doc" label="Draft.pdf" />
                  </AttachmentBar>
                  <AttachmentBar>
                    <Attachment size="sm" type="image" src={IMG_THUMB} label="Image.jpg" />
                    <Attachment size="sm" type="code" label="index.html" />
                    <Attachment size="sm" type="json" label="config.json" />
                  </AttachmentBar>
                </div>
              }
            />
          </Section>

          <Section
            id="file-types"
            title="File types"
            description="Ten kinds: media thumbnails plus the paper icon family — doc, text, code, json, music, unknown, link, and pdf."
          >
            <PreviewTabs
              code={`<Attachment type="code" label="index.html" />`}
              preview={
                <AttachmentBar className="max-w-xl">
                  {FILE_TYPES.map((f) => (
                    <Attachment key={f.type} type={f.type} src={srcFor(f.type)} label={f.label} />
                  ))}
                </AttachmentBar>
              }
            />
          </Section>

          <Section
            id="removable"
            title="Removable"
            description="Hover a square for the corner ×; hover a labeled chip and the leading icon gives way to the × in place. Chips spring out on removal."
          >
            <PreviewTabs
              code={`<Attachment type="doc" label="Draft.pdf" onRemove={…} />`}
              preview={<RemovableDemo />}
            />
          </Section>

          <Section id="loading" title="Loading" description="While the upload is in flight: dot spinner, shimmered label.">
            <PreviewTabs
              code={`<Attachment loading label="loading" />\n<Attachment loading />`}
              preview={
                <AttachmentBar>
                  <Attachment loading />
                  <Attachment loading label="loading" />
                  <Attachment loading size="sm" label="loading" />
                </AttachmentBar>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Attachment extends native <div> props. AttachmentBar is a wrapping flex row.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
