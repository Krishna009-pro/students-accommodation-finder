import React, { createContext, useContext, useEffect, useState } from "react";

// Define a simplified User type matching our backend response
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL?: string | null;
}

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (user: User, token: string) => void;
    signOut: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                setCurrentUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (user: User, authToken: string) => {
        setCurrentUser(user);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", authToken);
    };

    const signOut = () => {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const value = {
        currentUser,
        loading,
        login,
        signOut,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

