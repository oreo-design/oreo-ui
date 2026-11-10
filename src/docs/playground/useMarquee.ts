import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { flushSync } from "react-dom";
import type { Box } from "./spec";
import { inspect, localizer, measureMarquee, onComponent, pastThreshold, rectFrom, revealed, structuralChange, visibleBottom, type Inspection, type MarqueeGeometry, type Point } from "./marquee";

/** `floor`: lowest visible y of the canvas, so the size label can stay in view. */
export type MarqueeView = { rect: Box; geometry: MarqueeGeometry | null; leaving: boolean; floor: number };
/** Fade-out after release; matches the `.pg-marquee` opacity transition. Reduced motion removes it in CSS. */
const LEAVE_MS = 160;

/**
 * Drag across empty canvas in Preview to read the spec of whatever the rectangle
 * touches. A press on the component keeps its own interaction; Option/Alt-drag
 * starts a marquee anywhere, including over a component that fills the canvas.
 * Touch is left to native scrolling. Values follow motion every frame while held.
 */
export function useMarquee(enabled: boolean, frame: RefObject<HTMLDivElement | null>, content: RefObject<HTMLDivElement | null>, scale: number) {
  const [view, setView] = useState<MarqueeView | null>(null);
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const stop = useRef<(() => void) | null>(null);
  const leaveTimer = useRef(0);

  useEffect(() => () => {
    stop.current?.();
    window.clearTimeout(leaveTimer.current);
  }, []);
  useEffect(() => {
    if (enabled) return;
    stop.current?.();
    window.clearTimeout(leaveTimer.current);
    setView(null);
  }, [enabled]);

  /**
   * The one decision about who owns a press. React bubbles portal events through
   * the component tree, so containment is checked in the DOM: a popup portaled to
   * `document.body` is never canvas, even though its events reach the frame.
   */
  const claims = (event: ReactPointerEvent) => {
    const host = frame.current;
    if (!enabled || !host || event.button !== 0 || !event.isPrimary || event.pointerType === "touch") return false;
    if (!(event.target instanceof Node) || !host.contains(event.target)) return false;
    return event.altKey || !onComponent(event.target);
  };

  const begin = (event: ReactPointerEvent) => {
    const host = frame.current;
    if (!host || !content.current) return;
    stop.current?.();
    const toPoint = (clientX: number, clientY: number): Point => {
      const local = localizer(host, scaleRef.current)({ left: clientX, right: clientX, top: clientY, bottom: clientY });
      return { x: local.left, y: local.top };
    };
    // The start is kept in content coordinates, so scrolling the device screen
    // mid-drag stretches the rectangle instead of moving its anchor.
    const start = toPoint(event.clientX, event.clientY);
    const pointerId = event.pointerId;
    let client = { x: event.clientX, y: event.clientY };
    let state: "pending" | "active" | "cancelled" = "pending";
    let raf = 0, inspection: Inspection | null = null, signature = "", root: Element | null = null;
    try { host.setPointerCapture(pointerId); } catch { /* Pointer already released. */ }

    // Structural changes (a demo step, a toggled property) need fresh styles.
    const mutations = new MutationObserver(records => {
      if (structuralChange(records)) inspection = null;
    });
    const tick = () => {
      raf = requestAnimationFrame(tick);
      // Reset/Apply remount the preview (`key={revision}`): follow the new node.
      const current = content.current;
      if (!current) return;
      if (current !== root) {
        root = current;
        inspection = null;
        mutations.disconnect();
        mutations.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });
      }
      if (inspection && revealed(inspection)) inspection = null;
      inspection ??= inspect(root);
      const rect = rectFrom(start, toPoint(client.x, client.y));
      const geometry = measureMarquee(inspection, rect, localizer(host, scaleRef.current));
      const floor = visibleBottom(host, scaleRef.current);
      const next = JSON.stringify([rect, geometry, floor]);
      if (next === signature) return;
      signature = next;
      // Commit in the frame it was measured in, so the lens never trails the pointer.
      flushSync(() => setView({ rect, geometry, leaving: false, floor }));
    };
    const preventSelection = (e: Event) => e.preventDefault();
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || state !== "pending") {
        if (e.pointerId === pointerId) client = { x: e.clientX, y: e.clientY };
        return;
      }
      client = { x: e.clientX, y: e.clientY };
      if (!pastThreshold(start, toPoint(client.x, client.y))) return;
      state = "active";
      // A previous marquee may still be fading; this one replaces it.
      window.clearTimeout(leaveTimer.current);
      host.dataset.marquee = "";
      window.getSelection()?.removeAllRanges();
      tick();
    };
    const finish = () => {
      cancelAnimationFrame(raf);
      mutations.disconnect();
      delete host.dataset.marquee;
      document.removeEventListener("selectstart", preventSelection, true);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
      host.removeEventListener("lostpointercapture", end);
      window.removeEventListener("keydown", escape, true);
      try { host.releasePointerCapture(pointerId); } catch { /* Already released. */ }
      stop.current = null;
    };
    const fadeOut = () => {
      setView(current => current && { ...current, leaving: true });
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setView(null), LEAVE_MS);
    };
    function end(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      const wasActive = state === "active";
      finish();
      if (wasActive) fadeOut();
    }
    // Escape cancels a running marquee but keeps the press (and pointer capture)
    // until release, so letting go over the component cannot click it.
    function escape(e: KeyboardEvent) {
      if (e.key !== "Escape" || state !== "active") return;
      e.preventDefault();
      e.stopPropagation();
      state = "cancelled";
      cancelAnimationFrame(raf);
      mutations.disconnect();
      fadeOut();
    }
    document.addEventListener("selectstart", preventSelection, true);
    // Window listeners still end the press if capture could not be taken or is lost.
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", end, true);
    host.addEventListener("lostpointercapture", end);
    window.addEventListener("keydown", escape, true);
    stop.current = () => {
      finish();
      setView(null);
    };
  };

  return {
    view,
    claims,
    /** Empty canvas: start without touching the component's own press handling. */
    onFramePointerDown(event: ReactPointerEvent) {
      // Option/Alt over the component was already taken (and stopped) in capture.
      if (event.defaultPrevented || !claims(event)) return;
      begin(event);
    },
    /** Option/Alt over the component: the press belongs to the marquee, not the component. */
    onContentPointerDownCapture(event: ReactPointerEvent) {
      if (!event.altKey || !claims(event)) return false;
      event.preventDefault();
      event.stopPropagation();
      begin(event);
      return true;
    },
  };
}
