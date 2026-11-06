import { useState, type ReactNode } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import {
  Input,
  InputRoot,
  InputWrapper,
  InputControl,
  InputIcon,
  InputAffix,
  InputInlineAffix,
  PasswordInput,
  TagInput,
  PaymentInput,
  DateInput,
  CounterInput,
  InputSelect,
} from "@/components/input";
import { Icon } from "@/components/icon";
import { Button, IconButton } from "@/components/button";
import { Shortcut } from "@/components/shortcut";
import { ComponentRules } from "@/docs/ComponentRules";
import { inputRules } from "@/components/input/rules";
function Example({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="space-y-4 rounded-card-medium border border-border-subtle bg-bg-base p-6"
    >
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
        {children}
      </div>
    </section>
  );
}
export function InputExamples() {
  const [currency, setCurrency] = useState("EUR");
  const [permission, setPermission] = useState("view");
  const [share, setShare] = useState("https://oreo-ui.com");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="input-examples">
      <Example id="basic" title="01 · Default, hover and focus">
        <Input
          label="Name"
          placeholder="Enter your name"
          hint="Click the field padding or icon to focus. Tab follows the native order."
        />
      </Example>
      <Example id="icons" title="02 · Leading and trailing icons">
        <Input
          aria-label="Search with leading icon"
          placeholder="Search..."
          leadingIcon={<Icon name="search" />}
        />
        <Input
          aria-label="Email with trailing icon"
          placeholder="hello@oreo-ui.com"
          trailingIcon={<Icon name="at" />}
        />
      </Example>
      <Example id="sizes" title="03 · Three Oreo control sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Input
            key={size}
            size={size}
            aria-label={`${size} input`}
            placeholder={`${size} · Oreo control scale`}
            leadingIcon={<Icon name="search" />}
          />
        ))}
      </Example>
      <Example id="affixes" title="04 · Separated prefixes and suffixes">
        <Input label="Website" prefix="https://" placeholder="example.com" />
        <Input
          label="Email username"
          suffix="@gmail.com"
          placeholder="your.name"
        />
      </Example>
      <Example id="inline-affix" title="05 · Inline affix">
        <Input
          label="Amount"
          inlineStart="€"
          placeholder="0.00"
          inputMode="decimal"
        />
      </Example>
      <Example id="label-hint" title="06 · Label, requirement and hint">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="hello@oreo-ui.com"
          hint="Use the address where you want to receive updates."
        />
        <Input label="Company" optional placeholder="Company name" />
      </Example>
      <Example id="keyboard" title="07 · Keyboard hint">
        <Input
          label="Search"
          type="search"
          placeholder="Search..."
          leadingIcon={<Icon name="search" />}
          inlineEnd={<Shortcut keys={["1"]} size="sm" />}
          hint="The keycap is a hint; your application owns shortcut registration."
        />
      </Example>
      <Example id="password" title="08 · Password visibility">
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          hint="Reveal without changing your value or caret position."
        />
      </Example>
      <Example id="strength" title="09 · Password requirements">
        <PasswordInput
          label="New password"
          placeholder="Choose a password"
          autoComplete="new-password"
          showStrength
        />
      </Example>
      <Example id="disabled" title="10 · Disabled and read only">
        <Input
          label="Disabled"
          placeholder="Unavailable"
          disabled
          leadingIcon={<Icon name="lock" />}
        />
        <Input
          label="Read only"
          defaultValue="You can select and copy this"
          readOnly
        />
      </Example>
      <Example id="error" title="11 · Error and recovery">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          noValidate
          className="space-y-3"
        >
          <Input
            label="Recovery email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={
              submitted && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
                ? "Enter a valid email address."
                : undefined
            }
            hint="Submit an empty value, then correct it."
          />
          <Button size="sm" htmlType="submit">
            Check email
          </Button>
        </form>
        <Input
          aria-label="Error state"
          placeholder="Invalid value"
          hasError
          leadingIcon={<Icon name="warning-circle" />}
        />
      </Example>
      <Example id="with-button" title="12 · Attached button">
        <Input
          label="Share link"
          value={share}
          onChange={(e) => {
            setShare(e.target.value);
            setCopied(false);
          }}
          suffix={
            <IconButton
              type="tertiary"
              size="sm"
              aria-label={copied ? "Link copied" : "Copy link"}
              icon={<Icon name={copied ? "check" : "copy"} />}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(share);
                  setCopied(true);
                  setCopyError("");
                } catch {
                  setCopyError("Copy unavailable. Select and copy the link.");
                }
              }}
            />
          }
          hint={copied ? "Link copied." : "Copy the current value."}
          error={copyError}
        />
      </Example>
      <Example id="payment" title="13 · Payment formatting">
        <PaymentInput
          label="Card number"
          required
          hint="Demo only. Use a test card such as 4242 4242 4242 4242."
        />
      </Example>
      <Example id="with-select" title="14 · Attached select">
        <Input
          label="Price"
          placeholder="0.00"
          inputMode="decimal"
          inlineStart={{ EUR: "€", USD: "$", TRY: "₺" }[currency]}
          suffix={
            <InputSelect
              label="Currency"
              value={currency}
              onValueChange={setCurrency}
              options={[
                { value: "EUR", label: "EUR" },
                { value: "USD", label: "USD" },
                { value: "TRY", label: "TRY" },
              ]}
            />
          }
        />
      </Example>
      <Example id="inline-select" title="15 · Inline select">
        <Input
          label="Invite person"
          placeholder="Email address"
          type="email"
          inlineEnd={
            <InputSelect
              label="Permission"
              value={permission}
              onValueChange={setPermission}
              options={[
                { value: "view", label: "Can view" },
                { value: "edit", label: "Can edit" },
              ]}
            />
          }
        />
      </Example>
      <Example id="tags" title="16 · Add and remove tags">
        <TagInput
          label="Tags"
          placeholder="Add tags..."
          defaultValue={["Berlin", "London", "Paris"]}
          hint="Enter adds a tag. Remove buttons are keyboard accessible."
        />
      </Example>
      <Example id="date" title="17 · Segmented date">
        <DateInput
          label="Date"
          hint="Type a segment, use arrows to adjust, or move between segments. Order follows your locale."
        />
      </Example>
      <Example id="counter" title="18 · Counter">
        <CounterInput
          label="Quantity"
          defaultValue={16}
          minValue={0}
          isRequired
          hint="Use arrows, type a number, or press and hold the step buttons."
        />
      </Example>
      <Example id="composition" title="19 · Compose the primitives">
        <label htmlFor="composed-domain" className="oreo-input-label">
          Custom domain
        </label>
        <InputRoot>
          <InputAffix>https://</InputAffix>
          <InputWrapper>
            <InputIcon>
              <Icon name="globe" />
            </InputIcon>
            <InputControl id="composed-domain" placeholder="your-site" />
            <InputInlineAffix>.com</InputInlineAffix>
          </InputWrapper>
        </InputRoot>
      </Example>
    </div>
  );
}
export function InputDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Input"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "examples", label: "Examples" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              A field for every detail.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              Text, passwords, amounts, tags and dates. Familiar interactions
              built on Oreo’s surfaces, typography and control scale.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Interaction reference:{" "}
              <a
                className="underline"
                href="https://www.alignui.com/docs/v1.2/ui/input"
              >
                Align UI Input v1.2
              </a>
              . Oreo keeps its quiet border focus, tokens and native form
              semantics.
            </p>
          </header>
          <Section
            id="examples"
            title="Try every interaction"
            description="Each example renders the reusable component. Values stay local to this page."
          >
            <InputExamples />
          </Section>
          <Section id="usage" title="Start simple. Compose when needed.">
            <CodeBlock
              code={`import { Input, PasswordInput } from "@/components/input";

<Input label="Email" name="email" type="email" required
  placeholder="hello@example.com" hint="We will send updates here." />
<PasswordInput label="Password" name="password" autoComplete="new-password" showStrength />`}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Input forwards native input props and refs. className styles the
              field layout; rootClassName styles its border surface;
              inputClassName styles the editor. For a lightweight text-only
              consumer, import from @/components/input/input. Date and Counter
              use React Aria; Payment uses react-payment-inputs for formatting
              and caret behavior. No payment or validation request is sent.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "size",
                  type: '"sm" | "md" | "lg"',
                  def: '"md"',
                  desc: "Oreo’s 7 / 8 / 10 spacing-unit control heights.",
                },
                {
                  prop: "label / hint / error / optional",
                  type: "ReactNode / boolean",
                  desc: "Associated label and description; error takes precedence over hint. Required suppresses optional copy.",
                },
                {
                  prop: "leadingIcon / trailingIcon",
                  type: "ReactNode",
                  desc: "Decorative icons inherit empty, hover, focus, filled and disabled colors.",
                },
                {
                  prop: "prefix / suffix / inlineStart / inlineEnd",
                  type: "ReactNode",
                  desc: "Separated or inline adornments; use InputSelect for independent choices.",
                },
                {
                  prop: "disabled / readOnly / hasError",
                  type: "boolean",
                  desc: "Disabled suppresses actions; read only preserves selection. Error keeps its semantic border on focus.",
                },
                {
                  prop: "value / defaultValue / onChange / ref",
                  type: "Native input props",
                  desc: "Controlled or uncontrolled values, form data, reset and input ref.",
                },
                {
                  prop: "PasswordInput.showStrength",
                  type: "boolean",
                  desc: "Three live requirements. This checklist is not a security score.",
                },
                {
                  prop: "TagInput.value / onValueChange",
                  type: "string[] / callback",
                  desc: "Enter adds trimmed unique tags; IME composition never submits a tag.",
                },
                {
                  prop: "DateInput / CounterInput",
                  type: "React Aria field props",
                  desc: "isDisabled, isReadOnly, isRequired, minValue/maxValue and localized keyboard editing.",
                },
              ]}
            />
          </Section>
          <ComponentRules rule={inputRules} />
        </>
      )}
    </DocsPage>
  );
}
