import type { ReactElement } from "react";

export type Control = {
  label?: string;
  group?: string;
  description?: string;
  minFrom?: string;
  maxFrom?: string;
} & (
  | { kind: "boolean"; defaultValue: boolean }
  | { kind: "text"; defaultValue: string; multiline?: boolean }
  | { kind: "number"; defaultValue: number; min: number; max: number; step: number }
  | { kind: "select"; defaultValue: string; options: readonly string[] }
);
export type Values = Record<string, string | number | boolean>;
type Value<C> = C extends { kind: "select"; options: readonly (infer T)[] } ? T : C extends { kind: "boolean" } ? boolean : C extends { kind: "number" } ? number : string;
type FormValues<C> = { [K in keyof C]: Value<C[K]> };
export type PlaygroundSpec = {
  title: string;
  source?: string;
  exports?: import("./code-types").ComponentExports;
  exportRecipe?: (values: Values) => import("./code-types").CodeExample;
  demo?: (reducedMotion: boolean) => import("./demo").Demo;
  controls: Record<string, Control>;
  render: (values: Values, set: (key: string, value: string | number | boolean) => void) => ReactElement;
};

// Inference checks each adapter against the real component API. Only this
// boundary erases per-component keys for the shared form renderer.
export function definePlayground<const C extends Record<string, Control>>(
  title: string,
  controls: C,
  render: (values: FormValues<C>, set: <K extends keyof C>(key: K, value: FormValues<C>[K]) => void) => ReactElement,
): PlaygroundSpec {
  return { title, controls, render: render as unknown as PlaygroundSpec["render"] };
}
export const text = (defaultValue: string, multiline = false) => ({ kind: "text" as const, defaultValue, multiline });
export const toggle = (defaultValue = false) => ({ kind: "boolean" as const, defaultValue });
export const number = (defaultValue: number, min: number, max: number, step = 1) => ({ kind: "number" as const, defaultValue, min, max, step });
export const select = <const T extends readonly string[]>(options: T, defaultValue: T[number]) => ({ kind: "select" as const, defaultValue, options });
export const defaultsFor = (spec: PlaygroundSpec): Values => Object.fromEntries(Object.entries(spec.controls).map(([key, control]) => [key, control.defaultValue]));

export function normalizeNumber(raw: string, control: Extract<Control, { kind: "number" }>): number | null {
  if (!raw.trim() || !Number.isFinite(Number(raw))) return null;
  const clamped = Math.min(control.max, Math.max(control.min, Number(raw)));
  const snapped = control.min + Math.round((clamped - control.min) / control.step) * control.step;
  return Number(Math.min(control.max, Math.max(control.min, snapped)).toFixed(6));
}

export function resolveControl(control: Control, values: Values): Control {
  if (control.kind !== "number") return control;
  return {
    ...control,
    min: control.minFrom ? Math.max(control.min, Number(values[control.minFrom])) : control.min,
    max: control.maxFrom ? Math.min(control.max, Number(values[control.maxFrom])) : control.max,
  };
}

export function updateValues(controls: Record<string, Control>, current: Values, key: string, value: Values[string]): Values {
  const next = { ...current, [key]: value };
  for (const [name, control] of Object.entries(controls)) {
    const resolved = resolveControl(control, next);
    if (resolved.kind === "number") next[name] = normalizeNumber(String(next[name]), resolved) ?? current[name];
  }
  return next;
}
