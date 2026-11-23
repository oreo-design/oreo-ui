import { useState } from "react";
import {
  CitationAnswer,
  CitationSourcePreview,
  CitationSourceList,
  citationEntries,
} from "@/components/citation-reader";
import {
  CITATION_CLAIMS,
  CITATION_SOURCES,
} from "@/patterns/citation-reader-workspace/data";
import {
  definePlayground as define,
  select,
  toggle,
  text,
  type PlaygroundSpec,
} from "../schema";
function List({ empty = false }: { empty?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="w-full max-w-2xl">
      <CitationSourceList
        sources={empty ? [] : CITATION_SOURCES}
        activeId={active}
        onActiveChange={setActive}
      />
    </div>
  );
}
function Preview() {
  const [index, setIndex] = useState(0);
  const entries = citationEntries(CITATION_CLAIMS, CITATION_SOURCES),
    e = entries[index];
  return (
    <div className="w-full max-w-sm">
      <CitationSourcePreview
        source={e.source}
        evidence={e.evidence}
        index={index}
        count={entries.length}
        onPrevious={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(entries.length - 1, i + 1))}
      />
    </div>
  );
}
const specs: Record<string, PlaygroundSpec> = {
  "citation-answer": {
    ...define(
      "Citation Answer",
      {
        state: select(["ready", "loading", "error"] as const, "ready"),
        empty: toggle(false),
        disabled: toggle(false),
        title: text("Answer"),
      },
      (v, set) => (
        <div className="w-full max-w-2xl p-4">
          <CitationAnswer
            claims={v.empty ? [] : CITATION_CLAIMS}
            sources={v.empty ? [] : CITATION_SOURCES}
            title={v.title}
            sourceState={v.state}
            disabled={v.disabled}
            onRetry={() => set("state", "ready")}
          />
        </div>
      ),
    ),
    exportRecipe: (v) => ({
      imports: ['import {CitationAnswer} from "@/components/citation-reader";'],
      setup: [
        `const claims=${JSON.stringify(v.empty ? [] : CITATION_CLAIMS)};`,
        `const sources=${JSON.stringify(v.empty ? [] : CITATION_SOURCES)};`,
      ],
      jsx: `<CitationAnswer claims={claims} sources={sources} title={${JSON.stringify(v.title)}} sourceState=${JSON.stringify(v.state)} disabled={${v.disabled}} />`,
      notes: [
        "Sources and excerpts are supplied by the host. This component does not fetch or verify a source.",
      ],
    }),
  },
  "citation-source-preview": {
    ...define("Citation Source Preview", {}, () => <Preview />),
    exportRecipe: () => ({
      imports: [
        'import {CitationSourcePreview} from "@/components/citation-reader";',
      ],
      setup: [
        `const source=${JSON.stringify(CITATION_SOURCES[0])};`,
        `const evidence=${JSON.stringify(CITATION_CLAIMS[0].citations![0])};`,
      ],
      jsx: "<CitationSourcePreview source={source} evidence={evidence} />",
      notes: [
        "Supply navigation callbacks to enable pagination. Exact quote is host-provided metadata.",
      ],
    }),
  },
  "citation-source-list": {
    ...define("Citation Source List", { empty: toggle(false) }, (v) => (
      <List empty={v.empty} />
    )),
    exportRecipe: (v) => ({
      imports: [
        'import {useState} from "react";',
        'import {CitationSourceList} from "@/components/citation-reader";',
      ],
      setup: [
        `const sources=${JSON.stringify(v.empty ? [] : CITATION_SOURCES)};`,
        "const [activeId,setActiveId]=useState<string|null>(null);",
      ],
      jsx: "<CitationSourceList sources={sources} activeId={activeId} onActiveChange={setActiveId} />",
      notes: ["The host maps the selected source to its supported claims."],
    }),
  },
};
for (const spec of Object.values(specs)) {
  spec.source = "citation-reader";
  spec.exports = {
    "citation-reader": {
      CitationAnswer,
      CitationSourcePreview,
      CitationSourceList,
    },
  };
}
export default specs;
