import { createHash } from "node:crypto";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import ts from "typescript";

const sha = text => createHash("sha256").update(text).digest("hex");
export async function guard(overrides = {}) {
  const contract = JSON.parse(await readFile("docs/settings-language/contract.json", "utf8"));
  const violations = [];
  const read = async path => path in overrides ? overrides[path] : readFile(path, "utf8");
  for (const [path, expected] of Object.entries(contract.inherited)) {
    try { if (sha(await read(path)) !== expected) violations.push({ path, rule: "inherited-source-changed" }); }
    catch { violations.push({ path, rule: "inherited-source-missing" }); }
  }
  for (const item of contract.reviewedChanges) {
    try { if (sha(await read(item.path)) !== item.sha256) violations.push({ path: item.path, rule: "reviewed-boundary-changed", decision: item.decision }); }
    catch { violations.push({ path: item.path, rule: "reviewed-boundary-missing" }); }
  }
  const paths = [];
  for (const dir of contract.compositionDirectories) {
    async function visit(folder) {
      for (const file of await readdir(folder, { withFileTypes: true })) {
        const path = `${folder}/${file.name}`;
        if (file.isDirectory()) await visit(path);
        else if (/\.(css|tsx?)$/.test(path)) paths.push(path);
      }
    }
    await visit(dir);
  }
  for (const path of paths) {
    const text = (await read(path)).replace(/\/\*[\s\S]*?\*\//g, "");
    if (/\.tsx?$/.test(path)) {
      const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
      for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const bindings = statement.importClause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings) && bindings.elements.some(item => (item.propertyName ?? item.name).text === "SettingsSection")) {
          violations.push({ path, rule: "use-label-only-settings-group" });
        }
      }
    }
    if (/#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/i.test(text)) violations.push({ path, rule: "raw-color-in-composition" });
    if (/--(?:color|radius|shadow)-[\w-]+\s*:/.test(text)) violations.push({ path, rule: "token-redefinition-in-composition" });
    if (path.endsWith(".css") && /(?:^|})\s*(?:body|html|:root|button|input|\*)\s*[{,:]/m.test(text)) violations.push({ path, rule: "unscoped-css-in-composition" });
  }
  return { protectedFiles: Object.keys(contract.inherited).length, reviewedBoundaries: contract.reviewedChanges.length, compositionFiles: paths.length, violations };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await guard();
  if (process.argv.includes("--self-test")) {
    const tokens = await readFile("src/index.css", "utf8");
    const recipe = "src/pages/settings-lab/lab.css";
    const tests = [
      ["inherited source edit", { "src/index.css": tokens + "\n/* deliberate mutation */" }, "inherited-source-changed"],
      ["unscoped CSS", { [recipe]: "body { padding: 4rem; }" }, "unscoped-css-in-composition"],
      ["token overwrite", { [recipe]: ".settings-lab { --color-text-primary: red; }" }, "token-redefinition-in-composition"],
      ["raw color", { [recipe]: ".settings-lab { color: #ff0000; }" }, "raw-color-in-composition"],
      ["unrestricted section import", { "src/pages/settings-lab/recipes.tsx": 'import { SettingsSection as Group } from "@/patterns/settings";' }, "use-label-only-settings-group"],
    ];
    result.mutations = [];
    for (const [name, overrides, rule] of tests) {
      const caught = (await guard(overrides)).violations.some(v => v.rule === rule);
      assert(caught, `Guard failed to catch ${name}`);
      result.mutations.push({ name, caught });
    }
  }
  await mkdir("artifacts/settings-lab", { recursive: true });
  await writeFile("artifacts/settings-lab/guard.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
  if (result.violations.length) process.exitCode = 1;
}
