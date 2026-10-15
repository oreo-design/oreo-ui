import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const definitions = {
  swatch: {
    title: "Brand Swatch",
    description:
      "A colour specimen with one clear action. The supplied colour remains stable while the surrounding interface follows its theme.",
    code: '<BrandSwatch name="Iris" hex="#6550b9" role="Accent"\n  onCopy={hex => copyWithFeedback(hex)} />',
    rows: [
      {
        prop: "name / hex / role",
        type: "string",
        desc: "Colour name, valid CSS colour, and optional usage note.",
      },
      {
        prop: "onCopy",
        type: "(hex: string) => void",
        desc: "Consumer owns clipboard success/error feedback.",
      },
      {
        prop: "disabled",
        type: "boolean",
        def: "false",
        desc: "Disables the native copy button.",
      },
    ],
  },
  type: {
    title: "Type Scale",
    description:
      "An adjustable modular scale for real content. Labels include both pixels and rem; long text wraps without clipping.",
    code: '<TypeScale base={16} ratio={1.25} sample="Make room for good ideas." />\n\nconst css = typeScaleCSS(16, 1.25);',
    rows: [
      {
        prop: "base",
        type: "number",
        def: "16",
        desc: "Base size in pixels, clamped to 12–24.",
      },
      {
        prop: "ratio",
        type: "number",
        def: "1.25",
        desc: "Modular ratio, clamped to 1.125–1.5.",
      },
      {
        prop: "sample",
        type: "string",
        desc: "Optional repeated preview text; empty uses role-specific examples.",
      },
      {
        prop: "typeScaleCSS / typeSizes",
        type: "functions",
        desc: "Same clamped scale powers preview and export. rem assumes a 16px root.",
      },
    ],
  },
  signature: {
    title: "Email Signature",
    description:
      "A stable email preview with portable HTML and plain-text helpers. Brand artefacts stay on paper even when the surrounding interface is dark.",
    code: '<EmailSignature data={{name:"Alex Morgan", role:"Designer",\n  email:"alex@example.com", company:"Oreo Studio"}} />\n\nconst html = signatureHTML(data);\nconst text = signatureText(data);',
    rows: [
      {
        prop: "data",
        type: "SignatureData",
        desc: "Name, role, email, company; optional phone and website. Empty fields remain empty in both preview and export.",
      },
      {
        prop: "signatureHTML",
        type: "(data) => string",
        desc: "Escapes all supplied text and returns a standalone table with inline styles. Does not insert user URLs or scripts.",
      },
      {
        prop: "signatureText",
        type: "(data) => string",
        desc: "Plain-text equivalent for clipboard fallback.",
      },
    ],
  },
};
function BrandDocs({
  nav,
  kind,
}: {
  nav: DocsNav;
  kind: keyof typeof definitions;
}) {
  const d = definitions[kind];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", d.title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{d.title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {d.description}
            </p>
            <a
              href="/brand-guide"
              className="mt-3 inline-block text-sm underline"
            >
              Open Brand Guide ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock code={d.code} />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={d.rows} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
export function BrandSwatchDocs({ nav }: { nav: DocsNav }) {
  return <BrandDocs nav={nav} kind="swatch" />;
}
export function TypeScaleDocs({ nav }: { nav: DocsNav }) {
  return <BrandDocs nav={nav} kind="type" />;
}
export function EmailSignatureDocs({ nav }: { nav: DocsNav }) {
  return <BrandDocs nav={nav} kind="signature" />;
}
