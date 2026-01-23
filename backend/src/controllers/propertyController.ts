import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import admin from '../config/firebase';

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
        const firestoreProperties = documents.map(parseFirestoreDocument);

        // Combine Firestore properties with mock properties
        const properties = [...firestoreProperties];

        res.status(200).json(properties);
    } catch (error: any) {
        console.error("Error fetching properties:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if it's a mock property first
        // Mock properties removed after migration to Firestore

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

export const seedProperties = async (req: Request, res: Response) => {
    try {
        const PROPERTIES_TO_SEED = [
            {
                id: "mock-indira-1",
                title: "Indira Student Hostel",
                location: "Wakad, Pune",
                college: "Indira College of Engineering and Management",
                distance: "0.5 km",
                walkTime: 5,
                price: 12000,
                rating: 4.5,
                reviewCount: 24,
                images: [
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
                    "https://images.unsplash.com/photo-1522771753035-484980f8ae6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                ],
                amenities: ["WiFi", "Laundry", "Gym", "AC", "Study Room"],
                isVerified: true,
                hasMess: true,
                roomType: "shared",
                availableFrom: "Available Now",
                description: "Modern student hostel located just 5 minutes from Indira College. Features high-speed WiFi, nutritious meals, and a vibrant student community.",
                sentimentScore: 85,
                coordinates: { lat: 18.6124, lng: 73.7480 },
                aiInsights: ["Great for social students", "Walking distance to college"]
            },
            {
                id: "mock-coep-1",
                title: "Shivajinagar Student House",
                location: "Shivajinagar, Pune",
                college: "COEP",
                distance: "1.0 km",
                walkTime: 12,
                price: 9000,
                rating: 4.2,
                reviewCount: 45,
                images: [
                    "https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
                    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                ],
                amenities: ["WiFi", "Common Area", "24/7 Security", "Parking"],
                isVerified: true,
                hasMess: false,
                roomType: "shared",
                availableFrom: "Next Month",
                description: "Affordable student housing near COEP. Close to public transport and city center.",
                sentimentScore: 78,
                coordinates: { lat: 18.5300, lng: 73.8500 },
                aiInsights: ["Budget friendly", "Easy transport access"]
            },
            {
                id: "mock-iit-1",
                title: "Powai Lake View",
                location: "Powai, Mumbai",
                college: "IIT Mumbai",
                distance: "0.2 km",
                walkTime: 3,
                price: 25000,
                rating: 4.8,
                reviewCount: 60,
                images: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80",
                    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                ],
                amenities: ["WiFi", "AC", "Gym", "Pool", "Study Pod"],
                isVerified: true,
                hasMess: true,
                roomType: "single",
                availableFrom: "Available Now",
                description: "Premium student accommodation overlooking Powai Lake. Luxury amenities for a comfortable stay.",
                sentimentScore: 92,
                coordinates: { lat: 19.1230, lng: 72.9090 },
                aiInsights: ["Scenic views", "Luxury living", "Quiet for study"]
            },
            {
                id: "mock-jspm-1",
                title: "Tathawade Student Stay",
                location: "Tathawade, Pune",
                college: "JSPM",
                distance: "0.8 km",
                walkTime: 10,
                price: 8500,
                rating: 4.0,
                reviewCount: 15,
                images: [
                    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                    "https://images.unsplash.com/photo-1628153372276-888e2c079201?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                ],
                amenities: ["WiFi", "Laundry", "Common Area"],
                isVerified: false,
                hasMess: true,
                roomType: "shared",
                availableFrom: "Available Now",
                description: "Cozy and convenient stay near JSPM college. Home-cooked meals available.",
                sentimentScore: 80,
                coordinates: { lat: 18.6180, lng: 73.7430 },
                aiInsights: ["Good food", "Friendly owners"]
            }
        ];

        const db = admin.firestore();
        const batch = db.batch();

        for (const prop of PROPERTIES_TO_SEED) {
            const docRef = db.collection('properties').doc(prop.id);
            batch.set(docRef, prop);
        }

        await batch.commit();

        res.status(200).json({ message: "Properties seeded successfully", count: PROPERTIES_TO_SEED.length });

    } catch (error: any) {
        console.error("Seed Properties Error:", error);
        res.status(500).json({ error: "Failed to seed properties" });
    }
};


