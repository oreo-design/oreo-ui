import { useRef, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { cn } from "@/lib/cn";
import "./canvas-toolbar.css";
export type CanvasMode = "pan" | "select";
export type CanvasBlockKind = "note" | "task" | "link";
export const CANVAS_BLOCK_KINDS: {
  value: CanvasBlockKind;
  label: string;
  icon: IconName;
}[] = [
  { value: "note", label: "Note", icon: "pencil" },
  { value: "task", label: "Task", icon: "list-checks" },
  { value: "link", label: "Link", icon: "link" },
];
export const clampZoom = (value: number) =>
  Math.min(200, Math.max(10, Number.isFinite(value) ? Math.round(value) : 100));
/** Visible hover/focus label duplicates the accessible button name, so stays out of the accessibility tree. */
function Hint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="canvas-hint">
      {children}
      <span aria-hidden className="canvas-hint-label">
        {label}
      </span>
    </span>
  );
}
export function CanvasZoomMenu({
  value,
  onValueChange,
  onFit,
  disabled = false,
}: {
  value: number;
  onValueChange: (value: number) => void;
  onFit?: () => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const zoom = clampZoom(value);
  return (
    <div ref={host}>
      <Menu>
        <MenuTrigger
          disabled={disabled}
          aria-label={`Zoom: ${zoom}%`}
          render={
            <Button
              type="secondary"
              tapScale={1}
              className="canvas-zoom"
              leadingIcon={<Icon name="search" />}
              trailingIcon={<Icon name="chevron-down" size="sm" />}
            />
          }
        >
          {zoom}%
        </MenuTrigger>
        <MenuPopup container={host} className="min-w-44 transition-none">
          <MenuItem
            disabled={!onFit}
            icon={<Icon name="expand" />}
            onClick={onFit}
          >
            Fit all blocks
          </MenuItem>
          <MenuItem
            disabled={zoom >= 200}
            onClick={() => onValueChange(clampZoom(zoom + 10))}
          >
            Zoom in
          </MenuItem>
          <MenuItem
            disabled={zoom <= 10}
            onClick={() => onValueChange(clampZoom(zoom - 10))}
          >
            Zoom out
          </MenuItem>
          {[25, 50, 75, 95, 100, 150, 200].map((size) => (
            <MenuItem
              key={size}
              selected={zoom === size}
              onClick={() => onValueChange(size)}
            >
              {size}%
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
}
export function CanvasModeControl({
  value,
  onValueChange,
  disabled = false,
}: {
  value: CanvasMode;
  onValueChange: (value: CanvasMode) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label="Canvas mode" className="flex gap-2">
      {(
        [
          { value: "pan", label: "Drag mode", icon: "hand" },
          { value: "select", label: "Cursor mode", icon: "cursor" },
        ] as const
      ).map((mode) => (
        <Hint key={mode.value} label={mode.label}>
          <IconButton
            aria-label={mode.label}
            aria-pressed={value === mode.value}
            type="secondary"
            size="lg"
            shape="rectangle"
            tapScale={1}
            disabled={disabled}
            className="canvas-mode-button"
            icon={<Icon name={mode.icon} />}
            onClick={() => onValueChange(mode.value)}
          />
        </Hint>
      ))}
    </div>
  );
}
export function CanvasAddMenu({
  onAdd,
  disabled = false,
}: {
  onAdd: (kind: CanvasBlockKind) => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host}>
      <Menu>
        <MenuTrigger
          disabled={disabled}
          render={
            <Button
              type="primary"
              tapScale={1}
              className="canvas-add"
              leadingIcon={<Icon name="plus" />}
            />
          }
        >
          Add
        </MenuTrigger>
        <MenuPopup
          container={host}
          align="end"
          className="min-w-44 transition-none"
        >
          {CANVAS_BLOCK_KINDS.map((kind) => (
            <MenuItem
              key={kind.value}
              icon={<Icon name={kind.icon} />}
              onClick={() => onAdd(kind.value)}
            >
              {kind.label}
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
}
export type CanvasToolbarProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  mode: CanvasMode;
  onModeChange: (mode: CanvasMode) => void;
  onFit?: () => void;
  onOrganize?: () => void;
  onAsk?: () => void;
  onAdd?: (kind: CanvasBlockKind) => void;
  onInfo?: () => void;
  disabled?: boolean;
  className?: string;
};
export function CanvasToolbar({
  zoom,
  onZoomChange,
  mode,
  onModeChange,
  onFit,
  onOrganize,
  onAsk,
  onAdd,
  onInfo,
  disabled = false,
  className,
}: CanvasToolbarProps) {
  return (
    <div
      role="group"
      aria-label="Canvas navigation"
      className={cn("canvas-toolbar", className)}
    >
      <CanvasZoomMenu
        value={zoom}
        onValueChange={onZoomChange}
        onFit={onFit}
        disabled={disabled}
      />
      <CanvasModeControl
        value={mode}
        onValueChange={onModeChange}
        disabled={disabled}
      />
      <Hint label="Organize blocks">
        <IconButton
          aria-label="Organize blocks"
          type="secondary"
          size="lg"
          shape="rectangle"
          tapScale={1}
          icon={<Icon name="columns" />}
          disabled={disabled || !onOrganize}
          onClick={onOrganize}
        />
      </Hint>
      <Button
        type="secondary"
        className="canvas-ask"
        tapScale={1}
        leadingIcon={<Icon name="sparkle" className="text-palette-mint-text" />}
        disabled={disabled || !onAsk}
        onClick={onAsk}
      >
        Ask AI
      </Button>
      <CanvasAddMenu
        disabled={disabled || !onAdd}
        onAdd={(kind) => onAdd?.(kind)}
      />
      <Hint label="Canvas information">
        <IconButton
          aria-label="Canvas information"
          type="secondary"
          size="lg"
          shape="rectangle"
          tapScale={1}
          disabled={disabled || !onInfo}
          icon={<Icon name="info" />}
          onClick={onInfo}
        />
      </Hint>
    </div>
  );
}
export type CanvasBlockData = {
  id: string;
  kind: CanvasBlockKind;
  title: string;
  body: string;
  x: number;
  y: number;
  done?: boolean;
};
export function CanvasBlock({
  block,
  selected = false,
  onSelect,
  disabled = false,
}: {
  block: CanvasBlockData;
  selected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const kind = CANVAS_BLOCK_KINDS.find((item) => item.value === block.kind)!;
  return (
    <button
      type="button"
      className="canvas-block"
      data-kind={block.kind}
      aria-label={`Select ${block.title}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
    >
      <span className="mb-5 flex items-center justify-between text-xs text-text-secondary">
        <span className="flex items-center gap-2">
          <Icon name={kind.icon} size="sm" />
          {kind.label}
        </span>
        {block.kind === "task" && (
          <span>{block.done ? "Complete" : "To do"}</span>
        )}
      </span>
      <span className="mb-3 block text-lg font-semibold tracking-tight">
        {block.title}
      </span>
      <span className="canvas-block-body">{block.body}</span>
    </button>
  );
}
