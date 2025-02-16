import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/auth/validate", {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch (error) {
                console.error("Sesión no válida:", error.response?.data?.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};