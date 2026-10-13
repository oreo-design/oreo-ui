import { useState } from "react";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { WorkspaceRail, type WorkspaceRailItem } from "@/components/review-workspace";
import { SkillCard, SkillCatalogTabs, SkillEmptyState, SkillSearch, SkillSection, SkillWorkspaceShell, type SkillCatalogView } from "@/components/skill-card";
import { catalogSkills } from "./data";

const navigation: WorkspaceRailItem[] = [
  { id: "review-workspace", label: "Review workspace", icon: "list-checks" },
  { id: "skills", label: "Skills", icon: "circle-dashed" },
  { id: "kanban", label: "Kanban", icon: "folder", divider: true },
  { id: "settings", label: "Settings", icon: "gear" },
];

export function SkillsWorkspace({ dark, onToggleTheme, onNavigate }: { dark: boolean; onToggleTheme: () => void; onNavigate: (id: string) => void }) {
  const [view, setView] = useState<SkillCatalogView>("discover");
  const [query, setQuery] = useState("");
  const [installed, setInstalled] = useState<Set<string>>(() => new Set());
  const [announcement, setAnnouncement] = useState("");
  const visible = catalogSkills.filter(skill => (view === "discover" || installed.has(skill.id)) && `${skill.title} ${skill.description} ${skill.provider.name}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const groups = view === "installed" ? ["Your skills"] : [...new Set(visible.map(skill => skill.group))];
  const emptyInstalled = view === "installed" && installed.size === 0;
  const content = visible.length ? groups.map(group => <SkillSection key={group} title={group}>{visible.filter(skill => view === "installed" || skill.group === group).map(skill => <SkillCard key={skill.id} {...skill} installed={installed.has(skill.id)} onInstalledChange={next => {
    setInstalled(current => { const updated = new Set(current); if (next) updated.add(skill.id); else updated.delete(skill.id); return updated; });
    setAnnouncement(`${skill.title} ${next ? "installed" : "removed"} in this demo.`);
  }} />)}</SkillSection>) : <SkillEmptyState title={emptyInstalled ? "Your skills start here" : "No skills found"} description={emptyInstalled ? "Discover a skill and add it to your workspace." : `No matches for “${query.trim()}”. Try another name or provider.`} actionLabel={emptyInstalled ? "Discover skills" : "Clear search"} onAction={() => { setQuery(""); if (emptyInstalled) setView("discover"); }} />;
  return <SkillWorkspaceShell rail={<WorkspaceRail items={navigation} activeId="skills" onSelect={id => { if (id !== "skills") onNavigate(id); }} footer={<IconButton type="tertiary" aria-label={dark ? "Use light theme" : "Use dark theme"} tapScale={1} icon={<Icon name={dark ? "sun" : "moon"} />} onClick={onToggleTheme} />} />}>
    <SkillCatalogTabs value={view} onValueChange={setView} installedCount={installed.size} search={<SkillSearch value={query} onValueChange={setQuery} />}>{ { installed: content, discover: content } }</SkillCatalogTabs>
    <p role="status" className="mt-6 min-h-5 text-xs leading-5 text-text-secondary">{announcement || "Demo workspace · installs stay here until you reload."}</p>
  </SkillWorkspaceShell>;
}
