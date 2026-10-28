import { Link, useParams } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useIssue } from "../hooks/useIssue";

export function IssueDetailPage() {
  const { id } = useParams(); // the :id part of the URL
  const { issue, loading, error } = useIssue(Number(id));

  useDocumentTitle(issue ? issue.title : "Issue");

  return (
    <main>
      <Link to="/">Back to issues</Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {issue && (
        <div>
          <h1>{issue.title}</h1>
          <p>Status: {issue.status}</p>
          <p>Project: {issue.projectId}</p>
        </div>
      )}
    </main>
  );
}
