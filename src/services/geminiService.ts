
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface GoogleReview {
  name: string;
  date: string;
  text: string;
  stars: number;
  avatar: string;
}

export const fetchRealReviews = async (placeName: string, location: string): Promise<{ reviews: GoogleReview[], sourceUrl?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Encontre as avaliações mais recentes e relevantes do Google para a empresa "${placeName}" em "${location}". 
      Retorne as informações no formato JSON: uma lista de objetos com 'name', 'date', 'text', 'stars' (número de 1 a 5) e 'avatar' (URL de imagem ou placeholder).
      Tente encontrar pelo menos 4 avaliações reais.`,
      config: {
        tools: [{ googleMaps: {} }],
        // Note: responseMimeType: "application/json" is NOT allowed with googleMaps tool
      },
    });

    const text = response.text || "";
    
    // Extract JSON from the markdown response
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    let reviews: GoogleReview[] = [];
    
    if (jsonMatch) {
      try {
        reviews = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Erro ao parsear JSON de reviews:", e);
      }
    }

    // Extract Maps URL from grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const mapsUrl = chunks?.find(chunk => chunk.maps?.uri)?.maps?.uri;

    return { reviews, sourceUrl: mapsUrl };
  } catch (error) {
    console.error("Erro ao buscar reviews reais:", error);
    return { reviews: [] };
  }
};
