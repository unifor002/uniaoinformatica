
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export interface GeminiResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const getGeminiAssistantResponse = async (userMessage: string): Promise<GeminiResponse> => {
  if (!API_KEY) return { text: "Serviço de IA indisponível no momento." };

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Você é o Assistente Virtual da União Infor, uma empresa de TI e assistência técnica em Goiânia com 20 anos de tradição no mesmo endereço (R. 68, 522 - St. Central). 
        Seja profissional, prestativo e fale português do Brasil. 
        Use a ferramenta de busca para encontrar informações atualizadas sobre a empresa, avaliações de clientes no Google Meu Negócio e status de funcionamento.
        Sempre convide o cliente a visitar a loja física em caso de problemas complexos.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Desculpe, não consegui processar sua solicitação.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Fonte",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#");

    return { text, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Ocorreu um erro ao falar com meu cérebro digital. Tente novamente mais tarde." };
  }
};

export interface GoogleReview {
  name: string;
  date: string;
  text: string;
  stars: number;
  avatar: string;
}

export const fetchRealReviews = async (placeName: string, location: string, targetMapsUrl?: string): Promise<{ reviews: GoogleReview[], sourceUrl?: string }> => {
  if (!API_KEY) return { reviews: [] };
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const prompt = targetMapsUrl 
      ? `Encontre as avaliações mais recentes e relevantes do Google para a empresa no link "${targetMapsUrl}". 
      Retorne as informações no formato JSON: uma lista de objetos com 'name', 'date', 'text', 'stars' (número de 1 a 5) e 'avatar' (URL de imagem ou placeholder).
      Tente encontrar pelo menos 4 avaliações reais.`
      : `Encontre as avaliações mais recentes e relevantes do Google para a empresa "${placeName}" em "${location}". 
      Retorne as informações no formato JSON: uma lista de objetos com 'name', 'date', 'text', 'stars' (número de 1 a 5) e 'avatar' (URL de imagem ou placeholder).
      Tente encontrar pelo menos 4 avaliações reais.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
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
    const mapsUrl = chunks?.find((chunk: any) => chunk.maps?.uri)?.maps?.uri;

    return { reviews, sourceUrl: mapsUrl };
  } catch (error) {
    console.error("Erro ao buscar reviews reais:", error);
    return { reviews: [] };
  }
};
