import { prisma } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
// Prisma throws P2025 when update/delete targets a row that doesn't exist.
function isRecordNotFound(error) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}
async function nullIfNotFound(query) {
    try {
        return await query;
    }
    catch (error) {
        if (isRecordNotFound(error))
            return null;
        throw error;
    }
}
export function findAllTickets() {
    return prisma.ticket.findMany({ orderBy: { id: "asc" } });
}
export function findTicketById(id) {
    return prisma.ticket.findUnique({
        where: { id },
        include: { comments: { orderBy: { createdAt: "asc" } } },
    });
}
export function createTicket(data) {
    return prisma.ticket.create({ data });
}
export function updateTicketStatus(id, status) {
    return nullIfNotFound(prisma.ticket.update({ where: { id }, data: { status } }));
}
export function updateTicketAssignee(id, assignee) {
    return nullIfNotFound(prisma.ticket.update({ where: { id }, data: { assignee } }));
}
export function deleteTicket(id) {
    return nullIfNotFound(prisma.ticket.delete({ where: { id } }));
}
export async function ticketExists(id) {
    const count = await prisma.ticket.count({ where: { id } });
    return count > 0;
}
export function createComment(ticketId, data) {
    return prisma.comment.create({ data: { ...data, ticketId } });
}
