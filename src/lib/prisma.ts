import { PrismaClient } from "@prisma/client";

// Extend the global object to store PrismaClient instance across hot reloads
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use an existing PrismaClient if it exists (important for Next.js hot reloads in dev),
// otherwise create a new instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Optional: log queries and errors for debugging
  });

// In development, store the PrismaClient instance on the global object
// to avoid creating multiple instances during hot module replacement
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
