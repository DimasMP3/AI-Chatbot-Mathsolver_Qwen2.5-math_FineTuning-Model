
import { APP_CONFIG } from "@/constants";
import { SolveResponse } from "@/types";

export async function solveMathProblem(question: string): Promise<SolveResponse> {
    try {
        const response = await fetch(APP_CONFIG.API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            // You could theoretically parse error details here if the backend sends them
            throw new Error("Failed to get response form backend");
        }

        const data = await response.json();
        return data as SolveResponse;
    } catch (error) {
        console.error("Service Error:", error);
        return { error: "Failed to connect to the math service." };
    }
}
