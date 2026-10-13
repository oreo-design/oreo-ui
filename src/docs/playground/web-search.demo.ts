import type { WebSource, WebSearchAnswerPart } from "@/components/web-search";
import type { Demo } from "./demo";

export const searchSources: WebSource[] = [
  { id: "motion", name: "motion", title: "Spring animations in React", url: "https://motion.dev/docs/react-animation", color: "purple", snippet: "Configure spring transitions and animate between interface states." },
  { id: "mdn", name: "mozilla", title: "Respecting reduced motion preferences", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", color: "default", snippet: "Use the prefers-reduced-motion media feature to provide gentler transitions." },
  { id: "react", name: "react", title: "Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects", color: "blue", snippet: "Start and clean up external effects as a component's state changes." },
  { id: "web", name: "web.dev", title: "Building smooth animations", url: "https://web.dev/articles/animations-guide", color: "mint", snippet: "Understand which CSS properties keep animations responsive." },
  { id: "base", name: "base ui", title: "Accessible preview cards", url: "https://base-ui.com/react/components/preview-card", color: "orange", snippet: "A preview that supports hover intent, keyboard focus and viewport collision." },
  { id: "w3c", name: "w3c", title: "Making interactive content accessible", url: "https://www.w3.org/WAI/ARIA/apg/", color: "pink", snippet: "Patterns for predictable focus and keyboard behavior." },
];
export const searchAnswer: WebSearchAnswerPart[] = [
  { text: "A spring keeps an interrupted animation connected to its previous movement.", source: searchSources[0], index: 1 },
  { text: " Prefer transform and opacity for smooth updates.", source: searchSources[3], index: 4 },
  { text: " Offer a gentler version when someone requests reduced motion.", source: searchSources[1], index: 2 },
  { text: " Start and clean up animation effects with the component lifecycle.", source: searchSources[2], index: 3 },
];
export function webSearchDemo(reduced: boolean): Demo {
  const beat = reduced ? 450 : 700;
  return { duration: beat * 6 + (reduced ? 500 : 7000), frames: [
    { at: 0, label: "Searching", values: { variant: "cards", searching: true, sourceCount: 0, error: false, open: true, expanded: false, answer: true } },
    ...[1, 2, 3, 4, 6].map((count, index) => ({ at: beat * (index + 1), label: "Receiving sources", values: { sourceCount: count } })),
    { at: beat * 6, label: "Answer with citations", values: { searching: false } },
  ] };
}
