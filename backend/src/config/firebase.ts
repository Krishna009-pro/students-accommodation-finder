import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
    if (!admin.apps.length) {
        let credential;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Initialize using the JSON string from environment variable
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(serviceAccount);
            console.log('Firebase Admin Initialized from Environment Variable');
        } else {
            // Fallback to application default (local file or Google Cloud environment)
            credential = admin.credential.applicationDefault();
            console.log('Firebase Admin Initialized from Application Default');
        }

        admin.initializeApp({
            credential,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    }
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

export const auth = admin.apps.length ? admin.auth() : null;
export default admin;
