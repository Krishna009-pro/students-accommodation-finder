import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import admin from '../config/firebase';

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

/**
 * Summarizes the entire property catalog for the AI
 * Focuses on key decision metrics to stay within token limits
 */
const summarizeCatalog = (properties: any[]) => {
    return properties.map(p => ({
        id: p.id,
        title: p.title,
        price: `₹${p.price}`,
        location: p.location,
        college: p.college,
        amenities: p.amenities?.slice(0, 3).join(', '), // Just top 3 for brevity
        rating: p.rating
    }));
};

export const generatePropertyInsights = async (req: Request, res: Response) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Groq API Key is not configured in the server." });
        }

        const { property } = req.body;

        if (!property) {
            return res.status(400).json({ error: "Property data is required." });
        }

        const groq = new Groq({ apiKey: API_KEY });
        
        const prompt = `
            Analyze this student accommodation property and provide 3 key insights for a student looking to rent it.
            Focus on location convenience, amenities value, and student lifestyle suitability.
            
            Property Title: ${property.title}
            Location: ${property.location}
            Price: ${property.price}/month
            Room Type: ${property.roomType}
            Amenities: ${property.amenities.join(', ')}
            Description: ${property.description}
            Walk Time to Campus: ${property.walkTime} minutes

            Format the output as a JSON array of strings, like this:
            ["Insight 1", "Insight 2", "Insight 3"]
            Do not include any markdown formatting or explanations, just the raw JSON array.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '[]';

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
        console.error("Groq AI Error:", error);

        if (error.status === 429) {
            return res.status(429).json({
                error: "Groq rate limit exceeded. Please wait a moment before trying again."
            });
        }

        res.status(500).json({ error: "Failed to generate insights using Groq." });
    }
};

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Groq API Key is not configured in the server." });
        }

        const { messages, propertyContext } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required." });
        }

        // Fetch ALL available properties for global context
        const snapshot = await admin.firestore().collection('properties').get();
        const allProperties = snapshot.docs.map(doc => doc.data());
        const summarizedCatalog = summarizeCatalog(allProperties);

        const groq = new Groq({ apiKey: API_KEY });

        const systemMessage = {
            role: 'system',
            content: `You are the Student Haven Hub AI Assistant. 
            You help students find the perfect accommodation. 
            Be friendly, professional, and knowledgeable about student housing.

            --- KNOWLEDGE BASE (OFFICIAL CATALOG) ---
            Below is the list of all available properties in our system:
            ${JSON.stringify(summarizedCatalog)}
            
            --- CURRENT CONTEXT ---
            ${propertyContext ? `The student is currently viewing this property: ${JSON.stringify(propertyContext)}` : "The student is browsing the homepage or search results."}
            
            --- GUIDELINES ---
            1. Use the KNOWLEDGE BASE to make recommendations when students ask for "options", "alternatives", or "prices" in specific areas.
            2. If someone is looking at a property but mentions it's too expensive, suggest cheaper alternatives from the KNOWLEDGE BASE.
            3. If they ask about a college (e.g., COEP, Indira), look up the properties in the KNOWLEDGE BASE that are associated with that college.
            4. Keep your responses concise and helpful for students.`
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemMessage, ...messages],
            model: 'llama-3.3-70b-versatile',
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

        res.status(200).json({ message: aiResponse });

    } catch (error: any) {
        console.error("Groq Chat Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI." });
    }
};
