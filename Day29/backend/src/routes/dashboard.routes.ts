import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Any logged-in user
router.get("/", requireAuth, getDashboard);

export default router;
