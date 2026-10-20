import {
  defaultsFor,
  normalizeNumber,
  resolveControl,
  type PlaygroundSpec,
  type Values,
} from "./schema.ts";

export type SavedAppearance = {
  dark: boolean;
  radius: number;
  library: "phosphor" | "lucide";
};
export type Configuration = {
  version: 1;
  component: string;
  values: Values;
  appearance?: SavedAppearance;
};
export type Preset = { id: string; name: string; configuration: Configuration };
export const presetKey = (component: string) =>
  `oreo:playground:presets:${component}`;

/** Shared links and local presets are untrusted inputs, constrained by the live schema. */
export function readConfiguration(
  raw: string,
  component: string,
  spec: PlaygroundSpec,
): Configuration {
  if (raw.length > 64000)
    throw new Error("This configuration is too large. Reset to continue.");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      "This configuration link could not be read. Reset to continue.",
    );
  }
  if (
    !data ||
    data.version !== 1 ||
    data.component !== component ||
    !data.values ||
    typeof data.values !== "object" ||
    Array.isArray(data.values)
  )
    throw new Error(
      "This link is not a valid configuration for this component.",
    );
  const values = defaultsFor(spec);
  for (const [key, control] of Object.entries(spec.controls)) {
    const v = data.values[key];
    if (v === undefined) continue;
    if (control.kind === "boolean" && typeof v === "boolean") values[key] = v;
    else if (
      control.kind === "text" &&
      typeof v === "string" &&
      v.length <= 16000
    )
      values[key] = v;
    else if (
      control.kind === "select" &&
      typeof v === "string" &&
      control.options.includes(v)
    )
      values[key] = v;
    else if (
      control.kind === "number" &&
      typeof v === "number" &&
      Number.isFinite(v)
    )
      values[key] = normalizeNumber(String(v), control)!;
    else
      throw new Error(
        "Some settings in this configuration are no longer supported. Reset to continue.",
      );
  }
  for (const [key, control] of Object.entries(spec.controls)) {
    const resolved = resolveControl(control, values);
    if (resolved.kind === "number")
      values[key] = normalizeNumber(String(values[key]), resolved)!;
  }
  const result: Configuration = { version: 1, component, values };
  const a = data.appearance;
  if (
    a &&
    typeof a.dark === "boolean" &&
    typeof a.radius === "number" &&
    Number.isFinite(a.radius) &&
    a.radius >= 0 &&
    a.radius <= 999 &&
    ["phosphor", "lucide"].includes(a.library)
  )
    result.appearance = { dark: a.dark, radius: a.radius, library: a.library };
  return result;
}

export function randomValues(
  spec: PlaygroundSpec,
  current: Values,
  lockText = true,
  random = Math.random,
): Values {
  const next = { ...current };
  for (const [key, control] of Object.entries(spec.controls)) {
    if (control.kind === "boolean") next[key] = random() > 0.5;
    if (control.kind === "select")
      next[key] =
        control.options[Math.floor(random() * control.options.length)];
    if (control.kind === "number")
      next[key] = normalizeNumber(
        String(control.min + random() * (control.max - control.min)),
        control,
      )!;
    if (control.kind === "text" && !lockText) next[key] = control.defaultValue;
  }
  return readConfiguration(
    JSON.stringify({ version: 1, component: "random", values: next }),
    "random",
    spec,
  ).values;
}

export function readPresets(
  raw: string | null,
  component: string,
  spec: PlaygroundSpec,
): Preset[] {
  if (!raw) return [];
  if (raw.length > 1_000_000)
    throw new Error("Saved presets could not be loaded.");
  const data = JSON.parse(raw);
  if (!Array.isArray(data))
    throw new Error("Saved presets could not be loaded.");
  return data.slice(0, 12).map((p) => {
    if (typeof p?.name !== "string" || typeof p?.id !== "string")
      throw new Error("A saved preset could not be loaded.");
    return {
      id: p.id,
      name: p.name.slice(0, 80),
      configuration: readConfiguration(
        JSON.stringify(p.configuration),
        component,
        spec,
      ),
    };
  });
}

export function shareUrl(base: string, configuration: Configuration): string {
  const url = new URL(base);
  url.hash = "";
  url.searchParams.delete("view");
  url.searchParams.set("config", JSON.stringify(configuration));
  return url.toString();
}
