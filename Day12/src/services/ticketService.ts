import * as ticketRepository from "../repositories/ticketRepository.js";
import type { CreateCommentInput } from "../repositories/ticketRepository.js";

export const PRIORITIES = ["low", "medium", "high"] as const;
export const STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

export type NewTicket = {
  title: string;
  description: string;
  priority?: string;
};

export function getAllTickets() {
  return ticketRepository.findAllTickets();
}

export function getTicket(id: number) {
  return ticketRepository.findTicketById(id);
}

export function addTicket({ title, description, priority = "medium" }: NewTicket) {
  return ticketRepository.createTicket({ title, description, priority });
}

export function updateStatus(id: number, status: string) {
  return ticketRepository.updateTicketStatus(id, status);
}

export function assignTicket(id: number, assignee: string) {
  return ticketRepository.updateTicketAssignee(id, assignee);
}

export function removeTicket(id: number) {
  return ticketRepository.deleteTicket(id);
}

// Returns null when the ticket does not exist.
export async function getComments(ticketId: number) {
  const ticket = await ticketRepository.findTicketById(ticketId);
  return ticket ? ticket.comments : null;
}

// Returns null when the ticket does not exist.
export async function addComment(ticketId: number, comment: CreateCommentInput) {
  const exists = await ticketRepository.ticketExists(ticketId);
  return exists ? ticketRepository.createComment(ticketId, comment) : null;
}
