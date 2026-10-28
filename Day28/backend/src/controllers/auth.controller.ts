import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { SESSION_COOKIE_NAME } from "../config";
import { createSession, deleteSession } from "../services/session.service";
import { checkPassword } from "../utils/password";
import { toPublicUser } from "../utils/publicUser";
import { clearSessionCookie, setSessionCookie } from "../utils/sessionCookie";

// POST /api/auth/login
export async function login(req: Request, res: Response) {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Same message for both cases, so attackers can't tell which emails exist.
    if (!user || !(await checkPassword(password, user.passwordHash))) {
        return res.status(401).json({ message: "Wrong email or password" });
    }

    const session = await createSession(user.id);
    setSessionCookie(res, session.id);

    res.json(toPublicUser(user));
}

// GET /api/auth/me  (runs after requireAuth)
export function me(req: Request, res: Response) {
    res.json(req.user);
}

// POST /api/auth/logout
export async function logout(req: Request, res: Response) {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (sessionId) {
        await deleteSession(sessionId);
    }

    clearSessionCookie(res);
    res.status(204).end();
}
