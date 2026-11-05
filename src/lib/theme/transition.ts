export type ThemeTransition = {
  run: (commit: () => void, animate: boolean) => void;
  dispose: () => void;
};

export const themeTransitionDuration = 280;

type TransitionHost = {
  canAnimate: () => boolean;
  /** Enable CSS transitions and resolve the current styles before changing tokens. */
  prepare: () => void;
  finish: () => void;
  flush: (commit: () => void) => void;
  /** Resolve the new styles so the transition clock starts before cleanup is scheduled. */
  measure: () => void;
  schedule: (finish: () => void, delay: number) => () => void;
};

/** Actual element properties interpolate; there are no document snapshots or delayed commits. */
export function createThemeTransition(host: TransitionHost): ThemeTransition {
  let generation = 0;
  let cancelCleanup: (() => void) | undefined;
  function cancel() {
    ++generation;
    cancelCleanup?.();
    cancelCleanup = undefined;
  }
  return {
    run(commit, animate) {
      cancel();
      if (!animate || !host.canAnimate()) {
        host.finish();
        commit();
        return;
      }
      // Keep the scope enabled on interruption: CSS retargets from the rendered
      // intermediate values instead of jumping to the previous destination.
      host.prepare();
      host.flush(commit);
      host.measure();
      const request = generation;
      cancelCleanup = host.schedule(() => {
        if (request !== generation) return;
        host.finish();
        cancelCleanup = undefined;
      }, themeTransitionDuration + 50);
    },
    dispose() {
      cancel();
      host.finish();
    },
  };
}

/**
 * DOM host for one element scope: the document root for site Style changes, the
 * playground preview for its property edits. `attribute` enables `transition.css`
 * on that scope for one transition window.
 */
export function createScopedTransition({ scope, attribute, flush }: {
  scope: () => HTMLElement | null;
  attribute: string;
  flush: (commit: () => void) => void;
}): ThemeTransition {
  let active: HTMLElement | null = null;
  const finish = () => {
    active?.removeAttribute(attribute);
    active?.style.removeProperty("--theme-transition-duration");
    active = null;
  };
  return createThemeTransition({
    canAnimate: () => !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    prepare: () => {
      const next = scope();
      if (active !== next) finish();
      active = next;
      if (!active) return;
      active.style.setProperty("--theme-transition-duration", `${themeTransitionDuration}ms`);
      active.setAttribute(attribute, "");
      // Establish the before-change computed styles, including an interrupted transition.
      void active.offsetWidth;
    },
    finish,
    measure: () => { void active?.offsetWidth; },
    schedule: (done, delay) => {
      const timer = window.setTimeout(done, delay);
      return () => window.clearTimeout(timer);
    },
    flush,
  });
}
