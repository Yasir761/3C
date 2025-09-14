"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import SessionList from "@/app/components/SessionList";
import ChatWindow from "@/app/components/ChatWindow";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// ---------------------
// Theme Toggle Component (Desktop)
// ---------------------
function ThemeToggle() {
  const [mounted, setMounted] = useState(false); // Ensure hydration complete before accessing theme
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-md bg-muted animate-pulse" />;

  const themes = [
    { name: "system", icon: Monitor, label: "System" },
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
  ];

  const currentTheme =
    themes.find((t) => t.name === theme) ||
    themes.find((t) => t.name === resolvedTheme) ||
    themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 p-0 bg-card hover:bg-accent border-border transition-colors duration-200"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 py-2 w-36 bg-popover border border-border rounded-lg shadow-lg z-20 backdrop-blur-sm"
            >
              {/* Theme options */}
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                return (
                  <button
                    key={themeOption.name}
                    onClick={() => {
                      setTheme(themeOption.name);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-accent 
                               text-popover-foreground hover:text-accent-foreground
                               flex items-center gap-3 transition-colors duration-200
                               ${
                                 resolvedTheme === themeOption.name
                                   ? "bg-accent text-accent-foreground"
                                   : ""
                               }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{themeOption.label}</span>
                    {/* Indicator for current theme */}
                    {resolvedTheme === themeOption.name && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------
// Simple Toggle Component (Mobile)
// ---------------------
function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Button variant="outline" size="sm" disabled>
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
      </Button>
    );

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="bg-card hover:bg-accent border-border transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

// ---------------------
// Main App Component
// ---------------------
export default function CareerCounselorApp() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null); // Current chat session
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  // TRPC mutations
  const createSession = trpc.chat.createSession.useMutation();
  const sendMessage = trpc.chat.sendMessage.useMutation();
  const utils = trpc.useUtils();

  // ---------------------
  // Helpers
  // ---------------------
  const extractTitleFromPrompt = (prompt: string) => {
    // Map prompt keywords to session titles
    const mappings: Record<string, string> = {
      "career path": "Career Path Discovery",
      "career assessment": "Career Path Discovery",
      resume: "Resume Review",
      interview: "Interview Preparation",
      "career change": "Career Transition",
      "switch careers": "Career Transition",
      salary: "Salary Negotiation",
      negotiate: "Salary Negotiation",
      skills: "Skills Development",
      programming: "Skills Development",
      remote: "Remote Work Guide",
      education: "Education Planning",
      courses: "Education Planning",
    };
    const found = Object.keys(mappings).find((key) => prompt.toLowerCase().includes(key));
    return found ? mappings[found] : "Career Counseling";
  };

  // Create a session from user prompt
  const handleCreateSessionFromPrompt = async (prompt: string) => {
    const title = extractTitleFromPrompt(prompt);
    const newSession = await createSession.mutateAsync({ title, topic: "Career Counseling" });
    setCurrentSessionId(newSession.id);

    // Send initial message to session
    await sendMessage.mutateAsync({ sessionId: newSession.id, content: prompt });

    // Refresh cache for sessions & messages
    await Promise.all([
      utils.chat.listSessions.invalidate({ page: 1, pageSize: 12 }),
      utils.chat.getMessages.invalidate({ sessionId: newSession.id, page: 1, pageSize: 50 }),
    ]);

    return newSession.id;
  };

  // Create an empty session
  const handleCreateEmptySession = async (title: string, topic: string) => {
    const newSession = await createSession.mutateAsync({ title, topic });
    await utils.chat.listSessions.invalidate({ page: 1, pageSize: 12 });
    return newSession.id;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-80 md:flex-shrink-0 border-r border-border bg-card transition-colors duration-300">
        <div className="h-full flex flex-col">
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="App Logo" width={32} height={32} className="rounded-lg" />
              <div>
                <h1 className="font-semibold text-card-foreground text-sm">Career Counselor</h1>
                <p className="text-muted-foreground text-xs">AI-Powered Guidance</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-hidden">
            <SessionList
              selected={currentSessionId}
              onSelect={setCurrentSessionId}
              onCreateSession={handleCreateEmptySession}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs border-r border-border bg-card shadow-xl md:hidden"
          >
            <div className="h-full flex flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Image src="/logo.png" alt="App Logo" width={32} height={32} className="rounded-lg" />
                  <div>
                    <h1 className="font-semibold text-card-foreground text-sm">Career Counselor</h1>
                    <p className="text-muted-foreground text-xs">AI-Powered Guidance</p>
                  </div>
                </div>
                <SimpleThemeToggle />
              </div>

              {/* Mobile Session List */}
              <div className="flex-1 overflow-hidden">
                <SessionList
                  selected={currentSessionId}
                  onSelect={(id) => {
                    setCurrentSessionId(id);
                    setIsSidebarOpen(false);
                  }}
                  onCreateSession={handleCreateEmptySession}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm transition-colors duration-300">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-card hover:bg-accent border-border"
          >
            <Menu className="h-4 w-4" />
            Sessions
          </Button>

          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="App Logo" width={24} height={24} className="rounded" />
            <span className="font-semibold text-foreground text-sm">Career Counselor</span>
          </div>

          <SimpleThemeToggle />
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            sessionId={currentSessionId}
            onCreateSession={handleCreateSessionFromPrompt}
          />
        </div>
      </main>
    </div>
  );
}
