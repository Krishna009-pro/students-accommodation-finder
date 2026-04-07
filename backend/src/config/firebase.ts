import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
    if (!admin.apps.length) {
        let credential;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            let serviceAccount;
            try {
                // Check if it's Base64 and decode it, otherwise parse it directly
                const isBase64 = !process.env.FIREBASE_SERVICE_ACCOUNT.trim().startsWith('{');
                const jsonString = isBase64 
                    ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
                    : process.env.FIREBASE_SERVICE_ACCOUNT;
                
                serviceAccount = JSON.parse(jsonString);
                credential = admin.credential.cert(serviceAccount);
                console.log('Firebase Admin Initialized from Environment Variable (Base64 or JSON)');
            } catch (err: any) {
                console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err.message);
                throw err;
            }
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
