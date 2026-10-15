import type { AccessMember, AccessTool } from "@/components/workspace-access";
export const ACCESS_TOOLS: AccessTool[] = [
  {
    id: "claude",
    name: "Claude",
    description: "Research, writing & ideas",
    mark: "✳︎",
    tone: "orange",
    ready: true,
  },
  {
    id: "frame",
    name: "Frame.io",
    description: "Review work, together",
    mark: "F",
    tone: "purple",
    ready: true,
  },
  {
    id: "figma",
    name: "Figma",
    description: "A shared space for design",
    mark: "F",
    tone: "mint",
    ready: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Your team’s knowledge",
    mark: "N",
    tone: "blue",
    ready: false,
  },
];
export const ACCESS_MEMBERS: AccessMember[] = [
  {
    id: "sophia",
    name: "Sophia Williams",
    email: "sophia@studio.example",
    role: "Owner",
    tools: ["claude", "frame", "figma", "notion"],
  },
  {
    id: "alex",
    name: "Alex Johnson",
    email: "alex@studio.example",
    role: "Admin",
    tools: ["claude", "notion"],
  },
  {
    id: "maya",
    name: "Maya Patel",
    email: "maya@studio.example",
    role: "Member",
    tools: ["frame", "figma"],
  },
  {
    id: "james",
    name: "James Lee",
    email: "james@studio.example",
    role: "Member",
    tools: ["claude", "figma"],
  },
];
export type AccessInvite = {
  id: string;
  email: string;
  role: "Admin" | "Member";
  tools: string[];
};
export type AccessSession = {
  id: string;
  member: string;
  tool: string;
  started: string;
  ended?: string;
};
export const ACCESS_SESSIONS: AccessSession[] = [
  { id: "s1", member: "sophia", tool: "claude", started: "09:42" },
  { id: "s2", member: "maya", tool: "frame", started: "10:15" },
  {
    id: "s3",
    member: "james",
    tool: "figma",
    started: "08:30",
    ended: "09:20",
  },
];
export const SETUP_STEPS = [
  {
    id: "Tools",
    title: "Add your first tool",
    description: "Make room for good work",
    complete: true,
  },
  {
    id: "Team",
    title: "Invite your team",
    description: "Better, together",
    complete: true,
  },
  {
    id: "Tools",
    title: "Prepare shared access",
    description: "One tool needs attention",
    complete: false,
  },
  {
    id: "Team",
    title: "Assign tool access",
    description: "The right tools, right people",
    complete: true,
  },
].map((step, index) => ({ ...step, id: `${step.id}-${index}` }));
