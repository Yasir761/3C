import { Groq } from "groq-sdk";
import { UserProfile } from "@prisma/client";
import { systemPrompt, profilePrompt, ChatMessage } from "../app/career/prompt";

// Initialize Groq SDK with your API key from environment variables
const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API });

/**
 * Sends chat messages to Groq and gets a response.
 * Optionally includes a user profile to personalize the response.
 *
 * @param messages - Array of ChatMessage objects from the conversation
 * @param userProfile - Optional user profile data to include in the system prompt
 * @returns The text content of the AI's response
 */
export async function askGroq(
  messages: ChatMessage[],
  userProfile?: UserProfile
) {
  // Start with the system prompt that sets AI behavior
  const finalMessages: ChatMessage[] = [systemPrompt()];

  // If a user profile is provided, add it to guide personalization
  if (userProfile) {
    finalMessages.push(profilePrompt(userProfile));
  }

  // Append the actual conversation messages
  finalMessages.push(...messages);

  // Send the messages to Groq's chat API
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b", // Model to use
    messages: finalMessages,       // Full conversation including system and profile prompts
  });

  // Return the AI's message content, or empty string if none
  return response.choices[0]?.message?.content || "";
}
