import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "stay-price-label": {
    name: "Stay Price Label",
    description:
      "Compact nightly prices that reveal the selected hotel name inside a host-owned map marker.",
    code: '<StayPriceLabel name="Atelier de la Tour" nightly={148} selected />',
    rows: [
      {
        prop: "name / nightly / selected",
        type: "string / number / boolean",
        desc: "Hotel name, finite non-negative GBP nightly price, and selected state. Presentational content only; place it inside the host marker button. The hidden label retains the hotel name when collapsed.",
      },
    ],
  },
  "stay-result-card": {
    name: "Stay Result Card",
    description:
      "A compact accommodation result with original artwork, star category, distance, nightly price and controlled selection.",
    code: "<StayResultCard stay={stay} distance={0.4} selected={selected === stay.id}\n  saved={saved.includes(stay.id)} onSelect={setSelected} />",
    rows: [
      {
        prop: "stay",
        type: "Stay",
        desc: "Unique id, name, star category, non-negative GBP nightly price, x/y scene percentages, amenities and mint/orange/purple artwork color. Star category is not a guest rating.",
      },
      {
        prop: "distance / selected / saved",
        type: "number / boolean / boolean",
        desc: "Finite non-negative kilometres from the host landmark, pressed selection and saved indicator. Distance source and limitations belong to the host.",
      },
      {
        prop: "onSelect",
        type: "(id: string) => void",
        desc: "Optional selection request. Without it the card is a non-interactive article; no fake button is rendered.",
      },
    ],
  },
  "stay-selection-card": {
    name: "Stay Selection Card",
    description:
      "A map footer that brings selected accommodation, distance, pagination, saved state and room details into one surface.",
    code: '<StaySelectionCard stay={stay} landmark="Eiffel Tower" distance={0.4}\n  index={index} total={stays.length} onPrevious={previous} onNext={next}\n  saved={saved.includes(stay.id)} onSave={toggleSaved} onDetails={openRooms} />',
    rows: [
      {
        prop: "stay / distance / landmark",
        type: "Stay / number / string",
        desc: "Selected accommodation, finite non-negative distance in km and landmark name. The host owns distance calculation and selection.",
      },
      {
        prop: "index / total",
        type: "number / number",
        desc: "Zero-based position and positive result count. Previous/next are disabled for a single result or an absent callback.",
      },
      {
        prop: "onPrevious / onNext",
        type: "() => void",
        desc: "Host-owned pagination. The template wraps in the current filtered and sorted result order.",
      },
      {
        prop: "saved / onSave / onDetails",
        type: "boolean / callbacks",
        desc: "Optional save and room-detail requests. Missing handlers hide the respective action. No booking or persistence is built into the component.",
      },
    ],
  },
};
export function StayResultsDocs({ nav }: { nav: DocsNav }) {
  const spec = specs[nav.active] ?? specs["stay-price-label"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", spec.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {spec.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {spec.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/landmark-stays"
            >
              Open Landmark Stays ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${spec.name.replaceAll(" ", "")} } from "@/components/stay-results";\n\n${spec.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template composes the existing PlaceMap with renderMarker,
              originLabel, getSelectionLabel and optional mouse onPreview slots.
              Defaults remain compatible with Place Explorer. Marker buttons
              retain keyboard activation; selection changes instantly. Filtering
              and pagination operate on the same result array. The six hotels,
              prices and map are fictional fixtures. The scene uses a 4 × 2.24
              km scale for illustrative straight-line distances, never walking
              routes. The local shortlist resets on reload. Room totals exclude
              unmodelled taxes and fees.
            </p>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              These synchronous components expect valid ready-to-render data;
              remote hosts own loading, errors and validation. The template uses
              AgentWorkspaceState for empty results and recovery. Hotel
              illustrations are original SVG artwork, not photographs.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/pitus_/status/2110709524504199488"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Phil Pitus, quoting Charlie J ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
