
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export interface ImageAnalysis {
  theme: 'light' | 'dark';
  content: string;
  contentPosition: 'top' | 'center' | 'bottom';
}

/**
 * Analyzes image to determine theme and generates content based on context.
 */
export const analyzeImage = async (base64Image: string, context: string = "", filename: string = ""): Promise<ImageAnalysis> => {
  try {
    const prompt = `
      You are a LinkedIn content expert. Analyze this image and the provided context to generate slide content.

      Context Article: "${context}"
      Image Filename: "${filename}"

      Tasks:
      1. Analyze the brightness/color. If the image is dark and needs white text, set theme to "dark". If light and needs black text, set theme to "light".
      2. Write a short, punchy, engaging text overlay (max 20 words) for this slide. It should connect the image visual to the topic of the Context Article.
      3. Analyze the image composition to find the best place for the text overlay (where there is empty space or less detail). Choose "top", "center", or "bottom".

      Return ONLY a JSON object in this format:
      {
        "theme": "light" | "dark",
        "content": "your generated text here",
        "contentPosition": "top" | "center" | "bottom"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
    
    let text = "";
    if (typeof response.text === 'function') {
        text = response.text();
    } else if (typeof response.text === 'string') {
        text = response.text;
    } else if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            text = candidate.content.parts[0].text || "";
        }
    }

    // Clean up markdown code blocks if present (Gemini sometimes adds them even with JSON mode)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
        const json = JSON.parse(text);
        // Normalize theme just in case
        let theme: 'light' | 'dark' = 'dark';
        if (json.theme && (json.theme.toLowerCase() === 'light' || json.theme.toLowerCase().includes('black'))) {
            theme = 'light';
        }
        
        let contentPosition: 'top' | 'center' | 'bottom' = 'top';
        if (json.contentPosition && ['top', 'center', 'bottom'].includes(json.contentPosition.toLowerCase())) {
            contentPosition = json.contentPosition.toLowerCase() as 'top' | 'center' | 'bottom';
        }

        return {
            theme,
            content: json.content || "",
            contentPosition
        };
    } catch (parseError) {
        console.warn("Failed to parse JSON from Gemini, falling back to text analysis", text);
        const isLight = text.toLowerCase().includes('light') || text.toLowerCase().includes('black text');
        return { theme: isLight ? 'light' : 'dark', content: "", contentPosition: 'top' };
    }

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return { theme: 'dark', content: '', contentPosition: 'top' };
  }
};
