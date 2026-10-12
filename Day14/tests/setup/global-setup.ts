import { execSync } from "node:child_process";
import { loadTestEnv } from "./load-test-env";

export default function globalSetup() {
  const databaseUrl = loadTestEnv();

  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });
}
