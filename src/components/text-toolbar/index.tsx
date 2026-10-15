import { useId, useRef, type CSSProperties } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { cn } from "@/lib/cn";
import "./text-toolbar.css";

export const TEXT_COLORS = [
  { value: "ink", label: "Ink", token: "var(--color-text-primary)" },
  { value: "mint", label: "Mint", token: "var(--color-palette-mint-text)" },
  { value: "pink", label: "Rose", token: "var(--color-palette-pink-text)" },
  { value: "blue", label: "Ocean", token: "var(--color-palette-blue-text)" },
  {
    value: "purple",
    label: "Violet",
    token: "var(--color-palette-purple-text)",
  },
  {
    value: "orange",
    label: "Amber",
    token: "var(--color-palette-orange-text)",
  },
  { value: "brown", label: "Cocoa", token: "var(--color-palette-brown-text)" },
] as const;
export type TextColor = (typeof TEXT_COLORS)[number]["value"];
export const TEXT_FONTS = [
  {
    value: "sans",
    label: "Sans",
    family: '"Inter Variable", "Inter", system-ui, sans-serif',
  },
  {
    value: "serif",
    label: "Serif",
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    value: "hand",
    label: "Hand",
    family: '"Bradley Hand", "Segoe Print", cursive',
  },
  {
    value: "mono",
    label: "Mono",
    family: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
] as const;
export type TextFont = (typeof TEXT_FONTS)[number]["value"];
export type TextAlignment = "left" | "center" | "right";
export type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  highlight: boolean;
  color: TextColor;
  font: TextFont;
  size: number;
  align: TextAlignment;
};
export const DEFAULT_TEXT_FORMAT: TextFormat = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  code: false,
  highlight: false,
  color: "ink",
  font: "hand",
  size: 22,
  align: "center",
};
export type TextTransform = "uppercase" | "sentence" | "tidy";
export function textFormatStyle(format: TextFormat): CSSProperties {
  return {
    color: TEXT_COLORS.find((item) => item.value === format.color)?.token,
    fontFamily: TEXT_FONTS.find(
      (item) => item.value === (format.code ? "mono" : format.font),
    )?.family,
    fontSize: `${Math.min(72, Math.max(12, format.size))}px`,
    fontWeight: format.bold ? 700 : 400,
    fontStyle: format.italic ? "italic" : "normal",
    textAlign: format.align,
    textDecoration:
      [format.underline && "underline", format.strikethrough && "line-through"]
        .filter(Boolean)
        .join(" ") || "none",
    backgroundColor: format.highlight
      ? "var(--color-palette-brown-bg)"
      : format.code
        ? "var(--color-state-press)"
        : undefined,
  };
}
/** Original decorative spectrum, kept out of the accessibility tree. */
function SpectrumOrb() {
  const id = useId();
  const points = Array.from({ length: 13 }, (_, row) =>
    Array.from({ length: 13 }, (_, col) => {
      const latitude = ((row - 6) / 6) * Math.PI * 0.44;
      const longitude = ((col - 6) / 6) * Math.PI * 0.46;
      const x = Math.sin(longitude) * Math.cos(latitude);
      const y = Math.sin(latitude);
      const z = Math.cos(longitude) * Math.cos(latitude);
      return { row, col, x, y, z };
    }),
  )
    .flat()
    .sort((a, b) => a.z - b.z);
  const dots = points.map(({ row, col, x, y, z }) => (
    <circle
      key={`${row}-${col}`}
      cx={100 + x * 68}
      cy={96 + y * 68}
      r={4.5 + z * 7}
      fill={`hsl(${135 - (x + 1) * 88 - y * 18} 88% ${43 + z * 19 - y * 8}%)`}
    />
  ));
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="text-spectrum">
      <defs>
        <pattern
          id={`${id}-dots`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="1.2" fill="currentColor" />
        </pattern>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="currentColor" stopOpacity=".2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id}-dots)`} opacity=".3" />
      <ellipse cx="101" cy="162" rx="77" ry="25" fill={`url(#${id}-shadow)`} />
      <g>{dots}</g>
    </svg>
  );
}
export function ColorOrb({
  value,
  onValueChange,
  disabled = false,
}: {
  value: TextColor;
  onValueChange: (value: TextColor) => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const selected =
    TEXT_COLORS.find((item) => item.value === value) ?? TEXT_COLORS[0];
  return (
    <div ref={host} className="text-color-orb">
      <Menu>
        <MenuTrigger
          disabled={disabled}
          render={<button type="button" className="text-orb-trigger" />}
          aria-label={`Text color: ${selected.label}`}
        >
          <SpectrumOrb />
          <span className="text-orb-caption">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: selected.token }}
            />
            {selected.label}
            <Icon name="chevron-down" size="sm" />
          </span>
        </MenuTrigger>
        <MenuPopup
          container={host}
          align="center"
          sideOffset={8}
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "end",
          }}
          className="w-48 transition-none"
        >
          <p className="px-3 py-2 text-xs text-text-tertiary">Text color</p>
          {TEXT_COLORS.map((color) => (
            <MenuItem
              key={color.value}
              selected={color.value === value}
              icon={
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: color.token }}
                />
              }
              onClick={() => onValueChange(color.value)}
            >
              {color.label}
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
}
export function FontSizeStepper({
  value,
  onValueChange,
  min = 12,
  max = 72,
  disabled = false,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const size = Math.min(max, Math.max(min, value));
  return (
    <div role="group" aria-label="Font size" className="text-size-stepper">
      <IconButton
        aria-label="Decrease font size"
        title="Decrease font size"
        type="tertiary"
        tapScale={1}
        disabled={disabled || size <= min}
        icon={<Icon name="minus" />}
        onClick={() => onValueChange(Math.max(min, size - 1))}
      />
      <output
        aria-label="Font size value"
        className="min-w-7 text-center text-base font-medium tabular-nums"
      >
        {size}
      </output>
      <IconButton
        aria-label="Increase font size"
        title="Increase font size"
        type="tertiary"
        tapScale={1}
        disabled={disabled || size >= max}
        icon={<Icon name="plus" />}
        onClick={() => onValueChange(Math.min(max, size + 1))}
      />
    </div>
  );
}
export function TextAlignmentControl({
  value,
  onValueChange,
  disabled = false,
}: {
  value: TextAlignment;
  onValueChange: (value: TextAlignment) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label="Text alignment" className="text-alignment">
      {(["left", "center", "right"] as const).map((align) => (
        <IconButton
          key={align}
          type={value === align ? "secondary" : "tertiary"}
          tapScale={1}
          shape="rectangle"
          aria-label={`Align ${align}`}
          title={`Align ${align}`}
          aria-pressed={value === align}
          disabled={disabled}
          icon={<Icon name={`align-${align}`} />}
          onClick={() => onValueChange(align)}
        />
      ))}
    </div>
  );
}
export function FontFamilyPicker({
  value,
  onValueChange,
  disabled = false,
}: {
  value: TextFont;
  onValueChange: (value: TextFont) => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const selected =
    TEXT_FONTS.find((font) => font.value === value) ?? TEXT_FONTS[0];
  return (
    <div ref={host} className="text-font-picker">
      <Menu>
        <MenuTrigger
          disabled={disabled}
          render={
            <Button
              type="tertiary"
              tapScale={1}
              className="h-full w-full gap-2 text-xl"
              trailingIcon={<Icon name="chevron-down" size="sm" />}
              style={{ fontFamily: selected.family }}
            />
          }
          aria-label={`Font family: ${selected.label}`}
        >
          {selected.label}
        </MenuTrigger>
        <MenuPopup
          container={host}
          align="end"
          className="w-48 transition-none"
        >
          {TEXT_FONTS.map((font) => (
            <MenuItem
              key={font.value}
              selected={font.value === value}
              onClick={() => onValueChange(font.value)}
            >
              <span style={{ fontFamily: font.family }}>{font.label}</span>
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
}
export type TextToolbarProps = {
  value: TextFormat;
  onValueChange: (value: TextFormat) => void;
  disabled?: boolean;
  linked?: boolean;
  onLink?: () => void;
  onMention?: () => void;
  onTransform?: (action: TextTransform) => void;
  className?: string;
};
const toggles: {
  key: "bold" | "italic" | "underline" | "strikethrough" | "code" | "highlight";
  label: string;
  icon: IconName;
}[] = [
  { key: "bold", label: "Bold", icon: "text-bold" },
  { key: "italic", label: "Italic", icon: "text-italic" },
  { key: "underline", label: "Underline", icon: "text-underline" },
  { key: "strikethrough", label: "Strikethrough", icon: "text-strikethrough" },
  { key: "code", label: "Inline code", icon: "inline-code" },
  { key: "highlight", label: "Highlight", icon: "highlighter" },
];
export function TextToolbar({
  value,
  onValueChange,
  disabled = false,
  linked = false,
  onLink,
  onMention,
  onTransform,
  className,
}: TextToolbarProps) {
  const host = useRef<HTMLDivElement>(null);
  const update = (patch: Partial<TextFormat>) =>
    onValueChange({ ...value, ...patch });
  return (
    <div
      ref={host}
      role="group"
      aria-label="Text formatting"
      className={cn("text-toolbar", className)}
    >
      <div className="text-toolbar-top">
        <ColorOrb
          value={value.color}
          onValueChange={(color) => update({ color })}
          disabled={disabled}
        />
        <div
          className="text-format-grid"
          role="group"
          aria-label="Formatting actions"
        >
          {toggles.map((action) => (
            <IconButton
              key={action.key}
              aria-label={action.label}
              title={action.label}
              aria-pressed={value[action.key]}
              type={value[action.key] ? "secondary" : "tertiary"}
              size="lg"
              shape="rectangle"
              className="text-format-button"
              tapScale={1}
              disabled={disabled}
              icon={<Icon name={action.icon} />}
              onClick={() => update({ [action.key]: !value[action.key] })}
            />
          ))}
          <IconButton
            aria-label="Edit link"
            title="Edit link"
            aria-pressed={linked}
            disabled={disabled || !onLink}
            type={linked ? "secondary" : "tertiary"}
            size="lg"
            shape="rectangle"
            className="text-format-button"
            tapScale={1}
            icon={<Icon name="link" />}
            onClick={onLink}
          />
          <IconButton
            aria-label="Insert mention"
            title="Insert mention"
            disabled={disabled || !onMention}
            type="tertiary"
            size="lg"
            shape="rectangle"
            className="text-format-button"
            tapScale={1}
            icon={<Icon name="at" />}
            onClick={onMention}
          />
          <Menu>
            <MenuTrigger
              disabled={disabled || !onTransform}
              aria-label="Text actions"
              title="Text actions"
              render={
                <IconButton
                  aria-label="Text actions"
                  type="tertiary"
                  size="lg"
                  shape="rectangle"
                  className="text-format-button"
                  tapScale={1}
                  icon={<Icon name="sparkle" />}
                />
              }
            />
            <MenuPopup container={host} align="end" className="transition-none">
              <MenuItem onClick={() => onTransform?.("sentence")}>
                Sentence case
              </MenuItem>
              <MenuItem onClick={() => onTransform?.("uppercase")}>
                UPPERCASE
              </MenuItem>
              <MenuItem onClick={() => onTransform?.("tidy")}>
                Remove extra spaces
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </div>
      <div className="text-toolbar-bottom">
        <FontSizeStepper
          value={value.size}
          onValueChange={(size) => update({ size })}
          disabled={disabled}
        />
        <TextAlignmentControl
          value={value.align}
          onValueChange={(align) => update({ align })}
          disabled={disabled}
        />
        <FontFamilyPicker
          value={value.font}
          onValueChange={(font) => update({ font })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
