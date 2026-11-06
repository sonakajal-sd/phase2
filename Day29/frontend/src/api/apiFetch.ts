// Use this for every request to a protected API.
// If the backend answers 401 (not logged in / session expired),
// we fire a "session-expired" event. AuthProvider listens for it and logs the user out.

export const SESSION_EXPIRED_EVENT = "session-expired";

// `options` is optional. Pass it for POST requests (method, headers, body).
export async function apiFetch(url: string, options?: RequestInit) {
    const response = await fetch(url, options);

    if (response.status === 401) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        throw new Error("Session expired");
    }

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();
}
