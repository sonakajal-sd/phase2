import { useEffect, useState } from "react";
import { getDashboard } from "../api/dataApi";
import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
    const { user } = useAuth();
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        getDashboard()
            .then((data) => setMessage(data.message))
            .catch(() => setMessage("Could not load dashboard."));
    }, []);

    return (
        <div className="card">
            <h1>Dashboard</h1>
            <p>Logged in as {user?.email}</p>
            <p>{message}</p>
        </div>
    );
}
