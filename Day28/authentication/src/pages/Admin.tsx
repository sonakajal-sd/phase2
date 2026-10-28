import { useEffect, useState } from "react";
import { getAllUsers } from "../api/dataApi";
import type { User } from "../types/user";

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(() => setError("Could not load users."));
    }, []);

    return (
        <div className="card">
            <h1>Admin</h1>
            <p>Only admins can see this page. The backend checks the role too.</p>

            {error && <p className="error">{error}</p>}

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} – {user.email} ({user.role})
                    </li>
                ))}
            </ul>
        </div>
    );
}
