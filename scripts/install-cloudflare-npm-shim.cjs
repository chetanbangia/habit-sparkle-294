const fs = require("node:fs");
const path = require("node:path");

const npmCliPath = process.env.npm_execpath;

if (!npmCliPath || path.basename(npmCliPath) !== "npm-cli.js") {
  process.exit(0);
}

try {
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