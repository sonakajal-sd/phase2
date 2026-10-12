import { loadTestEnv } from "./load-test-env";

// Runs in every test worker before test files import src/lib/prisma.
loadTestEnv();
