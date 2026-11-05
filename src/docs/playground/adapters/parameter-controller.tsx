import {
  ParameterControllerDemo,
  ShadowParameterDemo,
} from "@/patterns/parameter-controller";
import {
  NumberParameter,
  ColorParameter,
  ToggleParameter,
  SelectParameter,
  XYParameter,
  ShadowParameter,
  ParameterPanel,
  ParameterSection,
  validHex,
} from "@/components/parameter-controller";
import {
  definePlayground as define,
  toggle,
  number,
  text,
  select,
} from "../schema";
import type { PlaygroundSpec } from "../schema";
const exports = {
  "parameter-controller": {
    NumberParameter,
    ColorParameter,
    ToggleParameter,
    SelectParameter,
    XYParameter,
    ShadowParameter,
    ParameterPanel,
    ParameterSection,
  },
};
const source = "parameter-controller";
const directionOptions = [
  { value: "row", label: "横排" },
  { value: "column", label: "竖排" },
];
const imports = ['import { useState } from "react";'];
const specs: Record<string, PlaygroundSpec> = {
  "parameter-controls": {
    ...define(
      "Parameter Controls",
      {
        value: number(24, 0, 48),
        color: text("#af6ad1"),
        checked: toggle(true),
        direction: select(["row", "column"], "row"),
        disabled: toggle(false),
      },
      (v, set) => (
        <div className="w-full p-6">
          <div className="pc-subject pc-playground-subject pc-grid mx-auto">
            <NumberParameter
              label="数值"
              value={v.value}
              max={48}
              onChange={(n) => set("value", n)}
              disabled={v.disabled}
            />
            <ColorParameter
              label="颜色"
              value={validHex(v.color) ? v.color : "#af6ad1"}
              onChange={(c) => set("color", c)}
              disabled={v.disabled}
            />
            <ToggleParameter
              label="开关"
              checked={v.checked}
              onChange={(b) => set("checked", b)}
              disabled={v.disabled}
            />
            <SelectParameter
              label="选择"
              value={v.direction}
              options={directionOptions}
              onChange={(d) =>
                set("direction", d === "column" ? "column" : "row")
              }
              disabled={v.disabled}
            />
          </div>
        </div>
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        ...imports,
        'import { NumberParameter, ColorParameter, ToggleParameter, SelectParameter } from "@/components/parameter-controller";',
      ],
      setup: [
        `const [value, setValue] = useState(${v.value});`,
        `const [color, setColor] = useState(${JSON.stringify(validHex(String(v.color)) ? v.color : "#af6ad1")});`,
        `const [checked, setChecked] = useState(${v.checked});`,
        `const [direction, setDirection] = useState(${JSON.stringify(v.direction)});`,
      ],
      jsx: `<div className="pc-grid">
  <NumberParameter label="数值" value={value} onChange={setValue} max={48} disabled={${v.disabled}} />
  <ColorParameter label="颜色" value={color} onChange={setColor} disabled={${v.disabled}} />
  <ToggleParameter label="开关" checked={checked} onChange={setChecked} disabled={${v.disabled}} />
  <SelectParameter label="选择" value={direction} onChange={setDirection} options={[{value:"row",label:"横排"},{value:"column",label:"竖排"}]} disabled={${v.disabled}} />
</div>`,
      notes: [],
    }),
  },
  "xy-parameter": {
    ...define(
      "XY Parameter",
      { x: number(50, 0, 100), y: number(50, 0, 100), disabled: toggle(false) },
      (v, set) => (
        <div className="w-full p-6">
          <div className="pc-subject pc-playground-subject mx-auto">
            <XYParameter
              value={{ x: v.x, y: v.y }}
              onChange={(p) => {
                set("x", p.x);
                set("y", p.y);
              }}
              disabled={v.disabled}
            />
          </div>
        </div>
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        ...imports,
        'import { XYParameter } from "@/components/parameter-controller";',
      ],
      setup: [`const [point, setPoint] = useState({x:${v.x},y:${v.y}});`],
      jsx: `<XYParameter value={point} onChange={setPoint} disabled={${v.disabled}} />`,
      notes: ["X grows right; Y grows down."],
    }),
  },
  "shadow-parameter": {
    ...define(
      "Shadow Parameter",
      { empty: toggle(false), disabled: toggle(false) },
      (v) => (
        <div className="w-full p-6">
          <div className="pc-subject pc-playground-subject mx-auto">
            <ShadowParameterDemo
              key={String(v.empty)}
              empty={v.empty}
              disabled={v.disabled}
            />
          </div>
        </div>
      ),
    ),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        ...imports,
        'import { ShadowParameter, DEFAULT_SHADOWS, type ShadowLayer } from "@/components/parameter-controller";',
      ],
      setup: [
        `const [shadows, setShadows] = useState<ShadowLayer[]>(${v.empty ? "[]" : "DEFAULT_SHADOWS"});`,
      ],
      jsx: `<ShadowParameter value={shadows} onChange={setShadows} disabled={${v.disabled}} />`,
      notes: [
        "Use shadowCSS(shadows) to apply the composed value in your host.",
      ],
    }),
  },
  "parameter-panel": {
    ...define("Parameter Panel", { disabled: toggle(false) }, (v) => (
      <div className="w-full p-6">
        <div
          className="pc-subject pc-playground-subject mx-auto"
          data-view="panel"
        >
          <ParameterControllerDemo disabled={v.disabled} />
        </div>
      </div>
    )),
    source,
    exports,
    exportRecipe: (v) => ({
      imports: [
        ...imports,
        'import { ParameterPanel, ParameterSection, NumberParameter } from "@/components/parameter-controller";',
      ],
      setup: [
        "const [width, setWidth] = useState(320);",
        "const [open, setOpen] = useState(true);",
      ],
      jsx: `<ParameterPanel title="Tuner" onReset={()=>setWidth(320)} disabled={${v.disabled}}>
  <ParameterSection title="布局" open={open} onToggle={()=>setOpen(!open)}>
    <NumberParameter label="宽度" value={width} onChange={setWidth} max={640} disabled={${v.disabled}} />
  </ParameterSection>
</ParameterPanel>`,
      notes: [
        "This is the minimal composition. The complete parameter-controller template adds presets and transaction history.",
      ],
    }),
  },
};
export default specs;
