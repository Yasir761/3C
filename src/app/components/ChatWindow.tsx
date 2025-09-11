"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import MessageBubble from "@/app/components/MessageBubbles";
import TypingIndicator from "@/app/components/TypingIndicator";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({
  sessionId,
  onCreateSession,
}: {
  sessionId: string | null;
  onCreateSession?: (prompt: string) => Promise<string>;
}) {
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const hasSession = !!sessionId;

  const messagesQuery = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId ?? "", page, pageSize: 50 },
    { enabled: hasSession }
  );

  const sendMessage = trpc.chat.sendMessage.useMutation();
  const utils = trpc.useUtils();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (!messagesQuery.data || !messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messagesQuery.data?.length]);

  const onSend = async () => {
    if (!sessionId || !text.trim()) return;
    setIsTyping(true);
    try {
      await sendMessage.mutateAsync({
        sessionId,
        role: "user",
        content: text.trim(),
      });
      await utils.chat.getMessages.invalidate({ sessionId, page, pageSize: 50 });
      setText("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasSession) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-7xl mb-4 animate-bounce">🎯</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Career Guidance Hub</h1>
            <p className="text-gray-600 max-w-xl leading-relaxed">
              Your AI career counselor provides personalized guidance and actionable advice.
              Start a new session to get personalized suggestions.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">🎯</span>
          <div>
            <div className="text-sm font-semibold text-gray-800">3C - Your Career Counselor Chat</div>
            <div className="text-xs text-gray-500">AI-powered guidance</div>
          </div>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {messagesQuery.isLoading ? "Loading…" : `${messagesQuery.data?.length ?? 0} messages`}
        </div>
      </div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 space-y-4 scroll-smooth min-h-0"
      >
        {messagesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8 text-gray-500">Loading…</div>
        ) : (
          <AnimatePresence>
            {messagesQuery.data?.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MessageBubble
                  role={m.role as "user" | "assistant"}
                  content={m.content}
                  timestamp={m.createdAt} // <-- Pass timestamp
                />
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex items-center gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="💭 Share your career goals or questions..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm bg-gray-50 focus:bg-white transition-colors"
        />
        <motion.button
          onClick={onSend}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={!text.trim() || isTyping}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTyping ? "..." : "Send"}
        </motion.button>
      </div>
    </div>
  );
}
