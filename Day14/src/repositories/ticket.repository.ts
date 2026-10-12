import { prisma } from "../lib/prisma";
import {
  CreateTicketInput,
  Pagination,
  TicketFilters,
  UpdateTicketInput,
} from "../types/ticket.types";

export const ticketRepository = {
  findMany(filters: TicketFilters, { page, limit }: Pagination) {
    return prisma.ticket.findMany({
      where: filters,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    });
  },

  count(filters: TicketFilters) {
    return prisma.ticket.count({ where: filters });
  },

  findById(id: number) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  },

  create(data: CreateTicketInput) {
    return prisma.ticket.create({
      data,
    });
  },

  update(id: number, data: UpdateTicketInput) {
    return prisma.ticket.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.ticket.delete({
      where: { id },
    });
  },
};
