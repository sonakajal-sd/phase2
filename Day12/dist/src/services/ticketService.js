import * as ticketRepository from "../repositories/ticketRepository.js";
export const PRIORITIES = ["low", "medium", "high"];
export const STATUSES = ["open", "in_progress", "resolved", "closed"];
export function getAllTickets() {
    return ticketRepository.findAllTickets();
}
export function getTicket(id) {
    return ticketRepository.findTicketById(id);
}
export function addTicket({ title, description, priority = "medium" }) {
    return ticketRepository.createTicket({ title, description, priority });
}
export function updateStatus(id, status) {
    return ticketRepository.updateTicketStatus(id, status);
}
export function assignTicket(id, assignee) {
    return ticketRepository.updateTicketAssignee(id, assignee);
}
export function removeTicket(id) {
    return ticketRepository.deleteTicket(id);
}
// Returns null when the ticket does not exist.
export async function getComments(ticketId) {
    const ticket = await ticketRepository.findTicketById(ticketId);
    return ticket ? ticket.comments : null;
}
// Returns null when the ticket does not exist.
export async function addComment(ticketId, comment) {
    const exists = await ticketRepository.ticketExists(ticketId);
    return exists ? ticketRepository.createComment(ticketId, comment) : null;
}
