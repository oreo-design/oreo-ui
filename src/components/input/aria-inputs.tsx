import { useContext } from "react";
import { ThemePortalTypography } from "@/lib/theme/ThemeScope";
import {
  DateField,
  DateInput as AriaDateInput,
  DateSegment,
  Label,
  Text,
  FieldError,
  NumberField,
  Group,
  Input as AriaInput,
  Button as AriaButton,
  Select,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  type DateValue,
  type DateFieldProps,
  type NumberFieldProps,
} from "react-aria-components";
import { InputRoot, InputIcon, type InputSize } from "./input";
import { Icon } from "@/components/icon";
import { iconButton } from "@/components/button/icon-button";
import { menu } from "@/components/menu/menu.variants";
import { PortalContainerContext } from "@/lib/portal-container";
import { cn } from "@/lib/cn";
type FieldContent = {
  label: string;
  hint?: string;
  error?: string;
  size?: InputSize;
};
export function DateInput<T extends DateValue>({
  label,
  hint,
  error,
  size = "md",
  className,
  ...props
}: DateFieldProps<T> & FieldContent) {
  return (
    <DateField
      {...props}
      isInvalid={Boolean(error) || props.isInvalid}
      className={(state) =>
        cn(
          "oreo-input-field",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <Label className="oreo-input-label">
        {label}
        {props.isRequired && <span aria-hidden="true"> *</span>}
      </Label>
      <InputRoot
        size={size}
        disabled={props.isDisabled}
        readOnly={props.isReadOnly}
        hasError={Boolean(error) || props.isInvalid}
      >
        <div className="oreo-input-wrapper">
          <InputIcon>
            <Icon name="calendar" />
          </InputIcon>
          <AriaDateInput className="oreo-input-date-segments">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="oreo-input-date-segment"
              />
            )}
          </AriaDateInput>
        </div>
      </InputRoot>
      {(error || hint) && (
        <>
          {error ? (
            <FieldError className="oreo-input-hint" data-error>
              {error}
            </FieldError>
          ) : (
            <Text slot="description" className="oreo-input-hint">
              {hint}
            </Text>
          )}
        </>
      )}
    </DateField>
  );
}
export function CounterInput({
  label,
  hint,
  error,
  size = "md",
  className,
  ...props
}: NumberFieldProps & FieldContent) {
  return (
    <NumberField
      {...props}
      isInvalid={Boolean(error) || props.isInvalid}
      className={(state) =>
        cn(
          "oreo-input-field",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <Label className="oreo-input-label">
        {label}
        {props.isRequired && <span aria-hidden="true"> *</span>}
      </Label>
      <InputRoot
        size={size}
        disabled={props.isDisabled}
        readOnly={props.isReadOnly}
        hasError={Boolean(error) || props.isInvalid}
      >
        <Group className="oreo-input-wrapper">
          <AriaButton
            slot="decrement"
            className={cn(
              iconButton({ type: "tertiary", size: "sm" }),
              "oreo-input-action",
            )}
          >
            <Icon name="minus" />
          </AriaButton>
          <AriaInput className="oreo-input-control text-center" />
          <AriaButton
            slot="increment"
            className={cn(
              iconButton({ type: "tertiary", size: "sm" }),
              "oreo-input-action",
            )}
          >
            <Icon name="plus" />
          </AriaButton>
        </Group>
      </InputRoot>
      {(error || hint) && (
        <>
          {error ? (
            <FieldError className="oreo-input-hint" data-error>
              {error}
            </FieldError>
          ) : (
            <Text slot="description" className="oreo-input-hint">
              {hint}
            </Text>
          )}
        </>
      )}
    </NumberField>
  );
}
export type InputSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  disabled?: boolean;
};
export function InputSelect({
  label,
  value,
  onValueChange,
  options,
  disabled,
}: InputSelectProps) {
  const container = useContext(PortalContainerContext);
  const styles = menu();
  return (
    <Select
      aria-label={label}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key !== null) onValueChange(String(key));
      }}
      isDisabled={disabled}
    >
      <AriaButton className="oreo-input-select oreo-focus">
        <SelectValue>{({ selectedText }) => selectedText}</SelectValue>
        <Icon name="chevron-down" size="sm" />
      </AriaButton>
      <Popover
        UNSTABLE_portalContainer={container ?? undefined}
        className={cn(styles.popup(), "oreo-input-select-popover")}
      >
        <ThemePortalTypography>
          <ListBox items={options} className="outline-none">
            {(option) => (
              <ListBoxItem
                id={option.value}
                textValue={option.label}
                aria-label={option.label}
                className={cn(styles.item(), "oreo-input-select-item")}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && <Icon name="check" size="sm" />}
              </ListBoxItem>
            )}
          </ListBox>
        </ThemePortalTypography>
      </Popover>
    </Select>
  );
}
