import { Ticket } from "../../generated/prisma/client";
import { prisma } from "../../src/lib/prisma";
import { CreateTicketInput } from "../../src/types/ticket.types";

let sequence = 0;

export const buildTicketInput = (
  overrides: Partial<CreateTicketInput> = {},
): CreateTicketInput => {
  sequence += 1;

  return {
    title: `Ticket ${sequence}`,
    description: `Description for ticket ${sequence}`,
    priority: "medium",
    status: "open",
    ...overrides,
  };
};

/** In-memory ticket for unit tests; never touches the database. */
export const buildTicket = (overrides: Partial<Ticket> = {}): Ticket => {
  const input = buildTicketInput();
  const now = new Date("2026-01-01T00:00:00.000Z");

  return {
    id: sequence,
    title: input.title,
    description: input.description,
    priority: input.priority ?? "medium",
    status: input.status ?? "open",
    assignee: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

export const createTicket = (overrides: Partial<CreateTicketInput> = {}) =>
  prisma.ticket.create({ data: buildTicketInput(overrides) });

export const createTickets = async (
  count: number,
  overrides: Partial<CreateTicketInput> = {},
) => {
  const tickets: Ticket[] = [];

  // Sequential inserts keep createdAt ordering deterministic for pagination tests.
  for (let i = 0; i < count; i += 1) {
    tickets.push(await createTicket(overrides));
  }

  return tickets;
};
