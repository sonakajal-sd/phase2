import { useState } from "react";
import type { Issue, IssuePriority, IssueStatus } from "../types/issue";
import "./IssueForm.css";

type IssueFormProps = {
  issue: Issue | null; // an issue to edit, or null to create a new one
  onSave: (issue: Issue) => void;
  onCancel: () => void;
};

const IssueForm = ({ issue, onSave, onCancel }: IssueFormProps) => {

  // one state for each field
  // if we are editing, start with the issue's values, otherwise start empty
  const [title, setTitle] = useState(issue ? issue.title : "");
  const [description, setDescription] = useState(issue ? issue.description : "");
  const [project, setProject] = useState(issue ? issue.project : "");
  const [assignee, setAssignee] = useState(issue ? issue.assignee : "sona");
  const [priority, setPriority] = useState<IssuePriority>(issue ? issue.priority : "medium");
  const [status, setStatus] = useState<IssueStatus>(issue ? issue.status : "open");
  const [dueDate, setDueDate] = useState(issue ? issue.dueDate : "");
  const [labels, setLabels] = useState<string[]>(issue ? issue.labels : []);

  // error messages
  const [titleError, setTitleError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  // today's date as "YYYY-MM-DD", the same format the date input uses
  const today = new Date().toLocaleDateString("en-CA");

  // tick a label on or off
  function toggleLabel(label: string) {
    if (labels.includes(label)) {
      setLabels(labels.filter((item) => item !== label));
    } else {
      setLabels([...labels, label]);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      return;
    }
    setTitleError("");

    if (!project) {
      setProjectError("Please choose a project");
      return;
    }
    setProjectError("");

    if (dueDate && dueDate < today) {
      setDueDateError("Due date cannot be in the past");
      return;
    }
    setDueDateError("");

    const newIssue: Issue = {
      id: issue ? issue.id : Date.now(), // keep the old id when editing
      title: title.trim(),
      description: description.trim(),
      project,
      assignee,
      priority,
      status,
      dueDate,
      labels,
    };
    onSave(newIssue);
  }

  return (
    <form className="issue-form" onSubmit={handleSubmit} noValidate>
      <h2>{issue ? "Edit issue" : "Create issue"}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          maxLength={100}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
        />
        {titleError && <p className="field-error">{titleError}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="project">Project</label>
        <select
          id="project"
          value={project}
          onChange={(e) => { setProject(e.target.value); setProjectError(""); }}
        >
          <option value="">Select a project</option>
          <option value="issue-dashboard">Issue Dashboard</option>
          <option value="todo-app">Todo App</option>
        </select>
        {projectError && <p className="field-error">{projectError}</p>}
      </div>

      <div className="field">
        <label htmlFor="assignee">Assignee</label>
        <select id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="sona">Sona</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as IssuePriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as IssueStatus)}
          >
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="dueDate">Due date</label>
        <input
          type="date"
          id="dueDate"
          min={today}
          value={dueDate}
          onChange={(e) => { setDueDate(e.target.value); setDueDateError(""); }}
        />
        {dueDateError && <p className="field-error">{dueDateError}</p>}
      </div>

      <fieldset className="field checkbox-group">
        <legend>Labels</legend>
        {["bug", "frontend", "backend", "urgent"].map((label) => (
          <div key={label} className="checkbox">
            <input
              type="checkbox"
              id={`label-${label}`}
              checked={labels.includes(label)}
              onChange={() => toggleLabel(label)}
            />
            <label htmlFor={`label-${label}`}>{label}</label>
          </div>
        ))}
      </fieldset>

      <div className="form-actions">
        <button type="submit">{issue ? "Update issue" : "Create issue"}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default IssueForm;
