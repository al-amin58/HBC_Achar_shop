/**
 * Free port 5001 (or PORT arg) by stopping the listening process on Windows.
 * Usage: node scripts/kill-port.mjs [port]
 */
import { execSync } from "child_process";

const port = process.argv[2] || process.env.PORT || "5001";

try {
  const cmd = `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`;
  const out = execSync(cmd, { encoding: "utf8" }).trim();
  const pids = [...new Set(out.split(/\s+/).map((s) => s.trim()).filter((id) => id && id !== "0"))];

  if (pids.length === 0) {
    console.log(`No process is listening on port ${port}.`);
    process.exit(0);
  }

  for (const pid of pids) {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit" });
    console.log(`Stopped process ${pid} on port ${port}`);
  }
} catch (err) {
  if (err.status === 1) {
    console.log(`No process is listening on port ${port}.`);
    process.exit(0);
  }
  console.error(err.message || err);
  process.exit(1);
}
