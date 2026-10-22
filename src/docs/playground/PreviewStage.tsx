import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type SyntheticEvent } from "react";

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
          selector: "button > :first-child[aria-hidden]",
        },
        {
          name: "Label",
          description: "Describe the next action with a short verb.",
          selector: "button > span:not([aria-hidden])",
        },
        {
          name: "Trailing icon",
          description: "Optional; follows the label and inherits its color.",
          selector: "button > :last-child[aria-hidden]",
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
              "The rendered component. Select a visible element in Annotation to see its computed dimensions and styles.",
            selector: ":scope > *",
          },
        ];

export type Measurement = {
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
  onMeasure,
}: {
  children: ReactNode;
  themeStyle?: CSSProperties;
  slug: string;
  mode: "preview" | "annotation";
  viewport: string;
  selected: number;
  onSelect: (index: number, part?: Part) => void;
  onMeasure: (measurement: Measurement | null) => void;
  revision: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const target = useRef<Element | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const selectElement = useRef<(element: Element) => void>(() => {});
  const [markers, setMarkers] = useState<
    { x: number; y: number; index: number }[]
  >([]);
  const parts = partsFor(slug);
  useLayoutEffect(() => {
    const host = frame.current,
      root = content.current;
    if (!host || !root || mode === "preview") {
      setMeasurement(null);
      onMeasure(null);
      return;
    }
    if (selected >= 0) target.current = null;
    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      const element =
        selected >= 0
          ? root.querySelector(parts[selected]?.selector ?? parts[0].selector)
          : target.current && root.contains(target.current)
            ? target.current
            : null;
      const visible = (el: Element) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
      };
      setMarkers(parts.flatMap((part, index) => {
        const el = root.querySelector(part.selector);
        if (!el || !visible(el)) return [];
        const r = el.getBoundingClientRect();
        return [{ index, x: r.x - hostRect.x + host.scrollLeft,
          y: r.y - hostRect.y + host.scrollTop + (index ? r.height + 8 : -12) }];
      }));
      if (!element || !visible(element)) {
        setMeasurement(null);
        onMeasure(null);
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
      const next: Measurement = {
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
      };
      setMeasurement(next);
      onMeasure(next);
    };
    selectElement.current = (clicked) => {
      // Prefer the deepest named part; a container must not swallow its label/icon.
      let element: Element | null = clicked;
      while (element && element !== root) {
        const index = parts.findIndex(part => root.querySelector(part.selector) === element);
        if (index >= 0 && (index > 0 || element === clicked)) {
          target.current = null;
          onSelect(index);
          return;
        }
        element = element.parentElement;
      }
      const picked = clicked.closest("svg") ?? clicked;
      target.current = picked;
      onSelect(-1, {
        name: picked.getAttribute("aria-label") || picked.tagName.toLowerCase(),
        description: "Selected element. Dimensions and styles are measured from the rendered component.",
        selector: "",
      });
      measure();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    resize.observe(root);
    // Coalesce DOM changes; measuring must not form a render/mutation microtask loop.
    let pending = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(measure);
    });
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
      cancelAnimationFrame(pending);
      selectElement.current = () => {};
      window.removeEventListener("resize", measure);
    };
  }, [mode, selected, slug, viewport, revision, onSelect, onMeasure]);

  const select = (event: SyntheticEvent) => {
    if (mode !== "annotation" || !(event.target instanceof Element)) return;
    event.preventDefault();
    event.stopPropagation();
    selectElement.current(event.target);
  };
  const suppress = (event: SyntheticEvent) => {
    if (mode !== "annotation") return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={`pg-stage pg-stage-${mode}`}>
      <div ref={frame} className="pg-frame" data-device={viewport}>
        <div
          ref={content}
          onPointerDownCapture={select}
          onClickCapture={select}
          onDoubleClickCapture={suppress}
          onFocusCapture={event => { if (mode === "annotation") event.stopPropagation(); }}
          onKeyDownCapture={event => {
            if (event.key === "Tab" || event.key === "Escape") return;
            if (event.key === "Enter" || event.key === " ") select(event);
            else suppress(event);
          }}
          onKeyUpCapture={suppress}
          onBeforeInputCapture={suppress}
          onPasteCapture={suppress}
          onDropCapture={suppress}
          onSubmitCapture={suppress}
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
          />
        )}
        {mode === "annotation" &&
          markers.map((marker) => (
            <button
              key={marker.index}
              className="pg-marker"
              style={{ left: marker.x, top: marker.y }}
              onClick={() => {
                onSelect(marker.index);
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
              onClick={() => onSelect(index)}
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

    </div>
  );
}
