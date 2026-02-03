
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { solveMathProblem } from "@/services/math-service";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        // Unique ID for user message
        const userMsgId = Date.now().toString();

        setInput("");
        setMessages((prev) => [
            ...prev,
            { id: userMsgId, role: "user", content: userMessage },
        ]);
        setIsLoading(true);

        try {
            const data = await solveMathProblem(userMessage);
            // Unique ID for assistant message (ensure it's different)
            const assistantMsgId = (Date.now() + 1).toString();

            if (data.answer) {
                setMessages((prev) => [
                    ...prev,
                    { id: assistantMsgId, role: "assistant", content: data.answer! },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: assistantMsgId,
                        role: "assistant",
                        content: data.error || "Sorry, I couldn't solve that problem.",
                    },
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMsgId = (Date.now() + 1).toString();
            setMessages((prev) => [
                ...prev,
                {
                    id: errorMsgId,
                    role: "assistant",
                    content: "An error occurred while fetching the answer. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        setInput,
        isLoading,

        handleSubmit,
    };
}
