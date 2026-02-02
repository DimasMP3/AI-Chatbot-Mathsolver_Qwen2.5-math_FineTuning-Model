
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useChat } from "@/hooks/use-chat";

// This is a placeholder to demonstrate structure.
// In a larger app, you'd wrap the app with this provider to share chat state globally.

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const chatState = useChat();

    return (
        <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}
