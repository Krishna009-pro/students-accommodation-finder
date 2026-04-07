import { Request, Response } from 'express';
import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

const db = admin.firestore();

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.uid;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const snapshot = await db.collection('users').doc(userId).collection('favorites').get();
        const favorites = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure images array exists for frontend compatibility
                images: data.images || (data.image ? [data.image] : []),
                // Fallback for fields that might be missing in old favorites
                walkTime: data.walkTime || 0,
                roomType: data.roomType || 'shared',
                isVerified: data.isVerified || false
            };
        });

        res.status(200).json(favorites);
    } catch (error: any) {
        console.error("Error fetching favorites:", error.message);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
};

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.uid;
        const { property } = req.body;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!property || !property.id) return res.status(400).json({ error: "Property data required" });

        const favoriteData = {
            ...property,
            userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(userId).collection('favorites').doc(property.id).set(favoriteData);

        res.status(200).json({ message: "Added to favorites" });
    } catch (error: any) {
        console.error("Error adding favorite:", error.message);
        res.status(500).json({ error: "Failed to add favorite" });
    }
};

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.uid;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        await db.collection('users').doc(userId).collection('favorites').doc(id).delete();

        res.status(200).json({ message: "Removed from favorites" });
    } catch (error: any) {
        console.error("Error removing favorite:", error.message);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
};
