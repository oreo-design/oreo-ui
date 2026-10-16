import type { BrowserAction } from "@/components/browser-session";
export type DemoStep = {
  label: string;
  detail: string;
  action: BrowserAction;
  tab: "guide" | "notes";
  article: "overview" | "tools" | "memory" | "notes";
  query?: string;
};
export const SCENARIOS = {
  research: {
    title: "Research browser tools",
    request:
      "Find how browser tools work, compare context and memory, and prepare a short reading list.",
    steps: [
      {
        label: "Open the guide",
        detail: "Open the local browser-tools overview.",
        action: "navigating",
        tab: "guide",
        article: "overview",
      },
      {
        label: "Read available tools",
        detail: "Inspect the supported actions and their boundaries.",
        action: "reading",
        tab: "guide",
        article: "tools",
      },
      {
        label: "Search for memory",
        detail: "Find the memory guide in the local documentation.",
        action: "searching",
        tab: "guide",
        article: "tools",
        query: "memory",
      },
      {
        label: "Inspect memory",
        detail: "Read how session context is preserved.",
        action: "reading",
        tab: "guide",
        article: "memory",
      },
      {
        label: "Open a reading list",
        detail: "Create a second local tab for the research notes.",
        action: "navigating",
        tab: "notes",
        article: "notes",
      },
      {
        label: "Prepare the summary",
        detail: "Finish the reading list and return control.",
        action: "typing",
        tab: "notes",
        article: "notes",
      },
    ] as DemoStep[],
  },
  audit: {
    title: "Review browser handoff",
    request:
      "Inspect browser control, review the pause and handoff rules, and prepare a short verification checklist.",
    steps: [
      {
        label: "Open browser overview",
        detail: "Open the local browser-control guide.",
        action: "navigating",
        tab: "guide",
        article: "overview",
      },
      {
        label: "Find control actions",
        detail: "Search the guide for supported browser actions.",
        action: "searching",
        tab: "guide",
        article: "tools",
        query: "control",
      },
      {
        label: "Read handoff rules",
        detail: "Review pause, takeover and resume behavior.",
        action: "reading",
        tab: "guide",
        article: "memory",
      },
      {
        label: "Wait for a checkpoint",
        detail: "Hold the current tab before preparing the checklist.",
        action: "waiting",
        tab: "guide",
        article: "memory",
      },
      {
        label: "Create checklist tab",
        detail: "Open a second local tab for review notes.",
        action: "navigating",
        tab: "notes",
        article: "notes",
      },
      {
        label: "Write the checklist",
        detail: "Prepare the local review summary.",
        action: "typing",
        tab: "notes",
        article: "notes",
      },
    ] as DemoStep[],
  },
};
export type ScenarioId = keyof typeof SCENARIOS;
export const ARTICLES = {
  overview: {
    title: "A browser that works with you",
    eyebrow: "OREO GUIDES / OVERVIEW",
    intro:
      "Keep the conversation and the browser together. Every action has a visible state, and control is always within reach.",
    sections: [
      {
        title: "See the active tab",
        body: "The activity signal stays with the tab the agent is using, even when you switch back to the conversation.",
      },
      {
        title: "Follow the work",
        body: "Navigating, reading, searching and typing appear as distinct actions. The timeline keeps completed steps visible.",
      },
      {
        title: "Step in at any time",
        body: "Pause the run to inspect a page. Take over to make local edits, then return control when you are ready.",
      },
    ],
  },
  tools: {
    title: "Small tools. Clear intent.",
    eyebrow: "OREO GUIDES / BROWSER TOOLS",
    intro:
      "A browser session is easier to follow when each tool makes one clear change.",
    sections: [
      {
        title: "Navigation",
        body: "Open a page or a new tab. The selected view and the agent's working tab are independent.",
      },
      {
        title: "Search and read",
        body: "Search local documentation, inspect a result, and keep the relevant context together. Memory preserves useful details between steps.",
      },
      {
        title: "Control and recovery",
        body: "Pause stops future actions. A failed step remains visible and can be retried without discarding completed work.",
      },
    ],
  },
  memory: {
    title: "Context that stays with the task",
    eyebrow: "OREO GUIDES / SESSION MEMORY",
    intro:
      "A useful handoff preserves the page, the current step and the work already completed.",
    sections: [
      {
        title: "Pause is a checkpoint",
        body: "Pause keeps your place. Returning to the conversation does not change which tab the agent is controlling.",
      },
      {
        title: "Human handoff",
        body: "Taking over suspends automatic work. Local notes stay in the page, and the agent resumes from the same pending step.",
      },
      {
        title: "Explicit completion",
        body: "When the run finishes, tab icons return to their resting state. A summary records what the local demo completed.",
      },
    ],
  },
  notes: {
    title: "A small reading list",
    eyebrow: "OREO GUIDES / RESEARCH NOTES",
    intro: "Three useful ideas from this sample session, ready for review.",
    sections: [
      {
        title: "Make control visible",
        body: "Show the active operation on the browser tab, with a clear text label in the control bar.",
      },
      {
        title: "Keep context together",
        body: "Let people switch views while the agent continues in its working tab. Preserve progress across handoffs.",
      },
      {
        title: "Make recovery explicit",
        body: "Separate a pause from a failure. Retry a failed step or stop the session without suggesting the task succeeded.",
      },
    ],
  },
};
