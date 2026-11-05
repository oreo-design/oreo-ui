import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type SyntheticEvent } from "react";
import { flushSync } from "react-dom";
import { PortalContainerContext } from "@/lib/portal-container";
import { badgeSize, calloutSignature, collectLeaves, idOf, measureCallouts, spacingToken, statusOf, type Box, type Callout, type LeafRef, type SpacingValue, type SpecStatus } from "./spec";
import { SpecLayer } from "./SpecLayer";

export type PreviewDevice = "desktop" | "mobile";
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
  spacing: SpacingValue[];
};
type Tone = Callout & { status: SpecStatus; side: "start" | "end" | "inside" };
/** `subject` keys callouts by what is measured, so a new selection fades in fresh ones. */
type Geometry = { subject: string; rect: Box; callouts: Tone[] };
export type Prediction = Record<string, { status: SpecStatus; lane: number }>;
const sameMarkers = (a: Marker[], b: Marker[]) =>
  a.length === b.length && a.every((m, i) => m.index === b[i].index && Math.abs(m.x - b[i].x) < 0.05 && Math.abs(m.y - b[i].y) < 0.05);
type Marker = { x: number; y: number; index: number };
const spacingUnit = (element: Element) => parseFloat(getComputedStyle(element).getPropertyValue("--spacing")) || 4;

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
  viewport: PreviewDevice;
  selected: number;
  onSelect: (index: number, part?: Part) => void;
  onMeasure: (measurement: Measurement | null) => void;
  revision: number;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const target = useRef<Element | null>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  // Scale status of each callout at the end of the running transition, so its
  // tone moves toward the destination while the measured value is still counting.
  const [predicted, setPredicted] = useState<Prediction | null>(null);
  const [deviceScale, setDeviceScale] = useState(1);
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const element = stage.current;
    const host = element?.parentElement;
    if (!element || !host || viewport !== "mobile") return;
    const fit = () => {
      const style = getComputedStyle(element);
      const width = host.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = host.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setDeviceScale(Math.max(0.1, Math.min(1, width / 391, height / 804)));
    };
    const resize = new ResizeObserver(fit);
    resize.observe(host);
    resize.observe(element);
    fit();
    return () => resize.disconnect();
  }, [viewport]);
  const selectElement = useRef<(element: Element) => void>(() => {});
  const [markers, setMarkers] = useState<Marker[]>([]);
  const parts = partsFor(slug);
  useLayoutEffect(() => {
    const host = frame.current,
      root = content.current;
    if (!host || !root || mode === "preview") {
      setGeometry(null);
      setPredicted(null);
      onMeasure(null);
      return;
    }
    if (selected >= 0) target.current = null;
    // DOM rects include the mockup zoom; overlays and inspector values use the
    // screen's own CSS pixels, including its independent scroll offset.
    const scale = viewport === "mobile" ? deviceScale : 1;
    const localizer = () => {
      const hostRect = host.getBoundingClientRect();
      return (box: Box): Box => ({
        left: (box.left - hostRect.left) / scale + host.scrollLeft,
        right: (box.right - hostRect.left) / scale + host.scrollLeft,
        top: (box.top - hostRect.top) / scale + host.scrollTop,
        bottom: (box.bottom - hostRect.top) / scale + host.scrollTop,
      });
    };
    const visible = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const current = () => {
      const element =
        selected >= 0
          ? root.querySelector(parts[selected]?.selector ?? parts[0].selector)
          : target.current && root.contains(target.current)
            ? target.current
            : null;
      return element && visible(element) ? element : null;
    };
    // Content nodes are found from computed styles once, then only their rects are
    // read per frame. DOM changes other than inline-style animation invalidate it.
    let leaves: LeafRef[] | null = null, leavesFor: Element | null = null;
    const leavesOf = (element: Element) => {
      if (!leaves || leavesFor !== element) {
        leaves = collectLeaves(element);
        leavesFor = element;
      }
      return leaves;
    };
    const subjectOf = (element: Element) => selected >= 0 ? `part-${selected}` : `node-${idOf(element)}`;
    // Geometry runs every frame while anything moves; it only reads layout.
    let signature = "";
    const measureGeometry = (sync: boolean) => {
      // From a frame callback, commit synchronously so the overlay paints in the
      // same frame as the geometry it was measured from, never one frame behind.
      const commit = (update: () => void) => sync ? flushSync(update) : update();
      const toLocal = localizer();
      const nextMarkers = parts.flatMap((part, index) => {
        const el = root.querySelector(part.selector);
        if (!el || !visible(el)) return [];
        const r = toLocal(el.getBoundingClientRect());
        // The container's badge sits beside it, leaving the top edge to the spacing badges.
        // Clamped so a full-width part inside the device screen keeps its badge visible.
        return [index ? { index, x: r.left, y: r.bottom + 8 } : { index, x: Math.max(host.scrollLeft + 2, r.left - 26), y: (r.top + r.bottom) / 2 - 9 }];
      });
      commit(() => setMarkers(previous => sameMarkers(previous, nextMarkers) ? previous : nextMarkers));
      const element = current();
      if (!element) {
        if (signature !== "none") commit(() => setGeometry(null));
        signature = "none";
        return signature;
      }
      const unit = spacingUnit(element);
      const rect = toLocal(element.getBoundingClientRect());
      const subject = subjectOf(element);
      // Vertical distances put their badge beside the part; use the start side, or
      // inside the part's edge, when the end side would leave the visible screen.
      const visibleRight = host.scrollLeft + host.clientWidth;
      const callouts: Tone[] = measureCallouts(element, toLocal, leavesOf(element)).map(c => {
        const reach = 10 + c.lane * 36 + 7 + badgeSize(c.value);
        const side = c.axis === "x" || c.band.right + reach <= visibleRight ? "end"
          : c.band.left - reach >= host.scrollLeft ? "start" : "inside";
        return { ...c, status: statusOf(c, unit), side };
      });
      const next = `${subject}#${rect.left.toFixed(1)},${rect.top.toFixed(1)},${rect.right.toFixed(1)},${rect.bottom.toFixed(1)}#${calloutSignature(callouts)}#${callouts.map(c => c.side).join("")}#${callouts.map(c => c.value.toFixed(2)).join(",")}`;
      if (next !== signature) commit(() => setGeometry({ subject, rect, callouts }));
      signature = next;
      return signature;
    };
    // Token names and the inspector report are resolved once the layout settles.
    const report = () => {
      const element = current();
      if (!element) {
        onMeasure(null);
        return;
      }
      const toLocal = localizer();
      const rect = toLocal(element.getBoundingClientRect()),
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
      const unit = spacingUnit(element);
      onMeasure({
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
        radius: style.borderRadius,
        padding: style.padding,
        gap: style.gap,
        background: style.backgroundColor,
        color: style.color,
        backgroundToken,
        colorToken,
        font: `${style.fontSize} / ${style.lineHeight}`,
        tag: element.tagName.toLowerCase(),
        spacing: measureCallouts(element, toLocal, leavesOf(element)).map(c => ({ id: c.id, label: c.label, value: Math.round(c.value * 10) / 10, token: c.basis === "space" ? spacingToken(c.value, unit) : null, status: statusOf(c, unit) })),
      });
    };
    // Follow CSS transitions, Motion springs and resizes frame by frame until the
    // geometry has been still for a few frames; a cap keeps loops from running on.
    // Each session follows motion for 1.5s after the last trigger, longer while
    // finite animations still run, never past a hard cap; the inspector is
    // refreshed periodically during long motion and once it settles.
    let raf = 0, still = 0, deadline = 0, cap = 0, reported = 0, previous = "", predictPending = false;
    const tick = () => {
      raf = 0;
      if (predictPending) predict();
      const next = measureGeometry(true);
      still = next === previous ? still + 1 : 0;
      previous = next;
      const now = performance.now();
      // Motion's WAAPI animations emit no DOM events; keep following finite ones.
      const moving = root.getAnimations({ subtree: true }).some(animation => {
        const end = animation.effect?.getComputedTiming().endTime;
        return animation.playState === "running" && typeof end === "number" && Number.isFinite(end);
      });
      if (moving) deadline = Math.min(cap, Math.max(deadline, now + 100));
      if ((still < 3 || moving) && now < deadline) {
        raf = requestAnimationFrame(tick);
        if (now - reported > 500) {
          reported = now;
          report();
        }
      } else {
        predictPending = false;
        leaves = null;
        setPredicted(null);
        report();
      }
    };
    const track = () => {
      const now = performance.now();
      if (!raf) {
        cap = now + 5000;
        reported = now;
        raf = requestAnimationFrame(tick);
      }
      deadline = Math.min(cap, now + 1500);
      still = 0;
    };
    // Briefly seek the component's running transitions to their end (synchronously,
    // never painted) to learn where each distance and badge lane lands, then restore
    // their exact progress. Only the previewed component's animations are touched:
    // overlay tone transitions and not-yet-started (pending) animations are left
    // alone, and a pending batch is retried on the next frame.
    let predictedAt: CSSNumberish | null = null;
    function predict() {
      if (predictedAt !== null && predictedAt === document.timeline.currentTime) return;
      predictedAt = document.timeline.currentTime;
      const element = current();
      if (!element || !root) return;
      const animations = [...root.getAnimations({ subtree: true }), ...(portalHost?.getAnimations({ subtree: true }) ?? [])].filter(animation => {
        const end = animation.effect?.getComputedTiming().endTime;
        return animation.playState === "running" && typeof end === "number" && Number.isFinite(end);
      });
      predictPending = animations.some(animation => animation.pending);
      const running = animations.filter(animation => !animation.pending);
      if (!running.length) return;
      const saved = running.map(animation => animation.currentTime);
      try {
        running.forEach(animation => { animation.currentTime = Number(animation.effect!.getComputedTiming().endTime) - 1; });
        const unit = spacingUnit(element);
        setPredicted(Object.fromEntries(measureCallouts(element, localizer(), leavesOf(element))
          .map(c => [c.id, { status: statusOf(c, unit), lane: c.lane }])));
      } finally {
        running.forEach((animation, index) => { animation.currentTime = saved[index]; });
      }
    }
    // Only the component's own transitions matter; overlay tone/entrance and
    // marker hover transitions must not trigger prediction or tracking.
    const fromContent = (event: Event) =>
      event.target instanceof Node && (root.contains(event.target) || Boolean(portalHost?.contains(event.target)));
    const onTransition = (event: Event) => {
      if (!fromContent(event)) return;
      predict();
      track();
    };
    const onMotionEvent = (event: Event) => {
      if (fromContent(event)) track();
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
      setPredicted(null);
      onSelect(-1, {
        name: picked.getAttribute("aria-label") || picked.tagName.toLowerCase(),
        description: "Selected element. Dimensions and styles are measured from the rendered component.",
        selector: "",
      });
      measureGeometry(false);
      track();
    };
    const resize = new ResizeObserver(track);
    resize.observe(host);
    resize.observe(root);
    // DOM changes only schedule the next frame; measuring never mutates the
    // observed subtree, so there is no render/mutation loop.
    const mutations = new MutationObserver(records => {
      if (records.some(record => record.type !== "attributes" || record.attributeName !== "style")) leaves = null;
      track();
    });
    mutations.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    host.addEventListener("transitionrun", onTransition);
    const motionEvents = ["animationstart", "animationend", "transitionend", "transitioncancel"] as const;
    motionEvents.forEach(type => host.addEventListener(type, onMotionEvent));
    host.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    measureGeometry(false);
    report();
    track();
    return () => {
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(raf);
      selectElement.current = () => {};
      host.removeEventListener("transitionrun", onTransition);
      motionEvents.forEach(type => host.removeEventListener(type, onMotionEvent));
      setPredicted(null);
      host.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
    };
  }, [mode, selected, slug, viewport, revision, deviceScale, portalHost, onSelect, onMeasure]);

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
    <div ref={stage} className={`pg-stage pg-stage-${mode}`} data-device={viewport}>
      <div className="pg-device" data-device={viewport} style={{ "--device-scale": deviceScale } as CSSProperties}>
        {viewport === "mobile" && <div className="pg-device-hardware" aria-hidden="true" />}
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
            <PortalContainerContext.Provider value={viewport === "mobile" ? portalHost : null}>
              {children}
            </PortalContainerContext.Provider>
          </div>
          {mode === "preview" && (
            <p className="pg-hint">Click to try the interaction</p>
          )}
          {mode !== "preview" && geometry && (
            <div
              className="pg-selection"
              data-mode={mode}
              style={{
                left: geometry.rect.left,
                top: geometry.rect.top,
                width: geometry.rect.right - geometry.rect.left,
                height: geometry.rect.bottom - geometry.rect.top,
              }}
              aria-hidden="true"
            />
          )}
          {mode === "annotation" && geometry && <SpecLayer subject={geometry.subject} callouts={geometry.callouts} predicted={predicted} />}
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
          <div ref={setPortalHost} className="pg-device-portals" />
        </div>
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
