
export type Category = 
  | 'ai' 
  | 'seo' 
  | 'youtube' 
  | 'design' 
  | 'analytics' 
  | 'monetization' 
  | 'optimization' 
  | 'research' 
  | 'planning' 
  | 'fiverr'
  | 'all';

export type Page = 'home' | 'dashboard' | 'blog' | 'pricing' | 'tool-detail';
export type AuthMode = 'login' | 'register' | 'none';
export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface User {
  name: string;
  email: string;
  isPro: boolean;
  avatar: string;
}

export interface ToolOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'toggle';
  choices?: string[];
  defaultValue?: string;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: Category;
  description: string;
  placeholder?: string;
  advancedOptions?: ToolOption[];
  isHot?: boolean;
  blogSlug?: string;
}

export interface ToolResult {
  content: string;
  timestamp: number;
  toolId: string;
}
