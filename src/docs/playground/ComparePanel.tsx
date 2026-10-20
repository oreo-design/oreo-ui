import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button";
import { PropertyControl } from "./PropertyControl";
import {
  defaultsFor,
  toggle,
  updateValues,
  type PlaygroundSpec,
  type Values,
} from "./schema";
import { randomValues, type Preset, type Configuration } from "./configuration";
import { Modal, Tool } from "./Tools";

export function ComparePanel({
  spec,
  values,
  presets,
  configuration,
  onApply,
  onPresetApply,
  onSave,
  onDelete,
  onBack,
}: {
  spec: PlaygroundSpec;
  values: Values;
  presets: Preset[];
  configuration: Configuration;
  onApply: (values: Values) => void;
  onPresetApply: (configuration: Configuration) => void;
  onSave: (preset: Preset) => string | null;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [lockText, setLockText] = useState(true),
    [seed, setSeed] = useState(0),
    [saveOpen, setSaveOpen] = useState(false),
    [name, setName] = useState(""),
    [saveError, setSaveError] = useState("");
  const variants = useMemo(() => {
    const variant =
      Object.entries(spec.controls).find(
        ([key, c]) => key === "type" && c.kind === "select",
      ) ?? Object.entries(spec.controls).find(([, c]) => c.kind === "select");
    if (seed > 0 || !variant || variant[1].kind !== "select")
      return [1, 2].map((index) => ({
        label: `Variation ${index}`,
        values: randomValues(spec, values, lockText),
      }));
    return variant[1].options
      .filter((option) => option !== values[variant[0]])
      .slice(0, 2)
      .map((option) => ({
        label: option.charAt(0).toUpperCase() + option.slice(1),
        values: { ...values, [variant[0]]: option },
      }));
  }, [spec, values, seed, lockText]);
  return (
    <section className="pg-compare">
      <header className="pg-row">
        <h2>Compare configurations</h2>
        <Tool icon="arrow-left" label="Back to preview" onClick={onBack} />
      </header>
      <div className="pg-comparisons">
        {[{ label: "Current", values }, ...variants].map((variant, index) => (
          <Comparison
            key={`${seed}-${index}`}
            spec={spec}
            label={variant.label}
            initial={variant.values}
            onApply={onApply}
          />
        ))}
      </div>
      <div className="pg-compare-tools">
        <Tool
          icon="floppy-disk"
          label="Save preset"
          onClick={() => setSaveOpen(true)}
        />
        <Tool
          icon="randomize"
          label="Randomize variations"
          onClick={() => setSeed((v) => v + 1)}
        />
        <PropertyControl
          name="Lock text"
          control={toggle(true)}
          value={lockText}
          onChange={(v) => setLockText(Boolean(v))}
        />
      </div>
      <p className="pg-muted">
        Randomization uses valid options and bounds. Reset restores component
        defaults.
      </p>
      <section className="pg-card">
        <strong>Presets</strong>
        <div className="pg-presets">
          <button onClick={() => onApply(defaultsFor(spec))}>Default</button>
          {presets.map((preset) => (
            <span key={preset.id}>
              <button onClick={() => onPresetApply(preset.configuration)}>
                {preset.name}
              </button>
              <Tool
                icon="x"
                label={`Delete ${preset.name}`}
                onClick={() => onDelete(preset.id)}
              />
            </span>
          ))}
        </div>
        <p>
          Saved locally in this browser. Sharing creates a portable
          configuration link.
        </p>
      </section>
      <Modal open={saveOpen} onOpenChange={setSaveOpen} title="Save preset">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            const failure = onSave({
              id: crypto.randomUUID(),
              name: name.trim(),
              configuration,
            });
            setSaveError(failure ?? "");
            if (!failure) {
              setSaveOpen(false);
              setName("");
            }
          }}
        >
          <label htmlFor="pg-preset-name">Preset name</label>
          <input
            id="pg-preset-name"
            autoFocus
            maxLength={80}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {saveError && (
            <p role="alert" className="pg-muted">
              {saveError}
            </p>
          )}
          <Button
            size="sm"
            disabled={!name.trim()}
            render={<button type="submit" />}
          >
            Save preset
          </Button>
        </form>
      </Modal>
    </section>
  );
}

function Comparison({
  spec,
  label,
  initial,
  onApply,
}: {
  spec: PlaygroundSpec;
  label: string;
  initial: Values;
  onApply: (values: Values) => void;
}) {
  const [values, setValues] = useState(initial);
  useEffect(() => setValues(initial), [initial]);
  return (
    <section className="pg-card">
      <strong>{label}</strong>
      <div className="pg-compare-preview">
        {spec.render(values, (key, value) =>
          setValues((current) =>
            updateValues(spec.controls, current, key, value),
          ),
        )}
      </div>
      <p>
        {String(
          (
            { sm: "Small", md: "Medium", lg: "Large" } as Record<string, string>
          )[String(values.size)] ?? spec.title,
        )}{" "}
        · {values.disabled ? "Disabled" : "Enabled"}
      </p>
      <Button
        size="sm"
        type="secondary"
        onClick={() => onApply(values)}
        aria-label={`Apply ${label.toLowerCase()}`}
      >
        Apply
      </Button>
    </section>
  );
}
