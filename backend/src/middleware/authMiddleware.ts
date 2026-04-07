import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

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

        // Verify token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };

        next();
    } catch (error: any) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
