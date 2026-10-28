import { Router, type Response } from "express";
import {
  addAssigneeDB,
  createTicketDB,
  deleteTicketDB,
  getTicketByIdDB,
  listTicketsDB,
  updateTicketStatusDB,
} from "../db/database.js";
import {
  idSchema,
  ticketQuerySchema,
  ticketSchema,
} from "../utils/validation.js";
import {
  authenticate,
  type AuthRequest,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = ticketSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const ticket = await createTicketDB(result.data, req.userId!, req.role!);

    return res.status(201).json({ ticket });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res
        .status(403)
        .json({ message: "you are not allowed to create tickets" });
    }
    return res.status(500).json({ message: "failed to create tickets" });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const validationResult = ticketQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.flatten(),
      });
    }

    const result = await listTicketsDB(
      validationResult.data,
      req.userId!,
      req.role!,
    );
    return res.status(200).json({
      data: result.tickets,
      pagination: {
        page: validationResult.data.page,
        pageSize: validationResult.data.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "failed to fetch tickets" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const result = idSchema.safeParse(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const ticket = await getTicketByIdDB(result.data, req.userId!, req.role!);

    if (!ticket) {
      return res.status(404).json({ message: "ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to get the specific ticket" });
  }
});

router.patch("/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["open", "in_progress", "resolve", "closed"].includes(status)) {
      return res.status(400).json({ error: "invalid status" });
    }

    const result = idSchema.safeParse(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const ticket = await updateTicketStatusDB(
      result.data,
      status,
      req.userId!,
      req.role!,
    );

    return res.status(200).json({ ticket });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({
        message: "you are not allowed to edit this ticket",
      });
    }

    if (error instanceof Error && error.message === "NOT_FOUND") {
      return res.status(404).json({ error: "ticket not found" });
    }

    return res.status(500).json({ message: "failed to update ticket status" });
  }
});

router.patch("/:id/assignee", async (req: AuthRequest, res: Response) => {
  try {
    const { assignee } = req.body;
    if (!assignee && typeof assignee !== "string") {
      return res.status(400).json({ error: "invalid assingee" });
    }

    const result = idSchema.safeParse(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const ticket = await addAssigneeDB(result.data, assignee, req.role!);

    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res
        .status(403)
        .json({ message: "you are not allowed to assignee tickets" });
    }

    if (error instanceof Error && error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(500).json({ message: "failed to add assignee" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const result = idSchema.safeParse(req.params.id);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    const success = await deleteTicketDB(result.data, req.userId!, req.role!);
    if (!success) {
      return res.status(404).json({ error: "ticket not found" });
    }

    return res.status(200).json({ message: "ticket deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res
        .status(403)
        .json({ message: "you are not allowed to delete ticket" });
    }
    return res.status(500).json({ message: "failed to delete ticket" });
  }
});

export default router;
