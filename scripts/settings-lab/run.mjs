import { createServer } from "vite";
import { mkdtemp, realpath, symlink, rm, readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = process.cwd();
const contract = JSON.parse(await readFile("docs/settings-language/contract.json", "utf8"));
const temp = await realpath(await mkdtemp(path.join(tmpdir(), "oreo-settings-verify-")));
const servers = [];
async function freePort() {
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0, "localhost", resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return port;
}
async function digest() {
  const hash = createHash("sha256");
  async function walk(dir) {
    for (const file of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
      const name = `${dir}/${file.name}`;
      if (file.isDirectory()) await walk(name);
      else hash.update(name).update(await readFile(name));
    }
  }
  await walk("src");
  hash.update(await readFile("pnpm-lock.yaml"));
  return hash.digest("hex");
}
async function run(script, env = {}, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [script, ...args], { stdio: "inherit", env: { ...process.env, ...env } });
    proc.on("error", reject);
    proc.on("exit", code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}
const started = await digest();
try {
  await run("scripts/settings-lab/guard.mjs", {}, ["--self-test"]);
  const archive = spawnSync("git", ["archive", contract.baselineCommit], { maxBuffer: 256 * 1024 * 1024 });
  if (archive.status !== 0) throw new Error(archive.stderr.toString());
  const extract = spawnSync("tar", ["-x", "-C", temp], { input: archive.stdout });
  if (extract.status !== 0) throw new Error(extract.stderr.toString());
  await symlink(path.join(root, "node_modules"), path.join(temp, "node_modules"));
  const urls = [];
  for (const [dir, cacheDir] of [[root, path.join(root, "node_modules/.vite-settings-verify")], [temp, path.join(temp, ".vite-cache")]]) {
    const server = await createServer({ root: dir, cacheDir, resolve: { dedupe: ["react", "react-dom"] }, server: { port: await freePort(), host: "localhost", strictPort: true, fs: { allow: [dir, path.join(root, "node_modules")] } }, logLevel: "error" });
    await server.listen(); servers.push(server);
    urls.push(`http://localhost:${server.httpServer.address().port}`);
  }
  const env = { SETTINGS_LAB_URL: urls[0], SETTINGS_BASELINE_URL: urls[1] };
  const results = await Promise.allSettled([run("scripts/settings-lab/qa.mjs", env), run("scripts/settings-lab/baseline.mjs", env), run("scripts/settings-lab/state-probes.mjs", env)]);
  const finished = await digest();
  if (started !== finished) throw new Error("Source changed during verification. Results are not a valid snapshot.");
  const failed = results.filter(r => r.status === "rejected");
  const summary = { verifiedAt: new Date().toISOString(), sourceDigest: finished, baselineCommit: contract.baselineCommit, passed: failed.length === 0, results: results.map(r => r.status === "fulfilled" ? "passed" : String(r.reason)) };
  await mkdir("artifacts/settings-lab", { recursive: true });
  await writeFile("artifacts/settings-lab/summary.json", JSON.stringify(summary, null, 2) + "\n");
  if (failed.length) throw new AggregateError(failed.map(r => r.reason), "Settings verification failed");
  console.log("Settings verification complete; all checks passed.");
} finally {
  await Promise.allSettled(servers.map(s => s.close()));
  await rm(temp, { recursive: true, force: true });
}
