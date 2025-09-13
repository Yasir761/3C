// "use client";

// import { motion } from "framer-motion";

// export default function TypingIndicator() {
//   const dots = [0, 0.15, 0.3]; // animation delays

//   return (
//     <div className="inline-flex items-center gap-1">
//       {dots.map((delay, idx) => (
//         <motion.span
//           key={idx}
//           className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"
//           animate={{ y: [0, -3, 0], scale: [1, 1.2, 1] }}
//           transition={{
//             repeat: Infinity,
//             repeatType: "loop",
//             duration: 0.6,
//             delay,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// }



"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dots = [0, 0.15, 0.3]; // animation delays

  return (
    <div className="inline-flex items-center gap-1">
      {dots.map((delay, idx) => (
        <motion.span
          key={idx}
          className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm dark:from-blue-400 dark:to-indigo-500"
          animate={{ y: [0, -3, 0], scale: [1, 1.2, 1] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 0.6,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
