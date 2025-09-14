"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 🔹 Child component responsible for extracting callback URL from query params
function CallbackUrlProvider({
  onCallbackUrl,
}: {
  onCallbackUrl: (url: string) => void;
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat";

  // Push value up to parent state
  onCallbackUrl(callbackUrl);

  return null;
}

export default function SignInPage() {
  // Form and state management
  const [callbackUrl, setCallbackUrl] = useState("/chat");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle email/password login
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false, // Disable automatic redirect
        email,
        password,
        callbackUrl,     // Redirect after successful login
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = callbackUrl; // Redirect manually
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      {/* Suspense wrapper for async searchParams */}
      <Suspense>
        <CallbackUrlProvider onCallbackUrl={setCallbackUrl} />
      </Suspense>

      {/* Floating gradient blobs for visual effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 left-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-10 right-[-120px] w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 blur-3xl"
      />

      {/* Sign-in card */}
      <Card className="max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6 bg-card/90 backdrop-blur-sm relative z-10">
        <CardContent className="flex flex-col items-center text-center p-0">
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to continue your career journey
            </p>
          </div>

          {/* Email + Password Sign-In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 w-full mt-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-input text-foreground"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-input text-foreground"
              />
            </div>
            {/* Display error message */}
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg shadow font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Link to Signup page */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
