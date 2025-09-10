import { z } from "zod"; 
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/app/lib/prisma";
import { askGroq } from "@/app/lib/ai";

export const chatRouter = router({
  listSessions: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const sessions = await prisma.chatSession.findMany({
        where: { userId: input.userId ?? undefined },
        orderBy: { updatedAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          messages: { take: 1, orderBy: { createdAt: "desc" } }, // last message preview
        },
      });
      return sessions;
    }),

  createSession: publicProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string().optional(),
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const session = await prisma.chatSession.create({
        data: {
          title: input.title,
          userId: input.userId,
          topic: input.topic || null,
        },
      });
      return session;
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });
      return messages;
    }),

  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Save user message
      const userMsg = await prisma.message.create({
        data: {
          sessionId: input.sessionId,
          role: input.role,
          content: input.content,
        },
      });

      // Load conversation history
      const contextMessages = await prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });

      // Convert DB messages → Groq format
      const groqMessages = contextMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Ask Groq for AI response
      const aiText = await askGroq(groqMessages);

      // Save AI response
      const aiMsg = await prisma.message.create({
        data: {
          sessionId: input.sessionId,
          role: "assistant",
          content: aiText,
        },
      });

      // Update session timestamp
      await prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { updatedAt: new Date() },
      });

      return { userMsg, aiMsg };
    }),
});
