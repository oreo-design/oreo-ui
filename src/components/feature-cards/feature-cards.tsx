import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { tv } from "@/lib/tv";
import { GradientMask } from "@/components/gradient-mask";
import { Icon } from "@/components/icon";

const surface = tv({ base: "rounded-card-medium border border-border-default bg-bg-surface text-text-primary", variants: { padding: { normal: "p-6 sm:p-8", compact: "p-5" } }, defaultVariants: { padding: "normal" } });

export type LayeredCardProps = ComponentPropsWithoutRef<"div"> & { fade?: boolean };
/** Decorative sheets share the front card's silhouette; only the front is exposed to assistive technology. */
export function LayeredCard({ children, fade = false, className, ...props }: LayeredCardProps) {
  const card = <div className={cn("relative isolate pt-4", className)} {...props}>
    <div aria-hidden="true" className={cn(surface(), "absolute inset-x-4 top-0 bottom-8 -z-10 bg-bg-elevated")} />
    <div aria-hidden="true" className={cn(surface(), "absolute inset-x-2 top-2 bottom-4 -z-10 bg-bg-elevated")} />
    <div className={cn(surface(), "relative shadow-[var(--shadow-default)]")}>{children}</div>
  </div>;
  return fade ? <GradientMask start={58} end={100}>{card}</GradientMask> : card;
}

export type InvoicePreviewProps = {
  number?: string; amount?: string; due?: string; recipient?: string; sender?: string; address?: string;
  mark?: ReactNode; fade?: boolean; className?: string;
};
export function InvoicePreview({ number = "INV-456789", amount = "$284,342.57", due = "Due in 15 days", recipient, sender, address, mark, fade = false, className }: InvoicePreviewProps) {
  return <LayeredCard fade={fade} className={className}><div className="relative min-h-60">
    <div className="mb-5 text-palette-purple-text" aria-hidden="true">{mark ?? <Icon name="copy" className="size-6" />}</div>
    <div aria-hidden="true" className="absolute top-0 right-0 hidden h-16 w-14 rounded-control-large border border-border-subtle bg-bg-base p-2.5 shadow-[var(--shadow-active)] sm:block">
      <div className="mb-2 flex items-center gap-1"><span className="size-2 rounded-full bg-state-press" /><span className="h-1 w-5 rounded bg-state-press" /></div>
      {["w-8", "w-7", "w-full", "w-9"].map((width, i) => <div key={i} className={cn("mb-1 h-0.5 rounded bg-state-press", width)} />)}
      <span className="float-right font-serif text-xs italic">A.</span>
    </div>
    <p className="font-mono text-xs sm:text-sm">{number}</p>
    <p className="mt-2 break-words font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{amount}</p>
    <p className="mt-1 text-sm">{due}</p>
    <dl className="mt-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-3 text-sm text-text-secondary">
      {([['To', recipient], ['From', sender], ['Address', address]] as const).map(([label, value], i) => <div key={label} className="contents"><dt>{label}</dt><dd className="min-w-0 break-words">{value ?? <><span className="sr-only">Not provided</span><span aria-hidden="true" className={cn("mt-1.5 block h-2 rounded-full bg-state-press", i === 0 ? "w-2/5" : i === 1 ? "w-full" : "w-3/4")} /></>}</dd></div>)}
    </dl>
  </div></LayeredCard>;
}

export type UsageSegment = { label: string; value: number; tone?: "purple" | "blue" | "mint"; detail?: string };
const tones = { purple: "bg-palette-purple-text", blue: "bg-status-progress", mint: "bg-palette-mint-text" };
/** Clamp invalid values and proportionally normalize totals above 100. */
export function normalizeUsage(segments: UsageSegment[]) {
  const valid = segments.map(segment => ({ ...segment, value: Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0 }));
  const total = valid.reduce((sum, segment) => sum + segment.value, 0);
  const scale = total > 100 ? 100 / total : 1;
  return valid.map(segment => ({ ...segment, value: segment.value * scale }));
}
export type SegmentedUsageProps = { segments: UsageSegment[]; label?: string; className?: string };
export function SegmentedUsage({ segments, label = "Usage", className }: SegmentedUsageProps) {
  const normalized = normalizeUsage(segments);
  const used = Math.round(normalized.reduce((sum, segment) => sum + segment.value, 0) * 10) / 10;
  return <div className={className}>
    <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={used} aria-valuetext={`${used}% used. ${normalized.map(s => `${s.label}: ${Math.round(s.value * 10) / 10}%`).join(", ")}`} className="flex h-5 overflow-hidden rounded-control-large bg-bg-elevated">
      {normalized.map((segment, index) => <div key={index} className={cn("h-full shrink-0", tones[segment.tone ?? "purple"])} style={{ width: `${segment.value}%` }} />)}
      <div aria-hidden="true" className="min-w-0 flex-1 bg-[repeating-linear-gradient(90deg,var(--color-border-default)_0_1px,transparent_1px_3px)]" />
    </div>
    <dl className="mt-5 flex gap-8"><div className="flex flex-col"><dt className="mt-1 text-sm text-text-secondary">Used</dt><dd className="order-first text-2xl tabular-nums">{used}%</dd></div><div className="flex flex-col"><dt className="mt-1 text-sm text-text-secondary">Free</dt><dd className="order-first text-2xl tabular-nums">{Math.round((100 - used) * 10) / 10}%</dd></div></dl>
  </div>;
}
export type UsageSummaryProps = Omit<SegmentedUsageProps, "label"> & { title?: string; description?: string; highlight?: string; fade?: boolean };
export function UsageSummary({ title = "Spending Limit", highlight = "Spending", description = "New users by First user primary channel group", segments, fade = false, className }: UsageSummaryProps) {
  const match = highlight && title.startsWith(highlight);
  return <LayeredCard fade={fade} className={className}><div className="min-h-60">
    <h3 className="text-xl font-medium">{match ? <><mark className="bg-palette-brown-bg text-palette-brown-text">{highlight}</mark>{title.slice(highlight.length)}</> : title}</h3>
    <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
    <SegmentedUsage segments={segments} label={title} className="mt-4" />
    <ul className="mt-4 space-y-2 border-t border-dashed border-border-subtle pt-4 text-sm text-text-secondary">{normalizeUsage(segments).map((segment, index) => <li key={index} className="flex items-start gap-2"><span aria-hidden="true" className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", tones[segment.tone ?? "purple"])} /><span>{segment.label} <span className="text-text-tertiary">({Math.round(segment.value * 10) / 10}%)</span>{segment.detail && ` ${segment.detail}`}</span></li>)}</ul>
  </div></LayeredCard>;
}

export type FeaturePanelProps = { title: string; description: string; children: ReactNode; className?: string };
export function FeaturePanel({ title, description, children, className }: FeaturePanelProps) {
  const id = useId();
  return <section aria-labelledby={id} className={cn("min-w-0", className)}><h2 id={id} className="text-xl font-semibold tracking-tight">{title}</h2><p className="mt-4 max-w-lg text-base leading-7 text-text-secondary">{description}</p><div className="mt-10">{children}</div></section>;
}
export type FeatureItemProps = { icon: ReactNode; title: string; children: ReactNode; className?: string };
export function FeatureItem({ icon, title, children, className }: FeatureItemProps) {
  return <div className={className}><h3 className="flex items-center gap-2.5 text-base font-medium"><span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">{icon}</span>{title}</h3><p className="mt-3 text-sm leading-6 text-text-secondary">{children}</p></div>;
}
