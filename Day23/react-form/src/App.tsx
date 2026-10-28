import { useState } from "react";
import type { Issue } from "./types/issue";
import IssueForm from "./components/IssueForm";
import IssueList from "./components/IssueList";
import "./App.css";

function App() {

  // the list of all issues
  const [issues, setIssues] = useState<Issue[]>([]);

  // true = show the form, false = show the list
  const [showForm, setShowForm] = useState(false);

  // the issue being edited (null means we are creating a new one)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // message shown after saving
  const [message, setMessage] = useState("");

  // "New issue" button: open an empty form
  function openNewForm() {
    setEditingIssue(null);
    setMessage("");
    setShowForm(true);
  }

  // "Edit" button: open the form with this issue's values
  function openEditForm(issue: Issue) {
    setEditingIssue(issue);
    setMessage("");
    setShowForm(true);
  }

  // called by IssueForm when the user clicks Create / Update
  function saveIssue(savedIssue: Issue) {
    if (editingIssue) {
      // replace the old issue with the new one
      setIssues(issues.map((issue) => (issue.id === savedIssue.id ? savedIssue : issue)));
      setMessage(`Issue "${savedIssue.title}" was updated.`);
    } else {
      // add the new issue to the end of the list
      setIssues([...issues, savedIssue]);
      setMessage(`Issue "${savedIssue.title}" was created.`);
    }
    setShowForm(false);
  }

  return (
    <main className="app">
      <h1>Issue tracker</h1>

      <p className="status-message">{message}</p>

      {showForm ? (
        <IssueForm
          issue={editingIssue}
          onSave={saveIssue}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <button type="button" onClick={openNewForm}>New issue</button>
          <IssueList issues={issues} onEdit={openEditForm} />
        </>
      )}
    </main>
  );
}

export default App;
