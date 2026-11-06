import { cn } from "@/lib/cn";
import { useState, useRef, useEffect } from "react";
import { Input, type InputProps } from "./input";
import { Tag } from "@/components/tag";
import { addInputTag } from "./model";
export type TagInputProps = Omit<
  InputProps,
  "value" | "defaultValue" | "onChange"
> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  removeLabel?: (tag: string) => string;
};
export function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  removeLabel,
  disabled,
  readOnly,
  onKeyDown,
  name,
  required,
  ref,
  className,
  ...props
}: TagInputProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [draft, setDraft] = useState("");
  const tags = value ?? internal;
  const editor = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const form = editor.current?.form;
    if (!form) return;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setDraft("");
        if (value === undefined) setInternal(defaultValue);
      });
    };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value, defaultValue]);
  useEffect(() => {
    editor.current?.setCustomValidity(
      required && tags.length === 0 ? "Add at least one tag." : "",
    );
  }, [required, tags.length]);
  const change = (next: string[]) => {
    if (disabled || readOnly) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <div className={cn("oreo-input-field", className)}>
      <Input
        {...props}
        ref={(node) => {
          editor.current = node;
          if (typeof ref === "function") return ref(node);
          if (ref) ref.current = node;
        }}
        required={false}
        aria-required={required || undefined}
        disabled={disabled}
        readOnly={readOnly}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (
            e.defaultPrevented ||
            e.nativeEvent.isComposing ||
            e.keyCode === 229 ||
            disabled ||
            readOnly
          )
            return;
          if (e.key === "Enter") {
            e.preventDefault();
            change(addInputTag(tags, draft));
            setDraft("");
          }
        }}
      />
      {name &&
        tags.map((tag, i) => (
          <input
            key={i}
            type="hidden"
            name={name}
            value={tag}
            disabled={disabled}
          />
        ))}
      <div className="oreo-input-tags">
        {tags.map((tag, i) => (
          <Tag
            key={`${tag}-${i}`}
            onRemove={
              disabled || readOnly
                ? undefined
                : () => change(tags.filter((_, index) => index !== i))
            }
            removeLabel={removeLabel?.(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
}
