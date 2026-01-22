import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        console.error("No API KEY found");
        return;
    }

    console.log("Fetching available models for this API key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\nAvailable Models:");
            data.models.forEach((m: any) => {
                console.log(`- ${m.name}`);
                if (m.supportedGenerationMethods) {
                    console.log(`  Supported methods: ${m.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log("No 'models' property in response:", JSON.stringify(data, null, 2));
        }
    } catch (error: any) {
        console.error("Error fetching models:", error.message);
    }
}

listModels();
