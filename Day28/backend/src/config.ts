// All settings live here so they are easy to find and change.

export const PORT = 3000;

export const SESSION_COOKIE_NAME = "sessionId";

// How long a login lasts. Make this small (e.g. 1 minute) to test expired sessions.
export const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour
