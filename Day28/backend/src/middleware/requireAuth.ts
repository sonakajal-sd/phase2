import type { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE_NAME } from "../config";
import { findValidSession } from "../services/session.service";
import { toPublicUser } from "../utils/publicUser";
import { clearSessionCookie } from "../utils/sessionCookie";

// Only lets the request continue if the user is logged in.
// This is the real protection. Hiding links in React is not enough.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const session = await findValidSession(sessionId);

    if (!session) {
        clearSessionCookie(res);
        return res.status(401).json({ message: "Session expired" });
    }

    req.user = toPublicUser(session.user);
    next();
}
