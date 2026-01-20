
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AppStage = 'INPUT' | 'EDITING' | 'VISUALS' | 'FINAL';

export type Tone = 'Professional' | 'Casual' | 'Inspirational' | 'Thought Leader' | 'Controversial';
export type Language = 'en' | 'ar';

export interface PostPoint {
  id: string;
  title: string;
  content: string;
  suggestedPrompt?: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface LinkedInDraft {
  fullPost: string;
  points: PostPoint[];
  searchResults: SearchResultItem[];
  searchEntryPointHtml?: string;
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface GeneratedPost {
  id: string;
  text: string;
  points: PostPoint[];
  timestamp: number;
}

export interface GeneratedImage {
  id: string;
  data: string;
  prompt: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}
