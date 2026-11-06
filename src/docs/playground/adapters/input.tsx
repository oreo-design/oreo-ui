import {
  Input,
  PasswordInput,
  TagInput,
  PaymentInput,
  DateInput,
  CounterInput,
} from "@/components/input";
import { Icon } from "@/components/icon";
import { definePlayground as define, select, text, toggle } from "../schema";
import { playgroundCode } from "../code";
const exports = {
  input: {
    Input,
    PasswordInput,
    TagInput,
    PaymentInput,
    DateInput,
    CounterInput,
  },
  icon: { Icon },
};
const spec = define(
  "Input",
  {
    kind: select(
      ["text", "password", "tags", "payment", "date", "counter"],
      "text",
    ),
    label: text("Email address"),
    placeholder: text("hello@oreo-ui.com"),
    value: text(""),
    size: select(["sm", "md", "lg"], "md"),
    hint: text("A small detail, clearly entered."),
    error: text(""),
    disabled: toggle(),
    readOnly: toggle(),
    required: toggle(),
    optional: toggle(),
    leadingIcon: toggle(true),
    trailingIcon: toggle(),
    prefix: text(""),
    suffix: text(""),
  },
  (v, set) => {
    const common = {
      label: v.label,
      size: v.size,
      hint: v.hint,
      error: v.error,
      disabled: v.disabled,
      readOnly: v.readOnly,
      required: v.required,
    };
    if (v.kind === "date")
      return (
        <div className="w-80 max-w-full">
          <DateInput
            label={v.label}
            size={v.size}
            hint={v.hint}
            error={v.error}
            isDisabled={v.disabled}
            isReadOnly={v.readOnly}
            isRequired={v.required}
          />
        </div>
      );
    if (v.kind === "counter")
      return (
        <div className="w-80 max-w-full">
          <CounterInput
            label={v.label}
            size={v.size}
            hint={v.hint}
            error={v.error}
            isDisabled={v.disabled}
            isReadOnly={v.readOnly}
            isRequired={v.required}
            defaultValue={16}
            minValue={0}
          />
        </div>
      );
    if (v.kind === "tags")
      return (
        <div className="w-80 max-w-full">
          <TagInput
            {...common}
            placeholder="Add tags..."
            defaultValue={["Berlin", "London", "Paris"]}
          />
        </div>
      );
    if (v.kind === "payment")
      return (
        <div className="w-80 max-w-full">
          <PaymentInput {...common} />
        </div>
      );
    const native = {
      ...common,
      value: v.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        set("value", e.target.value),
      placeholder: v.placeholder,
    };
    return (
      <div className="w-80 max-w-full">
        {v.kind === "password" ? (
          <PasswordInput {...native} showStrength />
        ) : (
          <Input
            {...native}
            optional={v.optional}
            leadingIcon={v.leadingIcon ? <Icon name="at" /> : undefined}
            trailingIcon={v.trailingIcon ? <Icon name="info" /> : undefined}
            prefix={v.prefix || undefined}
            suffix={v.suffix || undefined}
          />
        )}
      </div>
    );
  },
);
spec.source = "input";
spec.exports = exports;
spec.exportRecipe = (v) => {
  const props = {
    label: String(v.label),
    size: v.size as "sm" | "md" | "lg",
    hint: String(v.hint),
    error: String(v.error),
    disabled: Boolean(v.disabled),
    readOnly: Boolean(v.readOnly),
    required: Boolean(v.required),
  };
  const native = {
    ...props,
    defaultValue: String(v.value),
    placeholder: String(v.placeholder),
  };
  const component =
    v.kind === "password" ? (
      <PasswordInput {...native} showStrength />
    ) : v.kind === "tags" ? (
      <TagInput
        {...props}
        placeholder="Add tags..."
        defaultValue={["Berlin", "London", "Paris"]}
      />
    ) : v.kind === "payment" ? (
      <PaymentInput {...props} />
    ) : v.kind === "date" ? (
      <DateInput
        label={props.label}
        size={props.size}
        hint={props.hint}
        error={props.error}
        isDisabled={props.disabled}
        isReadOnly={props.readOnly}
        isRequired={props.required}
      />
    ) : v.kind === "counter" ? (
      <CounterInput
        label={props.label}
        size={props.size}
        hint={props.hint}
        error={props.error}
        isDisabled={props.disabled}
        isReadOnly={props.readOnly}
        isRequired={props.required}
        defaultValue={16}
        minValue={0}
      />
    ) : (
      <Input
        {...native}
        optional={Boolean(v.optional)}
        leadingIcon={v.leadingIcon ? <Icon name="at" /> : undefined}
        trailingIcon={v.trailingIcon ? <Icon name="info" /> : undefined}
        prefix={String(v.prefix) || undefined}
        suffix={String(v.suffix) || undefined}
      />
    );
  return playgroundCode(component, exports);
};
export default { input: spec };
