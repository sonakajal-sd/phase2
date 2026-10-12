import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    globalSetup: ["tests/setup/global-setup.ts"],
    setupFiles: ["tests/setup/env.ts"],
    // Integration files share one test database, so run files one at a time.
    fileParallelism: false,
    restoreMocks: true,
  },
});
