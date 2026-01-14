
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { LinkedInDraft, SearchResultItem } from "../types";

// As per rules: Always create a new instance right before making an API call 
// to ensure it uses the most up-to-date API key from the user selection dialog.
const getAi = () => {
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please enter your Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const setGeminiApiKey = (key: string) => {
  localStorage.setItem('gemini_api_key', key);
};

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';

/**
 * Extracts and cleans JSON from a string, handling markdown wrappers.
 */
const parseGeminiJson = (text: string) => {
  try {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const cleanedText = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("JSON parse failed for:", text);
    throw new Error("The AI model returned an unexpected format. This usually happens if the content was filtered or the topic is too complex.");
  }
};

export const generateLinkedInDraft = async (
  topic: string, 
  pointTexts: string[],
  tone: string
): Promise<LinkedInDraft> => {
  const pointsFormatted = pointTexts.map((p, i) => `Point ${i + 1}: ${p}`).join('\n');
  
  const prompt = `You are a world-class LinkedIn ghostwriter and content designer for a brand called 'SeparateOut'. 
  Research and synthesize a high-authority, viral-ready carousel post about: ${topic}.
  
  Core Insights to weave together into one cohesive story:
  ${pointsFormatted}
  
  Tone: ${tone}

  Instructions:
  1. Use 'googleSearch' to find current data, trends, and authoritative references.
  2. Write a single, long-form cohesive narrative (< 600 words) with a killer hook, high-value synthesis of the insights, and a conversation-starting CTA.
  3. Generate exactly ${pointTexts.length} punchy visual titles and detailed prompts for image generation.
  4. Each image prompt MUST include an instruction to have the slide title text clearly and beautifully rendered on the image (e.g., "with the text '[TITLE]' written in modern, bold white typography in the center"). 
  5. The visuals should feel premium, minimalist, and "SeparateOut" style (modern professional).
  
  IMPORTANT: Response must be JSON only.
  Schema:
  {
    "fullPost": "Complete narrative post text",
    "points": [
      { "title": "Short punchy title", "suggestedPrompt": "Cinematic 1:1 image prompt with title text integration" }
    ]
  }`;

  const ai = getAi();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // Enable maximum thinking budget for deep reasoning
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullPost: { type: Type.STRING },
          points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                suggestedPrompt: { type: Type.STRING }
              },
              required: ["title", "suggestedPrompt"]
            }
          }
        },
        required: ["fullPost", "points"]
      }
    },
  });

  const data = parseGeminiJson(response.text || "{}");
  const grounding = response.candidates?.[0]?.groundingMetadata;
  const searchResults: SearchResultItem[] = [];

  if (grounding?.groundingChunks) {
    grounding.groundingChunks.forEach(chunk => {
      if (chunk.web?.uri && chunk.web?.title) {
        searchResults.push({ title: chunk.web.title, url: chunk.web.uri });
      }
    });
  }

  return {
    fullPost: data.fullPost || "",
    points: (data.points || []).map((p: any, i: number) => ({
      id: `p-${i}`,
      content: pointTexts[i] || "",
      title: p.title || `Insight ${i + 1}`,
      suggestedPrompt: p.suggestedPrompt || `Professional visual for ${topic}`
    })),
    searchResults,
    searchEntryPointHtml: grounding?.searchEntryPoint?.renderedContent
  };
};

export const generatePointImage = async (prompt: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: `${prompt}. Style: Professional high-end LinkedIn carousel slide, cinematic lighting, corporate-tech aesthetic, clean composition, 1:1 aspect ratio, centered legible text.` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
    }
  });

  // Find the image part iterating through all parts as per rules.
  const part = response.candidates?.[0]?.content?.parts?.find(p => !!p.inlineData);
  if (part?.inlineData?.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("No image data returned. The prompt might have triggered a safety filter.");
};

export const editPointImage = async (base64Image: string, editInstruction: string): Promise<string> => {
  const pureBase64 = base64Image.split(',')[1] || base64Image;
  const ai = getAi();

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { inlineData: { data: pureBase64, mimeType: 'image/png' } },
        { text: `Enhance this visual based on: ${editInstruction}. Maintain the same professional LinkedIn style and 1:1 aspect ratio.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.find(p => !!p.inlineData);
  if (part?.inlineData?.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to edit image. The AI could not modify the existing asset.");
};
