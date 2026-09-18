import { describe, it, expect, vi } from "vitest";
import { getTasks } from "../../src/repository/taskRepository.js";


vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

describe("Task Repository", () => {
  it("should return empty array when file is missing", async () => {
    const error: Error & { code?: string } = new Error("File not found");
    error.code = "ENOENT";
   

    const result = await getTasks();

    expect(result).toEqual([]);
  });

  it("should rethrow errors that are not ENOENT", async () => {

    await expect(getTasks()).rejects.toThrow("Permission denied");
  });
});