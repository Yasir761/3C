"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/utils/trpc";
import { Plus, Trash2 } from "lucide-react";

export default function SessionList({
  selected,
  onSelect,
  onCreateSession,
}: {
  selected?: string | null;
  onSelect: (id: string) => void;
  onCreateSession?: (title: string, topic: string) => Promise<string>;
}) {
  const [page, setPage] = useState(1);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.chat.listSessions.useQuery({
    page,
    pageSize: 12,
  });

  const create = trpc.chat.createSession.useMutation({
    onSuccess: async (s) => {
      await utils.chat.listSessions.invalidate({ page, pageSize: 12 });
      onSelect(s.id);
    },
  });

  const remove = trpc.chat.deleteSession.useMutation({
    onSuccess: async () => {
      await utils.chat.listSessions.invalidate({ page, pageSize: 12 });
      if (selected) onSelect(""); // reset selection if deleted
    },
  });

  const handleCreateSession = async () => {
    if (onCreateSession) {
      try {
        const sessionId = await onCreateSession("New career session", "General career");
        onSelect(sessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    } else {
      create.mutate({
        title: "New career session",
        topic: "General career",
      });
    }
  };

  return (
    <aside className="w-full sm:w-72 md:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-3 pt-3">
        <h3 className="text-sm font-semibold text-gray-700">Career Sessions</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition"
          onClick={handleCreateSession}
          aria-label="New session"
        >
          <Plus size={14} />
          New
        </motion.button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {isLoading ? (
          <div className="p-3 text-sm text-gray-500">Loading sessions…</div>
        ) : data && data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((s) => {
              const isSelected = selected === s.id;
              return (
                <motion.li
                  key={s.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-200 shadow-sm ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 border border-indigo-300"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => onSelect(s.id)}
                  >
                    <div className="text-sm font-medium truncate text-gray-800">
                      {s.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {s.messages?.[0]?.content?.slice(0, 50) ?? "No messages yet"}...
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="ml-2 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove.mutate({ sessionId: s.id });
                    }}
                    aria-label="Delete session"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
          >
            <div className="text-4xl animate-bounce">🎯</div>
            <div className="font-medium">No career sessions yet</div>
            <div className="text-xs">Click &quot;New&quot; or choose a topic to start</div>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-3 pb-3">
        <button
          className="px-2 py-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="font-medium">Page {page}</div>
        <button
          className="px-2 py-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={data && data.length < 12}
        >
          Next
        </button>
      </div>
    </aside>
  );
}
