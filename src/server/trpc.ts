import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
export type Context = {
  session: Session | null;
  userId?: string;
};

export const createContext = async (): Promise<Context> => {
  const session = await getServerSession(authOptions);
  return {
    session,
    userId: session?.user?.id, // now TS should recognize user.id
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("Unauthorized");
    }
    return next({
      ctx: {
        ...ctx,
        userId: ctx.session.user?.id,
      },
    });
  })
);
