import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

try {
    if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
}

export const generateCelebrationMessage = async (photoId: number): Promise<string> => {
    if (!ai) {
        return `Parabéns ao colaborador #${photoId} por fazer parte desta incrível jornada de 2 Milhões! (IA não configurada)`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, inspiring, and celebratory message (maximum 2 sentences) in Portuguese for employee #${photoId} who helped the company reach the "2 Million" milestone. The tone should be grateful, energetic, and professional.`,
            config: {
                temperature: 0.7,
            }
        });

        return response.text || "Obrigado por fazer parte da nossa história!";
    } catch (error) {
        console.error("Error generating message:", error);
        return "Obrigado por sua dedicação e por fazer parte desta conquista!";
    }
};