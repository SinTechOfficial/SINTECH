const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
for (const lockFile of ["package-lock.json", "yarn.lock"]) {
  const filePath = path.join(root, lockFile);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // Ignore cleanup error if file locked
    }
  }
}

const userAgent = process.env.npm_config_user_agent || "";
if (userAgent && !userAgent.includes("pnpm")) {
  console.error("Please use pnpm instead of npm or yarn.");
  process.exit(1);
}
