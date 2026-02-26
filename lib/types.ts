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

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  goal: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Prospect {
  id: string;
  user_id: string;
  campaign_id: string | null;
  full_name: string;
  linkedin_url: string;
  company: string | null;
  title: string | null;
  notes: string | null;
  status: string;
  touchpoint_count: number;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  prospect_id: string;
  post_text: string;
  post_url: string | null;
  created_at: string;
}

export interface Suggestion {
  id: string;
  user_id: string;
  prospect_id: string;
  activity_id: string | null;
  type: "comment" | "dm";
  content: string;
  status: "pending" | "approved" | "skipped";
  created_at: string;
}
