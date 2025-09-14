import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

// ✅ Create a typed tRPC hook for React components
export const trpc = createTRPCReact<AppRouter>();

// Usage in components:
// const { data, isLoading } = trpc.chat.listSessions.useQuery({ page: 1 });
