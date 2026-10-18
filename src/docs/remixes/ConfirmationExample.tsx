import { useState } from "react";
import { Confirmation, type ConfirmationState } from "@/components/confirmation";
import { Action, Status, type ExampleProps } from "./shared";

const operations = ["Read sample research", "Create a local summary", "Archive sample notes"];
export function ConfirmationExample({ mode, stress }: ExampleProps) {
  const [state, setState] = useState<ConfirmationState>("pending");
  const [allowed, setAllowed] = useState([true, true, false]);
  const [executed, setExecuted] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const capability = mode === "capability";
  const selected = operations.filter((_, i) => allowed[i]);
  return <div className="remix-stack">
    {mode === "style" && <><p className="remix-eyebrow">Before we continue</p><h3 className="remix-editorial">You're in control.</h3></>}
    <Confirmation className="remix-permission" state={state}
      title={capability ? "Choose what this demo may do" : "Allow access to the sample notes?"}
      description={stress ? "Review the sample research and prepare a summary with citations, keeping the original notes available for comparison. No external service, account, file or permission is changed by this demonstration." : "Review the sample notes before creating a local summary. Demo only."}
      approveLabel={capability ? `Run ${selected.length} selected` : "Allow once"} denyLabel="Decline"
      approvedLabel={capability ? `${executed.length} demo operations completed` : "Allowed in this demo"} deniedLabel="Declined · nothing ran"
      onApprove={() => {
        if (capability && !selected.length) { setNotice("Select at least one operation, or decline."); return; }
        setExecuted(capability ? selected : [operations[0]]); setState("approved"); setNotice("Demo complete. No real permission was granted.");
      }} onDeny={() => { setState("denied"); setNotice("Nothing ran."); }}>
      {capability ? <fieldset disabled={state !== "pending"} className="remix-options"><legend className="remix-help">Permission applies only to checked operations.</legend>{operations.map((operation, i) => <label key={operation}><input type="checkbox" checked={allowed[i]} onChange={e => { setAllowed(a => a.map((v, index) => index === i ? e.target.checked : v)); setNotice(""); }} /><span>{operation}<small>{i === 2 ? "Optional · changes the local sample list" : "Only this session"}</small></span></label>)}</fieldset> : <div className="remix-callout"><span className="remix-eyebrow">SAMPLE WORKSPACE</span><p>research / onboarding-notes</p></div>}
    </Confirmation>
    {state === "approved" && capability && <div className="remix-callout"><strong>Execution receipt</strong><ul>{operations.map(op => <li key={op}>{executed.includes(op) ? "Completed" : "Skipped"} · {op}</li>)}</ul></div>}
    {capability && <section className="remix-callout" aria-label="Sample workspace"><strong>Sample workspace</strong><p>{executed.includes(operations[2]) ? "Notes archived · 0 active notes, 1 archived" : "1 active note · onboarding-notes"}</p>{executed.includes(operations[0]) && <p>Read result: 8 synthetic interview notes available.</p>}{executed.includes(operations[1]) && <p>Summary created: participants asked for a worked example before starting.</p>}</section>}
    <Status>{notice || "Waiting for your decision."}</Status>
    {state !== "pending" && <Action onClick={() => { setState("pending"); setExecuted([]); setNotice(state === "approved" ? "Undone. Local sample restored; permissions cleared." : "Ready for a new decision."); setAllowed([true, true, false]); }}>{state === "approved" && capability ? "Undo demo operations" : "Try again"}</Action>}
  </div>;
}
