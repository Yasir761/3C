import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Connect NextAuth to Prisma for DB operations
  providers: [
    CredentialsProvider({
      name: "credentials",
      // Fields for login form
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Custom login logic
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        // Return user object for JWT/session
        return {
          id: user.id,
          email: user.email || undefined,
          name: user.name || undefined,
        };
      }
    })
  ],
  callbacks: {
    // Include user id in JWT token
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Include user id in session object
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT strategy (no DB session storage needed)
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
};

// NextAuth handler for GET and POST requests
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
