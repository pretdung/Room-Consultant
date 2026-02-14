
import { GoogleGenAI, Type } from "@google/genai";
import { RoomConfig } from "../types";

export const generateAIInteriorSuggestion = async (): Promise<Partial<RoomConfig>> => {
  // Fix: Strictly use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Suggest a cohesive and modern interior design color scheme for a room. Provide hex codes for North, South, East, West walls, floor, and ceiling. Make it feel balanced and professionally designed (e.g., accent walls, complementary colors).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wall_north: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
            wall_south: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
            wall_east: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
            wall_west: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
            floor: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
            ceiling: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING },
                roughness: { type: Type.NUMBER },
                metalness: { type: Type.NUMBER },
              },
              required: ["color", "roughness", "metalness"]
            },
          },
          required: ["wall_north", "wall_south", "wall_east", "wall_west", "floor", "ceiling"],
        },
      },
    });

    // Fix: Access .text property directly and trim before parsing JSON
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    return result as Partial<RoomConfig>;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
};
