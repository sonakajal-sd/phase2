import { useEffect, useState } from "react";
import { apiFetch } from "./api/client";
import type { Project, Issue } from "./types";
import "../src/App.css";

function App() {

  const path= window.location.pathname;

  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectData, issueData] = await Promise.all([
          apiFetch<Project[]>("/projects"),
          apiFetch<Issue[]>("/issues"),
        ]);

        setProjects(projectData);
        setIssues(issueData);

      }
       catch {
        setError("Failed to load data");
      } 
      finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div>
      <p>{error}</p>
      <button onClick={handleRetry}>Retry</button>
    </div>
  )

  if(path ==="/"){
    return(
      <main>
        <h1>API INTEGRATION</h1>
        <h2>Projects</h2>
        {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <p key={project.id}>{project.name}</p>
        ))
      )}
       <h2>Issues</h2>
      {issues.length === 0 ?(
        <p>No issues found</p>
      ):(
        issues.map((issue)=>(
          <p key={issue.id}>{issue.title}  --- {issue.status}</p>
        ))
      )}
      </main>
    )

  }

  if(path === "/api/projects"){
    return(
      <main>
         <h1>Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <p key={project.id}>{project.name}</p>
        ))
      )}
      </main>
    )
  }
  if(path ==="/api/issues"){
    return(
      <main>
         <h1>Issues</h1>
      {issues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        issues.map((issue) => (
          <p key={issue.id}>
            {issue.title} — {issue.status}
          </p>
        ))
      )}
      </main>
    )
  }
 
}

export default App;