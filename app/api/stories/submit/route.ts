import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // In a real app, we would save this to a DB or send an email
        console.log("New Story Submission:", body);

        return NextResponse.json({ success: true, message: "Story received" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
