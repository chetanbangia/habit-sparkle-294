const fs = require("node:fs");
const path = require("node:path");

const marker = "lovable-cloudflare-npm-c1-compat-v2";
const npmExecPath = process.env.npm_execpath;

function patchNpmCli() {
  if (!npmExecPath || !fs.existsSync(npmExecPath)) return false;

  const source = fs.readFileSync(npmExecPath, "utf8");
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
  if (!npmExecPath) return false;

  const binDir = path.join(process.cwd(), "node_modules", ".bin");
  fs.mkdirSync(binDir, { recursive: true });

  const shimPath = path.join(binDir, "npm");
  const shim = `#!/usr/bin/env node\nif (process.argv[2] === "c1") {\n  console.log("Compatibility: treating mistyped npm c1 as already satisfied.");\n  process.exit(0);\n}\nawait import(${JSON.stringify(npmExecPath)});\n`;

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