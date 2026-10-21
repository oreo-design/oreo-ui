import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type Part = { name: string; description: string; selector: string };
export const partsFor = (slug: string): Part[] =>
  slug === "button"
    ? [
        {
          name: "Container",
          description:
            "Owns the hit target, emphasis, focus ring and press feedback.",
          selector: "button",
        },
        {
          name: "Leading icon",
          description:
            "Optional; inherits the label color and stays the same size.",
          selector: "button > svg:first-child",
        },
        {
          name: "Label",
          description: "Describe the next action with a short verb.",
          selector: "button > span",
        },
      ]
    : slug === "prompt-box"
      ? [
          {
            name: "Container",
            description:
              "Groups the composer, actions and context into one surface.",
            selector: ":scope > *",
          },
          {
            name: "Prompt",
            description:
              "Editable prompt text. Enter submits; Shift + Enter adds a line.",
            selector: "textarea",
          },
          {
            name: "Actions",
            description:
              "Submit or stop the current response; unavailable actions stay disabled.",
            selector: "button[aria-label='Send'], button[aria-label='Stop']",
          },
        ]
      : [
          {
            name: "Container",
            description:
              "The rendered component. Select a visible element in Inspect to see its computed dimensions and styles.",
            selector: ":scope > *",
          },
        ];

type Measurement = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
  padding: string;
  gap: string;
  background: string;
  color: string;
  backgroundToken: string;
  colorToken: string;
  font: string;
  tag: string;
};
export function PreviewStage({
  children,
  themeStyle,
  slug,
  mode,
  viewport,
  selected,
  onSelect,
  revision,
}: {
  children: ReactNode;
  themeStyle?: CSSProperties;
  slug: string;
  mode: "preview" | "annotation" | "inspect";
  viewport: string;
  selected: number;
  onSelect: (index: number) => void;
  revision: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const target = useRef<Element | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [locked, setLocked] = useState(false);
  const [markers, setMarkers] = useState<
    { x: number; y: number; index: number }[]
  >([]);
  const parts = partsFor(slug);
  useLayoutEffect(() => {
    const host = frame.current,
      root = content.current;
    if (!host || !root || mode === "preview") {
      setMeasurement(null);
      return;
    }
    target.current = null;
    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      const element =
        mode === "annotation"
          ? root.querySelector(parts[selected]?.selector ?? parts[0].selector)
          : target.current && root.contains(target.current)
            ? target.current
            : root.firstElementChild;
      if (!element) {
        setMeasurement(null);
        return;
      }
      const rect = element.getBoundingClientRect(),
        style = getComputedStyle(element);
      // Resolve known semantic colors in the same themed host; show raw values
      // when no matching token exists rather than claiming an inferred token.
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none";
      host.append(probe);
      const tokenFor = (value: string, names: string[]) =>
        names.find((name) => {
          probe.style.color = `var(--color-${name})`;
          return getComputedStyle(probe).color === value;
        }) ?? value;
      const backgroundToken = tokenFor(style.backgroundColor, [
        "bg-inverse",
        "bg-elevated",
        "bg-base",
        "bg-surface",
        "state-press",
        "state-hover",
      ]);
      const colorToken = tokenFor(style.color, [
        "text-primary",
        "text-secondary",
        "text-tertiary",
        "text-on-inverse",
        "text-disabled",
        "status-error",
      ]);
      probe.remove();
      setMeasurement({
        x: rect.x - hostRect.x + host.scrollLeft,
        y: rect.y - hostRect.y + host.scrollTop,
        width: rect.width,
        height: rect.height,
        radius: style.borderRadius,
        padding: style.padding,
        gap: style.gap,
        background: style.backgroundColor,
        color: style.color,
        backgroundToken,
        colorToken,
        font: `${style.fontSize} / ${style.lineHeight}`,
        tag: element.tagName.toLowerCase(),
      });
      setMarkers(
        parts.flatMap((part, index) => {
          const el = root.querySelector(part.selector);
          if (!el) return [];
          const r = el.getBoundingClientRect();
          return [
            {
              index,
              x: r.x - hostRect.x + host.scrollLeft,
              y:
                r.y -
                hostRect.y +
                host.scrollTop +
                (index ? r.height + 8 : -12),
            },
          ];
        }),
      );
    };
    const click = (event: MouseEvent) => {
      if (mode !== "inspect" || !(event.target instanceof Element)) return;
      event.preventDefault();
      event.stopPropagation();
      target.current = event.target;
      measure();
    };
    root.addEventListener("click", click, true);
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    resize.observe(root);
    const mutations = new MutationObserver(measure);
    mutations.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      resize.disconnect();
      mutations.disconnect();
      root.removeEventListener("click", click, true);
      window.removeEventListener("resize", measure);
    };
  }, [mode, selected, slug, viewport, revision]);

  return (
    <div className={`pg-stage pg-stage-${mode}`}>
      <div ref={frame} className="pg-frame" data-device={viewport}>
        {mode === "inspect" && (
          <div className="pg-ruler" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} style={{ left: i * 100 }}>
                {i * 100}
              </span>
            ))}
          </div>
        )}
        <div
          ref={content}
          inert={mode === "annotation"}
          className="pg-preview" style={themeStyle}
          key={revision}
        >
          {children}
        </div>
        {mode === "preview" && (
          <p className="pg-hint">Click to try the interaction</p>
        )}
        {mode !== "preview" && measurement && (
          <div
            className="pg-selection"
            data-mode={mode}
            style={{
              left: measurement.x,
              top: measurement.y,
              width: measurement.width,
              height: measurement.height,
            }}
            aria-hidden="true"
          >
            {mode === "inspect" && (
              <span>
                {Math.round(measurement.width)} ×{" "}
                {Math.round(measurement.height)}
              </span>
            )}
          </div>
        )}
        {mode === "annotation" &&
          markers.map((marker) => (
            <button
              key={marker.index}
              className="pg-marker"
              style={{ left: marker.x, top: marker.y }}
              onClick={() => {
                onSelect(marker.index);
                setLocked(true);
              }}
              aria-label={`Select ${parts[marker.index].name}`}
              aria-pressed={selected === marker.index}
            >
              {marker.index + 1}
            </button>
          ))}
      </div>
      {mode === "annotation" && (
        <div className="pg-anatomy">
          {parts.map((part, index) => (
            <button
              key={part.name}
              className="pg-card oreo-squircle oreo-state-layer"
              aria-pressed={selected === index}
              onMouseEnter={() => {
                if (!locked) onSelect(index);
              }}
              onFocus={() => {
                if (!locked) onSelect(index);
              }}
              onClick={() => {
                onSelect(index);
                setLocked(true);
              }}
            >
              <strong>
                {String(index + 1).padStart(2, "0")} · {part.name}
                {!markers.some((marker) => marker.index === index)
                  ? " (hidden)"
                  : ""}
              </strong>
              <p>{part.description}</p>
            </button>
          ))}
        </div>
      )}
      {mode === "inspect" && (
        <>
          <div className="pg-inspect-details">
            <section className="pg-card oreo-squircle">
              <strong>{measurement?.tag ?? "Select an element"}</strong>
              <p>
                Height {Math.round(measurement?.height ?? 0)} · Radius{" "}
                {measurement?.radius}
                <br />
                Padding {measurement?.padding} · Gap {measurement?.gap}
              </p>
            </section>
            <section className="pg-card oreo-squircle">
              <strong>Semantic styles</strong>
              <p>
                {measurement?.backgroundToken} / {measurement?.colorToken}
                <br />
                Text {measurement?.font} · Values from the rendered component.
              </p>
            </section>
          </div>
          <p className="pg-hint">
            Select an element to see its bounds. Escape returns to Preview.
          </p>
        </>
      )}
    </div>
  );
}
