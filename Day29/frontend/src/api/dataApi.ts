import type { User } from "../types/user";
import { apiFetch } from "./apiFetch";

// Page data is fetched by the page that needs it.
// It is NOT stored in the auth context.

export function getDashboard(): Promise<{ message: string }> {
    return apiFetch("/api/dashboard");
}

export function getAllUsers(): Promise<User[]> {
    return apiFetch("/api/admin/users");
}
