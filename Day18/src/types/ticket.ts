export type Priority = "low" | "medium" | "high";

export type TicketStatus = "open" | "in_progress" | "resolve" | "closed";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignee?: string;
  createdAt: string;
}
