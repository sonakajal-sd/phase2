import { config } from "dotenv";
import path from "node:path";

/**
 * Loads .env.test and guards against ever pointing tests at a non-test database,
 * because the suite truncates tables between tests.
 */
export const loadTestEnv = () => {
  config({ path: path.resolve(__dirname, "../../.env.test"), override: true, quiet: true });

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test")) {
    throw new Error(
      "Refusing to run tests: DATABASE_URL in .env.test must point to a database ending in '_test'",
    );
  }

  return databaseUrl;
};
