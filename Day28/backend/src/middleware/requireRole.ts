import type { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/client.js";

// Use after requireAuth. Blocks users who don't have the given role.
export function requireRole(role: Role) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: "You are not allowed to do this" });
        }
        next();
    };
}
