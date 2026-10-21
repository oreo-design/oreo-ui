import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { Dialog } from "@base-ui-components/react/dialog";
import { ArrowLeft, FloppyDisk, Play, Pause, DotsThree, Palette } from "@phosphor-icons/react";
import { Icon, type IconName } from "@/components/icon";

const assets = import.meta.glob<string>("./assets/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
export function Glyph({ name }: { name: string }) {
  const extras = {
    "arrow-left": ArrowLeft,
    "floppy-disk": FloppyDisk,
    play: Play,
    pause: Pause,
    dots: DotsThree,
    palette: Palette,
  };
  const Extra = extras[name as keyof typeof extras];
  if (Extra) return <Extra size={16} aria-hidden="true" />;
  const revised = assets[`./assets/v2-${name}.svg`];
  const asset = revised ?? assets[`./assets/${name}.svg`];
  const intrinsic = revised ? ({ chevron: 12, preview: 14.6667, code: 14.6667, annotation: 14, desktop: 14, tablet: 14, copy: 14, randomize: 16, reset: 16 } as Record<string, number>)[name] : undefined;
  return asset ? (
    <span
      aria-hidden="true"
      className={`pg-glyph pg-glyph-${name}`}
      style={{ maskImage: `url("${asset}")`, ...(intrinsic ? { width: intrinsic, height: intrinsic } : {}) } as CSSProperties}
    />
  ) : (
    <Icon name={name as IconName} size="sm" />
  );
}
export function Tool({
  label,
  icon,
  active,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: string;
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
            className={`pg-tool ${className}`}
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  trigger?: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Backdrop className="pg-backdrop" />
        <Dialog.Viewport className="pg-modal-viewport">
          <Dialog.Popup className={`pg-modal ${className}`}>
            <header className="pg-row">
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Close className="pg-tool" aria-label={`Close ${title}`}>
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
