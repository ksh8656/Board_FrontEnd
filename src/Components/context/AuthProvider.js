import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("bbs_access_token");
        const email = localStorage.getItem("user_email");
        const rank = localStorage.getItem("user_rank");
        return token && email ? { token, email, rank } : null;
    });

    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;




