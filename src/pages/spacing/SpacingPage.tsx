import { useState } from "react";
import { Sidebar } from "@/docs/Sidebar";
import type { DocsNav } from "@/docs/DocsPage";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { PropertyControl } from "@/docs/playground/PropertyControl";
import { number, toggle } from "@/docs/playground/schema";
import {
  SPACING_FIELDS,
  SPACING_PRESETS,
  INITIAL_BASELINE,
  spacingCSS,
  type SpacingKey,
  type SpacingValues,
} from "@/components/layout-spacing";
import { SpacingPreview } from "./SpacingPreview";
import { SpacingGuide } from "./SpacingGuide";
import "./spacing.css";

export function SpacingPage({ nav }: { nav: DocsNav }) {
  const [values, setValues] = useState<SpacingValues>({
    ...SPACING_PRESETS.Balanced,
  });
  const [baseline, setBaseline] = useState<SpacingValues>({
    ...INITIAL_BASELINE,
  });
  const [compare, setCompare] = useState(false);
  const [highlights, setHighlights] = useState(false);
  const [focus, setFocus] = useState<SpacingKey | "all">("all");
  const [dark, setDark] = useState(false);
  const [longText, setLongText] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCSS, setShowCSS] = useState(false);
  const guide = nav.active === "spacing-guide";
  const preset = Object.entries(SPACING_PRESETS).find(([, p]) =>
    SPACING_FIELDS.every((f) => p[f.key] === values[f.key]),
  )?.[0];
  const code = spacingCSS(values);
  const copy = async () => {
    setShowCSS(true);
    try {
      await navigator.clipboard.writeText(code);
      setNotice("CSS copied.");
    } catch {
      setNotice(
        "Clipboard unavailable. Select the CSS below and copy it manually.",
      );
    }
  };
  return (
    <div className={`spacing-page${dark ? " theme-dark" : ""}`}>
      <Sidebar nav={nav} />
      <div className="spacing-main">
        <header className="spacing-page-header">
          <div>
            <p className="spacing-eyebrow">Foundations / Layout</p>
            <h1>{guide ? "Spacing guide" : "Spacing playground"}</h1>
            <p className="spacing-intro">
              {guide
                ? "Give every space a purpose."
                : "Small adjustments. A clearer whole."}
            </p>
          </div>
          <div className="spacing-page-actions">
            <nav aria-label="Spacing page view">
              {[
                ["spacing", "Playground"],
                ["spacing-guide", "Guide"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`/${id}`}
                  aria-current={nav.active === id ? "page" : undefined}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      nav.onNavigate(id);
                    }
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <Button
              type="tertiary"
              size="sm"
              leadingIcon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
              onClick={() => setDark(!dark)}
            >
              {dark ? "Light" : "Dark"}
            </Button>
          </div>
        </header>
        {guide ? (
          <SpacingGuide nav={nav} />
        ) : (
          <div className="spacing-workbench">
            <main className="spacing-canvas" aria-label="Spacing playground">
              <div className="spacing-toolbar">
                <div
                  className="spacing-presets"
                  role="group"
                  aria-label="Spacing presets"
                >
                  {Object.entries(SPACING_PRESETS).map(([name, p]) => (
                    <Button
                      key={name}
                      size="sm"
                      type={preset === name ? "secondary" : "tertiary"}
                      aria-pressed={preset === name}
                      onClick={() => {
                        setValues({ ...p });
                        setNotice(`${name} preset applied.`);
                      }}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
                <span className="spacing-preset-label">
                  {preset ?? "Custom"} layout
                </span>
              </div>
              <div className="spacing-preview-stack">
                {compare && (
                  <section aria-label="Baseline layout">
                    <div className="spacing-preview-label">
                      <h2>Baseline</h2>
                      <span>Frozen for comparison</span>
                    </div>
                    <SpacingPreview
                      label="Baseline"
                      values={baseline}
                      highlight={highlights ? focus : "none"}
                      longText={longText}
                    />
                  </section>
                )}
                <section aria-label="Current layout">
                  <div className="spacing-preview-label">
                    <h2>{compare ? "Current" : "Live preview"}</h2>
                    <span>Same content. Only spacing changes.</span>
                  </div>
                  <SpacingPreview
                    label="Current"
                    values={values}
                    highlight={highlights ? focus : "none"}
                    longText={longText}
                  />
                </section>
              </div>
              <p className="spacing-preview-note">
                Desktop specimen · actual CSS pixels · scroll the preview on
                smaller screens.
              </p>
              <div className="spacing-reading">
                <Icon name="info" size="sm" />
                <p>
                  {values.section <= values.grid
                    ? "The section gap is no larger than the card gap. Try separating groups more than the cards inside them."
                    : "Related cards sit together. More space between sections makes each group easier to scan."}
                </p>
              </div>
              <section className="spacing-export">
                <div className="spacing-preview-label">
                  <h2>Your spacing recipe</h2>
                  <Button
                    type="secondary"
                    size="sm"
                    onClick={() => void copy()}
                    leadingIcon={<Icon name="copy" size="sm" />}
                  >
                    Copy CSS
                  </Button>
                </div>
                <dl className="spacing-recipe">
                  {SPACING_FIELDS.map((f) => (
                    <div key={f.key}>
                      <dt>{f.label}</dt>
                      <dd>
                        {values[f.key]}
                        <small> px</small>
                      </dd>
                    </div>
                  ))}
                </dl>
                <details
                  open={showCSS}
                  onToggle={(e) => setShowCSS(e.currentTarget.open)}
                >
                  <summary>View CSS</summary>
                  <pre tabIndex={0} aria-label="Spacing CSS">
                    <code>{code}</code>
                  </pre>
                  <p>
                    Use these scoped variables with the layout primitives in the{" "}
                    <a
                      href="/spacing-guide"
                      onClick={(e) => {
                        e.preventDefault();
                        nav.onNavigate("spacing-guide");
                      }}
                    >
                      spacing guide
                    </a>
                    .
                  </p>
                </details>
              </section>
              <p role="status" className="spacing-notice">
                {notice}
              </p>
            </main>
            <aside
              className="spacing-inspector"
              aria-label="Spacing properties"
            >
              <div className="spacing-inspector-header">
                <h2>
                  <Icon name="sliders" size="sm" />
                  Spacing
                </h2>
                <Button
                  type="tertiary"
                  size="sm"
                  onClick={() => {
                    setValues({ ...SPACING_PRESETS.Balanced });
                    setNotice(
                      "Spacing reset to Balanced. Baseline and view options kept.",
                    );
                  }}
                >
                  Reset
                </Button>
              </div>
              <div className="spacing-inspector-group">
                <p className="spacing-group-caption">FIVE LAYERS OF SPACE</p>
                {SPACING_FIELDS.map((f, i) => (
                  <div
                    className="spacing-field"
                    key={f.key}
                    data-layer={f.key}
                    onFocusCapture={() => setFocus(f.key)}
                  >
                    <span className="spacing-field-index" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <PropertyControl
                      name={f.label}
                      value={values[f.key]}
                      control={{
                        ...number(
                          SPACING_PRESETS.Balanced[f.key],
                          f.min,
                          f.max,
                          4,
                        ),
                        description: f.description,
                      }}
                      onChange={(v) =>
                        setValues((current) => ({
                          ...current,
                          [f.key]: Number(v),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="spacing-inspector-group spacing-view-options">
                <h3>Inspect the layout</h3>
                <PropertyControl
                  name="Highlight spacing"
                  control={toggle()}
                  value={highlights}
                  onChange={(v) => setHighlights(Boolean(v))}
                />
                {highlights && (
                  <label className="spacing-highlight-select">
                    Highlight layer
                    <select
                      value={focus}
                      onChange={(e) =>
                        setFocus(e.target.value as SpacingKey | "all")
                      }
                    >
                      <option value="all">All layers</option>
                      {SPACING_FIELDS.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <PropertyControl
                  name="Compare with baseline"
                  control={toggle()}
                  value={compare}
                  onChange={(v) => setCompare(Boolean(v))}
                />
                <div className="spacing-baseline-actions">
                  <Button
                    size="sm"
                    type="secondary"
                    onClick={() => {
                      setBaseline({ ...values });
                      setCompare(true);
                      setNotice("Current spacing saved as the baseline.");
                    }}
                  >
                    Set current as baseline
                  </Button>
                  <Button
                    size="sm"
                    type="tertiary"
                    onClick={() => {
                      setBaseline({ ...INITIAL_BASELINE });
                      setNotice("Original baseline restored.");
                    }}
                  >
                    Restore baseline
                  </Button>
                </div>
                <PropertyControl
                  name="Long content"
                  control={toggle()}
                  value={longText}
                  onChange={(v) => setLongText(Boolean(v))}
                />
              </div>
              <p className="spacing-inspector-foot">
                Presets are starting points. Choose space for the content and
                the task.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
