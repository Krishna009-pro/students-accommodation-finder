import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

export const generatePropertyInsights = async (req: Request, res: Response) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Gemini API Key is not configured in the server." });
        }

        const { property } = req.body;

        if (!property) {
            return res.status(400).json({ error: "Property data is required." });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Analyze this student accommodation property and provide 3 key insights for a student looking to rent it.
            Focus on location convenience, amenities value, and student lifestyle suitability.
            
            Property Title: ${property.title}
            Location: ${property.location}
            Price: $${property.price}/month
            Room Type: ${property.roomType}
            Amenities: ${property.amenities.join(', ')}
            Description: ${property.description}
            Walk Time to Campus: ${property.walkTime} minutes

            Format the output as a JSON array of strings, like this:
            ["Insight 1", "Insight 2", "Insight 3"]
            Do not include any markdown formatting or explanations, just the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanupJson = (text: string) => {
            const match = text.match(/\[.*\]/s);
            return match ? match[0] : '[]';
        };

        const insights = JSON.parse(cleanupJson(responseText));

        // Save to Firestore
        if (property.id) {
            await admin.firestore().collection('properties').doc(property.id).update({
                aiInsights: insights
            });
        }

        res.status(200).json({ insights });

    } catch (error: any) {
        console.error("Gemini AI Error:", error);

        // Handle rate limiting specifically
        if (error.status === 429) {
            return res.status(429).json({
                error: "Too many requests. Please wait a moment before trying again.",
                retryDelay: error.errorDetails?.[2]?.retryDelay // forward retry delay if available
            });
        }

        res.status(500).json({ error: "Failed to generate insights." });
    }
};
