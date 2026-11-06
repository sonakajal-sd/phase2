import type { User } from "../types/user";

// "/api" is forwarded to the backend by Vite (see vite.config.ts).
// The session lives in an httpOnly cookie, so the browser sends it for us.

export async function loginRequest(email: string, password: string): Promise<User> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Wrong email or password");
    }

    return response.json();
}

// Asks the backend "who is logged in?". Returns null if nobody is.
export async function getCurrentUser(): Promise<User | null> {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
        return null;
    }

    return response.json();
}

export async function logoutRequest(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
}
