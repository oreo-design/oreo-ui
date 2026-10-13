import * as React from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { SettingsAppearanceProvider } from "./appearance";
import { SettingsNav } from "./SettingsNav";
import { settingsShell } from "./settings.variants";
import type { SettingsAppearance, SettingsNavGroup } from "./types";
import "./settings.css";

export type SettingsShellProps = {
  appearance: SettingsAppearance;
  groups: SettingsNavGroup[];
  active: string;
  onNavigate: (id: string) => void;
  /**
   * Identity of the current content — page slug. Changing it slides the fresh
   * page in and resets the scroll position.
   */
  contentKey: string;
  children: React.ReactNode;
  /** Opt-in derivative: narrow gutters and a navigation bar clear of content. */
  adaptiveContent?: boolean;
};

/**
 * The settings frame: nav rail + scrollable content panel, laid out by the
 * `scheme` axis. In the `drawer` scheme (and whenever the container is too
 * narrow for a rail) the nav collapses behind a hamburger and slides in as an
 * overlay — the same drawer serves as the pattern's responsive behavior.
 */
export function SettingsShell({ appearance, groups, active, onNavigate, contentKey, children, adaptiveContent = false }: SettingsShellProps) {
  const { scheme } = appearance;
  const slots = settingsShell({ scheme });
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);
  const scroller = React.useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const drawerOnly = scheme === "drawer";

  React.useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  // The drawer is gone once a rail scheme is picked; don't leave it open.
  React.useEffect(() => {
    if (!drawerOnly) setDrawerOpen(false);
  }, [drawerOnly]);

  const navigate = (id: string) => {
    setDrawerOpen(false);
    onNavigate(id);
  };

  const nav = <SettingsNav groups={groups} active={active} onNavigate={navigate} />;
  const trigger = <Dialog.Trigger render={<IconButton
    type="tertiary"
    size="sm"
    shape="rectangle"
    className="oreo-squircle [--squircle-radius:var(--radius-control)]"
    aria-label="Open settings navigation"
    aria-expanded={drawerOpen}
    icon={<Icon name="list" weight="light" />}
  />} />;

  return (
    <SettingsAppearanceProvider value={appearance}>
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div ref={root} className={cn(slots.root(), "@container")} data-scheme={scheme}>
        {!drawerOnly && <aside className={cn(slots.nav(), "hidden @2xl:flex")}>{nav}</aside>}

        {/* Hamburger — the only way in when the rail is hidden. */}
        {!adaptiveContent && <div className={cn("absolute left-3 top-3 z-10", drawerOnly ? "" : "@2xl:hidden")}>{trigger}</div>}

        <main ref={scroller} className={slots.content()}>
          {adaptiveContent && <div data-settings-navigation-bar className={cn("sticky top-0 z-10 flex h-10 items-center gap-2 border-b-[0.5px] border-[var(--settings-hairline)] bg-[var(--settings-content-bg)] px-3 text-[13px] text-[var(--color-text-secondary)]", drawerOnly ? "" : "@2xl:hidden")}>
            {trigger}<span>Settings</span>
          </div>}
          <motion.div
            key={contentKey}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.25, ease: easeOut }}
            className={cn(slots.column(), adaptiveContent && "px-4 @lg:px-8 pt-2", adaptiveContent && !drawerOnly && "@2xl:pt-12")}
          >
            {children}
          </motion.div>
        </main>

        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="absolute inset-0 z-20 bg-[var(--color-overlay-subtle)] transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
          <Dialog.Popup
            aria-label="Settings navigation"
            className="settings-navigation-dialog absolute inset-y-0 left-0 z-30 flex w-[260px] flex-col bg-[var(--settings-nav-bg)] shadow-[var(--shadow-overlay)] outline-none"
          >
            {nav}
          </Dialog.Popup>
        </Dialog.Portal>
      </div>
      </Dialog.Root>
    </SettingsAppearanceProvider>
  );
}
