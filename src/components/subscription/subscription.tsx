import { useRef, useState, type ReactNode } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { ProductPreview, type ProductPreviewProps } from "./product-preview";
import "./subscription.css";

export type SubscriptionProduct = ProductPreviewProps & { id: string };
export const DEFAULT_SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  { id: "social", variant: "social" },
  { id: "assistant", variant: "assistant" },
  { id: "code", variant: "code" },
];
export type SubscriptionFeatureGridProps = { products?: SubscriptionProduct[]; className?: string };
export function SubscriptionFeatureGrid({ products = DEFAULT_SUBSCRIPTION_PRODUCTS, className }: SubscriptionFeatureGridProps) {
  if (!products.length) return <div className={cn("flex min-h-52 flex-col items-center justify-center gap-3 rounded-card-medium border border-dashed border-border-default p-6 text-center", className)}><Icon name="sparkle" className="size-6 text-text-secondary" /><p className="text-sm font-medium">New possibilities, coming soon</p><p className="max-w-xs text-xs leading-5 text-text-secondary">There are no products in this collection yet.</p></div>;
  return <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-3", className)}>{products.map(({ id, ...product }) => <ProductPreview key={id} {...product} />)}</div>;
}

export type SharedUsageNoticeProps = { children?: ReactNode; details?: ReactNode; className?: string };
export function SharedUsageNotice({ children = "Generous usage limits shared across your products.", details = "Your included usage is shared across the suite. Availability and limits are defined by your plan.", className }: SharedUsageNoticeProps) {
  return <div className={cn("rounded-card-small bg-bg-elevated px-4 py-3 text-center text-xs leading-5 text-text-secondary", className)}><div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1"><Icon name="gauge" className="size-3.5 shrink-0" /><span>{children}</span></div>{details && <details className="mt-1"><summary className="mx-auto w-fit cursor-pointer rounded-control px-1 text-status-progress underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-progress">Learn more</summary><div className="mx-auto mt-2 max-w-md text-balance">{details}</div></details>}</div>;
}

export type SubscriptionDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerLabel?: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  products?: SubscriptionProduct[];
  usage?: ReactNode;
  finePrint?: ReactNode;
  actionLabel?: string;
  pending?: boolean;
  error?: string;
  onContinue: () => void;
  dark?: boolean;
};

/** Focus, dismissal and scroll locking belong to Base UI; continuation belongs to the host. */
export function SubscriptionDialog({ open, defaultOpen = false, onOpenChange, triggerLabel = "Explore the suite", title = "Introducing Oreo Plus", description = "One plan for everything you love to make.", eyebrow = "A little more, all together", products = DEFAULT_SUBSCRIPTION_PRODUCTS, usage, finePrint = "Explore the interactive preview. No subscription or payment is created.", actionLabel = "Get started", pending = false, error, onContinue, dark = false }: SubscriptionDialogProps) {
  const [instant, setInstant] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  return <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next, details) => {
    setInstant(details.event instanceof KeyboardEvent || (details.event instanceof MouseEvent && details.event.detail === 0));
    onOpenChange?.(next);
  }}>
    <Dialog.Trigger render={<Button size="lg" tapScale={1} />}>{triggerLabel}</Dialog.Trigger>
    <Dialog.Portal><div className={dark ? "theme-dark" : undefined}>
      <Dialog.Backdrop className="oreo-subscription-backdrop fixed inset-0 z-50 bg-overlay-subtle" data-instant={instant || undefined} />
      <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
        <Dialog.Popup initialFocus={titleRef} className="oreo-subscription-dialog relative max-h-full w-full max-w-3xl overflow-y-auto overscroll-contain rounded-card-medium border border-border-subtle bg-bg-base p-5 text-text-primary shadow-[var(--shadow-overlay)] outline-none sm:p-8" data-instant={instant || undefined}>
          <Dialog.Close className="absolute right-3 top-3" render={<IconButton aria-label="Close subscription" type="tertiary" tapScale={1} icon={<Icon name="x" />} />} />
          <header className="px-4 pt-6 text-center sm:pt-3"><Dialog.Title ref={titleRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none">{title}</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-text-secondary">{description}</Dialog.Description></header>
          <div className="my-7 flex items-center gap-3 text-xs text-text-secondary"><span className="h-px flex-1 bg-border-subtle" /><span className="text-center">{eyebrow}</span><span className="h-px flex-1 bg-border-subtle" /></div>
          <SubscriptionFeatureGrid products={products} />
          <SharedUsageNotice className="mt-7">{usage}</SharedUsageNotice>
          <div className="mx-auto mt-6 max-w-md text-center"><Button size="lg" tapScale={1} className="w-full" onClick={onContinue} disabled={pending || products.length === 0} aria-busy={pending}>{pending ? "Getting things ready…" : error ? "Try again" : actionLabel}</Button><div role="status" className="sr-only">{pending ? "Getting things ready" : ""}</div>{error && <p role="alert" className="mt-3 text-sm leading-5 text-status-error">{error}</p>}<p className="mt-3 text-xs leading-5 text-text-tertiary">{finePrint}</p></div>
        </Dialog.Popup>
      </Dialog.Viewport>
    </div></Dialog.Portal>
  </Dialog.Root>;
}
