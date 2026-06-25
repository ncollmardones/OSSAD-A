
import { GoogleGenAI } from "@google/genai";
import { ZonalResult } from "../types";

/**
 * Interpret results using Gemini AI.
 * Always initialize GoogleGenAI with { apiKey: process.env.API_KEY }.
 */
export const interpretResults = async (result: ZonalResult): Promise<string> => {
  try {
    // Correct usage of API key from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Actúa como experto en salares.
      Analiza la estadística zonal del índice ${result.indexUsed} en ${result.salarName}.
      Zonas y valores (mediana):
      ${result.stats.map(s => `- ${s.className}: ${s.median.toFixed(3)} (${s.areaHa} ha)`).join('\n')}
      
      Resume qué significa esto para la salud hídrica en 100 palabras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the text property directly on the response
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Análisis de IA no disponible (revisa tu API Key).";
  }
};

