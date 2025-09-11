"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export default function MessageBubble({
  role,
  content,
  timestamp, // new prop
}: {
  role: "user" | "assistant";
  content: string;
  timestamp?: string | Date;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 180,
        damping: 20,
      }}
      className={clsx("w-full flex mb-3 px-3", {
        "justify-end": isUser,
        "justify-start": !isUser,
      })}
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          y: -1,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.97 }}
        className={clsx(
          "relative rounded-2xl px-4 py-2.5 max-w-[80%] sm:max-w-[65%] break-words text-sm leading-relaxed backdrop-blur-sm",
          "border border-opacity-20 shadow-lg",
          isUser
            ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-blue-500/25 border-blue-400"
            : "bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 shadow-gray-500/20 border-gray-200"
        )}
      >
        {/* Subtle ambient glow */}
        <motion.div
          className={clsx(
            "absolute inset-0 rounded-2xl opacity-40 blur-sm -z-10",
            isUser
              ? "bg-gradient-to-br from-blue-400 to-purple-500"
              : "bg-gradient-to-br from-gray-200 to-gray-300"
          )}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Message content */}
        <div className="relative z-10">{content}</div>

        {/* Timestamp */}
        {timestamp && (
          <div className="text-[10px] text-gray-400 mt-1 text-right relative z-10">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}

        {/* Premium shine effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          whileHover={{
            opacity: [0, 0.1, 0],
            x: [-100, 100],
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Message tail */}
        <div
          className={clsx(
            "absolute w-0 h-0 border-solid",
            isUser
              ? "right-0 top-3 border-l-8 border-t-4 border-b-4 border-l-indigo-600 border-t-transparent border-b-transparent transform translate-x-2"
              : "left-0 top-3 border-r-8 border-t-4 border-b-4 border-r-gray-200 border-t-transparent border-b-transparent transform -translate-x-2"
          )}
        />
      </motion.div>
    </motion.div>
  );
}
