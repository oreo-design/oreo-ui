import type { ConnectionProject } from "@/components/connections";
export const currentProject: ConnectionProject = { id: "prj_demo_vercel_site", name: "vercel-site" };
export const connectionProjects: ConnectionProject[] = [
  { id: "prj_demo_browser_api", name: "browser-api", mark: "flame", tone: "orange" },
  { id: "prj_demo_vercel_docs", name: "vercel-docs" },
  { id: "prj_demo_vercel_marketing", name: "vercel-marketing" },
  { id: "prj_demo_geist_docs", name: "geist-docs" },
  { id: "prj_demo_vercel_ship", name: "vercel-ship" },
  { id: "prj_demo_vercel_academy", name: "vercel-academy" },
  { id: "prj_demo_next_site", name: "next-site", mark: "letter", letter: "N" },
  { id: "prj_demo_geist_storybook", name: "geist-storybook", mark: "letter", letter: "S", tone: "pink" },
  { id: "prj_demo_analytics", name: "analytics-script", mark: "letter", letter: "A" },
];
