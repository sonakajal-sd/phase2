import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

const url = "http://localhost:3000";

async function login(email: string, password: string) {
  const resopnse = await request(url)
    .post("/auth/login")
    .send({ email, password });

  return resopnse.body.token as string;
}
let adminToken: string;

async function deleteTicket(id: number) {
  const response = await request(url)
    .delete(`/tickets/${id}`)
    .set("Authorization", `Bearer ${adminToken}`);

  console.log(response.body.message);
}

describe("<-- endpoints test -->", () => {
  let agentToken: string;
  let customer1Token: string;
  let customer2Token: string;

  beforeAll(async () => {
    adminToken = await login("anjal@vonnue.com", "password123");
    agentToken = await login("yasin@vonnue.com", "password123");
    customer1Token = await login("gauresh@vonnue.com", "password123");
    customer2Token = await login("akshay@vonnue.com", "password123");
  });

  // endpoint: 1
  it("creates a ticket", async () => {
    const response = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(response.status).toBe(201);

    await deleteTicket(response.body.ticket.id);
  });

  // endpoint: 2
  it("rejects when the agent is trying to create a ticket", async () => {
    const response = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        title: "title from new test agent",
        description: "agent agent agent",
        priority: "high",
        category_id: 1,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("you are not allowed to create tickets");
  });

  // endopoint: 3
  it("rejects when the user tries to update the ticket status", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(url)
      .patch(`/tickets/${createResponse.body.ticket.id}/status`)
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({ status: "in_progress" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "you are not allowed to edit this ticket",
    );

    await deleteTicket(createResponse.body.ticket.id);
  });

  // endpoint: 4
  it("rejects when customer 2 tries to delete the ticket made by customer 1", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(url)
      .delete(`/tickets/${createResponse.body.ticket.id}`)
      .set("Authorization", `Bearer ${customer2Token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("ticket not found");

    await deleteTicket(createResponse.body.ticket.id);
  });

  // endpoint: 5
  it("prevents a user from viewing another customers ticket", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(url)
      .get(`/tickets/${createResponse.body.ticket.id}`)
      .set("Authorization", `Bearer ${customer2Token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("ticket not found");

    await deleteTicket(createResponse.body.ticket.id);
  });

  // endpoint: 6
  it("lets admin delete a ticket", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(url)
      .delete(`/tickets/${createResponse.body.ticket.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("ticket deleted");
    await deleteTicket(createResponse.body.ticket.id);
  });

  // endpoint: 7
  it("rejects delete by non-admin user", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(url)
      .delete(`/tickets/${createResponse.body.ticket.id}`)
      .set("Authorization", `Bearer ${agentToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("you are not allowed to delete ticket");
    await deleteTicket(createResponse.body.ticket.id);
  });

  // endpoint: 8
  it("allows an assigned agent to change status with valid transaction", async () => {});

  // endpoint: 9
  it("reject invalid priority", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "urgent",
        category_id: 1,
      });

    expect(createResponse.status).toBe(400);
    expect(createResponse.body.error.fieldErrors.priority).toBeTruthy();
  });

  // endpoint: 10
  it("prevents users and agents from assigning tickets", async () => {
    const createResponse = await request(url)
      .post("/tickets")
      .set("Authorization", `Bearer ${customer1Token}`)
      .send({
        title: "title from new test",
        description: "description from new test",
        priority: "high",
        category_id: 1,
      });

    const agentResponse = await request(url)
      .patch(`/tickets/${createResponse.body.ticket.id}/assignee`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        assignee: "Christo",
      });

    expect(agentResponse.status).toBe(403);
    expect(agentResponse.body.message).toBe(
      "you are not allowed to assignee tickets",
    );

    const customerResponse = await request(url)
      .patch(`/tickets/${createResponse.body.ticket.id}/assignee`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        assignee: "Christo",
      });

    expect(customerResponse.status).toBe(403);
    expect(customerResponse.body.message).toBe(
      "you are not allowed to assignee tickets",
    );

    await deleteTicket(createResponse.body.ticket.id);
  });
});
