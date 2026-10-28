import type { Request, Response } from "express";

// GET /api/dashboard
export function getDashboard(req: Request, res: Response) {
    res.json({
        message: `Welcome back, ${req.user?.name}! This data came from a protected API.`,
    });
}
