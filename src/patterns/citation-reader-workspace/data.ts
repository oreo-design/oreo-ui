import type {
  CitationSource,
  CitationClaim,
} from "@/components/citation-reader";
export const CITATION_SOURCES: CitationSource[] = [
  {
    id: "focus",
    title: "Element: focus event",
    name: "MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event",
    snippet: "How an element receives focus.",
  },
  {
    id: "hover",
    title: "Content on Hover or Focus",
    name: "W3C",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html",
    snippet: "Dismissible, hoverable and persistent additional content.",
  },
  {
    id: "media",
    title: "The hover media feature",
    name: "MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover",
    snippet: "Discover whether a primary input can conveniently hover.",
    kind: "article",
  },
];
export const CITATION_CLAIMS: CitationClaim[] = [
  {
    id: "focus-claim",
    text: "Keyboard focus gives a reader a precise place to continue. The focus event fires when an element has received focus.",
    citations: [
      {
        sourceId: "focus",
        excerpt: "The focus event fires when an element has received focus.",
        match: "The focus event fires when an element has received focus.",
        exact: true,
      },
    ],
  },
  {
    id: "hover-claim",
    text: "A source preview should stay open while the pointer moves into it, and offer a way to dismiss it.",
    citations: [
      {
        sourceId: "hover",
        excerpt:
          "Keep additional content dismissible, hoverable and persistent while the reader uses it.",
        match: "stay open while the pointer moves into it",
      },
    ],
  },
  {
    id: "touch-claim",
    text: "A tap or keyboard action gives readers another way to inspect a source. Use hover capability to tailor pointer-only enhancements.",
    linkLabel: "About hover",
    citations: [
      {
        sourceId: "media",
        excerpt:
          "The hover media feature checks whether the primary input mechanism can conveniently hover over an element.",
        match: "hover capability",
      },
    ],
  },
  {
    id: "combined-claim",
    text: "Combine clear focus with predictable previews so the answer and its evidence remain connected.",
    citations: [
      {
        sourceId: "focus",
        excerpt: "Focus identifies the element that receives keyboard input.",
        match: "clear focus",
      },
      {
        sourceId: "hover",
        excerpt:
          "A reader should be able to reach and dismiss additional content without losing their place.",
        match: "predictable previews",
      },
    ],
  },
];
