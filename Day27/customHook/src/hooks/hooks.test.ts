import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";
import { useDocumentTitle } from "./useDocumentTitle";
import { useIssue } from "./useIssue";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("useDebounce", () => {
  it("updates the value only after the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "abc" });
    expect(result.current).toBe("a"); // not yet

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("abc"); // now it updates
  });
});

describe("useDocumentTitle", () => {
  it("sets the page title", () => {
    renderHook(() => useDocumentTitle("Hello"));
    expect(document.title).toBe("Hello");
  });
});

describe("useIssue", () => {
  it("loads an issue", async () => {
    const fakeIssue = { id: 1, title: "Bug", status: "open", projectId: 1, createdAt: "" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(fakeIssue))));

    const { result } = renderHook(() => useIssue(1));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.issue).toEqual(fakeIssue);
    expect(result.current.error).toBe("");
  });

  it("shows an error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));

    const { result } = renderHook(() => useIssue(99));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load issue");
  });
});
