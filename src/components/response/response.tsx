import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { CodeBlock } from "@/components/code-block";

export type ResponseProps = {
  /** Markdown source — typically the streamed assistant text. */
  children: string;
  /** Override or extend the element renderers. */
  components?: Components;
  className?: string;
};

/** Pull the raw source and language back out of a fenced code child. */
function extractCode(children: React.ReactNode): { code: string; language?: string } {
  const child = React.Children.only(children) as React.ReactElement<{
    className?: string;
    children?: React.ReactNode;
  }>;
  const language = /language-(\w+)/.exec(child.props.className ?? "")?.[1];
  const raw = React.Children.toArray(child.props.children).join("");
  return { code: raw.replace(/\n$/, ""), language };
}

const block = "mb-3 last:mb-0";
const heading = "mt-5 mb-2 font-semibold tracking-tight first:mt-0 last:mb-0";

/**
 * Element renderers tuned for chat: tighter rhythm and smaller headings than
 * document prose, fenced code routed into the Oreo CodeBlock. Module-level so
 * every Response shares one identity (react-markdown re-renders otherwise).
 */
const defaultComponents: Components = {
  p: (p) => <p {...p} className={cn(block, p.className)} />,
  h1: (p) => <h1 {...p} className={cn(heading, "text-[1.35em]", p.className)} />,
  h2: (p) => <h2 {...p} className={cn(heading, "text-[1.2em]", p.className)} />,
  h3: (p) => <h3 {...p} className={cn(heading, "text-[1.1em]", p.className)} />,
  h4: (p) => <h4 {...p} className={cn(heading, "text-[1em]", p.className)} />,
  ul: (p) => <ul {...p} className={cn(block, "list-disc space-y-1 pl-5 marker:text-[var(--color-text-disabled)]", p.className)} />,
  ol: (p) => <ol {...p} className={cn(block, "list-decimal space-y-1 pl-5 marker:text-[var(--color-text-secondary)]", p.className)} />,
  li: (p) => <li {...p} className={cn("[&>p]:mb-1", p.className)} />,
  a: (p) => (
    <a
      {...p}
      target="_blank"
      rel="noreferrer"
      className={cn("font-medium underline decoration-[var(--color-border-default)] underline-offset-2 transition-colors hover:decoration-[var(--color-text-primary)]", p.className)}
    />
  ),
  blockquote: (p) => (
    <blockquote
      {...p}
      className={cn(block, "border-l-2 border-[var(--color-border-default)] pl-3 text-[var(--color-text-secondary)]", p.className)}
    />
  ),
  hr: (p) => <hr {...p} className={cn("my-4 border-[var(--color-border-subtle)]", p.className)} />,
  // Inline code only — fenced blocks are intercepted by `pre` below and
  // rendered as CodeBlock, so their <code> never mounts.
  code: (p) => (
    <code
      {...p}
      className={cn("rounded-[var(--radius-control-tiny)] bg-[var(--color-state-press)] px-1.5 py-0.5 font-mono text-[0.88em]", p.className)}
    />
  ),
  pre: ({ children }) => {
    const { code, language } = extractCode(children);
    return <CodeBlock code={code} language={language} className={cn(block, "my-3 first:mt-0")} />;
  },
  table: (p) => (
    <div className={cn(block, "overflow-x-auto rounded-lg border border-[var(--color-border-subtle)]")}>
      <table {...p} className={cn("w-full border-collapse text-left", p.className)} />
    </div>
  ),
  th: (p) => (
    <th {...p} className={cn("border-b border-[var(--color-border-subtle)] bg-[var(--color-state-hover)] px-3 py-1.5 font-medium", p.className)} />
  ),
  td: (p) => <td {...p} className={cn("border-b border-[var(--color-border-subtle)] px-3 py-1.5 last:border-b-0 [tr:last-child_&]:border-b-0", p.className)} />,
};

/**
 * Oreo UI Response — assistant output as markdown.
 *
 * Pure presentational: give it the (partial) markdown string and it renders
 * with Oreo typography. Works mid-stream — react-markdown tolerates
 * incomplete markdown, so re-render with the growing string as tokens arrive.
 */
export function Response({ children, components, className }: ResponseProps) {
  return (
    <div className={cn("font-response text-[14px] leading-[1.7] text-[var(--color-text-primary)]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components ? { ...defaultComponents, ...components } : defaultComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
