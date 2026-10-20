import { useEffect, useState } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import type { DocsNav } from "@/docs/DocsPage";
import type { CustomizeState } from "@/docs/CustomizePanel";
import { ICON_LIBRARIES } from "@/components/icon";
import { CodeBlock } from "@/components/code-block";
import { PropertyControl } from "./PropertyControl";
import {
  defaultsFor,
  resolveControl,
  updateValues,
  select,
  toggle,
  number,
  type PlaygroundSpec,
  type Values,
} from "./schema";
import { withAppearance } from "./exportAppearance";
import { playgroundCode } from "./code";
import { useDemo } from "./useDemo";
import { Glyph, Tool, Modal } from "./Tools";
import { ComponentPicker } from "./ComponentPicker";
import { PreviewStage, partsFor } from "./PreviewStage";
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
type Mode = "preview" | "annotation" | "code" | "inspect" | "compare";
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
  appearance,
  onDocumentation,
  onRemixes,
}: {
  spec: PlaygroundSpec;
  nav: DocsNav;
  breadcrumb: string[];
  appearance: CustomizeState;
  onDocumentation: () => void;
  onRemixes?: () => void;
}) {
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
    [viewport, setViewport] = useState("desktop");
  const [copyStatus, setCopyStatus] = useState(""),
    [error, setError] = useState(initial.error),
    [fallback, setFallback] = useState("");
  const [picker, setPicker] = useState(false),
    [share, setShare] = useState(false),
    [properties, setProperties] = useState(false),
    [selected, setSelected] = useState(0);
  const [presets, setPresets] = useState<Preset[]>([]);
  useEffect(() => {
    const a = initial.configuration?.appearance;
    if (a && !initial.resumed) {
      appearance.setDark(a.dark);
      appearance.setRadius(a.radius);
      appearance.setLibrary(a.library);
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
  // Portaled Oreo controls and the shell share the same semantic theme tokens.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", appearance.dark);
    return () => {
      root.classList.toggle("theme-dark", previous);
    };
  }, [appearance.dark]);
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(""), 2600);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  const demo = useDemo(spec, (patch) =>
    setValues((current) => ({ ...current, ...patch })),
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
        !properties
      ) {
        setMode("preview");
        setSelected(0);
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [share, picker, properties]);
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
    appearance: {
      dark: appearance.dark,
      radius: appearance.radius,
      library: appearance.library,
    },
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
  const fields = (group: string) => (
    <div className="pg-fields">
      {entries
        .filter(([, control]) => (control.group ?? spec.title) === group)
        .map(([key, control]) => (
          <PropertyControl
            key={`${revision}-${key}`}
            name={key}
            control={resolveControl(control, values)}
            value={values[key]}
            onChange={(value) => set(key, value)}
          />
        ))}
    </div>
  );
  const inspector = (
    <div className="pg-inspector-content" data-mode={mode}>
      {mode === "annotation" ? (
        <>
          <p className="pg-muted">Selected part</p>
          <h2>
            {String(selected + 1).padStart(2, "0")}{" "}
            {partsFor(nav.active)[selected]?.name}
          </h2>
          <p className="pg-description">
            {partsFor(nav.active)[selected]?.description}
          </p>
        </>
      ) : (
        <>
          <p className="pg-muted">Description</p>
          <p className="pg-description">
            {descriptionFor(nav.active, spec.title)}
          </p>
          <div className="pg-install">
            <p className="pg-muted">Install</p>
            <div>
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
      {mode !== "annotation" && (
        <div className="pg-row pg-property-heading">
          <h2>Properties</h2>
          <div className="pg-actions">
            <Tool
              label="Randomize properties"
              icon="randomize"
              onClick={() => apply(randomValues(spec, values))}
            />
            <Tool label="Reset properties" icon="reset" onClick={reset} />
          </div>
        </div>
      )}
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
      <details className="pg-disclosure">
        <summary>
          Appearance
          <Glyph name="chevron" />
        </summary>
        <div className="pg-fields">
          <PropertyControl
            name="Dark theme"
            control={toggle()}
            value={appearance.dark}
            onChange={(value) => appearance.setDark(Boolean(value))}
          />
          <PropertyControl
            name="Radius"
            control={number(8, 0, 999)}
            value={appearance.radius}
            onChange={(value) => appearance.setRadius(Number(value))}
          />
          <PropertyControl
            name="Icon library"
            control={select(ICON_LIBRARIES, "phosphor")}
            value={appearance.library}
            onChange={(value) =>
              appearance.setLibrary(value as CustomizeState["library"])
            }
          />
        </div>
      </details>
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
            <Glyph name="logo" />
            <span>{breadcrumb[0] ?? "Components"}</span>
            <span>/</span>
            <strong>{spec.title}</strong>
            <Glyph name="chevron" />
          </button>
          <nav aria-label="Page view">
            <a
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
          <main aria-label={`${spec.title} playground`} className="pg-main">
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
                    "button",
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
                {["desktop", "tablet", "mobile"].map((device) => (
                  <Tool
                    key={device}
                    icon={device}
                    label={device.charAt(0).toUpperCase() + device.slice(1)}
                    active={viewport === device}
                    onClick={() => setViewport(device)}
                  />
                ))}
              </div>
              <span className="pg-divider" />
              <div className="pg-toolgroup">
                <Tool
                  icon="replay"
                  label="Replay"
                  onClick={() => {
                    setMode("preview");
                    if (demo.player) demo.player.replay();
                    else setRevision((v) => v + 1);
                  }}
                />
                <Tool
                  icon="inspect"
                  label="Inspect"
                  active={mode === "inspect"}
                  onClick={() =>
                    changeMode(mode === "inspect" ? "preview" : "inspect")
                  }
                />
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
                {demo.player && (
                  <Tool
                    icon={demo.status === "playing" ? "pause" : "play"}
                    label={
                      demo.status === "playing"
                        ? "Pause demo"
                        : demo.status === "paused"
                          ? "Resume demo"
                          : "Play demo"
                    }
                    onClick={() => {
                      setMode("preview");
                      if (demo.status === "playing") demo.player?.pause();
                      else demo.player?.play();
                    }}
                  />
                )}
              </div>
              <Tool
                className="pg-properties-trigger"
                icon="sliders"
                label="Properties"
                onClick={() => setProperties(true)}
              />
            </div>
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
                      appearance.setDark(preset.appearance.dark);
                      appearance.setRadius(preset.appearance.radius);
                      appearance.setLibrary(preset.appearance.library);
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
                    slug={nav.active}
                    mode={mode}
                    viewport={viewport}
                    selected={selected}
                    onSelect={setSelected}
                    revision={revision}
                  >
                    {preview}
                  </PreviewStage>
                </div>
              )}
            </div>
            {demo.player && demo.status !== "idle" && (
              <p className="pg-demo-status" role="status">
                {demo.label} · {demo.status}
              </p>
            )}
            <footer className="pg-footer" aria-hidden="true">
              {spec.title}
            </footer>
          </main>
          <aside className="pg-inspector" aria-label="Component properties">
            {inspector}
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
        <Modal
          open={properties}
          onOpenChange={setProperties}
          title="Properties"
          className="pg-mobile-properties"
        >
          {properties && inspector}
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
