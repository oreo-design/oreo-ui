import { Tag } from "@/components/tag";
import { Icon, type IconName } from "@/components/icon";
import { invoiceDate, invoiceMoney, type Invoice } from "@/components/invoice";
import "./client.css";

export type ClientProfile = {
  name: string;
  industry: string;
  specialty: string;
  taxId: string;
  teamSize: number;
  active: boolean;
  location: string;
  website: string;
  email: string;
  phone: string;
  owner: string;
};
export function ClientSummary({
  client,
  projectCount,
  activeProjects,
  revenueCents,
  currency = "USD",
}: {
  client: ClientProfile;
  projectCount: number;
  activeProjects: number;
  revenueCents: number;
  currency?: "EUR" | "USD";
}) {
  return (
    <section className="client-summary" aria-label="Company details">
      <div className="client-identity">
        <span className="client-monogram" aria-hidden="true">
          {client.name.trim().slice(0, 1) || "C"}
        </span>
        <div>
          <h1>{client.name}</h1>
          <p>
            {client.industry} <span aria-hidden="true">·</span>{" "}
            {client.specialty}
          </p>
        </div>
        <Tag color={client.active ? "mint" : "default"}>
          {client.active ? "Active" : "Inactive"}
        </Tag>
      </div>
      <dl className="client-facts">
        {[
          ["Total projects", projectCount],
          ["Active projects", activeProjects],
          ["Tax ID / EIN", client.taxId],
          ["Paid revenue", invoiceMoney(revenueCents, currency)],
          ["Team members", client.teamSize],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
export function ClientContactStrip({ client }: { client: ClientProfile }) {
  const items: { label: string; value: string; icon: IconName }[] = [
    { label: "Location", value: client.location, icon: "globe" },
    { label: "Website", value: client.website, icon: "link" },
    { label: "Email", value: client.email, icon: "at" },
    { label: "Phone", value: client.phone, icon: "chat" },
    { label: "Account owner", value: client.owner, icon: "users" },
  ];
  return (
    <dl className="client-contact-strip" aria-label="Contact information">
      {items.map((item) => (
        <div key={item.label}>
          <dt>
            <Icon name={item.icon} size="sm" />
            {item.label}
          </dt>
          <dd>{item.value || "Not provided"}</dd>
        </div>
      ))}
    </dl>
  );
}
export function clientFinance(invoices: Invoice[], asOf: string) {
  const issued = invoices.filter(
    (i) => i.status === "paid" || i.status === "pending",
  );
  const paid = invoices.filter((i) => i.status === "paid");
  const pending = invoices.filter((i) => i.status === "pending");
  const next = [...pending]
    .filter((i) => i.dueDate >= asOf)
    .sort(
      (a, b) => a.dueDate.localeCompare(b.dueDate) || a.id.localeCompare(b.id),
    )[0];
  const sum = (items: Invoice[]) =>
    items.reduce((n, i) => n + i.amountCents, 0);
  return {
    invoiced: sum(issued),
    paid: sum(paid),
    outstanding: sum(pending),
    overdue: pending.filter((i) => i.dueDate < asOf).length,
    next,
  };
}
export function ClientFinanceSummary({
  invoices,
  asOf,
  currency = "USD",
}: {
  invoices: Invoice[];
  asOf: string;
  currency?: "EUR" | "USD";
}) {
  const f = clientFinance(invoices, asOf);
  const cards = [
    {
      label: "Total invoiced",
      amount: f.invoiced,
      detail: "Issued invoices · drafts excluded",
      icon: "list" as const,
    },
    {
      label: "Total paid",
      amount: f.paid,
      detail: "Recorded payments",
      icon: "check" as const,
    },
    {
      label: "Outstanding",
      amount: f.outstanding,
      detail: `${f.overdue} overdue ${f.overdue === 1 ? "invoice" : "invoices"}`,
      icon: "clock-history" as const,
    },
    {
      label: "Next payment",
      amount: f.next?.amountCents,
      detail: f.next
        ? `Due ${invoiceDate(f.next.dueDate)}`
        : "No upcoming payment",
      icon: "calendar" as const,
    },
  ];
  return (
    <div
      className="client-finance-summary"
      role="group"
      aria-label="Client finances"
    >
      <div className="client-finance-grid">
        {cards.map((card) => (
          <article key={card.label}>
            <div>
              <h3>{card.label}</h3>
              <Icon name={card.icon} size="sm" />
            </div>
            <strong>
              {card.amount === undefined
                ? "—"
                : invoiceMoney(card.amount, currency)}
            </strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
