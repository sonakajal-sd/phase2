import { Search } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { issues } from "../data/issues";
import type { Issue } from "../types/issue";
import IssueCard from "./IssueCard";

const IssueDashboard = () => {
  // ---------- State (only the minimum we need) ----------
  // The real list of issues
  const [issueList, setIssueList] = useState<Issue[]>(issues);

  // Search / filter / sort values
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  // Add-issue form values
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<Issue["status"]>("Open");
  const [newPriority, setNewPriority] = useState<Issue["priority"]>("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [formError, setFormError] = useState("");

  // ---------- Derived values (calculated, NOT stored in state) ----------
  const searchText = search.trim().toLowerCase();

  const filteredIssues = issueList.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchText) ||
      issue.description.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || issue.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Copy with [...] first, because sort() changes the original array
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });

  // Split the sorted list into the three board columns
  const openIssues = sortedIssues.filter((issue) => issue.status === "Open");
  const inProgressIssues = sortedIssues.filter(
    (issue) => issue.status === "In Progress"
  );
  const doneIssues = sortedIssues.filter((issue) => issue.status === "Done");

  // Counts for the summary boxes (based on ALL issues)
  const totalCount = issueList.length;
  const openCount = issueList.filter((issue) => issue.status === "Open").length;
  const doneCount = issueList.filter((issue) => issue.status === "Done").length;

  const isFiltering =
    search !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortBy !== "none";

  // ---------- Event handlers ----------
  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("none");
  }

  function resetForm() {
    setNewTitle("");
    setNewDescription("");
    setNewStatus("Open");
    setNewPriority("Medium");
    setNewDueDate("");
    setFormError("");
  }

  function toggleForm() {
    if (showForm) {
      resetForm();
    }
    setShowForm(!showForm);
  }

  function handleAddIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTitle.trim() || !newDescription.trim() || !newDueDate) {
      setFormError("Please fill in title, description and due date.");
      return;
    }

    const newIssue: Issue = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: newStatus,
      priority: newPriority,
      dueDate: newDueDate,
    };

    // Immutable update: make a NEW array instead of using push()
    setIssueList((prev) => [...prev, newIssue]);

    resetForm();
    setShowForm(false);
  }

  // ---------- UI ----------
  return (
    <div className="dashboard">
      {/* Summary */}
      <section className="totalIssues">
        <div>
          <p>Total Issues</p>
          <h5>{totalCount}</h5>
        </div>
        <div>
          <p>Open</p>
          <h5>{openCount}</h5>
        </div>
        <div>
          <p>Completed</p>
          <h5>{doneCount}</h5>
        </div>
      </section>

      {/* Search, filters, sort */}
      <section className="toolbar">
        <div className="searchBox">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label className="field">
          Status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <label className="field">
          Priority
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="field">
          Sort By
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">Default Order</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={clearFilters}
          disabled={!isFiltering}
        >
          Clear Filters
        </button>

        <button type="button" className="btn btn-primary" onClick={toggleForm}>
          {showForm ? "Cancel" : "+ Add Issue"}
        </button>
      </section>

      {/* Add issue form */}
      {showForm && (
        <form className="addIssueForm" onSubmit={handleAddIssue}>
          <h3>Create New Issue</h3>

          <label htmlFor="issueTitle">Title</label>
          <input
            id="issueTitle"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <label htmlFor="issueDescription">Description</label>
          <textarea
            id="issueDescription"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <div className="form-row">
            <div>
              <label htmlFor="issueStatus">Status</label>
              <select
                id="issueStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Issue["status"])}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="issuePriority">Priority</label>
              <select
                id="issuePriority"
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(e.target.value as Issue["priority"])
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="issueDueDate">Due Date</label>
              <input
                id="issueDueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <button type="submit" className="btn btn-primary">
            Create Issue
          </button>
        </form>
      )}

      <p className="result-count">
        Showing {sortedIssues.length} of {totalCount} issues
      </p>

      {/* Board columns */}
      {sortedIssues.length === 0 ? (
        <p className="no-issues">No issues match your search or filters.</p>
      ) : (
        <div className="board-columns">
          <section className="issue-column issue-column-open">
            <h2 className="column-title">Open ({openIssues.length})</h2>
            {openIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </section>

          <section className="issue-column issue-column-progress">
            <h2 className="column-title">
              In Progress ({inProgressIssues.length})
            </h2>
            {inProgressIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </section>

          <section className="issue-column issue-column-done">
            <h2 className="column-title">Completed ({doneIssues.length})</h2>
            {doneIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default IssueDashboard;
