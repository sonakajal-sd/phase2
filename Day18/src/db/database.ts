import type { Prisma } from "../generated/prisma/client.js";
import { UserRole, type TicketStatus } from "../generated/prisma/enums.js";
import type { CreateTicket, TicketQuery } from "../utils/validation.js";
import prisma from "./prisma.js";

export async function listTicketsDB(
  validationResult: TicketQuery,
  userId: number,
  role: UserRole,
) {
  try {
    const {
      page,
      pageSize,
      status,
      priority,
      assignee,
      search,
      sortField,
      sortDirection,
    } = validationResult;

    const where: Prisma.TicketWhereInput = {
      ...(role === UserRole.customer && { customerId: userId }),
      ...(role === UserRole.agent && {
        assignments: {
          some: {
            userId: userId,
          },
        },
      }),
      ...(status && { status: status }),
      ...(priority && { priority: priority }),
      ...(assignee && {
        assignments: {
          some: { userId: assignee },
        },
      }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const skip = (page - 1) * pageSize;

    const total = await prisma.ticket.count({
      where: where,
    });

    const tickets = await prisma.ticket.findMany({
      where: where,
      skip: skip,
      take: pageSize,
      orderBy: {
        [sortField]: sortDirection,
      },
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      total,
      totalPages,
      tickets,
    };
  } catch (error) {
    console.error("ListTicketDB error: ", error);
    throw new Error("database operation failed");
  }
}

export async function createTicketDB(
  data: CreateTicket,
  userId: number,
  role: UserRole,
) {
  if (role === UserRole.admin || role === UserRole.customer) {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        customerId: userId,
        categoryId: data.category_id,
      },
    });
    return ticket;
  } else {
    throw new Error("FORBIDDEN");
  }
}

export async function getTicketByIdDB(
  id: number,
  userId: number,
  role: UserRole,
) {
  try {
    const where = {
      ...(role === UserRole.customer && { customerId: userId }),
      ...(role === UserRole.agent && {
        assignments: {
          some: {
            userId: userId,
          },
        },
      }),
      id,
    };
    const ticket = await prisma.ticket.findFirst({
      where,
    });
    return ticket;
  } catch (error) {
    console.error("getTicketByIdDB error: ", error);
    throw new Error("database operation failed");
  }
}

export async function updateTicketStatusDB(
  id: number,
  status: TicketStatus,
  userId: number,
  role: string,
) {
  if (role === UserRole.customer) {
    throw new Error("FORBIDDEN");
  }

  const where = {
    id,
    ...(role === UserRole.agent && {
      assignments: {
        some: {
          userId: userId,
        },
      },
    }),
  };

  const ticketFound = await prisma.ticket.findFirst({
    where,
  });

  if (!ticketFound) {
    throw new Error("NOT_FOUND");
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      status: status,
      updatedAt: new Date(),
    },
  });

  return ticket;
}

export async function deleteTicketDB(
  id: number,
  userId: number,
  role: UserRole,
) {
  if (role === UserRole.agent) {
    throw new Error("FORBIDDEN");
  }

  const where =
    role === UserRole.customer
      ? {
          id,
          customerId: userId,
        }
      : {
          id,
        };

  const ticket = await prisma.ticket.findFirst({
    where,
  });

  if (!ticket) {
    return false;
  }

  await prisma.ticket.delete({
    where: {
      id: ticket.id,
    },
  });

  return true;
}

export async function addAssigneeDB(
  id: number,
  assignee: string,
  role: string,
) {
  if (role === UserRole.customer || role === UserRole.agent) {
    throw new Error("FORBIDDEN");
  }
  const user = await prisma.user.findFirst({
    where: { name: assignee },
  });

  if (!user) {
    throw new Error("NOT_FOUND");
  }
  const assignment = await prisma.assignment.create({
    data: {
      ticketId: id,
      userId: user.id,
    },
  });
  return assignment;
}
