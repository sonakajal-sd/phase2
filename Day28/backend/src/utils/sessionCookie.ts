import type { Response } from "express";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "../config";

export function setSessionCookie(res: Response, sessionId: string) {
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true, // JavaScript in the browser cannot read it
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // https only in production
        maxAge: SESSION_DURATION_MS,
    });
}

export function clearSessionCookie(res: Response) {
    res.clearCookie(SESSION_COOKIE_NAME);
}
