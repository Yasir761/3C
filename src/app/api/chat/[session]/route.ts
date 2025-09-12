import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { chatRouter } from "@/server/routers/chat"; 
import { createContext } from "@/server/trpc";

export const GET = async (req: Request, { params }: { params: { session: string } }) => {
  // You can fetch messages for a specific session
  const ctx = await createContext();

  // Optional: verify the session belongs to the logged-in user
  const sessionId = params.session;

  // Forward request to TRPC router
  return fetchRequestHandler({
    endpoint: `/api/chat/${sessionId}`,
    req,
    router: chatRouter,
    createContext: () => ctx,
  });
};

export const POST = async (req: Request, { params }: { params: { session: string } }) => {
  const ctx = await createContext();
  const sessionId = params.session;

  // Get body
  const body = await req.json();
  const { content } = body;

  // Forward to TRPC mutation
  return fetchRequestHandler({
    endpoint: `/api/chat/${sessionId}`,
    req: new Request(req.url, {
      method: "POST",
      body: JSON.stringify({ sessionId, content }),
      headers: req.headers,
    }),
    router: chatRouter,
    createContext: () => ctx,
  });
};
