import { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { chatRouter } from "@/server/routers/chat"; 
import { createContext } from "@/server/trpc";

// GET handler for fetching chat data
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ session: string }> } // params contain session ID
) => {
  const params = await context.params; // Await because params is a Promise
  const { session } = params;
  const ctx = await createContext(); // Create TRPC context (DB, auth, etc.)

  // Forward request to TRPC router
  return fetchRequestHandler({
    endpoint: `/api/chat/${session}`, // API endpoint for logging/debugging
    req,                              // Original request
    router: chatRouter,               // TRPC router handling chat logic
    createContext: () => ctx,         // Provide context for router
  });
};

// POST handler for sending chat messages
export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ session: string }> }
) => {
  const params = await context.params;
  const { session } = params;
  const ctx = await createContext();

  const body = await req.json();      // Parse request body
  const { content } = body;           // Extract message content

  // Forward POST request to TRPC router
  return fetchRequestHandler({
    endpoint: `/api/chat/${session}`,
    req: new Request(req.url, {
      method: "POST",
      body: JSON.stringify({ sessionId: session, content }), // TRPC expects sessionId & content
      headers: req.headers,                                  // Forward headers (auth, etc.)
    }),
    router: chatRouter,
    createContext: () => ctx,
  });
};
