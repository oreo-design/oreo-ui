import * as React from "react";
import { Menu as BaseMenu } from "@base-ui-components/react/menu";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { Shortcut } from "@/components/shortcut";
import { menu } from "./menu.variants";
import { PortalContainerContext } from "@/lib/portal-container";

const slots = menu();

export type MenuProps = {
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trap focus and hide outside content from assistive tech while open. */
  modal?: boolean;
  children?: React.ReactNode;
};

/** Root — pairs a `MenuTrigger` with a `MenuPopup`. Renders no DOM itself. */
export function Menu({ defaultOpen, open, onOpenChange, modal, children }: MenuProps) {
  return (
    <BaseMenu.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      modal={modal}
    >
      {children}
    </BaseMenu.Root>
  );
}

export type MenuTriggerProps = React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger>;

/** The element that opens the menu — style it or replace it via `render`. */
export function MenuTrigger(props: MenuTriggerProps) {
  return <BaseMenu.Trigger {...props} />;
}

export type MenuPopupProps = {
  collisionAvoidance?: React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>["collisionAvoidance"];
  /** Optional local portal host to preserve nested theme tokens. */
  container?: React.ComponentPropsWithoutRef<typeof BaseMenu.Portal>["container"];
  /** Which side of the anchor to open on. */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment along the anchor. */
  align?: "start" | "center" | "end";
  /** Gap between anchor and popup. */
  sideOffset?: number;
  className?: string;
  children?: React.ReactNode;
};

/** The floating surface: portal + positioner + the styled popup card. */
export function MenuPopup({ container, collisionAvoidance, side = "bottom", align = "start", sideOffset = 4, className, children }: MenuPopupProps) {
  const previewContainer = React.useContext(PortalContainerContext);
  const portalContainer = container === undefined ? previewContainer ?? undefined : container;
  return (
    <BaseMenu.Portal container={portalContainer}>
      <BaseMenu.Positioner collisionAvoidance={collisionAvoidance} positionMethod={portalContainer ? "fixed" : "absolute"} side={side} align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <BaseMenu.Popup className={cn(slots.popup(), className)}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

type MenuItemBaseProps = {
  /** Leading glyph — an `<Icon>` or brand `<img>`, rendered in a 20px box. */
  icon?: React.ReactNode;
  /** Trailing check — the selected row in a pick-one list. */
  selected?: boolean;
  /** Trailing keyboard shortcut, e.g. `["cmd", "shift", "Q"]`. */
  shortcut?: string[];
  /** Custom trailing content (wins over `selected`/`shortcut`). */
  trailing?: React.ReactNode;
};

export type MenuItemProps = MenuItemBaseProps & React.ComponentPropsWithoutRef<typeof BaseMenu.Item>;

/** One row: optional 20px leading glyph, label, optional trailing affordance. */
export function MenuItem({ icon, selected, shortcut, trailing, className, children, ...rest }: MenuItemProps) {
  return (
    <BaseMenu.Item className={cn(slots.item(), className)} {...rest}>
      {icon != null && <span className={slots.itemIcon()}>{icon}</span>}
      <span className={slots.itemLabel()}>{children}</span>
      <span className={slots.itemTrailing()}>
        {trailing ??
          (selected ? (
            <Icon name="check" size="sm" weight="bold" className="text-[var(--color-text-primary)]" />
          ) : shortcut ? (
            <Shortcut keys={shortcut} size="sm" className="text-[var(--color-text-secondary)]" />
          ) : null)}
      </span>
    </BaseMenu.Item>
  );
}

export type MenuSwitchItemProps = {
  icon?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & Omit<React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>, "checked" | "defaultChecked" | "onCheckedChange">;

/** A row with a trailing toggle; clicking flips it without closing the menu. */
export function MenuSwitchItem({
  icon,
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  children,
  ...rest
}: MenuSwitchItemProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;
  return (
    <BaseMenu.CheckboxItem
      checked={isChecked}
      onCheckedChange={(next) => {
        setInternal(next);
        onCheckedChange?.(next);
      }}
      closeOnClick={false}
      className={cn(slots.item(), className)}
      {...rest}
    >
      {icon != null && <span className={slots.itemIcon()}>{icon}</span>}
      <span className={slots.itemLabel()}>{children}</span>
      <span aria-hidden className="toggle" data-on={isChecked ? "true" : "false"} />
    </BaseMenu.CheckboxItem>
  );
}

export type MenuCheckboxItemProps = MenuSwitchItemProps;

/** Leading checkbox for independent selections. Keyboard behavior belongs to Base UI. */
export function MenuCheckboxItem({
  icon,
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  children,
  ...rest
}: MenuCheckboxItemProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;
  return (
    <BaseMenu.CheckboxItem
      {...rest}
      checked={isChecked}
      onCheckedChange={(next) => {
        setInternal(next);
        onCheckedChange?.(next);
      }}
      closeOnClick={false}
      className={cn(slots.item(), "gap-3", className)}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-control-tiny border border-border-default",
          isChecked && "border-status-success bg-status-success text-bg-base",
        )}
      >
        {isChecked && <Icon name="check" className="size-3" weight="bold" />}
      </span>
      {icon != null && <span className={slots.itemIcon()}>{icon}</span>}
      <span className={slots.itemLabel()}>{children}</span>
    </BaseMenu.CheckboxItem>
  );
}

/** Hairline between row groups. */
export function MenuSeparator({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div role="separator" aria-orientation="horizontal" className={cn(slots.separator(), className)} {...rest} />;
}

export type MenuSubmenuProps = React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuRoot>;

/** Nested menu root — wrap a `MenuSubmenuTrigger` + `MenuPopup`. */
export function MenuSubmenu(props: MenuSubmenuProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export type MenuSubmenuTriggerProps = {
  icon?: React.ReactNode;
  /** Optional source-specific chevron; the shared icon remains the default. */
  trailingIcon?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger>;

/** A row that opens a nested menu; always shows the trailing chevron. */
export function MenuSubmenuTrigger({ icon, trailingIcon, className, children, ...rest }: MenuSubmenuTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger className={cn(slots.item(), className)} {...rest}>
      {icon != null && <span className={slots.itemIcon()}>{icon}</span>}
      <span className={slots.itemLabel()}>{children}</span>
      <span className={slots.itemTrailing()}>
        {trailingIcon ?? <Icon name="chevron-right" size="sm" />}
      </span>
    </BaseMenu.SubmenuTrigger>
  );
}
