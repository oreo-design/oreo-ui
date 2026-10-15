import type { ThinkingStep } from "@/components/thinking-state";
export const STEPS: ThinkingStep[] = [
  {
    id: "thinking",
    label: "Understanding the brief",
    detail: "Read the request and identify the intended outcome.",
  },
  {
    id: "analyzing",
    label: "Finding the essentials",
    detail: "Separate the goal, audience and constraints.",
  },
  {
    id: "searching",
    label: "Gathering context",
    detail: "Consult the bundled sample notes.",
  },
  {
    id: "pondering",
    label: "Exploring directions",
    detail: "Compare a few possible approaches.",
  },
  {
    id: "building",
    label: "Shaping the response",
    detail: "Arrange the outline into useful next steps.",
  },
  {
    id: "debugging",
    label: "Checking the details",
    detail: "Review clarity and surface open questions.",
  },
];
export const BRIEFS = [
  {
    id: "launch",
    title: "A thoughtful product launch",
    prompt: "Create a launch outline for a small design tool.",
    eyebrow: "PLAN",
    icon: "plane" as const,
    answer: [
      "Start with one promise: help small teams move from an idea to a shared first draft.",
      "Invite a small group to try the core workflow, then collect the moments where they hesitate.",
      "Publish a short walkthrough, a clear pricing page and a way to send feedback. Review what people actually use after one week.",
    ],
  },
  {
    id: "onboarding",
    title: "A calmer first experience",
    prompt: "Outline a simple onboarding flow for a creative workspace.",
    eyebrow: "DESIGN",
    icon: "sparkle" as const,
    answer: [
      "Open with a useful example so a new workspace does not feel empty.",
      "Ask for only the information needed to create the first project. Keep optional setup for later.",
      "End with one clear next action and a visible route back to the guide.",
    ],
  },
  {
    id: "review",
    title: "A sharper project brief",
    prompt: "Help me structure a clear brief for a website redesign.",
    eyebrow: "WRITE",
    icon: "pencil" as const,
    answer: [
      "Name the audience, the problem they face and the change the redesign should make.",
      "List the essential pages and constraints, then separate requirements from preferences.",
      "Agree on a review schedule and a small set of observable success criteria before visual exploration.",
    ],
  },
];
