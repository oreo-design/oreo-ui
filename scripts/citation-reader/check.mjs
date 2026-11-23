import assert from "node:assert/strict";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  cacheDir: "/tmp/citation-reader-test-cache",
  appType: "custom",
});
try {
  const { citationEntries, uniqueSources, matchedText, passageHref } =
    await server.ssrLoadModule("/src/components/citation-reader/model.ts");
  const source = {
    id: "a",
    title: "Article",
    url: "https://example.com/read#section",
  };
  const claim = {
    id: "c",
    text: "First sentence. Second sentence.",
    citations: [
      { sourceId: "a", excerpt: "First sentence.", exact: true },
      { sourceId: "a", excerpt: "Duplicate" },
      { sourceId: "missing", excerpt: "Missing" },
    ],
  };
  assert.equal(
    uniqueSources([source, { ...source, title: "Duplicate" }]).length,
    1,
  );
  const entries = citationEntries([claim], [source]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].source.title, "Article");
  assert.deepEqual(matchedText(claim.text, "First sentence."), {
    before: "",
    match: "First sentence.",
    after: " Second sentence.",
  });
  assert.deepEqual(matchedText(claim.text, "Missing"), {
    before: claim.text,
    match: "",
    after: "",
  });
  assert.equal(
    passageHref({ ...source, url: "javascript:alert(1)" }, claim.citations[0]),
    undefined,
  );
  assert.equal(
    passageHref({ ...source, url: "data:text/html,bad" }, claim.citations[0]),
    undefined,
  );
  assert.equal(
    passageHref(source, { sourceId: "a", excerpt: "Summary" }),
    source.url,
  );
  assert.ok(
    passageHref(source, claim.citations[0]).includes(
      "#:~:text=First%20sentence.",
    ),
  );
  console.log(
    "PASS: source identity and unknown-source filtering; literal match boundaries; safe passage URLs and exact/summary distinction",
  );
} finally {
  await server.close();
}
