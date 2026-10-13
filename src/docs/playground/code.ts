import { Fragment, isValidElement, type ReactNode } from "react";
import { componentModules } from "./registry";

/** Serialize the same element tree we preview, never a second hand-written demo.
 * Callbacks belong to the host app. Controlled inputs export initial values. */
export function playgroundCode(element: ReactNode): string {
  const imports = new Map<string, Set<string>>();
  const modules = Object.entries(componentModules).flatMap(([path, exports]) => Object.entries(exports).map(([name, component]) => ({ path, name, component })));
  function serialize(node: ReactNode, depth = 0): string {
    if (node == null || typeof node === "boolean") return "";
    if (Array.isArray(node)) return node.map(child => serialize(child, depth)).filter(Boolean).join("\n");
    if (typeof node === "string" || typeof node === "number") return `{${JSON.stringify(node)}}`;
    if (!isValidElement<Record<string, unknown>>(node)) return "";
    const entry = modules.find(entry => entry.component === node.type);
    const tag = typeof node.type === "string" ? node.type : node.type === Fragment ? "" : entry?.name;
    if (tag === undefined) throw new Error("Register the playground component before exporting it.");
    if (entry) {
      const names = imports.get(entry.path) ?? new Set<string>();
      names.add(entry.name);
      imports.set(entry.path, names);
    }
    const indent = "  ".repeat(depth);
    const props = Object.entries(node.props).filter(([key, value]) => key !== "children" && value != null && typeof value !== "function").map(([key, value]) => {
      const name = key === "layout" && tag === "OrbitGallery" ? "defaultLayout" : key === "value" && tag === "PromptBox" ? "defaultValue" : key === "open" ? "defaultOpen" : key === "expanded" && tag === "WebSearch" ? "defaultExpanded" : key;
      if (isValidElement(value)) return `${name}={${serialize(value, depth + 1).trim()}}`;
      return value === true ? name : `${name}={${JSON.stringify(value)}}`;
    });
    const opening = `${indent}<${tag}${props.length ? "\n" + props.map(prop => `${indent}  ${prop}`).join("\n") + "\n" + indent : ""}`;
    const children = serialize(node.props.children as ReactNode, depth + 1);
    if (!children) return tag ? `${opening} />` : "<></>";
    return `${opening}>\n${"  ".repeat(depth + 1)}${children.trim()}\n${indent}</${tag}>`;
  }
  const jsx = serialize(element);
  return [...imports].map(([path, names]) => `import { ${[...names].join(", ")} } from "@/components/${path}";`).join("\n") + "\n\n// Starting props. Connect event handlers in your app.\n" + jsx;
}
