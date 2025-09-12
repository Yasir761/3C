// app/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }
  
      // ✅ Automatically log in the user with their new credentials
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.href = "/chat"; // Redirect only after successful login
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
