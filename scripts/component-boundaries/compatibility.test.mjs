import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createServer } from "vite";

test("extracted owners preserve Settings DOM and legacy status exports/actions", async () => {
  const server = await createServer({
    configFile: false,
    resolve: { alias: { "@": path.resolve("src") } },
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { RowLayout, RowLabel } = await server.ssrLoadModule("/src/components/row-layout/index.tsx");
    const legacyRow = await server.ssrLoadModule("/src/patterns/settings/row-primitives.tsx");
    const { StatusView } = await server.ssrLoadModule("/src/components/status-view/index.tsx");
    const { AgentWorkspaceState } = await server.ssrLoadModule("/src/components/automation/index.tsx");
    assert.equal(legacyRow.RowLabel, RowLabel);
    assert.equal(AgentWorkspaceState, StatusView);

    const compatibility = legacyRow.RowShell({ children: "setting", className: "custom-row" });
    assert.equal(compatibility.type, RowLayout);
    const row = RowLayout(compatibility.props);
    assert.equal(row.type, "div");
    assert.equal(row.props.children, "setting");
    assert.match(row.props.className, /--settings-hairline/);
    assert.match(row.props.className, /custom-row/);

    let attempts = 0;
    const onAction = () => { attempts++; };
    const error = StatusView({ error: true, title: "Unavailable", description: "Try again", actionLabel: "Retry", onAction });
    assert.equal(error.props.className, "agent-workspace-state");
    assert.equal(error.props.role, "alert");
    assert.deepEqual(error.props.children.slice(1, 3).map(child => child.type), ["h3", "p"]);
    const button = error.props.children[3];
    assert.equal(button.props.children, "Retry");
    button.props.onClick();
    assert.equal(attempts, 1);
    for (const props of [{}, { actionLabel: "Retry" }, { onAction }]) {
      const empty = StatusView({ title: "No matches", description: "Change filter", ...props });
      assert.equal(empty.props.role, undefined);
      assert.equal(Boolean(empty.props.children[3]), false);
    }
  } finally {
    await server.close();
  }
});
