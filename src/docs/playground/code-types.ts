/** Generated code stays structured until formatting; prose is never a parser delimiter. */
export type CodeExample = {
  imports: string[];
  setup: string[];
  jsx: string;
  notes: string[];
};
export type ComponentExports = Record<string, Record<string, unknown>>;
export function formatCode(example: CodeExample): string {
  const indent = (text: string, spaces: number) => text.split("\n").map(line => " ".repeat(spaces) + line).join("\n");
  return [...new Set(example.imports)].join("\n") + "\n\n" + example.notes.map(note => `// ${note.replace(/[\r\n]/g, " ")}`).join("\n") + "\nexport function Example() {\n" + (example.setup.length ? indent(example.setup.join("\n"), 2) + "\n" : "") + "  return (\n" + indent(example.jsx, 4) + "\n  );\n}\n";
}
