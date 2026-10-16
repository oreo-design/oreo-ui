import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function CompanyDocs({ nav }: { nav: DocsNav }) {
  const identity = nav.active === "company-identity";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={[
        "Components",
        identity ? "Company Identity" : "Company Table",
      ]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {identity ? "Company Identity" : "Company Table"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {identity
                ? "A compact company mark, name, optional domain and hot-account signal."
                : "A dense account directory with controlled sorting, company details, favorites and a filtered ARR total."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/company-directory"
            >
              Open Company Directory ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                identity
                  ? 'import { CompanyIdentity } from "@/components/company";\n\n<CompanyIdentity name="Northstar Labs" domain="northstar.example" hot />'
                  : 'import { CompanyTable } from "@/components/company";\n\n<CompanyTable companies={filtered} sort={sort} onSort={setSort} onOpen={openDetails} onFavorite={toggleFavorite} onReset={clearFilters} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                identity
                  ? [
                      {
                        prop: "name / domain",
                        type: "string / string?",
                        desc: "Company name and optional secondary domain. Name wraps in constrained containers.",
                      },
                      {
                        prop: "mark",
                        type: "ReactNode?",
                        desc: "Caller-owned decorative logo or mark. Defaults to the first two name letters in a square token surface.",
                      },
                      {
                        prop: "hot",
                        type: "boolean",
                        desc: "Adds a text-labelled orange Tag; color is never the only status signal.",
                      },
                    ]
                  : [
                      {
                        prop: "companies",
                        type: "Company[]",
                        desc: "Visible, pre-filtered and pre-sorted records with unique IDs, valid ISO date-only lastContact, non-negative integer ARR cents and employees. All rows contribute to the footer total. Host validates records; parseCompany is provided for form inputs.",
                      },
                      {
                        prop: "sort / onSort",
                        type: "CompanySort / callback",
                        desc: "Controlled name, ARR, employee or contact-date sorting. Header aria-sort reflects the current direction. Omit onSort for static headings; companyRows is the host-side helper.",
                      },
                      {
                        prop: "onOpen / onFavorite",
                        type: "(company:Company) => void",
                        desc: "Optional callbacks. Only supplied actions become interactive. Opening is a company-name button, never a nested row button.",
                      },
                      {
                        prop: "loading / error / onReset",
                        type: "boolean / string / callback",
                        desc: "Empty initial load gets a table-shaped static skeleton. Loading with rows preserves them and sets aria-busy. Error has priority and preserves host records. Empty and errors reuse AgentWorkspaceState, with optional recovery.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template includes All, My companies, Hot and Favorites views;
              combined search, stage and owner filters; sorting; local add/edit
              with validation; undo; and CSV export. Sample accounts use
              fictional names and .example domains. Local changes reset on
              reload. Annual recurring revenue is distinct from the opportunity
              values in Sales Workspace. Contact dates use UTC. Proposal and
              Demo extend the same Tag-based stage vocabulary; overlapping
              stages reuse DealStageBadge.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The table scrolls horizontally on narrow screens, retaining
              company names; opaque header and total rows protect content while
              scrolling. No CRM, storage, email, or backend is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/eliakuratli/status/2110823532917862573"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Elia ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
