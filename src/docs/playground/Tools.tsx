import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { Dialog } from "@base-ui-components/react/dialog";
import { PlaygroundIcon as Glyph, type PlaygroundIconName } from "@/components/icon";

export function Tool({
  label,
  icon,
  active,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: PlaygroundIconName;
  active?: boolean;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <button
            {...props}
            type="button"
            aria-label={label}
            aria-pressed={active}
            className={`pg-tool oreo-squircle oreo-state-layer ${className}`}
          >
            <Glyph name={icon} />
          </button>
        }
      />
      <Tooltip.Portal>
        <Tooltip.Positioner
          className="pg-tooltip-positioner"
          side="bottom"
          sideOffset={6}
        >
          <Tooltip.Popup role="tooltip" className="pg-tooltip">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
  trigger,
  id,
  finalFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  trigger?: ReactNode;
  id?: string;
  finalFocus?: ComponentProps<typeof Dialog.Popup>["finalFocus"];
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Backdrop className="pg-backdrop" />
        <Dialog.Viewport className="pg-modal-viewport">
          <Dialog.Popup id={id} finalFocus={finalFocus} className={`pg-modal oreo-paper-card oreo-squircle ${className}`}>
            <header className="pg-row">
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Close className="pg-tool oreo-squircle oreo-state-layer" aria-label={`Close ${title}`}>
                <Glyph name="x" />
              </Dialog.Close>
            </header>
            {description && (
              <Dialog.Description className="pg-muted">
                {description}
              </Dialog.Description>
            )}
            {children}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
