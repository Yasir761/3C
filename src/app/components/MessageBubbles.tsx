"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import ReactMarkdown from "react-markdown"

// ---------------------
// Props for MessageBubble
// ---------------------
export function MessageBubble({
  role,
  content,
  timestamp,
}: {
  role: "user" | "assistant"
  content: string
  timestamp?: string | Date
}) {
  const isUser = role === "user" // Determine bubble alignment and colors

  return (
    <motion.div
      // Slide-in animation for messages
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 22 }}
      className={clsx("w-full flex px-2 sm:px-3 mb-4", {
        "justify-end": isUser,
        "justify-start": !isUser,
      })}
    >
      <motion.div
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={clsx(
          "relative rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 max-w-[85%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[55%] break-words text-sm leading-relaxed backdrop-blur-sm",
          "border border-opacity-20 shadow-md",
          isUser
            ? "bg-primary text-primary-foreground border-primary/20 shadow-primary/25"
            : "bg-muted text-muted-foreground border-border/20 shadow-border/15"
        )}
      >
        {/* --------------------- */}
        {/* Subtle ambient glow */}
        {/* --------------------- */}
        <motion.div
          className={clsx(
            "absolute inset-0 rounded-2xl opacity-30 blur-sm -z-10",
            isUser
              ? "bg-gradient-to-br from-blue-400 to-purple-500"
              : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
          )}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* --------------------- */}
        {/* Message content (Markdown) */}
        {/* --------------------- */}
        <div className="relative z-10 prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              a: (props) => (
                <a
                  {...props}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              code: (props) => (
                <code
                  {...props}
                  className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono"
                />
              ),
              li: (props) => <li className="ml-4 list-disc">{props.children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* --------------------- */}
        {/* Timestamp */}
        {/* --------------------- */}
        {timestamp && (
          <div
            className={clsx(
              "mt-1 text-[10px] text-right relative z-10",
              isUser ? "text-primary-foreground/80" : "text-muted-foreground/80"
            )}
          >
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}

        {/* --------------------- */}
        {/* Shine hover effect */}
        {/* --------------------- */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent opacity-0"
          whileHover={{ opacity: [0, 0.08, 0], x: [-100, 100] }}
          transition={{ duration: 0.7 }}
        />

        {/* --------------------- */}
        {/* Bubble Tail */}
        {/* --------------------- */}
        <div
          className={clsx(
            "absolute w-0 h-0 border-solid",
            isUser
              ? "right-0 top-3 border-l-8 border-t-4 border-b-4 border-l-primary/80 border-t-transparent border-b-transparent translate-x-2 sm:translate-x-3"
              : "left-0 top-3 border-r-8 border-t-4 border-b-4 border-r-muted/80 border-t-transparent border-b-transparent -translate-x-2 sm:-translate-x-3"
          )}
        />
      </motion.div>
    </motion.div>
  )
}
