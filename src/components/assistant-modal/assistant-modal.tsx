import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { pressSpring, useHidden } from "@/lib/motion";
import { Icon } from "@/components/icon";

export type AssistantModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the launcher. */
  label?: string;
  /** Launcher glyph while closed. */
  icon?: React.ReactNode;
  /**
   * Position within the nearest relative ancestor instead of the viewport —
   * for docs demos and embedded layouts.
   */
  inline?: boolean;
  /** Panel contents — typically Conversation + a composer. */
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

const iconSwap =
  "absolute transition-[scale,opacity,filter] duration-200 ease-out motion-reduce:transition-none";

/**
 * Oreo UI Assistant Modal — the floating chat launcher.
 *
 * A bottom-end launcher button whose glyph blur-swaps to a caret when open,
 * with the chat panel springing up from the button's corner. Bring your own
 * inside: Conversation, Messages, a composer.
 */
export function AssistantModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = "Open assistant",
  icon,
  inline = false,
  children,
  className,
  panelClassName,
}: AssistantModalProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = (next: boolean) => {
    setUncontrolled(next);
    onOpenChange?.(next);
  };
  // The panel springs up out of the launcher's corner.
  const hidden = useHidden({ transform: "translateY(12px) scale(0.92)" });

  return (
    <div className={cn(inline ? "absolute" : "fixed", "bottom-4 end-4 z-50", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={hidden}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={hidden}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className={cn(
              "absolute bottom-full end-0 mb-3 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-clip rounded-3xl",
              "bg-[var(--color-bg-elevated)] shadow-[var(--shadow-panel)]",
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label={open ? "Close assistant" : label}
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        transition={pressSpring}
        onClick={() => setOpen(!open)}
        className={cn(
          "relative grid size-12 place-items-center rounded-full",
          "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]",
          "shadow-[0_8px_24px_rgba(0,0,0,0.18)] outline-none",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]",
        )}
      >
        <span aria-hidden className={cn(iconSwap, open ? "scale-25 opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none")}>
          {icon ?? <Icon name="chat" weight="fill" className="size-6" />}
        </span>
        <span aria-hidden className={cn(iconSwap, open ? "scale-100 opacity-100 blur-none" : "scale-25 opacity-0 blur-[4px]")}>
          <Icon name="chevron-down" weight="bold" className="size-5" />
        </span>
      </motion.button>
    </div>
  );
}
