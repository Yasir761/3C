"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">CareerAI</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          Your <span className="text-indigo-600">AI Career Coach</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl max-w-2xl text-gray-600"
        >
          Personalized guidance, smarter decisions, and actionable career advice—
          all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Start Free
          </Link>
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </motion.div>

        {/* Animated CTA / Motion element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 1], y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          className="mt-12 text-indigo-600 font-bold text-2xl"
        >
          🚀 Start your career journey today!
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 border-t text-sm text-gray-500 flex justify-center">
        Made by{" "}
        <Link
          href="https://codilad.dev"
          target="_blank"
          className="text-indigo-600 hover:underline ml-1"
        >
          Yasir
        </Link>
      </footer>
    </div>
  );
}
