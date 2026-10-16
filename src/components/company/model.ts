export const COMPANY_STAGES = [
  "New",
  "Qualified",
  "Demo",
  "Proposal",
  "Negotiation",
  "Won",
] as const;
export type CompanyStage = (typeof COMPANY_STAGES)[number];
export type Company = {
  id: string;
  name: string;
  domain: string;
  stage: CompanyStage;
  arrCents: number;
  employees: number;
  owner: string;
  lastContact: string;
  hot: boolean;
  favorite: boolean;
  notes: string;
};
export type CompanySort = {
  key: "name" | "arrCents" | "employees" | "lastContact";
  direction: "asc" | "desc";
};
export type CompanyView = "all" | "mine" | "hot" | "favorites";
export function companyMoney(cents: number) {
  return Number.isSafeInteger(cents) && cents >= 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: cents % 100 ? 2 : 0,
      }).format(cents / 100)
    : "Unavailable";
}
export function companyRows(
  rows: Company[],
  {
    query = "",
    view = "all",
    stage = "all",
    owner = "all",
    currentUser = "",
    sort = { key: "lastContact", direction: "desc" },
  }: {
    query?: string;
    view?: CompanyView;
    stage?: string;
    owner?: string;
    currentUser?: string;
    sort?: CompanySort;
  } = {},
) {
  const q = query.trim().toLowerCase();
  return rows
    .filter(
      (r) =>
        (!q || `${r.name} ${r.domain} ${r.owner}`.toLowerCase().includes(q)) &&
        (stage === "all" || r.stage === stage) &&
        (owner === "all" || r.owner === owner) &&
        (view !== "mine" || r.owner === currentUser) &&
        (view !== "hot" || r.hot) &&
        (view !== "favorites" || r.favorite),
    )
    .sort((a, b) => {
      const aa = a[sort.key],
        bb = b[sort.key];
      const result =
        typeof aa === "number" && typeof bb === "number"
          ? aa - bb
          : String(aa).localeCompare(String(bb));
      return (
        (sort.direction === "asc" ? result : -result) ||
        a.id.localeCompare(b.id)
      );
    });
}
export function companyCSV(rows: Company[]) {
  const cell = (v: string | number) =>
    `"${String(v)
      .replace(/^(\s*)([=+@\-])/, "$1'$2")
      .replaceAll('"', '""')}"`;
  return [
    [
      "Company",
      "Domain",
      "Stage",
      "ARR (USD)",
      "Employees",
      "Owner",
      "Last contact",
      "Hot",
      "Favorite",
    ],
    ...rows.map((r) => [
      r.name,
      r.domain,
      r.stage,
      (r.arrCents / 100).toFixed(2),
      r.employees,
      r.owner,
      r.lastContact,
      r.hot ? "Yes" : "No",
      r.favorite ? "Yes" : "No",
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}
export function parseCompany(
  input: {
    name: string;
    domain: string;
    stage: string;
    arr: string;
    employees: string;
    owner: string;
    lastContact: string;
    notes: string;
  },
  owners: readonly string[],
) {
  const name = input.name.trim(),
    domain = input.domain.trim().toLowerCase(),
    notes = input.notes.trim();
  if (!name || name.length > 80)
    throw new Error("Enter a company name of 1–80 characters.");
  if (
    !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(domain) ||
    domain.length > 253
  )
    throw new Error(
      "Enter a domain such as northstar.example, without https:// or a path.",
    );
  if (
    !COMPANY_STAGES.includes(input.stage as CompanyStage) ||
    !owners.includes(input.owner)
  )
    throw new Error("Choose a valid stage and owner.");
  if (!/^\d+(?:\.\d{1,2})?$/.test(input.arr.trim()))
    throw new Error(
      "ARR must be a non-negative amount with up to two decimals.",
    );
  const [whole, part = ""] = input.arr.trim().split(".");
  const arrCents = Number(whole) * 100 + Number(part.padEnd(2, "0"));
  if (!Number.isSafeInteger(arrCents) || arrCents > 1000000000000)
    throw new Error("ARR must be at most $10 billion.");
  const employees = Number(input.employees);
  if (
    !/^\d+$/.test(input.employees) ||
    !Number.isSafeInteger(employees) ||
    employees > 10000000
  )
    throw new Error("Employees must be a whole number from 0 to 10 million.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.lastContact) ||
    !Number.isFinite(Date.parse(input.lastContact)) ||
    new Date(input.lastContact).toISOString().slice(0, 10) !== input.lastContact
  )
    throw new Error("Choose a valid contact date.");
  if (notes.length > 2000)
    throw new Error("Keep notes within 2,000 characters.");
  return {
    name,
    domain,
    stage: input.stage as CompanyStage,
    arrCents,
    employees,
    owner: input.owner,
    lastContact: input.lastContact,
    notes,
  };
}
