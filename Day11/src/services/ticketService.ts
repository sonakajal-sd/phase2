import {
  getAllTickets as getAllTicketsRepo,
  getTicketById,
  createTicket,
  updateTicketStatus as updateTicketStatusRepo,
  updateTicketAssignee,
  deleteTicket,
} from "../repositories/ticketRepo.js";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string | null;
};

export async function getAllTickets(): Promise<Ticket[]> {
  return getAllTicketsRepo();
}

export async function getOneTicket(id: number): Promise<Ticket | undefined> {
  return getTicketById(id);
}

export async function addTicket(
  title: string,
  description: string,
  priority: string = "medium"
): Promise<Ticket> {
  return createTicket(title, description, priority);
}

export async function updateTicketStatus(
  id: number,
  status: string
): Promise<Ticket | undefined> {
  return updateTicketStatusRepo(id, status);
}

export async function updateTicketAssigneeService(
  id: number,
  assignee: string
): Promise<Ticket | undefined> {
  return updateTicketAssignee(id, assignee);
}

export async function deleteTicketService(id: number): Promise<Ticket | undefined> {
  return deleteTicket(id);
}

export async function assignTicketService(
  id: number,
  assignee: string
): Promise<Ticket | undefined> {
  return updateTicketAssignee(id, assignee);
}
