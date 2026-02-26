import { GoogleGenAI, Type } from "@google/genai";
import { Distributor } from '../types';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. Gemini API will fail.");
}

const getAi = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const geocodeAddress = async (distributor: Omit<Distributor, 'id' | 'latitude' | 'longitude'>): Promise<Coordinates> => {
  const ai = getAi();
  // Incluimos país explícito para mejorar la precisión de Gemini
  const fullAddress = `${distributor.address}, ${distributor.city}, ${distributor.department}, Colombia`;
  const prompt = `Proporciona SOLO las coordenadas geográficas (latitud y longitud) exactas para esta dirección en Colombia: "${fullAddress}". \n\nIMPORTANTE: Si no encuentras la dirección exacta, devuelve un aproximado de la ciudad (${distributor.city}, ${distributor.department}). Tu respuesta debe ser EXCLUSIVAMENTE un JSON válido (sin código markdown ni texto adicional) con las claves "latitude" y "longitude" numéricas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Usamos 2.5 flash que es más estable
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            latitude: {
              type: Type.NUMBER,
              description: 'Latitud de la dirección (float).'
            },
            longitude: {
              type: Type.NUMBER,
              description: 'Longitud de la dirección (float).'
            }
          },
          required: ['latitude', 'longitude']
        }
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return parsed;
        }
      } catch (parseError) {
        console.error('Error parseando JSON de Gemini:', response.text);
      }
    }

    throw new Error('Respuesta inválida recibida de la API.');

  } catch (error) {
    console.error('Error geocodificando con Gemini:', error);
    throw new Error('No se pudo determinar las coordenadas usando Inteligencia Artificial. Contacta soporte si el problema persiste.');
  }
};
