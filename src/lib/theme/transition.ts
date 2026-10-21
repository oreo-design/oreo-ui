export type ThemeTransition = {
  run: (commit: () => void, animate: boolean) => void;
  dispose: () => void;
};

type SnapshotTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
};

type TransitionHost = {
  start?: (update: () => void) => SnapshotTransition;
  canAnimate: () => boolean;
  flush: (commit: () => void) => void;
};

/** One document snapshot, including portals. Only the latest requested update may commit. */
export function createThemeTransition(host: TransitionHost): ThemeTransition {
  let generation = 0;
  let active: SnapshotTransition | undefined;
  let pending: (() => void) | undefined;

  function cancel() {
    active?.skipTransition();
    active = undefined;
  }

  return {
    run(commit, animate) {
      const request = ++generation;
      cancel();
      pending = commit;
      const apply = () => {
        if (request !== generation || !pending) return;
        pending = undefined;
        host.flush(commit);
      };
      if (!animate || !host.start || !host.canAnimate()) {
        pending = undefined;
        commit();
        return;
      }
      try {
        const transition = host.start(apply);
        active = transition;
        // A skipped/hidden document rejects ready; the update must still complete.
        void transition.ready.catch(() => {});
        void transition.finished.catch(() => {}).then(() => {
          if (active === transition) active = undefined;
        });
      } catch {
        apply();
      }
    },
    dispose() {
      ++generation;
      cancel();
      const commit = pending;
      pending = undefined;
      // Cleanup may run during a React commit, where flushSync is inappropriate.
      commit?.();
    },
  };
}
