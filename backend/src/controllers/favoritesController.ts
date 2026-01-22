import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Helper to parse Firestore REST response (Reused)
const parseFirestoreDocument = (doc: any) => {
    if (!doc) return null;
    const fields = doc.fields;
    const data: any = {};

    // Recursive helper for parsing fields
    const parseValue = (value: any): any => {
        const fieldType = Object.keys(value)[0];
        const fieldValue = value[fieldType];

        if (fieldType === 'integerValue') return parseInt(fieldValue);
        if (fieldType === 'doubleValue') return parseFloat(fieldValue);
        if (fieldType === 'booleanValue') return fieldValue;
        if (fieldType === 'stringValue') return fieldValue;
        if (fieldType === 'timestampValue') return fieldValue;
        if (fieldType === 'nullValue') return null;

        if (fieldType === 'arrayValue') {
            return fieldValue.values?.map((v: any) => parseValue(v)) || [];
        }

        if (fieldType === 'mapValue') {
            const mapData: any = {};
            const mapFields = fieldValue.fields || {};
            for (const key in mapFields) {
                mapData[key] = parseValue(mapFields[key]);
            }
            return mapData;
        }

        if (fieldType === 'geoPointValue') {
            return { lat: fieldValue.latitude, lng: fieldValue.longitude };
        }

        return fieldValue;
    };

    for (const key in fields) {
        data[key] = parseValue(fields[key]);
    }

    // Ensure arrays are initialized
    if (!data.images) data.images = [];
    if (!data.amenities) data.amenities = [];
    if (!data.aiInsights) data.aiInsights = [];

    // Ensure strings are initialized
    if (!data.roomType) data.roomType = "single";
    if (!data.title) data.title = "Untitled Property";
    if (!data.location) data.location = "Unknown Location";

    // Id is the last part of the name "projects/.../documents/properties/ID"
    const id = doc.name?.split('/').pop();
    return { id, ...data };
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        // Fetch user's favorites collection
        const response = await axios.get(`${FIRESTORE_URL}/users/${userId}/favorites?key=${API_KEY}`);

        const documents = response.data.documents || [];
        const favorites = documents.map(parseFirestoreDocument);

        res.status(200).json(favorites);
    } catch (error: any) {
        // If collection doesn't exist yet, return empty array
        if (error.response?.status === 404) {
            return res.status(200).json([]);
        }
        console.error("Error fetching favorites:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
};

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { property } = req.body; // Expecting complete property object to store

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!property || !property.id) return res.status(400).json({ error: "Property data required" });

        // Convert property object to Firestore fields manually or simplify storage
        // Storing simplified version of property or full object? 
        // Let's store a simplified version + ID to display in list without re-fetching

        const fields: any = {
            propertyId: { stringValue: property.id },
            title: { stringValue: property.title },
            location: { stringValue: property.location },
            price: { doubleValue: property.price },
            rating: { doubleValue: property.rating },
            createdAt: { timestampValue: new Date().toISOString() }
        };

        if (property.images && property.images.length > 0) {
            fields.image = { stringValue: property.images[0] };
        }

        // Use property ID as document ID for easier "isFavorite" check and deletion
        await axios.patch(
            `${FIRESTORE_URL}/users/${userId}/favorites/${property.id}?key=${API_KEY}`,
            { fields }
        );

        res.status(200).json({ message: "Added to favorites" });
    } catch (error: any) {
        console.error("Error adding favorite:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to add favorite" });
    }
};

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { id } = req.params; // Property ID

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        await axios.delete(`${FIRESTORE_URL}/users/${userId}/favorites/${id}?key=${API_KEY}`);

        res.status(200).json({ message: "Removed from favorites" });
    } catch (error: any) {
        console.error("Error removing favorite:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
};
