import { useState } from "react";
import type { FormEvent } from "react";
import { createIssue } from "../api/issueApi";
import { STATUS_LABELS } from "../types/issue";
import type { Issue, IssueStatus } from "../types/issue";

type Props = {
    onCreated: (issue: Issue) => void; // called after the backend saves the issue
};

export default function IssueForm({ onCreated }: Props) {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<IssueStatus>("open");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        // Check on the frontend first so we don't send a useless request
        if (title.trim() === "") {
            setError("Title is required.");
            return;
        }

        setSaving(true);

        try {
            const newIssue = await createIssue(title.trim(), status);
            onCreated(newIssue);
            setTitle(""); // clear the form for the next issue
            setStatus("open");
        } catch {
            setError("Could not create the issue. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    // aria-label gives the form an accessible name, so tests can find it with getByRole("form")
    return (
        <form className="issue-form" aria-label="New issue" onSubmit={handleSubmit}>
            <h2>New issue</h2>

            <label htmlFor="issue-title">Title</label>
            <input id="issue-title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor="issue-status">Status</label>
            <select id="issue-status" value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)}>
                <option value="open">{STATUS_LABELS.open}</option>
                <option value="in_progress">{STATUS_LABELS.in_progress}</option>
                <option value="closed">{STATUS_LABELS.closed}</option>
            </select>

            {error && <p className="error" role="alert">{error}</p>}

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Create issue"}
            </button>
        </form>
    );
}
