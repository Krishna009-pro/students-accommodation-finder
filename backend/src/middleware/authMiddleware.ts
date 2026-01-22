import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
            };
        }
    }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify token using Firebase Auth REST API (getAccountInfo)
        // This checks if the token is valid and returns user info
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
            {
                idToken: idToken
            }
        );

        const users = response.data.users;
        if (!users || users.length === 0) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const user = users[0];
        req.user = {
            uid: user.localId,
            email: user.email
        };

        next();
    } catch (error: any) {
        console.error("Auth Middleware Error:", error.response?.data || error.message);
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
