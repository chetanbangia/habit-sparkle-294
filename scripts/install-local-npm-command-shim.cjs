const fs = require("node:fs");
const path = require("node:path");

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  process.exit(0);
}

try {
  const binDir = path.join(process.cwd(), "node_modules", ".bin");
  fs.mkdirSync(binDir, { recursive: true });

  const shimPath = path.join(binDir, "npm");
  const shim = `#!/usr/bin/env node
const { spawnSync } = require("node:child_process");

const npmExecPath = ${JSON.stringify(npmExecPath)};
const args = process.argv.slice(2);

if (args[0] === "c1") {
  console.log("Compatibility: running npm ci for mistyped npm c1 build command.");
  args[0] = "ci";
}

const result = spawnSync(process.execPath, [npmExecPath, ...args], {
  stdio: "inherit",
  env: { ...process.env, PATH: process.env.PATH || "" },
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
`;

  fs.writeFileSync(shimPath, shim);
  fs.chmodSync(shimPath, 0o755);
  console.log("Installed local npm command compatibility shim.");
} catch (error) {
  console.warn("Could not install local npm command compatibility shim:", error.message);
}