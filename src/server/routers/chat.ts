import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { askGroq } from "@/lib/ai";
import { systemPrompt, profilePrompt } from "@/app/career/prompt";

const MAX_TOKENS = 4000; // Maximum token limit for AI context

export const chatRouter = router({
  // ✅ List chat sessions for the logged-in user (paginated)
  listSessions: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return prisma.chatSession.findMany({
        where: { userId: ctx.userId },
        orderBy: { updatedAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          messages: { take: 1, orderBy: { createdAt: "desc" } }, // Show latest message
        },
      });
    }),

  // ✅ Create a new chat session
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.chatSession.create({
        data: {
          title: input.title,
          userId: ctx.userId,
          topic: input.topic || null,
        },
      });
    }),

  // ✅ Delete a session and its messages
  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.chatSession.findFirst({
        where: { id: input.sessionId, userId: ctx.userId },
      });
      if (!session) throw new Error("Not found or unauthorized");

      await prisma.message.deleteMany({ where: { sessionId: input.sessionId } });
      return prisma.chatSession.delete({ where: { id: input.sessionId } });
    }),

  // ✅ Get messages for a session (paginated)
  getMessages: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      return prisma.message.findMany({
        where: { sessionId: input.sessionId, session: { userId: ctx.userId } },
        orderBy: { createdAt: "asc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });
    }),

  // ✅ Send a message and get AI response
  sendMessage: protectedProcedure
    .input(z.object({ sessionId: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.chatSession.findFirst({
        where: { id: input.sessionId, userId: ctx.userId },
        include: { user: { include: { profile: true } }, messages: true },
      });
      if (!session) throw new Error("Unauthorized");

      // Save user's message
      const userMsg = await prisma.message.create({
        data: {
          sessionId: input.sessionId,
          role: "user",
          content: input.content,
        },
      });

      // Auto-update session title if first message
      if (session.messages.length === 0) {
        const autoTitle = input.content.slice(0, 30) + (input.content.length > 30 ? "..." : "");
        await prisma.chatSession.update({
          where: { id: input.sessionId },
          data: { title: autoTitle },
        });
      }

      // Prepare messages for AI with token count limit
      const allMessages = await prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });

      let tokenCount = 0;
      const groqMessages: { role: "user" | "assistant" | "system"; content: string }[] = [
        systemPrompt(),
        ...(session.user?.profile ? [profilePrompt(session.user.profile)] : []),
      ];

      // Include as many messages as fit within MAX_TOKENS
      for (let i = allMessages.length - 1; i >= 0; i--) {
        const msg = allMessages[i];
        const msgTokens = Math.ceil(msg.content.length / 4); // simple token estimation
        if (tokenCount + msgTokens > MAX_TOKENS) break;
        groqMessages.unshift({ role: msg.role as "user" | "assistant", content: msg.content });
        tokenCount += msgTokens;
      }

      // Summarize older messages if exceeded token limit
      if (allMessages.length > groqMessages.length) {
        groqMessages.unshift({
          role: "system",
          content: "Older messages summarized due to token limits.",
        });
      }

      // Call AI with prepared messages
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

  // ✅ Update chat session title
  updateSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        title: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.chatSession.findFirst({
        where: { id: input.sessionId, userId: ctx.userId },
      });
      if (!session) throw new Error("Not found or unauthorized");

      return prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { title: input.title },
      });
    }),
});
