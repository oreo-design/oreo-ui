import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const sourceFile = /\.[cm]?[jt]sx?$/;
const neutralOwners = new Set(["row-layout", "status-view"]);
const neutralDependencies = new Set(["row-layout", "status-view", "button", "icon"]);

/** Resolve the project's @/ alias and relative imports before applying layers. */
export function checkSource(filename, source) {
  const file = filename.replaceAll("\\", "/");
  const violations = [];
  if (!file.startsWith("src/components/")) return violations;
  const owner = file.split("/")[2];
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const inspect = (specifier, node) => {
    const target = specifier.startsWith("@/")
      ? `src/${specifier.slice(2)}`
      : specifier.startsWith(".")
        ? path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))
        : null;
    if (!target) return;
    let rule;
    if (/^src\/(patterns|pages|docs)(?:\/|$)/.test(target)) rule = "component-imports-composition";
    else if (neutralOwners.has(owner)) {
      const dependency = target.split("/")[2];
      if (target.startsWith("src/components/") && !neutralDependencies.has(dependency)) rule = "neutral-owner-imports-business";
    }
    if (rule) violations.push({ file, line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1, specifier, target, rule });
  };
  const visit = node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      inspect(node.moduleSpecifier.text, node);
    } else if (ts.isCallExpression(node) && node.arguments.length && ts.isStringLiteralLike(node.arguments[0]) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      inspect(node.arguments[0].text, node);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
      inspect(node.argument.literal.text, node);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return violations;
}

export async function checkComponents(root = process.cwd()) {
  const violations = [];
  let files = 0;
  async function visit(directory) {
    for (const item of await readdir(path.join(root, directory), { withFileTypes: true })) {
      const filename = `${directory}/${item.name}`;
      if (item.isDirectory()) await visit(filename);
      else if (sourceFile.test(item.name)) {
        files++;
        violations.push(...checkSource(filename, await readFile(path.join(root, filename), "utf8")));
      }
    }
  }
  await visit("src/components");
  return { files, violations };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await checkComponents();
  console.log(JSON.stringify(result, null, 2));
  if (result.violations.length) process.exitCode = 1;
}
