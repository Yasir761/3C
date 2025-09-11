import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Use only the main font
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Career Counselor Chat",
  description: "AI-powered career counseling assistant for your career growth",
  icons: {
    icon: "/favicon.ico", // place favicon.ico in /public
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional: add in /public
  },
  themeColor: "#4f46e5", // Indigo-600, matches your UI
  openGraph: {
    title: "Career Counselor Chat",
    description:
      "Get personalized, AI-powered career counseling to boost your career growth.",
    url: "https://yourdomain.com",
    siteName: "Career Counselor Chat",
    images: [
      {
        url: "/og-image.png", // add an Open Graph image in /public
        width: 1200,
        height: 630,
        alt: "Career Counselor Chat",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
     <body className={`${geistSans.variable} antialiased h-full bg-white text-gray-800`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
