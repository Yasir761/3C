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
  title: "Career Counselor Chat",
  description: "AI-powered career counseling assistant for your career growth",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#4f46e5",
  openGraph: {
    title: "Career Counselor Chat",
    description:
      "Get personalized, AI-powered career counseling to boost your career growth.",
    url: "https://yourdomain.com",
    siteName: "Career Counselor Chat",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Counselor Chat",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} antialiased h-full bg-gray-50 text-gray-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
