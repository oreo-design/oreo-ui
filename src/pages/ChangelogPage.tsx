import { Changelog } from "@/patterns/changelog";
import type { DocsNav } from "@/docs/DocsPage";
export function ChangelogPage({ nav }: { nav: DocsNav }) { return <Changelog nav={nav} />; }
