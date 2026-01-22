import { Request, Response } from 'express';
import { auth } from '../config/firebase';
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

        res.status(200).json({
            message: "Login successful",
            user: {
                uid: localId,
                email: email
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

        // Use Firebase Auth REST API for registration (signUp)
        // This avoids needing the Admin SDK Service Account Key during development
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { localId, email: resEmail, idToken, refreshToken, expiresIn } = response.data;

        // Ideally, we would update the profile (displayName) here.
        // The signUp endpoint doesn't support setting displayName directly in one go usually,
        // so we make a second call to 'update' profile info.
        try {
            await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
                {
                    idToken: idToken,
                    displayName: name,
                    returnSecureToken: false
                }
            );
        } catch (profileError) {
            console.warn("Failed to update profile name:", profileError);
        }

        res.status(201).json({
            message: "User registered successfully",
            user: {
                uid: localId,
                email: resEmail,
                displayName: name
            },
            tokens: {
                idToken,
                refreshToken,
                expiresIn
            }
        });

    } catch (error: any) {
        console.error("Registration Error:", error.response?.data?.error || error.message);
        const errorCode = error.response?.data?.error?.message || "Registration failed";
        res.status(500).json({ error: errorCode });
    }
};
