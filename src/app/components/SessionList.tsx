"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const utils = trpc.useUtils();

  // ----------------------------
  // Fetch sessions with polling
  // ----------------------------
  const { data, isLoading } = trpc.chat.listSessions.useQuery(
    { page, pageSize: 12 },
    { refetchInterval: 3000 } // auto-refresh every 3s
  );

  // ----------------------------
  // Mutations: create, delete, update
  // ----------------------------
  const create = trpc.chat.createSession.useMutation({
    onSuccess: async (s) => {
      await utils.chat.listSessions.invalidate();
      onSelect(s.id);
    },
  });

  const remove = trpc.chat.deleteSession.useMutation({
    onSuccess: async () => {
      await utils.chat.listSessions.invalidate();
      if (selected) onSelect("");
    },
  });

  const update = trpc.chat.updateSession.useMutation({
    onSuccess: async () => {
      await utils.chat.listSessions.invalidate();
      setEditingId(null);
    },
  });

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleCreateSession = async () => {
    if (onCreateSession) {
      try {
        const sessionId = await onCreateSession(
          "New career session",
          "General career"
        );
        onSelect(sessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    } else {
      create.mutate({ title: "New career session", topic: "General career" });
    }
  };

  const handleSave = (sessionId: string) => {
    if (newTitle.trim() !== "") {
      update.mutate({ sessionId, title: newTitle });
    } else {
      setEditingId(null);
    }
  };

  // ----------------------------
  // JSX Render
  // ----------------------------
  return (
    <aside className="w-full bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b bg-card">
        <h3 className="text-sm font-semibold text-foreground">
          Career Sessions
        </h3>
        <Button size="sm" onClick={handleCreateSession} className="gap-1 h-7 px-2">
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline text-xs">New</span>
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
              </div>
            ) : data && data.length > 0 ? (
              <div className="space-y-1.5">
                {data.map((s) => {
                  const isSelected = selected === s.id;
                  const isEditing = editingId === s.id;

                  return (
                    <Card
                      key={s.id}
                      onClick={() => !isEditing && onSelect(s.id)}
                      className={`p-2.5 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-sm"
                          : "hover:bg-muted/30 hover:border-border"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              className="w-full text-xs border rounded px-1 py-0.5"
                              value={newTitle}
                              autoFocus
                              onChange={(e) => setNewTitle(e.target.value)}
                              onBlur={() => handleSave(s.id)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSave(s.id)
                              }
                            />
                          ) : (
                            <div
                              className="text-xs font-medium truncate text-foreground leading-tight"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingId(s.id);
                                setNewTitle(s.title);
                              }}
                            >
                              {s.title && s.title !== "New career session"
                                ? s.title
                                : s.messages?.[0]?.content?.slice(0, 30) || "New chat"}
                            </div>
                          )}
                          <div className="text-[10px] text-muted-foreground truncate mt-0.5 leading-tight">
                            {s.messages?.[0]?.content?.slice(0, 40) ?? "No messages yet"}
                            {(s.messages?.[0]?.content?.length ?? 0) > 40 ? "..." : ""}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-shrink-0 p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove.mutate({ sessionId: s.id });
                          }}
                        >
                          <Trash2 size={10} />
                        </motion.button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-xs font-medium text-foreground mb-1">No sessions yet</div>
                <div className="text-[10px] text-muted-foreground">Click &quot;New&quot; to start</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-card">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Pagination */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 h-6 text-[10px] min-w-[36px]"
            >
              Prev
            </Button>

            <div className="px-3 py-1 text-[10px] font-medium text-muted-foreground min-w-[24px] text-center border rounded border-border bg-muted/10">
              {page}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={data && data.length < 12}
              className="px-2 py-1 h-6 text-[10px] min-w-[36px]"
            >
              Next
            </Button>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
