import { useState } from "react";
import { CitationAnswer } from "@/components/citation-reader";
import { IconButton, Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { CITATION_CLAIMS, CITATION_SOURCES } from "./data";
import "./workspace.css";
export function CitationReaderWorkspace() {
  const [dark, setDark] = useThemeMode(false),
    [state, setState] = useState<"ready" | "loading" | "error">("ready"),
    [question, setQuestion] = useState(
      "How can citations keep readers connected to the evidence?",
    ),
    [draft, setDraft] = useState(question);
  return (
    <main className="cr-workspace">
      <header className="cr-site-header">
        <a href="/citation-answer">
          Oreo UI <span>/ Research notes</span>
        </a>
        <IconButton
          type="secondary"
          icon={<Icon name={dark ? "sun" : "moon"} />}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
        />
      </header>
      <div className="cr-workspace-content">
        <header className="cr-page-header">
          <p>READING ROOM / 001</p>
          <h1>A little closer to the source.</h1>
          <p>Read the answer. Follow the citation. Keep the context.</p>
        </header>
        <div className="cr-workspace-grid">
          <article>
            <div className="cr-question">
              <Icon name="chat" />
              <h2>{question}</h2>
            </div>
            <div className="cr-answer-label">
              <Icon name="sparkle" size="sm" />
              <span>Research note</span>
              <span>3 references</span>
            </div>
            <CitationAnswer
              claims={CITATION_CLAIMS}
              sources={CITATION_SOURCES}
              sourceState={state}
              onRetry={() => setState("ready")}
            />
            <form
              className="cr-note-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) setQuestion(draft.trim());
              }}
            >
              <label htmlFor="reading-note">Your question</label>
              <div>
                <input
                  className="oreo-focus-field"
                  id="reading-note"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={240}
                />
                <Button
                  type="secondary"
                  size="sm"
                  disabled={!draft.trim() || draft.trim() === question}
                  htmlType="submit"
                >
                  Update note
                </Button>
              </div>
              <p>
                Local reading example. Editing the question does not generate a
                new answer.
              </p>
            </form>
          </article>
          <aside aria-label="Reading guide">
            <p className="cr-aside-eyebrow">READ WITH CONTEXT</p>
            <h2>Every claim has a trail.</h2>
            <p>
              Hover over a citation to see the supporting passage. Select it to
              keep the preview within reach.
            </p>
            <ol>
              <li>
                <span>01</span>Inspect a source beside the sentence.
              </li>
              <li>
                <span>02</span>Use the arrows to move through the citations.
              </li>
              <li>
                <span>03</span>Expand sources to trace them back to the answer.
              </li>
            </ol>
            <div className="cr-fixture-control">
              <label htmlFor="source-availability">Source availability</label>
              <select
                className="oreo-focus"
                id="source-availability"
                value={state}
                onChange={(e) => setState(e.target.value as typeof state)}
              >
                <option value="ready">Available</option>
                <option value="loading">Loading example</option>
                <option value="error">Unavailable example</option>
              </select>
              <p>Local states for exploring recovery.</p>
            </div>
          </aside>
        </div>
        <footer className="cr-site-footer">
          <span>Curated fixture · No live AI request</span>
          <a
            href="https://x.com/shedsgns/status/2124766146377252944"
            target="_blank"
            rel="noreferrer"
          >
            Interaction reference by Juliette{" "}
            <Icon name="arrow-up-right" size="sm" />
          </a>
        </footer>
      </div>
    </main>
  );
}
