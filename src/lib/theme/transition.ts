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
