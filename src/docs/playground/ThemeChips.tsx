import { useId } from "react";
import { Tool } from "./Tools";
import { useVariation, setTheme } from "./useVariation";
import { defaultVariation, presetAppearance, themeNames, themePresets } from "./variation";

/** The single preset picker; detailed controls live in the optional settings panel. */
export function ThemeChips({ open, onToggle, panelId, triggerId }: {
  open: boolean;
  onToggle: () => void;
  panelId: string;
  triggerId: string;
}) {
  const id = useId();
  const { theme, storageError } = useVariation();
  const selected = (theme.variation ?? defaultVariation).preset;
  return <div className="pg-theme-picker">
    <div className="pg-theme-bar">
      <fieldset className="pg-theme-chips"><legend className="sr-only">Theme preset</legend>
        {themeNames.map(name => <label key={name} className="oreo-focus-proxy pg-theme-option pg-theme-chip oreo-squircle oreo-state-layer">
          <input type="radio" name={`${id}-theme-preset`} value={name} aria-label={themePresets[name].label}
            checked={selected === name} onChange={() => setTheme(presetAppearance(name, theme.dark))} />
          <span className={`pg-theme-swatch pg-theme-swatch-${name}`} aria-hidden="true"
            style={name === "ascii" ? undefined : { background: themePresets[name].accent ?? "var(--color-text-primary)" }} />
          <span>{name === "oreo" ? "Oreo" : themePresets[name].label}</span>
        </label>)}
      </fieldset>
      <Tool id={triggerId} icon="settings" label="Theme settings" active={open} aria-expanded={open}
        aria-controls={open ? panelId : undefined} onClick={onToggle} />
    </div>
    {storageError && !open && <div role="alert" className="pg-theme-error">
      <p>{storageError}</p><button onClick={() => setTheme(theme)}>Retry saving</button>
    </div>}
  </div>;
}
