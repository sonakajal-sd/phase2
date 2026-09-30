import { prisma } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Comment, Ticket } from "../generated/prisma/client.js";

export type TicketWithComments = Ticket & { comments: Comment[] };

export type CreateTicketInput = {
  title: string;
  description: string;
  priority: string;
};

export type CreateCommentInput = {
  author: string;
  body: string;
};

// Prisma throws P2025 when update/delete targets a row that doesn't exist.
function isRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

async function nullIfNotFound<T>(query: Promise<T>): Promise<T | null> {
  try {
    return await query;
  } catch (error) {
    if (isRecordNotFound(error)) return null;
    throw error;
  }
}

export function findAllTickets(): Promise<Ticket[]> {
  return prisma.ticket.findMany({ orderBy: { id: "asc" } });
}

export function findTicketById(id: number): Promise<TicketWithComments | null> {
  return prisma.ticket.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
}

export function createTicket(data: CreateTicketInput): Promise<Ticket> {
  return prisma.ticket.create({ data });
}

export function updateTicketStatus(id: number, status: string): Promise<Ticket | null> {
  return nullIfNotFound(prisma.ticket.update({ where: { id }, data: { status } }));
}

export function updateTicketAssignee(id: number, assignee: string): Promise<Ticket | null> {
  return nullIfNotFound(prisma.ticket.update({ where: { id }, data: { assignee } }));
}

export function deleteTicket(id: number): Promise<Ticket | null> {
  return nullIfNotFound(prisma.ticket.delete({ where: { id } }));
}

export async function ticketExists(id: number): Promise<boolean> {
  const count = await prisma.ticket.count({ where: { id } });
  return count > 0;
}

export function createComment(ticketId: number, data: CreateCommentInput): Promise<Comment> {
  return prisma.comment.create({ data: { ...data, ticketId } });
}
