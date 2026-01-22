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

    // Ensure arrays are initialized even if missing in Firestore
    if (!data.images) data.images = [];
    if (!data.amenities) data.amenities = [];
    if (!data.aiInsights) data.aiInsights = [];

    // Ensure strings are initialized
    if (!data.roomType) data.roomType = "single";
    if (!data.title) data.title = "Untitled Property";
    if (!data.location) data.location = "Unknown Location";
    if (!data.description) data.description = "";

    // Create 'coordinates' object if missing or separate fields
    if (!data.coordinates && data.laltitude && data.longitude) {
        data.coordinates = { lat: data.latitude, lng: data.longitude };
    }
    if (!data.coordinates) {
        data.coordinates = { lat: 0, lng: 0 };
    }

    // Id is the last part of the name "projects/.../documents/properties/ID"
    const id = doc.name?.split('/').pop();
    return { id, ...data };
};

export const getAllProperties = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${FIRESTORE_URL}/properties?key=${API_KEY}`);

        // Firestore REST API returns { documents: [...] } or empty if no docs
        const documents = response.data.documents || [];
        const properties = documents.map(parseFirestoreDocument);

        res.status(200).json(properties);
    } catch (error: any) {
        console.error("Error fetching properties:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${FIRESTORE_URL}/properties/${id}?key=${API_KEY}`);
        const property = parseFirestoreDocument(response.data);

        res.status(200).json(property);
    } catch (error: any) {
        console.error("Error fetching property:", error.response?.data || error.message);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.status(500).json({ error: "Failed to fetch property" });
    }
};


