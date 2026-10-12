import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError, ValidationError } from "../../src/errors/app-error";
import { ticketRepository } from "../../src/repositories/ticket.repository";
import { ticketService } from "../../src/services/ticket.service";
import { buildTicket, buildTicketInput } from "../factories/ticket.factory";

vi.mock("../../src/repositories/ticket.repository", () => ({
  ticketRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const repository = vi.mocked(ticketRepository);

describe("ticketService (unit)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("listTickets", () => {
    it("applies default pagination and returns page metadata", async () => {
      // Arrange
      const tickets = [buildTicket(), buildTicket()];
      repository.findMany.mockResolvedValue(tickets);
      repository.count.mockResolvedValue(25);

      // Act
      const result = await ticketService.listTickets({});

      // Assert
      expect(repository.findMany).toHaveBeenCalledWith({}, { page: 1, limit: 10 });
      expect(result).toEqual({
        data: tickets,
        meta: { page: 1, limit: 10, total: 25, totalPages: 3 },
      });
    });

    it("passes filters and custom pagination to the repository", async () => {
      // Arrange
      repository.findMany.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      // Act
      await ticketService.listTickets({
        page: "2",
        limit: "5",
        status: "closed",
        priority: "high",
      });

      // Assert
      const filters = { status: "closed", priority: "high" };
      expect(repository.findMany).toHaveBeenCalledWith(filters, { page: 2, limit: 5 });
      expect(repository.count).toHaveBeenCalledWith(filters);
    });

    it("rejects an invalid status filter without querying the database", async () => {
      // Act
      const action = ticketService.listTickets({ status: "unknown" });

      // Assert
      await expect(action).rejects.toBeInstanceOf(ValidationError);
      expect(repository.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getTicketById", () => {
    it("returns the ticket when it exists", async () => {
      // Arrange
      const ticket = buildTicket({ id: 7 });
      repository.findById.mockResolvedValue(ticket);

      // Act
      const result = await ticketService.getTicketById("7");

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(7);
      expect(result).toBe(ticket);
    });

    it("throws NotFoundError when the ticket does not exist", async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act
      const action = ticketService.getTicketById(999);

      // Assert
      await expect(action).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError for a non-numeric id", async () => {
      // Act
      const action = ticketService.getTicketById("abc");

      // Assert
      await expect(action).rejects.toThrow(new ValidationError("Invalid ticket ID"));
      expect(repository.findById).not.toHaveBeenCalled();
    });
  });

  describe("createTicket", () => {
    it("trims input and creates the ticket", async () => {
      // Arrange
      const created = buildTicket();
      repository.create.mockResolvedValue(created);

      // Act
      const result = await ticketService.createTicket({
        title: "  Printer broken  ",
        description: " Paper jam ",
      });

      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        title: "Printer broken",
        description: "Paper jam",
      });
      expect(result).toBe(created);
    });

    it.each([
      [{ description: "No title" }, "Title is required"],
      [{ title: "   ", description: "Blank title" }, "Title is required"],
      [{ title: "No description" }, "Description is required"],
      [{ ...buildTicketInput(), priority: "urgent" }, "Priority must be one of: low, medium, high"],
    ])("rejects invalid payload %o", async (payload, message) => {
      // Act
      const action = ticketService.createTicket(payload);

      // Assert
      await expect(action).rejects.toThrow(new ValidationError(message));
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateTicket", () => {
    it("updates an existing ticket with only the provided fields", async () => {
      // Arrange
      const existing = buildTicket({ id: 3 });
      const updated = { ...existing, status: "closed" };
      repository.findById.mockResolvedValue(existing);
      repository.update.mockResolvedValue(updated);

      // Act
      const result = await ticketService.updateTicket(3, { status: "closed" });

      // Assert
      expect(repository.update).toHaveBeenCalledWith(3, { status: "closed" });
      expect(result).toBe(updated);
    });

    it("throws NotFoundError and skips the update when the ticket is missing", async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act
      const action = ticketService.updateTicket(3, { status: "closed" });

      // Assert
      await expect(action).rejects.toBeInstanceOf(NotFoundError);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTicket", () => {
    it("deletes an existing ticket", async () => {
      // Arrange
      const existing = buildTicket({ id: 4 });
      repository.findById.mockResolvedValue(existing);
      repository.delete.mockResolvedValue(existing);

      // Act
      await ticketService.deleteTicket(4);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith(4);
    });

    it("propagates repository (database) errors", async () => {
      // Arrange
      repository.findById.mockRejectedValue(new Error("Connection lost"));

      // Act
      const action = ticketService.deleteTicket(4);

      // Assert
      await expect(action).rejects.toThrow("Connection lost");
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
