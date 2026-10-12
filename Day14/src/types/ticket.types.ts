export const TICKET_PRIORITIES = ["low", "medium", "high"] as const;
export const TICKET_STATUSES = ["open", "in_progress", "closed"] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface CreateTicketInput {
  title: string;
  description: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assignee?: string;
}

export type UpdateTicketInput = Partial<CreateTicketInput>;

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface ListTicketsQuery {
  page?: unknown;
  limit?: unknown;
  status?: unknown;
  priority?: unknown;
  assignee?: unknown;
}
