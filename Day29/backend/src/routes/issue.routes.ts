import { Router } from "express";
import { createIssue, listIssues } from "../controllers/issue.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Any logged-in user can see and create issues
router.get("/", requireAuth, listIssues);
router.post("/", requireAuth, createIssue);

export default router;
