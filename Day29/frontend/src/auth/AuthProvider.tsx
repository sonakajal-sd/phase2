import { startTransition, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { SESSION_EXPIRED_EVENT } from "../api/apiFetch";
import { getCurrentUser, loginRequest, logoutRequest } from "../api/authApi";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Restore session: on page load, ask the backend who is logged in.
    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    // 2. Expired session: any protected API call that gets 401 sends us to login.
    useEffect(() => {
        function handleSessionExpired() {
            navigate("/login", { state: { message: "Your session expired. Please log in again." } });

            // The router changes the URL inside a "transition" (a low-priority update).
            // We clear the user in a transition too, so both changes happen together.
            // Otherwise ProtectedRoute sees "no user" first and redirects to /login
            // on its own, and the message above is lost. (Our test caught this bug!)
            startTransition(() => setUser(null));
        }

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    }, [navigate]);

    async function login(email: string, password: string) {
        const loggedInUser = await loginRequest(email, password);
        setUser(loggedInUser);
    }

    async function logout() {
        await logoutRequest();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
