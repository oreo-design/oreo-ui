import { Icon } from "@/components/icon";
import { FeaturePanel, FeatureItem, InvoicePreview, UsageSummary, type UsageSegment } from "@/components/feature-cards";

export const featureUsage: UsageSegment[] = [{ label: "Running", value: 20, tone: "purple", detail: "average of 12 minutes" }, { label: "Swimming", value: 20, tone: "blue" }];

/** A static marketing section, composed from real components with local illustrative data. */
export function FeaturesShowcase() {
  return <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:py-24">
    <div className="grid lg:grid-cols-2">
      <FeaturePanel title="Intuitive Invoice Creation" description="Create professional invoices instantly with our intuitive tools. Customize templates and automate billing to save time." className="lg:[&>p]:min-h-21 pb-10 lg:pb-12 lg:pr-12">
        <InvoicePreview fade />
      </FeaturePanel>
      <FeaturePanel title="Data Visualization" description="Transform complex data into intuitive visualizations. Our powerful tools help you uncover insights and communicate findings effectively." className="lg:[&>p]:min-h-21 border-t border-border-subtle pt-10 pb-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-12 lg:pl-12">
        <UsageSummary segments={featureUsage} fade />
      </FeaturePanel>
    </div>
    <div className="grid gap-x-8 gap-y-8 border-t border-border-subtle pt-10 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureItem icon={<Icon name="lightning" />} title="Faaast">Move from an idea to an invoice in minutes, with less busywork.</FeatureItem>
      <FeatureItem icon={<Icon name="cpu" />} title="Powerful">Flexible tools that grow with your team and the way you work.</FeatureItem>
      <FeatureItem icon={<Icon name="lock" />} title="Security">Keep sensitive work organized, with control over what you share.</FeatureItem>
      <FeatureItem icon={<Icon name="sparkle" />} title="AI Powered">Turn information into a useful starting point for your next step.</FeatureItem>
    </div>
  </div>;
}
