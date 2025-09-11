import { ChatMessage, UserProfile } from "./schema";

export function systemPrompt(): ChatMessage {
  return {
    role: "system",
    content: `You are a highly experienced career counselor. 
Provide **practical, specific, and actionable career guidance** tailored to the user's profile.
Format your response exactly as:

1. Summary of User Info
2. Advice (be specific, actionable)
3. Steps (list concrete next steps)
4. Resources (tools, courses, articles)
5. Optional: Questions to clarify if userProfile is incomplete

Keep answers concise, professional, and empathetic.`,
  };
}

export function profilePrompt(user: UserProfile): ChatMessage {
  return {
    role: "system",
    content: `User Profile:
- Name: ${user.name || "Unknown"}
- Skills: ${user.currentSkills?.join(", ") || "None"}
- Experience: ${user.experienceYears ?? "Unknown"} years
- Education: ${user.education || "Unknown"}
- Goals: ${user.goals || "Not specified"}
- Interests: ${user.interests?.join(", ") || "Not specified"}`,
  };
}
