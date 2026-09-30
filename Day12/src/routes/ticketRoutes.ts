import { Router } from "express";
import * as ticketController from "../controllers/ticketController.js";

const router = Router();

router.get("/", ticketController.listTickets);
router.post("/", ticketController.createTicket);
router.get("/:id", ticketController.getTicket);
router.delete("/:id", ticketController.deleteTicket);
router.patch("/:id/status", ticketController.updateStatus);
router.patch("/:id/assignee", ticketController.updateAssignee);
router.get("/:id/comments", ticketController.listComments);
router.post("/:id/comments", ticketController.addComment);

export default router;
