import type {
  CommentAuthor,
  CommentThreadData,
} from "@/components/comment-thread";
const james: CommentAuthor = { id: "james", name: "James Lane", color: "blue" };
const vasile: CommentAuthor = {
  id: "vasile",
  name: "Vasile Labici",
  color: "purple",
};
const maria: CommentAuthor = { id: "maria", name: "Maria Chen", color: "mint" };
const dylan: CommentAuthor = {
  id: "dylan",
  name: "Dylan Ratcliffe",
  color: "brown",
};
export const currentAuthor: CommentAuthor = {
  id: "you",
  name: "You",
  color: "orange",
};
export type WorkspaceThread = CommentThreadData & {
  title: string;
  section: string;
};
export const initialThreads: WorkspaceThread[] = [
  {
    id: "invites",
    title: "How should invited seats be billed?",
    section: "Billing & permissions",
    resolved: false,
    comments: [
      {
        id: "q1",
        author: james,
        time: "1h ago",
        body: "Could a team invite everyone and never accept, to avoid paying?",
      },
      {
        id: "r1",
        author: vasile,
        time: "50m ago",
        body: "Pending invites can’t open the workspace, so there’s nothing to use.",
      },
      {
        id: "r2",
        author: maria,
        time: "40m ago",
        body: "Does billing count invites as seats?",
      },
      {
        id: "r3",
        author: dylan,
        time: "30m ago",
        body: "No, only joined members take a seat.",
      },
      {
        id: "r4",
        author: james,
        time: "15m ago",
        body: "Invites should still expire after 14 days.",
      },
      {
        id: "r5",
        author: currentAuthor,
        time: "just now",
        body: "Agreed, I’ll open a separate ticket.",
      },
    ],
  },
  {
    id: "onboarding",
    title: "Give new members a little context",
    section: "Onboarding",
    resolved: false,
    resolutionId: "o2",
    comments: [
      {
        id: "q2",
        author: maria,
        time: "2h ago",
        body: "Can we include the project name in the invitation? A little context goes a long way.",
      },
      {
        id: "o1",
        author: james,
        time: "1h ago",
        body: "Yes, and let’s show who invited them.",
      },
      {
        id: "o2",
        author: currentAuthor,
        time: "20m ago",
        body: "We’ll include the project name, the inviter and a short welcome note.",
      },
    ],
  },
  {
    id: "access",
    title: "Keep access rules easy to find",
    section: "Workspace settings",
    resolved: true,
    resolutionId: "a1",
    comments: [
      {
        id: "q3",
        author: dylan,
        time: "Yesterday",
        body: "Where should a member look to understand their workspace permissions?",
      },
      {
        id: "a1",
        author: maria,
        time: "Yesterday",
        body: "Under Settings → Members. The role description will sit alongside each member.",
      },
    ],
  },
];
