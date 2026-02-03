
"use client";

import { useRef, useState, useEffect } from "react";
import { Send, User, Sparkles, Plus, Image as ImageIcon, Mic, Menu, MessageSquarePlus, History, Settings, HelpCircle, ChevronDown, Bot, SquareTerminal, LayoutGrid } from "lucide-react";
import MathDisplay from "@/components/MathDisplay";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { messages, input, setInput, isLoading, handleSubmit } =
    useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToBottom = () => {
    // Small delay to ensure DOM is updated (especially useful for ensuring height is correct)
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    <div className="fixed inset-0 h-full bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden selection:bg-blue-500/30 flex">

      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden glass-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="fixed md:relative z-30 h-full bg-[#1e1f20] flex flex-col overflow-hidden whitespace-nowrap shadow-2xl md:shadow-none border-r border-[#444746]/30 md:border-none"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="p-2 hover:bg-[#333537] rounded-full cursor-pointer transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <Menu size={20} className="text-[#e3e3e3]" />
              </div>
            </div>

            <div className="px-4">
              <button className="flex items-center gap-3 bg-[#1e1f20] hover:bg-[#333537] text-[#e3e3e3] px-4 py-3 rounded-[15px] transition-colors w-max">
                <Plus size={18} />
                <span className="text-sm font-medium">Percakapan baru</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              <div>
                <h3 className="text-xs font-medium text-[#c4c7c5] px-4 mb-2">Baru-baru ini</h3>
                <div className="space-y-1">
                  {["Kalkulus Integral", "Turunan Fungsi Aljabar", "Latihan Soal Matriks"].map((item, i) => (
                    <button key={i} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#333537] rounded-full transition-colors text-left truncate">
                      <History size={16} />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 mt-auto space-y-1 border-t border-[#444746]/30">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#e3e3e3] hover:bg-[#333537] rounded-full transition-colors text-left">
                <HelpCircle size={18} />
                <span>Bantuan</span>
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#e3e3e3] hover:bg-[#333537] rounded-full transition-colors text-left">
                <Settings size={18} />
                <span>Setelan</span>
              </button>
              <div className="pt-2 flex items-center gap-3 px-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  D
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">DimasMP3</span>
                  <span className="text-[10px] text-gray-400">Free Account</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="flex-none px-5 py-4 flex items-center justify-between bg-[#131314] z-10">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <div className="p-2 hover:bg-[#333537] rounded-full cursor-pointer transition-colors mr-2" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} className="text-[#e3e3e3]" />
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 hover:bg-[#333537] px-2 py-1 rounded-lg transition-colors"
              >
                <span className="text-[22px] font-medium text-[#e3e3e3] opacity-90 tracking-tight">MathAI</span>
                <ChevronDown size={16} className={`text-[#c4c7c5] mt-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#1e1f20] rounded-xl shadow-lg border border-[#444746]/50 overflow-hidden z-50 py-2"
                  >
                    <div className="px-4 py-2 hover:bg-[#333537] cursor-pointer flex items-center justify-between group">
                      <div>
                        <span className="text-sm font-medium text-[#e3e3e3] block">MathAI-1.0</span>
                        <span className="text-xs text-[#c4c7c5] description">Model Matematika Dasar</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 hover:bg-[#333537] rounded-full flex items-center justify-center cursor-pointer transition-colors">
              <LayoutGrid size={20} className="text-[#e3e3e3]" />
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
              D
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto w-full no-scrollbar min-h-0"
        >
          <div className="max-w-[850px] mx-auto px-5 pt-4 pb-32">
            {messages.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col mt-12"
              >
                <div className="mb-12 space-y-1">
                  <span className="text-[56px] font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] leading-tight block">
                    Hello, Dear!
                  </span>
                  <span className="text-[56px] font-medium text-[#444746] leading-tight block">
                    Pusing Matematika ya? Sini biar aku bantu.
                  </span>
                </div>
              </motion.div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || `msg-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mb-8 w-full group"
              >
                <div className="flex-none mt-1">
                  {msg.role === "assistant" ? (
                    <div className="mt-1">
                      <Sparkles size={24} className="text-blue-400 animate-pulse-slow" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      D
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#e3e3e3]">
                      {msg.role === "assistant" ? "MathAI" : "Anda"}
                    </span>
                  </div>

                  {msg.role === "assistant" ? (
                    <div className="text-[#e3e3e3] text-[16px] leading-[1.8] font-normal tracking-wide">
                      <MathDisplay content={msg.content} />
                    </div>
                  ) : (
                    <p className="text-[#e3e3e3] text-[16px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mb-8 w-full"
              >
                <div className="flex-none mt-1">
                  <Sparkles size={24} className="text-blue-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#e3e3e3] block mb-2">MathAI</span>
                  <div className="h-4 w-24 bg-[#333537] rounded animate-pulse" />
                </div>
              </motion.div>
            )}


          </div>
        </main>

        {/* Input Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div className={`mx-auto transition-all duration-300 ${isSidebarOpen ? 'md:pl-[280px]' : 'pl-0'}`}>
            <div className="max-w-[850px] mx-auto px-5 pb-5 bg-[#131314] pointer-events-auto">

              <div className="relative">
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-[#1e1f20] rounded-[32px] flex items-end relative border border-[#444746]/50 focus-within:bg-[#2a2b2d] focus-within:border-[#c4c7c5]/30 transition-all"
                >
                  <button
                    type="button"
                    className="p-4 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#333537] rounded-full ml-1 mb-1 transition-colors"
                  >
                    <Plus size={22} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Minta MathAI"
                    rows={1}
                    className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-[#e3e3e3] placeholder:text-[#c4c7c5] py-5 px-4 max-h-[200px] resize-none overflow-y-auto text-[16px] leading-relaxed min-w-0"
                    style={{ minHeight: "64px" }}
                  />

                  <div className="flex items-center gap-2 pr-5 pb-3 pl-2">
                    {!input.trim() && (
                      <>
                        <button type="button" className="p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#333537] rounded-full transition-colors">
                          <ImageIcon size={22} />
                        </button>
                        <button type="button" className="p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#333537] rounded-full transition-colors">
                          <Mic size={22} />
                        </button>
                      </>
                    )}

                    {input.trim() && (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="p-3 bg-[#e3e3e3] text-[#1e1f20] rounded-full hover:bg-white transition-all shadow-sm disabled:opacity-50"
                      >
                        <Send size={18} fill="#1e1f20" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <p className="text-[12px] text-[#c4c7c5] text-center mt-3 font-normal">
                MathAI dapat membuat kesalahan, jadi periksa kembali responsnya.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
