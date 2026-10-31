import { useDocsFrame } from "./DocsFrame";
import { ThemeIllustration } from "@/lib/theme/ThemeIllustration";
import { Sidebar } from "./Sidebar";
import { OnThisPage, type TocItem } from "./OnThisPage";
import type { DocsNav } from "./DocsPage";

export function DocsLayout({
  toc,
  breadcrumb,
  nav,
  children,
  views,
}: {
  toc: TocItem[];
  breadcrumb: string[];
  nav: DocsNav;
  children: React.ReactNode;
  views?: React.ReactNode;
}) {
  const framed = useDocsFrame();
  return (
    <div className={framed ? "contents" : "oreo-document-frame mx-auto flex min-h-screen gap-0 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"}>
      {!framed && <Sidebar nav={nav} />}
      <main className="min-w-0 flex-1 px-6 py-10 md:px-12">
        <div className="site-docs-content mx-auto max-w-2xl">
          <div className="site-docs-heading"><nav aria-label="Breadcrumb" className="text-[12px] text-[var(--color-text-secondary)]">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb}>
                {i > 0 && <span className="px-1">/</span>}
                <span className={i === breadcrumb.length - 1 ? "text-[var(--color-text-primary)]" : undefined}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>{views}</div>
          <ThemeIllustration />
          {children}
        </div>
      </main>
      <OnThisPage items={toc} />
    </div>
  );
}
