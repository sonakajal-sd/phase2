import type { Request, Response } from "express";
import prisma from "../lib/prisma";

const STATUSES = ["open", "in_progress", "closed"];

// GET /api/issues
export async function listIssues(req: Request, res: Response) {
    const issues = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } });
    res.json(issues);
}

// POST /api/issues   body: { title, status? }
export async function createIssue(req: Request, res: Response) {
    const { title, status } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }

    if (status !== undefined && !STATUSES.includes(status)) {
        return res.status(400).json({ message: "Status must be open, in_progress or closed" });
    }

    const issue = await prisma.issue.create({
        data: {
            title: title.trim(),
            status: status ?? "open",
            authorId: req.user!.id, // requireAuth has already set req.user
        },
    });

    res.status(201).json(issue);
}
