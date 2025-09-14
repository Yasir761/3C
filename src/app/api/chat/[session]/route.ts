// import { NextRequest } from "next/server";
// import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// import { chatRouter } from "@/server/routers/chat"; 
// import { createContext } from "@/server/trpc";

// export const GET = async (
//   req: NextRequest,
//   context: { params: { session: string } }
// ) => {
//   const { session } =  context.params; 
//   const ctx = await createContext();

//   return fetchRequestHandler({
//     endpoint: `/api/chat/${session}`,
//     req,
//     router: chatRouter,
//     createContext: () => ctx,
//   });
// };

// export const POST = async (
//   req: NextRequest,
//   context: { params: { session: string } }
// ) => {
//   const { session } =  context.params;
//   const ctx = await createContext();

//   // Extract body
//   const body = await req.json();
//   const { content } = body;

//   return fetchRequestHandler({
//     endpoint: `/api/chat/${session}`,
//     req: new Request(req.url, {
//       method: "POST",
//       body: JSON.stringify({ sessionId: session, content }),
//       headers: req.headers,
//     }),
//     router: chatRouter,
//     createContext: () => ctx,
//   });
// };




import { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { chatRouter } from "@/server/routers/chat"; 
import { createContext } from "@/server/trpc";

interface RouteContext {
  params: { session: string };
}

export const GET = async (
  req: NextRequest,
  { params }: RouteContext
) => {
  const { session } = params; 
  const ctx = await createContext();

  return fetchRequestHandler({
    endpoint: `/api/chat/${session}`,
    req,
    router: chatRouter,
    createContext: () => ctx,
  });
};

export const POST = async (
  req: NextRequest,
  { params }: RouteContext
) => {
  const { session } = params;
  const ctx = await createContext();

  // Extract body
  const body = await req.json();
  const { content } = body;

  return fetchRequestHandler({
    endpoint: `/api/chat/${session}`,
    req: new Request(req.url, {
      method: "POST",
      body: JSON.stringify({ sessionId: session, content }),
      headers: req.headers,
    }),
    router: chatRouter,
    createContext: () => ctx,
  });
};