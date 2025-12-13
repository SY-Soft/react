import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        if (token) {
            setUser(JSON.parse(localStorage.getItem("user")));
            setRole(localStorage.getItem("role"));
        }
    }, [token]);

    function login(data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        setToken(data.token);
        setUser(data.user);
        setRole(data.user.role);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        setToken(null);
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
