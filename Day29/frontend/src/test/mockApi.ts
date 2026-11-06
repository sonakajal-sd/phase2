import { vi } from "vitest";
import type { Issue } from "../types/issue";
import type { User } from "../types/user";

// ---------- Fake data used by the tests ----------

export const normalUser: User = { id: 1, name: "Normal User", email: "user@example.com", role: "user" };
export const adminUser: User = { id: 2, name: "Admin", email: "admin@example.com", role: "admin" };

export const sampleIssues: Issue[] = [
    { id: 1, title: "Login button is too small", status: "open", authorId: 1, createdAt: "2026-11-01" },
    { id: 2, title: "Add dark mode", status: "in_progress", authorId: 1, createdAt: "2026-11-01" },
    { id: 3, title: "Fix typo on dashboard", status: "closed", authorId: 1, createdAt: "2026-11-01" },
];

// ---------- Fake backend ----------

type FakeResponse = {
    status?: number; // defaults to 200
    body?: unknown; // sent back as JSON
};

// Keys look like "GET /api/issues" or "POST /api/auth/login".
type Routes = Record<string, FakeResponse>;

// Replaces the browser's fetch with a fake one.
// The network is the "boundary" of our app: we fake only that part,
// so every component, hook and context still runs for real.
//
// Example:
//   mockApi({
//       "GET /api/auth/me": { body: normalUser },
//       "GET /api/issues": { status: 500 },
//   });
export function mockApi(routes: Routes) {
    const fetchMock = vi.fn(async (url: string, options?: RequestInit) => {
        const method = options?.method ?? "GET";
        const route = routes[`${method} ${url}`];

        // Any request we did not set up behaves like a missing page.
        if (!route) {
            return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
        }

        const status = route.status ?? 200;
        const body = route.body === undefined ? null : JSON.stringify(route.body);
        return new Response(body, { status });
    });

    vi.stubGlobal("fetch", fetchMock);
    return fetchMock; // so a test can check what was sent
}

// Shortcut: "this user is already logged in" (session restore succeeds).
export function loggedInAs(user: User) {
    return { "GET /api/auth/me": { body: user } };
}

// Shortcut: "nobody is logged in".
export const loggedOut = { "GET /api/auth/me": { status: 401 } };
