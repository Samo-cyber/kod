export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log submission (placeholder)
    console.log("New Story Submission:", body);

    return NextResponse.json({
      success: true,
      message: "Story received",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
