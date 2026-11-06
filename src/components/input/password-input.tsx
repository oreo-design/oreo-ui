import { cn } from "@/lib/cn";
import { useRef, useState, useEffect, type Ref } from "react";
import { Input, type InputProps } from "./input";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { passwordCriteria } from "./model";

export function PasswordStrength({ value }: { value: string }) {
  const criteria = passwordCriteria(value);
  const level = criteria.filter(Boolean).length;
  return (
    <div className="oreo-input-strength">
      <div
        role="meter"
        aria-label="Password requirements met"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={level}
        aria-valuetext={`${level} of 3 requirements met`}
        className="oreo-input-strength-bars"
        data-level={level}
      >
        {criteria.map((_, i) => (
          <span key={i} data-active={i < level || undefined} />
        ))}
      </div>
      <p>Must contain at least:</p>
      {["One uppercase letter", "One number", "8 characters"].map(
        (label, i) => (
          <div
            className="oreo-input-criterion"
            data-met={criteria[i] || undefined}
            key={label}
          >
            <Icon name={criteria[i] ? "check" : "x"} size="sm" />
            <span>
              {label}
              <span className="sr-only">
                {criteria[i] ? ": met" : ": not met"}
              </span>
            </span>
          </div>
        ),
      )}
    </div>
  );
}
export type PasswordInputProps = Omit<InputProps, "type" | "trailingAction"> & {
  showStrength?: boolean;
  showLabel?: string;
  hideLabel?: string;
};
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") return ref(value);
  if (ref) ref.current = value;
}
export function PasswordInput({
  showStrength = false,
  showLabel = "Show password",
  hideLabel = "Hide password",
  value,
  defaultValue = "",
  onChange,
  ref,
  disabled,
  leadingIcon,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(String(defaultValue));
  const current = value === undefined ? draft : String(value);
  const editor = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const form = editor.current?.form;
    if (!form) return;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setDraft(editor.current?.defaultValue ?? "");
        setVisible(false);
      });
    };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, []);
  return (
    <div className={cn("oreo-input-field", className)}>
      <Input
        {...props}
        ref={(node) => {
          editor.current = node;
          return assignRef(ref, node);
        }}
        type={visible ? "text" : "password"}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        disabled={disabled}
        leadingIcon={leadingIcon ?? <Icon name="lock" />}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange?.(e);
        }}
        trailingAction={
          <IconButton
            type="tertiary"
            size="sm"
            className="oreo-input-action"
            disabled={disabled}
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            icon={<Icon name={visible ? "eye-off" : "eye"} />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const input = editor.current;
              const start = input?.selectionStart;
              const end = input?.selectionEnd;
              setVisible((v) => !v);
              requestAnimationFrame(() => {
                input?.focus();
                if (start != null && end != null)
                  input?.setSelectionRange(start, end);
              });
            }}
          />
        }
      />
      {showStrength && <PasswordStrength value={current} />}
    </div>
  );
}
