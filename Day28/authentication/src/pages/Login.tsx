import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Message sent by AuthProvider when a session expires
    const message: string | undefined = location.state?.message;

    // Already logged in? No need to see the login page.
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch {
            setError("Login failed. Check your email and password.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h1>Login</h1>

            {message && <p className="info">{message}</p>}

            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && <p className="error" role="alert">{error}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
