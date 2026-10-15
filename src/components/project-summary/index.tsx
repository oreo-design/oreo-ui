import type { ReactNode } from "react";
import { Avatar, type AvatarProps } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { StepProgress } from "@/components/step-progress";
import { Icon } from "@/components/icon";
import "./project-summary.css";
export type ProjectSummaryProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  completed: number;
  total: number;
  due?: string;
  status?: "On track" | "At risk" | "Planning";
  people?: { name: string; color?: AvatarProps["color"] }[];
  onOpen?: () => void;
};
export function ProjectSummary({
  title,
  description,
  icon,
  completed,
  total,
  due,
  status = "On track",
  people = [],
  onOpen,
}: ProjectSummaryProps) {
  return (
    <article className="oreo-project-summary">
      <div className="ps-heading">
        <span className="ps-icon">{icon ?? <Icon name="folder" />}</span>
        <h3>
          {onOpen ? (
            <button type="button" onClick={onOpen}>
              {title}
              <Icon name="arrow-up-right" size="sm" />
            </button>
          ) : (
            title
          )}
        </h3>
        <Tag
          color={
            status === "At risk"
              ? "orange"
              : status === "On track"
                ? "mint"
                : "default"
          }
        >
          {status}
        </Tag>
      </div>
      {description && <p className="ps-description">{description}</p>}
      <StepProgress
        completed={completed}
        total={total}
        label="Tasks completed"
      />
      <footer>
        <span className="ps-due">
          <Icon name="calendar" size="sm" />
          {due ?? "No due date"}
        </span>
        <span className="ps-people">
          {people.slice(0, 3).map((p) => (
            <Avatar key={p.name} name={p.name} color={p.color} size="xs" />
          ))}
          {people.length > 3 && (
            <span
              className="ps-more"
              aria-label={`${people.length - 3} more members`}
            >
              +{people.length - 3}
            </span>
          )}
        </span>
      </footer>
    </article>
  );
}
