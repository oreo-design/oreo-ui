import { useRef, useState } from "react";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { Icon } from "@/components/icon";
import {
  NumberParameter,
  ColorParameter,
  ToggleParameter,
  SelectParameter,
  XYParameter,
  ShadowParameter,
  ParameterPanel,
  ParameterSection,
  ParameterIconButton,
  DEFAULT_SHADOWS,
  record,
  travel,
  type History,
  type Point,
  type ShadowLayer,
} from "@/components/parameter-controller";
export type TunerValues = {
  width: number;
  padding: number;
  radius: number;
  gap: number;
  accent: string;
  background: string;
  weight: string;
  cover: boolean;
  point: Point;
  shadows: ShadowLayer[];
};
export const INITIAL_TUNER: TunerValues = {
  width: 320,
  padding: 24,
  radius: 16,
  gap: 12,
  accent: "#3b82f6",
  background: "#ffffff",
  weight: "500",
  cover: true,
  point: { x: 50, y: 50 },
  shadows: DEFAULT_SHADOWS,
};
export function ParameterControllerDemo({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [dark, setDark] = useThemeMode();
  const [history, setHistory] = useState<History<TunerValues>>({
    past: [],
    present: INITIAL_TUNER,
    future: [],
  });
  const historyRef = useRef(history);
  historyRef.current = history;
  const transaction = useRef<TunerValues | null>(null);
  const [preset, setPreset] = useState("original");
  const [presets, setPresets] = useState([
    { id: "A", value: { ...INITIAL_TUNER } },
  ]);
  const [sections, setSections] = useState({ layout: true, appearance: true });
  const begin = () => {
    transaction.current = historyRef.current.present;
  };
  const end = () => {
    if (!transaction.current) return;
    const before = transaction.current;
    transaction.current = null;
    setHistory((s) => record({ ...s, present: before }, s.present));
  };
  const apply = (next: TunerValues) => {
    setHistory((s) =>
      transaction.current ? { ...s, present: next } : record(s, next),
    );
    setPreset("custom");
  };
  const change = <K extends keyof TunerValues>(key: K, value: TunerValues[K]) =>
    apply({ ...historyRef.current.present, [key]: value });
  const v = history.present;
  const reset = () => {
    apply({ ...INITIAL_TUNER });
    setPreset("original");
  };
  return (
    <ParameterPanel
      dark={dark}
      onThemeChange={() => setDark(!dark)}
      onReset={reset}
      disabled={disabled}
      toolbar={
        <>
          <button
            type="button"
            className="pc-preset oreo-state-layer oreo-focus"
            aria-pressed={preset === "original"}
            onClick={reset}
            disabled={disabled}
          >
            原始
          </button>
          <label className="pc-preset-wrap">
            <select
              className="pc-preset oreo-state-layer oreo-focus"
              aria-label="参数方案"
              value={
                preset === "original" || preset === "custom"
                  ? "current"
                  : preset
              }
              disabled={disabled}
              onChange={(e) => {
                const p = presets.find((p) => p.id === e.target.value);
                if (p) {
                  apply({ ...p.value });
                  setPreset(p.id);
                }
              }}
            >
              <option value="current" disabled hidden>
                {preset === "custom" ? "自定" : "A"}
              </option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size="sm" />
          </label>
          <ParameterIconButton
            className="pc-add"
            label="保存为新方案"
            icon="plus"
            disabled={disabled || presets.length >= 8}
            onClick={() => {
              const id = String.fromCharCode(65 + presets.length);
              setPresets([...presets, { id, value: { ...v } }]);
              setPreset(id);
            }}
          />
          <ParameterIconButton
            className="pc-collapse"
            label={
              sections.layout || sections.appearance
                ? "收起全部分组"
                : "展开全部分组"
            }
            icon="fold-vertical"
            onClick={() => {
              const open = !(sections.layout || sections.appearance);
              setSections({ layout: open, appearance: open });
            }}
          />
        </>
      }
      footer={
        <>
          <ParameterIconButton
            label="撤销"
            icon="undo"
            disabled={disabled || !history.past.length}
            onClick={() => {
              setHistory((s) => travel(s, "undo"));
              setPreset("custom");
            }}
          />
          <ParameterIconButton
            label="重做"
            icon="redo"
            disabled={disabled || !history.future.length}
            onClick={() => {
              setHistory((s) => travel(s, "redo"));
              setPreset("custom");
            }}
          />
        </>
      }
    >
      <ParameterSection
        title="布局"
        open={sections.layout}
        onToggle={() => setSections((s) => ({ ...s, layout: !s.layout }))}
      >
        <div className="pc-grid">
          {(
            [
              ["width", "宽度", 640],
              ["padding", "内边距", 48],
              ["radius", "圆角", 32],
              ["gap", "间距", 24],
            ] as const
          ).map(([key, label, max]) => (
            <NumberParameter
              key={key}
              label={label}
              value={v[key]}
              min={0}
              max={max}
              onChange={(n) => change(key, n)}
              disabled={disabled}
              onEditStart={begin}
              onEditEnd={end}
            />
          ))}
        </div>
      </ParameterSection>
      <ParameterSection
        title="外观"
        open={sections.appearance}
        onToggle={() =>
          setSections((s) => ({ ...s, appearance: !s.appearance }))
        }
      >
        <div className="pc-grid">
          <ColorParameter
            label="强调色"
            value={v.accent}
            onChange={(c) => change("accent", c)}
            disabled={disabled}
          />
          <ColorParameter
            label="背景色"
            value={v.background}
            onChange={(c) => change("background", c)}
            disabled={disabled}
          />
          <SelectParameter
            label="字重"
            value={v.weight}
            options={["300", "400", "500", "600", "700"].map((n) => ({
              value: n,
              label: n,
            }))}
            onChange={(n) => change("weight", n)}
            disabled={disabled}
          />
          <ToggleParameter
            label="显示封面"
            checked={v.cover}
            onChange={(n) => change("cover", n)}
            disabled={disabled}
          />
        </div>
      </ParameterSection>
    </ParameterPanel>
  );
}
export function BasicParametersDemo({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [number, setNumber] = useState(24),
    [color, setColor] = useState("#af6ad1"),
    [on, setOn] = useState(true),
    [direction, setDirection] = useState("row");
  return (
    <div className="pc-grid">
      <NumberParameter
        label="数值"
        value={number}
        max={48}
        onChange={setNumber}
        disabled={disabled}
      />
      <ColorParameter
        label="颜色"
        value={color}
        onChange={setColor}
        disabled={disabled}
      />
      <ToggleParameter
        label="开关"
        checked={on}
        onChange={setOn}
        disabled={disabled}
      />
      <SelectParameter
        label="选择"
        value={direction}
        options={[
          { value: "row", label: "横排" },
          { value: "column", label: "竖排" },
        ]}
        onChange={setDirection}
        disabled={disabled}
      />
    </div>
  );
}
export function XYParameterDemo({ disabled = false }: { disabled?: boolean }) {
  const [point, setPoint] = useState({ x: 50, y: 50 });
  return <XYParameter value={point} onChange={setPoint} disabled={disabled} />;
}
export function ShadowParameterDemo({
  disabled = false,
  empty = false,
}: {
  disabled?: boolean;
  empty?: boolean;
}) {
  const [value, setValue] = useState(empty ? [] : DEFAULT_SHADOWS);
  return (
    <ShadowParameter value={value} onChange={setValue} disabled={disabled} />
  );
}
export function ParameterControllerPage() {
  const [view, setView] = useState(
    new URLSearchParams(location.search).get("example") ?? "panel",
  );
  return (
    <>
      <main className="pc-canvas" lang="zh-CN">
        <a className="pc-gallery-back oreo-focus" href="/parameter-controls">
          Oreo UI / Parameter Controller
        </a>
        <div className="pc-subject" data-view={view}>
          {view === "basic" ? (
            <BasicParametersDemo />
          ) : view === "xy" ? (
            <XYParameterDemo />
          ) : view === "shadow" ? (
            <ShadowParameterDemo />
          ) : (
            <ParameterControllerDemo />
          )}
        </div>
      </main>
      <nav className="pc-gallery-nav" aria-label="参考示例">
        {[
          ["panel", "Tuner"],
          ["basic", "基础控件"],
          ["xy", "二维控制"],
          ["shadow", "阴影"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            className="oreo-state-layer oreo-focus"
            aria-pressed={view === id}
            onClick={() => {
              setView(id);
              history.replaceState(null, "", `?example=${id}`);
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
