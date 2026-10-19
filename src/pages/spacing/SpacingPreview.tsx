import { useId } from "react";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import {
  LayoutScope,
  LayoutSection,
  LayoutGrid,
  LayoutCard,
  type SpacingValues,
  type SpacingKey,
} from "@/components/layout-spacing";

export function SpacingPreview({
  values,
  highlight,
  longText,
  label,
}: {
  values: SpacingValues;
  highlight: SpacingKey | "all" | "none";
  longText: boolean;
  label: string;
}) {
  const id = useId();
  return (
    <div
      className="spacing-preview-scroll"
      tabIndex={0}
      role="region"
      aria-label={`${label} dashboard preview, scroll horizontally on small screens`}
    >
      <LayoutScope
        values={values}
        className="spacing-demo"
        data-highlight={highlight}
      >
        <aside
          className="spacing-demo-nav"
          aria-label={`${label} sample sidebar`}
        >
          <div className="spacing-demo-brand">
            <span className="spacing-brand-mark">o</span> Acme studio
          </div>
          <div className="spacing-demo-nav-items">
            <span data-active>
              <Icon name="chart-bar" size="sm" />
              Overview
            </span>
            <span>
              <Icon name="folder" size="sm" />
              Projects
            </span>
            <span>
              <Icon name="users" size="sm" />
              {longText ? "People & collaborators" : "People"}
            </span>
            <span>
              <Icon name="chart-line" size="sm" />
              Reports
            </span>
          </div>
          <div className="spacing-demo-profile">
            <Avatar name="Alex Morgan" size="sm" />
            <span>
              Alex Morgan<small>Pro workspace</small>
            </span>
          </div>
        </aside>
        <div className="spacing-demo-page">
          <LayoutSection>
            <header className="spacing-demo-heading">
              <div>
                <p>WORKSPACE</p>
                <h2>
                  {longText ? "Your team's weekly performance" : "Overview"}
                </h2>
              </div>
              <span className="spacing-date">Oct 12–18</span>
            </header>
            <section
              className="spacing-demo-section"
              aria-labelledby={`${id}-metrics`}
            >
              <div className="spacing-section-title">
                <h3 id={`${id}-metrics`}>This week</h3>
                <span>Updated just now</span>
              </div>
              <LayoutGrid>
                {[
                  [
                    longText ? "Total workspace revenue" : "Revenue",
                    "$24,680",
                    "+12.8%",
                  ],
                  [
                    longText
                      ? "Projects currently in progress"
                      : "Active projects",
                    "18",
                    "+3 this week",
                  ],
                  [
                    longText ? "New people in your workspace" : "New members",
                    "124",
                    "+8.2%",
                  ],
                ].map(([title, value, change]) => (
                  <LayoutCard key={title}>
                    <div className="spacing-card-content">
                      <p className="spacing-metric-label">{title}</p>
                      <strong className="spacing-metric-value">{value}</strong>
                      <span className="spacing-metric-change">{change}</span>
                    </div>
                  </LayoutCard>
                ))}
              </LayoutGrid>
            </section>
            <section
              className="spacing-demo-section"
              aria-labelledby={`${id}-activity`}
            >
              <div className="spacing-section-title">
                <h3 id={`${id}-activity`}>Activity</h3>
                <span>Last 7 days</span>
              </div>
              <LayoutGrid className="spacing-activity-grid">
                <LayoutCard>
                  <div className="spacing-card-content">
                    <h4>Projects completed</h4>
                    <div
                      className="spacing-bars"
                      role="img"
                      aria-label="Completed projects: Monday 4, Tuesday 7, Wednesday 5, Thursday 10, Friday 8, Saturday 12, Sunday 9"
                    >
                      {[4, 7, 5, 10, 8, 12, 9].map((n, i) => (
                        <div key={i}>
                          <span style={{ height: `${(n / 12) * 100}%` }} />
                          <small>
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </LayoutCard>
                <LayoutCard>
                  <div className="spacing-card-content">
                    <h4>Recent projects</h4>
                    <div className="spacing-projects">
                      {[
                        "Website refresh",
                        "Brand guidelines",
                        "Mobile experience",
                      ].map((name, i) => (
                        <div key={name}>
                          <span className="spacing-project-dot" />
                          <span>
                            {longText ? `${name} — design exploration` : name}
                            <small>
                              {["Design", "In review", "Development"][i]}
                            </small>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </LayoutCard>
              </LayoutGrid>
            </section>
          </LayoutSection>
        </div>
      </LayoutScope>
    </div>
  );
}
