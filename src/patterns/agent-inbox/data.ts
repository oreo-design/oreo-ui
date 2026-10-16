import type { InboxRun } from "@/components/agent-inbox";
export const INITIAL_RUNS: InboxRun[] = [
  {
    id: "migration",
    title: "Migrate users table",
    summary:
      "Split users into accounts and profiles. The staging dry run passed without errors.",
    status: "waiting",
    elapsed: 359,
    queries: 9,
    tools: 14,
    model: "Coding agent · Pro",
    activity: [
      { id: "m1", text: "Wrote migration 0042_split_users.", time: "4m ago" },
      { id: "m2", text: "Dry run on staging — no errors.", time: "2m ago" },
      { id: "m3", text: "Requested approval to continue.", time: "1m ago" },
    ],
  },
  {
    id: "contacts",
    title: "Clean up CRM contacts",
    summary:
      "Matched 1,312 likely duplicates, then the merge hit the API rate limit.",
    status: "failed",
    elapsed: 43,
    queries: 2,
    tools: 6,
    model: "Operations agent · Fast",
    activity: [
      {
        id: "c1",
        text: "Compared contact names and email addresses.",
        time: "3m ago",
      },
      {
        id: "c2",
        text: "Rate limit reached. Retry after checking the service.",
        time: "1m ago",
      },
    ],
  },
  {
    id: "review",
    title: "Review PR #482",
    summary:
      "Billing webhooks: reading the diff and the test run, writing comments.",
    status: "running",
    elapsed: 220,
    queries: 12,
    tools: 21,
    model: "Review agent · Pro",
    activity: [
      {
        id: "r1",
        text: "Loaded the pull request and linked issue.",
        time: "3m ago",
      },
      { id: "r2", text: "Reviewing webhook retry coverage.", time: "Now" },
    ],
  },
  {
    id: "release",
    title: "Release notes v2.4",
    summary: "Grouping 23 merged pull requests into features and fixes.",
    status: "running",
    elapsed: 78,
    queries: 23,
    tools: 5,
    model: "Writing agent · Fast",
    activity: [
      { id: "n1", text: "Collected merged changes.", time: "1m ago" },
      { id: "n2", text: "Drafting a summary for each feature.", time: "Now" },
    ],
  },
  {
    id: "metrics",
    title: "Weekly metrics digest",
    summary:
      "Pulled numbers from three dashboards and prepared the weekly summary.",
    status: "done",
    elapsed: 252,
    queries: 3,
    tools: 8,
    model: "Analytics agent · Pro",
    activity: [
      {
        id: "d1",
        text: "Compared this week with the previous period.",
        time: "8m ago",
      },
      { id: "d2", text: "Summary is ready to review.", time: "4m ago" },
    ],
  },
];
