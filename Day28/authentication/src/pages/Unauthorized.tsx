import { Link } from "react-router";

export default function Unauthorized() {
    return (
        <div className="card">
            <h1>Access denied</h1>
            <p>You don't have permission to view this page.</p>
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    );
}
