import type {
  KnowledgeFile,
  KnowledgeFolder,
  KnowledgeWorkspace,
} from "@/components/knowledge-base";

export const workspaces: KnowledgeWorkspace[] = [
  { id: "acme", name: "Acme Workspace", initials: "AC", members: 12 },
  { id: "studio", name: "Design Studio", initials: "DS", members: 4 },
];
export const folders: KnowledgeFolder[] = [
  {
    id: "general",
    name: "General Knowledge",
    children: [
      {
        id: "onboarding",
        name: "Onboarding",
        tone: "violet",
        children: [
          { id: "getting-started", name: "Getting started", tone: "violet" },
          { id: "team-handbook", name: "Team handbook", tone: "violet" },
        ],
      },
      { id: "integrations", name: "Integrations" },
      { id: "documents", name: "Documents", tone: "yellow" },
      { id: "design", name: "Design System", tone: "blue" },
    ],
  },
  { id: "onboarding-design", name: "Onboarding Design", tone: "blue" },
  { id: "interviews", name: "Team Interviews", tone: "yellow" },
];
export const files: KnowledgeFile[] = [
  {
    id: "welcome",
    name: "Welcome-Pack-2026.pdf",
    author: "priya.shah@acme.co",
    authorName: "Priya",
    color: "brown",
    folderId: "getting-started",
    size: "2.4 MB",
    summary:
      "Your first week at Acme: meet the team, set up your tools, and find the people who can help.",
  },
  {
    id: "strategy",
    name: "H2-Strategy-Brief.doc",
    author: "leo.marquez@acme.co",
    authorName: "Leo",
    color: "mint",
    folderId: "documents",
    size: "840 KB",
    summary:
      "Our priorities for the second half of 2026: simplify the experience, strengthen our foundations, and make room for thoughtful growth.",
  },
  {
    id: "policies",
    name: "Employee-Policies.pdf",
    author: "hana.kim@acme.co",
    authorName: "Hana",
    color: "purple",
    folderId: "team-handbook",
    size: "1.2 MB",
    summary:
      "A shared guide to working together, including flexible hours, time off, and team communication.",
  },
  {
    id: "retention",
    name: "Retention-Report.xls",
    author: "priya.shah@acme.co",
    authorName: "Priya",
    color: "brown",
    folderId: "documents",
    size: "320 KB",
    summary:
      "A local example of the quarterly retention report. No private customer or employee records are included.",
  },
  {
    id: "type",
    name: "Typography-Guidelines.pdf",
    author: "hana.kim@acme.co",
    authorName: "Hana",
    color: "purple",
    folderId: "design",
    size: "4.1 MB",
    summary:
      "Type scale, font weights, and line lengths for clear, consistent interfaces.",
  },
  {
    id: "colors",
    name: "Color-Tokens.json",
    author: "leo.marquez@acme.co",
    authorName: "Leo",
    color: "mint",
    folderId: "design",
    size: "12 KB",
    summary:
      "Semantic colors for surfaces, text, borders, and status. Light and dark themes share the same token names.",
  },
];
export const studioFiles: KnowledgeFile[] = [
  {
    id: "studio-brief",
    name: "Studio-Creative-Brief.pdf",
    author: "maya@studio.example",
    authorName: "Maya",
    color: "purple",
    folderId: "design",
    size: "960 KB",
    summary:
      "Explore a calmer visual language for the studio’s next collection.",
  },
];
export function descendantIds(id: string, nodes = folders): string[] {
  for (const node of nodes) {
    if (node.id === id)
      return [
        node.id,
        ...(node.children?.flatMap((child) =>
          descendantIds(child.id, node.children),
        ) ?? []),
      ];
    const found = node.children && descendantIds(id, node.children);
    if (found?.length) return found;
  }
  return [];
}
export function findFolder(
  id: string,
  nodes = folders,
): KnowledgeFolder | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = node.children && findFolder(id, node.children);
    if (found) return found;
  }
}
