export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  usageTokens: number;
  maxTokens: number;
  createdAt: string;
  lastLogin: string;
}

export type BlogPost = {
  _id: string;
  topic: string;
  tone: string;
  length: number;
  isPublic: boolean;
  content?: string;
  createdAt: string;
  author?: any;
  coverImage?: string;
  accentColor?: string;
  customCSS?: string;
  template?: any;
  publicPath?: string;
  publishedAt?: string;
  updatedAt?: string;
};

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  atsScore: number;
  issues: string[];
  suggestions: string[];
  enhancedVersion?: string;
  createdAt: string;
  userId: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  resolution: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

export interface Usage {
  userId: string;
  tokensUsed: number;
  lastReset: string;
}

export type Theme = 'light' | 'dark';

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}