import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
        console.log('Firebase Admin Initialized');
    }
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

export const auth = admin.apps.length ? admin.auth() : null;
export default admin;
