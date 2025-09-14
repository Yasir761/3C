import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app"; // Main TRPC router
import { createContext } from "@/server/trpc";     // Context (DB, auth, etc.)

// Generic TRPC handler for GET and POST requests
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",   // Endpoint for TRPC requests (used internally for logging/debugging)
    req,                     // Forward the incoming request
    router: appRouter,       // Main TRPC router handling all app procedures
    createContext: () => createContext(), // Create a new context for each request
  });

// Export as both GET and POST handlers for Next.js route
export { handler as GET, handler as POST };
