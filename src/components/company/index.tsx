import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { DealStageBadge } from "@/components/sales";
import { StatusView } from "@/components/status-view";
import {
  companyMoney,
  type Company,
  type CompanySort,
  type CompanyStage,
} from "./model";
import "./company.css";
export * from "./model";
export function CompanyIdentity({
  name,
  domain,
  mark,
  hot = false,
}: {
  name: string;
  domain?: string;
  mark?: ReactNode;
  hot?: boolean;
}) {
  return (
    <span className="company-identity">
      <span className="company-mark" aria-hidden="true">
        {mark ?? name.trim().slice(0, 2).toUpperCase()}
      </span>
      <span className="company-identity-copy">
        <strong>{name}</strong>
        {domain && <small>{domain}</small>}
      </span>
      {hot && <Tag color="orange">Hot</Tag>}
    </span>
  );
}
export function CompanyStageBadge({ stage }: { stage: CompanyStage }) {
  return stage === "Proposal" || stage === "Demo" ? (
    <Tag color={stage === "Proposal" ? "brown" : "purple"}>{stage}</Tag>
  ) : (
    <DealStageBadge stage={stage} />
  );
}
export function CompanyTable({
  companies,
  sort,
  onSort,
  onOpen,
  onFavorite,
  onReset,
  loading = false,
  error,
}: {
  companies: Company[];
  sort?: CompanySort;
  onSort?: (sort: CompanySort) => void;
  onOpen?: (company: Company) => void;
  onFavorite?: (company: Company) => void;
  onReset?: () => void;
  loading?: boolean;
  error?: string;
}) {
  if (error)
    return (
      <StatusView
        error
        title="Companies unavailable"
        description={error}
        actionLabel={onReset ? "Try again" : undefined}
        onAction={onReset}
      />
    );
  if (loading && !companies.length)
    return (
      <div
        className="company-loading"
        role="status"
        aria-label="Loading companies"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <i />
            {[0, 1, 2, 3, 4].map((k) => (
              <span key={k} />
            ))}
          </div>
        ))}
      </div>
    );
  if (!companies.length)
    return (
      <StatusView
        title="No companies found"
        description="Try a different view or clear your filters to see more companies."
        actionLabel={onReset ? "Clear filters" : undefined}
        onAction={onReset}
      />
    );
  const heading = (label: string, key: CompanySort["key"]) => (
    <th
      scope="col"
      aria-sort={
        sort?.key === key
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      {onSort ? (
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          onClick={() =>
            onSort({
              key,
              direction:
                sort?.key === key && sort.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          {label}
          {sort?.key === key ? (
            <span aria-hidden="true">
              {sort.direction === "asc" ? "↑" : "↓"}
            </span>
          ) : null}
        </Button>
      ) : (
        label
      )}
    </th>
  );
  return (
    <div
      className="company-table-scroll"
      role="region"
      aria-label="Companies table"
      tabIndex={0}
      aria-busy={loading}
    >
      <table className="company-table">
        <caption className="sr-only">
          Company accounts. ARR is annual recurring revenue in US dollars.
          Contact dates use UTC.
        </caption>
        <thead>
          <tr>
            {heading("Company", "name")}
            <th scope="col">Stage</th>
            {heading("ARR", "arrCents")}
            {heading("Employees", "employees")}
            <th scope="col">Owner</th>
            {heading("Last contact", "lastContact")}
            {onFavorite && (
              <th scope="col">
                <span className="sr-only">Favorite</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <th scope="row">
                {onOpen ? (
                  <button
                    className="company-open"
                    onClick={() => onOpen(c)}
                    aria-label={`Open ${c.name}`}
                  >
                    <CompanyIdentity name={c.name} hot={c.hot} />
                  </button>
                ) : (
                  <CompanyIdentity name={c.name} hot={c.hot} />
                )}
              </th>
              <td>
                <CompanyStageBadge stage={c.stage} />
              </td>
              <td className="company-number">{companyMoney(c.arrCents)}</td>
              <td className="company-number">
                {c.employees.toLocaleString("en-US")}
              </td>
              <td>
                <span className="company-owner">
                  <Avatar size="sm" name={c.owner} aria-hidden="true" />
                  {c.owner}
                </span>
              </td>
              <td>
                <time dateTime={c.lastContact}>
                  {new Date(c.lastContact).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </td>
              {onFavorite && (
                <td>
                  <IconButton
                    icon={
                      <Icon
                        name="star"
                        weight={c.favorite ? "fill" : "regular"}
                      />
                    }
                    size="sm"
                    type="tertiary"
                    tapScale={1}
                    aria-label={`${c.favorite ? "Unfavorite" : "Favorite"} ${c.name}`}
                    aria-pressed={c.favorite}
                    onClick={() => onFavorite(c)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">
              {companies.length}{" "}
              {companies.length === 1 ? "company" : "companies"}
            </th>
            <td>Filtered ARR</td>
            <td className="company-number">
              {companyMoney(companies.reduce((sum, c) => sum + c.arrCents, 0))}
            </td>
            <td colSpan={onFavorite ? 4 : 3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
