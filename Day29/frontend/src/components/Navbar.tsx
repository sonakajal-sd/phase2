import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    if (!user) {
        return (
            <nav className="navbar">
                <Link to="/login">Login</Link>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/issues">Issues</Link>

            {/* Role-aware link: only admins see it */}
            {user.role === "admin" && <Link to="/admin">Admin</Link>}

            <span className="navbar-user">
                {user.name} ({user.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}
