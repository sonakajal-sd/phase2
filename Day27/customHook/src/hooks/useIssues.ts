import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Issue } from "../types";

// projectId is optional: without it we load every issue.
export function useIssues(projectId?: number) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchIssues() {
      setLoading(true);
      setError("");

      let url = "/issues";
      if (projectId) {
        url = `/issues?projectId=${projectId}`;
      }

      try {
        const data = await apiFetch<Issue[]>(url, controller.signal);
        setIssues(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Failed to load issues");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchIssues();

    // Cleanup: cancels the old request when projectId changes or on unmount,
    // so an old, slow response can't replace the new one.
    return () => {
      controller.abort();
    };
  }, [projectId]); // fetch again whenever projectId changes

  return { issues, loading, error };
}
