import type { DocsNav } from "@/docs/DocsPage";
import { Button } from "@/components/button";
import { SPACING_FIELDS, SPACING_PRESETS } from "@/components/layout-spacing";

export function SpacingGuide({ nav }: { nav: DocsNav }) {
  return (
    <main className="spacing-guide">
      <section className="spacing-guide-lead">
        <p className="spacing-eyebrow">THE PRINCIPLE</p>
        <h2>
          Close within a group.
          <br />
          Space between ideas.
        </h2>
        <p>
          Spacing tells people what belongs together. Start with the
          relationship between elements, then choose a value from the scale.
          More space is useful when it creates a clearer hierarchy.
        </p>
        <Button type="primary" onClick={() => nav.onNavigate("spacing")}>
          Explore in the playground
        </Button>
      </section>
      <section>
        <h2>Five roles, one vocabulary</h2>
        <p>
          These opt-in layout tokens describe page composition. The Balanced
          values are a starting recipe for a desktop workspace, not a new global
          default.
        </p>
        <div
          className="spacing-guide-table"
          tabIndex={0}
          role="region"
          aria-label="Layout spacing tokens"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Token</th>
                <th scope="col">Starting value</th>
              </tr>
            </thead>
            <tbody>
              {SPACING_FIELDS.map((f) => (
                <tr key={f.key}>
                  <th scope="row">
                    {f.label}
                    <span>{f.rule}</span>
                  </th>
                  <td>
                    <code>{f.token}</code>
                  </td>
                  <td>{SPACING_PRESETS.Balanced[f.key]} px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Choose a scale, then a relationship</h2>
        <div className="spacing-scale" aria-label="Layout scale">
          {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((n) => (
            <div key={n}>
              <span style={{ width: n }} />
              <code>{n}</code>
            </div>
          ))}
        </div>
        <p>
          Use Oreo's existing Tailwind spacing scale for composition. Keep the
          finer 2px and 6px control tokens for icon–label gaps and compact
          controls. A page density choice should not silently resize every
          button.
        </p>
        <ul>
          <li>
            <strong>Inside a group:</strong> title and description stay close;
            repeated items use one rhythm.
          </li>
          <li>
            <strong>Between groups:</strong> section spacing is usually greater
            than item spacing. It is a relationship, not a fixed multiplier.
          </li>
          <li>
            <strong>Inside a container:</strong> align text and actions to a
            consistent inset. Avoid stacking wrapper padding on top of card
            padding accidentally.
          </li>
        </ul>
      </section>
      <section>
        <h2>Preserve the product pattern</h2>
        <div className="spacing-guide-examples">
          <article>
            <h3>Settings</h3>
            <p>
              Reuse SettingsSection, SettingsCard and RowShell. Section headings
              align with the row text, including when card styles change. A new
              setting should inherit that composition.
            </p>
            <a
              href="/settings"
              onClick={(e) => {
                e.preventDefault();
                nav.onNavigate("settings");
              }}
            >
              Inspect Settings →
            </a>
          </article>
          <article>
            <h3>Review workspace</h3>
            <p>
              A dense contact queue and a spacious email reader serve different
              tasks. Share rules within each family, while preserving their
              different reading and scanning needs.
            </p>
            <a
              href="/review-workspace"
              onClick={(e) => {
                e.preventDefault();
                nav.onNavigate("review-workspace");
              }}
            >
              Inspect Review Workspace →
            </a>
          </article>
        </div>
      </section>
      <section>
        <h2>Use the layout primitives</h2>
        <p>
          LayoutScope supplies the five variables. LayoutSection stacks groups;
          LayoutGrid arranges related cards; LayoutCard owns the card inset.
          Your application shell consumes the sidebar and page variables.
        </p>
        <pre tabIndex={0} aria-label="Layout composition example">
          <code>{`import {
  LayoutScope, LayoutSection, LayoutGrid, LayoutCard,
  SPACING_PRESETS,
} from "@/components/layout-spacing";

<LayoutScope values={SPACING_PRESETS.Balanced}>
  <div className="workspace-shell">
    <aside>Navigation</aside>
    <main>
      <LayoutSection>
        <header><h1>Overview</h1></header>
        <section>
          <h2>This week</h2>
          <LayoutGrid>
            <LayoutCard>Revenue</LayoutCard>
            <LayoutCard>Projects</LayoutCard>
          </LayoutGrid>
        </section>
      </LayoutSection>
    </main>
  </div>
</LayoutScope>

/* Choose a breakpoint for your content. */
.workspace-shell { display: grid; gap: 0; }
.workspace-shell > main { min-width: 0; padding: var(--layout-page); }
.workspace-shell h2 { margin-bottom: 12px; }
@media (min-width: 64rem) {
  .workspace-shell {
    grid-template-columns: var(--layout-sidebar) minmax(0, 1fr);
  }
}`}</code>
        </pre>
        <p>
          Below the desktop breakpoint, replace the sidebar with your product's
          drawer or compact navigation. The playground keeps a desktop specimen
          at actual pixel sizes so comparisons measure spacing rather than
          different breakpoints.
        </p>
      </section>
      <section>
        <h2>Check the composition</h2>
        <ul>
          <li>
            Use identical content and viewport for before/after comparisons.
          </li>
          <li>
            Try long titles, translated labels, empty and loading states in the
            real consuming page.
          </li>
          <li>
            Check focus rings, button target sizes and scrolling beneath
            headings.
          </li>
          <li>
            Test narrow screens and both themes. Reduce page inset before
            sacrificing readable content width.
          </li>
        </ul>
        <p>
          Reference:{" "}
          <a
            href="https://x.com/recentdesign/status/2111763882507149567?s=20"
            target="_blank"
            rel="noreferrer"
          >
            Spacing Tips, shared by Recent and credited to Michael Filipiuk
          </a>
          . The Reference preset preserves the demonstrated values for study;
          they are not universal prescriptions.
        </p>
      </section>
    </main>
  );
}
