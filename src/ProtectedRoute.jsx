import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const { token, role: userRole } = useContext(AuthContext);

    if (!token) return <Navigate to="/login" />;
    if (role && role !== userRole) return <Navigate to="/" />;

    return children;
}
