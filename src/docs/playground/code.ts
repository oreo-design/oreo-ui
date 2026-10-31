import { Fragment, isValidElement, type ReactNode } from "react";
import { formatCode } from "./code-types";
import type { CodeExample, ComponentExports } from "./code-types";

/** Only current-family exports are supplied. Never pull a runtime registry into the shell. */
export function playgroundCode(element: ReactNode, componentModules: ComponentExports = {}, expressions: Record<string, string> = {}): CodeExample {
  const imports = new Map<string, Set<string>>();
  const notes = new Set<string>();
  const setup: string[] = [];
  let inputIndex = 0;
  const needsStructuralBinding = (value: unknown): boolean => Boolean(value) && typeof value === "object" && !isValidElement(value) && (!Array.isArray(value) || value.some(needsStructuralBinding));
  const modules = Object.entries(componentModules).flatMap(([path, exports]) => Object.entries(exports).map(([name, component]) => ({ path, name, component })));
  function serialize(node: ReactNode, depth = 0): string {
    if (node == null || typeof node === "boolean") return "";
    if (Array.isArray(node)) return node.map(child => serialize(child, depth)).filter(Boolean).join("\n");
    if (typeof node === "string" || typeof node === "number") return `{${JSON.stringify(node)}}`;
    if (!isValidElement<Record<string, unknown>>(node)) throw new Error("This value needs a dedicated export recipe.");
    const entry = modules.find(entry => entry.component === node.type);
    const tag = typeof node.type === "string" ? node.type : node.type === Fragment ? "" : entry?.name;
    if (tag === undefined) throw new Error("This component needs a dedicated export binding. Open its documentation.");
    if (entry) {
      const names = imports.get(entry.path) ?? new Set<string>();
      names.add(entry.name);
      imports.set(entry.path, names);
    }
    const indent = "  ".repeat(depth);
    function propExpression(value: unknown, key: string, narrow = false): string {
      if (typeof value === "function") {
        if (!/^on[A-Z]/.test(key)) throw new Error(`${tag}.${key} needs a dedicated export recipe; rendering callbacks cannot be serialized.`);
        notes.add("Host callbacks are unconnected and throw until implemented. Controlled values need application state.");
        return `() => { throw new Error(${JSON.stringify(`Connect ${tag}.${key} to your application`)}); }`;
      }
      if (isValidElement(value)) return serialize(value, depth + 1).trim();
      if (Array.isArray(value)) return `[${value.map(item => propExpression(item, key, narrow)).join(", ")}]`;
      if (value && typeof value === "object") {
        if (Object.getPrototypeOf(value) !== Object.prototype) throw new Error(`${tag}.${key} needs a dedicated export recipe.`);
        return `{ ${Object.entries(value).map(([name, item]) => `${JSON.stringify(name)}: ${propExpression(item, name, narrow)}`).join(", ")} }`;
      }
      if (typeof value === "symbol" || typeof value === "bigint" || (typeof value === "number" && !Number.isFinite(value))) throw new Error(`${tag}.${key} cannot be exported as a literal.`);
      return (JSON.stringify(value) ?? "undefined") + (narrow && ["string", "number", "boolean"].includes(typeof value) ? " as const" : "");
    }
    const props = Object.entries(node.props).filter(([key]) => key !== "children").map(([key, value]) => {
      if (Object.hasOwn(expressions, `${tag}.${key}`)) return `${key}={${expressions[`${tag}.${key}`]}}`;
      if (needsStructuralBinding(value)) {
        // Fixtures are structural values, not fresh contextually typed object literals.
        // Narrow scalar fields only: freezing entire arrays would change mutable APIs.
        const expression = propExpression(value, key, true);
        const name = `exampleInput${++inputIndex}`;
        setup.push(`const ${name} = ${expression};`);
        return `${key}={${name}}`;
      }
      return value === true ? key : `${key}={${propExpression(value, key)}}`;
    });
    const opening = `${indent}<${tag}${props.length ? "\n" + props.map(prop => `${indent}  ${prop}`).join("\n") + "\n" + indent : ""}`;
    const children = serialize(node.props.children as ReactNode, depth + 1);
    if (!children) return tag ? `${opening} />` : "<></>";
    return `${opening}>\n${"  ".repeat(depth + 1)}${children.trim()}\n${indent}</${tag}>`;
  }
  const jsx = serialize(element);
  return { imports: [...imports].map(([path, names]) => `import { ${[...names].join(", ")} } from "@/components/${path}";`), setup, jsx: jsx || "<></>", notes: [...notes] };
}

/** Legacy documentation compositions keep their preview available when export is unsupported. */
export function documentationCode(element: ReactNode, modules: ComponentExports): string {
  try { return formatCode(playgroundCode(element, modules)); }
  catch (error) { return `// Code unavailable: ${error instanceof Error ? error.message.replace(/[\r\n]/g, " ") : "This composition needs an export recipe."}\n// Use the component API documentation and source.`; }
}
