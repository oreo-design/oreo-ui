import { useId, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import "./timeframe-selector.css";

export type TimeframeOption = { value: string; label: string };
export const TIMEFRAMES: readonly TimeframeOption[] = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "24h", label: "24H" },
  { value: "3d", label: "3D" },
  { value: "1w", label: "1W" },
];
export type TimeframeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  options?: readonly TimeframeOption[];
  label?: string;
  disabled?: boolean;
};
/** A compact, cyclic window over duration choices. Selection stays controlled. */
export function TimeframeSelector({
  value,
  onValueChange,
  options = TIMEFRAMES,
  label = "Timeframe",
  disabled = false,
}: TimeframeSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const id = useId();
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const count = Math.min(expanded ? 3 : 2, options.length);
  const start = expanded ? offset : selected - 1;
  const trackStart = options.length + start;
  const trackOptions = [...options, ...options, ...options];
  function close() {
    setExpanded(false);
    toggle.current?.focus();
  }
  return (
    <div
      className="oreo-timeframe"
      data-keyboard={keyboard || undefined}
      data-disabled={disabled || undefined}
      onPointerDownCapture={() => setKeyboard(false)}
      onKeyDownCapture={(e) => {
        setKeyboard(true);
        if (e.key === "Escape" && expanded) {
          e.preventDefault();
          close();
        }
      }}
      role="group"
      aria-label={label}
    >
      {expanded && options.length > 3 && (
        <button
          type="button"
          className="tf-step"
          aria-label="Previous timeframes"
          disabled={disabled}
          onClick={() =>
            setOffset((o) => (o - 1 + options.length) % options.length)
          }
        >
          <Icon name="chevron-left" size="sm" />
        </button>
      )}
      <div
        id={id}
        className="tf-choices"
        style={{ width: `${count * 2.125}rem` }}
      >
        <div
          className="tf-track"
          style={{ transform: `translateX(${-trackStart * 2.125}rem)` }}
        >
          {trackOptions.map((option, index) => {
            const visible = index >= trackStart && index < trackStart + count;
            return (
              <button
                type="button"
                key={`${index}-${option.value}`}
                disabled={disabled}
                aria-hidden={!visible || undefined}
                tabIndex={visible ? 0 : -1}
                aria-pressed={value === option.value}
                aria-label={`${label}: ${option.label}`}
                onClick={() => {
                  onValueChange(option.value);
                  close();
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        ref={toggle}
        type="button"
        disabled={disabled || options.length < 3}
        aria-expanded={expanded}
        aria-controls={id}
        aria-label={expanded ? "Close timeframes" : "More timeframes"}
        onClick={() => {
          setOffset(selected);
          setExpanded((v) => !v);
        }}
      >
        <Icon name={expanded ? "x" : "plus"} size="sm" />
      </button>
    </div>
  );
}
