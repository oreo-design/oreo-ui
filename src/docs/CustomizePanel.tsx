import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Slider, Segmented } from "./primitives";
import { Icon, ICON_LIBRARIES, ICON_WEIGHTS, type IconLibrary, type IconWeight } from "@/components/icon";

export type CustomizeState = {
  dark: boolean;
  setDark: (v: boolean) => void;
  radius: number;
  setRadius: (v: number) => void;
  bounce: number;
  setBounce: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
  tapScale: number;
  setTapScale: (v: number) => void;
  library: IconLibrary;
  setLibrary: (v: IconLibrary) => void;
  weight: IconWeight;
  setWeight: (v: IconWeight) => void;
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between text-[13px]"
    >
      <span>{label}</span>
      <span className="toggle" data-on={checked} />
    </button>
  );
}

export function CustomizePanel(s: CustomizeState) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) panel.current?.focus();
    else if (wasOpen.current) trigger.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.div
            key="panel"
            ref={panel}
            id={id}
            role="region"
            aria-label="Appearance controls"
            tabIndex={-1}
            onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            style={{ transformOrigin: "bottom right" }}
            className="w-72 max-w-[calc(100vw-3rem)] max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <Icon name="sliders" size="sm" /> Appearance
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close appearance"
                className="grid size-6 place-items-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]"
              >
                <Icon name="x" className="size-3" />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Theme &amp; shape
                </div>
                <Toggle checked={s.dark} onChange={s.setDark} label="Dark theme" />
                <Slider label="radius" value={s.radius} min={0} max={999} step={1} onChange={s.setRadius} suffix="px" />
              </div>

              <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Press spring
                </div>
                <Slider label="bounce" value={s.bounce} min={0} max={1} step={0.05} onChange={s.setBounce} />
                <Slider label="duration" value={s.duration} min={0.1} max={1} step={0.05} onChange={s.setDuration} suffix="s" />
                <Slider label="tapScale" value={s.tapScale} min={0.8} max={1} step={0.01} onChange={s.setTapScale} />
              </div>

              <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Icon
                </div>
                <Segmented label="library" value={s.library} options={ICON_LIBRARIES} onChange={s.setLibrary} />
                {/* Lucide is stroke-only, so its weight menu is shorter. */}
                <Segmented label="weight" value={s.weight} options={ICON_WEIGHTS[s.library]} onChange={s.setWeight} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            ref={trigger}
            aria-controls={id}
            aria-expanded={open}
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-4 py-2.5 text-[13px] font-medium text-[var(--color-text-primary)]"
          >
            <Icon name="sliders" size="sm" /> Appearance
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
