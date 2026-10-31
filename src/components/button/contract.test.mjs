import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import ts from "typescript";

const root = fileURLToPath(new URL("../../../", import.meta.url));
let server;
let Button;
let IconButton;
let cacheDir;

before(async () => {
  cacheDir = await mkdtemp(path.join(tmpdir(), "oreo-button-contract-"));
  server = await createServer({
    root,
    configFile: false,
    cacheDir,
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, entries: [], include: [] },
    resolve: { alias: { "@": path.join(root, "src") } },
    esbuild: { jsx: "automatic" },
  });
  ({ Button, IconButton } = await server.ssrLoadModule("/src/components/button/index.ts"));
});

after(async () => {
  await server?.close();
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true });
});

function render(Component, props) {
  return renderToStaticMarkup(React.createElement(Component, {
    ...(Component === IconButton ? { "aria-label": "Send", icon: "↑" } : { children: "Send" }),
    ...props,
  }));
}

test("native button defaults stay safe inside a form, independently of emphasis", () => {
  for (const Component of [Button, IconButton]) {
    for (const type of [undefined, "primary", "secondary", "tertiary"]) {
      const html = render(Component, { type });
      assert.match(html, /^<button type="button"/);
      assert.doesNotMatch(html, /htmlType=|type="(?:primary|secondary|tertiary)"/);
    }
  }
});

test("submit and reset preserve native form attributes without replacing the renderer", () => {
  for (const Component of [Button, IconButton]) {
    for (const htmlType of ["submit", "reset"]) {
      const html = render(Component, { htmlType, type: "secondary", form: "editor", name: "action", value: "save" });
      assert.match(html, new RegExp(`^<button type="${htmlType}"`));
      for (const attribute of ['form="editor"', 'name="action"', 'value="save"']) assert.ok(html.includes(attribute));
      assert.doesNotMatch(html, /htmlType=/);
    }
  }
});

test("disabled native controls retain their real disabled state and accessible name", () => {
  for (const Component of [Button, IconButton]) {
    const html = render(Component, { disabled: true, htmlType: "submit" });
    assert.match(html, / disabled=""/);
    assert.match(html, / data-disabled=""/);
    if (Component === IconButton) assert.match(html, /aria-label="Send"/);
  }
});

test("custom native and link renderers preserve their existing semantic ownership", () => {
  for (const Component of [Button, IconButton]) {
    const submit = render(Component, { htmlType: "reset", render: React.createElement("button", { type: "submit", "data-custom": "submit" }) });
    assert.match(submit, /^<button type="submit"/);
    assert.match(submit, /data-custom="submit"/);
    const link = render(Component, { htmlType: "submit", render: React.createElement("a", { href: "/destination" }) });
    assert.match(link, /^<a href="\/destination"/);
    assert.doesNotMatch(link, / type=|htmlType=|whileTap=|transition=/);
  }
});

test("public types accept htmlType and legacy emphasis, reject invalid types, and require icon names", () => {
  const filename = path.join(root, "src/components/button/__contract_typecheck.tsx");
  const source = `import { Button, IconButton } from "./index";
    const old = <Button type="secondary">Cancel</Button>;
    const submit = <Button type="primary" htmlType="submit" form="editor">Save</Button>;
    const reset = <IconButton htmlType="reset" aria-label="Reset" icon="↻" />;
    // @ts-expect-error Native button type has a finite set of values.
    const invalid = <Button htmlType="primary">Save</Button>;
    // @ts-expect-error Visual emphasis retains its existing contract.
    const wrongEmphasis = <Button type="submit">Save</Button>;
    // @ts-expect-error Icon-only controls still need an accessible name.
    const unnamed = <IconButton htmlType="submit" icon="↑" />;
  `;
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  assert.equal(config.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const host = ts.createCompilerHost(parsed.options);
  const originalRead = host.readFile.bind(host);
  const originalExists = host.fileExists.bind(host);
  host.readFile = file => file === filename ? source : originalRead(file);
  host.fileExists = file => file === filename || originalExists(file);
  const program = ts.createProgram([filename], parsed.options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => root,
    getCanonicalFileName: file => file,
    getNewLine: () => "\n",
  }));
});
