
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        if (!question) {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            process.env.MODEL_ENDPOINT!,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from backend" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
