import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, test } from "node:test";
import { app } from "../src/app.js";
import { prisma } from "../src/db/prisma.js";

let server: Server;
let baseUrl: string;
const createdIds: number[] = [];

async function request(method: string, path: string, body?: unknown) {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(`${baseUrl}${path}`, init);
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

async function createTestTicket() {
  const { body } = await request("POST", "/tickets", {
    title: "Test ticket",
    description: "Created by the test suite",
  });
  createdIds.push(body.id);
  return body;
}

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await prisma.ticket.deleteMany({ where: { id: { in: createdIds } } });
  await prisma.$disconnect();
  server.close();
});

describe("POST /tickets", () => {
  test("creates a ticket with default priority and status", async () => {
    const { status, body } = await request("POST", "/tickets", {
      title: "Printer offline",
      description: "Office printer is not reachable",
    });
    createdIds.push(body.id);

    assert.equal(status, 201);
    assert.equal(body.priority, "medium");
    assert.equal(body.status, "open");
    assert.equal(body.assignee, null);
  });

  test("rejects a missing title", async () => {
    const { status } = await request("POST", "/tickets", { description: "No title" });
    assert.equal(status, 400);
  });

  test("rejects an unknown priority", async () => {
    const { status } = await request("POST", "/tickets", {
      title: "Bad priority",
      description: "x",
      priority: "urgent",
    });
    assert.equal(status, 400);
  });
});

describe("GET /tickets", () => {
  test("lists tickets", async () => {
    const ticket = await createTestTicket();
    const { status, body } = await request("GET", "/tickets");

    assert.equal(status, 200);
    assert.ok(body.some((t: { id: number }) => t.id === ticket.id));
  });

  test("returns a single ticket with its comments", async () => {
    const ticket = await createTestTicket();
    const { status, body } = await request("GET", `/tickets/${ticket.id}`);

    assert.equal(status, 200);
    assert.equal(body.id, ticket.id);
    assert.deepEqual(body.comments, []);
  });

  test("returns 400 for an invalid id and 404 for a missing ticket", async () => {
    assert.equal((await request("GET", "/tickets/abc")).status, 400);
    assert.equal((await request("GET", "/tickets/999999")).status, 404);
  });
});

describe("PATCH /tickets/:id", () => {
  test("updates status", async () => {
    const ticket = await createTestTicket();
    const { status, body } = await request("PATCH", `/tickets/${ticket.id}/status`, {
      status: "resolved",
    });

    assert.equal(status, 200);
    assert.equal(body.status, "resolved");
  });

  test("rejects an unknown status", async () => {
    const ticket = await createTestTicket();
    const { status } = await request("PATCH", `/tickets/${ticket.id}/status`, { status: "done" });
    assert.equal(status, 400);
  });

  test("updates assignee", async () => {
    const ticket = await createTestTicket();
    const { status, body } = await request("PATCH", `/tickets/${ticket.id}/assignee`, {
      assignee: "Sona",
    });

    assert.equal(status, 200);
    assert.equal(body.assignee, "Sona");
  });

  test("returns 404 when the ticket does not exist", async () => {
    const { status } = await request("PATCH", "/tickets/999999/status", { status: "closed" });
    assert.equal(status, 404);
  });
});

describe("comments", () => {
  test("adds and lists comments for a ticket", async () => {
    const ticket = await createTestTicket();

    const created = await request("POST", `/tickets/${ticket.id}/comments`, {
      author: "Sona",
      body: "Looking into it",
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.ticketId, ticket.id);

    const { status, body } = await request("GET", `/tickets/${ticket.id}/comments`);
    assert.equal(status, 200);
    assert.equal(body.length, 1);
    assert.equal(body[0].body, "Looking into it");
  });

  test("returns 404 when commenting on a missing ticket", async () => {
    const { status } = await request("POST", "/tickets/999999/comments", {
      author: "Sona",
      body: "Hello",
    });
    assert.equal(status, 404);
  });
});

describe("DELETE /tickets/:id", () => {
  test("deletes a ticket and its comments", async () => {
    const ticket = await createTestTicket();
    await request("POST", `/tickets/${ticket.id}/comments`, { author: "Sona", body: "x" });

    assert.equal((await request("DELETE", `/tickets/${ticket.id}`)).status, 204);
    assert.equal((await request("GET", `/tickets/${ticket.id}`)).status, 404);
    assert.equal(await prisma.comment.count({ where: { ticketId: ticket.id } }), 0);
  });

  test("returns 404 when the ticket does not exist", async () => {
    assert.equal((await request("DELETE", "/tickets/999999")).status, 404);
  });
});
