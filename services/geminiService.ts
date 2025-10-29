
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpapers = async (prompt: string, aspectRatio: AspectRatio): Promise<string[]> => {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }
  
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Phone wallpaper, ${prompt}. cinematic, high detail, 8k`,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    } else {
      throw new Error("No images were generated. The prompt may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating images:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during image generation.";
    throw new Error(errorMessage);
  }
};
