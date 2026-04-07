import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

async function testGroq() {
    if (!API_KEY) {
        console.error("No GROQ_API_KEY found");
        return;
    }

    console.log("Testing Groq API connectivity...");
    const groq = new Groq({ apiKey: API_KEY });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say 'Hello from Groq!'" }],
            model: "llama-3.3-70b-versatile",
        });

        console.log("\nResponse from Groq:");
        console.log(chatCompletion.choices[0]?.message?.content);
    } catch (error: any) {
        console.error("Error connecting to Groq:", error.message);
        if (error.status === 401) {
            console.error("Invalid API key.");
        }
    }
}

testGroq();
