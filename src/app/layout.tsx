import type { Metadata, Viewport } from "next";
import "./globals.css"; 
import { Providers } from "@/app/providers"; 

//  Metadata for the app (used by Next.js for SEO, Open Graph, etc.)
export const metadata: Metadata = {
  title: "3C - AI Career Counselor",
  description:
    "AI-powered career counseling assistant for personalized career growth",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com"
  ),
  openGraph: {
    title: "3C - AI Career Counselor",
    description:
      "Get personalized, AI-powered career counseling to boost your career growth.",
    url: "https://yourdomain.com",
    siteName: "3C",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "3C - AI Career Counselor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// Viewport / theme color settings for light & dark modes
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#4338ca" },
  ],
};

//  Root layout wrapping the entire app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap entire app in Providers to supply context, theme, auth, etc. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
