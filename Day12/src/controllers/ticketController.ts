import type { Request, Response } from "express";
import * as ticketService from "../services/ticketService.js";
import { PRIORITIES, STATUSES } from "../services/ticketService.js";

function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return id;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function notFound(res: Response) {
  return res.status(404).json({ error: "Ticket not found" });
}

export async function listTickets(_req: Request, res: Response) {
  res.json(await ticketService.getAllTickets());
}

export async function getTicket(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const ticket = await ticketService.getTicket(id);
  if (!ticket) return notFound(res);
  res.json(ticket);
}

export async function createTicket(req: Request, res: Response) {
  const { title, description, priority } = req.body ?? {};
  if (!isNonEmptyString(title) || !isNonEmptyString(description)) {
    return res.status(400).json({ error: "title and description are required" });
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${PRIORITIES.join(", ")}` });
  }

  const ticket = await ticketService.addTicket({ title, description, priority });
  res.status(201).json(ticket);
}

export async function updateStatus(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const { status } = req.body ?? {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
  }

  const ticket = await ticketService.updateStatus(id, status);
  if (!ticket) return notFound(res);
  res.json(ticket);
}

export async function updateAssignee(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const { assignee } = req.body ?? {};
  if (!isNonEmptyString(assignee)) {
    return res.status(400).json({ error: "assignee is required" });
  }

  const ticket = await ticketService.assignTicket(id, assignee);
  if (!ticket) return notFound(res);
  res.json(ticket);
}

export async function deleteTicket(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const ticket = await ticketService.removeTicket(id);
  if (!ticket) return notFound(res);
  res.status(204).send();
}

export async function listComments(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const comments = await ticketService.getComments(id);
  if (!comments) return notFound(res);
  res.json(comments);
}

export async function addComment(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const { author, body } = req.body ?? {};
  if (!isNonEmptyString(author) || !isNonEmptyString(body)) {
    return res.status(400).json({ error: "author and body are required" });
  }

  const comment = await ticketService.addComment(id, { author, body });
  if (!comment) return notFound(res);
  res.status(201).json(comment);
}
