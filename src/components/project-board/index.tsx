import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { ProjectSummary } from "@/components/project-summary";
import "./project-board.css";
export const PROJECT_STAGES = [
  { id: "todo", title: "To do" },
  { id: "progress", title: "In progress" },
  { id: "review", title: "In review" },
  { id: "done", title: "Completed" },
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number]["id"];
export type BoardProject = {
  id: string;
  title: string;
  description: string;
  stage: ProjectStage;
  category: string;
  priority: "Low" | "Medium" | "High";
  due: string;
  completed: number;
  total: number;
  assigneeId: string;
};
export type BoardPerson = { id: string; name: string };
export function ProjectCreateCard({
  title = "A little room for your next idea.",
  description = "Create a project, bring your people together, and make a start.",
  actionLabel = "Add new project",
  onCreate,
  animated = true,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onCreate?: () => void;
  animated?: boolean;
}) {
  return (
    <article className="pb-create" data-motion={animated ? "on" : "off"}>
      <div className="pb-create-art" aria-hidden="true">
        <div className="pb-mini-window">
          <span />
          <div>
            {[0, 1, 2].map((n) => (
              <div key={n}>
                <i />
                <i />
                <i />
              </div>
            ))}
          </div>
        </div>
        <div className="pb-floating-card">
          <span>
            <Icon name="plus" size="md" />
          </span>
          <i />
          <i />
        </div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {onCreate && (
        <Button
          type="primary"
          size="sm"
          tapScale={1}
          leadingIcon={<Icon name="plus" size="sm" />}
          onClick={onCreate}
        >
          {actionLabel}
        </Button>
      )}
    </article>
  );
}
export function BoardProjectSummary({
  project,
  people,
  onOpen,
}: {
  project: BoardProject;
  people: BoardPerson[];
  onOpen?: (id: string) => void;
}) {
  const owner = people.find((p) => p.id === project.assigneeId);
  const date = new Date(`${project.due}T00:00:00Z`);
  return (
    <div className="pb-project">
      <div className="pb-project-meta">
        <Tag
          color={
            project.priority === "High"
              ? "orange"
              : project.priority === "Low"
                ? "mint"
                : "default"
          }
        >
          {project.priority}
        </Tag>
        <span>{project.category}</span>
      </div>
      <ProjectSummary
        title={project.title}
        description={project.description}
        completed={project.completed}
        total={project.total}
        due={
          project.due && !Number.isNaN(date.getTime())
            ? new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              }).format(date)
            : "No due date"
        }
        status={project.stage === "todo" ? "Planning" : "On track"}
        people={owner ? [{ name: owner.name }] : []}
        onOpen={onOpen ? () => onOpen(project.id) : undefined}
      />
    </div>
  );
}
export function ProjectBoardOverview({
  projects,
  people = [],
  onOpen,
  onCreate,
  showCreate = true,
}: {
  projects: BoardProject[];
  people?: BoardPerson[];
  onOpen?: (id: string) => void;
  onCreate?: (stage: ProjectStage) => void;
  showCreate?: boolean;
}) {
  return (
    <div
      className="pb-overview-scroll"
      role="region"
      aria-label="Project overview columns"
      tabIndex={0}
    >
      <div className="pb-overview">
        {PROJECT_STAGES.map((stage) => (
          <section
            key={stage.id}
            className="pb-column"
            aria-label={stage.title}
          >
            <header>
              <h2>{stage.title}</h2>
              <span>{projects.filter((p) => p.stage === stage.id).length}</span>
              {onCreate && (
                <IconButton
                  size="sm"
                  type="tertiary"
                  tapScale={1}
                  aria-label={`New project in ${stage.title}`}
                  icon={<Icon name="plus" size="sm" />}
                  onClick={() => onCreate(stage.id)}
                />
              )}
            </header>
            <div className="pb-column-content">
              {stage.id === "todo" && showCreate && (
                <ProjectCreateCard
                  onCreate={onCreate ? () => onCreate("todo") : undefined}
                />
              )}{" "}
              {projects
                .filter((p) => p.stage === stage.id)
                .map((project) => (
                  <BoardProjectSummary
                    key={project.id}
                    project={project}
                    people={people}
                    onOpen={onOpen}
                  />
                ))}
              {!projects.some((p) => p.stage === stage.id) &&
                !(stage.id === "todo" && showCreate) && (
                  <p className="pb-column-empty">Nothing here yet.</p>
                )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
