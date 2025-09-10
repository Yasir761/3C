import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type GroqMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function askGroq(messages: GroqMessage[]) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile", // adjust if needed
    messages,
  });

  return response.choices[0]?.message?.content || "";
}
