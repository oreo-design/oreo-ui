import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/icon";
import { Button, IconButton } from "@/components/button";
import { easeOut, useHidden } from "@/lib/motion";
import "./ask-analytics.css";

export type InsightSource = { id: string; label: string; icon: IconName };
export function InsightSources({
  sources,
  onSelect,
}: {
  sources: InsightSource[];
  onSelect: (id: string) => void;
}) {
  return sources.length ? (
    <div className="insight-sources" role="group" aria-label="Answer sources">
      {sources.map((source) => (
        <button
          type="button"
          key={source.id}
          onClick={() => onSelect(source.id)}
        >
          <Icon name={source.icon} size="sm" />
          <span>{source.label}</span>
        </button>
      ))}
    </div>
  ) : (
    <p className="ask-muted">No sources attached.</p>
  );
}
export type AnalyticsSuggestion = {
  id: string;
  question: string;
  icon: IconName;
};
export type AnalyticsAnswer = {
  title: string;
  body: string;
  sources: InsightSource[];
};
export type AnalyticsRequest =
  | { status: "idle" }
  | { status: "loading"; question: string }
  | { status: "error"; question: string; message: string }
  | { status: "empty"; question: string }
  | { status: "success"; question: string; answer: AnalyticsAnswer };
export type AskAnalyticsProps = {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: AnalyticsSuggestion[];
  request: AnalyticsRequest;
  onAsk: (question: string) => void;
  onReset: () => void;
  onSourceSelect: (id: string) => void;
  defaultExpanded?: boolean;
  onSave?: () => void;
  saved?: boolean;
};
/** Inline dashboard question surface. The host owns requests, cancellation and data. */
export function AskAnalytics({
  value,
  onValueChange,
  suggestions,
  request,
  onAsk,
  onReset,
  onSourceSelect,
  defaultExpanded = false,
  onSave,
  saved = false,
}: AskAnalyticsProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [animateSuggestions, setAnimateSuggestions] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (request.status === "loading") questionHeading.current?.focus();
  }, [request.status]);
  const id = useId();
  const hidden = useHidden({ transform: "translateY(4px)" });
  const busy = request.status === "loading";
  const reset = () => {
    onReset();
    onValueChange("");
    setExpanded(true);
    requestAnimationFrame(() => input.current?.focus());
  };
  return (
    <section className="ask-analytics" aria-label="Ask about this dashboard">
      {request.status === "idle" ? (
        <form
          className="ask-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onAsk(value.trim());
          }}
        >
          <Icon name="sparkle" className="ask-sparkle" />
          <input
            ref={input}
            aria-label="Ask about this dashboard"
            placeholder="Ask about this dashboard"
            value={value}
            maxLength={240}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => { setAnimateSuggestions(false); setExpanded(true); }}
          />
          <IconButton
            aria-label="Ask question"
            tapScale={1}
            size="md"
            disabled={!value.trim()}
            render={<button type="submit" />}
            icon={<Icon name="arrow-up" />}
          />
        </form>
      ) : (
        <div className="ask-question">
          <Icon name="sparkle" className="ask-sparkle" />
          <h2 ref={questionHeading} tabIndex={-1}>
            {request.question}
          </h2>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={busy ? "Cancel question" : "Ask another question"}
            onClick={reset}
            icon={<Icon name="x" size="sm" />}
          />
        </div>
      )}
      {request.status === "idle" ? (
        <>
          <button
            type="button"
            className="ask-disclosure"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={(event) => { setAnimateSuggestions(event.detail > 0); setExpanded(!expanded); }}
          >
            Try asking{" "}
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size="sm" />
          </button>
          {expanded && (
            <motion.div
              id={id}
              initial={animateSuggestions ? hidden : false}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.18, ease: easeOut }}
              className="ask-suggestions"
            >
              {suggestions.length ? (
                suggestions.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onAsk(item.question)}
                  >
                    <Icon name={item.icon} size="sm" />
                    <span>{item.question}</span>
                    <Icon name="arrow-up-right" size="sm" />
                  </button>
                ))
              ) : (
                <p className="ask-muted">
                  No suggestions yet. Ask your own question above.
                </p>
              )}
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          key={request.status}
          initial={busy ? false : hidden}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.18, ease: easeOut }}
          className="ask-response"
        >
          <p className="sr-only" role="status">
            {busy
              ? "Reading dashboard sources"
              : request.status === "success"
                ? "Answer ready"
                : request.status === "empty"
                  ? "No matching data"
                  : "Unable to read sources"}
          </p>
          {busy ? (
            <div className="ask-loading">
              <Icon name="circle-dashed" />
              <div>
                <strong>Reading your dashboard</strong>
                <p>Checking the available sample sources…</p>
              </div>
              <Button type="tertiary" tapScale={1} onClick={reset}>
                Cancel
              </Button>
            </div>
          ) : request.status === "error" ? (
            <div role="alert">
              <h3>Couldn’t read the sources</h3>
              <p>{request.message}</p>
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => onAsk(request.question)}
              >
                Try again
              </Button>
            </div>
          ) : request.status === "empty" ? (
            <div>
              <h3>No matching data in this dashboard</h3>
              <p>
                Try asking about trial signups, team invites or the pricing
                update.
              </p>
              <Button type="secondary" tapScale={1} onClick={reset}>
                See suggested questions
              </Button>
            </div>
          ) : (
            <>
              <p className="ask-muted">
                Based on {request.answer.sources.length} sample {request.answer.sources.length === 1 ? "source" : "sources"}
              </p>
              <InsightSources
                sources={request.answer.sources}
                onSelect={onSourceSelect}
              />
              <h3>{request.answer.title}</h3>
              <p className="ask-answer-body">{request.answer.body}</p>
              <div className="ask-answer-footer">
                <span>Illustrative analysis · Verify before acting</span>
                {onSave && (
                  <Button
                    type="tertiary"
                    tapScale={1}
                    aria-pressed={saved}
                    onClick={onSave}
                    leadingIcon={
                      <Icon name={saved ? "check" : "plus"} size="sm" />
                    }
                  >
                    {saved ? "Saved" : "Save insight"}
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </section>
  );
}
