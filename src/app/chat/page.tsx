"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import SessionList from "@/app/components/SessionList";
import ChatWindow from "@/app/components/ChatWindow";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function CareerCounselorApp() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const createSession = trpc.chat.createSession.useMutation();
  const sendMessage = trpc.chat.sendMessage.useMutation();
  const utils = trpc.useUtils();

  const extractTitleFromPrompt = (prompt: string) => {
    if (prompt.includes("career path") || prompt.includes("career Assessment")) return "Career Path Discovery";
    if (prompt.includes("resume")) return "Resume Review";
    if (prompt.includes("interview")) return "Interview Preparation";
    if (prompt.includes("career change") || prompt.includes("switch careers")) return "Career Transition";
    if (prompt.includes("salary") || prompt.includes("negotiate")) return "Salary Negotiation";
    if (prompt.includes("skills") || prompt.includes("programming")) return "Skills Development";
    if (prompt.includes("remote")) return "Remote Work Guide";
    if (prompt.includes("education") || prompt.includes("courses")) return "Education Planning";
    return "Career Counseling";
  };

  const handleCreateSessionFromPrompt = async (prompt: string): Promise<string> => {
    const title = extractTitleFromPrompt(prompt);
    const newSession = await createSession.mutateAsync({ title, topic: "Career Counseling" });
    setCurrentSessionId(newSession.id);
    await sendMessage.mutateAsync({ sessionId: newSession.id, content: prompt });
    await Promise.all([
      utils.chat.listSessions.invalidate({ page: 1, pageSize: 12 }),
      utils.chat.getMessages.invalidate({ sessionId: newSession.id, page: 1, pageSize: 50 }),
    ]);
    return newSession.id;
  };

  const handleCreateEmptySession = async (title: string, topic: string) => {
    const newSession = await createSession.mutateAsync({ title, topic });
    await utils.chat.listSessions.invalidate({ page: 1, pageSize: 12 });
    return newSession.id;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <SessionList
          selected={currentSessionId}
          onSelect={setCurrentSessionId}
          onCreateSession={handleCreateEmptySession}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 md:hidden bg-white shadow-lg w-3/4 max-w-xs"
          >
            <SessionList
              selected={currentSessionId}
              onSelect={(id) => {
                setCurrentSessionId(id);
                setIsSidebarOpen(false);
              }}
              onCreateSession={handleCreateEmptySession}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile header with menu button and logout */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-3 py-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition"
          >
            ☰ Sessions
          </button>
          <span className="font-semibold text-gray-700">Career Counseling</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition text-red-600 font-medium text-sm"
          >
            Logout
          </button>
        </div>

        {/* Desktop header logout button */}
        <div className="hidden md:flex justify-end px-4 py-3 bg-white shadow-sm border-b border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition text-red-600 font-medium text-sm"
          >
            Logout
          </button>
        </div>

        <ChatWindow
          sessionId={currentSessionId}
          onCreateSession={handleCreateSessionFromPrompt}
        />
      </div>
    </div>
  );
}
