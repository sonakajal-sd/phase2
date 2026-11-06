import { useEffect, useState } from "react";
import { getIssues } from "../api/issueApi";
import IssueForm from "../components/IssueForm";
import { STATUS_LABELS } from "../types/issue";
import type { Issue, IssueStatus } from "../types/issue";

export default function Issues() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
    const [search, setSearch] = useState("");

    // Changing this number makes the effect below run again (used by "Try again").
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        getIssues()
            .then(setIssues)
            .catch(() => setError("Could not load issues."))
            .finally(() => setLoading(false));
    }, [reloadCount]);

    function handleRetry() {
        setError("");
        setLoading(true);
        setReloadCount((count) => count + 1);
    }

    function handleCreated(newIssue: Issue) {
        setIssues((oldIssues) => [newIssue, ...oldIssues]); // newest first
    }

    // No state needed: the visible list is calculated from issues + filters.
    const visibleIssues = issues.filter((issue) => {
        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
        const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="issues-page">
            <h1>Issues</h1>

            <IssueForm onCreated={handleCreated} />

            <div className="filters">
                <label htmlFor="status-filter">Filter by status</label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IssueStatus | "all")}
                >
                    <option value="all">All</option>
                    <option value="open">{STATUS_LABELS.open}</option>
                    <option value="in_progress">{STATUS_LABELS.in_progress}</option>
                    <option value="closed">{STATUS_LABELS.closed}</option>
                </select>

                <label htmlFor="search">Search</label>
                <input id="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Only one of these is shown at a time */}
            {loading ? (
                <p role="status">Loading issues...</p>
            ) : error ? (
                <div role="alert">
                    <p className="error">{error}</p>
                    <button onClick={handleRetry}>Try again</button>
                </div>
            ) : issues.length === 0 ? (
                <p>No issues yet. Create the first one above.</p>
            ) : visibleIssues.length === 0 ? (
                <p>No issues match your filters.</p>
            ) : (
                <ul aria-label="Issue list">
                    {visibleIssues.map((issue) => (
                        <li key={issue.id}>
                            {issue.title} <span className="badge">{STATUS_LABELS[issue.status]}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
