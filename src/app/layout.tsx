// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Geist font
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "3C - AI Career Counselor",
  description: "AI-powered career counseling assistant for personalized career growth",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#4338ca" }
  ],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased h-full 
          bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 
          text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}