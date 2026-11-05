import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function FilmCoverDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Film Cover"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "Properties" },
        { id: "rules", label: "States & composition" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Film Cover</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A cover develops from grainy silver to full color as preparation
              progresses. Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/dev_ya/status/2118030724955852945"
              >
                Yanis Lebzar’s CMS interaction
              </a>
              . Oreo owns the tokens, controls and accessible alternatives.
            </p>
            <a
              className="inline-block mt-4 underline"
              href="/film-cover-studio"
            >
              Open the complete editor →
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                'import { FilmReveal, FilmCoverUpload, MediaTray } from "@/components/film-cover";\n\n<FilmCoverUpload value={cover} status={status} progress={progress}\n  onFiles={upload} onCancel={cancel} onRemove={remove}\n  error={error} onRetry={retry} />\n<FilmReveal src={cover.src} alt={cover.alt} progress={progress} />'
              }
            />
          </Section>
          <Section id="api" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "FilmReveal",
                  type: "src, alt, progress?, animate?",
                  desc: "Normalized progress defaults to 1. Animate defaults to true; reduced motion always keeps the image still. The host owns dimensions. WebGL is loaded only for developing frames and disposed on completion/unmount; CORS/context failures retain the image fallback.",
                },
                {
                  prop: "FilmCoverUpload",
                  type: "value, status, progress, error, disabled, animate",
                  desc: "Controlled empty/loading/ready/error state. Progress never implies success; the host confirms ready. Disabled blocks native file, drop and action paths. Existing images remain available during recovery.",
                },
                {
                  prop: "Callbacks",
                  type: "onFiles, onAssetDrop?, onRemove?, onRetry?, onCancel?",
                  desc: "File input accepts JPG/PNG/WebP. The host validates with validateCover, owns upload/abort and URLs, and resolves library IDs. Retry is offered only when the host has a retryable request.",
                },
                {
                  prop: "MediaTray",
                  type: "assets, selectedId, onSelect, disabled?, title?",
                  desc: "Controlled photo selection. Click and keyboard select; onSelect reports keyboard activation so hosts can skip decorative motion. Native drag carries only an asset ID. Empty libraries give explicit browse guidance.",
                },
                {
                  prop: "CoverTransfer",
                  type: "asset, status, progress, error?",
                  desc: "Reusable identity row with trailing progress and a semantic progressbar. Ready is derived from status, never just 100%.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy and layout">
            <div className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>
                Use the developing effect for occasional media preparation, not
                repeated keyboard selection. It follows progress; it never
                delays a confirmed backend response. Reduced motion and keyboard
                photo selection bypass development. The local template
                deliberately demonstrates 2.4 seconds of preparation and does
                not upload to Drive or publish anything.
              </p>
              <p>
                Choose files opens the native picker directly. Support
                cancellation, replacement, corrupt and unsupported images, size
                limits and retry. A newer selection invalidates pending work.
                Name and size stay visible; error recovery remains beside the
                affected cover. Keep visible focus and native Enter/Space
                behavior.
              </p>
              <p>
                Title, selected image and actual save outcome belong to the
                host. Keep copy factual: “Preparing image” for this fixture, not
                invented network percentages. Provide meaningful image
                descriptions. Long filenames truncate visually with the full
                value in the title; project titles wrap.
              </p>
              <p>
                The cover’s 8:5 crop and the desktop 28% media column retain the
                source proportions. Buttons, field surfaces, corners, spacing,
                text, shadows and colors use Oreo’s existing owners. Below 600
                px the same library becomes a four-photo row, preserving every
                action. The photo library stays mounted when the editor becomes
                a reading preview.
              </p>
              <p>
                Image fixtures reuse the existing attributed Gradient Mask and
                Document Workspace assets. Source photography and shader source
                code were not provided; this is an independent implementation,
                not a claim of source-code or pixel identity.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
