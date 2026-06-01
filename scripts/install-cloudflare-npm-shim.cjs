const fs = require("node:fs");
const path = require("node:path");

const npmCliPath = process.env.npm_execpath;
const localBinDir = path.join(process.cwd(), "node_modules", ".bin");
const localNpmShimPath = path.join(localBinDir, "npm");
const marker = "lovable-cloudflare-c1-shim";

if (!npmCliPath || path.basename(npmCliPath) !== "npm-cli.js") {
  process.exit(0);
}

try {
  fs.mkdirSync(localBinDir, { recursive: true });
  fs.writeFileSync(
    localNpmShimPath,
    `#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const realNpmCli = ${JSON.stringify(npmCliPath)};
const args = process.argv.slice(2);

if (args[0] === "c1") {
  console.log("Cloudflare build command compatibility: treating npm c1 as npm ci.");
  args[0] = "ci";
}

const result = spawnSync(process.execPath, [realNpmCli, ...args], { stdio: "inherit" });
process.exit(result.status ?? 1);
`,
  );
  fs.chmodSync(localNpmShimPath, 0o755);

  const npmCli = fs.readFileSync(npmCliPath, "utf8");

  const shim = `// ${marker}
if (process.argv[2] === "c1") {
  console.log("Cloudflare build command compatibility: treating npm c1 as npm ci.");
  process.argv[2] = "ci";
}
`;

  const existingShimPattern = new RegExp(
    `// ${marker}\\nif \\(process\\.argv\\[2\\] === "c1"\\) \\{\\n[\\s\\S]*?\\n\\}\\n`,
  );

  const npmCliWithoutOldShim = npmCli.replace(existingShimPattern, "");

  const shebangMatch = npmCliWithoutOldShim.match(/^#!.*\n/);
  const patchedNpmCli = shebangMatch
    ? shebangMatch[0] + shim + npmCliWithoutOldShim.slice(shebangMatch[0].length)
    : shim + npmCliWithoutOldShim;

  fs.writeFileSync(npmCliPath, patchedNpmCli);
  console.log("Installed Cloudflare npm c1→ci compatibility shim.");
} catch (error) {
  console.warn("Could not install Cloudflare npm c1 compatibility shim:", error.message);
}