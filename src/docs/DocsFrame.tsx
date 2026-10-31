import { createContext, useContext, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import type { DocsNav } from "./DocsPage";

const FrameContext = createContext(false);
export const useDocsFrame = () => useContext(FrameContext);
/** Navigation remains mounted while the documentation body changes modules. */
export function DocsFrame({ nav, children }: { nav: DocsNav; children: ReactNode }) {
  return <FrameContext.Provider value={true}><div className="oreo-document-frame mx-auto flex min-h-screen gap-0 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"><Sidebar nav={nav} />{children}</div></FrameContext.Provider>;
}
