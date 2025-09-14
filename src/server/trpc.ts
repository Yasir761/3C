import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

// ✅ Define the context type for tRPC procedures
export type Context = {
  session: Session | null; // NextAuth session object
  userId?: string; // Optional user ID extracted from session
};

// ✅ Create context for each request
export const createContext = async (): Promise<Context> => {
  const session = await getServerSession(authOptions); // Get session server-side
  return {
    session,
    userId: session?.user?.id, // TypeScript now knows session.user.id exists
  };
};

// ✅ Initialize tRPC with context and superjson transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson, // For serializing complex data types
});

// ✅ Export router factory
export const router = t.router;

// ✅ Export public procedure (accessible to anyone)
export const publicProcedure = t.procedure;

// ✅ Protected procedure middleware
export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
      // Block unauthorized access
      throw new Error("Unauthorized");
    }
    // Pass userId to next middleware or procedure
    return next({
      ctx: {
        ...ctx,
        userId: ctx.session.user?.id,
      },
    });
  })
);
