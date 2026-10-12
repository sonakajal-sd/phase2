import request from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { ticketRepository } from "../../src/repositories/ticket.repository";
import { disconnectDatabase, resetDatabase } from "../helpers/database";
import { buildTicketInput, createTicket, createTickets } from "../factories/ticket.factory";

describe("Tickets API (integration)", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe("GET /tickets", () => {
    it("returns an empty page when there are no tickets", async () => {
      // Act
      const response = await request(app).get("/tickets");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    });

    it("paginates results newest first", async () => {
      // Arrange
      const tickets = await createTickets(5);
      const [, , third, fourth] = [...tickets].reverse();

      // Act
      const response = await request(app).get("/tickets?page=2&limit=2");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.map((t: { id: number }) => t.id)).toEqual([third.id, fourth.id]);
      expect(response.body.meta).toEqual({ page: 2, limit: 2, total: 5, totalPages: 3 });
    });

    it("filters by status and priority", async () => {
      // Arrange
      const match = await createTicket({ status: "closed", priority: "high" });
      await createTicket({ status: "closed", priority: "low" });
      await createTicket({ status: "open", priority: "high" });

      // Act
      const response = await request(app).get("/tickets?status=closed&priority=high");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.meta.total).toBe(1);
      expect(response.body.data[0].id).toBe(match.id);
    });

    it("filters by assignee", async () => {
      // Arrange
      await createTicket({ assignee: "alex" });
      await createTicket({ assignee: "sam" });

      // Act
      const response = await request(app).get("/tickets?assignee=alex");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].assignee).toBe("alex");
    });

    it.each([
      ["page=0", "Page must be a positive integer"],
      ["limit=abc", "Limit must be a positive integer"],
      ["limit=101", "Limit must not exceed 100"],
      ["status=pending", "Status must be one of: open, in_progress, closed"],
    ])("returns 400 for invalid query %s", async (query, message) => {
      // Act
      const response = await request(app).get(`/tickets?${query}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: message });
    });
  });

  describe("GET /tickets/:id", () => {
    it("returns the ticket", async () => {
      // Arrange
      const ticket = await createTicket({ title: "VPN down" });

      // Act
      const response = await request(app).get(`/tickets/${ticket.id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({ id: ticket.id, title: "VPN down" });
    });

    it("returns 404 for a missing ticket", async () => {
      // Act
      const response = await request(app).get("/tickets/9999");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Ticket not found" });
    });

    it("returns 400 for an invalid id", async () => {
      // Act
      const response = await request(app).get("/tickets/abc");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid ticket ID" });
    });
  });

  describe("POST /tickets", () => {
    it("creates a ticket with defaults and persists it", async () => {
      // Arrange
      const payload = { title: "Laptop slow", description: "Takes 5 minutes to boot" };

      // Act
      const response = await request(app).post("/tickets").send(payload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({ ...payload, priority: "medium", status: "open" });
      const saved = await prisma.ticket.findUnique({ where: { id: response.body.data.id } });
      expect(saved).not.toBeNull();
    });

    it("returns 400 and stores nothing when the title is missing", async () => {
      // Arrange
      const payload = { description: "No title given" };

      // Act
      const response = await request(app).post("/tickets").send(payload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Title is required" });
      expect(await prisma.ticket.count()).toBe(0);
    });

    it("returns 400 for malformed JSON", async () => {
      // Act
      const response = await request(app)
        .post("/tickets")
        .set("Content-Type", "application/json")
        .send("{ invalid json");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Malformed JSON body" });
    });
  });

  describe("PATCH /tickets/:id", () => {
    it("updates only the provided fields", async () => {
      // Arrange
      const ticket = await createTicket({ title: "Original", status: "open" });

      // Act
      const response = await request(app)
        .patch(`/tickets/${ticket.id}`)
        .send({ status: "in_progress" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({ title: "Original", status: "in_progress" });
    });

    it("returns 400 for an empty update body", async () => {
      // Arrange
      const ticket = await createTicket();

      // Act
      const response = await request(app).patch(`/tickets/${ticket.id}`).send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "At least one field must be provided" });
    });

    it("returns 404 for a missing ticket", async () => {
      // Act
      const response = await request(app).patch("/tickets/9999").send({ status: "closed" });

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /tickets/:id", () => {
    it("deletes the ticket", async () => {
      // Arrange
      const ticket = await createTicket();

      // Act
      const response = await request(app).delete(`/tickets/${ticket.id}`);

      // Assert
      expect(response.status).toBe(204);
      expect(await prisma.ticket.findUnique({ where: { id: ticket.id } })).toBeNull();
    });

    it("returns 404 for a missing ticket", async () => {
      // Act
      const response = await request(app).delete("/tickets/9999");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Ticket not found" });
    });
  });

  describe("database errors", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns 500 without leaking details when listing fails", async () => {
      // Arrange
      vi.spyOn(ticketRepository, "findMany").mockRejectedValue(
        new Error("connection refused"),
      );

      // Act
      const response = await request(app).get("/tickets");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });

    it("returns 500 when creating fails", async () => {
      // Arrange
      vi.spyOn(ticketRepository, "create").mockRejectedValue(new Error("disk full"));

      // Act
      const response = await request(app).post("/tickets").send(buildTicketInput());

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });
});
