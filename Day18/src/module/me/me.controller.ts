import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import prisma from "../../db/prisma.js";

export async function getUser(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unathorized" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "internal server error" });
  }
}
