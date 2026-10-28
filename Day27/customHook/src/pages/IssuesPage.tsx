import { useState } from "react";
import { Link } from "react-router";
import { useDebounce } from "../hooks/useDebounce";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useIssues } from "../hooks/useIssues";
import { useProjects } from "../hooks/useProjects";

export function IssuesPage() {
  const [projectId, setProjectId] = useState(0); // 0 = all projects
  const [search, setSearch] = useState("");

  // Waits until the user stops typing for 300ms.
  const debouncedSearch = useDebounce(search, 300);

  const { projects } = useProjects();
  const { issues, loading, error } = useIssues(projectId);

  // No effect needed here: this is just a calculation from data we already have.
  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useDocumentTitle(`Issues (${filteredIssues.length})`);

  return (
    <main>
      <h1>Issues</h1>

      <select
        value={projectId}
        onChange={(event) => setProjectId(Number(event.target.value))}
      >
        <option value={0}>All projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search issues..."
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {filteredIssues.map((issue) => (
          <li key={issue.id}>
            <Link to={`/issues/${issue.id}`}>{issue.title}</Link> ({issue.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
