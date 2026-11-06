import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { toPublicUser } from "../utils/publicUser";

// GET /api/admin/users
export async function listUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    res.json(users.map(toPublicUser));
}
