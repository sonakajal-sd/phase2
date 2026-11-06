import { Router } from "express";
import { listUsers } from "../controllers/admin.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// Logged in AND role is admin
router.get("/users", requireAuth, requireRole("admin"), listUsers);

export default router;
