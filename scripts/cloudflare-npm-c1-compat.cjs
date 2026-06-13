const fs = require("node:fs");
const path = require("node:path");

const marker = "lovable-cloudflare-npm-c1-compat-v2";
const npmExecPath = process.env.npm_execpath;
const npmBinPath = process.platform === "win32" ? "npm.cmd" : "/bin/npm";

function patchNpmCli() {
  if (!npmExecPath || !fs.existsSync(npmExecPath)) return false;

  // Only patch JS-based npm CLIs. Never touch native binaries (e.g. bun).
  const buf = fs.readFileSync(npmExecPath);
  const head = buf.slice(0, 256).toString("utf8");
  if (!head.startsWith("#!") || !/node/.test(head.split("\n")[0])) return false;

  const source = buf.toString("utf8");
  if (source.includes(marker)) return true;

  const shim = `// ${marker}\nif (process.argv[2] === "c1") {\n  console.log("Compatibility: treating mistyped npm c1 as already satisfied.");\n  process.exit(0);\n}\n`;

  const shebang = source.match(/^#!.*\n/);
  const patched = shebang
    ? shebang[0] + shim + source.slice(shebang[0].length)
    : shim + source;

  fs.writeFileSync(npmExecPath, patched);
  return true;
}

function createLocalNpmShim() {
  const binDir = path.join(process.cwd(), "node_modules", ".bin");
  fs.mkdirSync(binDir, { recursive: true });

  const shimPath = path.join(binDir, "npm");
  const shim = `#!/usr/bin/env node\nconst { spawnSync } = require("node:child_process");\nif (process.argv[2] === "c1") {\n  console.log("Compatibility: treating mistyped npm c1 as already satisfied.");\n  process.exit(0);\n}\nconst result = spawnSync(${JSON.stringify(npmBinPath)}, process.argv.slice(2), { stdio: "inherit" });\nprocess.exit(result.status ?? 1);\n`;

  fs.writeFileSync(shimPath, shim);
  fs.chmodSync(shimPath, 0o755);
  return true;
}

try {
  const patchedCli = patchNpmCli();
  const patchedLocal = createLocalNpmShim();
  if (patchedCli || patchedLocal) {
    console.log("Installed Cloudflare npm c1 compatibility patch.");
  }
} catch (error) {
  console.warn("Could not install Cloudflare npm c1 compatibility patch:", error.message);
}