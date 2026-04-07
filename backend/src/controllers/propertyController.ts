import { Request, Response } from 'express';
import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

const db = admin.firestore();

export const getAllProperties = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('properties').get();
        const properties = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(properties);
    } catch (error: any) {
        console.error("Error fetching properties:", error.message);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('properties').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error: any) {
        console.error("Error fetching property:", error.message);
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
