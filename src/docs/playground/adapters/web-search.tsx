/** Family-owned preview adapters and local export bindings. */
import { searchSources, searchAnswer, webSearchDemo } from "../web-search.demo";
import { WebSearch, WebSearchResult, WebSearchAnswer, WebSearchCitation, WebSearchSourceCard, WebSearchSourceStack } from "@/components/web-search";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"web-search": {
    ...define("Web Search", {
      variant: select(["cards", "list"], "cards"), query: text("spring animations react"),
      searching: toggle(), sourceCount: number(6, 0, 6), open: toggle(true), expanded: toggle(),
      answer: toggle(true), error: toggle(),
    }, (v, set) => <div className="w-full space-y-6 rounded-card-medium bg-bg-base p-4 sm:p-6">
      {v.variant === "cards" ? <WebSearch query={v.query} sources={searchSources.slice(0, v.sourceCount)} searching={v.searching}
        open={v.open} onOpenChange={next => set("open", next)} expanded={v.expanded} onExpandedChange={next => set("expanded", next)}
        error={v.error ? "Search could not finish. Please try again." : undefined} onRetry={() => { set("error", false); set("searching", true); }} />
        : <WebSearch query={v.query} searching={v.searching} summary={`Read ${v.sourceCount} sources`}>
          {searchSources.slice(0, v.sourceCount).map(source => <WebSearchResult key={source.id} domain={source.name ?? source.id} title={source.title} href={source.url} />)}
        </WebSearch>}
      {v.answer && v.sourceCount > 0 && <WebSearchAnswer parts={searchAnswer.filter(part => searchSources.slice(0, v.sourceCount).some(source => source.id === part.source?.id))}
        play={!v.searching && !v.error} replayKey={String(v.searching)} />}
    </div>),
    demo: webSearchDemo,
  }
};
const exports = {
"web-search": { WebSearch, WebSearchResult, WebSearchAnswer, WebSearchCitation, WebSearchSourceCard, WebSearchSourceStack }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "web-search"; spec.exports = exports; }
export default playgrounds;
