import { useId, useState } from "react";
import { Attachment } from "@/components/attachment";
import { Action, Status, type ExampleProps } from "./shared";
import { parsePages } from "./model";

const pages = [
  { title: "Start with an example", body: "Six of eight participants wanted a worked example before creating their first project. This document is a synthetic four-page fixture.", foot: "01 / Research question" },
  { title: "Make the first step small", body: "Participants could identify the goal, but the empty canvas made the first action harder to choose. Try a starter template with one clear action.", foot: "02 / Interview themes" },
  { title: "Keep the evidence close", body: "Show the source beside each recommendation. Qualitative feedback suggests a direction; it does not establish a conversion lift.", foot: "03 / Proposed response" },
  { title: "What we still need to learn", body: "Test the starter template with a new group. Compare task completion, time to first action and confidence. All figures in this file are demo data.", foot: "04 / Next questions" },
];
export function AttachmentExample({ mode, stress }: ExampleProps) {
  const id = useId();
  const [present, setPresent] = useState(true);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState("1-2");
  const [included, setIncluded] = useState<number[]>([]);
  const selected = parsePages(range, pages.length);
  const name = stress ? "onboarding-research-internationalization-accessibility-review-final-demo.pdf" : "onboarding-research.pdf";
  if (!present) return <div className="remix-empty"><strong>Attachment removed</strong><p>Add the sample file to try again.</p><Action onClick={() => setPresent(true)}>Restore sample</Action></div>;
  return <div className="remix-stack">
    {mode === "style" && <><p className="remix-eyebrow">Project knowledge</p><h3 className="remix-editorial">A little context goes a long way.</h3></>}
    <div className={mode === "style" ? "remix-file-card" : ""}>
      <Attachment type="pdf" label={name} onRemove={() => setPresent(false)} className="remix-attachment" />
      {mode === "style" && <p className="remix-muted">PDF · 4 pages · Sample document</p>}
    </div>
    {mode === "capability" ? <>
      <div className="remix-paper" aria-label={`Document preview, page ${page}`}>
        <p className="remix-eyebrow">FIELD NOTES / DEMO</p><h3>{pages[page - 1].title}</h3><p>{pages[page - 1].body}{stress && ` ${pages[page - 1].body}`}</p><footer>{pages[page - 1].foot}</footer>
      </div>
      <div className="remix-row"><Action disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous page</Action><span className="remix-muted">{page} of 4</span><Action disabled={page === 4} onClick={() => setPage(p => p + 1)}>Next page</Action></div>
      <div className="remix-range"><label htmlFor={id}>Pages to include</label><input id={id} value={range} onChange={e => setRange(e.target.value)} aria-invalid={!selected} aria-describedby={`${id}-help`} /><Action type="primary" disabled={!selected} onClick={() => setIncluded(selected!)}>Include pages</Action></div>
      <p id={`${id}-help`} className="remix-help">{selected ? "Use page numbers or ranges, e.g. 1, 3-4. Previewing a page does not include it." : "Enter valid pages from 1 to 4, e.g. 1, 3-4."}</p>
      <Status>{included.length ? `Included pages ${included.join(", ")} in local context.` : "No pages included yet."}</Status>
      <p className="remix-help">Text facsimile of a demo PDF. No upload or PDF parsing takes place.</p>
    </> : <Status>Sample file · use the remove control to dismiss it.</Status>}
  </div>;
}
