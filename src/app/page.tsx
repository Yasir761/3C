'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FaRegLightbulb, FaClock, FaChartLine } from "react-icons/fa"
import { Sparkles } from "lucide-react"
import logo from "../../public/logo.png"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">

      {/* 🎨 Floating Gradient Blobs for visual flair */}
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

      {/* 🧭 Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 md:px-12 fixed top-0 left-0 z-50 bg-background/70 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Image src={logo} alt="3C Logo" width={36} height={36} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            3C
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/auth/signin">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* 🌟 Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32 md:px-12 relative">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          Unlock Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
            Career Potential
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl max-w-2xl text-muted-foreground"
        >
          Smarter decisions. Personalized guidance. A career coach that never
          sleeps.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
            asChild
          >
            <Link href="/auth/signup">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Your Career Plan
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/signin">Login</Link>
          </Button>
        </motion.div>

        {/* Hero Image / Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          className="mt-16 w-full max-w-xl mx-auto"
        >
          <Image
            src="/hero.png"
            alt="Hero Preview Light & Dark"
            width={1000}
            height={600}
            className="rounded-2xl shadow-2xl border"
            priority
          />
        </motion.div>
      </main>

      {/* ⚡ Features Section */}
      <section className="px-6 md:px-12 py-20 bg-card relative">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose 3C?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <FaRegLightbulb className="text-primary text-4xl mb-4" />,
              title: "Personalized Guidance",
              desc: "Advice tailored to your unique skills & interests.",
            },
            {
              icon: <FaClock className="text-primary text-4xl mb-4" />,
              title: "Always Available",
              desc: "Your AI coach is ready to chat anytime, anywhere.",
            },
            {
              icon: <FaChartLine className="text-primary text-4xl mb-4" />,
              title: "Track Your Growth",
              desc: "Monitor your sessions & see progress over time.",
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="flex flex-col items-center text-center p-6 hover:scale-105 transition shadow-md"
            >
              <CardContent className="flex flex-col items-center">
                {f.icon}
                <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 📝 Footer */}
      <footer className="px-6 md:px-12 py-6 border-t border-border text-sm text-muted-foreground flex justify-center">
        Made with ❤️ by{" "}
        <Link
          href="https://codilad.dev"
          target="_blank"
          className="text-primary hover:underline ml-1"
        >
          Yasir
        </Link>
      </footer>
    </div>
  )
}
