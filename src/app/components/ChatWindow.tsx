


// "use client"

// import { useEffect, useRef, useState } from "react"
// import { trpc } from "@/utils/trpc"
// import { MessageBubble } from "@/app/components/MessageBubbles"
// import TypingIndicator from "@/app/components/TypingIndicator"
// import { motion, AnimatePresence } from "framer-motion"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Sparkles, Send } from "lucide-react"
// import Image from "next/image"
// import logo from "../../../public/logo.png"

// type LocalMessage = {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   createdAt: string
//   status: "sending" | "sent" | "delivered" | "error"
// }

// export default function ChatWindow({
//   sessionId,
//   onCreateSession,
// }: {
//   sessionId: string | null
//   onCreateSession?: (prompt: string) => Promise<string>
// }) {
//   const [text, setText] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [localMessages, setLocalMessages] = useState<LocalMessage[]>([])

//   const messagesContainerRef = useRef<HTMLDivElement | null>(null)
//   const hasSession = !!sessionId

//   const messagesQuery = trpc.chat.getMessages.useQuery(
//     { sessionId: sessionId ?? "", page: 1, pageSize: 50 },
//     { enabled: hasSession, refetchOnWindowFocus: false }
//   )

//   const sendMessage = trpc.chat.sendMessage.useMutation()

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (!messagesContainerRef.current) return
//     const el = messagesContainerRef.current
//     setTimeout(() => {
//       el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
//     }, 100)
//   }, [localMessages, isTyping])

//   // Reset messages when session changes
//   useEffect(() => setLocalMessages([]), [sessionId])

//   // Send user message
//   const onSend = async () => {
//     if (!sessionId || !text.trim() || isTyping) return
//     const messageContent = text.trim()
//     const tempId = `temp-${Date.now()}`

//     // 1️⃣ Add user message instantly
//     setLocalMessages(prev => [
//       ...prev,
//       {
//         id: tempId,
//         role: "user",
//         content: messageContent,
//         createdAt: new Date().toISOString(),
//         status: "sent", // tick visible immediately
//       }
//     ])
//     setText("")
//     setIsTyping(true)

//     try {
//       const response = await sendMessage.mutateAsync({ sessionId, content: messageContent })

//       // 2️⃣ Add AI response after slight delay
//       setTimeout(() => {
//         setLocalMessages(prev => [
//           ...prev,
//           {
//             id: response.aiMsg.id,
//             role: "assistant",
//             content: response.aiMsg.content,
//             createdAt: response.aiMsg.createdAt.toISOString(),
//             status: "delivered",
//           }
//         ])
//         setIsTyping(false)
//       }, 400)
//     } catch (error) {
//       console.error(error)
//       setLocalMessages(prev =>
//         prev.map(msg => msg.id === tempId ? { ...msg, status: "error" } : msg)
//       )
//       setIsTyping(false)
//     }
//   }

//   // Handle creating new session from starter prompts
//   const handleCreateSession = async (prompt: string) => {
//     if (!onCreateSession) return
//     try {
//       await onCreateSession(prompt)
//     } catch (error) {
//       console.error("Error creating session:", error)
//     }
//   }

//   const starterPrompts = [
//     "What career roles fit my skills?",
//     "How can I transition into data science?",
//     "Suggest remote-friendly job options",
//     "What courses should I take for web development?",
//   ]

//   if (!hasSession) {
//     return (
//       <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
//         <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
//           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-8">
//             <div className="text-6xl mb-4 animate-bounce">🎯</div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Career Guidance Hub</h1>
//             <p className="text-muted-foreground max-w-lg leading-relaxed">
//               Your AI career counselor provides personalized guidance and actionable advice.
//               Start with one of these prompts or create your own.
//             </p>
//           </motion.div>
//           <div className="grid gap-3 mt-6 w-full max-w-md">
//             {starterPrompts.map(s => (
//               <motion.div key={s} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
//                 <Button variant="outline" className="w-full justify-start text-left text-sm rounded-xl shadow-sm" onClick={() => handleCreateSession(s)}>
//                   <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
//                   {s}
//                 </Button>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Use localMessages only to render instantly
//   const allMessages = (() => {
//     const serverMessages = messagesQuery.data ?? []
  
//     // Use a Map to deduplicate by ID
//     const map = new Map<string, LocalMessage>()
  
//     // First add server messages (filter out system messages)
//     serverMessages
//       .filter(msg => msg.role !== "system")
//       .forEach(msg => map.set(msg.id, {
//         id: msg.id,
//         role: msg.role as "user" | "assistant",
//         content: msg.content,
//         createdAt: msg.createdAt.toISOString(),
//         status: "delivered" as const,
//       }))
  
//     // Then add local messages that are still sending/error or not on server
//     localMessages.forEach(msg => {
//       if (!map.has(msg.id) || msg.status !== "sent") {
//         map.set(msg.id, msg)
//       }
//     })
  
//     return Array.from(map.values()).sort(
//       (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     )
//   })()
  

//   return (
//     <div className="flex flex-col h-full bg-background">
//       {/* Header */}
//       <div className="px-4 sm:px-6 py-3 border-b bg-card shadow-sm flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
//           <div>
//             <div className="text-sm font-semibold text-foreground">3C – Career Counselor</div>
//             <div className="text-xs text-muted-foreground">AI-powered guidance</div>
//           </div>
//         </div>
//         <Badge variant="outline" className="text-xs">
//           {allMessages.length} messages
//         </Badge>
//       </div>

//       {/* Messages */}
//       <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
//         {allMessages.length === 0 ? (
//           <div className="flex items-center justify-center py-8 text-muted-foreground">
//             Start the conversation by typing a message below
//           </div>
//         ) : (
//           <AnimatePresence mode="popLayout">
//             {allMessages.map((m, index) => (
//               <motion.div
//                 key={`${m.id}-${index}`}
//                 initial={{ opacity: 0, y: 15 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.25 }}
//                 className="flex items-start gap-2"
//               >
//                 {m.role === "assistant" && (
//                   <div className="shrink-0 mt-1">
//                     <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold">
//                       <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
//                     </div>
//                   </div>
//                 )}
//                 <MessageBubble role={m.role} content={m.content} timestamp={m.createdAt} />
//               </motion.div>
//             ))}

//             {isTyping && (
//               <motion.div key="typing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-start gap-2">
//                 <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold mt-1">
//                   <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
//                 </div>
//                 <TypingIndicator />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* Input Bar */}
//       <div className="p-3 sm:p-4 border-t bg-card flex items-center gap-3 sticky bottom-0">
//         <Textarea
//           value={text}
//           onChange={e => setText(e.target.value)}
//           rows={1}
//           placeholder="💭 Share your career goals or questions..."
//           onKeyDown={e => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault()
//               onSend()
//             }
//           }}
//           className="flex-1 resize-none rounded-xl shadow-sm bg-muted/40 focus-visible:ring-indigo-500"
//           disabled={isTyping}
//         />
//         <Button onClick={onSend} disabled={!text.trim() || isTyping} className="flex items-center gap-2 rounded-xl px-4 sm:px-6">
//           {isTyping ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//           ) : (
//             <>
//               <Send className="h-4 w-4" />
//               Send
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }





"use client"

import { useEffect, useRef, useState } from "react"
import { trpc } from "@/utils/trpc"
import { MessageBubble } from "@/app/components/MessageBubbles"
import TypingIndicator from "@/app/components/TypingIndicator"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send } from "lucide-react"
import Image from "next/image"
import logo from "../../../public/logo.png"

type LocalMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  status: "sending" | "sent" | "delivered" | "error"
}

export default function ChatWindow({
  sessionId,
  onCreateSession,
}: {
  sessionId: string | null
  onCreateSession?: (prompt: string) => Promise<string>
}) {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([])

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const hasSession = !!sessionId

  const messagesQuery = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId ?? "", page: 1, pageSize: 50 },
    { enabled: hasSession, refetchOnWindowFocus: false }
  )

  const sendMessage = trpc.chat.sendMessage.useMutation()

  // Auto-scroll to bottom
  useEffect(() => {
    if (!messagesContainerRef.current) return
    const el = messagesContainerRef.current
    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }, 100)
  }, [localMessages, isTyping])

  // Reset messages when session changes
  useEffect(() => setLocalMessages([]), [sessionId])

  // Send user message
  const onSend = async () => {
    if (!sessionId || !text.trim() || isTyping) return
    const messageContent = text.trim()
    const tempId = `temp-${Date.now()}`

    // 1️⃣ Add user message instantly
    setLocalMessages(prev => [
      ...prev,
      {
        id: tempId,
        role: "user",
        content: messageContent,
        createdAt: new Date().toISOString(),
        status: "sent", // tick visible immediately
      }
    ])
    setText("")
    setIsTyping(true)

    try {
      const response = await sendMessage.mutateAsync({ sessionId, content: messageContent })

      // 2️⃣ Add AI response after slight delay
      setTimeout(() => {
        setLocalMessages(prev => [
          ...prev,
          {
            id: response.aiMsg.id,
            role: "assistant",
            content: response.aiMsg.content,
            createdAt: response.aiMsg.createdAt.toISOString(),
            status: "delivered",
          }
        ])
        setIsTyping(false)
      }, 400)
    } catch (error) {
      console.error(error)
      setLocalMessages(prev =>
        prev.map(msg => msg.id === tempId ? { ...msg, status: "error" } : msg)
      )
      setIsTyping(false)
    }
  }

  // Handle creating new session from starter prompts
  const handleCreateSession = async (prompt: string) => {
    if (!onCreateSession) return
    try {
      await onCreateSession(prompt)
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const starterPrompts = [
    "What career roles fit my skills?",
    "How can I transition into data science?",
    "Suggest remote-friendly job options",
    "What courses should I take for web development?",
  ]

  if (!hasSession) {
    return (
      <div className="flex flex-col h-full bg-background-gradient">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎯</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Career Guidance Hub</h1>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              Your AI career counselor provides personalized guidance and actionable advice.
              Start with one of these prompts or create your own.
            </p>
          </motion.div>
          <div className="grid gap-3 mt-6 w-full max-w-md">
            {starterPrompts.map(s => (
              <motion.div key={s} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="w-full justify-start text-left text-sm rounded-xl shadow-sm" onClick={() => handleCreateSession(s)}>
                  <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                  {s}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Use localMessages only to render instantly
  const allMessages = (() => {
    const serverMessages = messagesQuery.data ?? []
  
    // Use a Map to deduplicate by ID
    const map = new Map<string, LocalMessage>()
  
    // First add server messages (filter out system messages)
    serverMessages
      .filter(msg => msg.role !== "system")
      .forEach(msg => map.set(msg.id, {
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        status: "delivered" as const,
      }))
  
    // Then add local messages that are still sending/error or not on server
    localMessages.forEach(msg => {
      if (!map.has(msg.id) || msg.status !== "sent") {
        map.set(msg.id, msg)
      }
    })
  
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  })()
  

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b bg-card shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
          <div>
            <div className="text-sm font-semibold text-foreground">3C – Career Counselor</div>
            <div className="text-xs text-muted-foreground">AI-powered guidance</div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {allMessages.length} messages
        </Badge>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Start the conversation by typing a message below
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {allMessages.map((m, index) => (
              <motion.div
                key={`${m.id}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2"
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold">
                      <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
                    </div>
                  </div>
                )}
                <MessageBubble role={m.role} content={m.content} timestamp={m.createdAt} />
              </motion.div>
            ))}

            {isTyping && (
              <motion.div key="typing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold mt-1">
                  <Image src={logo} alt="3C Logo" width={32} height={32} className="object-contain" />
                </div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t bg-card flex items-center gap-3 sticky bottom-0">
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={1}
          placeholder="💭 Share your career goals or questions..."
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          className="flex-1 resize-none rounded-xl shadow-sm bg-muted/40 focus-visible:ring-indigo-500"
          disabled={isTyping}
        />
        <Button onClick={onSend} disabled={!text.trim() || isTyping} className="flex items-center gap-2 rounded-xl px-4 sm:px-6">
          {isTyping ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
