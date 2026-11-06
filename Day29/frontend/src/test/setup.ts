// Runs before every test file (see vite.config.ts).
import "@testing-library/jest-dom/vitest"; // adds matchers like toBeInTheDocument()
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
    cleanup(); // remove whatever the test rendered
    vi.unstubAllGlobals(); // put the real fetch back
});
