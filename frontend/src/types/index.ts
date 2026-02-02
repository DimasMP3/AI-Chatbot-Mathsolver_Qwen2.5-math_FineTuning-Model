
export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export interface SolveResponse {
    answer?: string;
    error?: string;
}
