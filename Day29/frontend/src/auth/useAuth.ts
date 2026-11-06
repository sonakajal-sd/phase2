import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Use this in any component: const { user, login, logout } = useAuth();
export function useAuth() {
    const auth = useContext(AuthContext);

    if (auth === null) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return auth;
}
