import type { Issue, IssueStatus } from "../types/issue";
import { apiFetch } from "./apiFetch";

export function getIssues(): Promise<Issue[]> {
    return apiFetch("/api/issues");
}

export function createIssue(title: string, status: IssueStatus): Promise<Issue> {
    return apiFetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
    });
}
