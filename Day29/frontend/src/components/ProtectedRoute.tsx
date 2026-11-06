import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/useAuth";
import type { Role } from "../types/user";

type Props = {
    role?: Role; // leave empty = any logged-in user is allowed
};

// Note: this only improves the user experience.
// The backend still checks every request (requireAuth / requireRole).
export default function ProtectedRoute({ role }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Checking your session...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
