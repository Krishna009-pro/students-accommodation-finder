import { Request, Response } from 'express';
import admin from '../config/firebase';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Use Firebase Auth REST API for signing in with email/password
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { idToken, refreshToken, localId, expiresIn } = response.data;

        // Fetch additional user info if needed
        const userRecord = await admin.auth().getUser(localId);

        res.status(200).json({
            message: "Login successful",
            user: {
                uid: localId,
                email: email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL
            },
            tokens: {
                idToken,
                refreshToken,
                expiresIn
            }
        });

    } catch (error: any) {
        console.error("Login Error:", error.response?.data?.error || error.message);
        const errorCode = error.response?.data?.error?.message || "Login failed";
        res.status(401).json({ error: errorCode });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, password, and name are required" });
        }

        // Create user using Admin SDK
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // After creation, we still need to sign them in to get tokens for the frontend
        // We use the REST API for this
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { idToken, refreshToken, expiresIn } = response.data;

        res.status(201).json({
            message: "User registered successfully",
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName
            },
            tokens: {
                idToken,
                refreshToken,
                expiresIn
            }
        });

    } catch (error: any) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ error: error.message || "Registration failed" });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: "ID Token is required" });
        }

        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Get or create user record to ensure consistency
        let userRecord;
        try {
            userRecord = await admin.auth().getUser(uid);
        } catch (error) {
            // User doesn't exist in Auth (shouldn't happen with Google Sign-In)
            // But we could create them if needed.
            throw error;
        }

        res.status(200).json({
            message: "Google login verified",
            user: {
                uid,
                email,
                displayName: name || userRecord.displayName,
                photoURL: picture || userRecord.photoURL
            }
        });
    } catch (error: any) {
        console.error("Google Login Error:", error.message);
        res.status(401).json({ error: "Invalid token" });
    }
};
