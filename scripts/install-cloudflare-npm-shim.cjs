const fs = require("node:fs");
const path = require("node:path");

const npmCliPath = process.env.npm_execpath;
const localBinDir = path.join(process.cwd(), "node_modules", ".bin");
const localNpmShimPath = path.join(localBinDir, "npm");

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
  console.log("Cloudflare build command compatibility: treating npm c1 as npm ci already completed.");
  process.exit(0);
}

const result = spawnSync(process.execPath, [realNpmCli, ...args], { stdio: "inherit" });
process.exit(result.status ?? 1);
`,
  );
  fs.chmodSync(localNpmShimPath, 0o755);

  const npmCli = fs.readFileSync(npmCliPath, "utf8");

  if (npmCli.includes("lovable-cloudflare-c1-shim")) {
    process.exit(0);
  }

  const shim = `
// lovable-cloudflare-c1-shim
if (process.argv[2] === "c1") {
  process.argv[2] = "ci";
}
`;

  fs.writeFileSync(npmCliPath, shim + npmCli);
  console.log("Installed Cloudflare npm c1→ci compatibility shim.");
} catch (error) {
  console.warn("Could not install Cloudflare npm c1 compatibility shim:", error.message);
}