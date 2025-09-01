import { Model } from '.';

export interface NewSnippet {
  title: string;
  description?: string;
  language: string;
  code: string;
  docs?: string;
  isPinned: boolean;
  tags: string[];
  aiExplanation?: string;
  aiComplexity?: 'beginner' | 'intermediate' | 'advanced';
  aiSuggestedTags?: string[];
}

export interface Snippet extends Model, NewSnippet {}
