import { useId, useRef, useState } from "react";
import { Avatar, type AvatarProps } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
  MenuSeparator,
} from "@/components/menu";
import { AgentWorkspaceState } from "@/components/automation";
import "./invoice.css";

export type InvoiceStatus =
  "pending" | "overdue" | "cancelled" | "paid" | "draft";
export type Invoice = {
  id: string;
  client: string;
  description: string;
  dueDate: string;
  amountCents: number;
  status: Exclude<InvoiceStatus, "overdue">;
  avatar?: AvatarProps["agent"];
  notes?: string;
};
export const INVOICE_STATUSES: InvoiceStatus[] = [
  "pending",
  "overdue",
  "cancelled",
  "paid",
  "draft",
];
export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: "Pending",
  overdue: "Overdue",
  cancelled: "Cancelled",
  paid: "Paid",
  draft: "Draft",
};
export function invoiceStatus(invoice: Invoice, asOf: string): InvoiceStatus {
  return invoice.status === "pending" && invoice.dueDate < asOf
    ? "overdue"
    : invoice.status;
}
export function invoiceMoney(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
export function invoiceDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Tag
      color={
        status === "pending"
          ? "orange"
          : status === "paid"
            ? "mint"
            : status === "cancelled"
              ? "pink"
              : "default"
      }
      className="invoice-status-badge"
    >
      {INVOICE_STATUS_LABEL[status]}
    </Tag>
  );
}
export type InvoiceSortKey =
  "dueDate" | "id" | "status" | "description" | "client" | "amountCents";
export type InvoiceSort = { key: InvoiceSortKey; direction: "asc" | "desc" };
export function sortInvoices(
  invoices: Invoice[],
  sort: InvoiceSort,
  asOf: string,
) {
  return [...invoices].sort((a, b) => {
    const order =
      sort.key === "status"
        ? INVOICE_STATUSES.indexOf(invoiceStatus(a, asOf)) -
          INVOICE_STATUSES.indexOf(invoiceStatus(b, asOf))
        : sort.key === "amountCents"
          ? a.amountCents - b.amountCents
          : a[sort.key].localeCompare(b[sort.key], "en", { numeric: true });
    return (
      (sort.direction === "asc" ? order : -order) ||
      a.id.localeCompare(b.id, "en", { numeric: true })
    );
  });
}
export type InvoiceAction = "open" | "paid" | "duplicate" | "delete";
function InvoiceActions({
  invoice,
  onAction,
  container,
}: {
  invoice: Invoice;
  onAction: (
    invoice: Invoice,
    action: InvoiceAction,
    trigger: HTMLElement | null,
  ) => void;
  container: HTMLDivElement | null;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <Menu>
      <MenuTrigger
        render={
          <IconButton
            render={<button ref={trigger} />}
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={`Actions for ${invoice.id}`}
            icon={<Icon name="ellipsis" size="sm" />}
          />
        }
      />
      <MenuPopup container={container} align="end">
        <MenuItem
          icon={<Icon name="arrow-up-right" />}
          onClick={() => onAction(invoice, "open", trigger.current)}
        >
          Open invoice
        </MenuItem>
        {invoice.status === "pending" && (
          <MenuItem
            icon={<Icon name="check" />}
            onClick={() => onAction(invoice, "paid", trigger.current)}
          >
            Mark as paid
          </MenuItem>
        )}
        <MenuItem
          icon={<Icon name="copy" />}
          onClick={() => onAction(invoice, "duplicate", trigger.current)}
        >
          Duplicate as draft
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          icon={<Icon name="trash" />}
          onClick={() => onAction(invoice, "delete", trigger.current)}
        >
          Delete invoice
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
const columns: { key: InvoiceSortKey; label: string }[] = [
  { key: "dueDate", label: "Due date" },
  { key: "id", label: "Invoice ID" },
  { key: "status", label: "Status" },
  { key: "description", label: "Description" },
  { key: "client", label: "Client" },
  { key: "amountCents", label: "Amount" },
];
export function InvoiceTable({
  invoices,
  asOf,
  sort,
  onSortChange,
  onAction,
  compact = false,
  onClearFilters,
}: {
  invoices: Invoice[];
  asOf: string;
  sort: InvoiceSort;
  onSortChange: (sort: InvoiceSort) => void;
  onAction: (
    invoice: Invoice,
    action: InvoiceAction,
    trigger: HTMLElement | null,
  ) => void;
  compact?: boolean;
  onClearFilters?: () => void;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const id = useId();
  const sorted = sortInvoices(invoices, sort, asOf);
  return (
    <div ref={setHost} className="invoice-table-host">
      {!invoices.length ? (
        <AgentWorkspaceState
          title="No invoices found"
          description="Try another search or clear your filters to see more invoices."
          actionLabel={onClearFilters ? "Clear filters" : undefined}
          onAction={onClearFilters}
        />
      ) : (
        <div
          className="invoice-table-scroll"
          role="region"
          aria-label="Invoice list"
          tabIndex={0}
        >
          <table className="invoice-table" data-compact={compact || undefined}>
            <caption id={id} className="sr-only">
              Invoices in EUR. Overdue status is calculated as of {asOf}.
            </caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-column={column.key}
                    aria-sort={
                      sort.key === column.key
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onSortChange({
                          key: column.key,
                          direction:
                            sort.key === column.key && sort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      {column.label}
                      <Icon
                        name={
                          sort.key === column.key
                            ? sort.direction === "asc"
                              ? "arrow-up"
                              : "arrow-down"
                            : "sort-descending"
                        }
                        size="sm"
                      />
                    </button>
                  </th>
                ))}
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((invoice) => (
                <tr key={invoice.id}>
                  <td data-column="dueDate">{invoiceDate(invoice.dueDate)}</td>
                  <td data-column="id">
                    <button
                      className="invoice-id-link"
                      type="button"
                      onClick={(e) =>
                        onAction(invoice, "open", e.currentTarget)
                      }
                    >
                      <span aria-hidden="true">#</span>
                      {invoice.id}
                    </button>
                  </td>
                  <td data-column="status">
                    <InvoiceStatusBadge status={invoiceStatus(invoice, asOf)} />
                  </td>
                  <td data-column="description">
                    <button
                      className="invoice-description-link"
                      type="button"
                      onClick={(e) =>
                        onAction(invoice, "open", e.currentTarget)
                      }
                    >
                      {invoice.description || "Untitled invoice"}
                    </button>
                  </td>
                  <td data-column="client">
                    <span className="invoice-client">
                      <Avatar
                        agent={invoice.avatar ?? "nova"}
                        name={invoice.client}
                        size="xs"
                      />
                      <span>{invoice.client}</span>
                    </span>
                  </td>
                  <td data-column="amountCents">
                    {invoiceMoney(invoice.amountCents)}
                  </td>
                  <td>
                    <InvoiceActions
                      invoice={invoice}
                      onAction={onAction}
                      container={host}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export function InvoiceTotals({
  invoices,
  asOf,
}: {
  invoices: Invoice[];
  asOf: string;
}) {
  const groups = [
    {
      title: "Outstanding",
      description: "Pending + overdue",
      items: invoices.filter((i) => i.status === "pending"),
      icon: "clock-history" as const,
    },
    {
      title: "Overdue",
      description: `Before ${invoiceDate(asOf)}`,
      items: invoices.filter((i) => invoiceStatus(i, asOf) === "overdue"),
      icon: "warning-circle" as const,
    },
    {
      title: "Paid",
      description: "Recorded payments",
      items: invoices.filter((i) => i.status === "paid"),
      icon: "check" as const,
    },
    {
      title: "Drafts",
      description: "Not yet issued",
      items: invoices.filter((i) => i.status === "draft"),
      icon: "pencil" as const,
    },
  ];
  return (
    <div className="invoice-totals" role="group" aria-label="Invoice totals">
      {groups.map((group) => (
        <article key={group.title}>
          <div>
            <h3>{group.title}</h3>
            <Icon name={group.icon} size="sm" />
          </div>
          <strong>
            {invoiceMoney(
              group.items.reduce((sum, i) => sum + i.amountCents, 0),
            )}
          </strong>
          <p>
            {group.items.length}{" "}
            {group.items.length === 1 ? "invoice" : "invoices"} ·{" "}
            {group.description}
          </p>
        </article>
      ))}
    </div>
  );
}
