export function CutScissors() {
  return <svg viewBox="0 0 36 30" fill="none" aria-hidden="true">
    <g className="cut-reveal__blade cut-reveal__blade--upper"><circle cx="9" cy="7" r="4" /><path d="m12 10 20 14" /></g>
    <g className="cut-reveal__blade cut-reveal__blade--lower"><circle cx="9" cy="23" r="4" /><path d="M12 20 32 6" /></g>
    <circle cx="19" cy="15" r="1.5" fill="currentColor" stroke="none" />
  </svg>;
}
export function LoadingMark() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M10 6H22V26H10V6ZM6 10H26M6 22H26M14 6V26M18 6V26" stroke="currentColor" strokeWidth="1.25" /></svg>;
}
export function IntegrationSyncGlyph() { return <svg viewBox="0 0 32 32" className="size-8"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" /><path className="integration-sweep" d="M16 16V7a9 9 0 0 1 9 9Z" fill="currentColor" /></svg>; }
export function TriangleMark() { return <svg viewBox="0 0 16 16" className="size-3" fill="currentColor"><path d="M8 2 15 14H1Z" /></svg>; }
export function StopGlyph() { return <span aria-hidden="true" className="size-2.5 rounded-[1px] bg-[var(--color-text-on-inverse)]" />; }
