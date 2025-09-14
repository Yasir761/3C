import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ✅ Protect these routes
export const config = {
  matcher: [
    "/chat/:path*", // All chat pages
    "/api/:path*",  // All API routes
  ],
};

// ✅ Middleware to enforce authentication
export default withAuth(
  async function middleware() {
    // User is authenticated, continue
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow requests if token exists (user is logged in)
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Redirect unauthorized users to login page
      signIn: "/auth/signin",
    },
  }
);
