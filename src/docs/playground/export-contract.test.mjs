import assert from "node:assert/strict";
import { before, after, test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import React from "react";
import { createServer } from "vite";
import ts from "typescript";
const root = fileURLToPath(new URL("../../../", import.meta.url));
let server, cacheDir, code, formatCode, withAppearance, defaultsFor;
const specs = {};
before(async () => {
  cacheDir = await mkdtemp(path.join(tmpdir(), "oreo-export-contract-"));
  server = await createServer({ root, configFile: false, cacheDir, server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, entries: [], include: [] }, resolve: { alias: { "@": path.join(root, "src") } }, esbuild: { jsx: "automatic" } });
  ({ playgroundCode: code } = await server.ssrLoadModule("/src/docs/playground/code.ts"));
  ({ formatCode } = await server.ssrLoadModule("/src/docs/playground/code-types.ts"));
  ({ withAppearance } = await server.ssrLoadModule("/src/docs/playground/exportAppearance.ts"));
  ({ defaultsFor } = await server.ssrLoadModule("/src/docs/playground/schema.ts"));
  const { playgroundLoaders } = await server.ssrLoadModule("/src/docs/playground/loaders.ts");
  for (const [slug, load] of Object.entries(playgroundLoaders)) specs[slug] = await load();
});
after(async () => { await server?.close(); if (cacheDir) await rm(cacheDir, { recursive: true, force: true }); });
function example(id, extra = {}) { const spec = specs[id], values = { ...defaultsFor(spec), ...extra }; return spec.exportRecipe ? spec.exportRecipe(values) : code(spec.render(values, () => {}), spec.exports); }

test("recipes preserve editable state, local save semantics and unconnected effects", async () => {
  assert.match(formatCode(example("budget-cap-control", { value: 91000 })), /useState\(91000\)/);
  assert.match(formatCode(example("budget-cap-control")), /onChange=\{setCap\}/);
  const monthly = formatCode(example("monthly-budget-card"));
  assert.match(monthly, /onSave=\{\(\) => setSaved\(cap\)\}/);
  assert.match(monthly, /onCancel=\{\(\) => setCap\(saved\)\}/);
  assert.match(monthly, /No billing or server persistence/);
  const toggle = formatCode(example("switch", { checked: true, readOnly: true }));
  assert.match(toggle, /defaultChecked/); assert.doesNotMatch(toggle, /\n\s+checked[=\n]/);
  assert.match(toggle, /readOnly/);
  assert.match(formatCode(example("tree-stepper")), /onValueChange=\{setValue\}/);
  const effect = example("inline-confirm");
  const handler = ts.transpile(effect.setup.join("\n") + "\nreturn confirmAction;", { target: ts.ScriptTarget.ES2022 });
  await assert.rejects(new Function(handler)()(), /Connect your action/);
  assert.doesNotMatch(formatCode(effect), /setTimeout|Demo failure/);
});

test("render and count recipes preserve fixture content, selection and local recovery", async () => {
  const { workflowRows } = await server.ssrLoadModule("/src/components/workflow-table/index.tsx");
  const { WORKFLOWS } = await server.ssrLoadModule("/src/patterns/workflow-directory/data.ts");
  function evaluate(id, values = {}) {
    const artifact = example(id, values), updates = [];
    const scope = { React, useState: initial => [initial, next => updates.push(next)], workflowRows, ...Object.assign({}, ...Object.values(specs[id].exports)) };
    const source = ts.transpileModule(artifact.setup.join("\n") + "\nreturn (" + artifact.jsx + ");", { fileName: "example.tsx", compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
    return { tree: new Function(...Object.keys(scope), source)(...Object.values(scope)), updates };
  }
  function find(node, component) {
    if (!node || typeof node !== "object") return undefined;
    if (node.type === component) return node;
    return React.Children.toArray(node.props?.children).map(child => find(child, component)).find(Boolean);
  }
  const queue = evaluate("agent-task-queue");
  const queueNode = find(queue.tree, specs["agent-task-queue"].exports["agent-task-queue"].AgentTaskQueue);
  assert.equal(queueNode.props.renderDetail({ context: "Exact host detail" }).props.children, "Exact host detail");
  queueNode.props.onExpand("height"); assert.equal(queue.updates.at(-1), "height");
  const browser = evaluate("browser-session-tabs", { empty: true });
  const browserNode = find(browser.tree, specs["browser-session-tabs"].exports["browser-session"].BrowserSessionTabs);
  assert.deepEqual(browserNode.props.tabs, []);
  browserNode.props.onAdd(); assert.deepEqual(browser.updates.at(-1).map(tab => tab.id), ["chat", "guide"]);
  assert.equal(browserNode.props.renderPanel({ title: "Exact title" }).props.children[0], "Exact title");
  browserNode.props.onValueChange("guide"); assert.equal(browser.updates.at(-1), "guide");
  const filter = evaluate("data-filter-popover", { selection: '{"status":["Live"]}' });
  const filterNode = find(filter.tree, specs["data-filter-popover"].exports["data-operations"].DataFilterPopover);
  assert.deepEqual(filterNode.props.value, { status: ["Live"] });
  for (const draft of [{}, { status: ["Live"] }, { folder: ["Finance"], owner: ["Unknown"] }]) assert.equal(filterNode.props.resultCount(draft), workflowRows(WORKFLOWS, { filters: draft }).length);
  filterNode.props.onApply({ status: ["Paused"] }); assert.deepEqual(filter.updates.at(-1), { status: ["Paused"] });
});

test("generic callbacks remain explicit, nested handlers are not silently lost, render functions fail closed", () => {
  function Thing() { return null; }
  const exported = code(React.createElement(Thing, { value: 0, onChange() {}, item: { onSelect() {}, label: "中文 \"quoted\"" } }), { thing: { Thing } });
  assert.match(exported.jsx, /onChange=\{\(\) => \{ throw new Error/);
  assert.match(exported.setup.join("\n"), /"onSelect": \(\) => \{ throw new Error/);
  assert.equal(exported.notes.length, 1);
  assert.throws(() => code(React.createElement(Thing, { render: () => null }), { thing: { Thing } }), /dedicated export recipe/);
});

test("every default export checks against real component types, including render and count recipes", () => {
  const sources = new Map();
  const unsupported = [];
  for (const id of Object.keys(specs)) {
    let value;
    try { value = example(id); }
    catch (error) { unsupported.push(id); assert.match(error.message, /needs a dedicated export recipe; rendering callbacks/); continue; }
    const decorated = withAppearance(value, { dark: true, radius: 12, library: "lucide" });
    assert.deepEqual(decorated.setup, value.setup);
    assert.equal(decorated.imports.length, new Set(decorated.imports).size);
    sources.set(path.join(root, `src/docs/playground/__export_${id}.tsx`), formatCode(decorated));
  }
  assert.deepEqual(unsupported, []);
  for (const id of ["agent-connect-card", "agent-client-picker", "prompt-box"]) assert.ok(sources.has(path.join(root, `src/docs/playground/__export_${id}.tsx`)), `${id} retains nested runtime export bindings`);
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const host = ts.createCompilerHost(parsed.options);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (filename, languageVersion, onError, shouldCreate) => sources.has(filename) ? ts.createSourceFile(filename, sources.get(filename), languageVersion, true, ts.ScriptKind.TSX) : originalGetSourceFile(filename, languageVersion, onError, shouldCreate);
  const originalFileExists = host.fileExists.bind(host);
  host.fileExists = filename => sources.has(filename) || originalFileExists(filename);
  const program = ts.createProgram([...sources.keys()], parsed.options, host);
  const errors = ts.getPreEmitDiagnostics(program).filter(d => d.file && sources.has(d.file.fileName));
  assert.deepEqual(errors.map(d => `${path.basename(d.file.fileName)}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`), []);
});
