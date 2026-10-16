import type { Issue } from "@/components/issue-browser/model";
const titles = [
  "Popover loses focus when switching between nested menus",
  "Support a compact variant for the command menu",
  "Calendar month label should follow the selected locale",
  "Long labels overflow the select trigger",
  "Improve keyboard navigation in the data table",
  "Dialog content jumps when the scrollbar disappears",
  "Add an example for grouped combobox options",
  "Sidebar tooltip stays visible after navigation",
  "Expose a custom empty state for the search list",
  "Respect reduced motion in the toast stack",
  "Allow a sticky column in the comparison table",
  "Document focus restoration for nested dialogs",
  "Input prefix alignment with variable font sizes",
  "Add copy feedback to the code block",
  "Card header needs a semantic heading option",
  "Keep selection when refreshing a filtered list",
  "Support a read-only mode in the date picker",
  "Improve contrast for disabled navigation items",
  "Prevent duplicate submit on slow connections",
  "Align avatar fallback across platforms",
];
const people = ["Alex Morgan", "Jamie Park", "Riley Chen", "Sam Rivera"];
export const SAMPLE_ISSUES: Issue[] = titles.map((title, i) => ({
  id: 8428 - i,
  title,
  author: people[i % 4],
  state: i > 16 ? "closed" : "open",
  labels:
    i % 3 === 0
      ? ["bug", "accessibility"]
      : i % 3 === 1
        ? ["enhancement"]
        : ["bug"],
  updated: 100 - i,
  age: i < 4 ? `${i + 1}h` : `${Math.ceil(i / 3)}d`,
  assignee: i % 4 === 0 ? "Jamie Park" : undefined,
  milestone: i % 5 === 0 ? "Next release" : undefined,
  development: i === 0 ? "#8461 · Preserve menu focus" : undefined,
  description:
    i === 0
      ? "## Describe the bug\nWhen moving from a parent menu to a nested popover, focus returns to the page behind the menu. This makes the final action difficult to reach with a keyboard.\n\n## Steps to reproduce\n1. Open the project actions menu.\n2. Use the arrow keys to reach **Move to project**.\n3. Press Enter and choose a destination.\n4. Dismiss the nested popover with Escape.\n\n## Expected behavior\nFocus should return to the parent trigger. The menu should remain available without restarting navigation.\n\n```tsx\n<Popover onOpenChange={setOpen}>\n  <ProjectMenu />\n</Popover>\n```\n\n## Environment\n- Latest stable browser\n- Keyboard navigation enabled\n- Both light and dark themes\n\n## Additional context\nThis is a fictional issue used to demonstrate the Oreo UI browser. No GitHub service is connected."
      : `## ${i % 3 === 1 ? "Proposed improvement" : "Current behavior"}\n${title}. This sample describes a focused improvement to the component library.\n\n## Acceptance criteria\n- Works with keyboard and pointer input\n- Uses the existing semantic tokens\n- Preserves the current selection\n- Supports both light and dark themes\n\n## Example\n\`\`\`tsx\n<Component size="compact" />\n\`\`\`\n\n## Notes\nThis issue is fictional. The template stores changes in memory and resets on reload.`,
  comments:
    i % 5 === 4
      ? []
      : [
          {
            id: `${i}-a`,
            author: people[(i + 1) % 4],
            body: "Thanks for the clear reproduction. I can confirm this in the sample workspace.",
            date: "Yesterday",
          },
          ...(i % 2 === 0
            ? [
                {
                  id: `${i}-b`,
                  author: "Jamie Park",
                  body: "I’m looking into the focus boundary. We should keep the parent menu available when the nested surface closes.",
                  date: "2 hours ago",
                },
              ]
            : []),
        ],
}));
