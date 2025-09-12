"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat"; // redirect to chat

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
            <User className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Email + Password Sign In */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
