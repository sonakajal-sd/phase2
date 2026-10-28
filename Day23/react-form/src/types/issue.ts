export type IssuePriority = "low" | "medium" | "high";

export type IssueStatus = "open" | "in-progress" | "closed";

export type Issue = {
  id: number;
  title: string;
  description: string;
  project: string;
  assignee: string;
  priority: IssuePriority;
  status: IssueStatus;
  dueDate: string;
  labels: string[];
};
