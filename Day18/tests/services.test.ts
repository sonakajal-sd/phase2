import { title } from "node:process";
import {
  addAssigneeDB,
  createTicketDB,
  deleteTicketDB,
  getTicketByIdDB,
  listTicketsDB,
  updateTicketStatusDB,
} from "../src/db/database.js";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { escape } from "node:querystring";

const prismaMock = vi.hoisted(() => ({
  ticket: {
    count: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findFirst: vi.fn(),
  },
  assignment: {
    create: vi.fn(),
  },
}));

vi.mock("../src/db/prisma.js", () => ({
  default: prismaMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// test: 1
describe("listTicketDB", () => {
  test("-- ticket with where", async () => {
    prismaMock.ticket.count.mockResolvedValue(2);
    prismaMock.ticket.findMany.mockResolvedValue([
      { id: 1, title: "bug" },
      { id: 2, title: "api" },
    ]);

    const result = await listTicketsDB({
      page: 1,
      pageSize: 10,
      status: "open",
      priority: "high",
      assignee: 1,
      search: "bug",
      sortField: "createdAt",
      sortDirection: "desc",
    });

    expect(prismaMock.ticket.findMany).toHaveBeenCalledWith({
      where: {
        status: "open",
        priority: "high",
        assignments: { some: { userId: 1 } },
        title: { contains: "bug", mode: "insensitive" },
      },
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  });
});

// test: 2
describe("createTicketDB", () => {
  test("-- new ticket creation", async () => {
    prismaMock.ticket.create.mockResolvedValue({ id: 1, title: "test title" });
    await createTicketDB({
      title: "test title",
      description: "test description",
      priority: "high",
      customer_id: 1,
      category_id: 2,
    });

    expect(prismaMock.ticket.create).toHaveBeenCalledWith({
      data: {
        title: "test title",
        description: "test description",
        priority: "high",
        customerId: 1,
        categoryId: 2,
      },
    });
  });
});

// test: 3
describe("getTicketByIdDB", () => {
  test("-- gets ticket by id", async () => {
    prismaMock.ticket.findUnique.mockResolvedValue({ id: 1 });

    const result = await getTicketByIdDB(1);
    expect(prismaMock.ticket.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(result?.id).toBe(1);
  });
});

// test: 4
describe("updateTicketStatusDB", () => {
  test("-- upate ticket status", async () => {
    prismaMock.ticket.update.mockResolvedValue({
      id: 1,
      status: "in_progress",
    });

    await updateTicketStatusDB(1, "in_progress");

    expect(prismaMock.ticket.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        status: "in_progress",
        updatedAt: new Date(),
      },
    });
  });
});

// test: 5
describe("deleteTicketDB", () => {
  test("-- ticket deletion by id", async () => {
    prismaMock.ticket.delete.mockResolvedValue({ id: 1 });

    await deleteTicketDB(1);

    expect(prismaMock.ticket.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
});

// test: 7
describe("addAssigneeDB", () => {
  test("-- adding assignee to ticket", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: 1, name: "Anjal" });
    prismaMock.assignment.create.mockResolvedValue({ id: 3 });

    await addAssigneeDB(1, "Anjal");

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        name: "Anjal",
      },
    });

    expect(prismaMock.assignment.create).toHaveBeenCalledWith({
      data: {
        ticketId: 1,
        userId: 1,
      },
    });
  });
});
