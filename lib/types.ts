export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  linkedin_url: string | null;
  industry: string | null;
  preferred_tone: string;
  created_at: string;
  updated_at: string;
}

export interface CommentGeneration {
  id: string;
  user_id: string;
  post_text: string;
  comments: string[];
  copied_index: number | null;
  created_at: string;
}

export interface PostDraft {
  id: string;
  user_id: string;
  topic: string;
  tone: string;
  format: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type Tone = "professional" | "casual" | "witty" | "inspirational";
export type PostFormat = "short" | "long" | "list" | "hook-heavy" | "question";
