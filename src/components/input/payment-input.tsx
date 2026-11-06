import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { usePaymentInputs } from "react-payment-inputs";
import { Input, type InputProps } from "./input";
import { Icon } from "@/components/icon";
type PaymentInputProps = Omit<InputProps, "type" | "leadingIcon" | "inlineEnd">;
/** Formatting and caret behavior use the reference engine; no card data is sent. */
function PaymentField({
  onChange,
  onBlur,
  onKeyPress,
  onFocus,
  error,
  hint,
  ref,
  ...props
}: PaymentInputProps) {
  const { getCardNumberProps, meta } = usePaymentInputs();
  // DefinitelyTyped omits the runtime ref returned by this library version.
  const cardProps = getCardNumberProps({
    onChange,
    onBlur,
    onKeyPress,
    onFocus,
  }) as ComponentProps<"input">;
  return (
    <Input
      {...cardProps}
      {...props}
      size={props.size}
      name={props.name}
      aria-label={props["aria-label"]}
      ref={(node) => {
        const engineRef = cardProps.ref;
        if (typeof engineRef === "function") engineRef(node);
        else if (engineRef) engineRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      }}
      inputMode="numeric"
      autoComplete="cc-number"
      placeholder={props.placeholder ?? "0000 0000 0000 0000"}
      leadingIcon={<Icon name="credit-card" />}
      inlineEnd={
        <span className="oreo-input-card-brand" aria-live="polite">
          {meta.cardType?.displayName ?? "Card"}
        </span>
      }
      error={
        error ||
        (meta.isTouched && meta.erroredInputs.cardNumber
          ? meta.erroredInputs.cardNumber
          : undefined)
      }
      hint={hint}
    />
  );
}
export function PaymentInput(props: PaymentInputProps) {
  const id = useId();
  const host = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    const form = host.current?.querySelector("input")?.form;
    if (!form) return;
    const reset = (event: Event) =>
      queueMicrotask(() => {
        if (!event.defaultPrevented) setResetKey((n) => n + 1);
      });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, []);
  return (
    <div ref={host} className="min-w-0 w-full">
      <PaymentField key={resetKey} {...props} id={props.id ?? id} />
    </div>
  );
}
