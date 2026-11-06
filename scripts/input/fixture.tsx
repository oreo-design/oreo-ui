import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  Input,
  PasswordInput,
  TagInput,
  CounterInput,
  DateInput,
  PaymentInput,
} from "../../src/components/input";
import { Button } from "../../src/components/button";
import "../../src/index.css";
function Fixture() {
  const [result, setResult] = useState("");
  const [disabled, setDisabled] = useState(false);
  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1>Real-component form fixture</h1>
      <Button onClick={() => setDisabled((v) => !v)}>Toggle disabled</Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(JSON.stringify([...new FormData(e.currentTarget)]));
        }}
        className="space-y-5"
      >
        <Input
          label="Native name"
          name="name"
          defaultValue="Ada"
          disabled={disabled}
        />
        <PasswordInput
          label="Native password"
          name="password"
          defaultValue="Initial9"
          showStrength
          disabled={disabled}
        />
        <TagInput
          label="Native tags"
          name="tag"
          required
          defaultValue={["Berlin"]}
          disabled={disabled}
        />
        <CounterInput
          label="Bounded counter"
          name="count"
          defaultValue={1}
          minValue={0}
          maxValue={2}
          isDisabled={disabled}
        />
        <DateInput label="Native date" name="date" isDisabled={disabled} />
        <PaymentInput label="Native card" name="card" disabled={disabled} />
        <div className="flex gap-3">
          <Button htmlType="submit">Submit fixture</Button>
          <Button htmlType="reset" type="secondary">
            Reset fixture
          </Button>
        </div>
      </form>
      <output aria-label="Form data">{result}</output>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
