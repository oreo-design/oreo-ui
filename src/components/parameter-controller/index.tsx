import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { Icon, type IconName } from "@/components/icon";
import { IconButton } from "@/components/button";
import {
  bounded,
  validHex,
  DEFAULT_SHADOWS,
  type Point,
  type ShadowLayer,
} from "./model";
import "./parameter-controller.css";
export * from "./model";
const surface = "oreo-squircle";
export function ParameterIconButton({
  label,
  icon,
  onClick,
  disabled = false,
  className = "",
}: {
  label: string;
  icon: IconName;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <IconButton
      type="tertiary"
      size="md"
      tapScale={1}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`pc-icon-button ${className}`}
      onClick={onClick}
      icon={<Icon name={icon} />}
    />
  );
}
export function ParameterCard({
  label,
  children,
  className = "",
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`pc-card ${surface} ${className}`}
      data-disabled={disabled || undefined}
    >
      <div className="pc-label">{label}</div>
      {children}
    </div>
  );
}
export interface NumberParameterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  compact?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}
export function NumberParameter({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unit = "px",
  disabled = false,
  compact = false,
  onEditStart,
  onEditEnd,
}: NumberParameterProps) {
  const [draft, setDraft] = useState(String(value));
  const id = useId();
  const drag = useRef<{ id: number; y: number; value: number } | null>(null);
  useEffect(() => setDraft(String(value)), [value]);
  const change = (v: number) => onChange(bounded(v, min, max, step));
  const finish = () => {
    const next =
      draft.trim() !== "" && Number.isFinite(Number(draft))
        ? bounded(Number(draft), min, max, step)
        : value;
    setDraft(String(next));
    if (next !== value) onChange(next);
    onEditEnd?.();
  };
  const input = (
    <input
      id={id}
      className="pc-number-input oreo-focus"
      aria-label={label}
      type="number"
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={draft}
      onFocus={onEditStart}
      onChange={(e) => {
        setDraft(e.target.value);
        if (
          e.target.value.trim() !== "" &&
          Number.isFinite(Number(e.target.value))
        )
          change(Number(e.target.value));
      }}
      onBlur={finish}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(String(value));
          e.currentTarget.blur();
        }
      }}
    />
  );
  if (compact)
    return (
      <label
        className={`pc-inline-number ${surface}`}
        data-disabled={disabled || undefined}
      >
        <span>{label}</span>
        {input}
        <span>{unit}</span>
      </label>
    );
  return (
    <ParameterCard label={label} disabled={disabled}>
      <div className="pc-value-row">
        {input}
        <span className="pc-unit">{unit}</span>
        <div
          role="slider"
          aria-orientation="vertical"
          tabIndex={disabled ? -1 : 0}
          aria-label={`${label} 旋钮`}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={`${value} ${unit}`}
          aria-disabled={disabled}
          className="pc-knob oreo-focus"
          onPointerDown={(e) => {
            if (disabled || drag.current || e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.focus();
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { id: e.pointerId, y: e.clientY, value };
            onEditStart?.();
          }}
          onPointerMove={(e) => {
            if (drag.current?.id === e.pointerId)
              change(drag.current.value + (drag.current.y - e.clientY) * step);
          }}
          onPointerUp={(e) => {
            if (drag.current?.id === e.pointerId) {
              drag.current = null;
              onEditEnd?.();
            }
          }}
          onPointerCancel={() => {
            drag.current = null;
            onEditEnd?.();
          }}
          onLostPointerCapture={() => {
            if (drag.current) {
              drag.current = null;
              onEditEnd?.();
            }
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            let n: number | undefined;
            if (["ArrowUp", "ArrowRight"].includes(e.key))
              n = value + step * (e.shiftKey ? 10 : 1);
            if (["ArrowDown", "ArrowLeft"].includes(e.key))
              n = value - step * (e.shiftKey ? 10 : 1);
            if (e.key === "Home") n = min;
            if (e.key === "End") n = max;
            if (n !== undefined) {
              e.preventDefault();
              change(n);
            }
          }}
        >
          <span
            style={{
              transform: `rotate(${((value - min) / (max - min || 1) - 0.5) * 270}deg)`,
            }}
          />
        </div>
      </div>
    </ParameterCard>
  );
}
export function ColorParameter({
  label,
  value,
  onChange,
  opacity,
  onOpacityChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  opacity?: number;
  onOpacityChange?: (value: number) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <ParameterCard label={label} disabled={disabled} className="pc-color-card">
      <div className="pc-value-row">
        {onOpacityChange ? (
          <button
            type="button"
            className="pc-color-text pc-opacity-toggle oreo-focus"
            aria-label={`${label}透明度设置`}
            aria-expanded={open}
            aria-controls={id}
            disabled={disabled}
            onClick={() => setOpen(!open)}
          >{`rgb(${parseInt(value.slice(1, 3), 16)} ${parseInt(value.slice(3, 5), 16)} ${parseInt(value.slice(5, 7), 16)} / ${(opacity ?? 100) / 100})`}</button>
        ) : (
          <input
            className="pc-color-text oreo-focus"
            aria-label={`${label} HEX`}
            value={draft}
            disabled={disabled}
            onChange={(e) => {
              setDraft(e.target.value);
              if (validHex(e.target.value)) onChange(e.target.value);
            }}
            onBlur={() => setDraft(value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape")
                e.currentTarget.blur();
            }}
          />
        )}
        <label className="pc-swatch oreo-focus-proxy" style={{ color: value }}>
          <span
            style={{ backgroundColor: value, opacity: (opacity ?? 100) / 100 }}
          />
          <input
            type="color"
            aria-label={`${label}取色器`}
            value={validHex(value) ? value : "#000000"}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
      {onOpacityChange && (
        <>
          {open && (
            <label id={id} className="pc-opacity">
              <span>透明度</span>
              <input
                aria-label={`${label}透明度`}
                type="range"
                min={0}
                max={100}
                disabled={disabled}
                value={opacity ?? 100}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
              />
            </label>
          )}
        </>
      )}
    </ParameterCard>
  );
}
export function ToggleParameter({
  label,
  checked,
  onChange,
  disabled = false,
  onLabel = "开",
  offLabel = "关",
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <ParameterCard label={label} disabled={disabled}>
      <div className="pc-value-row">
        <span className="pc-value">{checked ? onLabel : offLabel}</span>
        <BaseSwitch.Root
          className="pc-power oreo-state-layer oreo-focus"
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-label={label}
        >
          <Icon name="power" size="lg" />
        </BaseSwitch.Root>
      </div>
    </ParameterCard>
  );
}
export type ParameterOption = { value: string; label: string };
export function SelectParameter({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly ParameterOption[];
  disabled?: boolean;
}) {
  return (
    <ParameterCard label={label} disabled={disabled}>
      <div className="pc-value-row pc-select-wrap">
        <select
          className="pc-select oreo-focus"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || !options.length}
        >
          {options.length ? (
            options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          ) : (
            <option value="">暂无选项</option>
          )}
        </select>
        <Icon name="chevron-down" size="sm" />
      </div>
    </ParameterCard>
  );
}
export interface XYParameterProps {
  label?: string;
  value: Point;
  onChange: (value: Point) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  compact?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}
export function XYParameter({
  label = "二维控制",
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  disabled = false,
  compact = false,
  onEditStart,
  onEditEnd,
}: XYParameterProps) {
  const dragging = useRef<number | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const ratio = (v: number) =>
    ((bounded(v, min, max, step) - min) / (max - min || 1)) * 100;
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onChange({
      x: bounded(
        min + ((e.clientX - r.left) / r.width) * (max - min),
        min,
        max,
        step,
      ),
      y: bounded(
        min + ((e.clientY - r.top) / r.height) * (max - min),
        min,
        max,
        step,
      ),
    });
  };
  const pad = (
    <div
      ref={host}
      aria-disabled={disabled}
      className={`pc-pad ${surface}`}
      data-disabled={disabled || undefined}
      role="group"
      aria-label={`${label}坐标区域`}
      onPointerDown={(e) => {
        if (disabled || dragging.current !== null || e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = e.pointerId;
        onEditStart?.();
        move(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current === e.pointerId) move(e);
      }}
      onPointerUp={(e) => {
        if (dragging.current === e.pointerId) {
          dragging.current = null;
          onEditEnd?.();
        }
      }}
      onPointerCancel={() => {
        dragging.current = null;
        onEditEnd?.();
      }}
      onLostPointerCapture={() => {
        if (dragging.current !== null) {
          dragging.current = null;
          onEditEnd?.();
        }
      }}
    >
      <span className="pc-axis-y">Y</span>
      <span className="pc-axis-x">X</span>
      <i className="pc-cross-x" />
      <i className="pc-cross-y" />
      <span
        className="pc-point"
        style={{ left: `${ratio(value.x)}%`, top: `${ratio(value.y)}%` }}
      >
        <i />
      </span>
    </div>
  );
  return (
    <div className={compact ? "pc-xy-compact" : `pc-xy pc-card ${surface}`}>
      <div className={compact ? "sr-only" : "pc-label"}>{label}</div>
      {pad}
      <div hidden={compact} className="pc-grid pc-coordinates">
        <NumberParameter
          compact
          label={`${label} X`}
          value={value.x}
          min={min}
          max={max}
          step={step}
          unit={unit}
          disabled={disabled}
          onChange={(x) => onChange({ ...value, x })}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />
        <NumberParameter
          compact
          label={`${label} Y`}
          value={value.y}
          min={min}
          max={max}
          step={step}
          unit={unit}
          disabled={disabled}
          onChange={(y) => onChange({ ...value, y })}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />
      </div>
    </div>
  );
}
export function ShadowParameter({
  value = DEFAULT_SHADOWS,
  onChange,
  disabled = false,
  onEditStart,
  onEditEnd,
}: {
  value: readonly ShadowLayer[];
  onChange: (value: ShadowLayer[]) => void;
  disabled?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}) {
  const [selected, setSelected] = useState(value[0]?.id ?? "");
  const layer = value.find((l) => l.id === selected) ?? value[0];
  const update = (patch: Partial<ShadowLayer>) => {
    if (layer)
      onChange(value.map((l) => (l.id === layer.id ? { ...l, ...patch } : l)));
  };
  const add = () => {
    const id = `shadow-${crypto.randomUUID()}`;
    onChange([...value, { ...DEFAULT_SHADOWS[0], id }]);
    setSelected(id);
  };
  return (
    <div className={`pc-shadow pc-card ${surface}`}>
      <div className="pc-label">阴影</div>
      <div className="pc-shadow-tabs">
        <label className={`pc-layer-select ${surface}`}>
          <Icon name="copy" />
          <select
            aria-label="阴影图层"
            disabled={disabled || !value.length}
            value={layer?.id ?? ""}
            onChange={(e) => setSelected(e.target.value)}
          >
            {value.length ? (
              value.map((l, i) => (
                <option key={l.id} value={l.id}>
                  {i + 1}
                </option>
              ))
            ) : (
              <option value="">无</option>
            )}
          </select>
          <Icon name="chevron-down" size="sm" />
        </label>
        <ParameterIconButton
          label="添加阴影"
          icon="plus"
          onClick={add}
          disabled={disabled || value.length >= 8}
        />
        {value.length > 1 && (
          <ParameterIconButton
            label="移除当前阴影"
            icon="minus"
            onClick={() => onChange(value.filter((l) => l.id !== layer?.id))}
            disabled={disabled}
          />
        )}
      </div>
      {layer ? (
        <div className={`pc-shadow-body ${surface}`}>
          <div className="pc-grid">
            <NumberParameter
              compact
              label="X"
              value={layer.x}
              min={-100}
              max={100}
              onChange={(x) => update({ x })}
              disabled={disabled}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
            <NumberParameter
              compact
              label="Y"
              value={layer.y}
              min={-100}
              max={100}
              onChange={(y) => update({ y })}
              disabled={disabled}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
            <ColorParameter
              label="颜色"
              value={layer.color}
              opacity={layer.opacity}
              onChange={(color) => update({ color })}
              onOpacityChange={(opacity) => update({ opacity })}
              disabled={disabled}
            />
            <XYParameter
              compact
              label="阴影偏移"
              value={{ x: layer.x, y: layer.y }}
              min={-100}
              max={100}
              unit="px"
              onChange={(p) => update(p)}
              disabled={disabled}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
            <NumberParameter
              compact
              label="模糊"
              value={layer.blur}
              min={0}
              max={200}
              onChange={(blur) => update({ blur })}
              disabled={disabled}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
            <NumberParameter
              compact
              label="扩展"
              value={layer.spread}
              min={-100}
              max={100}
              onChange={(spread) => update({ spread })}
              disabled={disabled}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
          </div>
        </div>
      ) : (
        <p className="pc-empty">暂无阴影，点击 + 添加一层。</p>
      )}
    </div>
  );
}
export function ParameterSection({
  title,
  children,
  open = true,
  onToggle,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <section className="pc-section">
      <h2>
        <button
          type="button"
          className="oreo-focus"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          <Icon name={open ? "chevron-down" : "chevron-right"} size="sm" />
          {title}
        </button>
      </h2>
      <div id={id} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
export function ParameterPanel({
  children,
  toolbar,
  footer,
  title = "Tuner",
  dark = false,
  onThemeChange,
  onReset,
  disabled = false,
}: {
  children: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  title?: string;
  dark?: boolean;
  onThemeChange?: () => void;
  onReset?: () => void;
  disabled?: boolean;
}) {
  const [minimized, setMinimized] = useState(false);
  const id = useId();
  return (
    <aside className={`pc-panel ${surface}`} aria-label={title}>
      <header>
        <strong>{title}</strong>
        <div>
          {onThemeChange && (
            <ParameterIconButton
              label={dark ? "切换浅色" : "切换深色"}
              icon={dark ? "sun" : "moon"}
              onClick={onThemeChange}
            />
          )}{" "}
          {onReset && (
            <ParameterIconButton
              label="重置参数"
              icon="reset"
              onClick={onReset}
              disabled={disabled}
            />
          )}
          <button
            type="button"
            className="pc-minimize oreo-focus"
            aria-label={minimized ? "展开面板" : "最小化面板"}
            aria-expanded={!minimized}
            aria-controls={id}
            onClick={() => setMinimized(!minimized)}
          >
            <Icon name={minimized ? "plus" : "minus"} />
          </button>
        </div>
      </header>
      <div className={`pc-panel-body ${surface}`} id={id} hidden={minimized}>
        {toolbar && <div className="pc-toolbar">{toolbar}</div>}
        <div className="pc-panel-content">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </aside>
  );
}
