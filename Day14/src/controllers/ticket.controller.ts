import { Request, Response } from "express";
import { ticketService } from "../services/ticket.service";

export const getTickets = async (req: Request, res: Response) => {
  const result = await ticketService.listTickets(req.query);

  res.status(200).json(result);
};

export const getTicketById = async (req: Request, res: Response) => {
  const ticket = await ticketService.getTicketById(req.params.id);

  res.status(200).json({ data: ticket });
};

export const createTicket = async (req: Request, res: Response) => {
  const ticket = await ticketService.createTicket(req.body);

  res.status(201).json({ data: ticket });
};

export const updateTicket = async (req: Request, res: Response) => {
  const ticket = await ticketService.updateTicket(req.params.id, req.body);

  res.status(200).json({ data: ticket });
};

export const deleteTicket = async (req: Request, res: Response) => {
  await ticketService.deleteTicket(req.params.id);

  res.status(204).send();
};

