import type { Issue } from "../types/issue";

type IssueListProps = {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
};

// A simple list of saved issues, each with an Edit button.
const IssueList = ({ issues, onEdit }: IssueListProps) => {
  if (issues.length === 0) {
    return <p>No issues yet. Create your first one.</p>;
  }

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <li key={issue.id}>
          <div>
            <strong>{issue.title}</strong>
            <p>
              {issue.project} · {issue.priority} priority · {issue.status}
              {issue.dueDate && ` · due ${issue.dueDate}`}
            </p>
          </div>
          <button type="button" className="secondary" onClick={() => onEdit(issue)}>
            Edit <span className="visually-hidden">{issue.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default IssueList;
