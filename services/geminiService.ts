
import { GoogleGenAI } from "@google/genai";

// Always initialize with the direct environment variable for the API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInsuranceAssistance = async (prompt: string, history: {role: 'user' | 'model', text: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: "You are an expert insurance assistant. Help the user with their policy questions, claim procedures, and general insurance terms. Be professional, concise, and helpful." }] },
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    // Access the text property directly as per the latest SDK guidelines
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having trouble connecting to my knowledge base. Please try again in a moment.";
  }
};
