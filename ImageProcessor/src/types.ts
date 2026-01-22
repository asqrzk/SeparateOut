
export interface UserProfile {
  username: string;
  profilePic: string; // base64
}

export interface ElementPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number; // percentage 0-100
  height?: number; // percentage 0-100
}

export interface CarouselSlide {
  id: string;
  content: string;
  sourceImage: string;
  status: 'idle' | 'analyzing' | 'error';
  theme: 'light' | 'dark'; // 'light' background means 'black' text, 'dark' background means 'white' text
  positions: {
    content: ElementPosition;
    branding: ElementPosition;
    navigation: ElementPosition;
    pillar: ElementPosition;
  };
}

export interface ProjectState {
  slides: CarouselSlide[];
  article: string;
}
