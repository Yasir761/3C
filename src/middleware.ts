
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


// Protect /chat and all API routes except NextAuth routes
export const config = {
  matcher: [
    "/chat/:path*", // protect all chat pages
    "/api/:path*",  // protect all API routes
  ],
};

export default withAuth(
  async function middleware() {
    // If user is authenticated, continue
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow requests if token exists (user is logged in)
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Redirect unauthorized users to login
      signIn: "/auth/signin",
    },
  }
);
