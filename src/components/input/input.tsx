import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { tv } from "@/lib/tv";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";
type InputState = {
  disabled?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
};
const InputContext = createContext<InputState>({});
export const inputVariants = tv({
  slots: {
    root: "oreo-input oreo-squircle",
    wrapper: "oreo-input-wrapper",
    control: "oreo-input-control",
    icon: "oreo-input-icon",
    affix: "oreo-input-affix",
    inlineAffix: "oreo-input-inline-affix",
  },
  variants: {
    size: {
      sm: { root: "oreo-input-sm" },
      md: { root: "oreo-input-md" },
      lg: { root: "oreo-input-lg" },
    },
  },
  defaultVariants: { size: "md" },
});
export type InputRootProps = ComponentProps<"div"> &
  InputState & { size?: InputSize };
export function InputRoot({
  size = "md",
  disabled,
  readOnly,
  hasError,
  className,
  children,
  ...props
}: InputRootProps) {
  return (
    <InputContext.Provider value={{ disabled, readOnly, hasError }}>
      <div
        {...props}
        className={cn(inputVariants({ size }).root(), className)}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={hasError || undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
}
/** Padding and decorative children focus the editor. Independent actions retain their own focus. */
export function InputWrapper({
  className,
  onClick,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("oreo-input-wrapper", className)}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          !(event.target instanceof Element) ||
          event.target.closest(
            "input,button,a,select,textarea,[role=combobox],[contenteditable=true]",
          )
        )
          return;
        event.currentTarget
          .querySelector<HTMLInputElement>("input:not(:disabled)")
          ?.focus();
      }}
    />
  );
}
export function InputControl({
  className,
  disabled,
  readOnly,
  placeholder = " ",
  ...props
}: ComponentProps<"input">) {
  const state = useContext(InputContext);
  return (
    <input
      aria-invalid={state.hasError || undefined}
      {...props}
      disabled={state.disabled || disabled}
      readOnly={state.readOnly || readOnly}
      placeholder={placeholder}
      className={cn("oreo-input-control", className)}
    />
  );
}
export function InputIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn("oreo-input-icon", className)}
    />
  );
}
export function InputAffix({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("oreo-input-affix", className)} />;
}
export function InputInlineAffix({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span {...props} className={cn("oreo-input-inline-affix", className)} />
  );
}

export type InputProps = Omit<ComponentProps<"input">, "size" | "prefix"> & {
  size?: InputSize;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  hasError?: boolean;
  optional?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inlineStart?: ReactNode;
  inlineEnd?: ReactNode;
  /** Independent control inside the field (e.g. a password action). */
  trailingAction?: ReactNode;
  rootClassName?: string;
  inputClassName?: string;
};
/** Native input props/ref go to the editor; className belongs to the complete field. */
export function Input({
  size = "md",
  label,
  hint,
  error,
  hasError,
  optional,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  inlineStart,
  inlineEnd,
  trailingAction,
  className,
  rootClassName,
  inputClassName,
  id: providedId,
  disabled,
  readOnly,
  required,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const invalid = Boolean(
    hasError ||
      error ||
      props["aria-invalid"] === true ||
      props["aria-invalid"] === "true",
  );
  const isRequired =
    required ||
    props["aria-required"] === true ||
    props["aria-required"] === "true";
  const message = error || hint;
  const description =
    [describedBy, message ? `${id}-description` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={cn("oreo-input-field", className)}>
      {label && (
        <label className="oreo-input-label" htmlFor={id}>
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-status-error">
              {" "}
              *
            </span>
          )}
          {optional && !isRequired && (
            <span className="text-text-tertiary"> (Optional)</span>
          )}
        </label>
      )}
      <InputRoot
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        hasError={invalid}
        className={rootClassName}
      >
        {prefix != null && <InputAffix>{prefix}</InputAffix>}
        <InputWrapper>
          {leadingIcon && <InputIcon>{leadingIcon}</InputIcon>}
          {inlineStart != null && (
            <InputInlineAffix>{inlineStart}</InputInlineAffix>
          )}
          <InputControl
            {...props}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={description}
            className={inputClassName}
          />
          {inlineEnd != null && (
            <InputInlineAffix>{inlineEnd}</InputInlineAffix>
          )}
          {trailingIcon && <InputIcon>{trailingIcon}</InputIcon>}
          {trailingAction}
        </InputWrapper>
        {suffix != null && <InputAffix>{suffix}</InputAffix>}
      </InputRoot>
      {message && (
        <p
          id={`${id}-description`}
          className="oreo-input-hint"
          data-error={Boolean(error) || undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}
