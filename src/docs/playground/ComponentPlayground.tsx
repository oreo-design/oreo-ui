import { useEffect, useState, useCallback, useRef, useId, type CSSProperties } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import type { DocsNav } from "@/docs/DocsPage";
import { ThemeChips } from "./ThemeChips";
import { VariationPanel } from "./VariationPanel";
import { useVariation, setTheme } from "./useVariation";
import { variationTokens } from "./variation";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/button";
import { PropertyControl } from "./PropertyControl";
import {
  defaultsFor,
  resolveControl,
  updateValues,
  type PlaygroundSpec,
  type Values,
} from "./schema";
import { withAppearance } from "./exportAppearance";
import { playgroundCode } from "./code";
import { useDemo } from "./useDemo";
import { PlaygroundIcon as Glyph } from "@/components/icon";
import { Tool, Modal } from "./Tools";
import { ComponentPicker } from "./ComponentPicker";
import { PreviewStage, partsFor, type Part, type Measurement, type PreviewDevice } from "./PreviewStage";
import { SharePanel } from "./SharePanel";
import { ComparePanel } from "./ComparePanel";
import {
  presetKey,
  randomValues,
  readConfiguration,
  readPresets,
  type Configuration,
  type Preset,
} from "./configuration";
import "@fontsource-variable/mona-sans";
import "@fontsource-variable/geist-mono";
import "./playground.css";

const sessions = new Map<string, { values: Values; config: string | null }>();
type Mode = "preview" | "annotation" | "code" | "compare";
const descriptionFor = (slug: string, title: string) =>
  slug === "button"
    ? "A button for the next action. Three types, three sizes, and independent state controls."
    : slug === "prompt-box"
      ? "A composer for prompts, context, attachments and voice. Try each state and tune its behavior."
      : `Explore ${title.toLowerCase()} and adjust its properties. The preview uses the same component as your app.`;

export function ComponentPlayground({
  spec,
  nav,
  breadcrumb,
  onDocumentation,
  onRemixes,
}: {
  spec: PlaygroundSpec;
  nav: DocsNav;
  breadcrumb: string[];
  onDocumentation: () => void;
  onRemixes?: () => void;
}) {
  const { theme } = useVariation();
  const moreTools = useRef<HTMLDetailsElement>(null);
  const [variationOpen, setVariationOpen] = useState(false);
  const themePanelId = useId();
  const themeTriggerId = useId();
  const [wideSettings, setWideSettings] = useState(() => window.matchMedia("(min-width: 1200px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1200px)");
    const sync = () => setWideSettings(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const closeThemeSettings = () => {
    setVariationOpen(false);
    document.getElementById(themeTriggerId)?.focus();
  };
  useEffect(() => {
    if (variationOpen && wideSettings) document.getElementById(themePanelId)?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [variationOpen, wideSettings, themePanelId]);
  const themePicker = <ThemeChips open={variationOpen} onToggle={() => setVariationOpen(open => !open)}
    panelId={themePanelId} triggerId={themeTriggerId} />;

  const [initial] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get("config");
    try {
      return {
        configuration: raw
          ? readConfiguration(raw, nav.active, spec)
          : undefined,
        error: "",
        resumed: sessions.get(nav.active)?.config === raw,
      };
    } catch (error) {
      return { configuration: undefined, error: (error as Error).message };
    }
  });
  const [values, setValues] = useState(() =>
    initial.resumed
      ? sessions.get(nav.active)!.values
      : (initial.configuration?.values ?? defaultsFor(spec)),
  );
  const [revision, setRevision] = useState(0),
    [mode, setMode] = useState<Mode>("preview"),
    [viewport, setViewport] = useState<PreviewDevice>("desktop");
  const [copyStatus, setCopyStatus] = useState(""),
    [error, setError] = useState(initial.error),
    [fallback, setFallback] = useState("");
  const [picker, setPicker] = useState(false),
    [share, setShare] = useState(false),
    [properties, setProperties] = useState(false),
    [selected, setSelected] = useState(0);
  const [customPart, setCustomPart] = useState<Part | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const reportMeasurement = useCallback((next: Measurement | null) => {
    setMeasurement(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, []);
  const selectPart = useCallback((index: number, part?: Part) => {
    setSelected(index);
    setCustomPart(part ?? null);
  }, []);
  const selectedPart = selected >= 0 ? partsFor(nav.active)[selected] : customPart;
  const [presets, setPresets] = useState<Preset[]>([]);
  useEffect(() => {
    const a = initial.configuration?.appearance;
    if (a && !initial.resumed) {
      setTheme(a);
    }
    try {
      setPresets(
        readPresets(
          localStorage.getItem(presetKey(nav.active)),
          nav.active,
          spec,
        ),
      );
    } catch {
      setError(
        "Saved presets could not be loaded. You can still use and share this playground.",
      );
    }
  }, []);
  useEffect(() => {
    sessions.set(nav.active, {
      values,
      config: new URLSearchParams(window.location.search).get("config"),
    });
  }, [values, nav.active]);
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(""), 2600);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  const demo = useDemo(spec, (patch) =>
    setValues((current) => ({ ...current, ...patch })),
    !initial.configuration && !initial.resumed && !initial.error,
  );
  const changeMode = (next: Mode) => {
    demo.player?.pause();
    setMode(next);
  };
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        !(
          event.target instanceof Element &&
          event.target.closest('[role="dialog"]')
        ) &&
        !share &&
        !picker &&
        !properties &&
        !variationOpen
      ) {
        if (moreTools.current?.open) {
          moreTools.current.open = false;
          moreTools.current.querySelector("summary")?.focus();
        } else {
          setMode("preview");
          setSelected(0);
        }
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [share, picker, properties, variationOpen]);
  const set = (key: string, value: Values[string]) => {
    demo.player?.stop();
    setValues((current) => updateValues(spec.controls, current, key, value));
  };
  const apply = (next: Values) => {
    demo.player?.stop();
    setValues(next);
    setRevision((v) => v + 1);
  };
  const reset = () => {
    apply(defaultsFor(spec));
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.delete("config");
    history.replaceState(null, "", url);
  };
  const preview = spec.render(values, set);
  let code = "",
    codeError = "";
  try {
    code = playgroundCode(preview);
  } catch {
    codeError =
      "Code could not be generated for this component. You can still use the preview or open its documentation.";
  }
  const source = spec.source ?? nav.active,
    install = `npx oreo-ui add ${source}`;
  const configuration: Configuration = {
    version: 1,
    component: nav.active,
    values,
    appearance: theme,
  };
  const previewCode = withAppearance(code, configuration.appearance);
  const copy = async (text: string, kind: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${kind} copied`);
    } catch {
      setFallback(text);
    }
  };
  const savePresets = (next: Preset[]) => {
    try {
      localStorage.setItem(presetKey(nav.active), JSON.stringify(next));
      setPresets(next);
      setError("");
      return true;
    } catch {
      setError(
        "Could not save presets in this browser. Use Share to keep this configuration.",
      );
      return false;
    }
  };
  const entries = Object.entries(spec.controls).filter(([key, control]) => {
    if (nav.active === "button" && mode === "annotation")
      return [
        "type",
        "size",
        "leadingIcon",
        "trailingIcon",
        ...(selected === 2 ? ["children"] : []),
      ].includes(key);
    if (nav.active !== "prompt-box") return true;
    if (control.group === "Action review") return Boolean(values.dictation);
    if (["keyword", "keywordColor"].includes(key))
      return Boolean(values.keywords);
    if (key === "voiceStatus") return values.voice !== "none";
    return true;
  });
  const groups = [
    ...new Set(entries.map(([, control]) => control.group ?? spec.title)),
  ];
  const fields = (group: string) => {
    const controls = entries.filter(([, c]) => (c.group ?? spec.title) === group);
    const renderField = ([key, control]: typeof entries[number]) => <PropertyControl
      key={`${revision}-${key}`} name={key} control={resolveControl(control, values)}
      value={values[key]} onChange={value => set(key, value)} />;
    const switches = controls.filter(([, c]) => c.kind === "boolean");
    return <div className="pg-fields">
      {controls.filter(([, c]) => c.kind !== "boolean").map(renderField)}
      {switches.length > 0 && <div className="pg-switch-group">
        <p className="pg-caption">Others</p>{switches.map(renderField)}
      </div>}
    </div>;
  };
  const inspector = (
    <div className="pg-inspector-content" data-mode={mode}>
      {mode === "annotation" ? (
        <>
          <p className="pg-muted">Selected part</p>
          <h2>
            {selected >= 0 && `${String(selected + 1).padStart(2, "0")} `}
            {selectedPart?.name}
          </h2>
          <p className="pg-description">
            {selectedPart?.description}
          </p>
          {measurement ? (
            <dl className="pg-part-metrics" aria-label="Selected part measurements">
              {Object.entries({
                Size: `${Math.round(measurement.width)} × ${Math.round(measurement.height)}`,
                Radius: measurement.radius,
                Padding: measurement.padding,
                Gap: measurement.gap,
                Background: measurement.backgroundToken,
                Color: measurement.colorToken,
                Text: measurement.font,
              }).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          ) : <p className="pg-fine">This part is not currently visible.</p>}
        </>
      ) : (
        <>
          <div className="pg-description-group">
            <p className="pg-caption">Description</p>
            <p className="pg-description">{descriptionFor(nav.active, spec.title)}</p>
          </div>
          <div className="pg-install">
            <p className="pg-caption">Install</p>
            <div className="oreo-squircle">
              <code>{install}</code>
              <Tool
                label="Copy install command"
                icon="copy"
                onClick={() => void copy(install, "Command")}
              />
            </div>
          </div>
        </>
      )}
      <hr />
      {groups
        .filter((group) => group !== "Press spring")
        .sort((a, b) => (a === spec.title ? -1 : b === spec.title ? 1 : 0))
        .map((group) =>
          group === spec.title ? (
            <div key={group}>{fields(group)}</div>
          ) : (
            <details key={group} className="pg-disclosure">
              <summary>
                {group}
                <Glyph name="chevron" />
              </summary>
              {fields(group)}
            </details>
          ),
        )}
      {groups.includes("Press spring") && (
        <details className="pg-disclosure">
          <summary>
            Motion
            <Glyph name="chevron" />
          </summary>
          {fields("Press spring")}
          <p className="pg-fine">
            Press the component to try its spring. Demo playback respects your
            device’s reduced-motion preference.
          </p>
        </details>
      )}

    </div>
  );

  const propertyActions = (
    <div className="pg-property-actions" role="group" aria-label="Property actions">
      <Button type="secondary" size="sm" className="flex-1" onClick={() => apply(randomValues(spec, values))}>
        Random
      </Button>
      <Button type="secondary" size="sm" className="flex-1" onClick={reset}>
        Reset
      </Button>
    </div>
  );

  return (
    <Tooltip.Provider delay={350}>
      <div className="pg-shell">
        <header className="pg-header">
          <button
            className="pg-breadcrumb"
            onClick={() => setPicker(true)}
            aria-label={`Choose component, current ${spec.title}`}
            aria-haspopup="dialog"
          >
            <span className="pg-brand">Oreo UI</span>
            <span className="pg-brand-separator">/</span>
            <span className="pg-category">{breadcrumb[0] ?? "Components"}</span>
            <span>/</span>
            <strong>{spec.title}</strong>
            <Glyph name="chevron" />
          </button>
            <div
              className="pg-toolbar"
              role="toolbar"
              aria-label="Playground tools"
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                    event.key,
                  )
                )
                  return;
                const buttons = Array.from(
                  event.currentTarget.querySelectorAll<HTMLButtonElement>(
                    "button, summary",
                  ),
                ).filter(
                  (button) => button.offsetParent !== null && !button.disabled,
                );
                const current = buttons.indexOf(
                  document.activeElement as HTMLButtonElement,
                );
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? buttons.length - 1
                      : (current +
                          (event.key === "ArrowRight" ? 1 : -1) +
                          buttons.length) %
                        buttons.length;
                event.preventDefault();
                buttons[next]?.focus();
              }}
            >
              <div className="pg-toolgroup">
                {(["preview", "annotation", "code"] as const).map((view) => (
                  <Tool
                    key={view}
                    icon={view}
                    label={view.charAt(0).toUpperCase() + view.slice(1)}
                    active={mode === view}
                    onClick={() => changeMode(view)}
                  />
                ))}
              </div>
              <span className="pg-divider" />
              <div className="pg-toolgroup">
                {(["desktop", "mobile"] as const).map((device) => (
                  <Tool
                    key={device}
                    icon={device}
                    label={device.charAt(0).toUpperCase() + device.slice(1)}
                    active={viewport === device}
                    onClick={() => setViewport(device)}
                  />
                ))}
              </div>
              <details className="pg-more-tools" ref={moreTools}>
                <summary className="pg-tool oreo-squircle oreo-state-layer" aria-label="More tools" title="More tools"><Glyph name="dots" /></summary>
                <div className="pg-toolgroup pg-more-popover oreo-squircle">
                <Tool
                  icon="compare"
                  label="Compare"
                  active={mode === "compare"}
                  onClick={() =>
                    changeMode(mode === "compare" ? "preview" : "compare")
                  }
                />
                <Tool
                  icon="share"
                  label="Share"
                  onClick={() => setShare(true)}
                />
                </div>
              </details>
              <Tool
                className="pg-properties-trigger"
                icon="sliders"
                label="Properties"
                onClick={() => setProperties(true)}
              />
            </div>
          <nav aria-label="Page view">
            <a
              className="oreo-state-layer"
              aria-current="page"
              href={`/${nav.active}`}
              onClick={(event) => {
                if (
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                )
                  event.preventDefault();
              }}
            >
              Playground
            </a>
            <a
              className="oreo-state-layer"
              href={`/${nav.active}?view=docs`}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                onDocumentation();
              }}
            >
              Doc
            </a>
            {onRemixes && (
              <a
                className="oreo-state-layer"
                href={`/${nav.active}?view=remixes`}
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  onRemixes();
                }}
              >
                Remixes
              </a>
            )}
          </nav>
        </header>
        <div className="pg-workspace">
          {wideSettings && variationOpen && <aside id={themePanelId} className="pg-variation" aria-label="Theme settings"
            onKeyDown={event => { if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); closeThemeSettings(); } }}>
            <VariationPanel onClose={closeThemeSettings} />
          </aside>}
          <main aria-label={`${spec.title} playground`} className="pg-main">
            {error && (
              <div className="pg-error" role="alert">
                <p>{error}</p>
                <button onClick={reset}>Reset configuration</button>
              </div>
            )}
            <div className="pg-content">
              {mode === "code" ? (
                <section className="pg-code">
                  <header className="pg-row">
                    <h2>Code</h2>
                    <Tool
                      icon="copy"
                      label="Copy code"
                      disabled={Boolean(codeError)}
                      onClick={() => void copy(previewCode, "Code")}
                    />
                  </header>
                  {codeError ? (
                    <div role="alert">
                      <p>{codeError}</p>
                      <button onClick={onDocumentation}>
                        Open documentation
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="pg-muted">
                        Starting props for this configuration. Connect event
                        handlers in your app.
                      </p>
                      <CodeBlock
                        code={previewCode}
                        language="tsx"
                        copyable={false}
                        wrap
                      />
                    </>
                  )}
                </section>
              ) : mode === "compare" ? (
                <ComparePanel
                  spec={spec}
                  values={values}
                  presets={presets}
                  configuration={configuration}
                  onApply={apply}
                  onPresetApply={(preset) => {
                    apply(preset.values);
                    if (preset.appearance) {
                      setTheme(preset.appearance);
                    }
                  }}
                  onSave={(preset) => {
                    if (presets.length >= 12) {
                      return "You have 12 presets. Remove one before saving another.";
                    }
                    return savePresets([...presets, preset])
                      ? null
                      : "Could not save in this browser. Use Share to keep this configuration, or free some browser storage and retry.";
                  }}
                  onDelete={(id) =>
                    savePresets(presets.filter((p) => p.id !== id))
                  }
                  onBack={() => changeMode("preview")}
                />
              ) : (
                <div
                  className="pg-stage-host"
                  onPointerDownCapture={() => demo.player?.stop()}
                  onKeyDownCapture={() => demo.player?.stop()}
                >
                  <PreviewStage
                    themeStyle={variationTokens(theme) as CSSProperties}
                    slug={nav.active}
                    mode={mode}
                    viewport={viewport}
                    selected={selected}
                    onSelect={selectPart}
                    onMeasure={reportMeasurement}
                    revision={revision}
                  >
                    {preview}
                  </PreviewStage>
                </div>
              )}
            </div>
            <div className="pg-theme-footer">
              <div className="pg-playback" role="group" aria-label="Demo playback">
                {demo.player && (
                  <Tool
                    icon={demo.status === "playing" ? "pause" : "play"}
                    label={demo.status === "playing" ? "Pause demo" : demo.status === "paused" ? "Resume demo" : "Play demo"}
                    onClick={() => {
                      setMode("preview");
                      if (demo.status === "playing") demo.player?.pause();
                      else demo.player?.play();
                    }}
                  />
                )}
                <Tool icon="replay" label="Replay" onClick={() => {
                  setMode("preview");
                  if (demo.player) demo.player.replay();
                  else setRevision((v) => v + 1);
                }} />
              </div>
              {themePicker}
              {demo.player && demo.status !== "idle" && (
                <p className="pg-demo-status sr-only" role="status">
                  {demo.label} · {demo.status}
                </p>
              )}
            </div>
          </main>
          <aside className="pg-inspector" aria-label="Component properties">
            {inspector}
            {propertyActions}
          </aside>
        </div>
        <div
          className="pg-toast"
          role="status"
          aria-live="polite"
          data-visible={Boolean(copyStatus)}
        >
          {copyStatus}
        </div>
        <ComponentPicker open={picker} setOpen={setPicker} nav={nav} />
        <SharePanel
          open={share}
          setOpen={setShare}
          title={spec.title}
          configuration={configuration}
          code={codeError || code}
          install={install}
          copy={copy}
        />
        <Modal id={themePanelId} open={variationOpen && !wideSettings} onOpenChange={setVariationOpen} title="Theme settings" className="pg-mobile-properties">
          {variationOpen && <VariationPanel />}
        </Modal>
        <Modal
          open={properties}
          onOpenChange={setProperties}
          title="Properties"
          className="pg-mobile-properties pg-properties-dialog"
        >
          {properties && <>{inspector}{propertyActions}</>}
        </Modal>
        <Modal
          open={Boolean(fallback)}
          onOpenChange={(open) => {
            if (!open) setFallback("");
          }}
          title="Copy manually"
          description="Clipboard access is unavailable. Select the text below and copy it."
        >
          <textarea
            className="pg-share-text"
            readOnly
            value={fallback}
            aria-label="Text to copy"
            onFocus={(event) => event.currentTarget.select()}
          />
        </Modal>
      </div>
    </Tooltip.Provider>
  );
}
