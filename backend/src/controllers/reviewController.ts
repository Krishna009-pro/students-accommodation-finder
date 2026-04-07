import { Request, Response } from 'express';
import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

const db = admin.firestore();

export const getPropertyReviews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection('properties').doc(id).collection('reviews').get();
        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(reviews);
    } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

export const addReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reviewData = req.body;

        const docRef = await db.collection('properties').doc(id).collection('reviews').add({
            ...reviewData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: "Review added", id: docRef.id });
    } catch (error: any) {
        console.error("Error adding review:", error.message);
        res.status(500).json({ error: "Failed to add review" });
    }
};
