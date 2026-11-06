import { createContext } from "react";
import type { User } from "../types/user";

// Only auth things go in here. Nothing else.
export type AuthContextValue = {
    user: User | null;   // null = not logged in
    loading: boolean;    // true while we check for an existing session
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
