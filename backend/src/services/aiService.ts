import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
});

export const improveSchedule = async (schedule: any) => {
  const prompt = `
  Improve this study schedule to be more efficient:
  ${JSON.stringify(schedule)}
  
  Consider:
  - Avoid overload
  - Balance difficulty
  - Maintain consistency
  
  Return the improved schedule in a clear, readable format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
};

export const chatWithAI = async (message: string, context?: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        { role: "user", parts: [{ text: `System Context: You are a helpful study assistant. Help the user plan their studies better. Context: ${JSON.stringify(context)}\n\nUser Message: ${message}` }] }
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Error in Gemini chat:", error);
    throw error;
  }
};
