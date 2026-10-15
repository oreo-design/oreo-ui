import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  TextToolbar,
  ColorOrb,
  FontSizeStepper,
  TextAlignmentControl,
  FontFamilyPicker,
  DEFAULT_TEXT_FORMAT,
  textFormatStyle,
} from "@/components/text-toolbar";
const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "composition", label: "Toolbar" },
  { id: "pieces", label: "Building blocks" },
  { id: "usage", label: "Usage" },
  { id: "api", label: "API reference" },
];
export function TextToolbarDocs({ nav }: { nav: DocsNav }) {
  const [format, setFormat] = useState(DEFAULT_TEXT_FORMAT);
  const [notice, setNotice] = useState("");
  return (
    <DocsPage nav={nav} toc={toc} breadcrumb={["Components", "Text Toolbar"]}>
      {() => (
        <>
          <header id="introduction">
            <h1 className="text-3xl font-semibold tracking-tight">
              A little more character.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              A compact text toolbar with a spectrum orb, six formatting
              toggles, three contextual actions and a row of type controls.
            </p>
            <p className="mt-3 text-sm leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/zzzzshawn/status/2110512054851526682"
                target="_blank"
                rel="noreferrer"
              >
                shawn.’s text toolbar concept
              </a>
              . The original static image becomes a controlled component family
              using Oreo’s menu, controls, icon adapters and semantic tokens.
            </p>
            <Button
              className="mt-6"
              tapScale={1}
              render={<a href="/writing-studio" />}
            >
              Open Writing Studio ↗
            </Button>
          </header>
          <Section
            id="composition"
            title="One compact workspace"
            description="The host owns the style value and text model. This example applies formatting to its complete preview, with contextual actions exposed as callbacks."
          >
            <TextToolbar
              value={format}
              onValueChange={setFormat}
              onLink={() =>
                setNotice(
                  "Link callback received. The template includes a validated URL editor.",
                )
              }
              onMention={() =>
                setNotice(
                  "Mention callback received. The template inserts a local name.",
                )
              }
              onTransform={(action) => setNotice(`Text action: ${action}`)}
            />
            <p
              className="my-8 rounded-control p-4"
              style={textFormatStyle(format)}
            >
              Make a little room for a big idea.
            </p>
            <p role="status" className="text-sm text-text-secondary">
              {notice}
            </p>
          </Section>
          <Section
            id="pieces"
            title="Small pieces, shared behavior"
            description="Use the controls independently. Named colors replace tiny, hard-to-hit sphere points; the sphere remains decorative."
          >
            <div className="flex flex-wrap items-center gap-5">
              <div className="w-40">
                <ColorOrb
                  value={format.color}
                  onValueChange={(color) => setFormat({ ...format, color })}
                />
              </div>
              <FontSizeStepper
                value={format.size}
                onValueChange={(size) => setFormat({ ...format, size })}
              />
              <TextAlignmentControl
                value={format.align}
                onValueChange={(align) => setFormat({ ...format, align })}
              />
              <FontFamilyPicker
                value={format.font}
                onValueChange={(font) => setFormat({ ...format, font })}
              />
            </div>
          </Section>
          <Section
            id="usage"
            title="Bring your own text model"
            description="Copy text-toolbar with its CSS and Oreo imports. The Writing Studio template demonstrates whole-block styling, local editing, history, safe links and plain-text mentions."
          >
            <CodeBlock
              code={
                'import { TextToolbar, DEFAULT_TEXT_FORMAT, textFormatStyle } from "@/components/text-toolbar";\n\nconst [format, setFormat] = useState(DEFAULT_TEXT_FORMAT);\n<TextToolbar value={format} onValueChange={setFormat} />\n<p style={textFormatStyle(format)}>Your words, your way.</p>'
              }
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Without callbacks, Link, Mention and Text actions are disabled.
              This is a formatting surface, not a rich-text engine or AI
              service. Hand uses system handwriting fonts; appearance varies by
              platform. The template styles whole blocks and does not claim
              range-based text formatting.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "TextToolbar",
                  type: "value: TextFormat; onValueChange",
                  desc: "Controlled bold, italic, underline, strikethrough, code, highlight, color, font, size and alignment.",
                },
                {
                  prop: "Contextual actions",
                  type: "onLink?; linked?; onMention?; onTransform?",
                  desc: "Optional host actions. TextTransform: uppercase, sentence or tidy.",
                },
                {
                  prop: "ColorOrb",
                  type: "value: TextColor; onValueChange; disabled?",
                  desc: "Seven semantic color choices. Decorative original SVG spectrum; accessible Base UI menu.",
                },
                {
                  prop: "FontSizeStepper",
                  type: "value; onValueChange; min?; max?; disabled?",
                  desc: "Defaults 12–72px; boundary buttons disable. The host may provide a narrower range.",
                },
                {
                  prop: "TextAlignmentControl",
                  type: "value: left | center | right; onValueChange; disabled?",
                  desc: "Mutually exclusive pressed-state buttons.",
                },
                {
                  prop: "FontFamilyPicker",
                  type: "value: sans | serif | hand | mono; onValueChange; disabled?",
                  desc: "Theme-scoped menu with keyboard focus and Escape dismissal.",
                },
                {
                  prop: "textFormatStyle",
                  type: "(TextFormat) => CSSProperties",
                  desc: "Maps font and color names into semantic tokens and system font stacks. Code takes precedence over the selected font.",
                },
                {
                  prop: "TextToolbar options",
                  type: "disabled?; className?",
                  desc: "Disable all controls or style the outer surface.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
