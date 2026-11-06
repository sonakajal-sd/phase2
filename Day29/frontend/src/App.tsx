import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";

export default function App() {
    return (
        <>
            <Navbar />

            <main>
                <Routes>
                    {/* Public pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Any logged-in user */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/issues" element={<Issues />} />
                    </Route>

                    {/* Admins only */}
                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </>
    );
}
