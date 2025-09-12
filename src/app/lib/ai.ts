import { Groq } from "groq-sdk";
import { UserProfile } from "@prisma/client";
import { systemPrompt, profilePrompt, ChatMessage } from "../career/prompt";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API });

export async function askGroq(messages: ChatMessage[], userProfile?: UserProfile) {
  const finalMessages: ChatMessage[] = [systemPrompt()];

  if (userProfile) {
    finalMessages.push(profilePrompt(userProfile));
  }

  finalMessages.push(...messages);

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: finalMessages,
  });

  return response.choices[0]?.message?.content || "";
}
