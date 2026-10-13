import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { SettingsCard, SettingsPageHeader, SettingsRow, SettingsSelect } from "@/patterns/settings";
import { SettingsGroup } from "@/patterns/settings/language/SettingsGroup";
import { AdaptiveRow, SettingsFlow } from "@/patterns/settings/language/AdaptiveRow";
import type { RecipeProps } from "./recipes";

/** Transfer probe, authored after the integration row. No new frame, token,
 * CSS override or AdaptiveRow option is introduced for the export workflow. */
export function ExportRecipe({ inherited, stress, fail }: RecipeProps) {
  const [format, setFormat] = useState("JSON");
  const [phase, setPhase] = useState<"idle" | "preparing" | "ready" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const downloadURL = useRef<string | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (downloadURL.current) URL.revokeObjectURL(downloadURL.current);
  }, []);
  function prepare() {
    if (timer.current) return;
    setPhase("preparing");
    timer.current = setTimeout(() => { timer.current = null; setPhase(fail ? "error" : "ready"); }, 700);
  }
  function download() {
    const fixture = { workspace: "Aster", sample: true, projects: ["Brand refresh", "Website"] };
    const content = format === "JSON" ? JSON.stringify(fixture, null, 2) : "workspace,project\nAster,Brand refresh\nAster,Website\n";
    if (downloadURL.current) URL.revokeObjectURL(downloadURL.current);
    downloadURL.current = URL.createObjectURL(new Blob([content], { type: format === "JSON" ? "application/json" : "text/csv" }));
    const a = document.createElement("a"); a.href = downloadURL.current; a.download = `aster-sample.${format.toLowerCase()}`; a.click();
  }
  const actions = <Button size="sm" type="secondary" disabled={phase === "preparing"} aria-busy={phase === "preparing"} onClick={phase === "ready" ? download : prepare}>
    <span className="settings-stable-label">{["Prepare export", "Preparing…", "Download", "Try again"].map(label => <span key={label} aria-hidden={label !== ({ idle: "Prepare export", preparing: "Preparing…", ready: "Download", error: "Try again" }[phase])}>{label}</span>)}</span>
  </Button>;
  const detail = <div role="status">{phase === "preparing" ? "Preparing your sample workspace…" : phase === "ready" ? "Ready to download · 2 sample projects · No personal data" : phase === "error" ? "Couldn't prepare this export. Try again when you're ready." : ""}</div>;
  const description = stress ? "Download an independent copy of your workspace's project data, including project names and workspace information. This preview downloads sample data only. 导出只包含演示数据，完整说明应保持可读。" : "Download a small sample of your workspace data.";
  const Row = inherited ? AdaptiveRow : SettingsRow;
  return <SettingsFlow>
    <SettingsPageHeader title="Your data" description="Easy to bring in. Just as easy to take with you." />
    <SettingsGroup label="Export workspace">
      <SettingsCard>
        <Row title="File format" description="Choose the format that works for you." control={<SettingsSelect responsive={inherited} disabled={phase === "preparing"} aria-label="Export format" value={format} options={["JSON", "CSV"]} onChange={next => { setFormat(next); setPhase("idle"); }} />} />
        {inherited ? <AdaptiveRow title="Workspace archive" description={description} media={<Icon name="folder" />} control={actions} detail={phase !== "idle" ? detail : undefined} /> : <SettingsRow title="Workspace archive" description={<>{description}{detail}</>} control={actions} />}
      </SettingsCard>
    </SettingsGroup>
  </SettingsFlow>;
}
