import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Helper to parse Firestore REST response
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

    const id = doc.name?.split('/').pop();
    return { id, ...data };
};

export const getPropertyReviews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${FIRESTORE_URL}/properties/${id}/reviews?key=${API_KEY}`);

        const documents = response.data.documents || [];
        const reviews = documents.map(parseFirestoreDocument);

        res.status(200).json(reviews);
    } catch (error: any) {
        console.error("Error fetching reviews:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

export const addReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reviewData = req.body;

        // Convert JSON to Firestore Field format
        const fields: any = {};
        for (const key in reviewData) {
            const value = reviewData[key];
            if (typeof value === 'string') fields[key] = { stringValue: value };
            else if (typeof value === 'number') fields[key] = { doubleValue: value };
            else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
            else if (typeof value === 'object' && value !== null) {
                const mapFields: any = {};
                for (const subKey in value) {
                    mapFields[subKey] = { doubleValue: value[subKey] };
                }
                fields[key] = { mapValue: { fields: mapFields } };
            }
        }

        fields['createdAt'] = { timestampValue: new Date().toISOString() };

        const response = await axios.post(
            `${FIRESTORE_URL}/properties/${id}/reviews?key=${API_KEY}`,
            { fields }
        );

        const createdId = response.data.name.split('/').pop();

        res.status(201).json({ message: "Review added", id: createdId });
    } catch (error: any) {
        console.error("Error adding review:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to add review" });
    }
};
