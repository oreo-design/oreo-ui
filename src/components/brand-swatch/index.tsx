import { Icon } from "@/components/icon";
import "./brand-swatch.css";
export type BrandSwatchProps = {
  name: string;
  hex: string;
  role?: string;
  onCopy: (hex: string) => void;
  disabled?: boolean;
};
/** A brand specimen keeps its supplied colour in either interface theme. */
export function BrandSwatch({
  name,
  hex,
  role,
  onCopy,
  disabled = false,
}: BrandSwatchProps) {
  return (
    <button
      type="button"
      className="oreo-brand-swatch"
      disabled={disabled}
      onClick={() => onCopy(hex)}
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className="bs-colour" style={{ backgroundColor: hex }} />
      <span className="bs-meta">
        <strong>{name}</strong>
        <Icon name="copy" size="sm" />
        <span>{hex.toUpperCase()}</span>
        {role && <small>{role}</small>}
      </span>
    </button>
  );
}
