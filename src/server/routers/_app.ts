import { router } from "@/server/trpc";
import { chatRouter } from "@/server/routers/chat";

/**
 * Main application router.
 * Combines all individual routers into a single TRPC router.
 */
export const appRouter = router({
  chat: chatRouter, // Adds the chat routes under 'chat'
});

// Export type for client-side TRPC usage
export type AppRouter = typeof appRouter;
