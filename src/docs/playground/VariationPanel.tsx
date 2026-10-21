import { useEffect, useState, useId } from "react";
import { PropertyControl } from "./PropertyControl";
import { Tool } from "./Tools";
import { number, select } from "./schema";
import { useVariation, patchTheme, setTheme } from "./useVariation";
import { defaultVariation, isCustomized, presetAppearance, themeNames, themePresets } from "./variation";

export function VariationPanel() {
  const id = useId();
  const { theme, storageError } = useVariation();
  const v = theme.variation ?? defaultVariation;
  const color = v.accent ?? (theme.dark ? "#fcfcfc" : "#202020");
  const [draft, setDraft] = useState(color);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setDraft(color); setInvalid(false); }, [color, theme.variation]);
  const commitColor = () => {
    if (/^#[0-9a-f]{6}$/i.test(draft)) { patchTheme({ variation: { ...v, accent: draft.toLowerCase() } }); setInvalid(false); }
    else setInvalid(true);
  };
  return <div className="pg-inspector-content pg-variation-content">
    <div className="pg-row pg-property-heading"><h2>Style</h2><Tool label="Reset theme" icon="reset" onClick={() => setTheme(presetAppearance("oreo", theme.dark))} /></div>
    <fieldset className="pg-theme-options"><legend className="sr-only">Theme preset</legend>
      {themeNames.map(name => <label key={name} className="pg-theme-option">
        <input type="radio" name={`${id}-theme-preset`} value={name} checked={v.preset === name} onChange={() => setTheme(presetAppearance(name, theme.dark))} />
        <span className={`pg-theme-swatch pg-theme-swatch-${name}`} style={{ background: themePresets[name].accent ?? "var(--color-text-primary)" }} aria-hidden="true" />
        <span>{themePresets[name].label}</span><span className="pg-theme-selection" aria-hidden="true">{v.preset === name ? "✓" : ""}</span>
      </label>)}
    </fieldset>
    <div className="pg-row pg-fine"><span>Variation</span><span aria-live="polite">{isCustomized(theme) ? "Custom" : themePresets[v.preset].label}</span></div>
    <hr />
    <PropertyControl name="Color mode" control={select(["light", "dark"], "light")} value={theme.dark ? "dark" : "light"} onChange={value => patchTheme({ dark: value === "dark" })} />
    <PropertyControl name="Spacing" control={{ ...number(1, 0.75, 1.25, 0.05), description: "Compact to spacious" }} value={v.density} onChange={value => patchTheme({ variation: { ...v, density: Number(value) } })} />
    <PropertyControl name="Corner radius" control={number(8, 0, Math.max(32, theme.radius), 1)} value={theme.radius} onChange={value => patchTheme({ radius: Number(value) })} />
    <div className="pg-field"><div className="pg-row"><label htmlFor={`${id}-accent-hex`}>Theme color</label><Tool label="Use preset color" icon="reset" onClick={() => patchTheme({ variation: { ...v, accent: themePresets[v.preset].accent } })} /></div>
      <div className="pg-color-field"><input aria-label="Choose theme color" type="color" value={color} onChange={e => patchTheme({ variation: { ...v, accent: e.target.value } })} /><input id={`${id}-accent-hex`} aria-label="Theme color hex" value={draft} spellCheck={false} maxLength={7} aria-invalid={invalid} aria-describedby={invalid ? `${id}-color-error` : undefined} onChange={e => { setDraft(e.target.value); setInvalid(false); }} onBlur={commitColor} onKeyDown={e => { if (e.key === "Enter") commitColor(); }} /></div>
      {invalid && <p id={`${id}-color-error`} role="alert" className="pg-fine">Use a six-digit hex color, such as #6550b9.</p>}
    </div>
    <PropertyControl name="Icon library" control={select(["phosphor", "lucide"], "phosphor")} value={theme.library} onChange={value => patchTheme({ library: value as typeof theme.library })} />
    {storageError && <div role="alert" className="pg-theme-error"><p>{storageError}</p><button onClick={() => setTheme(theme)}>Retry saving</button></div>}
  </div>;
}
