import { NotFoundError } from "../errors/app-error";
import { ticketRepository } from "../repositories/ticket.repository";
import { ListTicketsQuery } from "../types/ticket.types";
import {
  validateCreateTicket,
  validateListQuery,
  validateTicketId,
  validateUpdateTicket,
} from "../validators/ticket.validator";

const findExistingTicket = async (id: number) => {
  const ticket = await ticketRepository.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  return ticket;
};

export const ticketService = {
  async listTickets(query: ListTicketsQuery) {
    const { filters, pagination } = validateListQuery(query);

    const [tickets, total] = await Promise.all([
      ticketRepository.findMany(filters, pagination),
      ticketRepository.count(filters),
    ]);

    return {
      data: tickets,
      meta: {
        ...pagination,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  },

  async getTicketById(rawId: unknown) {
    return findExistingTicket(validateTicketId(rawId));
  },

  async createTicket(body: unknown) {
    return ticketRepository.create(validateCreateTicket(body));
  },

  async updateTicket(rawId: unknown, body: unknown) {
    const id = validateTicketId(rawId);
    const changes = validateUpdateTicket(body);

    await findExistingTicket(id);

    return ticketRepository.update(id, changes);
  },

  async deleteTicket(rawId: unknown) {
    const id = validateTicketId(rawId);

    await findExistingTicket(id);

    return ticketRepository.delete(id);
  },
};
