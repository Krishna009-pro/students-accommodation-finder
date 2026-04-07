import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

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
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                const user: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                
                setCurrentUser(user);
                setToken(idToken);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", idToken);
            } else {
                setCurrentUser(null);
                setToken(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (user: User, authToken: string) => {
        setCurrentUser(user);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", authToken);
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setCurrentUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Sign-Out Error:", error);
            throw error;
        }
    };

    const value = {
        currentUser,
        loading,
        login,
        signInWithGoogle,
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
