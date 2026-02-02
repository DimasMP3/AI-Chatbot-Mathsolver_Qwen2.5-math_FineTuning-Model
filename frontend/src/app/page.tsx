
"use client";

import { useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, Plus, Image as ImageIcon, Mic } from "lucide-react";
import MathDisplay from "@/components/MathDisplay";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { EXAMPLE_PROMPTS } from "@/constants";

export default function Home() {
  const { messages, input, setInput, isLoading, messagesEndRef, handleSubmit } =
    useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      handleSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#131314] text-gray-900 dark:text-gray-100 font-sans">
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#131314]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-xl font-medium tracking-tight text-gray-600 dark:text-gray-300">Math Solver</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase tracking-widest">Experimental</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
            U
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pb-40">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col min-h-[70vh] justify-center items-start py-12"
            >
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-medium text-[#c4c7c5] tracking-tight mb-2">Hello, User</h1>
                <h1 className="text-4xl md:text-5xl font-medium text-[#444746] dark:text-white tracking-tight">How can I help today?</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {EXAMPLE_PROMPTS.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="text-left p-4 rounded-2xl bg-gray-100 dark:bg-[#1e1f20] hover:bg-gray-200 dark:hover:bg-[#333537] transition-colors group h-32 flex flex-col justify-between relative overflow-hidden"
                  >
                    <span className="text-gray-800 dark:text-gray-200 font-medium z-10 relative text-sm">{prompt}</span>
                    <div className="self-end p-2 bg-white dark:bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                      <Sparkles size={14} className="text-blue-500" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={msg.id || `msg-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 mb-6 w-full",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className="flex-none mt-1">
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-red-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={14} fill="white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <User size={14} />
                  </div>
                )}
              </div>

              <div className={cn(
                "max-w-[85%] text-base leading-7",
                msg.role === "user" ? "text-right" : "text-left"
              )}>
                {msg.role === "user" ? (
                  <div className="inline-block bg-[#f0f4f9] dark:bg-[#1e1f20] text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-tr-sm">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  <div className="text-gray-800 dark:text-gray-100 w-full">
                    <MathDisplay content={msg.content} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mb-6"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-red-500 flex items-center justify-center text-white p-1.5">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="flex items-center gap-1 h-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-[#131314] dark:via-[#131314] to-transparent z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <form
            onSubmit={handleFormSubmit}
            className="relative bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[2rem] flex items-end p-2 transition-all hover:bg-[#e9eef6] dark:hover:bg-[#28292a] focus-within:bg-white dark:focus-within:bg-[#28292a] focus-within:shadow-lg ring-1 ring-transparent focus-within:ring-gray-300 dark:focus-within:ring-gray-600"
          >
            <button type="button" className="p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-full transition-colors">
              <Plus size={20} />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 py-3 max-h-40 resize-none overflow-y-auto"
              style={{ minHeight: "48px" }}
            />

            <div className="flex items-center gap-1 pr-1 pb-1">
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-full transition-colors">
                <Mic size={20} />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-full transition-colors">
                <ImageIcon size={20} />
              </button>
              {input.trim() && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-500 dark:text-gray-500">
              Math Solver may display inaccurate info, so double-check its responses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
