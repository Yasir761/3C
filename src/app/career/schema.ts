export type Role = "user" | "assistant" | "system";

export interface UserProfile {
  name?: string;
  currentSkills?: string[];
  experienceYears?: number;
  education?: string;
  goals?: string;
  interests?: string[];
}

export interface ChatMessage {
  role: Role;
  content: string;
}
