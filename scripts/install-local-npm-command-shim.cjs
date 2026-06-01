const fs = require("node:fs");
const path = require("node:path");

const npmExecPath = process.env.npm_execpath;
const marker = "lovable-npm-c1-compat";

if (!npmExecPath) {
  process.exit(0);
}

function patchActiveNpmCli() {
  const npmCli = fs.readFileSync(npmExecPath, "utf8");
  const shim = `// ${marker}
if (process.argv[2] === "c1") {
  console.log("Compatibility: running npm ci for mistyped npm c1 build command.");
  process.argv[2] = "ci";
}
`;

  const previousShim = new RegExp(
    `// ${marker}\\nif \\(process\\.argv\\[2\\] === "c1"\\) \\{\\n[\\s\\S]*?\\n\\}\\n`,
  );
  const cleanNpmCli = npmCli.replace(previousShim, "");
  const shebang = cleanNpmCli.match(/^#!.*\n/);
  const patchedNpmCli = shebang
    ? shebang[0] + shim + cleanNpmCli.slice(shebang[0].length)
    : shim + cleanNpmCli;

  fs.writeFileSync(npmExecPath, patchedNpmCli);
}

try {
  patchActiveNpmCli();

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
  console.log("Installed npm c1 compatibility shim.");
} catch (error) {
  console.warn("Could not install npm c1 compatibility shim:", error.message);
}