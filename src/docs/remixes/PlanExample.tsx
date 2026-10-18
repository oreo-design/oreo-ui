import { useEffect, useState } from "react";
import { Plan, PlanStep } from "@/components/plan";
import { Action, Status, type ExampleProps } from "./shared";
import { canRunStep, type StepState } from "./model";

const labels = ["Read the sample notes", "Check the evidence", "Prepare the summary"];
export function PlanExample({ mode, stress }: ExampleProps) {
  const [states, setStates] = useState<StepState[]>(mode === "capability" ? ["pending", "pending", "pending"] : ["done", "pending", "pending"]);
  const [attempts, setAttempts] = useState([0, 0, 0]);
  const active = states.indexOf("running");
  useEffect(() => {
    if (active < 0) return;
    const timer = setTimeout(() => setStates(current => current.map((s, i) => i === active ? active === 1 && attempts[1] === 1 ? "failed" : "done" : s)), 700);
    return () => clearTimeout(timer);
  }, [active, attempts]);
  const run = (index: number) => {
    if (!canRunStep(states, index) || active >= 0) return;
    setAttempts(a => a.map((n, i) => i === index ? n + 1 : n));
    setStates(s => s.map((v, i) => i === index ? "running" : v));
  };
  const complete = states.every(s => s === "done");
  return <div className="remix-stack">
    {mode === "style" && <><p className="remix-eyebrow">Working through your request</p><h3 className="remix-editorial">One thoughtful step at a time.</h3></>}
    <Plan title="Research summary" className="remix-plan">
      {states.map((state, i) => <PlanStep key={i} status={state === "done" ? "done" : state === "running" ? "active" : "pending"}>
        <div className="remix-step"><div>{labels[i]}{stress && " across all research workstreams, including accessibility and localization"}{mode === "capability" && <small>{state === "failed" ? "Demo evidence check failed. Retry to continue." : state === "done" ? "Complete" : state === "running" ? "Running demo…" : i > 0 && states[i - 1] !== "done" ? `Waiting for step ${i}` : "Ready"}</small>}</div>
          {mode === "capability" && state !== "done" && <Action disabled={!canRunStep(states, i) || active >= 0} onClick={() => run(i)} aria-label={`${state === "failed" ? "Retry" : "Run"} step ${i + 1}`}>{state === "failed" ? "Retry" : "Run"}</Action>}
        </div>
      </PlanStep>)}
    </Plan>
    {mode !== "capability" && <Action disabled={complete} onClick={() => setStates(s => { const next = s.indexOf("pending"); return s.map((v, i) => i === next ? "done" : v); })}>Complete next step</Action>}
    <Status>{complete ? "Demo summary ready. All steps complete." : states.includes("failed") ? "Step 2 failed in the fixture. Step 3 stays locked until retry succeeds." : active >= 0 ? `Running step ${active + 1} locally…` : mode === "capability" ? "Run each step in order. Step 2 deliberately fails once." : "Use the control to advance this sample plan."}</Status>
    <Action onClick={() => { setStates(["pending", "pending", "pending"]); setAttempts([0, 0, 0]); }}>Reset plan</Action>
  </div>;
}
