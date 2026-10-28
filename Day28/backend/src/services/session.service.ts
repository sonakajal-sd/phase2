import { randomBytes } from "node:crypto";
import prisma from "../lib/prisma";
import { SESSION_DURATION_MS } from "../config";

// Create a new session row and return it.
export function createSession(userId: number) {
    return prisma.session.create({
        data: {
            id: randomBytes(32).toString("hex"), // long random id, impossible to guess
            userId,
            expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
        },
    });
}

// Find a session and its user. Returns null if missing or expired.
export async function findValidSession(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    });

    if (!session) {
        return null;
    }

    if (session.expiresAt < new Date()) {
        await deleteSession(sessionId);
        return null;
    }

    return session;
}

export async function deleteSession(sessionId: string) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
}
