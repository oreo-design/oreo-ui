import { useEffect, useId, useState } from "react";
import { Switch } from "@/components/switch";
import { normalizeNumber, type Control } from "./schema";
import { cn } from "@/lib/cn";

const inputClass = "oreo-squircle w-full min-w-0 border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-tertiary)]";

function NumericInput({ control, value, onChange, id, label }: { control: Extract<Control, { kind: "number" }>; value: number; onChange: (value: number) => void; id: string; label: string }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const normalized = normalizeNumber(draft, control);
    if (normalized !== null) onChange(normalized);
    setDraft(String(normalized ?? value));
  };
  return <div className="flex items-center gap-3">
    <input id={id} aria-label={label} type="range" className="slider min-w-0 flex-1" min={control.min} max={control.max} step={control.step} value={value} onChange={e => onChange(Number(e.target.value))} />
    <input aria-label={`${label} value`} className={cn(inputClass, "w-20 shrink-0 px-2 text-right tabular-nums")} type="number" min={control.min} max={control.max} step={control.step} value={draft} onChange={e => { setDraft(e.target.value); const normalized = normalizeNumber(e.target.value, control); if (normalized !== null && normalized === Number(e.target.value)) onChange(normalized); }} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") { commit(); e.currentTarget.blur(); } }} />
  </div>;
}

export function PropertyControl({ name, control, value, onChange }: { name: string; control: Control; value: string | boolean | number; onChange: (value: string | boolean | number) => void }) {
  const id = useId();
  const label = control.label ?? name.replace(/([a-z])([A-Z])/g, (_, first, second: string) => `${first} ${second.toLowerCase()}`).replace(/^./, first => first.toUpperCase());
  if (control.kind === "boolean") return <div className="pg-boolean flex min-h-8 items-center justify-between gap-4">
    <label htmlFor={id} className="cursor-pointer text-xs">{label}</label><Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} aria-label={label} />
  </div>;
  return <div className="pg-field space-y-2">
    <label id={`${id}-label`} htmlFor={id} className="block text-xs text-[var(--color-text-secondary)]">{label}</label>
    {control.kind === "text" && (control.multiline ? <textarea id={id} className={cn(inputClass, "min-h-20 resize-y leading-5")} value={String(value)} onChange={e => onChange(e.target.value)} /> : <input id={id} className={inputClass} value={String(value)} onChange={e => onChange(e.target.value)} />)}
    {control.kind === "number" && <NumericInput id={id} label={label} control={control} value={Number(value)} onChange={onChange} />}
    {control.kind === "select" && (control.options.length <= 3 && control.options.join("").length < 26 ?
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="pg-segment oreo-squircle flex">
        {control.options.map(option => <label key={option} className="relative min-w-0 flex-1 cursor-pointer text-center">
          <input type="radio" className="peer sr-only" name={id} value={option} checked={value === option} onChange={() => onChange(option)} />
          <span className="oreo-squircle oreo-state-layer block px-2 py-1.5 text-xs capitalize peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-text-tertiary)] text-[var(--color-text-secondary)]">{({ sm: "Small", md: "Medium", lg: "Large" } as Record<string, string>)[option] ?? option}</span>
        </label>)}
      </div> : <select id={id} className={inputClass} value={String(value)} onChange={e => onChange(e.target.value)}>{control.options.map(option => <option key={option} value={option}>{option}</option>)}</select>)}
    {control.description && <p className="text-xs leading-5 text-[var(--color-text-tertiary)]">{control.description}</p>}
  </div>;
}
